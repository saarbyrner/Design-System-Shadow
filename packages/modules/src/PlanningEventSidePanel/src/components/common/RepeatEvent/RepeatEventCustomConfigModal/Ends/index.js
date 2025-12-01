// @flow
import { withNamespaces } from 'react-i18next';
import { useState, type ComponentType } from 'react';
import moment from 'moment-timezone';

import { type I18nProps } from '@kitman/common/src/types/i18n';

import { NeverTranslated as Never } from './Never';
import { OnTranslated as On } from './On';
import { AfterTranslated as After } from './After';
import styles from '../utils/styles';
import { getEndsTranslations } from '../utils/helpers';
import { type EndsConfig, type EndsOption, endsOption } from '../utils/types';

const {
  ends: { container, text },
} = styles;

const getInitialOption = ({ after, on }: EndsConfig) => {
  // All the endsOption values are mutually exclusive.
  if (after.isSelected) {
    return endsOption.After;
  }
  if (on.isSelected) {
    return endsOption.On;
  }
  return endsOption.Never;
};

type Props = {
  endsConfig: EndsConfig,
  onChange: (newEndsConfig: EndsConfig) => void,
  eventDate: typeof moment,
};

const Ends = ({ t, onChange, endsConfig, eventDate }: I18nProps<Props>) => {
  const [selectedOption, setSelectedOption] = useState<EndsOption>(
    getInitialOption(endsConfig)
  );

  const translations = getEndsTranslations(t);

  const currentChosenDate = endsConfig.on.date;
  const currentNumberOfOccurrences = endsConfig.after.numberOfOccurrences;

  return (
    <div css={container}>
      <p css={text}>{translations.ends}</p>
      <ul>
        <Never
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
          currentChosenDate={currentChosenDate}
          currentNumberOfOccurrences={currentNumberOfOccurrences}
          neverTranslated={translations.never}
          onChange={onChange}
        />
        <On
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
          onTranslated={translations.on}
          onChange={onChange}
          endsConfig={endsConfig}
          eventDate={eventDate}
        />
        <After
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
          afterTranslated={translations.after}
          timesTranslated={translations.times}
          onChange={onChange}
          endsConfig={endsConfig}
        />
      </ul>
    </div>
  );
};

export const EndsTranslated: ComponentType<Props> = withNamespaces()(Ends);
export default Ends;
