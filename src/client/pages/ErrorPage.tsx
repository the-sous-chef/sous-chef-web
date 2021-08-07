import {
    Grid,
    Typography,
    Theme,
    Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { ComponentProps } from 'react';

export interface PropTypes extends ComponentProps<typeof Grid> {
    error: Error;
    onReset: (...args: unknown[]) => void;
}

const useStyles = makeStyles((theme: Theme) => ({
    action: {
        textAlign: 'center',
    },
    errorPage: {
        margin: 0,
        paddingTop: theme.spacing(8),
        width: '100%',
    },
    message: {
        whiteSpace: 'normal',
    },
}));

export const ErrorPage = (props: PropTypes): JSX.Element => {
    const { error, onReset, ...rest } = props;
    const classes = useStyles();

    return (
        <Grid
            container
            alignContent="center"
            className={classes.errorPage}
            direction="column"
            spacing={10}
            {...rest}
        >
            <Grid item>
                <Typography gutterBottom align="center" className="header" variant="h2">
                    Whoops!
                </Typography>
                <Typography gutterBottom align="center" className="subheader" variant="h3">
                    There&apos;s a slight problem on this page.
                </Typography>
            </Grid>
            <Grid item>
                {('guid' in error) && (
                    <Typography
                        paragraph
                        align="center"
                        variant="body1"
                    >
                        {/* @ts-expect-error */}
                        {error.guid}
                    </Typography>
                )}
                <Typography
                    align="center"
                    className={classes.message}
                    component="pre"
                    variant="body1"
                >
                    {error.message}
                </Typography>
            </Grid>
            {process.env.DEPLOYMENT !== 'development' && (
                <Grid item>
                    <pre>{error.stack}</pre>
                </Grid>
            )}
            <Grid item className={classes.action}>
                <Button variant="contained" onClick={onReset}>Try again</Button>
            </Grid>
        </Grid>
    );
};
