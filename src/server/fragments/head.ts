import { i18n as i18next } from 'i18next';
import { extractCssAssets } from 'src/server/utils/manifest';
import type { Manifest } from 'vite';

const generateCssScript = (
    file: string,
    development: boolean,
    hostname: string | undefined,
    port: number | undefined,
    publicPath: string,
): string => `<link rel="stylesheet" href="://${development ? `${hostname}:${port}` : ''}/${publicPath}${file}">`;

const generateCssScripts = (
    development: boolean,
    hostname: string | undefined,
    port: number | undefined,
    publicPath: string,
    manifest: Manifest,
): string => extractCssAssets(manifest)
    .flatMap((entry) => generateCssScript(entry.file, development, hostname, port, publicPath))
    .join('');

const generateReactRefreshSnippet = (
    hostname: string | undefined,
    port: number | undefined,
): string => `\
    <script async type="module">
        import RefreshRuntime from 'http://${hostname}:${port}/@react-refresh'
        RefreshRuntime.injectIntoGlobalHook(window)
        window.$RefreshReg$ = () => {}
        window.$RefreshSig$ = () => (type) => type
        window.__vite_plugin_react_preamble_installed__ = true
    </script>\
    `;

// TODO critical css
export const head = (config: App.RenderContext, i18n: i18next): string => {
    const {
        devServer: { hostname, port },
        development,
        manifest,
    } = config;
    // TODO consolidate and use URL to build urls
    const publicPath = config.publicPath ? `${config.publicPath}/` : '';

    return `\
        <head>
            <meta charset="UTF-8" />
            <link rel="icon" type="image/svg+xml" href="${development ? `http://${hostname}:${port}` : ''}/${publicPath}img/favicon.svg" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>${i18n.t('title')}</title>
            ${generateCssScripts(development, hostname, port, publicPath, manifest)}
            ${development && generateReactRefreshSnippet(hostname, port)}
        </head>\
    `;
};
