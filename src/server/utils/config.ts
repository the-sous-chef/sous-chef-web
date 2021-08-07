import { AppConfig } from '@aws-sdk/client-appconfig';

import { getLogger } from 'src/server/utils/logger';

const client = new AppConfig({ logger: getLogger() });
let config: App.Config | null = null;
let configVersion: string | undefined;

export const getConfig = async (): Promise<App.Config> => {
    if (config === null) {
        const response = await client.getConfiguration({
            Application: process.env.AWS_APPLICATION,
            ClientId: process.env.AWS_CLIENT_ID,
            Configuration: process.env.AWS_CONFIGURATION,
            ClientConfigurationVersion: configVersion,
            Environment: process.env.NODE_ENV,
        });

        if (!response.Content && config == null) {
            throw new Error('Failed to retrive configuration from AWS App Config');
        }

        if (response.Content) {
            configVersion = response.ConfigurationVersion;
            config = JSON.parse(new TextDecoder().decode(response.Content));
        }
    }

    return config as App.Config;
};
