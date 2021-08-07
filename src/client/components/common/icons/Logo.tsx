import { styled, Theme, useTheme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';

export interface PropTypes extends React.HTMLAttributes<HTMLSpanElement> {
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
}

interface SvgContainerPropTypes extends PropTypes {
    viewBoxWidth: string;
    viewBoxHeight: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    xs: {
        height: theme.spacing(4),
        width: theme.spacing(4),
    },
    sm: {
        height: theme.spacing(6),
        width: theme.spacing(6),
    },
    md: {
        height: theme.spacing(10),
        width: theme.spacing(10),
    },
    lg: {
        height: theme.spacing(16),
        width: theme.spacing(16),
    },
    xl: {
        height: theme.spacing(26),
        width: theme.spacing(26),
    },
    xxl: {
        height: theme.spacing(42),
        width: theme.spacing(42),
    },
}));

const Icon = (): JSX.Element => {
    const theme = useTheme();

    return (
        <svg
            version="1.0"
            xmlns="http://www.w3.org/2000/svg"
            width="512.000000pt"
            height="512.000000pt"
            viewBox="0 0 512.000000 512.000000"
            preserveAspectRatio="xMidYMid meet"
        >
            <g
                transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                fill={theme.palette.primary.main}
                stroke="none"
            >
                <path d="M2330 5109 c-124 -11 -257 -33 -405 -69 -131 -32 -266 -75 -274 -89
            -4 -4 -44 -23 -91 -40 -173 -67 -449 -223 -529 -299 -15 -15 -68 -58 -117 -97
            -113 -89 -220 -196 -309 -309 -38 -49 -82 -102 -97 -117 -26 -28 -108 -143
            -108 -153 0 -2 -20 -39 -45 -81 -64 -107 -108 -197 -146 -295 -17 -47 -36 -87
            -40 -91 -23 -15 -101 -296 -133 -484 -68 -387 -29 -882 99 -1254 14 -41 29
            -77 34 -80 4 -4 23 -44 40 -91 67 -173 223 -449 299 -529 15 -15 59 -68 97
            -117 89 -113 196 -220 309 -309 49 -38 102 -82 117 -97 80 -76 356 -232 529
            -299 47 -17 87 -36 91 -40 15 -23 296 -101 484 -133 387 -68 882 -29 1254 99
            41 14 77 29 80 34 4 4 44 23 91 40 98 38 188 82 295 146 42 25 79 45 81 45 10
            0 125 82 153 108 15 15 68 59 117 97 113 89 220 196 309 309 39 49 82 102 97
            117 76 80 232 356 299 529 17 47 36 87 40 91 23 15 101 296 133 484 68 387 29
            882 -99 1254 -14 41 -29 77 -34 80 -4 4 -23 44 -40 91 -38 98 -82 188 -146
            295 -25 42 -45 79 -45 81 0 10 -82 125 -108 153 -15 15 -58 68 -97 117 -89
            113 -196 220 -309 309 -49 39 -102 82 -117 97 -28 26 -143 108 -153 108 -2 0
            -39 20 -81 45 -107 64 -197 108 -295 146 -47 17 -87 36 -91 40 -15 24 -301
            102 -484 133 -199 34 -446 43 -655 25z m-456 -1033 c72 -19 230 -60 351 -91
            121 -31 238 -67 261 -80 41 -24 84 -78 103 -128 7 -19 11 -201 11 -525 0 -466
            -1 -500 -19 -532 -34 -64 -66 -75 -240 -78 l-153 -4 6 -121 c4 -67 11 -198 16
            -292 5 -93 14 -258 20 -365 6 -107 15 -271 20 -365 19 -324 18 -375 -8 -418
            -73 -116 -251 -116 -324 0 -30 50 -31 23 12 808 5 99 14 266 20 370 5 105 13
            233 16 287 l7 96 -156 4 c-169 3 -183 8 -231 72 -21 27 -21 37 -21 661 0 627
            0 634 21 662 31 42 83 73 122 73 19 0 94 -16 166 -34z m1139 -325 c62 -17 175
            -46 252 -66 162 -41 204 -57 239 -94 55 -57 56 -68 56 -479 0 -378 0 -379 -23
            -413 -30 -45 -71 -58 -186 -58 l-93 -1 6 -122 c4 -68 11 -199 16 -293 5 -93
            14 -258 20 -365 6 -107 15 -271 20 -365 19 -324 18 -375 -8 -418 -53 -84 -171
            -113 -257 -62 -23 13 -49 34 -57 47 -37 58 -38 76 -18 451 38 715 41 774 51
            920 5 82 9 161 9 177 l0 28 -104 4 c-87 2 -109 7 -133 24 -53 40 -53 33 -53
            547 0 522 0 520 58 551 40 22 81 19 205 -13z"
                />
                <path d="M1665 4015 l-25 -24 0 -611 0 -611 25 -25 c23 -23 30 -25 117 -22
            l93 3 5 246 c5 269 6 270 67 296 29 11 44 11 125 -7 131 -29 151 -37 184 -71
            l29 -30 5 -217 5 -217 89 -3 c67 -2 94 1 112 13 l24 15 0 504 0 503 -23 33
            c-33 50 -66 65 -242 110 -88 23 -246 63 -351 91 -105 27 -196 49 -203 49 -7 0
            -23 -11 -36 -25z"
                />
                <path d="M1960 3181 c-6 -12 -10 -107 -10 -240 l0 -221 130 0 130 0 0 194 c0
            170 -2 196 -17 215 -12 13 -51 29 -113 46 -114 30 -107 30 -120 6z"
                />
                <path d="M2046 2538 c-12 -204 -39 -708 -56 -1043 -6 -110 -12 -229 -15 -263
            -8 -108 30 -162 113 -162 35 0 49 6 73 29 28 28 29 33 29 118 0 48 -4 160 -10
            248 -5 88 -14 257 -20 375 -16 321 -29 583 -36 698 l-6 102 -33 0 -33 0 -6
            -102z"
                />
                <path d="M2842 3698 c-17 -17 -17 -949 0 -966 7 -7 40 -12 80 -12 l68 0 0 179
            c0 178 0 180 26 210 29 34 65 40 139 21 156 -41 165 -54 165 -259 l0 -151 68
            0 c40 0 73 5 80 12 9 9 12 108 12 385 0 314 -2 379 -15 403 -23 44 3 35 -416
            144 -197 52 -191 50 -207 34z"
                />
                <path d="M3065 3058 c-3 -8 -4 -86 -3 -173 l3 -160 88 -3 88 -3 -3 153 -3 153
            -50 16 c-85 28 -114 32 -120 17z"
                />
                <path d="M3116 2538 c-17 -297 -27 -484 -37 -678 -6 -118 -16 -321 -23 -450
            -7 -136 -9 -248 -4 -267 20 -75 122 -100 179 -44 28 28 29 34 29 116 0 47 -4
            161 -10 253 -5 92 -14 262 -20 377 -21 412 -30 591 -36 693 l-6 102 -33 0 -33
            0 -6 -102z"
                />
            </g>
        </svg>
    );
};

const StyledText = styled('text')(({ theme }) => (`
    font-family: Montserrat;
    font-size: 200;
    font-style: normal;
    font-weight: 700;
    stroke: none;
    stroke-width: 1;
    stroke-dasharray: none;
    stroke-linecap: butt;
    stroke-dashoffset: 0;
    stroke-linejoin: miter;
    stroke-miterlimit: 4;
    fill: ${theme.palette.primary.main};
    fill-rule: nonzero;
    opacity: 1;
    white-space: pre;
`));

const StyledRect = styled('rect')`
    stroke: none;
    stroke-width: 1;
    stroke-dasharray: none;
    stroke-linecap: butt;
    stroke-dashoffset: 0;
    stroke-linejoin: miter;
    stroke-miterlimit: 4;
    /* fill: rgb(255,255,255); */
    fill-rule: nonzero;
    opacity: 1;
`;

const CompanyName = (): JSX.Element => (
    <>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            version="1.1"
            width="600"
            height="400"
            viewBox="0 0 600 400"
            xmlSpace="preserve"
        >
            <g transform="matrix(1 0 0 1 300 200)">
                <StyledRect
                    vectorEffect="non-scaling-stroke"
                    x="-300"
                    y="-200"
                    rx="0"
                    ry="0"
                    width="600"
                    height="400"
                />
            </g>
            <g transform="matrix(Infinity NaN NaN Infinity 0 0)" />
            <g transform="matrix(0.37 0 0 0.37 300 200)">
                <StyledText xmlSpace="preserve">
                    <tspan x="-402" y="62.83">S</tspan>
                    <tspan x="-280" y="62.83">o</tspan>
                    <tspan x="-184.2" y="62.83">u</tspan>
                    <tspan x="-75.2" y="62.83">s</tspan>
                    <tspan x="-4" y="62.83" style={{ whiteSpace: 'pre' }} />
                    <tspan x="47.4" y="62.83">C</tspan>
                    <tspan x="154.8" y="62.83">h</tspan>
                    <tspan x="263.8" y="62.83">e</tspan>
                    <tspan x="348.6" y="62.83">f</tspan>
                </StyledText>
            </g>
        </svg>
    </>
);

const StyledSpan = styled('span')`
    display: block;
    tex-align: center;
`;

const SvgContainer = (props: SvgContainerPropTypes): JSX.Element => {
    const {
        children,
        size = 'md',
        viewBoxHeight,
        viewBoxWidth,
        ...rest
    } = props;
    const classes = useStyles();

    return (
        <StyledSpan {...rest}>
            <svg
                className={classes[size]}
                display="inherit"
                version="1.2"
                baseProfile="tiny"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                x="0px"
                y="0px"
                viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
                xmlSpace="preserve"
            >
                {children}
            </svg>
        </StyledSpan>
    );
};

export const FullLogo = (props: PropTypes): JSX.Element => (
    <SvgContainer viewBoxHeight="87" viewBoxWidth="443" {...props}>
        <Icon />
        <CompanyName />
    </SvgContainer>
);

export const LogoIcon = (props: PropTypes): JSX.Element => (
    <SvgContainer viewBoxHeight="80" viewBoxWidth="100" {...props}>
        <Icon />
    </SvgContainer>
);
