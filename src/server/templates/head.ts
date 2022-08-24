import { i18n as i18next } from 'i18next';
import { extractCssAssets } from 'src/server/utils/manifest';
import type { Manifest } from 'vite';

const generateCssScript = (
    file: string,
    development: boolean,
    hostname: string | undefined,
    port: number | undefined,
    publicPath: string,
): string => `
<link rel="stylesheet" href="://${development ? `${hostname}:${port}` : ''}/${publicPath}${file}">
`;

const generateCssScripts = (
    development: boolean,
    hostname: string | undefined,
    port: number | undefined,
    publicPath: string,
    manifest: Manifest,
): string => extractCssAssets(manifest)
    .flatMap((entry) => generateCssScript(entry.file, development, hostname, port, publicPath))
    .join('');

// TODO critical css
export const head = (config: App.TemplateConfig, i18n: i18next): string => {
    const {
        devServer: { hostname, port },
        development,
        manifest,
    } = config;
    // TODO consolidate
    const publicPath = config.publicPath ? `${config.publicPath}/` : '';

    return `
        <meta charset="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/src/favicon.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${i18n.t('title')}</title>
        ${generateCssScripts(development, hostname, port, publicPath, manifest)}
    `;
};
