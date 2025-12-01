// @flow
import { colors } from '@kitman/common/src/variables';

const ellipsis = {
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
};
const smallText = {
  fontWeight: 600,
  fontSize: '12px',
};

export default {
  paper: {
    width: '27.5rem',
    backgroundColor: colors.white,
    borderRadious: '16px',
    padding: '8px',
    boxSizing: 'border-box',
    display: 'grid',
    gridTemplateRows: '1fr 1fr',
    cursor: 'pointer',
    color: colors.grey_200,
  },
  topContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  bottomContainer: {
    display: 'inherit',
    gridTemplateColumns: '70% auto',
    overflow: 'hidden',
  },
  message: {
    ...smallText,
  },
  title: {
    fontSize: '14px',
    fontWeight: 700,
    color: colors.blue_100,
    ...ellipsis,
  },
  description: {
    fontSize: '12px',
    fontWeight: 400,
    ...ellipsis,
  },
  innerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingRight: '8px',
    gap: '5px',
  },
  time: {
    ...smallText,
    color: colors.blue_100,
  },
  closeIcon: { marginLeft: 'auto', color: colors.grey_200 },
  bellIcon: { height: '28px', color: colors.grey_200 },
};
