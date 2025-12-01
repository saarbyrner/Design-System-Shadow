// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

export default {
  patientNotes: css`
    margin: 15px 0px;
    padding-bottom: 10px;
    border-bottom: 1px solid ${colors.neutral_300};
  `,
  patientNotesHeader: css`
    h2 {
      margin-bottom: 20px;
    }
  `,
};
