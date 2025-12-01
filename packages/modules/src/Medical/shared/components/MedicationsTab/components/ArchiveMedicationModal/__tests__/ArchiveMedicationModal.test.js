import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import sinon from 'sinon';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { MockedPermissionContextProvider } from '@kitman/common/src/contexts/PermissionsContext/__tests__/testUtils';
import {
  defaultMedicalPermissions,
  mockedDefaultPermissionsContextValue,
} from '@kitman/modules/src/Medical/shared/utils/testUtils';

import ArchiveMedicationModalContainer from '../ArchiveMedicationModalContainer/index';

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

describe('<ArchiveMedicationModal/>', () => {
  let store;
  const dispatchSpy = sinon.spy();

  beforeEach(() => {
    i18nextTranslateStub();
    store = storeFake({
      medicalApi: {},
      medicalHistory: {},
    });
    store.dispatch = dispatchSpy;
  });

  const props = {
    t: () => {},
  };

  describe('[permissions] permissions.medical.medications.canArchive', () => {
    it('renders the actions buttons', async () => {
      render(
        <MockedPermissionContextProvider
          permissionsContext={{
            ...mockedDefaultPermissionsContextValue,
            permissions: {
              ...mockedDefaultPermissionsContextValue.permissions,
              medical: {
                ...defaultMedicalPermissions,
                medications: {
                  canArchive: true,
                },
              },
            },
          }}
        >
          <Provider store={store}>
            <ArchiveMedicationModalContainer {...props} isOpen />
          </Provider>
        </MockedPermissionContextProvider>
      );

      // Check for modal action buttons
      const cancelButton = screen.getByRole('button', {
        name: 'Cancel',
        hidden: true,
      });

      const archiveButton = screen.getByRole('button', {
        name: 'Archive',
        hidden: true,
      });

      expect(cancelButton).toBeInTheDocument();
      expect(archiveButton).toBeInTheDocument();
    });

    it('archive action button is disabled by default when no <option> is selected', async () => {
      render(
        <MockedPermissionContextProvider
          permissionsContext={{
            ...mockedDefaultPermissionsContextValue,
            permissions: {
              ...mockedDefaultPermissionsContextValue.permissions,
              medical: {
                ...defaultMedicalPermissions,
                medications: {
                  canArchive: true,
                },
              },
            },
          }}
        >
          <Provider store={store}>
            <ArchiveMedicationModalContainer {...props} isOpen />
          </Provider>
        </MockedPermissionContextProvider>
      );

      const archiveButton = screen.getByRole('button', {
        name: 'Archive',
        hidden: true,
      });

      expect(archiveButton).toBeDisabled();
    });

    it('finds archive reasons options in drop-down', async () => {
      render(
        <MockedPermissionContextProvider
          permissionsContext={{
            ...mockedDefaultPermissionsContextValue,
            permissions: {
              ...mockedDefaultPermissionsContextValue.permissions,
              medical: {
                ...defaultMedicalPermissions,
                medications: {
                  canArchive: true,
                },
              },
            },
          }}
        >
          <Provider store={store}>
            <ArchiveMedicationModalContainer {...props} isOpen />
          </Provider>
        </MockedPermissionContextProvider>
      );

      const archiveReasonInput = document.querySelector(
        '.kitmanReactSelect__control'
      );

      // Trigger the actual opening of the <select> drop-down
      await userEvent.click(archiveReasonInput);

      expect(await screen.findByText('Duplicate')).toBeInTheDocument();
      expect(await screen.findByText('Incorrect athlete')).toBeInTheDocument();
    });

    it('selects an <option> & ensures Archive button is enabled upon selection', async () => {
      render(
        <MockedPermissionContextProvider
          permissionsContext={{
            ...mockedDefaultPermissionsContextValue,
            permissions: {
              ...mockedDefaultPermissionsContextValue.permissions,
              medical: {
                ...defaultMedicalPermissions,
                medication: {
                  canArchive: true,
                },
              },
            },
          }}
        >
          <Provider store={store}>
            <ArchiveMedicationModalContainer {...props} isOpen />
          </Provider>
        </MockedPermissionContextProvider>
      );

      // Grab the select class for targeting
      const archiveReasonInput = document.querySelector(
        '.kitmanReactSelect__control'
      );

      // Trigger the actual opening of the <select> drop-down
      await userEvent.click(archiveReasonInput);

      const archiveReasonValue = await screen.findByText('Incorrect athlete');
      expect(archiveReasonValue).toBeInTheDocument();

      await userEvent.click(archiveReasonValue);

      const archiveButton = screen.getByRole('button', {
        name: 'Archive',
        hidden: true,
      });

      expect(archiveButton).toBeEnabled();
    });
  });
});
