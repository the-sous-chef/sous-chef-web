#!/bin/bash

export AWS_ACCESS_KEY_ID=test
export AWS_ACCOUNT_ID=000000000000
export AWS_DEFAULT_REGION=us-east-1
export AWS_SECRET_ACCESS_KEY=test
export AWS_REGION=us-east-1
export DOMAIN_NAME=thesouschef.local
export CDK_NEW_BOOTSTRAP=1
export AWS_CERTIFICATE_ARN=$(aws --endpoint-url=http://localhost:4566 acm list-certificates --query 'CertificateSummaryList[].[CertificateArn,DomainName]' --output text | grep $DOMAIN_NAME | cut -f1)
export HOSTED_ZONE_ID=$(aws --endpoint-url=http://localhost:4566 route53 list-hosted-zones-by-name --dns-name $DOMAIN_NAME --query 'HostedZones[].Id' --output text)
export VPC_ID=$(aws --endpoint-url=http://localhost:4566 ec2 describe-vpcs --filters Name=tag:Name,Values=thesouschef-development-vpc --query 'Vpcs[].VpcId' --output text)
export ZONE_NAME=$(aws --endpoint-url=http://localhost:4566 route53 list-hosted-zones-by-name --dns-name $DOMAIN_NAME --query 'HostedZones[].Name' --output text)
export REPOSITORY_ARN=$(aws --endpoint-url=http://localhost:4566 ecr describe-repositories --repository-name thesouschef-web-ecr --query 'repositories[].repositoryArn' --output text)
