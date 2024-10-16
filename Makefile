include .env 

.EXPORT_ALL_VARIABLES:
APP_NAME=beastake-dev

TAG=latest
TF_VAR_app_name=${APP_NAME}
REGISTRY_NAME=${APP_NAME}
# TF_VAR_image=${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${REGISTRY_NAME}:${TAG}
TF_VAR_region=${AWS_REGION}
TF_VAR_react_image=${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${REGISTRY_NAME}-react:${TAG}
TF_VAR_fastapi_image=${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${REGISTRY_NAME}-fastapi:${TAG}



setup-ecr: 
	cd infra/setup && terraform init && terraform apply -auto-approve

deploy-container:
	cd app && sh deploy.sh

deploy-service:
	cd infra/app && terraform init && terraform apply -auto-approve

destroy-service:
	cd infra/app && terraform init && terraform destroy -auto-approve

refresh-service:
	cd infra/app && terraform init && terraform refresh 

deploy-react:
	cd frontend && sh deploy.sh

deploy-fastapi:
	cd backend && sh deploy.sh

deploy-all:
	cd frontend && sh deploy.sh
	cd backend && sh deploy.sh

refresh-service:
	cd infra/app && terraform init && terraform refresh 
