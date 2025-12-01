// @flow
import { useState } from 'react';
import { withNamespaces } from 'react-i18next';
import classnames from 'classnames';
import { LastXPeriodPicker, ToggleSwitch } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  disabled?: boolean,
  metricIndex?: number,
  timePeriodLengthOffset: ?number,
  onUpdateTimePeriodLengthOffset: Function,
  lastXTimePeriodOffset: 'weeks' | 'days',
  onUpdateLastXTimePeriodOffset: Function,
  radioName?: string,
  kitmanDesignSystem: boolean,
};

const LastXPeriodOffset = (props: I18nProps<Props>) => {
  const [showOffsetField, setShowOffsetField] = useState(
    Boolean(props.timePeriodLengthOffset)
  );

  return (
    <div
      className={classnames('lastXPeriodOffset', {
        'col-xl-12': !props.kitmanDesignSystem,
        'lastXPeriodOffset--kitmanDesignSystem': props.kitmanDesignSystem,
      })}
    >
      <div className="lastXPeriodOffset__toggle">
        <ToggleSwitch
          isSwitchedOn={showOffsetField}
          toggle={() => {
            props.onUpdateTimePeriodLengthOffset(null);
            setShowOffsetField((prevShowOffsetField) => !prevShowOffsetField);
          }}
          label={props.t('Offset date range')}
          labelPlacement="right"
          kitmanDesignSystem={props.kitmanDesignSystem}
        />
      </div>

      {showOffsetField && (
        <LastXPeriodPicker
          onPeriodLengthChange={(value) =>
            props.onUpdateTimePeriodLengthOffset(value)
          }
          onTimePeriodChange={(value) =>
            props.onUpdateLastXTimePeriodOffset(value)
          }
          timePeriod={props.lastXTimePeriodOffset}
          periodLength={props.timePeriodLengthOffset}
          radioName={props.radioName}
          disabled={props.disabled}
          metricIndex={props.metricIndex}
          inputLabel={props.t('Offset')}
          kitmanDesignSystem={props.kitmanDesignSystem}
        />
      )}
    </div>
  );
};

export const LastXPeriodOffsetTranslated = withNamespaces()(LastXPeriodOffset);
export default LastXPeriodOffset;
