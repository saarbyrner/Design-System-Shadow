// @flow
import { createTheme } from '@mui/material';
import { colors, zIndices } from '@kitman/common/src/variables';

// Main AppRoot Theme
export const rootTheme = createTheme({
  components: {
    /**
     * INPUTS
     */
    MuiButton: {
      defaultProps: {
        color: 'primary',
        size: 'medium',
        variant: 'contained',
        disableElevation: true,
      },
    },
    MuiButtonGroup: {
      defaultProps: {
        color: 'primary',
        orientation: 'horizontal',
        variant: 'contained',
      },
    },
    MuiCheckbox: {
      defaultProps: {
        color: 'primary',
        size: 'medium',
      },
    },
    MuiFab: {
      defaultProps: {
        color: 'default',
        size: 'large',
        variant: 'circular',
      },
    },
    MuiFormControl: {
      defaultProps: {
        fullWidth: true,
        size: 'medium',
        variant: 'filled',
      },
    },
    MuiRadio: {
      defaultProps: {
        color: 'primary',
        size: 'medium',
      },
    },
    MuiRating: {
      defaultProps: {
        size: 'medium',
      },
    },
    MuiSelect: {
      defaultProps: {
        size: 'small',
        variant: 'filled',
      },
    },
    MuiSlider: {
      defaultProps: {
        color: 'primary',
        orientation: 'horizontal',
        size: 'medium',
      },
    },
    MuiSwitch: {
      defaultProps: {
        color: 'primary',
        size: 'medium',
      },
    },
    MuiTextField: {
      defaultProps: {
        size: 'small',
        variant: 'filled',
      },
      styleOverrides: {
        root: {
          '& .Mui-disabled': {
            opacity: 0.5,
            color: colors.grey_disabled,
            textFillColor: colors.grey_200,
          },
        },
      },
    },
    MuiToggleButton: {
      defaultProps: {
        size: 'medium',
      },
    },
    MuiToggleButtonGroup: {
      defaultProps: {
        size: 'medium',
      },
    },

    /**
     * DATA DISPLAY
     */

    MuiAvatar: {
      defaultProps: {
        sx: {
          height: '40px',
          width: '40px',
        },
        variant: 'circular',
      },
    },
    MuiBadge: {
      defaultProps: {
        color: 'default',
        variant: 'standard',
      },
    },
    MuiChip: {
      defaultProps: {
        color: 'default',
        size: 'medium',
        variant: 'filled',
      },
    },
    MuiIcon: {
      defaultProps: {
        fontSize: 'medium',
      },
    },

    /**
     * SURFACES
     */

    MuiAccordion: {
      defaultProps: {
        disableGutters: true,
      },
      styleOverrides: {
        root: {
          boxShadow: 'unset',
          '&.MuiAccordion-root': {
            '::before': { opacity: 1 },
          },
        },
      },
    },

    /**
     * NOTIFY
     */

    MuiAlert: {
      styleOverrides: {
        root: {
          '&.MuiAlert-standardWarning': {
            backgroundColor: colors.beige_50,
            color: colors.brown_600,
          },
          '&.MuiAlert-filledWarning': {
            backgroundColor: colors.orange_400,
          },
        },
      },
    },

    /**
     * DATE & TIME PICKERS
     */

    MuiDatePicker: {
      defaultProps: {
        showDaysOutsideCurrentMonth: true,
      },
    },
  },
  palette: {
    text: {
      primary: colors.grey_200,
      secondary: colors.grey_300,
      disabled: colors.grey_disabled,
    },
    primary: {
      main: colors.grey_200,
      dark: colors.grey_400,
      light: colors.grey_100,
      contrastText: colors.white,
      focus: colors.grey_200_12,
    },
    secondary: {
      main: colors.neutral_200,
      dark: colors.neutral_400,
      light: colors.neutral_100,
      contrastText: colors.grey_200,
    },
    error: {
      main: colors.red_200,
      dark: colors.red_300,
      light: colors.red_100,
      light2: colors.red_light,
      contrastText: colors.white,
    },
    warning: {
      main: colors.orange_200,
      dark: colors.orange_300,
      light: colors.orange_100,
      lighter: colors.yellow_100,
      contrastText: colors.white,
    },
    info: {
      main: colors.grey_200,
      dark: colors.grey_400,
      light: colors.grey_100,
      lightBlue: colors.blue_info,
      contrastText: colors.white,
    },
    success: {
      main: colors.green_200,
      dark: colors.green_300,
      light: colors.green_100,
      contrastText: colors.white,
    },
    background: {
      default: colors.white,
      paper: colors.white,
    },
    border: {
      default: colors.grey_100_50,
      light: colors.p04,
    },
    common: {
      white: colors.white,
      black: colors.grey_200,
    },
  },
  typography: {
    fontFamily: `"Open Sans"`,
    h1: {
      fontSize: 96,
    },
    h2: {
      fontSize: 60,
    },
    h3: {
      fontSize: 48,
    },
    h4: {
      fontSize: 34,
    },
    h5: {
      fontSize: 24,
    },
    h6: {
      fontSize: 20,
    },
    subtitle1: {
      fontSize: 16,
    },
    subtitle2: {
      fontSize: 14,
    },
    body1: {
      fontSize: 16,
    },
    body2: {
      fontSize: 14,
    },
    caption: {
      fontSize: 12,
    },
    overline: {
      fontSize: 12,
    },
    button: {
      textTransform: 'none',
    },
  },
  zIndex: {
    // fixes the issue where select dropdown are shown under the drawer when opened
    modal: zIndices.modal,
  },
});

export default rootTheme;
