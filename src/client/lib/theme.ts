import { createTheme, responsiveFontSizes } from '@material-ui/core/styles';

export const theme = responsiveFontSizes(createTheme({
    palette: {
        error: {
            main: '#e00808',
            contrastText: '#000000',
        },
        primary: {
            light: '#62DAF5',
            main: '#0099E0',
            dark: '#003F81',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#C5CEE0',
            contrastText: '#000000',
        },
        warning: {
            main: '#ff9800',
        },
        success: {
            main: '#4caf50',
        },
        background: {
            default: '#EDF1F7',
            paper: '#ffffff',
        },
    },
    shape: {
        borderRadius: 0,
    },
    typography: {
        fontFamily: ['open-sans', 'Montserrat', 'sans-serif'].join(','),
        fontWeightRegular: 300,
        fontWeightMedium: 400,
        fontWeightBold: 600,
        h1: {
            fontFamily: ['Montserrat', 'open-sans', 'sans-serif'].join(','),
            fontWeightRegular: 400,
            fontWeightMedium: 400,
            fontWeightBold: 600,
        },
        h2: {
            fontFamily: ['Montserrat', 'open-sans', 'sans-serif'].join(','),
            fontWeightRegular: 400,
            fontWeightMedium: 400,
            fontWeightBold: 600,
        },
    },
}));
