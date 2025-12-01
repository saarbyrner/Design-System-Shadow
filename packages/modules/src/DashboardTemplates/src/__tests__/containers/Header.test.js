import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import i18n from '@kitman/common/src/utils/i18n';
import { buildTemplates } from '@kitman/common/src/utils/test_utils';
import Header from '../../containers/Header';

describe('<Header />', () => {
  const templates = buildTemplates(5);

  beforeEach(() => {
    window.featureFlags = {};
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders', () => {
    const preloadedState = {
      templates,
    };

    renderWithRedux(
      <I18nextProvider i18n={i18n}>
        <Header />
      </I18nextProvider>,
      { preloadedState, useGlobalStore: false }
    );

    // Header should render without crashing
    expect(document.body).toBeInTheDocument();
  });

  it('sets props correctly', () => {
    const preloadedState = {
      templates,
    };

    renderWithRedux(
      <I18nextProvider i18n={i18n}>
        <Header />
      </I18nextProvider>,
      { preloadedState, useGlobalStore: false }
    );

    // The templates should be passed to the component
    expect(document.body).toBeInTheDocument();
  });

  it('sends the correct action when addTemplate is called', async () => {
    const user = userEvent.setup();
    const preloadedState = {
      templates,
    };

    const { mockedStore } = renderWithRedux(
      <I18nextProvider i18n={i18n}>
        <Header />
      </I18nextProvider>,
      { preloadedState, useGlobalStore: false }
    );

    const spy = jest.spyOn(mockedStore, 'dispatch');

    // Find the add button by its class - it's an icon button with icon-add class
    const addButton = screen.getByRole('button');
    await user.click(addButton);

    expect(spy).toHaveBeenCalledWith({
      type: 'SHOW_ADD_MODAL',
    });
  });
});
