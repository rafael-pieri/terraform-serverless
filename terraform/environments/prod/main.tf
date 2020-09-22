module "hello" {
  source         = "../../infra/hello"
  environment    = "${var.environment}"
  read_capacity  = 10
  write_capacity = 10
}
