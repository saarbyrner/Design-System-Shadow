// @flow
import { I18nextProvider } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import { render } from '@testing-library/react';
import type { Component } from 'react';
import type { RenderOptions } from '@testing-library/react';

import { SettingsContextProvider } from '../SettingsContext';

export const renderWithContext = (
  ComponentToRender: Component<any>,
  opts: RenderOptions
) =>
  render(ComponentToRender, {
    wrapper: ({ children }) => (
      <I18nextProvider i18n={i18n}>
        <SettingsContextProvider>{children}</SettingsContextProvider>
      </I18nextProvider>
    ),
    ...opts,
  });
