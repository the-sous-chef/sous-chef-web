# Sous Chef Web
Your personal kitchen assistant

## Contributing

### Requirements
- [volta](https://volta.sh/) (Used to manage our node environments)
- [Docker](https://docs.docker.com/get-docker/)


It is recommended to install the extensions recommended [here](https://github.com/the-sous-chef/kitchen-sink/blob/master/.vscode/extensions.json) if you are not working from within the monorepo (kitchen-sink).

### Setup
`npm install`

Copy `.env.template` as `.env`. A developer can help you obtain the correct secrets to fill out your env file.

### Running

`docker-compose up`

To force a rebuild, run `docker-compose up --build`

## Deployment

*TODO:* use https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecr_assets-readme.html

1. Ensure the proper environment variables are set (refer to `.env.template`)
2. Build the distribution: `npm run build`
   1. Pay careful attention to setting `NODE_ENV`
3. Build docker image: `docker build -t <aws-account-id>.dkr.ecr.us-east-1.amazonaws.com/sous-chef-web:latest --build-args .`
4. Upload image to ECR:
   ```
   aws ecr get-login-password --region region | docker login --username AWS --password-stdin <aws-account-id>.dkr.ecr.us-east-1.amazonaws.com
   docker push <aws-account-id>.dkr.ecr.us-east-1.amazonaws.com/sous-chef-web:latest
   ```
5. Deploy the new image to Fargate:
   ```
   cd cdk/apps/fargate
   # Ensure all the required environment variables are set (found in cdk/apps/fargate/bin/cdk/ts)
   cdk deploy --all 
   ```
