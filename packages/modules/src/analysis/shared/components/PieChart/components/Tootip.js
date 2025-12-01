// @flow
import { Tooltip as VisxTooltip } from '@visx/tooltip';
import { CircleShape } from '@visx/legend';
import type { TooltipData } from '@kitman/modules/src/analysis/shared/components/PieChart/types';
import { getOtherSegementLabel } from '../constants';

import { getPercentageValueFromData } from '../utils';
import type { PieDatumProps, ValueAccessor } from '../types';

type Props = {
  left: number,
  top: number,
  data: TooltipData,
  sourceName: string,
  seriesData: Array<PieDatumProps>,
  otherSegment: Array<PieDatumProps>,
  valueAccessor: ValueAccessor,
};

const styles = {
  wrapper: {
    fontWeight: 600,
    fontSize: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    margin: '8px 4px',
  },
  inner: {
    fontWeight: 400,
    display: 'inherit',
    gap: 'inherit',
  },
  groupItems: {
    display: 'inherit',
    gap: '6px',
    alignItems: 'center',
  },
  label: {
    fontWeight: 600,
    fontSize: '16px',
    marginLeft: 'auto',
  },
  otherSegment: {
    display: 'flex',
    flexDirection: 'column',
  },
};

const Tooltip = ({
  left,
  top,
  data,
  sourceName,
  seriesData,
  otherSegment,
  valueAccessor,
}: Props) => {
  const name = sourceName.split('-')?.[0];
  const otherLabel = getOtherSegementLabel();

  return (
    <VisxTooltip key={`tooltip-${Math.random()}`} top={top} left={left}>
      <div css={styles.wrapper}>
        <p>{name}</p>

        {data.label === otherLabel && (
          <>
            <div
              css={{
                display: 'flex',
                flexDirection: 'row',
                fontWeight: 400,
                gap: '6px',
                alignItems: 'center',
                marginRight: '16px',
              }}
            >
              <CircleShape width={8} height={8} fill={data?.color} />
              <span>{data?.label}</span>
            </div>
            <div css={styles.otherSegment}>
              {data.label === otherLabel &&
                otherSegment?.map((item) => {
                  return (
                    <div
                      key={item.label}
                      css={{
                        display: 'flex',
                        flexDirection: 'row',
                        fontWeight: 400,
                        margin: '6px 4px',
                      }}
                    >
                      <span>{item?.label}</span>
                      <div css={styles.label}>{`${getPercentageValueFromData(
                        item,
                        valueAccessor,
                        seriesData
                      )}%`}</div>
                    </div>
                  );
                })}
            </div>
          </>
        )}

        {data.label !== otherLabel && (
          <div css={styles.inner}>
            <div css={styles.groupItems}>
              <CircleShape width={8} height={8} fill={data?.color} />
              <span>{data?.label}</span>
            </div>

            <div css={styles.label}>{`${data.percentage}%`}</div>
          </div>
        )}
      </div>
    </VisxTooltip>
  );
};

export default Tooltip;
