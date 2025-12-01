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
import ArchiveMedicalFlagContainer from '../ArchiveMedicalFlagContainer';

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

describe('<ArchiveMedicalFlagModal/>', () => {
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

  const mockMedicalAlert = {
    alert_title: 'Chronic Splenomegaly',
    archived: true,
    athlete: {
      availability: 'unavailable',
      firstname: 'Tomas',
      fullname: 'Albornoz, Tomas',
      id: 40211,
      lastname: 'Albornoz',
      position: 'Second Row',
      shortname: 'T Albornoz',
    },

    athlete_id: 40211,
    diagnosed_on: null,
    id: 6,
    medical_alert: {
      id: 24,
      name: 'Chronic Splenomegaly',
    },

    restricted_to_doc: false,
    restricted_to_psych: false,
    severity: 'severe',
  };

  const props = {
    ...mockMedicalAlert,
    t: () => {},
  };

  describe('[permissions] permissions.medical.alerts.canArchive', () => {
    beforeEach(() => {
      window.featureFlags['medical-alerts-side-panel'] = true;
    });

    afterEach(() => {
      window.featureFlags['medical-alerts-side-panel'] = false;
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
                alerts: {
                  canArchive: true,
                },
                allergies: {
                  canArchive: true,
                },
              },
            },
          }}
        >
          {' '}
          <Provider store={store}>
            <ArchiveMedicalFlagContainer {...props} isOpen />
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
                alerts: {
                  canArchive: true,
                },
                allergies: {
                  canArchive: true,
                },
              },
            },
          }}
        >
          {' '}
          <Provider store={store}>
            <ArchiveMedicalFlagContainer {...props} isOpen />{' '}
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
                alerts: {
                  canArchive: true,
                },
                allergies: {
                  canArchive: true,
                },
              },
            },
          }}
        >
          {' '}
          <Provider store={store}>
            <ArchiveMedicalFlagContainer {...props} isOpen />{' '}
          </Provider>
        </MockedPermissionContextProvider>
      );

      const archiveReasonInput = document.querySelector(
        '.kitmanReactSelect__control'
      );

      const modalTitle = await screen.findByTestId('Modal|Title');
      expect(modalTitle).toHaveTextContent('Archive medical alert');

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
                alerts: {
                  canArchive: true,
                },
                allergies: {
                  canArchive: true,
                },
              },
            },
          }}
        >
          {' '}
          <Provider store={store}>
            <ArchiveMedicalFlagContainer {...props} isOpen />{' '}
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
