import {
    Grid,
    styled,
} from '@material-ui/core';

import { LogoIcon } from 'src/client/components/common/icons/Logo';

const StyledLogoIcon = styled(LogoIcon)`
    display: inline;
    vertical-align: middle;
`;

const StyledGrid = styled(Grid)`
    height: 100vh;
    text-align: center;
`;

export const Splash = (): JSX.Element => (
    <StyledGrid
        container
        item
        alignItems="center"
        justifyContent="center"
        xs={12}
    >
        <Grid item xs={4}>
            <StyledLogoIcon size="xxl" />
        </Grid>
    </StyledGrid>
);
