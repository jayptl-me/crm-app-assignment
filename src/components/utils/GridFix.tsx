// Fix for MUI Grid compatibility issues
// This will need to be imported where Grid is used
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

// Create a Row component to replace Grid container
export const Row = styled(Box)({
    display: 'flex',
    flexWrap: 'wrap',
    margin: '-12px',
});

// Create a Col component to replace Grid item
export const Col = styled(Box)<{
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
}>(({ theme, xs = 12, sm, md, lg, xl }) => {
    // Create responsive width based on the grid system (12 columns)
    const getWidth = (columns: number) => `${(columns / 12) * 100}%`;

    return {
        padding: '12px',
        flexGrow: 0,
        maxWidth: getWidth(xs),
        flexBasis: getWidth(xs),

        [theme.breakpoints.up('sm')]: {
            ...(sm && {
                maxWidth: getWidth(sm),
                flexBasis: getWidth(sm),
            }),
        },

        [theme.breakpoints.up('md')]: {
            ...(md && {
                maxWidth: getWidth(md),
                flexBasis: getWidth(md),
            }),
        },

        [theme.breakpoints.up('lg')]: {
            ...(lg && {
                maxWidth: getWidth(lg),
                flexBasis: getWidth(lg),
            }),
        },

        [theme.breakpoints.up('xl')]: {
            ...(xl && {
                maxWidth: getWidth(xl),
                flexBasis: getWidth(xl),
            }),
        },
    };
});
