#!/usr/bin/env node
/* eslint-disable import/no-extraneous-dependencies */
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { FargateStack } from 'stacks/fargate';
import { capitalize } from 'utils/capitalize';
import { defaultStage, id, namespace } from 'config.json';

const app = new cdk.App();
const certificateArn = app.node.tryGetContext('certificateArn') || process.env.AWS_CERTIFICATE_ARN;
const domainName = app.node.tryGetContext('domainName') || process.env.DOMAIN_NAME;
const hostedZoneId = app.node.tryGetContext('hostedZoneId') || process.env.HOSTED_ZONE_ID;
const stage = app.node.tryGetContext('stage') || process.env.STAGE || defaultStage;
const vpcId = app.node.tryGetContext('vpcId') || process.env.VPC_ID;
const zoneName = app.node.tryGetContext('zoneName') || process.env.ZONE_NAME;
const env = {
    account: app.node.tryGetContext('accountId') || process.env.AWS_ACCOUNT_ID,
    region: app.node.tryGetContext('region') || process.env.AWS_REGION,
};
const root = `${namespace}-${stage}`;

// eslint-disable-next-line no-new
new FargateStack(app, `${id}${capitalize(stage)}`, {
    certificateArn,
    domainName,
    hostedZoneId,
    env,
    root,
    stage,
    vpcId,
    zoneName,
    clusterArn: cdk.Fn.importValue('clusterArn'),
    repositoryArn: cdk.Fn.importValue('ecrRepositoryArn'),
});
