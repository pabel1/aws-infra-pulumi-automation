// index.js
const pulumi = require("@pulumi/pulumi");
const aws = require("@pulumi/aws");
const { config } = require("./config");

// Create VPC
const vpc = new aws.ec2.Vpc("main-vpc", {
  cidrBlock: config.vpc.cidrBlock,
  enableDnsHostnames: true,
  enableDnsSupport: true,
  tags: {
    ...config.tags,
    Name: "main-vpc",
  },
});

// Create Internet Gateway
const internetGateway = new aws.ec2.InternetGateway("main-igw", {
  vpcId: vpc.id,
  tags: {
    ...config.tags,
    Name: "main-igw",
  },
});

// Create Public Subnet
const publicSubnet = new aws.ec2.Subnet("public-subnet", {
  vpcId: vpc.id,
  cidrBlock: config.vpc.publicSubnet,
  availabilityZone: config.vpc.availabilityZone,
  mapPublicIpOnLaunch: true,
  tags: {
    ...config.tags,
    Name: "public-subnet",
  },
});

// Create Private Subnet
const privateSubnet = new aws.ec2.Subnet("private-subnet", {
  vpcId: vpc.id,
  cidrBlock: config.vpc.privateSubnet,
  availabilityZone: config.vpc.availabilityZone,
  tags: {
    ...config.tags,
    Name: "private-subnet",
  },
});

// Create Public Route Table
const publicRouteTable = new aws.ec2.RouteTable("public-rt", {
  vpcId: vpc.id,
  routes: [
    {
      cidrBlock: "0.0.0.0/0",
      gatewayId: internetGateway.id,
    },
  ],
  tags: {
    ...config.tags,
    Name: "public-rt",
  },
});

// Associate Public Subnet with Route Table
const publicRouteTableAssociation = new aws.ec2.RouteTableAssociation(
  "public-rt-association",
  {
    subnetId: publicSubnet.id,
    routeTableId: publicRouteTable.id,
  }
);

// Create NAT Gateway EIP
const natEip = new aws.ec2.Eip("nat-eip", {
  vpc: true,
  tags: {
    ...config.tags,
    Name: "nat-eip",
  },
});

// Create NAT Gateway
const natGateway = new aws.ec2.NatGateway("nat-gateway", {
  allocationId: natEip.id,
  subnetId: publicSubnet.id,
  tags: {
    ...config.tags,
    Name: "nat-gateway",
  },
});

// Create Private Route Table
const privateRouteTable = new aws.ec2.RouteTable("private-rt", {
  vpcId: vpc.id,
  routes: [
    {
      cidrBlock: "0.0.0.0/0",
      natGatewayId: natGateway.id,
    },
  ],
  tags: {
    ...config.tags,
    Name: "private-rt",
  },
});

// Associate Private Subnet with Route Table
const privateRouteTableAssociation = new aws.ec2.RouteTableAssociation(
  "private-rt-association",
  {
    subnetId: privateSubnet.id,
    routeTableId: privateRouteTable.id,
  }
);

// Create Security Group for Bastion Host
const bastionSecurityGroup = new aws.ec2.SecurityGroup("bastion-sg", {
  vpcId: vpc.id,
  description: "Security group for bastion host",
  ingress: [
    {
      protocol: "tcp",
      fromPort: 22,
      toPort: 22,
      cidrBlocks: ["0.0.0.0/0"], // Consider restricting to your IP
    },
  ],
  egress: [
    {
      protocol: "-1",
      fromPort: 0,
      toPort: 0,
      cidrBlocks: ["0.0.0.0/0"],
    },
  ],
  tags: {
    ...config.tags,
    Name: "bastion-sg",
  },
});

// Create Bastion Host EC2 Instance
const bastionHost = new aws.ec2.Instance("bastion-host", {
  instanceType: config.ec2.instanceType,
  ami: config.ec2.ami,
  subnetId: publicSubnet.id,
  vpcSecurityGroupIds: [bastionSecurityGroup.id],
  keyName: config.ec2.keyName,
  tags: {
    ...config.tags,
    Name: "bastion-host",
  },
});

// Export important values
exports.vpcId = vpc.id;
exports.publicSubnetId = publicSubnet.id;
exports.privateSubnetId = privateSubnet.id;
exports.bastionPublicIp = bastionHost.publicIp;
