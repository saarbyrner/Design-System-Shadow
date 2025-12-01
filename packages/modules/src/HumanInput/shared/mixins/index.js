// @flow

import type { CSSObject } from '@mui/material/styles';

import { DRAWER_WIDTH } from '@kitman/modules/src/HumanInput/shared/constants';

export const isOpenMixin = ({ theme }: { theme: Object }): CSSObject => ({
  width: DRAWER_WIDTH,
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
  width: `calc(${theme.spacing(6)} + 2px)`,
});

export const drawerPositionMixin = ({
  theme,
}: {
  theme: Object,
  withTabs?: boolean,
}): CSSObject => ({
  position: 'absolute',
  left: '0px',
  [theme.breakpoints.up('lg')]: {
    left: `60px`,
  },
});

export const drawerToggleMixin = ({
  isOpen,
}: {
  isOpen: boolean,
}): CSSObject => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: isOpen ? 'flex-end' : 'center',
  px: 2,
});

export const drawerMixin = ({
  theme,
  isOpen,
}: {
  theme: Object,
  isOpen: boolean,
}): CSSObject => {
  return {
    height: '100%',
    width: DRAWER_WIDTH,
    flexShrink: 0,
    p: 2,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    '& .MuiDrawer-root': {
      ...drawerPositionMixin({ theme }),
    },
    '& .MuiPaper-root': {
      ...drawerPositionMixin({ theme }),
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
