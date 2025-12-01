// @flow
import { colors, breakPoints } from '@kitman/common/src/variables';

const styles = {
  wrapper: {
    position: 'relative',
  },
  fieldPositionWithoutPlayer: {
    position: 'relative',
    cursor: 'pointer',
  },
  playerAvatarWrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'relative',
    cursor: 'pointer',
  },
  playerAvatar: (cellSize: number) => ({
    width: `${cellSize}px`,
    height: `${cellSize}px`,
    borderRadius: `${cellSize / 2}px`,
    border: `${cellSize / 15}px solid transparent`,
  }),

  highlightPlayer: {
    borderColor: colors.grey_100,
  },
  selectedPosition: {
    borderColor: colors.green_200,
  },

  playerAvatarEvent: (cellSize: number) => ({
    width: `${cellSize / 4}px`,
    position: 'absolute',
    borderRadius: '2px',
    border: `1px solid ${colors.white}`,
  }),

  avatarRemoveButton: (cellSize: number) => ({
    top: '0px',
    right: '0px',
    display: 'flex',
    justifyContent: 'center',
    borderRadius: '10px',
    height: `${cellSize / 3}px`,
    width: `${cellSize / 3}px`,
    fontSize: `${cellSize / 4}px`,
    padding: '0px',

    '&:hover': {
      borderColor: colors.grey_100,
    },
  }),

  playerAvatarEventInfo: (cellSize: number) => ({
    width: `${cellSize / 2.5}px`,
    height: `${cellSize / 2.5}px`,
    position: 'inherit',
  }),
  playerAvatarEventInfoSub: (cellSize: number) => ({
    width: `${cellSize / 2.5}px`,
  }),

  avatarRedCard: {
    top: '0px',
    left: '0px',
  },
  avatarYellowCard: {
    top: '0px',
    right: '0px',
  },
  avatarSecondYellowCard: {
    top: '-2.5px',
    right: '-2.5px',
  },

  positionLabel: (cellSize: number) => ({
    padding: `${cellSize / 7}px 4px`,
    backgroundColor: 'white',
    position: 'absolute',
    width: 'max-content',
    textAlign: 'center',
    left: 0,
    right: 0,
    top: `${cellSize + 2}px`,
    lineHeight: `${cellSize / 3.5}px`,
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: '4px',
    fontSize: `${cellSize / 4}px`,
  }),

  centeredLabel: {
    left: '50%',
    whiteSpace: 'nowrap',
    maxWidth: '60px',
    overflow: 'hidden',
    transform: 'translate(-50%, 0)',
    textOverflow: 'ellipsis',

    [`@media (min-width: ${breakPoints.tablet})`]: {
      maxWidth: '100px',
    },
  },

  playerInfoPopup: (cellSize: number) => ({
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${cellSize / 7}px`,
    backgroundColor: 'white',
    width: 'max-content',
    zIndex: 1,
    left: '50%',
    top: '20px',
    transform: 'translate(-50%, 0)',
    borderRadius: '4px',
    fontSize: `${cellSize / 4}px`,
  }),
  playerFullName: {
    display: 'block',
    borderBottom: `1px solid ${colors.grey_100}`,
    marginBottom: '10px',
  },
  playerIconInfoArea: {
    display: 'flex',
  },
  eventInfoDisplay: (cellSize: number) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: `1px ${cellSize / 15}px`,
    lineHeight: `${cellSize / 4}px`,

    img: {
      marginBottom: '5px',
    },
    span: {
      fontSize: `${cellSize / 3.5}px`,
    },
  }),
  noPlayerPosition: (cellSize: number) => ({
    width: `${cellSize}px`,
    height: `${cellSize}px`,
    borderRadius: `${cellSize / 2}px`,
    border: `${cellSize / 15}px solid ${colors.white}`,
    backgroundColor: 'rgba(232, 234, 237, 0.65)',
  }),
  positionAbbreviationContainer: (cellSize: number) => ({
    width: `${cellSize}px`,
    height: `${cellSize}px`,
    fontSize: `${cellSize / 3}px`,
    top: '0px',
    left: '0px',
    right: '0px',
    backgroundColor: 'transparent',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
  }),
  positionAbbreviation: {
    textAlign: 'center',
    margin: 0,
  },
  disabledPosition: (cellSize: number) => ({
    width: `${cellSize}px`,
    height: `${cellSize}px`,
    border: '1px',
    opacity: 0,
  }),
};

export default styles;
