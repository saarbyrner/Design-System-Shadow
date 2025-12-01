// @flow
import type { ObjectStyle } from '@kitman/common/src/types/styles';
import colors from '@kitman/common/src/variables/colors';
import { IMPORT_TYPES_WITH_BACK_BUTTON } from '@kitman/modules/src/shared/MassUpload/New/utils/consts';
import { convertPixelsToREM } from '@kitman/common/src/utils/css';

import {
  type SubmissionStatusChipBackgroundColor,
  type SubmissionStatusChipIconFill,
} from './types';

const submissionStatusChipIconSize = '1.25rem';

export default ({
  getWrapper: (appHeaderHeight, importType) => {
    const headerHeight = IMPORT_TYPES_WITH_BACK_BUTTON.includes(importType)
      ? 108.52 // Exact px height of header with back button (height non responsive)
      : 72.02; // Exact px height of header without back button (height non responsive)
    return {
      backgroundColor: 'background.default',
      height: '100%',

      '& .MuiDataGrid-root': {
        border: 'none',
        height: `calc(100vh - ${convertPixelsToREM(
          headerHeight + appHeaderHeight
        )})`,
      },
    };
  },
  title: {
    color: 'text.secondary',
    fontWeight: 600,
    padding: '1rem 1.5rem .625rem',
  },
  submissionsColumnHeaderHeight: 36,
  getSubmissionStatusChipStyle: (
    backgroundColor: SubmissionStatusChipBackgroundColor
  ): ObjectStyle => {
    return {
      height: '1.625rem',
      color: colors.white,
      backgroundColor,
    };
  },
  getSubmissionStatusChipIconStyle: (
    fill: SubmissionStatusChipIconFill
  ): ObjectStyle => ({
    fill,
    height: submissionStatusChipIconSize,
    width: submissionStatusChipIconSize,
  }),
  exportIcon: {
    height: '1.4rem',
    width: '1.4rem',
    fill: colors.grey_200,
  },
}: ObjectStyle);
