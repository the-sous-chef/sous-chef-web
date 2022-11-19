#!/bin/bash

# TODO How many of these should be retrieved from app config?
VARIABLES=(
    "APP_CONFIG_APP_IDENTIFIER"
    "APP_CONFIG_CLIENT_CONFIG_PROFILE_IDENTIFIER"
    "APP_CONFIG_SERVER_CONFIG_PROFILE_IDENTIFIER"
    "AUTH0_CLIENT_ID"
    "AUTH0_DOMAIN"
    "AWS_CERTIFICATE_ARN"
    "DEPLOYMENT"
    "HOSTED_ZONE_ID"
    "IMAGE_DIRECTORY"
    "LOGROCKET_ACCOUNT_ID"
    "PUBLIC_PATH"
    "RELEASE"
    "SENTRY_DSN"
    "VPC_ID"
    "ZONE_NAME"
)

if [ ! -f Dockerfile ]; then
    echo "This script must be run in the same directory as the Dockerfile" && exit -1
fi

if [ -z "$NODE_ENV" ]; then
    echo "NODE_ENV must be set" && exit -1
fi

if [ "$NODE_ENV" == "development" ]; then
    if [ ! -f .env ]; then
        echo "Cannot find the local .env file from which to read environment variables" && exit -1
    fi

    AWS_CLI="aws --endpoint-url=http://localhost:4566"
    CDK_CLI="npx --node-options=--inspect cdklocal"
    export AWS_ACCESS_KEY_ID=test
    export AWS_ACCOUNT_ID=000000000000
    export AWS_DEFAULT_REGION=us-east-1
    export AWS_SECRET_ACCESS_KEY=test
    export AWS_REGION=us-east-1
    export DOMAIN_NAME=thesouschef.local
    source .env
else
    AWS_CLI="aws"
    CDK_CLI="npx cdk"
    export DOMAIN_NAME=thesouschef.app
fi

export AWS_CERTIFICATE_ARN=$($AWS_CLI acm list-certificates --query 'CertificateSummaryList[].[CertificateArn,DomainName]' --output text | grep $DOMAIN_NAME | cut -f1)
export CDK_NEW_BOOTSTRAP=1
export HOSTED_ZONE_ID=$($AWS_CLI route53 list-hosted-zones-by-name --dns-name $DOMAIN_NAME --query 'HostedZones[].Id' --output text)
export IMAGE_DIRECTORY="$PWD"
export VPC_ID=$($AWS_CLI ec2 describe-vpcs --filters Name=tag:Name,Values=thesouschef-development-vpc --query 'Vpcs[].VpcId' --output text)
export ZONE_NAME=$($AWS_CLI route53 list-hosted-zones-by-name --dns-name $DOMAIN_NAME --query 'HostedZones[].Name' --output text)

for var in ${VARIABLES[@]}; do
    if [ -z "${!var}" ]; then
        echo "$var is not sent" && exit -1
    else
        export $var="${!var}"
    fi
done

cd cdk/apps/fargate

$CDK_CLI deploy --all --require-approval never
