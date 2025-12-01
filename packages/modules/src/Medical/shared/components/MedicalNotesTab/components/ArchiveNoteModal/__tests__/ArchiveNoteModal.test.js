import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import {
  i18nextTranslateStub,
  renderWithUserEventSetup,
} from '@kitman/common/src/utils/test_utils';
import {
  defaultMedicalPermissions,
  MockedPermissionContextProvider,
} from '@kitman/common/src/contexts/PermissionsContext/__tests__/testUtils';
import { mockedDefaultPermissionsContextValue } from '@kitman/modules/src/Medical/shared/utils/testUtils';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import tabHashes from '@kitman/modules/src/Medical/shared/constants/tabHashes';
import performanceMedicineEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/performanceMedicine';
import { MockMedicalNote } from '../../MedicalNoteCard/mocks';
import ArchiveNoteContainer from '../ArchiveNoteContainer';

jest.mock('@kitman/common/src/hooks/useEventTracking');
const trackEventMock = jest.fn();

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

describe('<ArchiveNoteModal/>', () => {
  let store;

  beforeEach(() => {
    i18nextTranslateStub();
    useEventTracking.mockReturnValue({ trackEvent: trackEventMock });
    store = storeFake({
      medicalApi: {},
      medicalHistory: {},
    });
    store.dispatch = jest.fn();
  });

  const onReloadDataMock = jest.fn();
  const onCloseMock = jest.fn();
  const props = {
    note: MockMedicalNote,
    isOpen: true,
    onClose: onCloseMock,
    onReloadData: onReloadDataMock,
    t: i18nextTranslateStub(),
  };

  describe('[permissions] permissions.medical.note.canArchive', () => {
    it('renders the actions buttons', () => {
      render(
        <MockedPermissionContextProvider
          permissionsContext={{
            ...mockedDefaultPermissionsContextValue,
            permissions: {
              ...mockedDefaultPermissionsContextValue.permissions,
              medical: {
                ...defaultMedicalPermissions,
                notes: {
                  canArchive: true,
                },
              },
            },
          }}
        >
          <Provider store={store}>
            <ArchiveNoteContainer {...props} />
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

    it('archive action button is disabled by default when no <option> is selected', () => {
      render(
        <MockedPermissionContextProvider
          permissionsContext={{
            ...mockedDefaultPermissionsContextValue,
            permissions: {
              ...mockedDefaultPermissionsContextValue.permissions,
              medical: {
                ...defaultMedicalPermissions,
                notes: {
                  canEdit: true,
                },
              },
            },
          }}
        >
          <Provider store={store}>
            <ArchiveNoteContainer {...props} />
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
      const { user } = renderWithUserEventSetup(
        <MockedPermissionContextProvider
          permissionsContext={{
            ...mockedDefaultPermissionsContextValue,
            permissions: {
              ...mockedDefaultPermissionsContextValue.permissions,
              medical: {
                ...defaultMedicalPermissions,
                notes: {
                  canArchive: true,
                },
              },
            },
          }}
        >
          <Provider store={store}>
            <ArchiveNoteContainer {...props} />
          </Provider>
        </MockedPermissionContextProvider>
      );

      const archiveReasonInput = document.querySelector(
        '.kitmanReactSelect__control'
      );

      // Trigger the actual opening of the <select> drop-down
      await user.click(archiveReasonInput);

      expect(await screen.findByText('Duplicate')).toBeInTheDocument();
      expect(await screen.findByText('Incorrect athlete')).toBeInTheDocument();
      expect(await screen.findByText('Note not relevant')).toBeInTheDocument();
    });

    it('selects an <option> & ensures Archive button is enabled upon selection', async () => {
      const { user } = renderWithUserEventSetup(
        <MockedPermissionContextProvider
          permissionsContext={{
            ...mockedDefaultPermissionsContextValue,
            permissions: {
              ...mockedDefaultPermissionsContextValue.permissions,
              medical: {
                ...defaultMedicalPermissions,
                notes: {
                  canArchive: true,
                },
              },
            },
          }}
        >
          <Provider store={store}>
            <ArchiveNoteContainer {...props} />
          </Provider>
        </MockedPermissionContextProvider>
      );

      // Grab the select class for targeting
      const archiveReasonInput = document.querySelector(
        '.kitmanReactSelect__control'
      );

      // Trigger the actual opening of the <select> drop-down
      await user.click(archiveReasonInput);

      const archiveReasonValue = await screen.findByText('Incorrect athlete');
      expect(archiveReasonValue).toBeInTheDocument();

      await user.click(archiveReasonValue);

      const archiveButton = screen.getByRole('button', {
        name: 'Archive',
        hidden: true,
      });

      expect(archiveButton).toBeEnabled();

      delete window.location;
      window.location = new URL(
        'http://localhost/medical/athletes/40211#medical_notes'
      );
      await user.click(archiveButton);

      // THe above await on user click does not always seem enough for some reason
      await waitFor(() =>
        expect(trackEventMock).toHaveBeenCalledWith(
          performanceMedicineEventNames.archivedMedicalNote,
          {
            level: 'athlete',
            tab: tabHashes.MEDICAL_NOTES,
          }
        )
      );

      expect(onCloseMock).toHaveBeenCalled();
      expect(onReloadDataMock).toHaveBeenCalled();
    });
  });
});
