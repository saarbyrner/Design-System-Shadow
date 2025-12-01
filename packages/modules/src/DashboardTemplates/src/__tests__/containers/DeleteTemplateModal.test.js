import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import i18n from '@kitman/common/src/utils/i18n';
import DeleteTemplateModal from '../../containers/DeleteTemplateModal';

describe('<DeleteTemplateModal />', () => {
  beforeEach(() => {
    window.featureFlags = {};
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders', () => {
    const preloadedState = {
      modals: {
        confirmDeleteVisible: true,
        templateToDelete: {
          name: 'Template name',
        },
      },
    };

    renderWithRedux(
      <I18nextProvider i18n={i18n}>
        <DeleteTemplateModal />
      </I18nextProvider>,
      { preloadedState, useGlobalStore: false }
    );

    expect(
      screen.getByText('Are you sure you want to delete "Template name"?')
    ).toBeInTheDocument();
  });

  it('sets props correctly', () => {
    const preloadedState = {
      modals: {
        confirmDeleteVisible: true,
        templateToDelete: {
          name: 'Template name',
        },
      },
    };

    renderWithRedux(
      <I18nextProvider i18n={i18n}>
        <DeleteTemplateModal />
      </I18nextProvider>,
      { preloadedState, useGlobalStore: false }
    );

    expect(
      screen.getByText('Are you sure you want to delete "Template name"?')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  it('sends the correct action when closeModal is called', async () => {
    const user = userEvent.setup();
    const preloadedState = {
      modals: {
        confirmDeleteVisible: true,
        templateToDelete: {
          name: 'Template name',
        },
      },
    };

    const { mockedStore } = renderWithRedux(
      <I18nextProvider i18n={i18n}>
        <DeleteTemplateModal />
      </I18nextProvider>,
      { preloadedState, useGlobalStore: false }
    );

    const spy = jest.spyOn(mockedStore, 'dispatch');

    // Find and click the cancel button
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(spy).toHaveBeenCalledWith({
      type: 'CLOSE_MODAL',
    });
  });
});
