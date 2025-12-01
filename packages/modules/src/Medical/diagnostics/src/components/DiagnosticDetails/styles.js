// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

export default {
  header: css`
    margin-bottom: 24px;
  `,
  main: css`
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
  `,
  detailsAdditionalInfoMultiCPT: css`
    display: grid;
    color: ${colors.grey_200};
    grid-template-columns: 1fr 1fr 1fr;
    gap: 20px;
    margin-bottom: 0;
    list-style: none;
    padding: 16px 0px;

    li {
      line-height: 16px;
    }
  `,
  redoxDetailsAdditionalInfo: css`
    display: grid;
    color: ${colors.grey_200};
    grid-template-columns: 1fr 1fr 1fr;
    gap: 40px;
    margin-bottom: 0;
    margin-top: 12px;
    list-style: none;
    padding: 16px 0px;

    li {
      line-height: 16px;
    }
  `,
  detailsAdditionalInfo: css`
    display: grid;
    background-color: ${colors.background};
    border-bottom: 2px solid ${colors.neutral_300};
    border-top: 2px solid ${colors.neutral_300};
    color: ${colors.grey_200};
    grid-template-columns: 1fr 1fr 1fr;
    gap: 20px;
    margin-bottom: 0;
    margin-top: 12px;
    list-style: none;
    padding: 16px 0px;

    li {
      line-height: 16px;
    }
  `,
  billingInfo: css`
    margin-top: 24px;
  `,
  authorDetails: css`
    font-size: 11px;
    color: ${colors.grey_200};
  `,
  metadataSection: css`
    margin-top: 16px;
    margin-bottom: 16px;

    &:last-of-type {
      margin-bottom: 0px;
    }
  `,
  detailsWithReferringPhysician: css`
    color: ${colors.grey_200};
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 8px;
    list-style: none;
    line-height: 16px;
    padding: 0;
    margin-bottom: 8px;

    li {
      line-height: 16px;
    }
  `,
  referringPhysicianInputField: css`
    margin-top: 8px;
  `,
  details: css`
    color: ${colors.grey_200};
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    list-style: none;
    line-height: 16px;
    padding: 0;
    margin-bottom: 8px;

    li {
      line-height: 16px;
      margin: 8px 8px 8px 0;
    }
  `,
  annotation: css`
    grid-template-columns: 1fr;
  `,
  billing: css`
    grid-template-columns: 1fr 1fr 1fr;
  `,
  removeMultiCPT: css`
    display: flex;
    justify-content: end;
    line-height: 16px;
    margin-bottom: 16px;
    margin-top: 20px;
    .textButton__icon::before {
      font-size: 20px;
    }
  `,
  addAnother: css``,
  detailLabel: css`
    font-weight: 600;
  `,
  detailValue: css`
    color: ${colors.grey_200};
  `,
  billingInfoContainer: css`
    margin-top: 24px;
  `,
  billableToggle: css`
    margin-top: 8px;
  `,
  billingInputField: css`
    margin-top: 8px;
  `,
  section: css`
    background-color: ${colors.white};
    border: 1px solid ${colors.neutral_300};
    border-radius: 3px;
    padding: 24px;
    position: relative;
  `,
  sectionLoader: css`
    bottom: 0;
    height: 4px;
    left: 0;
    overflow: hidden;
    position: absolute;
    width: 100%;
  `,
  actions: css`
    display: flex;
    gap: 8px;
  `,
  editEndDate: css`
    display: flex;
    gap: 8px;
    align-items: center;
  `,
};
