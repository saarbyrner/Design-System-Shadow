import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import sinon from 'sinon';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import {
  defaultMedicalPermissions,
  MockedPermissionContextProvider,
} from '@kitman/common/src/contexts/PermissionsContext/__tests__/testUtils';
import { mockedDefaultPermissionsContextValue } from '@kitman/modules/src/Medical/shared/utils/testUtils';

import ArchiveDiagnosticModalContainer from '../ArchiveDiagnosticModalContainer';

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

describe('<ArchiveDiagnosticModal/>', () => {
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
    // ...MockMedicalDiagnostic,
    t: () => {},
  };

  describe('[permissions] permissions.medical.diagnostic.canArchive', () => {
    beforeEach(() => {
      window.featureFlags['archive-diagnostic-redox'] = true;
    });

    afterEach(() => {
      window.featureFlags['archive-diagnostic-redox'] = false;
    });

    it('renders the actions buttons', async () => {
      render(
        <MockedPermissionContextProvider
          permissionsContext={{
            ...mockedDefaultPermissionsContextValue,
            permissions: {
              ...mockedDefaultPermissionsContextValue.permissions,
              medical: {
                ...defaultMedicalPermissions,
                diagnostics: {
                  canArchive: true,
                },
              },
            },
          }}
        >
          <Provider store={store}>
            <ArchiveDiagnosticModalContainer {...props} isOpen />
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
                diagnostics: {
                  canEdit: true,
                },
              },
            },
          }}
        >
          <Provider store={store}>
            <ArchiveDiagnosticModalContainer {...props} isOpen />
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
                diagnostics: {
                  canArchive: true,
                },
              },
            },
          }}
        >
          <Provider store={store}>
            <ArchiveDiagnosticModalContainer {...props} isOpen />
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
      expect(await screen.findByText('Note not relevant')).toBeInTheDocument();
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
                diagnostics: {
                  canArchive: true,
                },
              },
            },
          }}
        >
          <Provider store={store}>
            <ArchiveDiagnosticModalContainer {...props} isOpen />
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
