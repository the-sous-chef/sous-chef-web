import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as s3 from 'aws-cdk-lib/aws-s3';
import {
    CfnOutput, Stack, StackProps as CdkStackProps,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';

export interface StackProps extends CdkStackProps {
    root: string;
    stage: string;
    vpcId: string;
}

export class EcsClusterStack extends Stack {
    constructor(scope: Construct, id: string, props: StackProps) {
        super(scope, id, props);

        const {
            root,
            vpcId,
        } = props;

        const vpc = ec2.Vpc.fromLookup(this, 'VPC', {
            vpcId,
            subnetGroupNameTag: 'aws-cdk:subnet-name',
        });

        const kmsKey = new kms.Key(this, `${id}EcsClusterKmsKey`);

        // Pass the KMS key in the `encryptionKey` field to associate the key to the log group
        const logGroup = new logs.LogGroup(this, `${id}EcsClusterLogGroup`, {
            encryptionKey: kmsKey,
        });

        // Pass the KMS key in the `encryptionKey` field to associate the key to the S3 bucket
        const execBucket = new s3.Bucket(this, `${id}EcsClusterExecBucket`, {
            encryptionKey: kmsKey,
        });

        const cluster = new ecs.Cluster(this, `${id}EcsCluster`, {
            vpc,
            clusterName: `${root}-cluster`,
            executeCommandConfiguration: {
                kmsKey,
                logConfiguration: {
                    cloudWatchLogGroup: logGroup,
                    cloudWatchEncryptionEnabled: true,
                    s3Bucket: execBucket,
                    s3EncryptionEnabled: true,
                    s3KeyPrefix: 'exec-command-output',
                },
                logging: ecs.ExecuteCommandLogging.OVERRIDE,
            },
        });

        // eslint-disable-next-line no-new
        new CfnOutput(this, 'ClusterARN', {
            exportName: 'clusterArn',
            value: cluster.clusterArn,
        });
    }
}
