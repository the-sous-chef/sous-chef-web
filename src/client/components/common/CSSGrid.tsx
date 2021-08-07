import clsx from 'clsx';
import { Theme } from '@material-ui/core';
import { OverridableComponent, OverrideProps } from '@material-ui/core/OverridableComponent';
import { makeStyles } from '@material-ui/styles';
import { SystemProps } from '@material-ui/system';
import { ElementType, forwardRef } from 'react';

export interface CSSGridTypeMap<P = Record<string, unknown>, D extends ElementType = 'div'> {
    props: P & SystemProps & {
        children?: React.ReactNode;
        gap?: number;
        gridTemplateAreas?: string;
    };
    defaultComponent: D;
}

export type CSSGridProps<
    D extends ElementType = CSSGridTypeMap['defaultComponent'],
    P = Record<string, unknown>
> = OverrideProps<CSSGridTypeMap<P, D>, D>;

const useStyles = makeStyles((theme: Theme) => ({
    container: {
        display: 'grid',
        gap: (props: CSSGridProps): string => (props.gap ? theme.spacing(props.gap) : 'unset'),
        gridTemplateAreas: (props: CSSGridProps): string => props.gridTemplateAreas || 'unset',
    },
}));

// @ts-ignore
export const CSSGrid: OverridableComponent<CSSGridTypeMap> = forwardRef((props: CSSGridProps, ref): JSX.Element => {
    const { className, component, ...rest } = props;
    const classes = useStyles(props);
    const Component = (component || 'div') as ElementType;

    return (<Component className={clsx(classes.container, className)} {...rest} ref={ref} />);
});
