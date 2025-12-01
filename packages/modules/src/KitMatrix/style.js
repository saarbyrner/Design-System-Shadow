// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

const boldText = css`
  font-family: Open Sans;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: ${colors.grey_200};
`;

export default {
  container: css`
    background-color: ${colors.s23};
  `,
  title: css`
    font-family: Open Sans;
    font-size: 20px;
    font-weight: 600;
    line-height: 24px;
  `,
  inputFilter: css`
    width: 160px;
  `,
  club: boldText,
  kitName: boldText,
  label: css`
    font-family: Open Sans;
    font-size: 12px;
    font-weight: 600;
    line-height: 16px;
    color: ${colors.grey_100};
  `,
  formSectionTitle: css`
    font-family: Open Sans;
    font-size: 14px;
    font-weight: 600;
    line-height: 16px;
  `,
  nativeColorPicker: css`
    opacity: 0;
    width: 30px;
    height: 30px;
    position: absolute;
  `,
  customColorPicker: css`
    width: 30px;
    height: 30px;
    border: 1px solid ${colors.grey_300_50};
    border-radius: 8px;
    cursor: pointer;
  `,
  imageNamePreviewContainer: css`
    background: ${colors.neutral_200};
    border-radius: 2px;
  `,
  imageNamePreviewText: css`
    font-size: 12px;
    max-width: 230px;
    text-overflow: ellipsis;
    overflow: hidden;
  `,
  imagePreviewContainer: css`
    border: 1px solid ${colors.neutral_200};
    border-radius: 8px;
    width: 105px;
    height: 105px;
    display: flex;
    align-items: center;
    justify-content: center;
  `,
  imagePreview: (type: string) => css`
    width: 85px;
    transform: ${type === 'jersey' ? 'scale(1)' : 'scale(0.7)'};
    object-fit: contain;
    object-position: center;
    aspect-ratio: 1 / 1;
  `,
  deleteIcon: css`
    color: ${colors.grey_200};
  `,
  fillWidth: css`
    width: 100%;
  `,
  drawerTitle: css`
    font-family: Open Sans;
    font-size: 18px;
    font-weight: 600;
    line-height: 22px;
    color: ${colors.grey_300};
  `,
  errorText: css`
    color: ${colors.red_100};
    font-size: 12px;
    margin-left: 0;
  `,
  attachment: css`
    transform: rotate(30deg);
    font-size: 18px;
    cursor: pointer;
  `,
  emptyDataGrid: css`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  `,
  teamFlag: css`
    width: 33px;
    height: 33px;
    border-radius: 50%;
  `,
};
