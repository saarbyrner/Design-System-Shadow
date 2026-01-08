// @flow
import { useMemo, type ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';

import i18n from '@kitman/common/src/utils/i18n';
import { Select } from '@kitman/components';
import type { Option } from '@kitman/components/src/Select';
import type { I18nProps } from '@kitman/common/src/types/i18n';

import { useSettings } from '../utils/hooks';
import { checkWeekStartDayValidity } from '../utils/helpers';
import type { CheckFormValidtyForField } from '../utils/types';

const getOptions = (): Array<Option> => [
  {
    label: i18n.t('Sunday'),
    value: 'Sunday',
  },
  {
    label: i18n.t('Monday'),
    value: 'Monday',
  },
  {
    label: i18n.t('Tuesday'),
    value: 'Tuesday',
  },
  {
    label: i18n.t('Wednesday'),
    value: 'Wednesday',
  },
  {
    label: i18n.t('Thursday'),
    value: 'Thursday',
  },
  {
    label: i18n.t('Friday'),
    value: 'Friday',
  },
  {
    label: i18n.t('Saturday'),
    value: 'Saturday',
  },
];

const keyName = 'weekStartDay';

type Props = { checkFormValidity: CheckFormValidtyForField };

type TranslatedProps = I18nProps<Props>;

const WeekStartDay = ({ t, checkFormValidity }: TranslatedProps) => {
  const { setSettings, settings } = useSettings(keyName);

  const options = useMemo(() => getOptions(), []);

  return (
    <Select
      label={t('Start week on')}
      options={options}
      value={settings}
      onChange={(value) => {
        setSettings(value);
        checkFormValidity();
      }}
      invalid={!checkWeekStartDayValidity(settings)}
    />
  );
};

export const WeekStartDayTranslated: ComponentType<Props> =
  withNamespaces()(WeekStartDay);
export default WeekStartDay;
