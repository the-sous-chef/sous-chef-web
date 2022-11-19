import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as ecrdeploy from 'cdk-ecr-deployment';
import { DockerImageAsset, Platform } from 'aws-cdk-lib/aws-ecr-assets';
import { Stack, StackProps as CdkStackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export interface StackProps extends CdkStackProps {
    imageDirectory: string;
    release: string;
    repositoryArn: string;
    root: string;
    stage: string;
}

export class DockerImageDeploymentStack extends Stack {
    constructor(scope: Construct, id: string, props: StackProps) {
        super(scope, id, props);

        const { imageDirectory, release, repositoryArn, root, stage } = props;

        const repository = ecr.Repository.fromRepositoryAttributes(this, `${id}EcrRepository`, {
            repositoryArn,
            repositoryName: `${root}-ecr`.toLowerCase(),
        });

        const image = new DockerImageAsset(this, `${id}DockerImage${release}`, {
            directory: imageDirectory,
            buildArgs: {
                NODE_ENV: stage,
            },
            platform: Platform.LINUX_AMD64,
        });

        // Copy from cdk docker image asset to another ECR.
        new ecrdeploy.ECRDeployment(this, `${id}DockerImageDeployment${release}`, {
            src: new ecrdeploy.DockerImageName(image.imageUri),
            dest: new ecrdeploy.DockerImageName(`${repository.repositoryUri}:${release}`),
        });
    }
}
