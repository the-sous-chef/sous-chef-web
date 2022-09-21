#!/usr/bin/env node
/* eslint-disable import/no-extraneous-dependencies */
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { capitalize } from 'utils/capitalize';
import { AppConfigDeploymentStack } from 'stacks/appConfig/deployment';
import { defaultStage, id } from 'config.json';

const app = new cdk.App();
const configurationVersion = app.node.tryGetContext('configurationVersion') || process.env.CONFIGURATION_VERSION;
const stage = app.node.tryGetContext('stage') || process.env.STAGE || defaultStage;
const env = {
    account: app.node.tryGetContext('accountId') || process.env.AWS_ACCOUNT_ID,
    region: app.node.tryGetContext('region') || process.env.AWS_REGION,
};

// eslint-disable-next-line no-new
new AppConfigDeploymentStack(app, `${id}AppConfigDeployment${capitalize(stage)}`, {
    configurationVersion,
    env,
    stage,
});
