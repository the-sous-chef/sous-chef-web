import * as ecr from 'aws-cdk-lib/aws-ecr';
import { CfnOutput, Stack, StackProps as CdkStackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export interface StackProps extends CdkStackProps {
    root: string;
    stage: string;
}

export class EcrStack extends Stack {
    constructor(scope: Construct, id: string, props: StackProps) {
        super(scope, id, props);

        const { root } = props;

        const repository = new ecr.Repository(this, `${id}ECRRepository`, {
            imageScanOnPush: true,
            repositoryName: `${root}-ecr`.toLowerCase(),
        });

        // eslint-disable-next-line no-new
        new CfnOutput(this, 'ECRRepositoryArn', {
            exportName: 'ecrRepositoryArn',
            value: repository.repositoryArn,
        });
    }
}
