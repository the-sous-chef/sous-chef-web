import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as patterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as route53 from 'aws-cdk-lib/aws-route53';
import { CfnOutput, Stack, StackProps as CdkStackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export interface StackProps extends CdkStackProps {
    certificateArn: string;
    clusterArn: string;
    domainName: string;
    hostedZoneId: string;
    root: string;
    repositoryArn: string;
    stage: string;
    vpcId: string;
    zoneName: string;
}

export class FargateStack extends Stack {
    constructor(scope: Construct, id: string, props: StackProps) {
        super(scope, id, props);

        const { certificateArn, clusterArn, domainName, hostedZoneId, root, repositoryArn, stage, vpcId, zoneName } =
            props;

        const vpc = ec2.Vpc.fromLookup(this, `${id}VPC`, {
            vpcId,
            subnetGroupNameTag: 'aws-cdk:subnet-name',
        });
        const hostedZone = route53.HostedZone.fromHostedZoneAttributes(this, `${id}HostedZone`, {
            hostedZoneId,
            zoneName,
        });
        const cluster = ecs.Cluster.fromClusterArn(this, `${id}EcsCluster`, clusterArn);
        const repository = ecr.Repository.fromRepositoryArn(this, `${id}EcrRepository`, repositoryArn);
        const certificate = acm.Certificate.fromCertificateArn(this, `${id}AcmCertificate`, certificateArn);
        const serviceName = root;

        const service = new patterns.ApplicationLoadBalancedFargateService(this, `${id}ALBFargate`, {
            certificate,
            cluster,
            serviceName,
            // TODO create mapper
            cpu: stage === 'production' ? 4096 : 1024,
            desiredCount: stage === 'production' ? 4 : 2,
            domainName: `app.${domainName}`,
            domainZone: hostedZone,
            loadBalancer: new elbv2.ApplicationLoadBalancer(this, `${id}ALB`, {
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
            }),
            memoryLimitMiB: 8192,
            protocolVersion: elbv2.ApplicationProtocolVersion.HTTP2,
            publicLoadBalancer: true,
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
                containerPort: 80,
                enableLogging: true,
                environment: {
                    DEPLOYMENT: this.node.tryGetContext('deployment') || process.env.DEPLOYMENT,
                    NODE_ENV: stage,
                },
                image: ecs.ContainerImage.fromEcrRepository(repository, 'latest'),
                logDriver: ecs.LogDrivers.awsLogs({
                    streamPrefix: serviceName,
                    logRetention: logs.RetentionDays.THREE_MONTHS,
                }),
            },
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
