// @flow
import type { Props } from '../index';

export const DatePickerTranslated = (props: Props) => {
  return (
    <>
      <label>
        {props.label}
        {props.maxDate && (
          <span data-testid="maximum-date">{props.maxDate.toString()}</span>
        )}
        {props.minDate && (
          <span data-testid="minimum-date">{props.minDate.toString()}</span>
        )}
        <input
          type="text"
          className={props.disableFutureDates ? 'disable-future-dates' : ''}
          value={props.value?.toString() || ''}
          onChange={(e) => {
            if (typeof props.onDateChange === 'function') {
              props.onDateChange(
                props.multiDate
                  ? e.target.value
                      .split('|')
                      .map((dateStr) => new Date(dateStr))
                  : new Date(e.target.value)
              );
            }
          }}
          disabled={props.disabled}
        />
      </label>
      {props.optional && <span>Optional</span>}
    </>
  );
};
