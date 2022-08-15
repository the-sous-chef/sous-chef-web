import i18n, { TFunction } from 'i18next';
import Backend from 'i18next-fs-backend';
import path from 'path';

const init = (lng: string): Promise<TFunction> => i18n.use(Backend).init({
    lng,
    backend: {
        loadPath: path.join(__dirname, 'public/i18n/{{lng}}.json'),
        addPath: path.join(__dirname, 'public/i18n/{{lng}.missing.json'),
    },
    debug: true,
    fallbackLng: 'en-US',
});

export { init };
