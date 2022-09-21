import {
    aws_appconfig as appconfig,
    CfnOutput,
    RemovalPolicy,
    Stack,
    StackProps,
} from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export class AppConfigStack extends Stack {
    constructor(scope: Construct, id: string, props: StackProps) {
        super(scope, id, props);

        const appConfigName = 'sous-chef-web';

        const configurationBucket = new s3.Bucket(this, `${id}S3Bucket`, {
            autoDeleteObjects: false,
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
            bucketName: `${appConfigName}-configuration`,
            encryption: s3.BucketEncryption.S3_MANAGED,
            removalPolicy: RemovalPolicy.RETAIN,
            versioned: true,
        });

        const configurationBucketReadPolicyDocument = new iam.PolicyDocument({
            statements: [
                new iam.PolicyStatement({
                    actions: [
                        's3:GetObject',
                        's3:GetObjectVersion',
                    ],
                    effect: iam.Effect.ALLOW,
                    // principals: [new iam.ServicePrincipal('appconfig.amazonaws.com')],
                    resources: [`${configurationBucket.bucketArn}/*`],
                }),
                new iam.PolicyStatement({
                    actions: [
                        's3:GetBucketLocation',
                        's3:GetBucketVersioning',
                        's3:ListBucketVersions',
                        's3:ListBucket',
                    ],
                    effect: iam.Effect.ALLOW,
                    // principals: [new iam.ServicePrincipal('appconfig.amazonaws.com')],
                    resources: [configurationBucket.bucketArn],
                }),
                new iam.PolicyStatement({
                    actions: [
                        's3:ListAllMyBuckets',
                    ],
                    effect: iam.Effect.ALLOW,
                    resources: ['*'],
                }),
            ],
        });

        // eslint-disable-next-line no-new
        const role = new iam.Role(this, `${id}ReadRole`, {
            assumedBy: new iam.ServicePrincipal('appconfig.amazonaws.com'),
            roleName: `${appConfigName}-role`,
            description: 'Allow read access to S3 to retrieve configuration files',
            inlinePolicies: {
                ConfigurationBucketReadPolicy: configurationBucketReadPolicyDocument,
            },
        });

        const application = new appconfig.CfnApplication(this, `${id}Application`, {
            name: appConfigName,
            description: 'Configuration for The Sous Chef Web Application',
        });

        // Environments
        const developmentEnvironment = new appconfig.CfnEnvironment(this, `${id}DevelopmentEnvironment`, {
            applicationId: application.ref,
            name: `${appConfigName}-development-environment`,
        });

        const productionEnvironment = new appconfig.CfnEnvironment(this, `${id}ProductionEnvironment`, {
            applicationId: application.ref,
            name: `${appConfigName}-production-environment`,
            // TODO alarms for 500 response codes on ALB (https://aws.amazon.com/blogs/mt/proactive-monitoring-of-application-configuration-deployment-using-aws-appconfig-and-amazon-cloudwatch/)
        });

        const qaEnvironment = new appconfig.CfnEnvironment(this, `${id}QaEnvironment`, {
            applicationId: application.ref,
            name: `${appConfigName}-qa-environment`,
            // TODO alarms for 500 response codes on ALB (https://aws.amazon.com/blogs/mt/proactive-monitoring-of-application-configuration-deployment-using-aws-appconfig-and-amazon-cloudwatch/)
        });

        // Configuration Profiles
        const developmentConfigurationProfile = new appconfig.CfnConfigurationProfile(this, `${id}DevelopmentConfigurationProfile`, {
            applicationId: application.ref,
            locationUri: `${configurationBucket.s3UrlForObject('development/config.json')}`,
            name: `${appConfigName}-development-configuration-profile`,
            retrievalRoleArn: role.roleArn,
            // TODO validator
        });

        const productionConfigurationProfile = new appconfig.CfnConfigurationProfile(this, `${id}ProductionConfigurationProfile`, {
            applicationId: application.ref,
            locationUri: `${configurationBucket.s3UrlForObject('production/config.json')}`,
            name: `${appConfigName}-production-configuration-profile`,
            retrievalRoleArn: role.roleArn,
            // TODO validator
        });

        const qaConfigurationProfile = new appconfig.CfnConfigurationProfile(this, `${id}QaConfigurationProfile`, {
            applicationId: application.ref,
            locationUri: `${configurationBucket.s3UrlForObject('qa/config.json')}`,
            name: `${appConfigName}-qa-configuration-profile`,
            retrievalRoleArn: role.roleArn,
            // TODO validator
        });

        // Deployment Strategies
        const defaultDeploymentStrategy = new appconfig.CfnDeploymentStrategy(this, `${id}DefaultDeploymentStrategy`, {
            deploymentDurationInMinutes: 5,
            finalBakeTimeInMinutes: 7,
            growthFactor: 10,
            growthType: 'LINEAR',
            name: `${appConfigName}-default-deployment-strategy`,
            replicateTo: 'NONE ',
        });

        // eslint-disable-next-line no-new
        new CfnOutput(this, 'ApplicationId', {
            exportName: 'applicationId',
            value: application.ref,
        });

        // eslint-disable-next-line no-new
        new CfnOutput(this, 'DevelopmentEnvironmentId', {
            exportName: 'developmentEnvironmentId',
            value: developmentEnvironment.ref,
        });

        // eslint-disable-next-line no-new
        new CfnOutput(this, 'ProductionEnvironmentId', {
            exportName: 'productionEnvironmentId',
            value: productionEnvironment.ref,
        });

        // eslint-disable-next-line no-new
        new CfnOutput(this, 'QaEnvironmentId', {
            exportName: 'qaEnvironmenId',
            value: qaEnvironment.ref,
        });

        // eslint-disable-next-line no-new
        new CfnOutput(this, 'DevelopmentConfigurationProfileId', {
            exportName: 'developmentConfigurationProfileId',
            value: developmentConfigurationProfile.ref,
        });

        // eslint-disable-next-line no-new
        new CfnOutput(this, 'ProductionConfigurationProfileId', {
            exportName: 'productionConfigurationProfileId',
            value: productionConfigurationProfile.ref,
        });

        // eslint-disable-next-line no-new
        new CfnOutput(this, 'QaConfigurationProfileId', {
            exportName: 'qaConfigurationProfileId',
            value: qaConfigurationProfile.ref,
        });

        // eslint-disable-next-line no-new
        new CfnOutput(this, 'DefaultDeploymentStrategyId', {
            exportName: 'defaultDeploymentStrategyId',
            value: defaultDeploymentStrategy.ref,
        });
    }
}
