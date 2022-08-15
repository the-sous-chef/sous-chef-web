import { Manifest, ManifestChunk } from 'vite';

const generateReactRefreshSnippet = (hostname: string, port: number): string => `
<script type="module">
    import RefreshRuntime from 'http://${hostname}:${port}';/@react-refresh'
    RefreshRuntime.injectIntoGlobalHook(window)
    window.$RefreshReg$ = () => {}
    window.$RefreshSig$ = () => (type) => type
    window.__vite_plugin_react_preamble_installed__ = true
</script>
`;

const generateJsScript = (
    entry: ManifestChunk,
    development: boolean,
    hostname: string,
    port: number,
    publicPath: string,
): string => `
<script
    type="module"
    ${entry.isDynamicEntry ? 'async' : ''}
    src="://${development ? `${hostname}:${port}` : ''}/${publicPath}${entry.file}"
></script>
`;

const generateJsScripts = (
    development: boolean,
    hostname: string,
    port: number,
    publicPath: string,
    manifest: Manifest,
): string => Object.values(manifest)
    .map((entry) => generateJsScript(entry, development, hostname, port, publicPath))
    .join('');

export const top = (config: App.TemplateConfig): string => {
    const {
        devServer: { hostname, port },
        development,
    } = config;

    return (`
        ${development && generateReactRefreshSnippet(hostname, port)}
        <div id="root">
    `);
};

export const bottom = (config: App.TemplateConfig): string => {
    const {
        devServer: { hostname, port },
        development,
        manifest,
    } = config;
    // TODO consolidate
    const publicPath = config.publicPath ? `${config.publicPath}/` : '';

    return (`
        </div>
        ${generateJsScripts(development, hostname, port, publicPath, manifest)}
        ${development ? `<script type="module" src="http://${hostname}:${port}/src/client/browser.tsx"></script>` : ''}
    `);
};
