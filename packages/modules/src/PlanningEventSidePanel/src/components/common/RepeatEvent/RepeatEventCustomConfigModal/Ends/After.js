// @flow
import { withNamespaces } from 'react-i18next';
import { type ComponentType } from 'react';

import { InputNumeric, InputRadio } from '@kitman/components';
import { type RadioOption } from '@kitman/components/src/InputRadio/types';
import { type I18nProps } from '@kitman/common/src/types/i18n';

import {
  isInvalidNumberForNumericInput,
  isValidForPositiveInteger,
} from '../utils/helpers';
import { type EndsConfig, type EndsOption, endsOption } from '../utils/types';

type Props = {
  afterTranslated: string,
  timesTranslated: string,
  selectedOption: EndsOption,
  setSelectedOption: (option: EndsOption) => void,
  onChange: (newEndsConfig: EndsConfig) => void,
  endsConfig: EndsConfig,
};

const After = ({
  afterTranslated,
  timesTranslated,
  selectedOption,
  setSelectedOption,
  onChange,
  endsConfig,
}: I18nProps<Props>) => {
  const currentChosenDate = endsConfig.on.date;
  const currentNumberOfOccurrences = endsConfig.after.numberOfOccurrences;

  const afterOption: RadioOption = {
    name: afterTranslated,
    value: endsOption.After,
  };
  return (
    <li>
      <InputRadio
        inputName={afterTranslated}
        value={selectedOption}
        option={afterOption}
        change={(option) => {
          setSelectedOption(option);
          const newEndsConfig: EndsConfig = {
            never: false,
            on: {
              isSelected: false,
              date: currentChosenDate,
            },
            after: {
              isSelected: true,
              numberOfOccurrences: currentNumberOfOccurrences,
            },
          };
          onChange(newEndsConfig);
        }}
        index={2}
        kitmanDesignSystem
      />
      <InputNumeric
        kitmanDesignSystem
        value={currentNumberOfOccurrences}
        min={1}
        onKeyDown={(e: KeyboardEvent) => {
          if (!isValidForPositiveInteger(e.key)) e.preventDefault();
        }}
        onChange={(newValueString: string) => {
          const newValue =
            newValueString === '' || Number.isNaN(newValueString)
              ? null
              : +newValueString;
          const newEndsConfig: EndsConfig = {
            ...endsConfig,
            after: {
              isSelected: true,
              numberOfOccurrences: newValue,
            },
          };
          onChange(newEndsConfig);
        }}
        isInvalid={
          endsConfig.after.isSelected &&
          currentNumberOfOccurrences !== null &&
          isInvalidNumberForNumericInput(currentNumberOfOccurrences)
        }
        descriptor={timesTranslated}
        disabled={!endsConfig.after.isSelected}
      />
    </li>
  );
};

export const AfterTranslated: ComponentType<Props> = withNamespaces()(After);
export default After;
