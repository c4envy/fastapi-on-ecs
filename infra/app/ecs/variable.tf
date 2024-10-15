# Application name
variable "app_name" {
  description = "Name of the application."
  type        = string
}

# AWS region
variable "region" {
  description = "AWS region where infrastructure will be deployed."
  type        = string
}

# Docker image for React app
variable "react_image" {
  description = "Docker image for the React application."
  type        = string
}

# Docker image for FastAPI app
variable "fastapi_image" {
  description = "Docker image for the FastAPI application."
  type        = string
}

# VPC ID to associate with ECS, ALB, and other networking resources
variable "vpc_id" {
  description = "The VPC ID where the ECS cluster and ALB will be deployed."
  type        = string
}

# Public subnet IDs (for ALB)
variable "public_subnet_ids" {
  description = "List of public subnet IDs where ALB will be deployed."
  type        = list(string)
}

# Private subnet IDs (for ECS services)
variable "private_subnet_ids" {
  description = "List of private subnet IDs where ECS services will be deployed."
  type        = list(string)
}

# Path part for the FastAPI resource in API Gateway
variable "fastapi_api_path" {
  description = "The API path for FastAPI in the API Gateway"
  type        = string
  default     = "api"  # You can adjust this as needed based on your API's routing
}

