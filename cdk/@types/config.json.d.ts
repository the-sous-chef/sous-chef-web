declare module 'config.json' {
    type Config = {
        defaultStage: string;
        id: string;
        namespace: string;
    };

    const config: Config;

    export = config;
}
