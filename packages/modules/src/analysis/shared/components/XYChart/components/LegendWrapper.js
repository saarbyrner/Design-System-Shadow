// @flow

import { useContext } from 'react';
import { DataContext } from '@visx/xychart';
import { LegendOrdinal } from '@visx/legend';
import Legend from '@kitman/modules/src/analysis/shared/components/Legend';
import useChartContext from '../hooks/useChartContext';

const LegendWrapper = () => {
  const { colorScale } = useContext(DataContext);

  const {
    controls: { hiddenSeries },
    controlsApi: { setHiddenSeries },
    series,
  } = useChartContext();

  const seriesIds = Object.keys(series);

  const isMultiSeries = seriesIds?.length > 1;

  // if not multi series, and series is not grouped return null
  if (!isMultiSeries && !series?.[seriesIds[0]]?.isGrouped) {
    return null;
  }

  return (
    <LegendOrdinal
      data-testId="XYChart|LegendWrapper"
      direction="row"
      itemMargin="4px"
      scale={colorScale}
    >
      {(labels) => (
        <Legend
          labels={labels}
          hiddenSeries={hiddenSeries}
          setHiddenSeries={setHiddenSeries}
          series={series}
          isMultiSeries={isMultiSeries}
        />
      )}
    </LegendOrdinal>
  );
};

export default LegendWrapper;
