// @flow
import { css } from '@emotion/react';
import { useMemo, useState } from 'react';
import {
  Axis,
  buildChartTheme,
  XYChart,
  BarSeries,
  Grid,
  Tooltip,
} from '@visx/xychart';
import { ParentSize } from '@visx/responsive';
import { Text } from '@visx/text';
import { breakPoints, colors } from '@kitman/common/src/variables';
import { Select } from '@kitman/components';
import { useTooltipInPortal } from '@visx/tooltip';
import { withNamespaces } from 'react-i18next';
import useWindowSize from '@kitman/common/src/hooks/useWindowSize';
import Tippy from '@tippyjs/react';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { RiskLevelBandsTranslated as RiskLevelBands } from '../riskLevelBands';
import type { TcfGraphDataResponse, TcfGraphData } from '../../types';

type FilterOptions = 'top_10' | 'top_20' | 'top_40';

type Props = {
  graphData: Array<TcfGraphDataResponse>,
};

// Adding an index to the injury_risk_status value
// D3 charts will not render duplicate values; in this case, the injury_risk_status name may not necessarily be unique
// Appending an index to the end will ensure it is unigue and will render all data items on the chart
export const transformGraphData = (
  graphDataResponse: Array<TcfGraphDataResponse>
): Array<TcfGraphData> => {
  // $FlowFixMe graphDataResponse must exist
  return (graphDataResponse.length > 0 &&
    graphDataResponse.map((factor, index) => ({
      injury_risk_status: `${factor.name}_${index}`,
      shap_value: factor.y,
      parts: factor.parts,
      normalized_risk_bands: factor.normalized_risk_bands,
      risk_bands: factor.risk_bands,
      x_labels: factor.x_labels,
    })): Array<TcfGraphData>);
};

export const filterData = (
  graphData: Array<TcfGraphData>,
  filterOption: FilterOptions
): Array<TcfGraphData> => {
  if (filterOption === 'top_10') {
    return graphData.slice(0, 10);
  }
  if (filterOption === 'top_20') {
    return graphData.slice(0, 20);
  }
  if (filterOption === 'top_40') {
    return graphData.slice(0, 40);
  }
  return graphData;
};

const style = {
  wrapper: css`
    background: ${colors.white};
    margin-top: 15px;
  `,
  graphTitle: css`
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background: ${colors.neutral_200};
    margin: 0;
    padding: 15px 10px;

    h4 {
      font-size: 16px;
      margin: 0;
    }

    i {
      font-size: 24px;
    }
  `,
  filter: css`
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    margin: 10px 10px 0;

    > span {
      font-weight: 600;
      font-size: 14px;
      display: inline-block;
      margin-right: 5px;
    }
  `,
  metricNumberFilter: css`
    min-width: 100px;
  `,
  graphContainer: css`
    height: 480px;
    padding-bottom: 32px;
    width: 100%;
  `,
  noDataContainer: css`
    height: 480px;
    padding-bottom: 16px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    font-size: 12px;
    font-weight: bold;
    color: ${colors.s17};
  `,
  tooltip: {
    container: css`
      background: ${colors.blue_400};
      color: white;
      border-radius: 3px;
      padding: 4px 6px;
      ul {
        padding-inline-start: 1.25em;
        li {
          font-size: 12px;
          font-weight: 400;
          line-height: 17px;
        }
      }
    `,
    title: css`
      font-size: 12px;
      font-weight: 600;
      line-height: 16px;
    `,
  },
  infoContent: css`
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 16px;
    font-weight: 400;
    font-size: 12px;
    line-height: 20px;
    color: ${colors.s18};
  `,
  tcfGraph: {
    fontSize: '11px',
    position: 'relative',
    cursor: 'pointer',
    lineHeight: '17px',
    color: colors.grey_300,
    fontWeight: 300,
    fontFamily: 'Open Sans',
  },
};

const theme = buildChartTheme({
  backgroundColor: colors.white,
  colors: [colors.blue_100],
  pointerEvents: 'all',
});

const TopContributingFactorsGraph = (props: I18nProps<Props>) => {
  const [selectedFilterOption, setSelectedFilterOption] = useState('top_10');

  const [hoveredTickValue, setHoveredTickValue] = useState('');
  const { containerRef, TooltipInPortal } = useTooltipInPortal();

  const screenWidth = `${useWindowSize().windowWidth}px`;

  const graphFilterOptions = [
    {
      label: props.t('Top 10'),
      value: 'top_10',
    },
    {
      label: props.t('Top 20'),
      value: 'top_20',
    },
    {
      label: props.t('Top 40'),
      value: 'top_40',
    },
  ];

  const [graphData] = useMemo(() => {
    if (!props.graphData || props.graphData.length === 0) {
      return [[], []];
    }
    const transformedGraphData = transformGraphData(props.graphData);
    const filteredData = filterData(transformedGraphData, selectedFilterOption);

    return [filteredData];
  }, [props.graphData, selectedFilterOption]);

  const accessors = {
    xAccessor: (dataPoint) => dataPoint.injury_risk_status,
    yAccessor: (dataPoint) => dataPoint.shap_value,
  };

  const buildTooltipContent = (value) => {
    const parts = value.split('-');
    const title = parts[0];
    const stats = parts.slice(1, parts.length);
    return (
      value && (
        <div>
          <div css={style.tooltip.title}>{title}</div>
          <ul>
            {stats.map((stat) => {
              return <li key={stat}>{stat}</li>;
            })}
          </ul>
        </div>
      )
    );
  };

  const shouldAdjustLabelText = () =>
    selectedFilterOption === 'top_10' && screenWidth >= breakPoints.desktop;

  const formatLabelValue = (val) => {
    const maxStringLength = 50;
    if (shouldAdjustLabelText()) {
      if (val.replace(/_.*/g, "$'").length > maxStringLength) {
        return `${val.replace(/_.*/g, "$'").substring(0, maxStringLength)}...`;
      }

      return val.replace(/_.*/g, "$'");
    }

    return `${val.slice(0, 8)}...`;
  };

  const getTickForXAxis = ({ formattedValue, ...tickProps }) => {
    return (
      <g>
        <Text
          {...tickProps}
          innerRef={
            formattedValue === hoveredTickValue ? containerRef : undefined
          }
          angle={shouldAdjustLabelText() ? 0 : -45}
          dx={shouldAdjustLabelText() ? 0 : -2}
          y={shouldAdjustLabelText() ? 8 : 2}
          width={80}
          verticalAnchor={shouldAdjustLabelText() ? 'start' : 'end'}
          textAnchor={shouldAdjustLabelText() ? 'middle' : 'end'}
          onPointerEnter={() => setHoveredTickValue(formattedValue)}
          onPointerLeave={() => setHoveredTickValue('')}
          style={style.tcfGraph}
        >
          {formatLabelValue(formattedValue)}
        </Text>
        {hoveredTickValue === formattedValue && (
          <TooltipInPortal
            unstyled
            applyPositionStyle
            offsetTop={-130}
            css={style.tooltip.container}
          >
            {buildTooltipContent(formattedValue.replace(/_.*/g, "$'"))}
          </TooltipInPortal>
        )}
      </g>
    );
  };
  const [hoveredBarIndex, setHoveredBarIndex] = useState(-1);
  const renderChart = () => {
    return (
      <div css={style.graphContainer}>
        <ParentSize>
          {({ width, height }) => (
            <div>
              <XYChart
                width={width}
                height={height}
                xScale={{
                  type: 'band',
                  paddingInner: 0.6,
                  paddingOuter: 0.6,
                }}
                yScale={{ type: 'linear' }}
                pointerEventsDataKey="all"
                theme={theme}
                margin={{ top: 10, bottom: 80, left: 50, right: 10 }}
              >
                <Grid
                  columns={false}
                  stroke={colors.neutral_300}
                  strokeWidth={1}
                  numTicks={6}
                />
                <BarSeries
                  enableEvents
                  dataKey="top_contributing_factors"
                  data={graphData}
                  colorAccessor={(_, i) =>
                    i === hoveredBarIndex ? '#4387d4' : undefined
                  }
                  onPointerMove={({ index }) => setHoveredBarIndex(index)}
                  onPointerOut={() => setHoveredBarIndex(-1)}
                  {...accessors}
                />
                {window.getFlag('risk-level-zones-on-top-influencing-factors') && (
                  <Tooltip
                    key={Math.random()}
                    unstyled
                    applyPositionStyle
                    detectBounds
                    snapTooltipToDatumX
                    offsetLeft={10}
                    offsetTop={-50}
                    renderTooltip={(datum) => <RiskLevelBands datum={datum} />}
                  />
                )}
                <Axis
                  orientation="left"
                  hideTicks
                  label={props.t('Factor importance')}
                  labelProps={{
                    fill: colors.grey_300,
                    fontSize: 12,
                    fontFamily: 'Open Sans',
                  }}
                  stroke={colors.neutral_300}
                  tickLabelProps={() => ({
                    display: 'none',
                  })}
                />
                <Axis
                  orientation="bottom"
                  hideTicks
                  stroke={colors.neutral_300}
                  tickValues={graphData.map((l) => l.injury_risk_status)}
                  tickLabelProps={() => ({
                    pointerEvents: 'all',
                  })}
                  tickComponent={getTickForXAxis}
                />
              </XYChart>
            </div>
          )}
        </ParentSize>
      </div>
    );
  };

  const renderNoChartData = () => {
    return (
      <div css={style.noDataContainer}>{props.t('No data to display')}</div>
    );
  };

  const renderChartDisplayOptions = () => {
    return (
      <div css={style.filter}>
        <span>{props.t('Show')}</span>
        <div css={style.metricNumberFilter}>
          <Select
            options={graphFilterOptions}
            onChange={(filterOption) => {
              setSelectedFilterOption(filterOption);
            }}
            value={selectedFilterOption}
          />
        </div>
      </div>
    );
  };

  return (
    <div css={style.wrapper}>
      <div>
        <div css={style.graphTitle}>
          <h4>{props.t('Top influencing factors')}</h4>
          <Tippy
            content={
              <div css={style.infoContent}>
                <span>
                  {props.t(
                    'Factor Importance assigns a score to every factor based on how influential it is in determining injury risk within the data used to create the metric.'
                  )}
                </span>
                <span>
                  {props.t(
                    'These factors will be most significant when generating daily risk scores (adding to or subtracting from injury risk).'
                  )}
                </span>
              </div>
            }
            placement="left-start"
            maxWidth={290}
            theme="neutral-tooltip"
          >
            <i className="icon-info" />
          </Tippy>
        </div>
        {graphData.length > 0 && renderChartDisplayOptions()}
      </div>
      {graphData.length > 0 ? renderChart() : renderNoChartData()}
    </div>
  );
};

export const TopContributingFactorsGraphTranslated = withNamespaces()(
  TopContributingFactorsGraph
);
export default TopContributingFactorsGraph;
