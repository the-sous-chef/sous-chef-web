import {
    AppConfigDataClient,
    BadRequestException,
    GetLatestConfigurationCommand,
    StartConfigurationSessionCommand,
    ResourceNotFoundException,
} from '@aws-sdk/client-appconfigdata';
// Waiting on https://github.com/localstack/localstack/issues/6892
// eslint-disable-next-line import/no-extraneous-dependencies
import { mockClient } from 'aws-sdk-client-mock';
import mockConfig from '../../../../../localstack/mocks/appConfig.json';

const client = new AppConfigDataClient({ region: process.env.AWS_REGION });
const mock = mockClient(client);

let clientConfigToken: string;
let serverConfigToken: string;

mock.onAnyCommand().resolves(mockConfig);

const toString = (arr: Uint8Array): string => (
    arr instanceof Uint8Array ? new TextDecoder().decode(arr) : arr as string
);

const getClientConfigToken = async (): Promise<string> => {
    const getSession = new StartConfigurationSessionCommand({
        ApplicationIdentifier: process.env.APP_CONFIG_APP_IDENTIFIER,
        ConfigurationProfileIdentifier: process.env.APP_CONFIG_CLIENT_CONFIG_PROFILE_IDENTIFIER,
        EnvironmentIdentifier: process.env.DEPLOYMENT,
    });
    const sessionToken = await client.send(getSession);

    return sessionToken.InitialConfigurationToken || '';
};

const getServerConfigToken = async (): Promise<string> => {
    const getSession = new StartConfigurationSessionCommand({
        ApplicationIdentifier: process.env.APP_CONFIG_APP_IDENTIFIER,
        ConfigurationProfileIdentifier: process.env.APP_CONFIG_SERVER_CONFIG_PROFILE_IDENTIFIER,
        EnvironmentIdentifier: process.env.DEPLOYMENT,
    });
    const sessionToken = await client.send(getSession);

    return sessionToken.InitialConfigurationToken || '';
};

export const getClientConfig = async (): Promise<App.ClientConfig> => {
    if (!clientConfigToken) {
        clientConfigToken = await getClientConfigToken();
    }

    try {
        const command = new GetLatestConfigurationCommand({
            ConfigurationToken: clientConfigToken,
        });
        const response = await client.send(command);

        if (response.Configuration) {
            return JSON.parse(toString(response.Configuration)) as App.ClientConfig;
        }

        throw new ResourceNotFoundException({
            Message: 'No configuration found in response from AWS AppConfig',
            $metadata: response.$metadata,
        });
    } catch (err) {
        if (err instanceof BadRequestException) {
            clientConfigToken = await getClientConfigToken();

            return getClientConfig();
        }

        throw err;
    }
};

export const getServerConfig = async (): Promise<App.ServerConfig> => {
    if (!serverConfigToken) {
        serverConfigToken = await getServerConfigToken();
    }

    try {
        const command = new GetLatestConfigurationCommand({
            ConfigurationToken: serverConfigToken,
        });
        const response = await client.send(command);

        if (response.Configuration) {
            return JSON.parse(toString(response.Configuration)) as App.ServerConfig;
        }

        throw new ResourceNotFoundException({
            Message: 'No configuration found in response from AWS AppConfig',
            $metadata: response.$metadata,
        });
    } catch (err) {
        if (err instanceof BadRequestException) {
            serverConfigToken = await getServerConfigToken();

            return getServerConfig();
        }

        throw err;
    }
};
