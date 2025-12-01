// @flow
import { colors } from '@kitman/common/src/variables';

export const style = {
  loadingText: {
    color: colors.neutral_300,
    fontSize: 14,
    fontWeight: 'normal',
    lineHeight: '20px',
    marginTop: 24,
    textAlign: 'center',
    height: 60,
  },
  grid: {
    ...(!window.getFlag('update-perf-med-headers') && { marginTop: 24 }),
    padding: 0,
    'tbody tr td': {
      padding: 8,
    },
    'tr th:first-of-type, tr td:first-of-type': {
      paddingLeft: 24,
    },
    'tr th:last-child, tr td:last-child': {
      paddingRight: 24,
    },
    '.dataGrid__loading': {
      margin: 30,
    },
    '.dataGrid__body .athlete__row': {
      verticalAlign: 'top',
    },
    '.dataGrid__cell': {
      width: 600,
      maxWidth: 600,
      padding: 8,
      paddingTop: '0.26em',
      paddingBottom: '0.135em',
      overflow: 'visible',
    },
  },
  headerCell: {
    color: colors.grey_100,
    fontSize: '9pt',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  athleteCell: {
    display: 'flex',
    width: 280,
  },
  imageContainer: {
    display: 'flex',
    width: '1.79em',
  },
  image: {
    borderRadius: 20,
    height: 40,
  },
  detailsContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: 12,
  },
  position: {
    color: colors.grey_100,
    fontSize: 12,
  },
  availabilityMarker: {
    alignItems: 'center',
    border: `2px solid ${colors.p06}`,
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginLeft: 28,
    marginTop: 28,
    position: 'absolute',
    span: {
      borderRadius: 10,
      display: 'block',
      height: 8,
      width: 8,
    },
  },
  availabilityMarker__available: {
    backgroundColor: colors.green_200,
  },
  availabilityMarker__injured: {
    backgroundColor: colors.orange_100,
  },
  availabilityMarker__unavailable: {
    backgroundColor: colors.red_100,
  },
  availabilityMarker__returning: {
    backgroundColor: colors.yellow_100,
  },
  rosters: {
    marginRight: 4,
  },
  availabilityStatus: {
    '.availabilityLabel': {
      fontSize: 14,
    },
  },
  unavailableSince: {
    fontSize: 12,
  },
  athleteAllergies: {
    display: 'flex',
    flexDirection: 'column',
  },
  athleteAllergy: {
    marginBottom: 4,
  },
  defaultCell: {
    display: 'block',
    width: 250,
    overflowWrap: 'normal',
    whiteSpace: 'normal',
  },
};

export const gridBottomMarginToHideOverflowOnBody = '21px';
