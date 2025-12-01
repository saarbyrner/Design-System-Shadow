// @flow
import { css } from '@emotion/react';
import { withNamespaces } from 'react-i18next';
import { colors } from '@kitman/common/src/variables';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { TcfGraphDataResponse, TcfGraphData } from '../../types';

export type TopContributingFactorsGraphDatum = {
  tooltipData: {
    datumByKey: {
      top_contributing_factors: {
        datum: TcfGraphData,
        index: number,
        key: string,
      },
    },
    nearestDatum: {
      datum: TcfGraphData,
      distance: number,
      index: number,
      key: string,
    },
  },
};

type Props = {
  datum: TopContributingFactorsGraphDatum,
};

export const riskBandColours = {
  increasing: '#C31D2B',
  likely_increasing: '#E7A5AA',
  likely_reducing: '#AFB7C4',
  reducing: '#5F7089',
};

const style = {
  wrapper: css`
    background: ${colors.white};
    border: 1px solid ${colors.p04};
    border-radius: 5px;
    position: relative;
    padding: 25px 30px;
    width: 550px;
  `,
  title: css`
    display: block;
    font-weight: 600;
    font-size: 18px;
    margin-bottom: 5px;
  `,
  subTitle: css`
    align-items: center;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    margin-top: 5px;
    max-width: 500px;
  `,
  subTitleItem: css`
    font-size: 12px;
    margin-right: 5px;

    span:last-child {
      font-weight: 600;
      padding-left: 2px;
    }

    &:after {
      content: '|';
      display: inline-block;
      padding-left: 5px;
    }

    &:last-child {
      margin: 0;

      &:after {
        display: none;
      }
    }
  `,
  legend: css`
    font-size: 11px;
    margin-top: 20px;
  `,
  legendItem: css`
    display: inline-block;
    margin-left: 10px;

    &:before {
      border-radius: 10px;
      content: '';
      display: inline-block;
      height: 8px;
      margin-right: 5px;
      width: 8px;
    }
  `,
  legendItemSevere: css`
    margin-left: 0px !important;
    &:before {
      background: ${riskBandColours.increasing};
    }
  `,
  legendItemModerate: css`
    &:before {
      background: ${riskBandColours.likely_increasing};
    }
  `,
  legendItemMinor: css`
    &:before {
      background: ${riskBandColours.likely_reducing};
    }
  `,
  legendItemLow: css`
    &:before {
      background: ${riskBandColours.reducing};
    }
  `,
  chartBackground: css`
    border: 1px solid ${colors.neutral_200};
    color: transparent;
    height: 100px;
    position: relative;
    width: 440px;
  `,
  separator: css`
    border-left: 1px solid ${colors.neutral_200};
    height: 100px;
    position: absolute;
    top: 0;
    width: 1px;
    z-index: 0;

    span {
      bottom: 0;
      color: ${colors.grey_300};
      left: 50%;
      position: absolute;
      transform: translate(-50%, 100%);
      font-size: 12px;
    }
  `,
  band: css`
    height: 40px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1;
  `,
  lightyellow: css`
    background-color: ${riskBandColours.reducing};
  `,
  yellow: css`
    background-color: ${riskBandColours.likely_reducing};
  `,
  lightred: css`
    background-color: ${riskBandColours.likely_increasing};
  `,
  red: css`
    background-color: ${riskBandColours.increasing};
  `,
  riskLevelNotification: css`
    font-size: 12px;
    font-weight: 700;
    margin: 10px 0;
  `,
  redZoneBand: css`
    display: inline-block;
    font-size: 11px;
    color: ${colors.red_200};
    background: ${colors.orange_100_20};
    padding: 0 4px;
    border-radius: 3px;
    margin-right: 5px;
  `,
};

const getFirstPeriod = (
  parts: $PropertyType<TcfGraphDataResponse, 'parts'>
) => {
  return (
    parts.period_1 && (
      <div css={style.subTitleItem}>
        <span>{parts.period_1[0]}:</span>
        <span>{parts.period_1[1]}</span>
      </div>
    )
  );
};

const getSecondPeriod = (
  parts: $PropertyType<TcfGraphDataResponse, 'parts'>
) => {
  return (
    parts.period_2 && (
      <div css={style.subTitleItem}>
        <span>{parts.period_2[0]}:</span>
        <span>{parts.period_2[1]}</span>
      </div>
    )
  );
};

const RiskLevelBands = (props: I18nProps<Props>) => {
  const containerWidth = 440;
  const separatorLeft = containerWidth / 6;
  const nearestDatum = props.datum?.tooltipData?.nearestDatum.datum;
  const redZoneBands = nearestDatum
    ? nearestDatum.risk_bands.filter((band) => band.zone === 'red')
    : [];

  const bands = () =>
    nearestDatum.normalized_risk_bands.bands.map((band, index) => {
      const leftValue = Math.round(band.xstart * containerWidth);
      const rightValue =
        index === nearestDatum.normalized_risk_bands.bands.length - 1
          ? Math.round(band.xend * containerWidth)
          : Math.round(band.xend * containerWidth) + 2;
      return (
        <div
          key={band.xstart}
          css={css`
            ${style.band};
            ${style[band.zone]};
            left: ${leftValue}px;
            right: ${containerWidth - rightValue}px;
          `}
        />
      );
    });

  const getRiskAreas = () => {
    return redZoneBands.map((band) => (
      <span css={style.redZoneBand} key={band.xstart}>
        {band.xstart.toFixed(1)} - {band.xend.toFixed(1)}
      </span>
    ));
  };

  return (
    <div css={style.wrapper}>
      <span css={style.title}>
        {nearestDatum
          ? nearestDatum.injury_risk_status.replace(/_.*/g, "$'")
          : props.t('No data')}
      </span>
      {nearestDatum && (
        <>
          <div css={style.subTitle}>
            <div css={style.subTitleItem}>
              <span>{nearestDatum.parts.aggregation[0]}:</span>
              <span>{nearestDatum.parts.aggregation[1]}</span>
            </div>
            {getFirstPeriod(nearestDatum.parts)}
            {getSecondPeriod(nearestDatum.parts)}
            <div css={style.subTitleItem}>
              <span>{nearestDatum.parts.data_source[0]}:</span>
              <span>{nearestDatum.parts.data_source[1]}</span>
            </div>
          </div>
          {redZoneBands.length > 0 && (
            <div css={style.riskLevelNotification}>
              <p>
                {props.t('Increase in injury risk when the value is between:')}{' '}
                {getRiskAreas()}
              </p>
            </div>
          )}
          <div css={style.chartBackground}>
            <div
              css={css`
                ${style.separator};
                left: ${separatorLeft}px;
              `}
            >
              <span>{nearestDatum.x_labels[0]}</span>
            </div>
            <div
              css={css`
                ${style.separator};
                left: ${separatorLeft * 2}px;
              `}
            >
              <span>{nearestDatum.x_labels[1]}</span>
            </div>
            <div
              css={css`
                ${style.separator};
                left: ${separatorLeft * 3}px;
              `}
            >
              <span>{nearestDatum.x_labels[2]}</span>
            </div>
            <div
              css={css`
                ${style.separator};
                left: ${separatorLeft * 4}px;
              `}
            >
              <span>{nearestDatum.x_labels[3]}</span>
            </div>
            <div
              css={css`
                ${style.separator};
                left: ${separatorLeft * 5}px;
              `}
            >
              <span>{nearestDatum.x_labels[4]}</span>
            </div>

            {bands()}
          </div>
          <div css={style.legend}>
            <div>{props.t('Influence on injury risk')}:</div>
            <span
              css={css`
                ${style.legendItem};
                ${style.legendItemSevere};
              `}
            >
              {props.t('Increasing')}
            </span>
            <span
              css={css`
                ${style.legendItem};
                ${style.legendItemModerate};
              `}
            >
              {props.t('Likely increasing')}
            </span>
            <span
              css={css`
                ${style.legendItem};
                ${style.legendItemMinor};
              `}
            >
              {props.t('Likely reducing')}
            </span>
            <span
              css={css`
                ${style.legendItem};
                ${style.legendItemLow};
              `}
            >
              {props.t('Reducing')}
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export const RiskLevelBandsTranslated = withNamespaces()(RiskLevelBands);
export default RiskLevelBands;
