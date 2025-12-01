// @flow
import { withNamespaces } from 'react-i18next';
import type { ComponentType } from 'react';

import { InputRadio } from '@kitman/components';
import { type RadioOption } from '@kitman/components/src/InputRadio/types';
import { type I18nProps } from '@kitman/common/src/types/i18n';

import { type EndsConfig, type EndsOption, endsOption } from '../utils/types';

type Props = {
  neverTranslated: string,
  selectedOption: EndsOption,
  setSelectedOption: (option: EndsOption) => void,
  onChange: (newEndsConfig: EndsConfig) => void,
  currentChosenDate: Date | null,
  currentNumberOfOccurrences: number | null,
};

const Never = ({
  neverTranslated,
  selectedOption,
  setSelectedOption,
  onChange,
  currentChosenDate,
  currentNumberOfOccurrences,
}: I18nProps<Props>) => {
  const neverOption: RadioOption = {
    name: neverTranslated,
    value: endsOption.Never,
  };
  return (
    <li>
      <InputRadio
        inputName={neverTranslated}
        option={neverOption}
        value={selectedOption}
        change={(option) => {
          setSelectedOption(option);
          const newEndsConfig: EndsConfig = {
            never: true,
            on: {
              isSelected: false,
              date: currentChosenDate,
            },
            after: {
              isSelected: false,
              numberOfOccurrences: currentNumberOfOccurrences,
            },
          };
          onChange(newEndsConfig);
        }}
        index={0}
        kitmanDesignSystem
      />
    </li>
  );
};

export const NeverTranslated: ComponentType<Props> = withNamespaces()(Never);
export default Never;
