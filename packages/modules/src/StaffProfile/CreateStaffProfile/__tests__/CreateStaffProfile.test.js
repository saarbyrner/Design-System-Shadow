import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest, server } from '@kitman/services/src/mocks/server';
import Toasts from '@kitman/modules/src/Toasts';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';
import i18n from 'i18next';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';
import { CreateStaffProfileTranslated as CreateStaffProfile } from '@kitman/modules/src/StaffProfile/CreateStaffProfile';
import LocalizationProvider from '@kitman/playbook/providers/wrappers/LocalizationProvider';
import { setI18n } from 'react-i18next';
import { initialState as initialFormState } from '@kitman/modules/src/HumanInput/shared/redux/slices/formStateSlice';
import { MockedPermissionContextProvider } from '@kitman/common/src/contexts/PermissionsContext/__tests__/testUtils';
import {
  useGetPermissionsQuery,
  useGetCurrentUserQuery,
} from '@kitman/common/src/redux/global/services/globalApi';
import { MODES } from '@kitman/modules/src/HumanInput/shared/constants';
import { data } from '@kitman/modules/src/StaffProfile/shared/redux/services/mocks/data/fetchStaffProfile';
import { formValidationSlice } from '@kitman/modules/src/StaffProfile/CreateStaffProfile/__tests__/mocks/formValidationSlice';
import { unsavedChangesStore } from '@kitman/modules/src/StaffProfile/CreateStaffProfile/__tests__/mocks/unsavedChangesStore';
import MOCK_MENU from '@kitman/modules/src/HumanInput/__tests__/mock_menu';

setI18n(i18n);

jest.mock('@kitman/common/src/hooks/useLocationAssign');

jest.mock('@kitman/common/src/redux/global/services/globalApi', () => ({
  ...jest.requireActual('@kitman/common/src/redux/global/services/globalApi'),
  useGetPermissionsQuery: jest.fn(),
  useGetCurrentUserQuery: jest.fn(),
}));

const currentUser = {
  id: 2,
};

const defaultStore = {
  staffProfileApi: {},
  humanInputApi: {},
  formStateSlice: {
    ...initialFormState,
    config: {
      mode: MODES.CREATE,
    },
    structure: data,
  },
  formMenuSlice: {
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
  },
  toastsSlice: {
    value: [],
  },
  formValidationSlice,
};

describe('CreateStaffProfile', () => {
  const i18nT = i18nextTranslateStub();
  const props = {
    t: i18nT,
  };

  const defaultPermissions = { settings: { canManageStaffUsers: true } };

  const renderComponentWithProviders = (
    state = defaultStore,
    permissions,
    customProps = props
  ) =>
    renderWithProviders(
      <MockedPermissionContextProvider permissionsContext={permissions}>
        <LocalizationProvider>
          <CreateStaffProfile {...customProps} />
          <Toasts />
        </LocalizationProvider>
      </MockedPermissionContextProvider>,
      {
        preloadedState: state,
      }
    );

  const withPermission = {
    permissions: { settings: { canManageStaffUsers: true } },
    permissionsRequestStatus: 'SUCCESS',
  };

  beforeEach(() => {
    const redirect = jest.fn();
    useLocationAssign.mockReturnValue(redirect);
    useGetPermissionsQuery.mockReturnValue({ data: defaultPermissions });
    useGetCurrentUserQuery.mockReturnValue({ data: currentUser });
    Element.prototype.scrollIntoView = jest.fn();
  });

  it('renders', () => {
    renderComponentWithProviders(defaultStore, withPermission);

    expect(screen.getByText('Create staff')).toBeInTheDocument();
    expect(screen.getByTestId('ArrowBackIosIcon')).toBeInTheDocument();
    expect(screen.getByText('Staff Details')).toBeInTheDocument();

    /**
     * Menu
     */
    expect(screen.getByText('Personal Details')).toBeInTheDocument();
    expect(screen.getByText('Player Details')).toBeInTheDocument();
    expect(screen.getByText('Parents/ Guardian')).toBeInTheDocument();
    expect(screen.getByText('Insurance')).toBeInTheDocument();
    expect(screen.getByText('Documents')).toBeInTheDocument();
    expect(screen.getByText('Policies & Signatures')).toBeInTheDocument();
    expect(screen.getByText('Courses')).toBeInTheDocument();

    expect(screen.getByText('Create')).toBeInTheDocument();
  });

  describe('Create flows - toasts', () => {
    it('renders success toast on create new staff user', async () => {
      renderComponentWithProviders(defaultStore, withPermission);

      const createButton = await screen.findByRole('button', {
        name: 'Create',
      });

      expect(createButton).toBeInTheDocument();

      await userEvent.click(createButton);

      expect(
        screen.getByText('Staff user has been created')
      ).toBeInTheDocument();

      expect(
        screen.queryByText('Unable to save. Try again')
      ).not.toBeInTheDocument();
    });

    it('renders error toast on create failure', async () => {
      server.use(
        rest.post('/administration/staff', (req, res, ctx) => {
          return res(ctx.status(500));
        })
      );

      renderComponentWithProviders(defaultStore, withPermission);

      const createButton = await screen.findByRole('button', {
        name: 'Create',
      });

      expect(createButton).toBeInTheDocument();

      await userEvent.click(createButton);

      expect(
        screen.queryByText('Staff user has been created')
      ).not.toBeInTheDocument();

      expect(screen.getByText('Unable to save. Try again')).toBeInTheDocument();
    });

    it('shows required fields toast when a required field is not filled', async () => {
      const state = {
        ...defaultStore,
        formStateSlice: {
          ...defaultStore.formStateSlice,
          config: { mode: MODES.CREATE },
          form: {
            25139: 'juan',
          },
        },
        toastsSlice: {
          value: [],
        },
      };

      renderComponentWithProviders(state, withPermission);

      const textInputs = await screen.findAllByRole('textbox');

      await userEvent.clear(textInputs[0]);

      expect(textInputs[0]).toHaveValue('');

      const createButton = await screen.findByRole('button', {
        name: 'Create',
      });
      expect(createButton).toBeInTheDocument();

      await userEvent.click(createButton);

      expect(
        screen.queryByText('Staff user has been created')
      ).not.toBeInTheDocument();

      expect(
        await screen.findByText('Please fill in required fields')
      ).toBeInTheDocument();
    });
  });

  describe('Unsaved Changes modal', () => {
    const localStore = {
      ...defaultStore,
      formStateSlice: {
        ...defaultStore.formStateSlice,
        originalForm: unsavedChangesStore.formStateSlice.originalForm,
        form: unsavedChangesStore.formStateSlice.form,
      },
    };
    it('renders the unsaved changes modal if the user has unsaved changes and clicked back button', async () => {
      renderComponentWithProviders(localStore, withPermission);

      const textInputs = await screen.findAllByRole('textbox');

      await userEvent.type(textInputs[0], 'Juan');
      await userEvent.type(textInputs[1], 'Nicolas');

      const backButton = screen.getByTestId('ArrowBackIosIcon');

      expect(backButton).toBeInTheDocument();

      await userEvent.click(backButton);

      expect(await screen.findByText('Unsaved changes')).toBeInTheDocument();
    });
  });
});
