// @flow
import { LegendOrdinal } from '@visx/legend';
import { scaleOrdinal } from '@visx/scale';
import Legend from '@kitman/modules/src/analysis/shared/components/Legend';
import type {
  LabelAccessor,
  PieDatumProps,
} from '@kitman/modules/src/analysis/shared/components/PieChart/types';
import type { SeriesLabel } from '@kitman/modules/src/analysis/shared/components/XYChart/hooks/useChartControlsState';

type Props = {
  data: Array<PieDatumProps>,
  labelAccessor: LabelAccessor,
  colors: Array<string>,
  hiddenSeries: Array<SeriesLabel>,
  setHiddenSeries: (label: Array<SeriesLabel>) => void,
};

const LegendWrapper = ({
  data,
  labelAccessor,
  colors,
  hiddenSeries,
  setHiddenSeries,
}: Props) => {
  const domain = data.map(labelAccessor);
  const colorScale = scaleOrdinal({
    domain,
    range: colors,
  });

  return (
    <LegendOrdinal direction="row" itemMargin="4px" scale={colorScale}>
      {(labels) => (
        <Legend
          labels={labels}
          hiddenSeries={hiddenSeries}
          setHiddenSeries={setHiddenSeries}
          isMultiSeries={false}
          isStatic
        />
      )}
    </LegendOrdinal>
  );
};

export default LegendWrapper;
