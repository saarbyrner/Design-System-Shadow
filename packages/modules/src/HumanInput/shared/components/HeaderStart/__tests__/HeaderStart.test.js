import { screen } from '@testing-library/react';
import i18n from '@kitman/common/src/utils/i18n';
import { setI18n } from 'react-i18next';

import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { HeaderStartTranslated as HeaderStart } from '@kitman/modules/src/HumanInput/shared/components/HeaderStart';
import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';

setI18n(i18n);

describe('HeaderStart', () => {
  const i18nT = i18nextTranslateStub();
  const props = {
    title: 'Test Title',
    handleBack: jest.fn(),
    t: i18nT,
  };

  it('renders', () => {
    renderWithProviders(<HeaderStart {...props} />);

    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders avatar', () => {
    renderWithProviders(
      <HeaderStart {...props} avatarUrl="https://someavatarurl.com" />
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(
      screen.getByRole('img', {
        name: '',
      })
    ).toBeInTheDocument();
  });
});
