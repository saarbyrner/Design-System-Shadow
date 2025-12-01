/* eslint-disable react/no-unused-prop-types */
// @flow
import { colors } from '@kitman/common/src/variables';
import { css } from '@emotion/react';

const style = {
  cell: css`
    display: flex;
    align-content: start;
    justify-content: start;
    color: ${colors.grey_300};
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    background: ${colors.white};
  `,
  medicationCell: css`
    display: flex;
    align-content: start;
    justify-content: start;
    color: ${colors.grey_200};
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
    text-align: left;
  `,
  directionsCell: css`
    display: flex;
    align-content: start;
    justify-content: start;
    color: ${colors.grey_100};
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    text-align: left;
  `,
};

type Props = {
  value?: string,
  medication?: string,
};

const TextCell = (props: Props) => {
  return <div css={style.cell}>{props.value}</div>;
};

const MedicationCell = (props: Props) => {
  return <div css={style.medicationCell}>{props.medication}</div>;
};

const DirectionsCell = (props: Props) => {
  return <div css={style.directionsCell}>{props.value}</div>;
};

export { TextCell, MedicationCell, DirectionsCell };
