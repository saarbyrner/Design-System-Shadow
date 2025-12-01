// @flow
import { useEffect, useState } from 'react';
import { withNamespaces } from 'react-i18next';

import { InputNumeric, ToggleSwitch } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import Panel from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/components/Panel/index';
import { getLabelsMap } from './constants';

type Props = {
  onSetTimePeriodLength: Function,
  onSetTimePeriodLengthOffset: Function,
  timePeriodLength: ?number,
  timePeriodLengthOffset: ?number,
  timePeriodValue: string,
};

const LastXEvents = (props: I18nProps<Props>) => {
  const [hasOffsetPeriod, setOffsetPeriod] = useState(
    props.timePeriodLength !== null
  );

  useEffect(() => {
    const resetTimePeriodLengthOffset = () => {
      if (!hasOffsetPeriod) {
        props.onSetTimePeriodLengthOffset(null);
      }
    };

    resetTimePeriodLengthOffset();

    return () => {
      resetTimePeriodLengthOffset();
    };
  }, [hasOffsetPeriod]);

  return (
    <>
      <Panel.InlineField>
        <InputNumeric
          data-testid="DateRangeModule|LastXEvents|TimePeriodInput"
          label={props.t('Last')}
          onChange={(value) => props.onSetTimePeriodLength(parseInt(value, 10))}
          value={props.timePeriodLength ?? ''}
          kitmanDesignSystem
        />
        <Panel.InlineFieldLabel>
          {getLabelsMap()[props.timePeriodValue]}
        </Panel.InlineFieldLabel>
      </Panel.InlineField>
      <Panel.Field>
        <ToggleSwitch
          data-testid="DateRangeModule|LastXEvents|PeriodToggle"
          isSwitchedOn={hasOffsetPeriod}
          label={props.t('Offset period')}
          labelPlacement="right"
          toggle={() => setOffsetPeriod(!hasOffsetPeriod)}
          kitmanDesignSystem
        />
      </Panel.Field>
      {hasOffsetPeriod && (
        <Panel.InlineField>
          <InputNumeric
            data-testid="DateRangeModule|LastXEvents|OffsetInput"
            label={props.t('Offset')}
            onChange={(value) =>
              props.onSetTimePeriodLengthOffset(parseInt(value, 10))
            }
            value={props.timePeriodLengthOffset}
            kitmanDesignSystem
          />
          <Panel.InlineFieldLabel>
            {getLabelsMap()[props.timePeriodValue]}
          </Panel.InlineFieldLabel>
        </Panel.InlineField>
      )}
    </>
  );
};

export const LastXEventsTranslated = withNamespaces()(LastXEvents);
export default LastXEvents;
