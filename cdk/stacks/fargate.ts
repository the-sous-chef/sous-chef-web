import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as patterns from 'aws-cdk-lib/aws-ecs-patterns';
// import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as route53 from 'aws-cdk-lib/aws-route53';
import { CfnOutput, Duration, Stack, StackProps as CdkStackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Platform } from 'aws-cdk-lib/aws-ecr-assets';
import { LoadBalancerTarget } from 'aws-cdk-lib/aws-route53-targets';
import { RecordSet } from 'aws-cdk-lib/aws-route53';

export interface StackProps extends CdkStackProps {
    certificateArn: string;
    clusterArn: string;
    domainName: string;
    hostedZoneId: string;
    imageDirectory: string;
    release: string;
    root: string;
    repositoryArn: string;
    stage: string;
    vpcId: string;
    zoneName: string;
}

export class FargateStack extends Stack {
    constructor(scope: Construct, id: string, props: StackProps) {
        super(scope, id, props);

        const {
            certificateArn,
            clusterArn,
            // domainName,
            hostedZoneId,
            imageDirectory,
            release,
            root,
            // repositoryArn,
            stage,
            vpcId,
            zoneName,
        } = props;
        const {
            APP_CONFIG_APP_IDENTIFIER,
            APP_CONFIG_CLIENT_CONFIG_PROFILE_IDENTIFIER,
            APP_CONFIG_SERVER_CONFIG_PROFILE_IDENTIFIER,
            AUTH0_CLIENT_ID,
            AUTH0_DOMAIN,
            DEBUG_BUILD,
            DEPLOYMENT,
            HOSTNAME,
            LOGROCKET_ACCOUNT_ID,
            PORT,
            PUBLIC_PATH,
            SENTRY_DSN,
        } = process.env;
        const vpc = ec2.Vpc.fromLookup(this, `${id}VPC`, {
            vpcId,
            subnetGroupNameTag: 'aws-cdk:subnet-name',
        });
        const hostedZone = route53.HostedZone.fromHostedZoneAttributes(this, `${id}HostedZone`, {
            hostedZoneId,
            zoneName,
        });

        const cluster = ecs.Cluster.fromClusterAttributes(this, `${id}EcsCluster`, {
            clusterArn,
            vpc,
            clusterName: `${root}-cluster`,
            securityGroups: [],
        });
        const certificate = acm.Certificate.fromCertificateArn(this, `${id}AcmCertificate`, certificateArn);
        const serviceName = root;
        const environment = {
            APP_CONFIG_APP_IDENTIFIER,
            APP_CONFIG_CLIENT_CONFIG_PROFILE_IDENTIFIER,
            APP_CONFIG_SERVER_CONFIG_PROFILE_IDENTIFIER,
            AUTH0_CLIENT_ID,
            AUTH0_DOMAIN,
            DEBUG_BUILD,
            HOSTNAME,
            LOGROCKET_ACCOUNT_ID,
            PORT,
            PUBLIC_PATH,
            SENTRY_DSN,
            DEPLOYMENT: this.node.tryGetContext('deployment') || DEPLOYMENT,
            NODE_ENV: stage,
            RELEASE: release,
        } as Record<string, string>;
        // TODO re-enable
        // const repository = ecr.Repository.fromRepositoryAttributes(this, `${id}EcrRepository`, {
        //     repositoryArn,
        //     repositoryName: `${root}-ecr`.toLowerCase(),
        // });
        const loadBalancer = new elbv2.ApplicationLoadBalancer(this, `${id}ALB`, {
            vpc,
            http2Enabled: true,
            internetFacing: true,
            loadBalancerName: `${serviceName.toLowerCase()}-alb`,
            securityGroup: new ec2.SecurityGroup(this, `${id}ALBSecurityGroup`, {
                vpc,
                allowAllOutbound: true,
                securityGroupName: `${serviceName.toLowerCase()}-alb-sg`,
            }),
            vpcSubnets: vpc.selectSubnets({
                subnetType: ec2.SubnetType.PUBLIC,
            }),
        });
        const service = new patterns.ApplicationLoadBalancedFargateService(this, `${id}ALBFargate`, {
            certificate,
            cluster,
            loadBalancer,
            serviceName,
            // TODO create mapper
            cpu: stage === 'production' ? 4096 : 1024,
            desiredCount: stage === 'production' ? 4 : 2,
            memoryLimitMiB: 8192,
            redirectHTTP: true,
            circuitBreaker: {
                rollback: true,
            },
            deploymentController: {
                type: ecs.DeploymentControllerType.CODE_DEPLOY,
            },
            taskSubnets: vpc.selectSubnets({
                subnetType: ec2.SubnetType.PUBLIC,
            }),
            taskImageOptions: {
                environment,
                containerPort: 80,
                enableLogging: true,
                image: ecs.ContainerImage.fromAsset(imageDirectory, {
                    buildArgs: {
                        NODE_ENV: stage,
                    },
                    platform: Platform.LINUX_AMD64,
                }),
                // TODO re-enable
                // image: ecs.ContainerImage.fromEcrRepository(repository, release),
                logDriver: ecs.LogDrivers.awsLogs({
                    streamPrefix: serviceName,
                    logRetention: logs.RetentionDays.THREE_MONTHS,
                }),
            },
        });

        new route53.ARecord(this, `${id}ARecord`, {
            recordName: 'sous-chef-web',
            target: route53.RecordTarget.fromAlias(new LoadBalancerTarget(loadBalancer)),
            zone: hostedZone,
            ttl: Duration.minutes(1),
        });

        service.targetGroup.configureHealthCheck({
            path: '/livecheck',
        });

        const scalableTarget = service.service.autoScaleTaskCount({
            minCapacity: stage === 'production' ? 4 : 2,
            maxCapacity: stage === 'production' ? 12 : 4,
        });

        scalableTarget.scaleOnCpuUtilization(`${id}CpuScaling`, {
            targetUtilizationPercent: 50,
        });

        scalableTarget.scaleOnMemoryUtilization(`${id}MemoryScaling`, {
            targetUtilizationPercent: 75,
        });

        // eslint-disable-next-line no-new
        new CfnOutput(this, 'ServiceARN', { value: service.service.serviceArn });
    }
}
