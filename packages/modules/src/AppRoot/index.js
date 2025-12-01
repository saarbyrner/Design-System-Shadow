// @flow
import type { Node } from 'react';
import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { ErrorBoundary } from '@kitman/components';
import AsyncErrorBoundary from '@kitman/components/src/ErrorBoundary/AsyncErrorBoundary';
import i18n from '@kitman/common/src/utils/i18n';
import { PermissionsProvider } from '@kitman/common/src/contexts/PermissionsContext';
import { PreferencesProvider } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';
import { OrganisationProvider } from '@kitman/common/src/contexts/OrganisationContext';
import { TwilioClientProvider } from '@kitman/common/src/contexts/TwilioClientContext';
import TwilioInitialiser from '@kitman/modules/src/initialiseProfiler/modules/messaging';
import Toasts from '@kitman/modules/src/Toasts';
import {
  LocalizationProvider,
  ThemeProvider,
} from '@kitman/playbook/providers';
import { Provider as ReduxProvider } from 'react-redux';
import { setupStore } from './store';

type Props = {
  children: Node,
};

export default ({ children }: Props) => {
  return (
    <React.StrictMode>
      <AsyncErrorBoundary>
        <ErrorBoundary>
          <I18nextProvider i18n={i18n}>
            <ReduxProvider store={setupStore()}>
              <OrganisationProvider>
                <PermissionsProvider>
                  <PreferencesProvider>
                    <ThemeProvider>
                      <LocalizationProvider>
                        <TwilioClientProvider>
                          {children}
                          <Toasts />
                          {window.getFlag('cp-messaging-notifications') &&
                            window.getFlag('single-page-application') && (
                              <TwilioInitialiser />
                            )}
                        </TwilioClientProvider>
                      </LocalizationProvider>
                    </ThemeProvider>
                  </PreferencesProvider>
                </PermissionsProvider>
              </OrganisationProvider>
            </ReduxProvider>
          </I18nextProvider>
        </ErrorBoundary>
      </AsyncErrorBoundary>
    </React.StrictMode>
  );
};
