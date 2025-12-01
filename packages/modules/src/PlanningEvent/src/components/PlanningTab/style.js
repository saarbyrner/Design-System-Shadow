// @flow
import { colors } from '@kitman/common/src/variables';

const manageActivityButtonsVerticalMargin = '2.375rem';
const manageActivityButtonStyle = {
  padding: '0 .5625rem',
  color: `${colors.white} !important`,
  backgroundColor: `${colors.grey_200} !important`,
  borderRadius: '3px',
  height: '2rem',
  width: 'fit-content',
  transition: 'background-color .5s',
  ':hover': {
    color: `${colors.white} !important`,
    backgroundColor: `${colors.grey_300} !important`,
  },
};

const style = {
  activity: { marginLeft: '8.125rem' },
  manageActivityButtons: (numberOfDrills: number) => ({
    marginTop:
      numberOfDrills === 0 ? '1.375rem' : manageActivityButtonsVerticalMargin,
    marginBottom: manageActivityButtonsVerticalMargin,
    '.iconButton:before': { fontSize: '1rem' },
    '.iconButton__text': { marginTop: 0 },
  }),
  addActivityButton: {
    button: manageActivityButtonStyle,
  },
  createActivityButton: (isSecondaryButton: boolean) => ({
    button: {
      ...manageActivityButtonStyle,
      ...(isSecondaryButton
        ? {
            color: `${colors.grey_200} !important`,
            backgroundColor: `${colors.neutral_200} !important`,
          }
        : {}),
    },
  }),
  separator: {
    marginTop: '.5rem',
    marginBottom: '.5rem',
    borderWidth: '.5px',
    borderColor: colors.neutral_300,
    borderStyle: 'solid',
  },
  deleteActivityConfirmationText: {
    marginBottom: '3.3rem',
  },
  updateActivityOptions: {
    marginBottom: '1.3rem',
  },
  updateActivityActionButton: {
    display: 'flex',
  },
  optionsHeader: {
    fontWeight: '600',
  },
  deleteActivityConfirmationButtons: {
    footer: {
      borderTop: `solid 2px ${colors.neutral_300}`,
      justifyContent: 'space-between',
    },
  },
};

export default style;
