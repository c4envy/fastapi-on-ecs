# ALB for React Frontend and FastAPI
resource "aws_security_group" "alb" {
  name   = "${var.app_name}-alb-sg"
  vpc_id = var.vpc_id
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_lb" "this" {
  name               = "${var.app_name}-alb"
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = var.public_subnet_ids
}

resource "aws_lb_target_group" "fastapi" {
  name        = "${var.app_name}-fastapi-lb-tg"
  vpc_id      = var.vpc_id
  port        = 8080
  protocol    = "HTTP"
  target_type = "ip"
  health_check {
    port                = 8080
    path                = "/docs"  # FastAPI's default Swagger UI path
    interval            = 30
    protocol            = "HTTP"
    timeout             = 5
    unhealthy_threshold = 2
    matcher             = 200
  }
}

resource "aws_lb_target_group" "react" {
  name        = "${var.app_name}-react-lb-tg"
  vpc_id      = var.vpc_id
  port        = 80
  protocol    = "HTTP"
  target_type = "ip"
  health_check {
    port                = 80
    path                = "/"
    interval            = 30
    protocol            = "HTTP"
    timeout             = 5
    unhealthy_threshold = 2
    matcher             = 200
  }
}

resource "aws_lb_listener" "http_react" {
  port              = "80"
  protocol          = "HTTP"
  load_balancer_arn = aws_lb.this.arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.react.arn
  }
}

resource "aws_lb_listener" "http_fastapi" {
  port              = "8080"
  protocol          = "HTTP"
  load_balancer_arn = aws_lb.this.arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.fastapi.arn
  }
}

# CloudWatch Log Groups
resource "aws_cloudwatch_log_group" "fastapi" {
  name              = "/ecs/${var.app_name}-fastapi"
  retention_in_days = 30
}

resource "aws_cloudwatch_log_group" "react" {
  name              = "/ecs/${var.app_name}-react"
  retention_in_days = 30
}

# React ECS Fargate Service behind ALB
resource "aws_ecs_task_definition" "react" {
  family                   = "${var.app_name}-react-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn
  container_definitions    = jsonencode([{
    name      = "react"
    image     = var.react_image
    portMappings = [{
      containerPort = 80
      protocol      = "tcp"
    }]
    logConfiguration = {
      logDriver = "awslogs"
      options = {
        awslogs-group         = aws_cloudwatch_log_group.react.name
        awslogs-region        = var.region
        awslogs-stream-prefix = "ecs"
      }
    }
  }])
}

resource "aws_ecs_service" "react" {
  name            = "${var.app_name}-react-service"
  cluster         = aws_ecs_cluster.this.name
  launch_type     = "FARGATE"
  desired_count   = 1
  task_definition = aws_ecs_task_definition.react.arn
  network_configuration {
    subnets         = var.private_subnet_ids
    security_groups = [aws_security_group.ecs.id]
  }
  load_balancer {
    target_group_arn = aws_lb_target_group.react.arn
    container_name   = "react"
    container_port   = 80
  }
}

# FastAPI ECS Fargate Service behind ALB
resource "aws_ecs_task_definition" "fastapi" {
  family                   = "${var.app_name}-fastapi-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn
  container_definitions    = jsonencode([{
    name      = "fastapi"
    image     = var.fastapi_image
    portMappings = [{
      containerPort = 8080
      protocol      = "tcp"
    }]
    logConfiguration = {
      logDriver = "awslogs"
      options = {
        awslogs-group         = aws_cloudwatch_log_group.fastapi.name
        awslogs-region        = var.region
        awslogs-stream-prefix = "ecs"
      }
    }
  }])
}

resource "aws_ecs_service" "fastapi" {
  name            = "${var.app_name}-fastapi-service"
  cluster         = aws_ecs_cluster.this.name
  launch_type     = "FARGATE"
  desired_count   = 1
  task_definition = aws_ecs_task_definition.fastapi.arn
  network_configuration {
    subnets         = var.private_subnet_ids
    security_groups = [aws_security_group.ecs.id]
  }
  load_balancer {
    target_group_arn = aws_lb_target_group.fastapi.arn
    container_name   = "fastapi"
    container_port   = 8080
  }
}

# IAM Role for ECS Task Execution
resource "aws_iam_role" "ecs_execution_role" {
  name = "${var.app_name}-ecs-execution-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_execution_role_policy" {
  role       = aws_iam_role.ecs_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role_policy_attachment" "ecs_execution_role_cloudwatch_policy" {
  role       = aws_iam_role.ecs_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchLogsFullAccess"
}

# API Gateway for FastAPI
resource "aws_api_gateway_rest_api" "fastapi_gateway" {
  name = "${var.app_name}-fastapi-api"
}

resource "aws_api_gateway_resource" "fastapi_proxy" {
  rest_api_id = aws_api_gateway_rest_api.fastapi_gateway.id
  parent_id   = aws_api_gateway_rest_api.fastapi_gateway.root_resource_id
  path_part   = "{proxy+}"
}

resource "aws_api_gateway_method" "fastapi_proxy" {
  rest_api_id   = aws_api_gateway_rest_api.fastapi_gateway.id
  resource_id   = aws_api_gateway_resource.fastapi_proxy.id
  http_method   = "ANY"
  authorization = "NONE"

  request_parameters = {
    "method.request.path.proxy" = true
  }
}

resource "aws_api_gateway_integration" "fastapi_proxy" {
  rest_api_id = aws_api_gateway_rest_api.fastapi_gateway.id
  resource_id = aws_api_gateway_resource.fastapi_proxy.id
  http_method = aws_api_gateway_method.fastapi_proxy.http_method

  integration_http_method = "ANY"
  type                    = "HTTP_PROXY"
  uri                     = "http://${aws_lb.this.dns_name}:8080/{proxy}"

  request_parameters = {
    "integration.request.path.proxy" = "method.request.path.proxy"
  }
}

resource "aws_api_gateway_deployment" "fastapi_deployment" {
  rest_api_id = aws_api_gateway_rest_api.fastapi_gateway.id
  stage_name  = "prod"
  
  triggers = {
    redeployment = sha1(jsonencode([
      aws_api_gateway_resource.fastapi_proxy.id,
      aws_api_gateway_method.fastapi_proxy.id,
      aws_api_gateway_integration.fastapi_proxy.id,
      timestamp()
    ]))
  }

  lifecycle {
    create_before_destroy = true
  }

  depends_on = [
    aws_api_gateway_method.fastapi_proxy,
    aws_api_gateway_integration.fastapi_proxy
  ]
}

# ECS Cluster Definition
resource "aws_ecs_cluster" "this" {
  name = "${var.app_name}-ecs-cluster"
}

# Security group for ECS tasks
resource "aws_security_group" "ecs" {
  name   = "${var.app_name}-ecs-sg"
  vpc_id = var.vpc_id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}