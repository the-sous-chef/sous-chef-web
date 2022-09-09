#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { FargateStack } from 'stacks/fargate';
import { EcsClusterStack } from 'stacks/ecsCluster';
// eslint-disable-next-line import/no-extraneous-dependencies
import { capitalize } from 'utils/capitalize';
import { AppConfigStack } from 'stacks/appConfig';
import { AppConfigDeploymentStack } from 'stacks/appConfig/deployment';

const app = new cdk.App();
const id = 'TheSousChefWeb';

const certificateArn = app.node.tryGetContext('certificateArn') || process.env.AWS_CERTIFICATE_ARN;
const configurationVersion = app.node.tryGetContext('configurationVersion') || process.env.CONFIGURATION_VERSION;
const domainName = app.node.tryGetContext('domainName') || process.env.DOMAIN_NAME;
const hostedZoneId = app.node.tryGetContext('hostedZoneId') || process.env.HOSTED_ZONE_ID;
const repositoryArn = app.node.tryGetContext('repositoryArn') || process.env.REPOSITORY_ARN;
const stage = app.node.tryGetContext('stage') || process.env.STAGE || 'development';
const vpcId = app.node.tryGetContext('vpcId') || process.env.VPC_ID;
const zoneName = app.node.tryGetContext('zoneName') || process.env.ZONE_NAME;
const env = {
    account: app.node.tryGetContext('accountId') || process.env.AWS_ACCOUNT_ID,
    region: app.node.tryGetContext('region') || process.env.AWS_REGION,
};
const root = `thesouschef-web-${stage}`;

// eslint-disable-next-line no-new
new EcsClusterStack(app, `${id}EcsCluster${capitalize(stage)}`, {
    env,
    root,
    stage,
    vpcId,
});

// eslint-disable-next-line no-new
new AppConfigStack(app, `${id}AppConfig${capitalize(stage)}`, {
    env,
});

// eslint-disable-next-line no-new
new AppConfigDeploymentStack(app, `${id}AppConfigDeployment${capitalize(stage)}`, {
    configurationVersion,
    env,
    stage,
});

// eslint-disable-next-line no-new
new FargateStack(app, `${id}${capitalize(stage)}`, {
    certificateArn,
    domainName,
    hostedZoneId,
    env,
    root,
    repositoryArn,
    stage,
    vpcId,
    zoneName,
    clusterArn: cdk.Fn.importValue('clusterArn'),
});
