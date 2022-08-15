import { Next, ParameterizedContext } from 'koa';

const formatLocale = (locale: string): string => {
    const parts = locale.split('-');

    return `${parts[0]}-${parts[1].toUpperCase()}`;
};

const getFormattedLocale = (locale: string, ctx: ParameterizedContext): string | null => {
    // Check explicit length and for dash as this is faster than regex matching
    if (locale.length === 5 && locale.charAt(3) === '-') {
        const l = formatLocale(locale);

        return ctx.config.locales.includes(l);
    }

    return null;
};

const determineLocale = (localeHeader: string | string[] | undefined, ctx: ParameterizedContext): string | null => {
    // If wildcard is supplied, use default locale
    if (!localeHeader || localeHeader === '*') {
        return null;
    }

    if (Array.isArray(localeHeader)) {
        for (let i = 0; i < localeHeader.length; i++) {
            const l = getFormattedLocale(localeHeader[i], ctx);

            if (l) {
                return l;
            }
        }

        throw new Error(`Unsupported languages requested: "${localeHeader.join(', ')}". Please check your browser settings and try again.`);
    }

    // Check explicit length and for dash as this is faster than regex matching
    const l = getFormattedLocale(localeHeader as string, ctx);

    if (l) {
        return l;
    }

    throw new Error(`Unsupported language requested: "${localeHeader}". Please check your browser settings and try again.`);
};

export const locale = async (ctx: ParameterizedContext, next: Next): Promise<void> => {
    ctx.state.locale = determineLocale(ctx.headers['Accept-Language'], ctx) || ctx.config.defaultLocale;

    await next();
};
