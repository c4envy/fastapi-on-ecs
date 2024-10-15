# Output the ECR repository URL for React
output "react_repository_url" {
  description = "The URL of the ECR repository for React."
  value       = aws_ecr_repository.react.repository_url
}

# Output the ECR repository URL for FastAPI
output "fastapi_repository_url" {
  description = "The URL of the ECR repository for FastAPI."
  value       = aws_ecr_repository.fastapi.repository_url
}
