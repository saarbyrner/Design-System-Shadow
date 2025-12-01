import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import i18n from '@kitman/common/src/utils/i18n';
import AddTemplateModal from '../../containers/AddTemplateModal';

describe('<AddTemplateModal />', () => {
  beforeEach(() => {
    window.featureFlags = {};
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders', () => {
    const preloadedState = {
      modals: {
        addTemplateVisible: true,
      },
      templates: [],
    };

    renderWithRedux(
      <I18nextProvider i18n={i18n}>
        <AddTemplateModal />
      </I18nextProvider>,
      { preloadedState, useGlobalStore: false }
    );

    expect(screen.getByText('New Dashboard')).toBeInTheDocument();
  });

  it('sets props correctly', () => {
    const preloadedState = {
      modals: {
        addTemplateVisible: true,
      },
      templates: [],
    };

    renderWithRedux(
      <I18nextProvider i18n={i18n}>
        <AddTemplateModal />
      </I18nextProvider>,
      { preloadedState, useGlobalStore: false }
    );

    expect(screen.getByText('New Dashboard')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
  });

  it('sends the correct action when closeModal is called', async () => {
    const user = userEvent.setup();
    const preloadedState = {
      modals: {
        addTemplateVisible: true,
      },
      templates: [],
    };

    const { mockedStore } = renderWithRedux(
      <I18nextProvider i18n={i18n}>
        <AddTemplateModal />
      </I18nextProvider>,
      { preloadedState, useGlobalStore: false }
    );

    const spy = jest.spyOn(mockedStore, 'dispatch');

    // Find and click the cancel/close button
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(spy).toHaveBeenCalledWith({
      type: 'CLOSE_MODAL',
    });
  });
});
