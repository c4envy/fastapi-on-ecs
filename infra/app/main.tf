# AWS Provider Configuration
provider "aws" {
  region = var.region
  default_tags {
    tags = {
      app = var.app_name
    }
  }
}


# Networking Module
module "network" {
  source   = "./network"
  app_name = var.app_name
  region   = var.region

  # Optional: Pass custom CIDR blocks or AZs if needed
  vpc_cidr_block       = var.vpc_cidr_block
  availability_zones   = var.availability_zones
  public_cidr_blocks   = var.public_cidr_blocks
  private_cidr_blocks  = var.private_cidr_blocks
}

# ECS Module for FastAPI and React
module "ecs" {
  source             = "./ecs"
  app_name           = var.app_name
  region             = var.region
  react_image        = var.react_image  # React Docker image
  fastapi_image      = var.fastapi_image  # FastAPI Docker image
  vpc_id             = module.network.vpc_id
  public_subnet_ids  = module.network.public_subnets
  private_subnet_ids = module.network.private_subnets
  depends_on         = [module.network]
}

# Output the DNS name for the ALB
output "alb_dns_name" {
  description = "The DNS name of the Application Load Balancer."
  value       = module.ecs.alb_dns_name
}

# Output the API Gateway URL for FastAPI
output "fastapi_gateway_url" {
  description = "The URL for the FastAPI application served via API Gateway."
  value       = module.ecs.fastapi_gateway_url
}
