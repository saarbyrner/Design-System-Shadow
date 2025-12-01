// @flow
import type { CSSObject } from '@mui/material/styles';

import { zIndices } from '@kitman/common/src/variables';

const DRAWER_WIDTH = '500px';

export const isOpenMixin = ({ theme }: { theme: Object }): CSSObject => ({
  width: '100vw',
  [theme.breakpoints.up('sm')]: {
    width: DRAWER_WIDTH,
  },
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

export const isClosedMixin = ({ theme }: { theme: Object }): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

export const drawerPositionMixin = ({
  theme,
}: {
  theme: Object,
}): CSSObject => ({
  position: 'fixed',
  right: '0px',
  top: '0px',
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
    height: `100vh`,
    flexShrink: 0,
    p: 2,
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
