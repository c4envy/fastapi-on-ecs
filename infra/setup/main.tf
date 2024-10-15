# Create an ECR repository for React
resource "aws_ecr_repository" "react" {
  name = "${var.app_name}-react"
}

# Create an ECR repository for FastAPI
resource "aws_ecr_repository" "fastapi" {
  name = "${var.app_name}-fastapi"
}

# Optional: If you only need one ECR repository for both React and FastAPI, you can remove one of the above repositories and modify the logic in the ECS module accordingly.
