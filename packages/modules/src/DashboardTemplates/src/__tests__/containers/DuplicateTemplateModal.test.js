import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import i18n from '@kitman/common/src/utils/i18n';
import DuplicateTemplateModal from '../../containers/DuplicateTemplateModal';

describe('<DuplicateTemplateModal />', () => {
  beforeEach(() => {
    window.featureFlags = {};
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders', () => {
    const preloadedState = {
      modals: {
        duplicateTemplateVisible: true,
        templateToDuplicate: {
          id: 1,
          name: 'Template 1',
        },
        templateName: 'Template 1',
      },
      templates: [],
    };

    renderWithRedux(
      <I18nextProvider i18n={i18n}>
        <DuplicateTemplateModal />
      </I18nextProvider>,
      { preloadedState, useGlobalStore: false }
    );

    expect(
      screen.getByText("Duplicate Dashboard 'Template 1'")
    ).toBeInTheDocument();
  });

  it('sets props correctly', () => {
    const preloadedState = {
      modals: {
        duplicateTemplateVisible: true,
        templateToDuplicate: {
          id: 1,
          name: 'Template 1',
        },
        templateName: 'Template 1',
      },
      templates: [],
    };

    renderWithRedux(
      <I18nextProvider i18n={i18n}>
        <DuplicateTemplateModal />
      </I18nextProvider>,
      { preloadedState, useGlobalStore: false }
    );

    expect(
      screen.getByText("Duplicate Dashboard 'Template 1'")
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByDisplayValue('')).toBeInTheDocument();
  });

  it('sends the correct action when closeModal is called', async () => {
    const user = userEvent.setup();
    const preloadedState = {
      modals: {
        duplicateTemplateVisible: true,
        templateToDuplicate: {
          id: 1,
          name: 'Template 1',
        },
        templateName: 'Template 1',
      },
      templates: [],
    };

    const { mockedStore } = renderWithRedux(
      <I18nextProvider i18n={i18n}>
        <DuplicateTemplateModal />
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

  it('sends the correct action when onChange is called', () => {
    const preloadedState = {
      modals: {
        duplicateTemplateVisible: true,
        templateToDuplicate: {
          id: 1,
          name: 'Template 1',
        },
        templateName: 'Template 1',
      },
      templates: [],
    };

    const { mockedStore } = renderWithRedux(
      <I18nextProvider i18n={i18n}>
        <DuplicateTemplateModal />
      </I18nextProvider>,
      { preloadedState, useGlobalStore: false }
    );

    const spy = jest.spyOn(mockedStore, 'dispatch');

    // Find the input field and change its value using fireEvent.change
    const nameInput = screen.getByLabelText('Name');
    fireEvent.change(nameInput, { target: { value: 'New template name' } });

    expect(spy).toHaveBeenCalledWith({
      type: 'UPDATE_TEMPLATE_NAME',
      payload: {
        templateName: 'New template name',
      },
    });
  });
});
