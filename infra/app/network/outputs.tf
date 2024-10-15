# Output the VPC ID
output "vpc_id" {
  description = "The ID of the VPC created."
  value       = aws_vpc.this.id
}

# Output the public subnet IDs
output "public_subnets" {
  description = "The IDs of the public subnets."
  value       = aws_subnet.public_subnets[*].id
}

# Output the private subnet IDs
output "private_subnets" {
  description = "The IDs of the private subnets."
  value       = aws_subnet.private_subnets[*].id
}

# Output the Internet Gateway ID
output "internet_gateway_id" {
  description = "The ID of the Internet Gateway (IGW) attached to the VPC."
  value       = aws_internet_gateway.this.id
}

# Output the NAT Gateway IDs
output "nat_gateway_ids" {
  description = "The IDs of the NAT Gateways created for private subnets."
  value       = aws_nat_gateway.this[*].id
}

# Output the Elastic IPs associated with NAT Gateways
output "nat_gateway_eips" {
  description = "The Elastic IPs associated with the NAT Gateways."
  value       = aws_eip.eips[*].public_ip
}

# Output the routing table IDs for public subnets
output "public_route_table_id" {
  description = "The ID of the public route table."
  value       = aws_route_table.public.id
}

# Output the routing table IDs for private subnets
output "private_route_table_ids" {
  description = "The IDs of the private route tables."
  value       = aws_route_table.private[*].id
}
