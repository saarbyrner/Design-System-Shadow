// @flow
import { css } from '@emotion/react';
import { colors, breakPoints } from '@kitman/common/src/variables';

const MOBILE_DISTANCE_FROM_PAGE_TOP_TO_TABS = 287;
const DISTANCE_FROM_PAGE_TOP_TO_TABS = 227;

export default {
  activityTypeName: css({
    paddingTop: '.5rem',
    paddingLeft: '1.5rem',
    color: colors.grey_300,
    backgroundColor: colors.white,
    fontSize: '.75rem',
    fontWeight: 600,
    borderBottom: `1px solid ${colors.neutral_300}`,
  }),
  emptyDrillLibrary: css({
    textAlign: 'center',
    paddingTop: '1.25rem',
    height: '100vh',
    backgroundColor: colors.white,
  }),
  emptyDrillLibraryMessage: css({
    color: colors.grey_300_50,
    fontFamily: 'Open Sans',
    fontSize: '1.125rem',
    fontWeight: 600,
  }),
  virtuoso: css({
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
  }),
};
