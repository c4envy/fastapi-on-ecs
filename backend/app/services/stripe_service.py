from http.client import HTTPException
from pydantic import BaseModel
import stripe
import logging
from app.core.config import settings
from app.schemas.stripe_schema import PaymentIntentRequest, PaymentMethod, PaymentMethodData


logger = logging.getLogger('stripe_service_class')
logger.setLevel(logging.INFO)

stripe.api_key = settings.STRIPE_SECRET_KEY


class StripeService:
    
    # @staticmethod
    # async def create_payment_intent(data: PaymentIntentRequest):
    #     try:
    #         # Create a PaymentMethod
    #         payment_method = stripe.PaymentMethod.create(
    #         type="card",
    #         card=data.payment_method_data["card"],
    #         billing_details={"name": data.customer_name},
    #         )
            
    #         # Create a PaymentIntent
    #         intent = stripe.PaymentIntent.create(
    #             amount=data.amount,
    #             currency='usd',
    #             payment_method=payment_method['id'],
    #             customer=data.customer_name,
    #             off_session=True,
    #             confirm=True,
    #         )
            
    #         return {"status": intent.status}
    #     except stripe.error.CardError as e:
    #         return {"error": str(e.user_message)}
    #     except Exception as e:
    #         raise HTTPException(status_code=500, detail=str(e))
        

    # @staticmethod
    # async def create_setup_intent(customer_id: str):
    #     try:
    #         # Create a SetupIntent
    #         intent = stripe.SetupIntent.create(
    #             customer=customer_id,
    #         )

    #         return intent
    #     except stripe.error.StripeError as e:
    #         logger.error(f"Error creating SetupIntent: {e}")
    #         return None

    # @staticmethod
    # async def create_payment_method(card: dict):
    #     try:
    #         # Create a PaymentMethod
    #         method = stripe.PaymentMethod.create(
    #             type="card",
    #             card=card,
    #         )

    #         return method
    #     except stripe.error.StripeError as e:
    #         logger.error(f"Error creating PaymentMethod: {e}")
    #         return None

    @staticmethod
    async def create_customer(email: str, payment_method: str):
        try:
            # Create a Customer
            customer = stripe.Customer.create(
                email=email,
                payment_method=payment_method,
                invoice_settings={
                    'default_payment_method': payment_method,
                },
            )

            return customer
        except stripe.error.StripeError as e:
            logger.error(f"Error creating Customer: {e}")
            return None

    # @staticmethod
    # async def create_subscription(customer_id: str, price_id: str):
    #     try:
    #         # Create a Subscription
    #         subscription = stripe.Subscription.create(
    #             customer=customer_id,
    #             items=[
    #                 {
    #                     'price': price_id,
    #                 },
    #             ],
    #         )

    #         return subscription
    #     except stripe.error.StripeError as e:
    #         logger.error(f"Error creating Subscription: {e}")
    #         return None

    # @staticmethod
    # async def cancel_subscription(subscription_id: str):
    #     try:
    #         # Cancel the Subscription
    #         canceled_subscription = stripe.Subscription.delete(subscription_id)

    #         return canceled_subscription
    #     except stripe.error.StripeError as e:
    #         logger.error(f"Error canceling Subscription: {e}")
    #         return None
    
        
        
    @staticmethod
    async def create_price(product_id: str, unit_amount: int, currency: str):
        try:
            # Create a Price
            price = stripe.Price.create(
                product=product_id,
                unit_amount=unit_amount,
                currency=currency,
            )

            return price
        except stripe.error.StripeError as e:
            logger.error(f"Error creating Price: {e}")
            return None 
        
    @staticmethod
    async def create_product(name: str):
        try:
            # Create a Product
            product = stripe.Product.create(
                name=name,
            )

            return product
        except stripe.error.StripeError as e:
            logger.error(f"Error creating Product: {e}")
            return None
        
    @staticmethod
    async def create_tax_rate(display_name: str, percentage: float):
        try:
            # Create a TaxRate
            tax_rate = stripe.TaxRate.create(
                display_name=display_name,
                percentage=percentage,
                inclusive=False,
            )

            return tax_rate
        except stripe.error.StripeError as e:
            logger.error(f"Error creating TaxRate: {e}")
            return None
        
   
        
    @staticmethod
    async def create_customer(email: str, payment_method: str):
        try:
            # Create a Customer
            customer = stripe.Customer.create(
                email=email,
                payment_method=payment_method,
                invoice_settings={
                    'default_payment_method': payment_method,
                },
            )

            return customer
        except stripe.error.StripeError as e:
            logger.error(f"Error creating Customer: {e}")
            return None
        
   
        
    # @staticmethod
    # async def create_payment_intent_(amount: int, currency: str, payment_method_id: str):
    #     try:
    #         # Create a payment intent with the specified amount, currency, and payment method
    #         intent = stripe.PaymentIntent.create(
    #             amount=amount,
    #             currency=currency,
    #             payment_method=payment_method_id,
           
           
    #         )
    #         return {"client_secret": intent['client_secret']}
    #     except Exception as e:
    #         # raise HTTPException(status_code=400, detail=str(e))
    #         logger.error(f"Error ceating PaymentIntent: {e}")
    #         return f'Error creating PaymentIntent: {e}'

    @staticmethod
    async def create_payment_intent_(amount: int, currency: str, payment_method_id: str):
        try:
            # Create a payment intent with the specified amount, currency, and payment method
            intent = stripe.PaymentIntent.create(
                amount=amount,
                currency=currency,
                payment_method=payment_method_id,
                # confirmation_method='manual',  # This specifies that you want to confirm the intent manually
                automatic_payment_methods={
                    'enabled': True,
                    'allow_redirects': 'never'
                },
            )
            print(f"The unconfirmed intent object is: {intent}")
            # Confirm the PaymentIntent
            confirmed_intent = stripe.PaymentIntent.confirm(
                intent['id'],
                payment_method=payment_method_id,
            )
            print(f"The confirmed intent object is : {confirmed_intent}")
            # # Check if the PaymentIntent succeeded
            if confirmed_intent['status'] == 'succeeded':
            #     # Get the charge ID from the PaymentIntent
            #     # charge_id = confirmed_intent['charges']['data'][0]['id']
                charge_id = confirmed_intent['latest_charge']
                print(f"The latest charge_id is: {confirmed_intent['latest_charge']}")
            #     # Send the receipt
            #     stripe.Charge.send_receipt(charge_id)
            #     logger.info(f"Receipt sent for charge ID: {charge_id}")

            return {"client_secret": confirmed_intent['client_secret']}
        except Exception as e:
            logger.error(f"Error creating PaymentIntent: {e}")
            raise e

        
    @staticmethod
    async def create_payment_intent(payment_request: PaymentIntentRequest):
        try:
            # Create a payment intent with the specified amount, currency, and payment method
            intent = stripe.PaymentIntent.create(
                amount=payment_request.amount,
                currency=payment_request.currency,
                payment_method=payment_request.payment_method_data.id,
                confirm=True
            )
            return {"client_secret": intent['client_secret']}
        except Exception as e:
            # raise HTTPException(status_code=400, detail=str(e))
            logger.error(f"Error ceating PaymentIntent: {e}")
            return f'Error creating PaymentIntent: {e}'
        
    @staticmethod
    async def get_all_payment_methods():
        # try:
        #     # Get all PaymentMethods
        #     payment_methods = stripe.PaymentMethod.list()
        #     return payment_methods
        # except stripe.error.StripeError as e:
        #     logger.error(f"Error getting PaymentMethods: {e}")
        #     return None

        try:
            # Create a PaymentIntent to check available payment methods
            payment_intent = stripe.PaymentIntent.create(
                amount=100,  # small test amount in cents
                currency='usd'
            )
            
            return payment_intent['payment_method_types']
        except stripe.error.StripeError as e:
            logger.error(f"Error getting PaymentMethods: {e}")
            return None
            
       
            
            
        
        
        