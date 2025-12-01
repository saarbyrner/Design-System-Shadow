// @flow

import {
  colors,
  breakPoints,
  zIndices,
  bannerHeights,
} from '@kitman/common/src/variables';
import type { ObjectStyle } from '@kitman/common/src/types/styles';

const MOBILE_DISTANCE_FROM_PAGE_TOP_TO_TABS = 287;
const DISTANCE_FROM_PAGE_TOP_TO_TABS = 227;
const TAB_TOP_PADDING = 7.5;

export default {
  tabs: {
    margin: '0 1.5rem',
    '.rc-tabs-tabpane': {
      height: '100vh',
      padding: '0 !important',
    },
  },
  drillLibraryPanel: {
    zIndex: zIndices.slidingPanel,
    backgroundColor: colors.white,
    filter: `drop-shadow(0px 2px 8px ${colors.light_transparent_background})
      drop-shadow(0px 2px 15px ${colors.semi_transparent_background})`,
    overflowX: 'clip',
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,

    [`@media only screen and (max-width: ${breakPoints.desktop})`]: {
      top: bannerHeights.desktop,
    },
  },
  searchInputs: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    gap: '.75rem',
    padding: `1rem 1.5rem calc(1rem - ${TAB_TOP_PADDING}px)`,
  },
  searchBar: {
    display: 'grid',
    gridTemplateColumns: '1fr min-content',
    gap: '.25rem',
  },
  dropdownFilters: (areCoachingPrinciplesEnabled: boolean) => ({
    display: 'grid',
    gridTemplateColumns: `1fr 1fr ${areCoachingPrinciplesEnabled ? '1fr' : ''}`,
    gap: '.25rem',
    '.kitmanReactSelect': {
      maxWidth: areCoachingPrinciplesEnabled ? '8.41rem' : '12.74rem',
    },
  }),
  principlesFilter: {
    menu: (base: ObjectStyle) => ({
      ...base,
      minWidth: 'fit-content',
      right: 0,
    }),
  },
  activityTypeName: {
    paddingTop: '.5rem',
    paddingLeft: '1.5rem',
    color: colors.grey_300,
    backgroundColor: colors.white,
    fontSize: '.75rem',
    fontWeight: 600,
    borderBottom: `1px solid ${colors.neutral_300}`,
  },
  emptyDrillLibrary: {
    textAlign: 'center',
    paddingTop: '1.25rem',
  },
  emptyDrillLibraryMessage: {
    color: colors.grey_300_50,
    fontFamily: 'Open Sans',
    fontSize: '1.125rem',
    fontWeight: 600,
  },
  virtuoso: {
    // Using a relative selector because the target is an element in a
    // third-party component.
    '> div': {
      width: '100%',
      height: `calc(100vh - ${DISTANCE_FROM_PAGE_TOP_TO_TABS}px) !important`,
      backgroundColor: colors.white,

      [`@media only screen and (max-width: ${breakPoints.desktop})`]: {
        height: `calc(100vh - ${MOBILE_DISTANCE_FROM_PAGE_TOP_TO_TABS}px) !important`,
      },
    },
  },
};
