// @flow
import type { CSSObject } from '@mui/material/styles';
import { zIndices } from '@kitman/common/src/variables';

const DRAWER_WIDTH = '500px';

export const isClosedMixin = ({ theme }: { theme: Object }): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
  overflowX: 'hidden',
});

export const isOpenMixin = ({ theme }: { theme: Object }): CSSObject => ({
  width: '100vw',
  [theme.breakpoints.up('sm')]: {
    width: DRAWER_WIDTH,
  },
  overflowX: 'hidden',
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
});

export const drawerPositionMixin = ({
  theme,
}: {
  theme: Object,
}): CSSObject => ({
  top: '0px',
  right: '0px',
  position: 'fixed',
  [theme.breakpoints.up('lg')]: {
    right: `00px`,
    top: '0px',
  },
});

export const drawerMixin = ({
  theme,
  isOpen,
}: {
  theme: Object,
  isOpen: boolean,
}): CSSObject => {
  return {
    flexShrink: 0,
    p: 2,
    height: `100vh`,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    zIndex: zIndices.drawer,
    '& .MuiDrawer-root': {
      ...drawerPositionMixin({ theme }),
      height: `100vh`,
      width: '100vw',
      [theme.breakpoints.up('sm')]: {
        width: DRAWER_WIDTH,
      },
    },

    ...(isOpen && {
      ...isOpenMixin({ theme }),
      '& .MuiDrawer-paper': isOpenMixin({ theme }),
      display: 'flex',
    }),
    ...(!isOpen && {
      ...isClosedMixin({ theme }),
      '& .MuiDrawer-paper': isClosedMixin({ theme }),
    }),
  };
};
