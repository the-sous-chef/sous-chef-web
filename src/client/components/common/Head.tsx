import { useTheme } from '@material-ui/core';
import { Helmet } from 'react-helmet';

export const Head = (): JSX.Element => {
    const theme = useTheme();

    return (
        <Helmet>
            <meta charSet="UTF-8" />
            <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no" />
            <meta name="format-detection" content="telephone=no" />
            <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
            <meta name="theme-color" content={theme.palette.primary.main} />
            <meta name="robots" content="noindex, nofollow" />
            <meta name="referrer" content="strict-origin-when-cross-origin" />

            <title>Sous Chef</title>

            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600&display=swap');
                    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&family=Open+Sans:wght@400;600&display=swap');
                `}
            </style>

            <style type="text/css">
                {`
                    html, body, #app {
                        height: 100%;
                    }

                    #app {
                        display: flex;
                        overflow: hidden;
                    }
                `}
            </style>
        </Helmet>
    );
};
