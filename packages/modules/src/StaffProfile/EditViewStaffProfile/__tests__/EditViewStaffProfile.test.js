import { screen, waitFor, fireEvent } from '@testing-library/react';
import i18n from 'i18next';
import { setI18n } from 'react-i18next';
import userEvent from '@testing-library/user-event';

import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { EditViewStaffProfileTranslated as EditViewStaffProfile } from '@kitman/modules/src/StaffProfile/EditViewStaffProfile';
import { rest, server } from '@kitman/services/src/mocks/server';
import Toasts from '@kitman/modules/src/Toasts';
import { initialState as initialFormState } from '@kitman/modules/src/HumanInput/shared/redux/slices/formStateSlice';
import { MockedPermissionContextProvider } from '@kitman/common/src/contexts/PermissionsContext/__tests__/testUtils';
import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';
import LocalizationProvider from '@kitman/playbook/providers/wrappers/LocalizationProvider';
import useLocationPathname from '@kitman/common/src/hooks/useLocationPathname';
import { data } from '@kitman/modules/src/StaffProfile/shared/redux/services/mocks/data/fetchStaffProfile';
import { MODES } from '@kitman/modules/src/HumanInput/shared/constants';
import MOCK_MENU from '@kitman/modules/src/HumanInput/__tests__/mock_menu';
import {
  useGetPermissionsQuery,
  useGetCurrentUserQuery,
} from '@kitman/common/src/redux/global/services/globalApi';
import { unsavedChangesStore } from '@kitman/modules/src/StaffProfile/CreateStaffProfile/__tests__/mocks/unsavedChangesStore';
import { formValidationSlice } from '@kitman/modules/src/StaffProfile/CreateStaffProfile/__tests__/mocks/formValidationSlice';

setI18n(i18n);

jest.mock('@kitman/common/src/hooks/useLocationPathname', () => jest.fn());

jest.mock('@kitman/common/src/redux/global/services/globalApi', () => ({
  ...jest.requireActual('@kitman/common/src/redux/global/services/globalApi'),
  useGetPermissionsQuery: jest.fn(),
  useGetCurrentUserQuery: jest.fn(),
}));

const currentUser = {
  id: 2,
};

const defaultStore = {
  formStateSlice: {
    ...initialFormState,
    config: {
      mode: MODES.VIEW,
    },
    structure: {
      ...data,
      user: {
        fullname: 'John Smith',
      },
    },
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
  genericDocumentsSlice: {
    genericDocuments: [],
    genericDocumentsCategories: [],
  },
};

const STAFF_USER_UPDATED_MSG = 'Staff user has been updated';
const UNABLE_TO_SAVE_MSG = 'Unable to save. Try again';

const clickButton = (button) => userEvent.click(button);

describe('EditViewStaffProfile', () => {
  const i18nT = i18nextTranslateStub();
  const props = {
    t: i18nT,
  };

  const renderComponentWithProviders = (
    permissions,
    state = defaultStore,
    customProps = props
  ) =>
    renderWithProviders(
      <MockedPermissionContextProvider permissionsContext={permissions}>
        <LocalizationProvider>
          <EditViewStaffProfile {...customProps} />
          <Toasts />
        </LocalizationProvider>
      </MockedPermissionContextProvider>,
      {
        preloadedState: state,
      }
    );

  const permissions = { settings: { canManageStaffUsers: true } };

  const withPermission = {
    permissions,
    permissionsRequestStatus: 'SUCCESS',
  };

  beforeEach(() => {
    useLocationPathname.mockImplementation(() => '/administration/staff/1');
    useGetPermissionsQuery.mockReturnValue({
      data: permissions,
    });
    useGetCurrentUserQuery.mockReturnValue({ data: currentUser });
    Element.prototype.scrollIntoView = jest.fn();
  });

  it('renders tabs', () => {
    renderComponentWithProviders(withPermission);

    expect(screen.getByText('John Smith')).toBeInTheDocument();
    expect(
      screen.getByRole('tab', { name: 'Staff Details' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('tab', { name: 'Permissions' })
    ).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Documents' })).toBeInTheDocument();
  });

  it('renders header', () => {
    renderComponentWithProviders(withPermission);

    expect(screen.getAllByText('Back')[0]).toBeInTheDocument();
    expect(screen.getByText('John Smith')).toBeInTheDocument();
  });

  it('render - staff details tab', async () => {
    renderComponentWithProviders(withPermission);

    userEvent.click(screen.getByRole('tab', { name: 'Staff Details' }));

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Personal Details' })
      ).toBeInTheDocument();
    });

    expect(
      screen.getByRole('button', { name: 'Player Details' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Parents/ Guardian' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Insurance' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Documents' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Policies & Signatures' })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Courses' })).toBeInTheDocument();

    expect(screen.getByTestId('ArrowBackIosIcon')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
  });

  it('render - permissions tab', async () => {
    renderComponentWithProviders(withPermission);

    await userEvent.click(screen.getByRole('tab', { name: 'Permissions' }));

    expect(
      screen.getByRole('heading', { level: 6, name: 'Permissions' })
    ).toBeInTheDocument();

    expect(screen.getByText('Advanced Permissions')).toBeInTheDocument();
  });

  it('does not render permissions tab if hidePermissionsTab prop is true', async () => {
    renderComponentWithProviders(withPermission, defaultStore, {
      ...props,
      hidePermissionsTab: true,
    });

    expect(
      screen.queryByRole('tab', { name: 'Permissions' })
    ).not.toBeInTheDocument();
  });

  it('render - documents tab', async () => {
    renderComponentWithProviders(withPermission);

    await userEvent.click(screen.getByRole('tab', { name: 'Documents' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
      expect(screen.getByText('Document')).toBeInTheDocument();
      expect(screen.queryAllByText('Category')).toHaveLength(3);
      expect(screen.getByText('Issue date')).toBeInTheDocument();
      expect(screen.getByText('Expiry date')).toBeInTheDocument();
      expect(screen.getByText('File')).toBeInTheDocument();
      expect(screen.getByText('Notes')).toBeInTheDocument();
      expect(screen.queryAllByText('Status')).toHaveLength(3);
    });
  });

  describe('Edit flows - toasts', () => {
    const localStore = {
      ...defaultStore,
      formStateSlice: {
        ...defaultStore.formStateSlice,
        config: {
          mode: MODES.EDIT,
        },
      },
    };

    it('renders success toast on update new staff user success', async () => {
      renderComponentWithProviders(withPermission, localStore);

      const saveButton = await screen.findByRole('button', {
        name: 'Save',
      });

      expect(saveButton).toBeInTheDocument();

      await clickButton(saveButton);

      expect(screen.getByText(STAFF_USER_UPDATED_MSG)).toBeInTheDocument();

      expect(screen.queryByText(UNABLE_TO_SAVE_MSG)).not.toBeInTheDocument();
    });

    it('renders error toast on update failure', async () => {
      server.use(
        rest.put('/administration/staff/1', (req, res, ctx) => {
          return res(ctx.status(500));
        })
      );

      renderComponentWithProviders(withPermission, localStore);

      const saveButton = await screen.findByRole('button', {
        name: 'Save',
      });

      expect(saveButton).toBeInTheDocument();

      await clickButton(saveButton);

      expect(
        screen.queryByText(STAFF_USER_UPDATED_MSG)
      ).not.toBeInTheDocument();

      expect(screen.getByText(UNABLE_TO_SAVE_MSG)).toBeInTheDocument();
    });

    it('shows required fields toast when a required field is not filled', async () => {
      const state = {
        ...localStore,
        formStateSlice: {
          ...localStore.formStateSlice,
          config: { mode: MODES.EDIT },
          form: {
            25139: 'juan',
          },
        },
        toastsSlice: {
          value: [],
        },
      };

      renderComponentWithProviders(withPermission, state);

      const textInputs = await screen.findAllByRole('textbox');

      await userEvent.clear(textInputs[0]);

      expect(textInputs[0]).toHaveValue('');

      const saveButton = await screen.findByRole('button', {
        name: 'Save',
      });
      expect(saveButton).toBeInTheDocument();

      await clickButton(saveButton);

      expect(
        screen.queryByText(STAFF_USER_UPDATED_MSG)
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
      renderComponentWithProviders(withPermission, localStore);

      const editButton = await screen.findByRole('button', {
        name: 'Edit',
      });

      expect(editButton).toBeInTheDocument();

      await clickButton(editButton);

      const textInputs = await screen.findAllByRole('textbox');

      fireEvent.change(textInputs[0], { target: { value: 'Juan' } });
      fireEvent.change(textInputs[1], { target: { value: 'Nicolas' } });

      const backButton = screen.getByTestId('ArrowBackIosIcon');

      expect(backButton).toBeInTheDocument();
      expect(backButton).toBeEnabled();

      await clickButton(backButton);

      expect(await screen.findByText('Unsaved changes')).toBeInTheDocument();
    });

    it('renders the unsaved changes modal if the user has unsaved changes and clicked Cancel button', async () => {
      renderComponentWithProviders(withPermission, localStore);

      const editButton = await screen.findByRole('button', {
        name: 'Edit',
      });

      expect(editButton).toBeInTheDocument();

      await clickButton(editButton);

      const textInputs = await screen.findAllByRole('textbox');

      fireEvent.change(textInputs[0], { target: { value: 'Juan' } });
      fireEvent.change(textInputs[1], { target: { value: 'Nicolas' } });

      const cancelButton = await screen.findByRole('button', {
        name: 'Cancel',
      });

      expect(cancelButton).toBeInTheDocument();

      await clickButton(cancelButton);

      expect(await screen.findByText('Unsaved changes')).toBeInTheDocument();
    });
  });
});
