// @flow
import { colors } from '@kitman/common/src/variables';
import { convertPixelsToREM } from '@kitman/common/src/utils/css';

const style = {
  section: {
    padding: '8px 24px',
    overflowX: 'hidden',
  },
  sectionTitle: {
    color: colors.grey_100,
    display: 'flex',
    fontSize: '12px',
    fontWeight: 600,
    marginBottom: '4px',
  },
  flexAndMargin: {
    display: 'flex',
    marginTop: '10px',
  },
  margintop: {
    marginTop: '10px',
  },

  counterContentDiv: {
    position: 'absolute',
    fontSize: '12px',
    width: '100%',
    textAlign: 'right',
    color: colors.grey_100,
    fontWeight: 'normal',
    marginTop: '4px',
  },

  widthFull: {
    width: '100%',
  },

  flexCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    width: '100%',
  },
  datepickerWrapper: {
    width: '200px',
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    gap: '16px',
    width: '100%',
  },
  flexCell: {
    flex: 1,
  },
  marginLeftAndRight: {
    margin: '0 8px',
  },
  examinationDate: {
    width: '50%',
  },
  squadSelector: {
    width: '50%',
  },
  pathologySelect: {
    width: '60%',
  },
  pathologyForm: {
    position: 'relative',
    '.iconButton': {
      position: 'absolute',
      right: 0,
      top: '12px',
    },
  },
  supplementalPathologyRow: {
    width: '80%',
    display: 'flex',
    '.iconButton': {
      display: 'flex',
      alignItems: 'end',
      marginTop: '6px',
      justifyContent: 'end',
    },
  },
  marginTop4: {
    marginTop: '4px',
  },
  bamic: {
    width: '100%',
    display: 'flex',
    gap: '16px',
    '.kitmanReactSelect': {
      width: '100%',
    },
  },
  codingSystemDetails: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    marginTop: convertPixelsToREM(16),
    minHeight: convertPixelsToREM(42),
  },
  codingSystemItems: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    marginTop: '16px',
    minHeight: '42px',
  },
  codingItem: {
    display: 'flex',
    flexDirection: 'column',
    width: '33%',
  },
  itemWithAction: {
    display: 'flex',
    flexDirection: 'row',
    background: 'red',
  },
  emrInjuryType: {
    width: '40%',
  },
  sideSegmentedControl: {
    width: '60%',
    marginTop: '3px',
  },
  form: {
    marginTop: '32px',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridTemplateRows: '1fr 1fr',
    gap: '16px',
    padding: '0 24px',
  },
  fullWidth: {
    gridColumn: '1/3',
  },
  grid: {
    display: 'grid',
    columnGap: '8px',
    gridTemplateColumns: 'repeat(12, [col] 1fr)',
    gridAutoRows: 'repeat(12, [row] 1fr)',
    overflow: 'auto',
    margin: '8px 0',
  },
  borderBottom: {
    paddingBottom: '16px',
    borderBottom: `1px solid ${colors.neutral_300}`,
  },
  borderTop: {
    paddingTop: '16px',
    borderTop: `1px solid ${colors.neutral_300}`,
  },
  paddingTop16: {
    paddingTop: '16px',
  },
  hiddenLink: {
    display: 'none',
  },
  supplementalPathologyLink: {
    color: colors.grey_200,
    cursor: 'pointer',
    fontWeight: 600,
    lineHeight: '28px',
    margin: '28px 4px 0',
    whiteSpace: 'nowrap',
    gridColumn: '8 / span 5',
  },
  supplementalRecurrence: {
    color: colors.grey_200,
    cursor: 'pointer',
    fontWeight: 600,
    lineHeight: '28px',
    margin: '8px 4px 0',
    whiteSpace: 'nowrap',
  },
  classification: {},
  colLeft: {
    margin: '4px 0',
    gridColumn: '1 / span 3',
  },
  colRight: {
    margin: '8px 0',
    gridColumn: '4 / span 3',
  },
  colFull: {
    margin: '8px 0',
    gridColumn: '1 / span 6',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '8px',
    marginTop: '16px',
    '.datePicker': {
      flex: 1,
      maxWidth: '50%',
    },
    '.inputText': {
      flex: 1,
    },
    '.iconButton': {
      color: colors.grey_200,
    },
    '.kitmanReactSelect': {
      width: '100%',
    },
    '.segmentedControl': {
      width: '400px',
      span: {
        lineHeight: '20px',
      },
    },
    '.richTextEditor--kitmanDesignSystem': {
      width: '100%',
    },
    '.textarea': {
      width: '100%',
    },
  },
  rowIndented: {
    borderTop: `1px solid ${colors.neutral_300}`,
    borderBottom: `1px solid ${colors.neutral_300}`,
    borderLeft: `5px solid ${colors.neutral_400}`,
    padding: '15px',
    marginBottom: '24px',
  },
  rowIndentedNoMargin: {
    borderTop: `1px solid ${colors.neutral_300}`,
    borderBottom: `1px solid ${colors.neutral_300}`,
    borderLeft: `5px solid ${colors.neutral_400}`,
    padding: '15px',
    marginTop: 0,
    marginBottom: 0,
  },
  yesNoSelector: {
    '.segmentedControl': {
      width: '130px !important',
    },
  },
  topRow: {
    marginTop: '24px',
  },
  athleteItem: {
    display: 'flex',
    height: '30px',
  },
  heightFull: {
    height: '100%',
  },
  athleteImage: {
    borderRadius: '3px',
    height: '24px',
    width: '24px',
  },
  athleteName: {
    color: colors.grey_300,
    margin: '5px 0 0 8px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    width: '160px',
  },
  bottomRow: {
    borderBottom: `1px solid ${colors.neutral_300}`,
    paddingBottom: '24px',
  },
  divider: {
    borderBottom: `1px solid ${colors.neutral_300}`,
    width: '100%',
    display: 'flex',
    margin: '16px 0',
  },
  pathologyRow: {
    width: '100%',
    paddingBottom: '24px',
    borderBottom: `1px solid ${colors.neutral_300}`,
    '.kitmanReactSelect': {
      width: '385px',
    },
  },
  previousIssueRow: {
    '.kitmanReactSelect': {
      width: '100%',
    },
  },
  supplementalPathologyLinkDisabled: {
    color: colors.grey_300_50,
    cursor: 'default',
  },
  pathologyDescriptionRow: {
    color: colors.grey_100,
    width: '90%',
    '.iconButton': {
      height: '16px',
      minWidth: '16px',
      '&::before': {
        fontSize: '16px',
      },
    },
    '.kitmanReactSelect': {
      width: '200px',
    },
  },
  pathologyDescriptionRowDisabled: {
    color: colors.grey_300_50,
  },
  pathologyDescriptionLabel: {
    fontSize: '12px',
    fontWeight: 600,
    lineHeight: '16px',
    color: colors.grey_100,
  },
  pathologyDescriptionValue: {
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: '14px',
    color: colors.grey_200,
    marginTop: '8px',
  },
  statusNumber: {
    background: colors.neutral_200,
    borderRadius: '13px',
    color: colors.grey_100,
    fontSize: '18px',
    fontWeight: 600,
    height: '24px',
    lineHeight: '22px',
    marginRight: '12px',
    marginTop: '28px',
    padding: '1px 7px',
    width: '24px',
  },
  status: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '16px',
  },
  statusRow: {
    display: 'flex',
    flexDirection: 'row',
    '.datePicker': {
      width: '220px',
    },
    '.iconButton': {
      marginTop: '16px',
    },
    '.kitmanReactSelect': {
      marginRight: '8px',
    },
  },
  statusError: {
    color: colors.red_200,
    marginLeft: '36px',
    marginTop: '8px',
  },
  chronicQuestion: {
    color: colors.grey_200,
    marginTop: '6px',
  },
  sessionCompletedRow: {
    justifyContent: 'flex-start',
    '.segmentedControl': {
      marginRight: '16px',
      width: '130px',
    },
    '.InputNumeric': {
      width: '170px',
      marginRight: '16px',
      '.InputNumeric__label': {
        lineHeight: '20px',
      },
    },
  },
  eventOnsetRow: {
    flexDirection: 'column',
  },
  eventOnsetError: {
    color: colors.red_200,
    marginTop: '8px',
  },
  eventRow: {
    '.kitmanReactSelect': {
      width: '446px',
    },
  },
  contentContainer: {
    height: 'calc(100% - 256px)',
    overflowY: 'scroll',
    paddingBottom: '100px',
  },
  conditionalFieldsSection: {
    width: '100%',
  },
  additionalInformationSection: {
    width: '100%',
    paddingTop: '16px',
    paddingBottom: '16px',
    textAlign: 'center',
    color: colors.grey_200,
    fontSize: '18px',
    height: '60px',
    marginTop: '32px',
  },
  loader: {
    color: colors.grey_300,
    fontSize: '14px',
    fontWeight: 'normal',
    lineHeight: '20px',
    marginTop: '24px',
    marginBottom: '24px',
    textAlign: 'center',
  },
  timeOfInjury: {
    width: '100%',
  },
  continuationIssueEventDisclaimer: {
    color: colors.grey_200,
    fontSize: '14px',
    fontWeight: 400,
  },
  clearPathologySearchBtn: {
    right: '1rem',
    bottom: '1.25rem',
    position: 'absolute',
  },
};

export default style;
