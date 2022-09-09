import {
    aws_appconfig as appconfig,
    Fn,
    Stack,
    StackProps as CdkStackProps,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { capitalize } from 'utils/capitalize';

export interface StackProps extends CdkStackProps {
    configurationVersion: string;
    stage: string;
}

export class AppConfigDeploymentStack extends Stack {
    constructor(scope: Construct, id: string, props: StackProps) {
        super(scope, id, props);

        const {
            configurationVersion,
            stage,
        } = props;

        // eslint-disable-next-line no-new
        new appconfig.CfnDeployment(this, `${id}AppConfig${capitalize(stage)}Deployment`, {
            configurationVersion,
            applicationId: Fn.importValue('applicationId'),
            configurationProfileId: Fn.importValue(`${stage}ConfigurationProfileId`),
            deploymentStrategyId: Fn.importValue('defaultDeplomentId'),
            description: `Deployment for ${configurationVersion} to ${stage} environment`,
            environmentId: Fn.importValue(`${stage}EnvironmentId`),
        });
    }
}
