// @flow
import moment from 'moment-timezone';
import { withNamespaces } from 'react-i18next';
import { type ComponentType } from 'react';

import { DatePicker, InputRadio } from '@kitman/components';
import { type RadioOption } from '@kitman/components/src/InputRadio/types';
import { type I18nProps } from '@kitman/common/src/types/i18n';

import { type EndsConfig, type EndsOption, endsOption } from '../utils/types';

type Props = {
  onTranslated: string,
  selectedOption: EndsOption,
  setSelectedOption: (option: EndsOption) => void,
  onChange: (newEndsConfig: EndsConfig) => void,
  endsConfig: EndsConfig,
  eventDate: typeof moment,
};

const On = ({
  onTranslated,
  selectedOption,
  setSelectedOption,
  onChange,
  endsConfig,
  eventDate,
}: I18nProps<Props>) => {
  const currentChosenDate = endsConfig.on.date ?? eventDate;
  const currentNumberOfOccurrences = endsConfig.after.numberOfOccurrences;

  const onOption: RadioOption = {
    name: onTranslated,
    value: endsOption.On,
  };
  return (
    <li>
      <InputRadio
        inputName={onTranslated}
        value={selectedOption}
        option={onOption}
        change={(option) => {
          setSelectedOption(option);
          const newEndsConfig: EndsConfig = {
            never: false,
            on: {
              isSelected: true,
              date: currentChosenDate,
            },
            after: {
              isSelected: false,
              numberOfOccurrences: currentNumberOfOccurrences,
            },
          };
          onChange(newEndsConfig);
        }}
        index={1}
        kitmanDesignSystem
      />
      <DatePicker
        name="date"
        onDateChange={(newValue: Date) => {
          const newEndsConfig: EndsConfig = {
            ...endsConfig,
            on: {
              isSelected: true,
              // As DatePicker returns value at start of day, i.e. 00:00:00, and the
              // fact that RRule requires UTC, when converting, date would be converted
              // to previous day. Converting to end of day to combat this, i.e. 23:59:59.
              date: moment(newValue).endOf('day'),
            },
          };
          onChange(newEndsConfig);
        }}
        value={moment(currentChosenDate).format('YYYY-MM-DD')}
        minDate={eventDate}
        kitmanDesignSystem
        disabled={!endsConfig.on.isSelected}
      />
    </li>
  );
};

export const OnTranslated: ComponentType<Props> = withNamespaces()(On);
export default On;
