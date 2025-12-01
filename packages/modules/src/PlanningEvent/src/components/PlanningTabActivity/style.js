// @flow
import { type ObjectStyle } from '@kitman/common/src/types/styles';
import { colors } from '@kitman/common/src/variables';
import { type ParticipantsCounts } from '@kitman/common/src/types/Event';

type Participants = {|
  athletes?: ParticipantsCounts,
  staff?: ParticipantsCounts,
|};

const TEXT_OVERFLOW_ELLIPSIS = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};
const LINE_HEIGHT = '1.25rem';
const IMG_WIDTH = '9.5625rem';
const PRINTED_IMG_WIDTH = '23rem';
const DRILL_TAG_MARGIN_LEFT = '.25rem';
const ADD_BUTTON_SEPARATOR_PADDING = '.2rem';
const MENU_WIDTH = '1.2rem';
const BLACK_BORDER = `inset 0px 0px 0px 2px ${colors.black_100}`;

const DIGIT_CHARACTER_WIDTH = '.5rem';
const getRightMargin = (
  { athletes = {}, staff = {} }: Participants = {
    athletes: {},
    staff: {},
  }
) => {
  // The length of the longest string containing participants counts.
  const longestParticipantsCountsStringLength = Math.max(
    Object.values(athletes).map(String).join('').length,
    Object.values(staff).map(String).join('').length
  );

  return longestParticipantsCountsStringLength
    ? `calc(-2.5rem - (${DIGIT_CHARACTER_WIDTH} * ${longestParticipantsCountsStringLength}))`
    : '-1.5rem';
};

export default ({
  wrapper: (participants: Participants, isDragged: boolean) => ({
    position: 'relative',
    maxWidth: '59.125rem',
    // + sign is used because getRightMargin returns a negative value.
    width: `calc(100% + ${isDragged ? 0 : getRightMargin(participants)})`,
    borderRadius: '4px',
    display: 'flex',
    paddingTop: '1rem',
    paddingRight: '1rem',
    paddingBottom: '1rem',
    backgroundColor: colors.white,
  }),
  card: {
    boxShadow: `0 1px 4px ${colors.black_100}26`,
    minHeight: '7.5625rem',
  },
  newCard: {
    boxShadow: BLACK_BORDER,
    backgroundColor: 'transparent',
  },
  selectedCard: {
    boxShadow: BLACK_BORDER,
  },
  loadingCard: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  principleTargetCard: {
    backgroundColor: colors.blue_50,
    boxShadow: BLACK_BORDER,
  },
  printedCardInStackView: {
    flexDirection: 'column',
  },
  dragHandleWrapper: {
    paddingTop: '2.05rem',
  },
  dragHandle: {
    fontSize: '1.5rem',
    cursor: 'grab',
    // dnd-kit’s recommendation.
    // https://docs.dndkit.com/api-documentation/sensors/pointer#touch-action
    touchAction: 'none',
  },
  pressedDragHandle: { cursor: 'grabbing' },
  drillDiagram: {
    minWidth: IMG_WIDTH,
    maxWidth: IMG_WIDTH,
    height: '5.5625rem',
    cursor: 'zoom-in',
  },
  printedDrillDiagram: {
    marginLeft: '1rem',
    marginBottom: '1rem',
  },
  printedDrillDiagramInStackView: {
    minWidth: PRINTED_IMG_WIDTH,
    maxWidth: PRINTED_IMG_WIDTH,
    height: '15rem',
  },
  openedDrillDiagramWrapper: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  openedDrillDiagram: {
    width: '90vw',
    height: '90vh',
    objectFit: 'contain',
    cursor: 'zoom-out',
  },
  activityInfo: {
    marginLeft: '.8125rem',
    paddingLeft: '.125rem',
    paddingBottom: '.125rem',
    width: '100%',
    ...TEXT_OVERFLOW_ELLIPSIS,
  },
  activityHeading: {
    display: 'flex',
    cursor: 'pointer',
  },
  printedActivityHeadingInStackView: {
    flexWrap: 'wrap',
  },
  drillName: {
    fontSize: '1.125rem',
    fontWeight: 600,
    color: colors.grey_300,
  },
  printedDrillNameInStackView: {
    flex: '1 0 50%',
  },
  drillTags: {
    marginLeft: DRILL_TAG_MARGIN_LEFT,
    marginRight: MENU_WIDTH,
    '>div': { marginLeft: DRILL_TAG_MARGIN_LEFT },
  },
  marginTop1: { marginTop: '1rem' },
  editPrinciplesButton: {
    padding: 0,
    border: 'none',
    background: 'none',
    display: 'flex',
    alignItems: 'end',
    gap: '.25rem',
    textAlign: 'left',
    fontWeight: 600,
    color: colors.grey_200,
    '.icon-edit': {
      marginBottom: '.05rem',
    },
  },
  principleTags: {
    display: 'flex',
    flexWrap: 'wrap-reverse',
    span: {
      fontSize: '.875rem',
    },
  },
  principleTag: {
    marginTop: '.5rem',
    marginRight: '.5rem',
  },
  addActivityInfoButtons: {
    color: colors.grey_200,
    marginTop: '1rem',
    '>button': {
      color: colors.grey_200,
      padding: 0,
      backgroundColor: 'transparent',
      height: 'initial',
      fontWeight: 600,
    },
    '>button:first-of-type': {
      marginLeft: '.125rem',
    },
    '>:not(button:first-of-type):before': {
      content: '"|"',
      paddingRight: ADD_BUTTON_SEPARATOR_PADDING,
      paddingLeft: ADD_BUTTON_SEPARATOR_PADDING,
      fontWeight: 400,
    },
  },
  orderLabel: {
    position: 'absolute',
    top: 0,
    left: '-8rem',
    '#input-controls': {
      display: 'flex',
      flexWrap: 'wrap',
      width: '8rem',
      input: {
        width: '7.5rem',
      },
    },
  },
  activityParticipantsCounts: (participants: Participants) => ({
    position: 'absolute',
    top: 0,
    right: getRightMargin(participants),
  }),
  printedActivityParticipantsCounts: {
    marginLeft: '1rem',
  },
  menu: {
    '>button': {
      position: 'absolute',
      top: '.4rem',
      right: '.1rem',
      padding: 0,
      backgroundColor: 'transparent',
      'span:before': { fontSize: '2rem !important' },
    },
  },
  printedDrillTags: {
    display: 'flex',
    flexWrap: 'wrap',
    flexBasis: 'min-content',
    gap: '.3rem',
    height: 'fit-content',
  },
  printedDurationAndNotesLabels: {
    marginRight: '7rem',
    flexGrow: 1,
    display: 'inline-flex',
    justifyContent: 'space-between',
    textWrap: 'nowrap',
    b: {
      textWeight: 600,
    },
  },
  emptyDuration: {
    marginRight: '3rem',
  },
  printedDescriptionAndNote: {
    display: 'flex',
    gap: '2.9rem',
    lineHeight: LINE_HEIGHT,
  },
  printedDescriptionAndNoteInStackView: {
    gap: '.3rem',
    flexDirection: 'column',
  },
  drillDescription: {
    lineHeight: LINE_HEIGHT,
    color: colors.grey_200,
    marginTop: '.5rem',
    // drillDescription is rich text, everything inside it should have ellipsis
    // in case of an overflow.
    '>*': {
      ...TEXT_OVERFLOW_ELLIPSIS,
      margin: 0,
    },
  },
  printedDrillDescription: {
    width: '21rem',
  },
  printedDrillDescriptionInStackView: {
    marginTop: 0,
  },
  printedNotesTitleInStackView: {
    fontWeight: 600,
  },
  printedNote: {
    width: '12.7rem',
  },
  principles: {
    marginTop: '1rem',
    lineHeight: LINE_HEIGHT,
  },
  hr: {
    marginBottom: '.5rem',
    border: `1px ${colors.black_100} solid`,
  },
  athletes: {
    lineHeight: LINE_HEIGHT,
  },
  staff: {
    lineHeight: LINE_HEIGHT,
  },
}: ObjectStyle);
