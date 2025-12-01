// @flow

import type { Node } from 'react';
import { LocalizationProvider as Provider } from '@mui/x-date-pickers-pro';
import { I18nextProvider as TranslationProvider } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

type ProviderProps = {
  children: Node,
};

const LocalizationProvider = ({ children }: ProviderProps) => {
  const locale = navigator.language;
  return (
    <TranslationProvider i18n={i18n}>
      <Provider dateAdapter={AdapterMoment} adapterLocale={locale}>
        {children}
      </Provider>
    </TranslationProvider>
  );
};

export default LocalizationProvider;
