// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

export default {
  row: css`
    position: relative;
    margin-bottom: 16px;
  `,
  attachmentsHeader: css`
    align-items: center;
    display: flex;
    justify-content: space-between;
    margin-bottom: 2px;

    h3 {
      margin-bottom: 0;
    }

    span {
      color: ${colors.grey_100};
      font-size: 11px;
    }

    .textButton__icon::before {
      font-size: 20px;
    }
  `,
  uploadedFilesError: css`
    border: 1px solid #c31c2b;
    border-radius: 3px;
    border-width: 2px;
  `,
  noButtonExtraMargin: css`
    margin-bottom: 11.5px;
  `,
  noHeaderRepositionTitle: css`
    .unuploaded_files_titles {
      top: 157px;
    }
  `,
};
