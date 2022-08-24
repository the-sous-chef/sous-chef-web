import type { Manifest, ManifestChunk } from 'vite';

export const findEntryManifestChunk = (
    manifest: Manifest,
): ManifestChunk | undefined => Object
    .values(manifest)
    .find((entry) => entry.isEntry);

export const getJsManifestChunkTree = (
    entry: ManifestChunk,
    manifest: Manifest,
): ManifestChunk[] => {
    let chunks: ManifestChunk[] = [entry];

    if (entry.imports) {
        const arr = entry.imports.map((x) => getJsManifestChunkTree(manifest[x], manifest)).flat();

        chunks = chunks.concat(arr);
    }

    if (entry.dynamicImports) {
        const arr = entry.dynamicImports.map((x) => getJsManifestChunkTree(manifest[x], manifest)).flat();

        chunks = chunks.concat(arr);
    }

    return chunks;
};

export const extractJsAssets = (manifest: Manifest): ManifestChunk[] => {
    const entry = findEntryManifestChunk(manifest);

    if (!entry) {
        return [];
    }

    return [entry].concat(getJsManifestChunkTree(entry, manifest));
};

export const extractCssAssets = (manifest: Manifest): ManifestChunk[] => {
    const entry = findEntryManifestChunk(manifest);

    if (!entry || !entry.css) {
        return [];
    }

    return entry.css.map((x) => manifest[x]);
};
