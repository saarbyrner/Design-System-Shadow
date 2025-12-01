// @flow
import { useState, useEffect } from 'react';
import type { EventGameFormValidity } from '@kitman/modules/src/PlanningEventSidePanel/src/types';
import type { GamePeriod } from '@kitman/common/src/types/GameEvent';
import { InputNumericTranslated as InputNumeric } from '../InputNumeric';

type Props = {
  labelText: string,
  period: GamePeriod,
  onUpdateCustomPeriodDuration: Function,
  descriptor: string,
  periodIndex: number,
  eventValidity?: EventGameFormValidity,
};

const CustomPeriod = (props: Props) => {
  const [customMinute, setCustomMinute] = useState('0');
  const [invalidMinuteFlag, setInvalidMinuteFlag] = useState(false);

  useEffect(() => {
    setCustomMinute(props.period.duration);
  }, [props.period.duration]);

  const handleCustomMinuteUpdate = () => {
    if (+customMinute <= 0) {
      setCustomMinute(props.period.duration);
      setInvalidMinuteFlag(true);
    } else {
      setInvalidMinuteFlag(false);
      props.onUpdateCustomPeriodDuration(+customMinute, props.periodIndex);
    }
  };

  return (
    <InputNumeric
      label={props.labelText}
      name="period-input"
      value={customMinute || ''}
      inputMode="numeric"
      onChange={setCustomMinute}
      onBlur={handleCustomMinuteUpdate}
      descriptor={props.descriptor}
      isInvalid={
        invalidMinuteFlag ||
        (props.eventValidity?.custom_periods?.isInvalid && !+customMinute)
      }
      kitmanDesignSystem
    />
  );
};
export default CustomPeriod;
