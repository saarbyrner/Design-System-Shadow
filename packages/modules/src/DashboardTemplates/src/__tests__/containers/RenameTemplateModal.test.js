import { screen, fireEvent } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import i18n from '@kitman/common/src/utils/i18n';
import RenameTemplateModal from '../../containers/RenameTemplateModal';

describe('<RenameTemplateModal />', () => {
  beforeEach(() => {
    window.featureFlags = {};
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders', () => {
    const preloadedState = {
      modals: {
        renameTemplateVisible: true,
        templateName: 'Template 1',
        templateToRename: { name: '' },
      },
      templates: [],
    };

    renderWithRedux(
      <I18nextProvider i18n={i18n}>
        <RenameTemplateModal />
      </I18nextProvider>,
      { preloadedState, useGlobalStore: false }
    );

    expect(screen.getByText('Rename Dashboard')).toBeInTheDocument();
  });

  it('sets props correctly', () => {
    const preloadedState = {
      modals: {
        renameTemplateVisible: true,
        templateName: 'Template 1',
        templateToRename: { name: '' },
      },
      templates: [],
    };

    renderWithRedux(
      <I18nextProvider i18n={i18n}>
        <RenameTemplateModal />
      </I18nextProvider>,
      { preloadedState, useGlobalStore: false }
    );

    expect(screen.getByText('Rename Dashboard')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /rename/i })).toBeInTheDocument();
    expect(screen.getByDisplayValue('Template 1')).toBeInTheDocument();
  });

  it('sends the correct action when onChange is called', () => {
    const preloadedState = {
      modals: {
        renameTemplateVisible: true,
        templateName: 'Template 1',
        templateToRename: { name: '' },
      },
      templates: [],
    };

    const { mockedStore } = renderWithRedux(
      <I18nextProvider i18n={i18n}>
        <RenameTemplateModal />
      </I18nextProvider>,
      { preloadedState, useGlobalStore: false }
    );

    const spy = jest.spyOn(mockedStore, 'dispatch');

    // Find the input field and change its value using fireEvent.change
    const nameInput = screen.getByLabelText('Name');
    fireEvent.change(nameInput, { target: { value: 'Renamed template name' } });

    expect(spy).toHaveBeenCalledWith({
      type: 'UPDATE_TEMPLATE_NAME',
      payload: {
        templateName: 'Renamed template name',
      },
    });
  });
});
