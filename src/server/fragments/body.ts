import { extractJsAssets } from 'src/server/utils/manifest';
import type { Manifest, ManifestChunk } from 'vite';

const generateJsScript = (
    entry: ManifestChunk,
    development: boolean,
    hostname: string | undefined,
    port: number | undefined,
    publicPath: string,
): string => `\
<script
    type="module"
    ${entry.isDynamicEntry ? 'async' : ''}
    src="://${development ? `${hostname}:${port}` : ''}/${publicPath}${entry.file}"
></script>\
`;

const generateJsScripts = (
    development: boolean,
    hostname: string | undefined,
    port: number | undefined,
    publicPath: string,
    manifest: Manifest,
): string => extractJsAssets(manifest)
    .map((entry) => generateJsScript(entry, development, hostname, port, publicPath))
    .join('');

export const bodyStart = (): string => ('<body><div id="root">');

export const bodyEnd = (): string => ('</body>');

export const body = (config: App.RenderContext): string => {
    const {
        devServer: { hostname, port },
        dehydratedState,
        development,
        manifest,
    } = config;
    // TODO consolidate
    const publicPath = config.publicPath ? `${config.publicPath}/` : '';

    return (`\
            </div>
            <script>window.__REACT_QUERY_STATE__ = ${JSON.stringify(dehydratedState)};</script>
            ${generateJsScripts(development, hostname, port, publicPath, manifest)}
        </body>
    `);
};
