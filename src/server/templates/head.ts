import { i18n as i18next } from 'i18next';
import { Manifest } from 'vite';

const generateCssScript = (
    file: string,
    development: boolean,
    hostname: string,
    port: number,
    publicPath: string,
): string => `
<link rel="stylesheet" href="://${development ? `${hostname}:${port}` : ''}/${publicPath}${file}">
`;

const generateCssScripts = (
    development: boolean,
    hostname: string,
    port: number,
    publicPath: string,
    manifest: Manifest,
): string => Object.values(manifest)
    .flatMap((entry) => entry.css?.map((css) => generateCssScript(css, development, hostname, port, publicPath)))
    .filter(Boolean)
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
