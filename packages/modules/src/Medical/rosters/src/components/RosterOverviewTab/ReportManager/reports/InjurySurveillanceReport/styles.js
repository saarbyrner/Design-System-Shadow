// @flow
import {
  colors,
  shadows,
  animations,
  zIndices,
} from '@kitman/common/src/variables';

export const colorByStatus = {
  SUCCESS: colors.green_100,
  ERROR: colors.red_200,
};

const drawer = {
  zIndex: zIndices.slidingPanel,
};

const drawerHeader = {
  padding: '0 24px',
  borderBottom: `1px solid #e6e6e6`,
  height: '70px',
};

const drawerTitle = {
  fontSize: '18px',
};

const drawerBody = {
  padding: '24px',
};

const drawerFooter = {
  padding: '0 24px',
  borderTop: `1px solid #e6e6e6`,
  height: '80px',
};

const statusColor = (isSuccess: boolean) =>
  isSuccess ? colors.green_100 : colors.red_200;

const snackbar = (isSuccess: boolean) => ({
  '.MuiSnackbarContent-root': {
    animation: `${animations.toastIn} 0.2s ease-out forwards`,
    backgroundColor: `${colors.white}`,
    borderRadius: '4px',
    borderLeft: `4px solid ${statusColor(isSuccess)}`,
    boxShadow: `${shadows.elevation_1}`,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: '8px',
    minWidth: '400px',
    minHeight: '110px',

    '.MuiSnackbarContent-message': {
      fontSize: '16px',
      color: `${colors.grey_300}`,
      maxWidth: '100%',
    },
  },
});

const snackbarLink = {
  textDecoration: 'none',
  fontWeight: 600,
  color: colors.grey_300,
};

const snackbarHeader = {
  lineHeight: 1,
};

const tooltip = {
  zIndex: zIndices.tooltip,
};

export default {
  drawer,
  drawerHeader,
  drawerBody,
  drawerFooter,
  drawerTitle,
  snackbar,
  statusColor,
  snackbarLink,
  snackbarHeader,
  tooltip,
};
