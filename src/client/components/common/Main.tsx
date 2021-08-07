import { HTMLProps } from 'react';
import { styled } from '@material-ui/core';

import { CSSGrid } from 'src/client/components/common/CSSGrid';

const StyledCSSGrid = styled(CSSGrid)(({ theme }) => ({
    flex: 1,
    gridGap: theme.spacing(4),
    gridTemplateAreas: `
            "header header"
            ". content"
        `,
    gridTemplateColumns: `${theme.spacing(4)} auto`,
    gridTemplateRows: 'auto auto 1fr',
    overflowY: 'auto',
}));

export const Main = (props: HTMLProps<HTMLDivElement>): JSX.Element => {
    const { children } = props;

    return (
        <StyledCSSGrid component="main">
            {children}
        </StyledCSSGrid>
    );
};
