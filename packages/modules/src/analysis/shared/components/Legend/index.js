// @flow
import _find from 'lodash/find';
import { LegendItem, LegendLabel } from '@visx/legend';
import type { SeriesLabel } from '../XYChart/hooks/useChartControlsState';
import type { SeriesContextType } from '../XYChart/types';

type Props = {
  labels: Array<SeriesLabel>,
  hiddenSeries: Array<SeriesLabel>,
  setHiddenSeries: (label: Array<SeriesLabel>) => void,
  series?: SeriesContextType,
  isMultiSeries: boolean,
  isStatic?: boolean,
};

const styles = {
  legend: {
    display: 'flex',
    margin: '10px',
    maxHeight: '30px',
    overflowY: 'auto',
    overflowX: 'hidden',
    flexWrap: 'wrap',
    fontSize: '11px',
    cursor: 'pointer',
  },
  label: {
    align: 'left',
    marginLeft: '50px',
  },
  getCustomCircleStyling: (color) => ({
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: color,
  }),
  isHidden: {
    opacity: '0.5',
  },
};

const Legend = ({
  labels,
  hiddenSeries,
  setHiddenSeries,
  series,
  isMultiSeries,
  isStatic = false,
}: Props) => {
  const handleOnClick = (isHidden: boolean, label: SeriesLabel) => {
    if (isHidden) {
      setHiddenSeries(hiddenSeries.filter((lab) => lab.datum !== label.datum));
    } else {
      setHiddenSeries([...hiddenSeries, label]);
    }
  };

  return (
    <div css={styles.legend}>
      {labels.map((label) => {
        // finding series based on index wasn't reliable with multi series. Instead we use datum value.
        const isHidden = _find(hiddenSeries, { datum: label.datum });

        let legendDisplayName = label?.text || '';

        if (!isStatic) {
          const labelSeriesId = label.datum?.split('-')?.[0];
          // Use regex to split at the first dash instead of each dash
          const labelGrouping = label.datum?.split(/-(.*)/)?.[1];

          const labelSeriesName = series?.[labelSeriesId]?.name || '';

          legendDisplayName = isMultiSeries
            ? `${labelSeriesName}${labelGrouping ? ` - ${labelGrouping}` : ''}`
            : labelGrouping;
        }

        return (
          <LegendItem key={label.index} margin="0 0 0 10px">
            <div css={isHidden && styles.isHidden}>
              <svg height={10} width={10}>
                <circle
                  data-testid={`Chart|Cicle-${label.text}`}
                  cx={5}
                  cy={5}
                  r={5}
                  fill={label.value}
                  onClick={() => handleOnClick(isHidden, label)}
                />
              </svg>
            </div>
            <LegendLabel
              data-testid={`Chart|Legend-${label.text}`}
              onClick={() => handleOnClick(isHidden, label)}
              css={isHidden && styles.isHidden}
              align="left"
              margin="0 0 0 5px"
            >
              {legendDisplayName}
            </LegendLabel>
          </LegendItem>
        );
      })}
    </div>
  );
};

export default Legend;
