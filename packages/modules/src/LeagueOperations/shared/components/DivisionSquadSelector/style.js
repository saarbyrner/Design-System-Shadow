// @flow
import { colors } from '@kitman/common/src/variables';

const menuItemSx = {
  justifyContent: 'space-between',
  alignItems: 'center',
  color: `${colors.grey_200}!important`,
  transition: 'background 0.2s',
  padding: '6px 16px',
  fontSize: '16px',
  lineHeight: '150%',
  letterSpacing: '0.15px',
  minHeight: 'auto',

  '&:hover': {
    backgroundColor: colors.p01_Opacity08,
    cursor: 'pointer',
  },

  '&.Mui-selected': {
    background: colors.p01_Opacity08,
    fontSize: '16px',
    lineHeight: '150%',
    letterSpacing: '0.15px',
  },

  '&.Mui-disabled': {
    opacity: 1,
    fontWeight: 300,
  },
};

const menuPropsSx = {
  marginTop: 1,

  '& .MuiList-root': { minWidth: '285px' },
};

const selectSx = {
  '.MuiSelect-select': {
    minWidth: '30px',
    display: 'flex',
    alignItems: 'center',
    color: colors.s17,
    fontSize: '14px',
    fontWeight: 600,
    padding: 0,

    '&:focus': {
      backgroundColor: 'transparent',
    },

    '@media only screen and (max-width: 1200px)': {
      color: colors.p06,
    },

    '@media only screen and (max-width: 764px)': {
      width: 0,
      color: 'transparent',
    },
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
};

const formControlSx = {
  paddingRight: '10px',
  outline: 'none',
  display: 'flex',
  flexDirection: 'row',
};

const dropdownIconSx = {
  position: 'absolute',
  right: 0,
  zIndex: -1,
  margin: 0,
};

const checkIconSx = {
  color: colors.grey_200,
  verticalAlign: 'middle',
};

export default {
  menuItemSx,
  menuPropsSx,
  selectSx,
  formControlSx,
  dropdownIconSx,
  checkIconSx,
};
