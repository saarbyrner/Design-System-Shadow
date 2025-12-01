// @flow
import { colors } from '@kitman/common/src/variables';

const PANEL_PADDING = 24;
const ELEMENT_PADDING = 12;
const ELEMENT_GAP = 4;

export default {
  sidePanelOverride: {
    display: 'flex',
    flexDirection: 'column',
  },
  squadLabel: {
    padding: `${ELEMENT_GAP}px ${PANEL_PADDING}px`,
    fontSize: 14,
    fontWeight: 600,
    lineHeight: '16px',
    letterSpacing: 0,
    textAlign: 'left',
    borderBottom: `1px solid ${colors.neutral_300}`,
  },
  filterContainerWithSearchBar: {
    display: 'grid',
    gap: ELEMENT_GAP,
    gridTemplateColumns: '0.2fr 1fr 1fr',
    padding: `${ELEMENT_PADDING}px ${PANEL_PADDING}px ${ELEMENT_GAP}px`,
  },
  filterContainer: {
    display: 'grid',
    gap: ELEMENT_GAP,
    gridTemplateColumns: '1fr 1fr',
    padding: `${ELEMENT_PADDING}px ${PANEL_PADDING}px ${ELEMENT_GAP}px`,
  },
  iconSearchButton: {
    display: 'flex',
    alignItems: 'center',
    justifyItems: 'center',
    background: colors.neutral_200,
    border: 0,
    color: colors.grey_100,
    fontSize: 16,
    padding: ELEMENT_GAP,
    '&:hover': {
      cursor: 'pointer',
    },
  },
  filters: {
    maxWidth: 110,
  },
  emptyText: {
    color: colors.grey_100,
    display: 'flex',
    textAlign: 'center',
    padding: `${PANEL_PADDING}px ${PANEL_PADDING}px 16px`,
  },
  searchFilter: {
    padding: `${ELEMENT_PADDING}px ${PANEL_PADDING}px 0px`,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 600,
    lineHeight: '16px',
    margin: 0,
  },
  headerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: `${PANEL_PADDING}px ${PANEL_PADDING}px 0px`,
  },
  itemContainer: {
    padding: `8px ${PANEL_PADDING}px`,
    borderBottom: `1px solid ${colors.neutral_300}`,
  },
  selectedItem: {
    background: colors.neutral_300,
  },
  sessionTitle: {
    fontWeight: 600,
    color: `1px solid ${colors.grey_200}`,
  },
  sessionDate: {
    fontWeight: 400,
    color: `1px solid ${colors.grey_100}`,
    fontSize: 11,
  },
  loadingText: {
    padding: PANEL_PADDING,
    display: 'flex',
    justifyContent: 'center',
  },
  headerActionButton: {
    background: 'transparent',
    border: 0,
    color: colors.neutral_400,
    fontSize: 16,
    padding: 0,
    '&:hover': {
      cursor: 'pointer',
    },
  },
  squadList: {
    height: '100%',
    padding: '8px 12px',
  },
};
