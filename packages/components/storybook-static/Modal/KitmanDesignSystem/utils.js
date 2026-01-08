// @flow
import { colors, zIndices } from '@kitman/common/src/variables';

export const getStyles = ({
  showBorder,
  isScrollableUp,
  isScrollableDown,
  modalWidth,
}: {
  showBorder?: boolean,
  isScrollableUp?: boolean,
  isScrollableDown?: boolean,
  modalWidth?: number,
} = {}) => ({
  overlay: {
    backgroundColor: 'rgba(13, 27, 48, 0.65)',
  },
  overlapSidePanel: {
    zIndex: zIndices.popover,
    backgroundColor: 'rgba(13, 27, 48, 0.65)',
  },
  modal: {
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
    boxShadow: `0px 3px 5px rgba(9, 30, 66, 0.2),
		  0px 0px 1px rgba(9, 30, 66, 0.31)`,
    borderRadius: '3px',
    border: 0,
    ...(typeof modalWidth === 'number' ? { width: `${modalWidth}px` } : {}),

    '@media (min-width: 768px)': {
      minHeight: '196px',
      maxHeight: '504px',
    },
    '@media (max-width: 768px)': {
      minWidth: '80%',
      maxWidth: '80%',
      minHeight: '40%',
      maxHeight: '80%',
      margin: 'auto !important', // Overwrite legacy mobile styles
      padding: '0 !important', // Overwrite legacy mobile styles
    },
  },
  header: {
    padding: '24px',
    paddingBottom: '22px',
  },
  title: {
    color: colors.grey_300,
    fontWeight: 600,
    fontSize: '20px',
    lineHeight: '24px',
    marginBottom: 0,
  },
  content: {
    padding: '0 24px',
    overflowY: 'auto',
    minHeight: '45px',
    borderBottom: '2px solid transparent',
    borderTop: '2px solid transparent',
    flex: '1',
    borderTopColor: isScrollableUp ? colors.neutral_300 : 'transparent',
    borderBottomColor: isScrollableDown ? colors.neutral_300 : 'transparent',
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: '24px',
    paddingTop: '22px',
    borderTop: showBorder && '2px solid #e8eaed',
    button: {
      marginLeft: '10px',
      display: 'flex',
      alignItems: 'center',
      svg: {
        marginBottom: '2px',
      },
    },
  },
});
