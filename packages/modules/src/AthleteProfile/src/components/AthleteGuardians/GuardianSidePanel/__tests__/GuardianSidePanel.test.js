import { screen, fireEvent } from '@testing-library/react';

import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';
import { MODES } from '@kitman/modules/src/HumanInput/shared/constants';
import { GuardianSidePanelTranslated as GuardianSidePanel } from '..';

describe('<GuardianSidePanel />', () => {
  const i18nT = i18nextTranslateStub();
  const handleOnClosePanel = jest.fn();
  const props = {
    t: i18nT,
    onClose: handleOnClosePanel,
    isOpen: true,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  const getFirstNameInput = () => screen.getByLabelText('First name *');
  const getSurnameInput = () => screen.getByLabelText('Surname *');
  const getEmailInput = () => screen.getByLabelText('Email *');

  it('renders the content of the guardian side panel in create mode', async () => {
    const localState = {
      guardiansTabSlice: {
        guardianSidePanel: {
          mode: MODES.CREATE,
          form: { first_name: '', surname: '', email: '' },
        },
      },
    };

    renderWithProviders(<GuardianSidePanel {...props} />, {
      preloadedState: localState,
    });

    expect(await screen.findByText('Add guardian')).toBeInTheDocument();
    expect(getFirstNameInput()).toBeInTheDocument();
    expect(getSurnameInput()).toBeInTheDocument();
    expect(getEmailInput()).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('renders the content of the guardian side panel in update mode', async () => {
    const localState = {
      guardiansTabSlice: {
        guardianSidePanel: {
          mode: MODES.UPDATE,
          form: {
            id: '1',
            first_name: 'John',
            surname: 'Doe',
            email: 'john.doe@gmail.com',
          },
        },
      },
    };

    renderWithProviders(<GuardianSidePanel {...props} />, {
      preloadedState: localState,
    });

    expect(await screen.findByText('Update guardian')).toBeInTheDocument();
    expect(getFirstNameInput()).toHaveValue('John');
    expect(getSurnameInput()).toHaveValue('Doe');
    expect(getEmailInput()).toHaveValue('john.doe@gmail.com');
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('disables the save button if the required fields are missing', async () => {
    const localState = {
      guardiansTabSlice: {
        guardianSidePanel: {
          mode: MODES.CREATE,
          form: { first_name: '', surname: '', email: '' },
        },
      },
    };

    renderWithProviders(<GuardianSidePanel {...props} />, {
      preloadedState: localState,
    });

    const saveButton = await screen.findByRole('button', { name: 'Save' });
    expect(saveButton).toBeDisabled();

    fireEvent.change(getFirstNameInput(), { target: { value: 'John' } });
    fireEvent.change(getSurnameInput(), { target: { value: 'Doe' } });
    fireEvent.change(getEmailInput(), {
      target: { value: 'john.doe@example.com' },
    });

    expect(saveButton).toBeEnabled();
  });
});
