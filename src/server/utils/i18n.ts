/* eslint-disable no-underscore-dangle */
// eslint-disable-next-line import/no-named-as-default
import i18n, { TFunction } from 'i18next';
import Backend from 'i18next-fs-backend';
import path from 'path';
import { fileURLToPath } from 'url';
import { readdirSync, lstatSync } from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const init = (lng: string): Promise<TFunction> =>
    // eslint-disable-next-line import/no-named-as-default-member
    i18n.use(Backend).init({
        lng,
        backend: {
            loadPath: path.join(__dirname, '../../public/i18n/{{lng}}.json'),
            addPath: path.join(__dirname, '../../public/i18n/{{lng}.missing.json'),
        },
        debug: false,
        fallbackLng: 'en-US',
        preload: readdirSync(path.join(__dirname, '../../public/i18n')).filter((fileName: string) => {
            const joinedPath = path.join(path.join(__dirname, '../../public/i18n'), fileName);
            const isDirectory = lstatSync(joinedPath).isDirectory();

            return isDirectory;
        }),
    });

export { init };
