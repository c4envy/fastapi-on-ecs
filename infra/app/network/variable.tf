# Application name
variable "app_name" {
  description = "Name of the app."
  type        = string
}

# AWS region for deploying the infrastructure
variable "region" {
  description = "AWS region to deploy the network to."
  type        = string
}

# CIDR block for the VPC
variable "vpc_cidr_block" {
  description = "CIDR block for the VPC."
  type        = string
  default     = "10.0.0.0/16"
}

# List of availability zones to use for subnets
variable "availability_zones" {
  description = "List of availability zones to create the subnets in."
  type        = list(string)
  default     = ["us-east-1a", "us-east-1f"]
}

# Public subnet CIDR blocks
variable "public_cidr_blocks" {
  description = "CIDR blocks for public subnets."
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

# Private subnet CIDR blocks
variable "private_cidr_blocks" {
  description = "CIDR blocks for private subnets."
  type        = list(string)
  default     = ["10.0.11.0/24", "10.0.12.0/24"]
}
