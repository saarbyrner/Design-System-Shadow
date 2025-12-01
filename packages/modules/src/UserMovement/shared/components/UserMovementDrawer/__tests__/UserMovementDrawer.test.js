import { Provider } from 'react-redux';
import { screen, render, fireEvent } from '@testing-library/react';
import { setI18n } from 'react-i18next';
import i18n from 'i18next';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import moment from 'moment';
import { dateTransferFormat } from '@kitman/common/src/utils/dateFormatter';
import LocalizationProvider from '@kitman/playbook/providers/wrappers/LocalizationProvider';
import Toasts from '@kitman/modules/src/Toasts';
import {
  imageFileTypes,
  pdfFileType,
} from '@kitman/common/src/utils/mediaHelper';
import {
  useCreateMovementRecordMutation,
  useSearchMovementOrganisationsListQuery,
  usePostMovementRecordMutation,
  useSearchAthletesQuery,
} from '@kitman/modules/src/UserMovement/shared/redux/services';
import {
  useGetPermissionsQuery,
  useGetOrganisationQuery,
} from '@kitman/common/src/redux/global/services/globalApi';
import useManageFilesForUpload from '@kitman/common/src/hooks/useManageFilesForUpload';
import useManageUploads from '@kitman/common/src/hooks/useManageUploads';
import { mockFilePondFiles } from '@kitman/common/src/hooks/mocks/mocksForUploads.mock';
import { response as data } from '../../../redux/services/mocks/data/mock_search_movement_organisation_list';
import { data as mockAthletes } from '../../../redux/services/mocks/data/mock_search_athletes';
import UserMovementDrawer from '..';
import {
  MEDICAL_TRIAL,
  MEDICAL_TRIAL_V2,
  LOAN,
  TRADE,
  RELEASE,
} from '../../../constants';

jest.mock('@kitman/common/src/hooks/useManageFilesForUpload');
jest.mock('@kitman/common/src/hooks/useManageUploads');
jest.mock('@kitman/common/src/redux/global/services/globalApi', () => ({
  ...jest.requireActual('@kitman/common/src/redux/global/services/globalApi'),
  useGetOrganisationQuery: jest.fn(),
  useGetPermissionsQuery: jest.fn(),
}));
jest.mock('@kitman/modules/src/UserMovement/shared/redux/services', () => ({
  ...jest.requireActual(
    '@kitman/modules/src/UserMovement/shared/redux/services'
  ),
  useCreateMovementRecordMutation: jest.fn(),
  useSearchMovementOrganisationsListQuery: jest.fn(),
  usePostMovementRecordMutation: jest.fn(),
  useSearchAthletesQuery: jest.fn(),
}));

const onCreateMovementRecord = jest.fn();
const mockUseManageFilesForUpload = jest.mocked(useManageFilesForUpload);
const mockUseManageUploads = jest.mocked(useManageUploads);

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

setI18n(i18n);
const i18nT = i18nextTranslateStub();

const props = {
  t: i18nT,
};

const defaultStore = {
  userMovementDrawerSlice: {
    profile: null,
    drawer: {
      isOpen: false,
    },
    step: 0,
    form: {
      user_id: null,
      transfer_type: MEDICAL_TRIAL,
      join_organisation_ids: [],
      leave_organisation_ids: [],
      joined_at: moment().format(dateTransferFormat),
    },
  },
  globalApi: {
    useGetPermissionsQuery: jest.fn(),
  },

  toastsSlice: {
    value: [],
  },

  'UserMovement.services': {
    useSearchMovementOrganisationsListQuery: jest.fn(),
    usePostMovementRecordMutation: jest.fn(),
  },
};

const renderWithProviders = (storeArg, customProps = {}) => {
  render(
    <Provider store={storeArg}>
      <LocalizationProvider>
        <UserMovementDrawer {...props} {...customProps} />
        <Toasts />
      </LocalizationProvider>
    </Provider>
  );
};

describe('<UserMovementDrawer/>', () => {
  beforeEach(() => {
    useGetPermissionsQuery.mockReturnValue({
      data: {
        userMovement: {
          player: {
            medicalTrial: true,
          },
        },
        general: {
          pastAthletes: {
            canView: true,
          },
        },
      },
    });
    useGetOrganisationQuery.mockReturnValue({
      data: {
        id: 1,
        name: 'Liverpool',
        association_name: 'Premier League',
      },
    });
  });

  describe('<UserMovementDrawer/> UI', () => {
    beforeEach(() => {
      mockUseManageFilesForUpload.mockReturnValue({
        filesToUpload: [],
        getFilesToUploadDescriptors: () => [],
      });

      mockUseManageUploads.mockReturnValue({
        uploadAndConfirmAttachments: () =>
          Promise.resolve([{ status: 'fulfilled' }]),
      });

      useSearchAthletesQuery.mockReturnValue({
        data: {
          data: mockAthletes,
          meta: {},
        },
        isSuccess: true,
      });
      useSearchMovementOrganisationsListQuery.mockReturnValue({
        data,
        isSuccess: true,
      });
      usePostMovementRecordMutation.mockReturnValue([
        onCreateMovementRecord,
        { isLoading: false, isError: false, isSuccess: false },
      ]);
    });
    it('does not render when isOpen is false', () => {
      renderWithProviders(storeFake(defaultStore));

      expect(() => screen.getByText('/Medical Trial/i')).toThrow();
    });

    it('does render when isOpen is true', () => {
      renderWithProviders(
        storeFake({
          ...defaultStore,
          userMovementDrawerSlice: {
            ...defaultStore.userMovementDrawerSlice,

            profile: mockAthletes[0],
            drawer: {
              isOpen: true,
            },
          },
        })
      );

      expect(screen.getAllByText('Medical Trial').at(0)).toBeInTheDocument();
    });
  });

  describe('<UserMovementDrawer/> movement types', () => {
    beforeEach(() => {
      mockUseManageFilesForUpload.mockReturnValue({
        filesToUpload: [],
        getFilesToUploadDescriptors: () => [],
      });

      mockUseManageUploads.mockReturnValue({
        uploadAndConfirmAttachments: () =>
          Promise.resolve([{ status: 'fulfilled' }]),
      });

      useSearchAthletesQuery.mockReturnValue({
        data: {
          data: mockAthletes,
          meta: {},
        },
        isSuccess: true,
      });
      useSearchMovementOrganisationsListQuery.mockReturnValue({
        data,
        isSuccess: true,
      });
    });
    [
      {
        transfer_type: MEDICAL_TRIAL,
        title: /Medical Trial/i,
        steps: 'Review and share',
      },
      {
        transfer_type: MEDICAL_TRIAL_V2,
        title: /Medical Trial/i,
        steps: 'Review and share',
      },
      { transfer_type: LOAN, title: /Loan/i, steps: 'Review and loan' },
      { transfer_type: TRADE, title: /Trade/i, steps: 'Review and trade' },
      {
        transfer_type: RELEASE,
        title: /Release/i,
        steps: 'Review and release',
      },
    ].forEach((movementType) => {
      it(`renders correctly as a ${movementType.transfer_type}`, () => {
        renderWithProviders(
          storeFake({
            ...defaultStore,
            userMovementDrawerSlice: {
              ...defaultStore.userMovementDrawerSlice,
              drawer: {
                isOpen: true,
              },
              form: {
                ...defaultStore.userMovementDrawerSlice.form,

                athlete_id: 97441,
                transfer_type: movementType.transfer_type,
              },
            },
          })
        );
        expect(
          screen.getAllByText(movementType.title).at(0)
        ).toBeInTheDocument();
        expect(screen.getByText('Gather information')).toBeInTheDocument();
        expect(screen.getByText(movementType.steps)).toBeInTheDocument();
      });
    });
  });

  describe('<UserMovementDrawer/> - MEDICAL TRIAL', () => {
    beforeEach(() => {
      window.featureFlags['past-athletes-medical-trial'] = false;
      useGetOrganisationQuery.mockReturnValue({
        data: {
          id: 1,
          name: 'Liverpool',
          association_name: 'Premier League',
        },
      });

      mockUseManageFilesForUpload.mockReturnValue({
        filesToUpload: [],
        getFilesToUploadDescriptors: () => [],
      });

      mockUseManageUploads.mockReturnValue({
        uploadAndConfirmAttachments: () =>
          Promise.resolve([{ status: 'fulfilled' }]),
      });

      useSearchAthletesQuery.mockReturnValue({
        data: {
          data: mockAthletes,
          meta: {},
        },
        isSuccess: true,
      });
      useSearchMovementOrganisationsListQuery.mockReturnValue({
        data,
        isSuccess: true,
      });

      usePostMovementRecordMutation.mockReturnValue([
        onCreateMovementRecord,
        { isLoading: false, isError: false, isSuccess: false },
      ]);
      jest.useFakeTimers().setSystemTime(new Date('2023-12-07'));
    });

    it('STEP 0', async () => {
      const localStore = storeFake({
        userMovementDrawerSlice: {
          drawer: {
            isOpen: true,
          },

          profile: mockAthletes[0],
          step: 0,
          form: {
            user_id: '1',
            transfer_type: MEDICAL_TRIAL,
            join_organisation_ids: [],
            leave_organisation_ids: [115],
            joined_at: moment().format(dateTransferFormat),
          },
        },
        toastsSlice: {
          value: [],
        },
        'UserMovement.services': {},
      });
      const mockDispatch = jest.fn();

      localStore.dispatch = mockDispatch;
      renderWithProviders(localStore);
      expect(screen.getAllByText(/Medical trial/i).at(0)).toBeInTheDocument();
      expect(screen.getByText('Gather information')).toBeInTheDocument();
      expect(screen.getByText('Review and share')).toBeInTheDocument();

      expect(screen.getByText('Sharing a player will:')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Give the chosen club access to this players medical records for 3 days.'
        )
      ).toBeInTheDocument();
      expect(screen.getByText(mockAthletes[0].name)).toBeInTheDocument();
      expect(screen.getByText(mockAthletes[0].email)).toBeInTheDocument();
      expect(
        screen.getByText(mockAthletes[0].date_of_birth)
      ).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();

      fireEvent.click(screen.getByRole('button', { name: 'Open' }));

      expect(
        screen.getByRole('img', { name: 'Inter Miami' })
      ).toBeInTheDocument();

      fireEvent.click(screen.getByRole('img', { name: 'Inter Miami' }));

      expect(mockDispatch).toHaveBeenCalledWith({
        payload: {
          join_organisation_ids: [117],
        },
        type: 'userMovementDrawerSlice/onUpdateMovementForm',
      });
    });
    it('STEP 1', async () => {
      const localStore = storeFake({
        userMovementDrawerSlice: {
          drawer: {
            isOpen: true,
          },

          profile: mockAthletes[0],

          step: 1,
          form: {
            user_id: '1',
            transfer_type: MEDICAL_TRIAL,
            join_organisation_ids: [116],
            leave_organisation_ids: [115],
            joined_at: moment().format(dateTransferFormat),
          },
        },
        toastsSlice: {
          value: [],
        },
        'UserMovement.services': {},
      });
      renderWithProviders(localStore);
      expect(screen.getAllByText(/Medical trial/i).at(0)).toBeInTheDocument();
      expect(screen.getByText('Gather information')).toBeInTheDocument();
      expect(screen.getByText('Review and share')).toBeInTheDocument();
      expect(
        screen.getByText('You are about to share a player’s medical records.')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Would you like to continue?')
      ).toBeInTheDocument();
      expect(screen.getByText(mockAthletes[0].name)).toBeInTheDocument();
      expect(screen.getByText(mockAthletes[0].email)).toBeInTheDocument();
      expect(screen.getByText('DOB')).toBeInTheDocument();
      expect(
        screen.getByText(mockAthletes[0].date_of_birth)
      ).toBeInTheDocument();
      expect(screen.getByText('Type of movement')).toBeInTheDocument();
      expect(screen.getAllByText(/Medical trial/i).at(1)).toBeInTheDocument();
      expect(screen.getByText('Sharing start date')).toBeInTheDocument();
      expect(screen.getByText('Dec 7, 2023')).toBeInTheDocument();

      expect(
        screen.getByRole('button', { name: 'Previous' })
      ).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Share' })).toBeInTheDocument();
      expect(screen.getByText('Medical trial with')).toBeInTheDocument();

      expect(screen.getByText('KL Galaxy')).toBeInTheDocument();
      expect(screen.getByText('Real Madrid')).toBeInTheDocument();
    });
  });

  describe('<UserMovementDrawer/> - MEDICAL TRIAL V2', () => {
    beforeEach(() => {
      onCreateMovementRecord.mockReturnValue({
        unwrap: () =>
          Promise.resolve({
            message: {
              athlete_access_grant: {
                attachments: ['fake'],
              },
            },
          }),
      });

      mockUseManageUploads.mockReturnValue({
        uploadAndConfirmAttachments: () =>
          Promise.resolve([{ status: 'fulfilled' }]),
      });

      useCreateMovementRecordMutation.mockReturnValue([
        onCreateMovementRecord,
        { isError: false, isLoading: false, isSuccess: false, data: null },
      ]);

      useGetOrganisationQuery.mockReturnValue({
        data: {
          id: 1,
          name: 'Liverpool',
          association_name: 'Premier League',
        },
      });

      useGetPermissionsQuery.mockReturnValue({
        data: {
          userMovement: {
            player: {
              medicalTrial: true,
            },
          },
          general: {
            pastAthletes: {
              canView: true,
            },
          },
        },
      });

      window.featureFlags['past-athletes-medical-trial'] = true;

      useSearchAthletesQuery.mockReturnValue({
        data: {
          data: mockAthletes,
          meta: {},
        },
        isSuccess: true,
      });
      useSearchMovementOrganisationsListQuery.mockReturnValue({
        data,
        isSuccess: true,
      });

      usePostMovementRecordMutation.mockReturnValue([
        onCreateMovementRecord,
        { isLoading: false, isError: false, isSuccess: false },
      ]);
      jest.useFakeTimers().setSystemTime(new Date('2023-12-07'));
    });

    it('STEP 0 next button is disabled until required fields set', async () => {
      mockUseManageFilesForUpload.mockReturnValue({
        filesToUpload: [], // No uploads
        getFilesToUploadDescriptors: () => [],
      });

      const localStore = storeFake({
        userMovementDrawerSlice: {
          drawer: {
            isOpen: true,
          },

          profile: mockAthletes[0],
          step: 0,
          form: {
            user_id: '1',
            transfer_type: MEDICAL_TRIAL_V2,
            join_organisation_ids: [],
            leave_organisation_ids: [115],
            joined_at: moment().format(dateTransferFormat),
          },
        },
        toastsSlice: {
          value: [],
        },
        globalApi: {
          queries: {
            'getPermissions(undefined)': {
              data: {
                userMovement: {
                  player: {
                    medicalTrial: true,
                  },
                },
              },
            },
          },
        },
        'UserMovement.services': {},
      });
      const mockDispatch = jest.fn();

      localStore.dispatch = mockDispatch;
      renderWithProviders(localStore, { isPastPlayer: true });
      expect(screen.getAllByText(/Medical trial/i).at(0)).toBeInTheDocument();
      expect(screen.getByText('Gather information')).toBeInTheDocument();
      expect(screen.getByText('Review and share')).toBeInTheDocument();

      expect(screen.getByText('Sharing a player will:')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Give the chosen club access to this players medical records for 3 days.'
        )
      ).toBeInTheDocument();
      expect(screen.getByText(mockAthletes[0].name)).toBeInTheDocument();
      expect(screen.getByText(mockAthletes[0].email)).toBeInTheDocument();
      expect(
        screen.getByText(mockAthletes[0].date_of_birth)
      ).toBeInTheDocument();

      const nextButton = screen.getByRole('button', { name: 'Next' });
      expect(nextButton).toBeDisabled();

      // It renders the attachment area
      expect(screen.getByText('Attach')).toBeInTheDocument();

      const uploadField = document.querySelector('.filepond--wrapper input');
      expect(uploadField).toBeInTheDocument();
      expect(uploadField.accept).toEqual(
        [...imageFileTypes, pdfFileType].join(',')
      );
      expect(uploadField.type).toEqual('file');
      expect(uploadField.multiple).toEqual(true);

      // Can select a org to transfer to
      expect(screen.getByLabelText('Medical trial with')).toBeInTheDocument();
      fireEvent.click(screen.getByRole('button', { name: 'Open' }));

      expect(
        screen.getByRole('img', { name: 'Inter Miami' })
      ).toBeInTheDocument();

      // Can select a org to transfer to
      fireEvent.click(screen.getByRole('img', { name: 'Inter Miami' }));

      expect(mockDispatch).toHaveBeenCalledWith({
        payload: {
          join_organisation_ids: [117],
        },
        type: 'userMovementDrawerSlice/onUpdateMovementForm',
      });

      expect(nextButton).toBeDisabled();
    });

    it('STEP 0 next button is enabled when required fields set', async () => {
      mockUseManageFilesForUpload.mockReturnValue({
        filesToUpload: [
          {
            file: mockFilePondFiles[0],
            status: 'pending',
            progressPercentage: 0,
          },
        ],
        getFilesToUploadDescriptors: () => [],
      });

      const localStore = storeFake({
        userMovementDrawerSlice: {
          drawer: {
            isOpen: true,
          },

          profile: mockAthletes[0],
          step: 0,
          form: {
            user_id: '1',
            transfer_type: MEDICAL_TRIAL_V2,
            join_organisation_ids: [117],
            leave_organisation_ids: [115],
            joined_at: moment().format(dateTransferFormat),
          },
        },
        toastsSlice: {
          value: [],
        },
        globalApi: {
          queries: {
            'getPermissions(undefined)': {
              data: {
                userMovement: {
                  player: {
                    medicalTrial: true,
                  },
                },
              },
            },
          },
        },
        'UserMovement.services': {},
      });

      renderWithProviders(localStore, { isPastPlayer: true });
      const nextButton = screen.getByRole('button', { name: 'Next' });
      expect(nextButton).toBeEnabled();
    });

    it('STEP 1', async () => {
      mockUseManageFilesForUpload.mockReturnValue({
        filesToUpload: [
          {
            file: mockFilePondFiles[0],
            status: 'pending',
            progressPercentage: 0,
          },
        ],
        getFilesToUploadDescriptors: () => [],
      });
      const localStore = storeFake({
        userMovementDrawerSlice: {
          drawer: {
            isOpen: true,
          },

          profile: mockAthletes[0],

          step: 1,
          form: {
            user_id: '1',
            transfer_type: MEDICAL_TRIAL_V2,
            join_organisation_ids: [116],
            leave_organisation_ids: [115],
            joined_at: moment().format(dateTransferFormat),
          },
        },
        globalApi: {
          queries: {
            'getPermissions(undefined)': {
              data: {
                userMovement: {
                  player: {
                    medicalTrial: true,
                  },
                },
              },
            },
          },
        },
        toastsSlice: {
          value: [],
        },
        'UserMovement.services': {},
      });
      renderWithProviders(localStore, { isPastPlayer: true });
      expect(screen.getAllByText(/Medical trial/i).at(0)).toBeInTheDocument();
      expect(screen.getByText('Gather information')).toBeInTheDocument();
      expect(screen.getByText('Review and share')).toBeInTheDocument();
      expect(
        screen.getByText('You are about to share a player’s medical records.')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Would you like to continue?')
      ).toBeInTheDocument();
      expect(screen.getByText(mockAthletes[0].name)).toBeInTheDocument();
      expect(screen.getByText(mockAthletes[0].email)).toBeInTheDocument();
      expect(screen.getByText('DOB')).toBeInTheDocument();
      expect(
        screen.getByText(mockAthletes[0].date_of_birth)
      ).toBeInTheDocument();
      expect(screen.getByText('Type of movement')).toBeInTheDocument();
      expect(screen.getAllByText(/Medical trial/i).at(1)).toBeInTheDocument();
      expect(screen.getByText('Sharing start date')).toBeInTheDocument();
      expect(screen.getByText('Dec 7, 2023')).toBeInTheDocument();

      expect(
        screen.getByRole('button', { name: 'Previous' })
      ).toBeInTheDocument();
      const shareButton = screen.getByRole('button', { name: 'Share' });
      expect(shareButton).toBeInTheDocument();
      expect(shareButton).toBeEnabled();
      expect(screen.getByText('Medical trial with')).toBeInTheDocument();

      expect(screen.getByText('Liverpool')).toBeInTheDocument();
      expect(screen.getByText('Real Madrid')).toBeInTheDocument();
      // Renders the attachment
      expect(screen.getByText('foobar.pdf - 6 B')).toBeInTheDocument();

      fireEvent.click(shareButton);
      expect(onCreateMovementRecord).toHaveBeenCalled();
    });

    it('STEP 1: Buttons are disabled if loading', async () => {
      mockUseManageFilesForUpload.mockReturnValue({
        filesToUpload: [
          {
            file: mockFilePondFiles[0],
            status: 'pending',
            progressPercentage: 0,
          },
        ],
        getFilesToUploadDescriptors: () => [],
      });
      const localStore = storeFake({
        userMovementDrawerSlice: {
          drawer: {
            isOpen: true,
          },

          profile: mockAthletes[0],

          step: 1,
          form: {
            user_id: '1',
            transfer_type: MEDICAL_TRIAL_V2,
            join_organisation_ids: [116],
            leave_organisation_ids: [115],
            joined_at: moment().format(dateTransferFormat),
          },
        },
        globalApi: {
          queries: {
            'getPermissions(undefined)': {
              data: {
                userMovement: {
                  player: {
                    medicalTrial: true,
                  },
                },
              },
            },
          },
        },
        toastsSlice: {
          value: [],
        },
        'UserMovement.services': {},
      });
      renderWithProviders(localStore, { isPastPlayer: true });

      const shareButton = screen.getByRole('button', { name: 'Share' });
      expect(shareButton).toBeInTheDocument();
      expect(shareButton).toBeEnabled();

      fireEvent.click(shareButton);
      await Promise.resolve; // onCreateMovementRecord
      expect(shareButton).toBeDisabled();
      const previousButton = screen.getByRole('button', { name: 'Previous' });
      expect(previousButton).toBeDisabled();
      await Promise.resolve; // uploadAndConfirmAttachments

      expect(shareButton).toBeEnabled();
      expect(previousButton).toBeEnabled();
    });
  });
});
