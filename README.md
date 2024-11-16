# Project Structure:

aws-infra/

# ├── package.json

# ├── package-lock.json

# ├── Pulumi.yaml

# ├── Pulumi.dev.yaml

# ├── index.js

# ├── config.js

# └── README.md

```bash

pulumi new aws-javascript
npm install @pulumi/aws @pulumi/pulumi
```

# Project run step by step guide:

## Project setup:

```bash


mkdir aws-infra
cd aws-infra
pulumi new aws-javascript

```

### Dependencies install:

```bash
npm install

```

# Configuration update:

## config.js file e apnar AWS region, AMI ID, key pair name update korun

## Availability zone apnar region onujayi modify korun

## Infrastructure deploy:

```bash

pulumi up

```

# Infrastructure destroy (when needed):

```bash
pulumi destroy

```
