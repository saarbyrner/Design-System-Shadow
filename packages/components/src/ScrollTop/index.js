// @flow
import { Box, Fab, Zoom } from '@kitman/playbook/components';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import type { SxProps, Theme } from '@mui/material/styles';

type Props = {
  threshold: number,
  sx?: SxProps<Theme>,
};

const ScrollTop = ({ threshold, sx = {} }: Props) => {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold,
  });

  return (
    <Zoom in={trigger}>
      <Box
        onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: 'smooth',
          })
        }
        role="presentation"
        sx={{
          position: 'fixed',
          ...sx,
        }}
      >
        <Fab color="primary" size="medium" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </Box>
    </Zoom>
  );
};

export default ScrollTop;
