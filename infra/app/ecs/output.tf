# Output the ALB DNS name
output "alb_dns_name" {
  description = "The DNS name of the Application Load Balancer."
  value       = aws_lb.this.dns_name
}

# Output the API Gateway URL for FastAPI
output "fastapi_gateway_url" {
  description = "The URL for the FastAPI application via API Gateway."
  value       = aws_api_gateway_deployment.fastapi_deployment.invoke_url
}
