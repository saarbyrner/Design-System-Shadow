// @flow
import { withNamespaces } from 'react-i18next';
import type { ComponentType } from 'react';

import { InputNumeric } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useSettings } from '../utils/hooks';
import { checkDefaultEventDurationValidity } from '../utils/helpers';
import type { CheckFormValidtyForField } from '../utils/types';

const keyName = 'defaultEventDurationMins';

type Props = { checkFormValidity: CheckFormValidtyForField };

type TranslatedProps = I18nProps<Props>;

const DefaultEventDuration = ({ t, checkFormValidity }: TranslatedProps) => {
  const { setSettings, settings } = useSettings(keyName);
  return (
    <InputNumeric
      label={t('Default event duration')}
      name={keyName}
      value={settings}
      onChange={(value) => {
        setSettings(value);
        checkFormValidity();
      }}
      descriptor={t('mins')}
      size="small"
      kitmanDesignSystem
      isInvalid={!checkDefaultEventDurationValidity(settings)}
    />
  );
};

export const DefaultEventDurationTranslated: ComponentType<Props> =
  withNamespaces()(DefaultEventDuration);
export default DefaultEventDuration;
