// @flow
import { Box } from '@mui/material';
import colors from '@kitman/common/src/variables/colors';
import type { SxProps, Theme } from '@mui/material/styles';

type Props = {
  children: Array<React$Node>,
  sx?: SxProps<Theme>,
};

export default function GridFiltersContainer({ children, sx = {} }: Props) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        backgroundColor: colors.white,
        pt: 2,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}
