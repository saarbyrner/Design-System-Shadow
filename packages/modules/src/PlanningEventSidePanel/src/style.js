// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

const threeColumnGridCommon = css({
  gridColumn: '1 / span end',
  display: 'grid',
  gap: '16px',
  gridTemplateColumns: '1fr 1fr 1fr [end]',
});

const style = {
  segementedTitles: css`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 32px;
    margin: 16px 0;
  `,
  optionalLabel: css`
    color: ${colors.grey_300_50};
    margin-top: 4px;
    font-size: 11px;
    line-height: 14px;
    font-weight: 400;
  `,
  invalidLabel: css`
    color: ${colors.red_100};
    margin-top: 4px;
    font-size: 11px;
    line-height: 14px;
    font-weight: 400;
  `,
  sectionHeading: css`
    grid-column: 1 / span end;
    display: flex;
    gap: 8px;
    align-items: center;
    margin-top: 16px;
  `,
  headingText: css`
    color: ${colors.grey_300};
    font-weight: 600;
    font-size: 12px;
    line-height: 16px;
  `,
  headingSecondaryText: css`
    color: ${colors.grey_100};
    font-weight: 400;
    font-size: 12px;
    line-height: 20px;
  `,
  actionButtons: css`
    background-color: ${colors.white};
    border-top: 1px solid ${colors.neutral_300};
    padding: 24px;
    align-items: center;
    display: flex;
    width: 100%;
    height: 80px;
    justify-content: space-between;
    text-align: center;
  `,
  formHolder: css`
    background-color: ${colors.white};
    display: flex;
    flex-direction: column;
    gap: 16px;
    grid-template-columns: 1fr [end];
    width: 100%;
    overflow: auto;
    flex: 1;
    padding: 15px 24px 15px 24px;

    .kitmanReactSelect__label {
      line-height: 20px;
    }

    .InputNumeric__optional {
      color: ${colors.grey_300_50};
      margin-top: 4px;
      font-size: 11px;
      line-height: 14px;
      font-weight: 400;
    }

    .InputNumeric__descriptor--right {
      line-height: 32px;
    }
  `,
  fullWidthRow: css`
    grid-column: 1 / span end;
  `,
  teamScoreRow: css`
    grid-column: 1 / span end;
    display: grid;
    gap: 16px;
    grid-template-columns: 1fr 1fr 1fr;

    div:first-of-type {
      grid-column: 1 / span 2;
    }
  `,
  singleColumnGrid: css`
    grid-column: 1 / span end;
    display: grid;
    gap: 16px;
    margin-bottom: 16px;
  `,
  singleColumn: css`
    grid-column: 1 / span end;
    display: grid;
    gap: 16px;
  `,
  twoColumnGrid: css`
    grid-column: 1 / span end;
    display: grid;
    gap: 16px;
    grid-template-columns: 1fr 1fr [end];
    margin-bottom: 16px;
  `,
  threeColumnGrid: css([threeColumnGridCommon, { marginBottom: '16px' }]),
  threeColumnGridNoMarginBottom: threeColumnGridCommon,
  sixColumnGrid: css`
    grid-column: 1 / span end;
    display: grid;
    gap: 16px;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr [end];
    margin-bottom: 16px;
  `,
  separatorMargin: css({ margin: '8px 0px' }),
  separator: css`
    grid-column: 1 / span end;
    border-top: 2px solid ${colors.neutral_300};
  `,
  duplicateParticipants: css`
    margin: 12px 0 20px;
  `,
  noParticipants: css`
    margin: 12px 0 20px;
  `,
  oneColumnRow: css`
    grid-column: 1 / 2;
  `,
  twoColumnRow: css`
    grid-column: 1 / 3;
  `,
  fiveColumnRow: css`
    grid-column: 1 / 5;
  `,
  unUploadedFileArea: css`
    padding-left: 5px;
  `,
  unUploadedFileFields: css`
    grid-column: 1 / span end;
    border-left: 4px solid ${colors.neutral_200};
    padding-left: 8px;
  `,
  fileAlignment: css`
    display: flex;
    align-items: self-end;
  `,
  linkUri: css`
    grid-column: 2 / 2;
    margin-bottom: 16px;
  `,
  linkTitle: css`
    grid-column: 1 / 1;
    margin-bottom: 16px;
  `,
  linkAddButton: css`
    grid-column: 3/3;
    margin: 16px 0px;
    padding-top: 8px;
  `,
  unUploadedLinksField: css`
    grid-column: 1 / span end;
    border-left: 4px solid ${colors.neutral_200};
    padding-left: 8px;
  `,
  addLinkArea: css`
    display: grid;
    column-gap: 8px;
    grid-template-columns: 1fr 1fr 0.2fr;
    align-items: center;
    margin-top: 16px;
  `,
  icons: css`
    margin-right: 5px;
    color: ${colors.grey_300};
    font-size: 20px;
  `,
  attachments: css`
    color: ${colors.grey_200};
    font-weight: 400;

    &:visited,
    &:hover,
    &:focus,
    &:active {
      color: ${colors.grey_300};
    }

    &:hover {
      text-decoration: underline;
    }
  `,
  attachmentList: css`
    display: flex;
    overflow-x: scroll;
    white-space: nowrap;
    width: 100vw;
    margin-bottom: 5px;
  `,
  attachmentMargin: css`
    margin: 5px;
  `,
  uploadedFiles: css`
    padding-left: 5px;
  `,
  upload: css`
    display: flex;
    align-items: center;
    border-left: 4px solid ${colors.neutral_200};
    padding-left: 8px;
    margin-bottom: 5px;
    margin-top: 5px;
  `,
  trashBin: css`
    margin-left: auto;
  `,
  duplicationConfigurator: css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.neutral_100,
    padding: '.5rem',
    minHeight: '3.1rem',
  }),
  duplicationConfigurators: css({
    display: 'flex',
    flexDirection: 'column',
    gap: '.4rem',
  }),
  addTopMargin: css`
    margin-top: 16px;
  `,
  staffRow: css`
    grid-column: 1 / span end;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    margin-bottom: 16px;
    div:first-of-type {
      grid-column: 1 / span 3;
    }
  `,
  labelText: css`
    color: ${colors.grey_100};
    font-size: 12px;
    font-weight: 600;
    margin-top: 8px;
    margin-bottom: 4px;
  `,
  noGap: css`
    gap: 0px;
  `,
};

export default style;
