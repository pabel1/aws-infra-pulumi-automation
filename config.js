// config.js
exports.config = {
  project: {
    name: "aws-infra",
    environment: "dev",
  },
  vpc: {
    cidrBlock: "10.0.0.0/16",
    publicSubnet: "10.0.1.0/24",
    privateSubnet: "10.0.2.0/24",
    availabilityZone: "ap-south-1a",
  },
  tags: {
    environment: "dev",
    managedBy: "pulumi",
  },
  ec2: {
    instanceType: "t2.micro",
    ami: "ami-0f5ee92e2d63afc18", // Ubuntu 20.04 LTS in ap-south-1
    keyName: "your-key-pair-name", // Change this to your key pair name
  },
};
