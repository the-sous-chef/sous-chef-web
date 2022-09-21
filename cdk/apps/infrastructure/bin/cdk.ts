#!/usr/bin/env node
/* eslint-disable import/no-extraneous-dependencies */
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { EcsClusterStack } from 'stacks/ecsCluster';
import { capitalize } from 'utils/capitalize';
import { AppConfigStack } from 'stacks/appConfig';
import { EcrStack } from 'stacks/ecr';
import { defaultStage, id, namespace } from 'config.json';

const app = new cdk.App();
const stage = app.node.tryGetContext('stage') || process.env.STAGE || defaultStage;
const vpcId = app.node.tryGetContext('vpcId') || process.env.VPC_ID;
const env = {
    account: app.node.tryGetContext('accountId') || process.env.AWS_ACCOUNT_ID,
    region: app.node.tryGetContext('region') || process.env.AWS_REGION,
};
const root = `${namespace}-${stage}`;

// eslint-disable-next-line no-new
new EcrStack(app, `${id}EcrRepository${capitalize(stage)}`, {
    env,
    root,
    stage,
});

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
