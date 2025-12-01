// @flow
import { Frequency } from 'rrule';
import { withNamespaces } from 'react-i18next';
import { type ComponentType } from 'react';

import { InputNumeric, Select } from '@kitman/components';
import { fullWidthMenuCustomStyles } from '@kitman/components/src/Select';
import { type I18nProps } from '@kitman/common/src/types/i18n';

import styles from './utils/styles';
import {
  getRepeatEveryOptions,
  getRepeatEveryTranslations,
  isInvalidNumberForNumericInput,
  isValidForPositiveInteger,
} from './utils/helpers';
import { type RepeatEveryConfig } from './utils/types';

const {
  repeatEvery: { container, text },
} = styles;
type Props = {
  repeatEveryConfig: RepeatEveryConfig,
  onChangeInterval: (newIntervalString: string) => void,
  onChangeFrequency: (newFrequency: typeof Frequency) => void,
};

const RepeatEvery = ({
  t,
  repeatEveryConfig: { frequency, interval },
  onChangeInterval,
  onChangeFrequency,
}: I18nProps<Props>) => {
  const translations = getRepeatEveryTranslations(t);
  const options = getRepeatEveryOptions(translations, interval);
  return (
    <div css={container}>
      <p css={text}>{translations.repeatEvery}</p>
      <div>
        <InputNumeric
          kitmanDesignSystem
          value={interval}
          min={1}
          onKeyDown={(e: KeyboardEvent) => {
            if (!isValidForPositiveInteger(e.key)) e.preventDefault();
          }}
          onChange={onChangeInterval}
          isInvalid={isInvalidNumberForNumericInput(interval)}
        />
        <Select
          options={options}
          value={frequency}
          customSelectStyles={fullWidthMenuCustomStyles}
          onChange={onChangeFrequency}
        />
      </div>
    </div>
  );
};

export const RepeatEveryTranslated: ComponentType<Props> =
  withNamespaces()(RepeatEvery);
export default RepeatEvery;
