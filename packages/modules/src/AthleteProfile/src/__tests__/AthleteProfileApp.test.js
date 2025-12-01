import { screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest, server } from '@kitman/services/src/mocks/server';
import Toasts from '@kitman/modules/src/Toasts';
import LocalizationProvider from '@kitman/playbook/providers/wrappers/LocalizationProvider';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { MODES } from '@kitman/modules/src/HumanInput/shared/constants';
import { initialState as initialFormState } from '@kitman/modules/src/HumanInput/shared/redux/slices/formStateSlice';
import { initialState as initialValidationState } from '@kitman/modules/src/HumanInput/shared/redux/slices/formValidationSlice';
import {
  useGetOrganisationQuery,
  useGetPermissionsQuery,
} from '@kitman/common/src/redux/global/services/globalApi';
import updateAthleteProfile from '@kitman/services/src/services/humanInput/api/athleteProfile/updateAthleteProfile';
import MOCK_MENU from '@kitman/modules/src/HumanInput/__tests__/mock_menu';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { humanInputFormMockData } from '@kitman/services/src/services/humanInput/api/mocks/data/shared/humanInputForm.mock';
import useLocationPathname from '@kitman/common/src/hooks/useLocationPathname';
import useStatus from '@kitman/modules/src/HumanInput/hooks/useStatus';

import AthleteProfileApp from '../../index';

jest.mock(
  '@kitman/services/src/services/humanInput/api/athleteProfile/updateAthleteProfile'
);

jest.mock('@kitman/common/src/redux/global/services/globalApi', () => ({
  ...jest.requireActual('@kitman/common/src/redux/global/services/globalApi'),
  useGetPermissionsQuery: jest.fn(),
  useGetOrganisationQuery: jest.fn(),
}));
jest.mock('@kitman/components/src/DelayedLoadingFeedback');
jest.mock('@kitman/common/src/hooks/useLocationPathname', () => jest.fn());
jest.mock('@kitman/modules/src/HumanInput/hooks/useStatus');

const formMenuSlice = {
  menu: {
    ...MOCK_MENU,
  },
  drawer: {
    isOpen: true,
  },
  active: {
    menuGroupIndex: 0,
    menuItemIndex: 0,
  },
};

const defaultStore = {
  formMenuSlice,
  formStateSlice: {
    ...initialFormState,
    structure: {
      name: 'Athlete Profile',
      fullname: 'Athlete Creation via Athlete Profile',
    },
    config: { mode: MODES.CREATE, showMenuIcons: true },
  },

  formValidationSlice: initialValidationState,
  humanInputApi: {},
};

const withPermission = {
  settings: {
    canViewSettingsAthletes: true,
    canViewSettingsEmergencyContacts: true,
  },
  guardianAccess: {
    canManageGuardians: true,
  },
};

const withoutPermission = {
  settings: {
    canViewSettingsAthletes: false,
    canViewSettingsEmergencyContacts: false,
  },
  guardianAccess: {
    canManageGuardians: false,
  },
};

const withoutPermissionForEmergencyContacts = {
  ...withPermission,
  settings: {
    canViewSettingsAthletes: true,
    canViewSettingsEmergencyContacts: false,
  },
};

const props = {
  t: i18nextTranslateStub(),
};

const renderComponentWithProviders = (state = defaultStore) =>
  renderWithRedux(
    <LocalizationProvider>
      <AthleteProfileApp {...props} />
      <Toasts />
    </LocalizationProvider>,
    {
      preloadedState: state,
    }
  );

describe('<AthleteProfileApp/>', () => {
  beforeEach(() => {
    useLocationPathname.mockImplementation(() => '/athletes/1/profile');
    server.use(
      rest.get('/athletes/1/profile/edit', (req, res, ctx) => {
        return res(ctx.json(humanInputFormMockData));
      })
    );
    useGetPermissionsQuery.mockReturnValue({
      data: withPermission,
      isSuccess: true,
    });
    useGetOrganisationQuery.mockReturnValue({ data: {}, isSuccess: true });
    Element.prototype.scrollIntoView = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Render Tests', () => {
    it('renders the loading state', async () => {
      renderComponentWithProviders();

      expect(screen.getByText(/Loading/i)).toBeInTheDocument();
    });

    it('renders the error state', async () => {
      useGetOrganisationQuery.mockReturnValue({
        data: {},
        isError: true,
      });

      renderComponentWithProviders();

      expect(screen.getByText(/Something went wrong!/i)).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /Go back and try again/i })
      ).toBeInTheDocument();
    });

    it('renders the success state', async () => {
      renderComponentWithProviders();

      expect(await screen.findByText('Create athlete')).toBeInTheDocument();
    });
  });

  describe('Tabs Tests', () => {
    it('renders the expected tabs when have permissions', async () => {
      renderComponentWithProviders();

      await waitFor(() =>
        expect(screen.queryByText('Loading')).not.toBeInTheDocument()
      );
      const tabPanels = await screen.findAllByRole('tabpanel');
      expect(tabPanels.length).toBe(1);
      expect(
        screen.getAllByRole('tab', { name: 'Athlete Details' }).length
      ).toBeGreaterThanOrEqual(1); // Side menu has same 'tab' name
      expect(
        screen.getByRole('tab', { name: 'Emergency Contacts' })
      ).toBeInTheDocument();
    });

    it('does not render emergency contacts tab without permissions', async () => {
      useGetPermissionsQuery.mockReturnValue({
        data: withoutPermissionForEmergencyContacts,
        isSuccess: true,
      });
      renderComponentWithProviders();

      await waitFor(() =>
        expect(screen.queryByText('Loading')).not.toBeInTheDocument()
      );
      const tabPanels = await screen.findAllByRole('tabpanel');
      expect(tabPanels.length).toBe(1);
      expect(
        screen.getAllByRole('tab', { name: 'Athlete Details' }).length
      ).toBeGreaterThanOrEqual(1); // Side menu has same 'tab' name
      expect(
        screen.queryByRole('tab', { name: 'Emergency Contacts' })
      ).not.toBeInTheDocument();
    });
  });

  describe('Menu Tests', () => {
    it('renders the success state', async () => {
      renderComponentWithProviders();

      expect(await screen.findByText('User Details')).toBeInTheDocument();
      expect(
        await screen.findByText('Emergency and other contacts')
      ).toBeInTheDocument();
      expect(await screen.findByText('Medical Contacts')).toBeInTheDocument();
      expect(await screen.findByText('Documentation')).toBeInTheDocument();

      expect(await screen.findAllByText('Athlete Details')).toHaveLength(2);

      expect(
        await screen.findByText('1 of 9 steps completed')
      ).toBeInTheDocument();
    });
  });

  describe('Content Tests', () => {
    it('renders the success state', async () => {
      renderComponentWithProviders();

      expect(await screen.findByText('Headshot')).toBeInTheDocument();
      expect(await screen.findByText('First name')).toBeInTheDocument();
      expect(screen.getByText('Last name')).toBeInTheDocument();
      expect(await screen.findByLabelText('Date of birth')).toBeInTheDocument();
      expect(
        await screen.findByLabelText('Country of birth')
      ).toBeInTheDocument();
      expect(screen.getByText('Town of birth')).toBeInTheDocument();
      expect(
        await screen.findByLabelText('Nationality(s)')
      ).toBeInTheDocument();
      expect(await screen.findByLabelText('Ethnicity')).toBeInTheDocument();

      const backButton = screen.getByRole('button', { name: 'Back' });
      const nextButton = screen.getByRole('button', { name: 'Next' });

      expect(backButton).toBeInTheDocument();
      expect(nextButton).toBeInTheDocument();
    });
  });

  describe('FooterContainer', () => {
    it('renders', async () => {
      renderComponentWithProviders();

      expect(
        await screen.findByRole('button', { name: 'Back' })
      ).toBeInTheDocument();
      expect(
        await screen.findByRole('button', { name: 'Next' })
      ).toBeInTheDocument();
    });

    it('renders with back button disabled on first section', async () => {
      renderComponentWithProviders();

      const backButton = await screen.findByRole('button', { name: 'Back' });
      const nextButton = await screen.findByRole('button', { name: 'Next' });

      expect(backButton).toBeInTheDocument();
      expect(nextButton).toBeInTheDocument();
      expect(backButton).toBeDisabled();
    });

    it('renders with next button disabled on last section', async () => {
      const state = {
        ...defaultStore,
        formMenuSlice: {
          ...defaultStore.formMenuSlice,
          active: {
            menuGroupIndex: 4,
            menuItemIndex: 4,
          },
        },
      };

      renderComponentWithProviders(state);

      const backButton = await screen.findByRole('button', { name: 'Back' });
      const nextButton = await screen.findByRole('button', { name: 'Next' });

      expect(backButton).toBeInTheDocument();
      expect(nextButton).toBeInTheDocument();
      expect(nextButton).toBeDisabled();
    });
  });

  describe('Toasts', () => {
    it('renders success toast on edit mode save', async () => {
      const user = userEvent.setup();
      useStatus.mockReturnValue('VALID');
      updateAthleteProfile.mockReturnValue(humanInputFormMockData);

      const state = {
        ...defaultStore,
        formStateSlice: {
          ...defaultStore.formStateSlice,
          config: { mode: MODES.EDIT },
        },
        toastsSlice: {
          value: [],
        },
      };

      renderComponentWithProviders(state);

      const saveButton = await screen.findByRole('button', { name: 'Save' });
      expect(saveButton).toBeInTheDocument();

      await user.click(saveButton);

      expect(
        screen.getByText('Information has been saved')
      ).toBeInTheDocument();

      expect(
        screen.queryByText('Unable to save. Try again')
      ).not.toBeInTheDocument();
    });

    it('renders error toast on edit mode save failure', async () => {
      const user = userEvent.setup();
      useStatus.mockReturnValue('VALID');

      const state = {
        ...defaultStore,
        formStateSlice: {
          ...defaultStore.formStateSlice,
          config: { mode: MODES.EDIT },
        },
        toastsSlice: {
          value: [],
        },
      };

      renderComponentWithProviders(state);

      const saveButton = await screen.findByRole('button', { name: 'Save' });
      expect(saveButton).toBeInTheDocument();

      updateAthleteProfile.mockRejectedValueOnce();
      await user.click(saveButton);

      expect(
        screen.queryByText('Information has been saved')
      ).not.toBeInTheDocument();

      expect(screen.getByText('Unable to save. Try again')).toBeInTheDocument();
    });

    it('shows required fields toast when a required field is not filled', async () => {
      const user = userEvent.setup();
      useStatus.mockReturnValue('INVALID');
      const state = {
        ...defaultStore,
        formStateSlice: {
          ...defaultStore.formStateSlice,
          config: { mode: MODES.EDIT },
        },
        formValidationSlice: {
          validation: {
            1: { status: 'INVALID', message: 'Email is required' },
          },
        },
        toastsSlice: {
          value: [],
        },
      };

      renderComponentWithProviders(state);

      const textInputs = await screen.findAllByRole('textbox');

      await user.clear(textInputs[0]);

      expect(textInputs[0]).toHaveValue('');

      const saveButton = await screen.findByRole('button', { name: 'Save' });
      expect(saveButton).toBeInTheDocument();

      await user.click(saveButton);

      expect(
        screen.queryByText('Information has been saved')
      ).not.toBeInTheDocument();

      expect(
        await screen.findByText('Please fill in required fields')
      ).toBeInTheDocument();
    });
  });

  describe('Control Buttons', () => {
    const state = {
      ...defaultStore,
      formStateSlice: {
        ...defaultStore.formStateSlice,
        config: { mode: MODES.EDIT },
      },
      toastsSlice: {
        value: [],
      },
    };

    describe('VIEW mode', () => {
      it('renders correct buttons with permissions', async () => {
        renderComponentWithProviders({
          ...state,
          formStateSlice: {
            ...state.formStateSlice,
            config: { mode: MODES.VIEW },
          },
        });

        const editButton = await screen.findByRole('button', { name: 'Edit' });

        expect(editButton).toBeInTheDocument();
        expect(editButton).toBeEnabled();

        const createButton = screen.queryByRole('button', {
          name: 'Create',
        });
        expect(createButton).not.toBeInTheDocument();
      });

      it('does not render Edit and Cancel buttons without permission', () => {
        renderComponentWithProviders({
          ...state,
          formStateSlice: {
            ...state.formStateSlice,
            config: { mode: MODES.VIEW },
          },
        });

        useGetPermissionsQuery.mockReturnValue({
          data: withoutPermission,
        });

        const editButton = screen.queryByRole('button', { name: 'Edit' });
        expect(editButton).not.toBeInTheDocument();

        const cancelButton = screen.queryByRole('button', {
          name: 'Cancel',
        });
        expect(cancelButton).not.toBeInTheDocument();
      });
    });

    describe('EDIT mode', () => {
      it('renders correct buttons with permissions', async () => {
        renderComponentWithProviders({
          ...state,
          formStateSlice: {
            ...state.formStateSlice,
            config: { mode: MODES.EDIT },
          },
        });

        const saveButton = await screen.findByRole('button', { name: 'Save' });

        expect(saveButton).toBeInTheDocument();
        expect(saveButton).toBeEnabled();

        const cancelButton = await screen.findByRole('button', {
          name: 'Cancel',
        });

        expect(cancelButton).toBeInTheDocument();
        expect(cancelButton).toBeEnabled();

        const createButton = screen.queryByRole('button', {
          name: 'Create',
        });

        expect(createButton).not.toBeInTheDocument();
      });

      it('does not render Save button without permission', () => {
        useGetPermissionsQuery.mockReturnValue({
          data: withoutPermission,
        });
        renderComponentWithProviders({
          ...state,
          formStateSlice: {
            ...state.formStateSlice,
            config: { mode: MODES.EDIT },
          },
        });

        const saveButton = screen.queryByRole('button', { name: 'Save' });
        expect(saveButton).not.toBeInTheDocument();

        const cancelButton = screen.queryByRole('button', { name: 'Cancel' });
        expect(cancelButton).not.toBeInTheDocument();
      });
    });

    describe('CREATE mode', () => {
      it('renders correct buttons with permissions', async () => {
        useStatus.mockReturnValue('VALID');

        renderComponentWithProviders({
          ...state,
          formStateSlice: {
            ...state.formStateSlice,
            config: { mode: MODES.CREATE },
          },
        });

        const submitButton = await screen.findByRole('button', {
          name: 'Submit',
        });

        expect(submitButton).toBeInTheDocument();
        expect(submitButton).toBeEnabled();

        const cancelButton = await screen.findByRole('button', {
          name: 'Cancel',
        });
        expect(cancelButton).toBeInTheDocument();
        const createButton = screen.queryByRole('button', {
          name: 'Edit',
        });
        expect(createButton).not.toBeInTheDocument();
      });

      it('does not render Create button without permission', () => {
        useGetPermissionsQuery.mockReturnValue({
          data: withoutPermission,
        });
        renderComponentWithProviders({
          ...state,
          formStateSlice: {
            ...state.formStateSlice,
            config: { mode: MODES.EDIT },
          },
        });

        const editButton = screen.queryByRole('button', { name: 'Create' });

        expect(editButton).not.toBeInTheDocument();
      });
    });
  });

  describe('ACTIONS', () => {
    const localStore = {
      formStateSlice: {
        ...initialFormState,
        structure: {
          id: 1,
        },
        config: {
          mode: MODES.EDIT,
        },
      },
      formValidationSlice: {
        validation: {},
      },
    };

    it('calls updateAthleteProfile when Save clicked', async () => {
      const user = userEvent.setup();
      useStatus.mockReturnValue('VALID');
      renderComponentWithProviders(localStore);

      const saveButton = await screen.findByRole('button', { name: 'Save' });

      expect(saveButton).toBeInTheDocument();
      expect(saveButton).toBeEnabled();

      await user.click(saveButton);

      expect(updateAthleteProfile).toHaveBeenCalledWith({
        athleteId: 1,
        requestBody: {
          answers: [
            {
              form_element_id: 2774,
              value: '778527',
            },
            {
              form_element_id: 24112,
              value: 778530,
            },
            {
              form_element_id: 24113,
              value: 'Tomas',
            },
            {
              form_element_id: 24114,
              value: 'Albornoz',
            },
            {
              form_element_id: 24115,
              value: '2023-11-15',
            },
            {
              form_element_id: 24116,
              value: 3,
            },
            {
              form_element_id: 24118,
              value: [],
            },
          ],
          form_answers_set: {
            id: 18269,
          },
          isSavingProgress: false,
          status: 'complete',
        },
      });
    });

    describe('unsaved changes modal', () => {
      it('renders the unsaved changes modal if the user has unsaved changes and clicked cancel button', async () => {
        const user = userEvent.setup();
        renderComponentWithProviders(localStore);

        const textInputs = await screen.findAllByRole('textbox');

        fireEvent.change(textInputs[0], { target: { value: 'Juan' } });

        const cancelButton = await screen.findByRole('button', {
          name: 'Cancel',
        });

        expect(cancelButton).toBeInTheDocument();
        expect(cancelButton).toBeEnabled();

        await user.click(cancelButton);

        expect(await screen.findByText('Unsaved changes')).toBeInTheDocument();
      });

      it('renders the unsaved changes modal if the user has unsaved changes and clicked back button', async () => {
        const user = userEvent.setup();
        renderComponentWithProviders(localStore);

        const textInputs = await screen.findAllByRole('textbox');

        fireEvent.change(textInputs[0], { target: { value: 'Juan' } });

        const backButton = screen.getByTestId('ArrowBackIosIcon');

        expect(backButton).toBeInTheDocument();
        expect(backButton).toBeEnabled();

        await user.click(backButton);

        expect(await screen.findByText('Unsaved changes')).toBeInTheDocument();
      });
    });

    describe('display Guardians tab when the athlete-guardian-access feature flag is true', () => {
      it('renders the Guardians tab when the feature flag is enabled', async () => {
        withPermission.guardianAccess.canManageGuardians = true;
        window.featureFlags['athlete-guardian-access'] = true;
        useGetPermissionsQuery.mockReturnValue({
          data: withPermission,
          isSuccess: true,
        });

        renderComponentWithProviders();

        expect(
          await screen.findByRole('tab', { name: 'Guardians' })
        ).toBeInTheDocument();
      });

      it('does not render the Guardians tab when the feature flag is disabled', async () => {
        withPermission.guardianAccess.canManageGuardians = true;
        window.featureFlags['athlete-guardian-access'] = false;
        useGetPermissionsQuery.mockReturnValue({
          data: withPermission,
          isSuccess: true,
        });

        renderComponentWithProviders();

        expect(
          screen.queryByRole('tab', { name: 'Guardians' })
        ).not.toBeInTheDocument();
      });

      it('does not render the Guardians tab when the permission to view is false', async () => {
        withPermission.guardianAccess.canManageGuardians = false;
        window.featureFlags['athlete-guardian-access'] = true;
        useGetPermissionsQuery.mockReturnValue({
          data: withPermission,
          isSuccess: true,
        });

        renderComponentWithProviders();

        expect(
          screen.queryByRole('tab', { name: 'Guardians' })
        ).not.toBeInTheDocument();
      });
    });
  });
});
