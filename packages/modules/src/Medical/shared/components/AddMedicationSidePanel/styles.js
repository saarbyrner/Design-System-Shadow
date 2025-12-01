// @flow
import { colors } from '@kitman/common/src/variables';

export default {
  actions: {
    alignItems: 'center',
    background: colors.p06,
    borderTop: `1px solid ${colors.neutral_300}`,
    display: 'flex',
    height: '80px',
    justifyContent: 'flex-end',
    padding: '24px',
    textAlign: 'center',
    width: '100%',
    zIndex: 1000,
  },
  addLotButton: {
    gridColumn: '1 / 3',
    marginBottom: '16px',
  },
  askOnEntryQuestionsContainer: {
    columnGap: '8px',
    display: 'grid',
    gridColumn: 'span 2',
    gridTemplateColumns: '1fr 1fr',
  },
  askOnEntryQuestion: {
    gridColumn: '1',
    padding: '4px 0',
  },
  askOnEntryOptionalText: {
    gridColumn: '2',
    padding: '4px 0',
  },
  questionWithOptionalTextContainer: {
    columnGap: '8px',
    display: 'grid',
    gridColumn: 'span 2',
    gridTemplateColumns: '1fr 1fr',
  },
  content: {
    display: 'grid',
    columnGap: '8px',
    gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr',
    gridAutoRows: 'min-content',
    padding: '24px',
    overflow: 'auto',
    flex: 1,
  },
  date: {
    gridColumn: '1 / 4',
    marginBottom: '16px',
  },
  divider: {
    borderBottom: `1px solid ${colors.neutral_300}`,
    width: '100%',
    display: 'flex',
    margin: '10px 0',
    gridColumn: '1 / 9',
  },
  tapered: {
    gridColumn: '1 / 3',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'baseline',
  },
  checkboxLabel: {
    color: colors.s18,
    fontSize: '14px',
    marginLeft: '10px',
  },
  directions: {
    gridColumn: '1 / 3',
    marginBottom: '16px',
  },
  dose: {
    gridColumn: '3 / 5',
    marginBottom: '16px',
  },
  duration: {
    gridColumn: '5 / 7',
    marginBottom: '16px',
  },
  endDate: {
    gridColumn: '3 / 5',
    marginBottom: '16px',
  },
  frequency: {
    gridColumn: '5 / 7',
    marginBottom: '16px',
  },
  fullWidth: {
    gridColumn: '1 / 9',
    marginBottom: '16px',
  },
  errorMessage: {
    color: colors.red_200,
    fontWeight: 600,
    fontSize: '11px',
  },
  injuryIllness: {
    gridColumn: '1 / 9',
    marginBottom: '16px',
  },
  logDispenseButtonContainer: {
    gridColumn: '1 / 9',
    marginBottom: '6px',
    display: 'flex',
  },
  logButton: {
    marginLeft: '15px',
    display: 'flex',
  },
  lot: {
    gridColumn: '1 / 5',
    marginBottom: '16px',
  },
  lotQuantity: {
    gridColumn: '5 / 8',
    marginBottom: '16px',
  },
  medication: {
    gridColumn: '1 / 9',
    marginBottom: '16px',
  },
  optionalQuantity: {
    gridColumn: '5 / 8',
    marginBottom: '16px',
  },
  player: {
    gridColumn: '1 / 5',
    marginBottom: '16px',
  },
  practitioner: {
    gridColumn: '1 / 9',
    marginBottom: '16px',
  },
  removeLotButton: {
    gridColumn: '8 / 9',
    margin: 'auto',
  },
  route: {
    gridColumn: '7 / 9',
    marginBottom: '16px',
  },
  sidePanel: {
    '.slidingPanel': {
      display: 'flex',
      flexDirection: 'column',
    },
    '.slidingPanel__heading': {
      minHeight: '80px',
      maxHeight: '80px',
      marginBottom: '0',
    },
  },
  startDate: {
    gridColumn: '1 / 3',
    marginBottom: '16px',
  },
  dateNew: {
    gridColumn: '1 / 3',
    marginBottom: '16px',
  },
  textField: {
    fontFamily: 'Open Sans',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '14px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    color: colors.grey_200,
  },
  total: {
    gridColumn: '7 / 9',
    marginBottom: '16px',
  },
};
