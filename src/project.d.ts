// Declare module for Unstable_Grid2 to fix TypeScript errors
declare module '@mui/material/Unstable_Grid2' {
  import { ElementType, ReactNode } from 'react';
  import { SxProps } from '@mui/system';
  import { Theme } from '@mui/material/styles';

  export interface GridProps {
    children?: ReactNode;
    container?: boolean;
    item?: boolean;
    xs?: number | 'auto';
    sm?: number | 'auto';
    md?: number | 'auto';
    lg?: number | 'auto';
    xl?: number | 'auto';
    spacing?: number;
    direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
    component?: ElementType;
    sx?: SxProps<Theme>;
    [prop: string]: any;
  }

  const Grid: React.FC<GridProps>;
  export default Grid;
}
