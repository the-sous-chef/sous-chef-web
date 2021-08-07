import { atomFamily, selectorFamily } from 'recoil';
import {
    getRemoteConfig, fetchAndActivate, getValue,
} from 'firebase/remote-config';

import { config } from 'src/client/config';

const remoteConfig = getRemoteConfig();

remoteConfig.defaultConfig = config as App.DefaultConfig;

function buildConfig(): App.Config {
    return {
        ...config,
        services: JSON.parse(getValue(remoteConfig, 'services').asString()),
    } as App.Config;
}

export const currentConfigRequestIDState = atomFamily({
    key: 'CurrentConfigRequestIDState',
    default: '',
});

export const currentConfigQuery = selectorFamily({
    key: 'CurrentConfig',
    get: (accessToken: string | undefined) => async ({ get }): Promise<App.Config | null> => {
        if (accessToken) {
            get(currentConfigRequestIDState(accessToken));

            await fetchAndActivate(remoteConfig);

            return buildConfig();
        }

        return null;
    },
});
