import json
import os
from typing import List
from urllib import parse
import boto3
from fastapi import HTTPException, UploadFile, File
import httpx
from app.core.config import settings
import logging
from botocore.exceptions import ClientError, NoCredentialsError, PartialCredentialsError
import uuid
from fastapi.responses import JSONResponse
from app.models.user_model import User
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import mimetypes


# Create an S3 session
session = boto3.Session(
    aws_access_key_id=settings.AWS_SERVER_PUBLIC_KEY,
    aws_secret_access_key=settings.AWS_SERVER_SECRET_KEY,
    region_name=settings.AWS_REGION
)

# Boto3 SES client
# ses_client = boto3.client('ses', region_name='us-east-1')
ses_client = session.client('ses', region_name='us-east-1')

# Initialize AWS clients
dynamodb = boto3.resource('dynamodb', region_name='us-east-1')  # Specify your region

# DynamoDB table name and S3 bucket name
TABLE_NAME = 'filestatus'
BUCKET_NAME = 'orindocuments'

# DynamoDB Table
table = dynamodb.Table(TABLE_NAME)

class S3UploadError(Exception):
    pass

async def upload_image_to_s3(file_path, bucket_name: str, s3_dir: str):
    # Initialize S3 client
    s3 = session.client('s3')

    # Upload file to S3
    try:
        # Upload the file to S3
        response = s3.upload_file(file_path, bucket_name, s3_dir)

        # Construct the object URL
        dir = parse.quote(s3_dir)
        object_url = f"https://{bucket_name}.s3.amazonaws.com/{dir}"

        logging.info(f"File uploaded successfully to S3 directory: {s3_dir}")
        return object_url
    except ClientError as e:
        logging.error(f"Error uploading file to S3: {e}")
        raise S3UploadError(f"Error uploading file to S3: {e}")
    


import mimetypes

async def upload_file_to_s3(upload_file: UploadFile, bucket_name: str, s3_dir: str):
    # Initialize S3 client
    s3 = session.client('s3')

    # Determine MIME type
    content_type, _ = mimetypes.guess_type(upload_file.filename)
    if content_type is None:
        content_type = 'application/octet-stream'  # Default to binary data if type can't be guessed

    # Upload file to S3
    try:
        # Upload the file to S3
        s3_key = f"{s3_dir}/{upload_file.filename}"
        s3.upload_fileobj(
            upload_file.file, 
            bucket_name, 
            s3_key,
            ExtraArgs={
                'ContentType': content_type
            }
        )

        # Construct the object URL
        dir = parse.quote(s3_key)
        object_url = f"https://{bucket_name}.s3.amazonaws.com/{dir}"

        logging.info(f"File uploaded successfully to S3 directory: {s3_dir}")
        return object_url
    except ClientError as e:
        logging.error(f"Error uploading file to S3: {e}")
        raise S3UploadError(f"Error uploading file to S3: {e}")
    

    
async def upload_files_to_s3(files: List[UploadFile], bucket_name: str, s3_dir: str):
    # Initialize S3 client
    s3 = session.client('s3')

    uploaded_urls = []

    try:
        for upload_file in files:
            # Upload file to S3
            s3_key = f"{s3_dir}/{upload_file.filename}"
            s3.upload_fileobj(upload_file.file, bucket_name, s3_key)

            # Construct the object URL
            dir = parse.quote(s3_key)
            object_url = f"https://{bucket_name}.s3.amazonaws.com/{dir}"
            uploaded_urls.append(object_url)

            logging.info(f"File uploaded successfully to S3 directory: {s3_dir}")

        return uploaded_urls

    except ClientError as e:
        logging.error(f"Error uploading file to S3: {e}")
        raise S3UploadError(f"Error uploading file to S3: {e}")
    

def delete_file_from_s3(bucket_name: str, s3_key: str):
    # Initialize S3 client
    s3 = session.client('s3')

    try:
        # Delete object from S3 bucket
        response = s3.delete_object(Bucket=bucket_name, Key=s3_key)
        logging.info(f"File deleted successfully from S3: {s3_key}")
        return response
    except ClientError as e:
        logging.error(f"Error deleting file from S3: {e}")
        # raise S3DeleteError(f"Error deleting file from S3: {e}")
    


def save_file_on_disk(url, file_path=None):
    try:
        # If file_path is not provided, use default file path within 'downloads' folder
        if file_path is None:
            current_directory = os.getcwd()
            download_directory = os.path.join(current_directory, 'downloads')
            os.makedirs(download_directory, exist_ok=True)
            file_name = os.path.basename(url)
            # Check if the file_name already has an extension
            if not os.path.splitext(file_name)[1]:
                # If it doesn't have an extension, add .png extension
                file_name += '.png'
            file_path = os.path.join(download_directory, file_name)
        else:
            file_name = os.path.basename(file_path)

        # Download the file from the URL
        response = httpx.get(url)
        response.raise_for_status()

        # Save the file to the local filesystem
        with open(file_path, 'wb') as file:
            file.write(response.content)

        logging.info(f"File saved successfully to: {file_path}")

        return file_name, file_path
    except httpx.HTTPStatusError as e:
        logging.error(f"HTTP error ({e.response.status_code}): {e}")
        raise Exception(f"HTTP error ({e.response.status_code}): {e}")
    except Exception as e:
        logging.error(f"Error saving file: {e}")
        raise Exception(f"Error saving file: {e}")
    
    
async def upload_files(files: List[UploadFile] = File(...)):
    s3 = session.client('s3')
    try:
        responses = []
        for upload_file in files:
            # Generate a unique file ID
            file_id = str(uuid.uuid4())
            s3_key = f"{file_id}/{upload_file.filename}"

            # Generate presigned URL
            presigned_url = s3.generate_presigned_url(
                'put_object',
                Params={'Bucket': BUCKET_NAME, 'Key': s3_key},
                ExpiresIn=3600  # URL expiration time in seconds
            )

            # Upload file to the presigned URL
            file_contents = upload_file.file.read()
            response = httpx.put(presigned_url, data=file_contents)

            if response.status_code != 200:
                raise HTTPException(status_code=500, detail=f"Failed to upload file {upload_file.filename}")

            # Write entry in DynamoDB
            table.put_item(Item={'FileID': file_id, 'FileName': upload_file.filename, 'Status': 'PROCESSING'})

            responses.append({"file_id": file_id, "filename": upload_file.filename, "status": "uploaded"})

            # Trigger post-processing Lambda function (if needed)
            # lambda_client.invoke(
            #     FunctionName='YourLambdaFunctionName',
            #     InvocationType='Event',  # Asynchronous invocation
            #     Payload=json.dumps({'file_id': file_id}).encode('utf-8')
            # )

        # return JSONResponse(content={"files": responses})
        return responses

    except (NoCredentialsError, PartialCredentialsError) as e:
        raise HTTPException(status_code=500, detail=f"AWS credentials error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
    
async def send_welcome_email(user: User):
    try:
        # Send the email using SES
        response = ses_client.send_templated_email(
            Source='noreply@beatstake.com',  # Verified email in SES
            Destination={
                'ToAddresses': [user.email]
            },
            Template='WelcomeTemplate',  # The name of the SES template
            TemplateData='{ "name":"%s" }' % user.username  # Template data in JSON format
        )
        return {"message": "Email sent successfully!", "response": response}
    except ClientError as e:
        raise HTTPException(status_code=500, detail=f"Error sending email: {e.response['Error']['Message']}")
    
    
async def send_thank_you_email(user: User, total_shares: int):
    template_data = {
        "user_name": user.username,
        "total_shares": total_shares
    }
    try:
        # Send the email using SES
        response = ses_client.send_templated_email(
            Source='noreply@beatstake.com',  # Verified email in SES
            Destination={
                'ToAddresses': [user.email]
            },
            Template='ThankYouTemplate',  # The name of the SES template
             TemplateData=json.dumps(template_data)  # Convert dictionary to JSON string
        )
        return {"message": "Email sent successfully!", "response": response}
    except ClientError as e:
        raise HTTPException(status_code=500, detail=f"Error sending email: {e.response['Error']['Message']}")
    
# async def send_otp_email(user: User, otp_code: int):
#     template_data = {
#         "name": user.firstname,
#         "otp_code": otp_code
#     }
#     try:
#         # Send the email using SES
#         response = ses_client.send_templated_email(
#             Source='noreply@beatstake.com',  # Verified email in SES
#             Destination={
#                 'ToAddresses': [user.email]
#             },
#             Template='TwoFactorAuthenticationTemplate',  # The name of the SES template
#                 TemplateData=json.dumps(template_data)  # Convert dictionary to JSON string
#         )
#         return {"message": "Email sent successfully!", "response": response}
#     except ClientError as e:
#         raise HTTPException(status_code=500, detail=f"Error sending email: {e.response['Error']['Message']}")
        
####################################################################################################

async def send_otp_email(user: User, otp_code: int):
    # Create the email content
    subject = "Your OTP for BeatStake Authentication"
    html_content = f"""
    <html>
        <body>
            <h2>Hello {user.firstname},</h2>
            <p>Your One-Time Password (OTP) for BeatStake authentication is:</p>
            <h1 style="color: #4CAF50; font-size: 40px;">{otp_code}</h1>
            <p>This OTP will expire in 5 minutes.</p>
            <p>If you didn't request this OTP, please ignore this email.</p>
            <p>Best regards,<br>The BeatStake Team</p>
        </body>
    </html>
    """
    text_content = f"""
    Hello {user.firstname},

    Your One-Time Password (OTP) for BeatStake authentication is: {otp_code}

    This OTP will expire in 5 minutes.

    If you didn't request this OTP, please ignore this email.

    Best regards,
    The BeatStake Team
    """

    # Create MIME message
    message = MIMEMultipart('alternative')
    message['Subject'] = subject
    message['From'] = 'noreply@beatstake.com'
    message['To'] = user.email

    # Attach both plain text and HTML versions
    message.attach(MIMEText(text_content, 'plain'))
    message.attach(MIMEText(html_content, 'html'))

    try:
        # Send the email using SES
        response = ses_client.send_raw_email(
            Source='noreply@beatstake.com',
            Destinations=[user.email],
            RawMessage={'Data': message.as_string()}
        )
        return {"message": "Email sent successfully!", "response": response}
    except ClientError as e:
        raise HTTPException(status_code=500, detail=f"Error sending email: {e.response['Error']['Message']}")
    

async def thank_you_email(user: User, total_shares: int):
    # Create the email content
    subject = "Thank You for Sharing!"
    html_content = f"""
    <html>
        <body>
            <h2>Thank you, {user.username}!</h2>
            <p>We appreciate your participation. You've shared a total of {total_shares} times.</p>
            <p>Keep up the great work!</p>
            <br>
            <p>Best regards,</p>
            <p>The BeatStake Team</p>
        </body>
    </html>
    """
    text_content = f"""
    Thank you, {user.username}!

    We appreciate your participation. You've shared a total of {total_shares} times.
    Keep up the great work!

    Best regards,
    The BeatStake Team
    """

    # Create message container
    msg = MIMEMultipart('alternative')
    msg['Subject'] = subject
    msg['From'] = 'noreply@beatstake.com'
    msg['To'] = user.email

    # Attach parts
    part1 = MIMEText(text_content, 'plain')
    part2 = MIMEText(html_content, 'html')
    msg.attach(part1)
    msg.attach(part2)

    try:
        # Create SES client
        ses_client = boto3.client('ses')

        # Send the email
        response = ses_client.send_raw_email(
            Source='noreply@beatstake.com',
            Destinations=[user.email],
            RawMessage={'Data': msg.as_string()}
        )
        return {"message": "Email sent successfully!", "response": response}
    except ClientError as e:
        raise HTTPException(status_code=500, detail=f"Error sending email: {e.response['Error']['Message']}")
    
    
async def send_password_reset_otp_email(user: User, otp_code: int):
    # Create the email content
    subject = "Your OTP for BeatStake Password Reset"
    html_content = f"""
    <html>
        <body>
            <h2>Hello {user.firstname},</h2>
            <p>Your One-Time Password (OTP) for resetting your BeatStake password is:</p>
            <h1 style="color: #4CAF50; font-size: 40px;">{otp_code}</h1>
            <p>This OTP will expire in 5 minutes.</p>
            <p>If you didn't request this OTP, please ignore this email.</p>
            <p>Best regards,<br>The BeatStake Team</p>
        </body>
    </html>
    """
    text_content = f"""
    Hello {user.firstname},

    Your One-Time Password (OTP) for resetting your BeatStake password is: {otp_code}

    This OTP will expire in 5 minutes.

    If you didn't request this OTP, please ignore this email.

    Best regards,
    The BeatStake Team
    """

    # Create MIME message
    message = MIMEMultipart('alternative')
    message['Subject'] = subject
    message['From'] = 'noreply@beatstake.com'
    message['To'] = user.email

    # Attach both plain text and HTML versions
    message.attach(MIMEText(text_content, 'plain'))
    message.attach(MIMEText(html_content, 'html'))

    try:
        # Send the email using SES
        response = ses_client.send_raw_email(
            Source='noreply@beatstake.com',
            Destinations=[user.email],
            RawMessage={'Data': message.as_string()}
        )
        return {"message": "Password reset OTP email sent successfully!", "response": response}
    except ClientError as e:
        raise HTTPException(status_code=500, detail=f"Error sending email: {e.response['Error']['Message']}")
