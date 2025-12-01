// @flow
import { Fragment, useMemo } from 'react';
import _find from 'lodash/find';
import {
  AnimatedBarSeries,
  AnimatedBarStack,
  AnimatedBarGroup,
  AnimatedLineSeries,
  GlyphSeries,
  AnimatedAreaStack,
  AnimatedAreaSeries,
} from '@visx/xychart';

// types
import { mapSummaryStackData } from '@kitman/modules/src/analysis/TemplateDashboards/components/XYChart/utils';
import type {
  SortConfig,
  ValueAccessor,
} from '@kitman/modules/src/analysis/shared/components/XYChart/types';
import type { CommonSeriesProps } from './SeriesWrapper';

import { SERIES_TYPES, AREA_SERIES_OPACITY } from '../constants';
import useChartContext from '../hooks/useChartContext';
import useMultiSeriesScale from '../hooks/useMultiSeriesScale';
import useProcessSeriesGroupData from '../hooks/useProcessSeriesGroupData';
import DataLabel from './DataLabel';
import GroupDataLabel from './GroupDataLabel';
import StackDataLabel from './StackDataLabel';
import CustomAreaGlyph from './CustomAreaGlyph';

type Props = {
  ...CommonSeriesProps,
  processSeriesData?: (Array<Object>) => Array<Object>,
  dataType: 'category' | 'time',
  showLabels?: boolean,
  sortConfig?: SortConfig,
  valueAccessor: ValueAccessor,
};

const SeriesGroup = (props: Props) => {
  const {
    controls: { hiddenSeries },
  } = useChartContext();

  const { convertValueToSecondaryAxis } = useMultiSeriesScale();
  const { processData } = useProcessSeriesGroupData(`${props.id}`);

  const valueAccessor = (...args) => {
    return convertValueToSecondaryAxis(
      `${props.id}`,
      props.valueAccessor(...args)
    );
  };

  const isStack = props.renderAs === 'stack';
  const isGroupStack = props.renderAs === 'group';
  const isLineType = props.type === SERIES_TYPES.line;
  const isBarType = props.type === SERIES_TYPES.bar;
  const isAreaType = props.type === SERIES_TYPES.area;

  // Null values affect how glyphs/labels render. Keep null values only if isStack,
  // the only stack that needs it for tooltips to work correctly.
  const mapStackData = mapSummaryStackData(props.data, !isStack);
  const groupKeys = mapStackData.map((item) => item.label);

  const renderLineLabel = (dataKey, values, hideSeries) => (
    <DataLabel
      {...props}
      key={dataKey}
      id={dataKey}
      data={hideSeries ? [] : processData(values, props.processSeriesData)}
      displayAllLabels
      valueAccessor={valueAccessor}
      labelAccessor={props.valueAccessor}
    />
  );

  const renderGroupLabel = (dataKey, label) => (
    <GroupDataLabel
      key={dataKey}
      dataKey={dataKey}
      groupKeys={groupKeys}
      label={label}
      showLabels={props.showLabels}
      valueFormatter={props.valueFormatter}
      labelAccessor={props.valueAccessor}
    />
  );

  const renderStackedLabel = (dataKey, values, hideSeries) => (
    <StackDataLabel
      key={dataKey}
      dataKey={dataKey}
      groupKeys={groupKeys}
      data={hideSeries ? [] : processData(values, props.processSeriesData)}
      showLabels={props.showLabels}
      valueFormatter={props.valueFormatter}
      labelAccessor={props.valueAccessor}
    />
  );

  const renderLabel = useMemo(() => {
    if (!props.showLabels) return null;

    return mapStackData.map(({ label, values }) => {
      const hideSeries = _find(hiddenSeries, {
        datum: `${props.id}-${label}`,
      });
      const dataKey = `${props.id}-${label}`;

      switch (true) {
        case isAreaType:
          return null; // Labels are handled in CustomAreaGlyph
        case isLineType:
          return renderLineLabel(dataKey, values, hideSeries);
        case isGroupStack:
          return renderGroupLabel(dataKey, label);
        case isStack:
          return renderStackedLabel(dataKey, values, hideSeries);
        default:
          return null;
      }
    });
  }, [mapStackData, isLineType, isGroupStack, isStack, props.showLabels]);

  return (
    <>
      {isBarType && (
        <>
          {isStack && (
            <AnimatedBarStack>
              {mapStackData.map(({ label, values }) => {
                const hideSeries = _find(hiddenSeries, {
                  datum: `${props.id}-${label}`,
                });
                const data = processData(values, props.processSeriesData);
                return (
                  <AnimatedBarSeries
                    key={`${props.id}-${label}`}
                    dataKey={`${props.id}-${label}`}
                    data={hideSeries ? [] : data}
                    yAccessor={valueAccessor}
                    xAccessor={props.categoryAccessor}
                  />
                );
              })}
            </AnimatedBarStack>
          )}

          {isGroupStack && (
            <AnimatedBarGroup>
              {mapStackData.map(({ label, values }) => {
                const hideSeries = _find(hiddenSeries, {
                  datum: `${props.id}-${label}`,
                });
                const data = processData(values, props.processSeriesData);
                return (
                  <AnimatedBarSeries
                    key={`${props.id}-${label}`}
                    dataKey={`${props.id}-${label}`}
                    data={hideSeries ? [] : data}
                    yAccessor={valueAccessor}
                    xAccessor={props.categoryAccessor}
                  />
                );
              })}
            </AnimatedBarGroup>
          )}
        </>
      )}

      {isLineType && (
        <>
          {mapStackData.map(({ label, values }) => {
            const hideSeries = _find(hiddenSeries, {
              datum: `${props.id}-${label}`,
            });
            const glphyStyle = {
              opacity: hideSeries ? '0' : '1',
            };
            const data = processData(values, props.processSeriesData);
            return (
              <Fragment key={`${props.id}-${label}`}>
                <AnimatedLineSeries
                  dataKey={`${props.id}-${label}`}
                  data={hideSeries ? [] : data}
                  yAccessor={valueAccessor}
                  xAccessor={props.categoryAccessor}
                  opacity={hideSeries ? 0 : '1'}
                />
                <g style={glphyStyle}>
                  <GlyphSeries
                    dataKey={`${props.id}-${label}`}
                    data={hideSeries ? [] : data}
                    yAccessor={valueAccessor}
                    xAccessor={props.categoryAccessor}
                    size={5}
                  />
                </g>
              </Fragment>
            );
          })}
        </>
      )}
      {isAreaType && (
        <AnimatedAreaStack>
          {mapStackData.map(({ label, values }) => {
            const hideSeries = _find(hiddenSeries, {
              datum: `${props.id}-${label}`,
            });

            const data = processData(values, props.processSeriesData);
            return (
              <AnimatedAreaSeries
                key={`${props.id}-${label}`}
                dataKey={`${props.id}-${label}`}
                data={hideSeries ? [] : data}
                yAccessor={valueAccessor}
                xAccessor={props.categoryAccessor}
                fillOpacity={AREA_SERIES_OPACITY}
              />
            );
          })}
        </AnimatedAreaStack>
      )}

      {isAreaType && (
        <>
          {mapStackData.map(({ label, values }) => {
            const dataKey = `${props.id}-${label}`;
            const hideSeries = _find(hiddenSeries, {
              datum: `${props.id}-${label}`,
            });

            return (
              <CustomAreaGlyph
                key={dataKey}
                dataKey={dataKey}
                groupKeys={groupKeys}
                data={
                  hideSeries ? [] : processData(values, props.processSeriesData)
                }
                showLabels={props.showLabels}
                valueFormatter={props.valueFormatter}
                labelAccessor={props.valueAccessor}
                hideSeries={hideSeries}
              />
            );
          })}
        </>
      )}

      {renderLabel}
    </>
  );
};

export default SeriesGroup;
