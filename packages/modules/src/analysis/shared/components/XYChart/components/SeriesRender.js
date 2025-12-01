// @flow
import { useMemo } from 'react';
import {
  AnimatedBarSeries,
  AnimatedLineSeries,
  GlyphSeries,
  AnimatedAreaSeries,
} from '@visx/xychart';

import type { CommonSeriesProps } from './SeriesWrapper';
import { SERIES_TYPES, AXIS_CONFIG, AREA_SERIES_OPACITY } from '../constants';
import DataLabel from './DataLabel';
import useChartContext from '../hooks/useChartContext';
import useMultiSeriesScale from '../hooks/useMultiSeriesScale';
import { mapSeriesDataToDomain, filterDataByChartOptions } from '../utils';

type Props = {|
  ...CommonSeriesProps,
  showLabels?: boolean,
  dataType: 'category' | 'time',
|};

function SeriesRender(props: Props) {
  const {
    series,
    controls: { hiddenSeries },
  } = useChartContext();

  const { convertValueToSecondaryAxis } = useMultiSeriesScale();

  const valueAccessor = (...args) => {
    if (hiddenSeries.map(({ datum }) => datum).includes(props.id)) return null;

    return convertValueToSecondaryAxis(
      `${props.id}`,
      props.valueAccessor(...args)
    );
  };

  // formatting seriesData
  const seriesData = useMemo(() => {
    const isRightAxisSeries = props.axisConfig === AXIS_CONFIG.right;
    const isLeftAxisSeries = props.axisConfig === AXIS_CONFIG.left;
    const isLineBased = [SERIES_TYPES.line, SERIES_TYPES.area].includes(
      props.type
    );
    // mapping and formatted right axis data

    if (
      props.dataType === 'category' &&
      (isRightAxisSeries || (isLeftAxisSeries && isLineBased))
    ) {
      // map data to inherit the order from the domain for category labels
      // time labels do not need ordering
      const mappedData = mapSeriesDataToDomain(props.data, series);

      // if line series, filter out null values, otherwise line is not drawn between glyphs
      if (isLineBased) {
        return filterDataByChartOptions(true, false, mappedData, valueAccessor);
      }
      return mappedData;
    }

    return props.data;
  }, [props.data, props.axisConfig, series, props.dataType, props.type]);

  const isLineType = props.type === SERIES_TYPES.line;
  const isAreaType = props.type === SERIES_TYPES.area;
  const displayAllLabels = isLineType || isAreaType || seriesData?.length === 1;

  const renderGlyphSeries = useMemo(
    () => (
      <GlyphSeries
        dataKey={props.id}
        data={seriesData}
        yAccessor={valueAccessor}
        xAccessor={props.categoryAccessor}
        size={5}
      />
    ),
    [props.id, seriesData]
  );

  return (
    <>
      {props.type === SERIES_TYPES.bar && (
        <AnimatedBarSeries
          dataKey={props.id}
          data={seriesData}
          yAccessor={valueAccessor}
          xAccessor={props.categoryAccessor}
        />
      )}
      {isLineType && (
        <>
          <AnimatedLineSeries
            dataKey={props.id}
            data={seriesData}
            yAccessor={valueAccessor}
            xAccessor={props.categoryAccessor}
            opacity="1"
          />
          {renderGlyphSeries}
        </>
      )}
      {isAreaType && (
        <>
          <AnimatedAreaSeries
            dataKey={props.id}
            data={seriesData}
            yAccessor={valueAccessor}
            xAccessor={props.categoryAccessor}
            fillOpacity={AREA_SERIES_OPACITY}
          />
          {renderGlyphSeries}
        </>
      )}
      <DataLabel
        {...props}
        valueAccessor={valueAccessor}
        labelAccessor={props.valueAccessor}
        data={seriesData}
        displayAllLabels={displayAllLabels}
      />
    </>
  );
}

export default SeriesRender;
