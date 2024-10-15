# Application name
variable "app_name" {
  description = "The name of the application."
  type        = string
}

# AWS region where the infrastructure will be deployed
variable "region" {
  description = "The AWS region for deploying the infrastructure."
  type        = string
}

# Docker image for React application
variable "react_image" {
  description = "The Docker image for the React application. Should be in repository-url/image:tag format."
  type        = string
}

# Docker image for FastAPI application
variable "fastapi_image" {
  description = "The Docker image for the FastAPI application. Should be in repository-url/image:tag format."
  type        = string
}

# CIDR block for the VPC
variable "vpc_cidr_block" {
  description = "The CIDR block for the VPC."
  type        = string
  default     = "10.0.0.0/16"
}

# List of availability zones
variable "availability_zones" {
  description = "A list of availability zones to create subnets in."
  type        = list(string)
  default     = ["us-east-1a", "us-east-1f"]
}

# CIDR blocks for public subnets
variable "public_cidr_blocks" {
  description = "The CIDR blocks for public subnets."
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

# CIDR blocks for private subnets
variable "private_cidr_blocks" {
  description = "The CIDR blocks for private subnets."
  type        = list(string)
  default     = ["10.0.11.0/24", "10.0.12.0/24"]
}
