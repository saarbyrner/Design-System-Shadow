// @flow
import { colors } from '@kitman/common/src/variables';
import { type ObjectStyle } from '@kitman/common/src/types/styles';

export default ({
  alignItemsStart: { alignItems: 'start' },
  select: {
    '.kitmanReactSelect': {
      minWidth: '10rem',
    },
  },
  wrapper: {
    input: {
      height: '2.5rem',
      padding: '.62rem .5rem',
    },
    'input, textarea': {
      border: 'none',
      backgroundColor: colors.neutral_200,
      borderRadius: '.1875rem',
    },
    textarea: {
      padding: '.5rem',
      width: '100%',
    },
  },
  editLabel: {
    display: 'block',
    marginBottom: '.38rem',
    fontSize: '.875rem',
    fontWeight: 600,
  },
  inputControls: {
    paddingRight: '.125rem',
    paddingBottom: '.3rem',
    display: 'flex',
    alignItems: 'center',
    gap: '.5rem',
  },
  focusedInputElement: {
    boxShadow: `0 0 0 2px ${colors.blue_100}`,
    backgroundColor: `${colors.white} !important`,
  },
  inputElementButttons: {
    display: 'flex',
    gap: '.25rem',
    button: {
      height: '2rem',
      width: '2rem',
      paddingRight: '.5625rem',
      paddingLeft: '.5625rem',
      boxShadow: `
        0px 0px 1px 0px ${colors.neutral_light}4f,
        0px 3px 5px 0px ${colors.neutral_light}33
      `,
    },
  },
  labelWrapper: {
    color: colors.grey_200,
    padding: 0,
    border: 'none',
    background: 'none',
    display: 'flex',
    alignItems: 'end',
    gap: '.25rem',
    textAlign: 'left',
    '.icon-edit': {
      marginBottom: '.05rem',
    },
  },
}: ObjectStyle);
