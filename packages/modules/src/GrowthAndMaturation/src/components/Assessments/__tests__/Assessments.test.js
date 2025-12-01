import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setI18n } from 'react-i18next';
import i18n from 'i18next';
import { Provider } from 'react-redux';

import { dataInCamelCase } from '@kitman/services/src/mocks/handlers/imports/genericImport';
import {
  useGetSquadAthletesQuery,
  useGetPermissionsQuery,
  useGetTrainingVariablesQuery,
} from '@kitman/common/src/redux/global/services/globalApi';
import {
  useGetImportJobsQuery,
  useLazyDeleteMassUploadQuery,
} from '@kitman/modules/src/shared/MassUpload/redux/massUploadApi';
import { IMPORT_TYPES } from '@kitman/modules/src/shared/MassUpload/New/utils/consts';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import { onOpenAddAthletesSidePanel } from '@kitman/modules/src/shared/MassUpload/redux/massUploadSlice';
import { data as mockTrainingVariables } from '@kitman/services/src/mocks/handlers/getTrainingVariables';

import Assessments from '../index';

jest.mock('@kitman/modules/src/shared/MassUpload/redux/massUploadApi');
jest.mock('@kitman/common/src/redux/global/services/globalApi');
jest.mock('@kitman/common/src/hooks/useEventTracking');

// set the i18n instance
setI18n(i18n);

describe('Assessments', () => {
  const dispatch = jest.fn();
  const storeFake = (state) => ({
    default: () => {},
    subscribe: () => {},
    dispatch,
    getState: () => ({ ...state }),
  });

  const defaultStoreState = {
    growthAndMaturation: {
      hasNewSubmission: false,
    },
    massUploadSlice: {
      addAthletesSidePanel: {
        isOpen: false,
      },
      massUploadModal: {
        isOpen: false,
      },
      deleteImport: {
        attachmentId: null,
        isConfirmationModalOpen: false,
        submissionStatus: null,
      },
    },
  };

  const store = storeFake(defaultStoreState);

  const defaultProps = {
    type: IMPORT_TYPES.GrowthAndMaturation,
  };

  const mockSquad = {
    squads: [
      {
        id: 'S01',
        name: 'mockSquad',
        position_groups: [
          {
            id: '1',
            name: 'Position Group 1',
            positions: [
              {
                id: '1',
                name: 'Position 1',
                athletes: [
                  {
                    id: '1',
                    firstname: 'Athlete',
                    lastname: '1',
                    fullname: 'Athlete 1',
                    user_id: 'uid1',
                  },
                  {
                    id: '5',
                    firstname: 'Searchable Athlete',
                    lastname: '5',
                    fullname: 'Searchable Athlete 5',
                    user_id: 'uid5',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };

  beforeEach(() => {
    useGetSquadAthletesQuery.mockReturnValue({
      data: mockSquad,
      isError: false,
      isLoading: false,
      isSuccess: true,
    });

    useGetImportJobsQuery.mockReturnValue({
      data: dataInCamelCase,
      isError: false,
      isLoading: false,
      isSuccess: true,
      status: 'fulfilled',
      refetch: jest.fn(),
    });

    useGetPermissionsQuery.mockReturnValue({
      data: {
        settings: {
          canCreateImports: true,
        },
      },
      isError: false,
      isLoading: false,
      isSuccess: true,
    });

    useGetTrainingVariablesQuery.mockReturnValue({
      data: mockTrainingVariables,
    });

    useEventTracking.mockReturnValue({ trackEvent: jest.fn() });

    useLazyDeleteMassUploadQuery.mockReturnValue([
      jest.fn(),
      {
        isLoading: false,
        isSuccess: false,
        isError: false,
      },
    ]);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const renderAndAwait = async (mockStore = store) => {
    render(
      <Provider store={mockStore}>
        <Assessments {...defaultProps} />
      </Provider>
    );
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
  };

  it('should render as expected', async () => {
    await renderAndAwait();
    expect(screen.getByText('Growth and maturation')).toBeInTheDocument();
  });

  it('should render AddAthletesSidePanel on click of Download CSV button', async () => {
    const user = userEvent.setup();
    await renderAndAwait();

    user.click(
      screen.getByText('Create a CSV file template').closest('button')
    );

    await waitFor(() => {
      expect(dispatch).toHaveBeenCalledWith(onOpenAddAthletesSidePanel());
    });
    expect(
      screen.getByText('Create a CSV file template').closest('button')
    ).toBeInTheDocument();
  });

  it('should render results table', async () => {
    await renderAndAwait();

    // Table headers
    expect(screen.getByText('Submission date')).toBeInTheDocument();
    expect(screen.getByText('Submitted by')).toBeInTheDocument();
    expect(screen.getByText('Submission status')).toBeInTheDocument();
    expect(screen.getByText('Submitted file')).toBeInTheDocument();
    expect(screen.getByText('Errors file')).toBeInTheDocument();
  });

  it('should render results table with submissions populated', async () => {
    await renderAndAwait();

    expect(screen.getByText('25 September 2023 14:38')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();

    expect(screen.getByText('15 September 2023 14:38')).toBeInTheDocument();
    expect(screen.getByText('Paul Smith')).toBeInTheDocument();
  });

  it('should render export button when attachment exists', async () => {
    await renderAndAwait();

    // Navigation buttons, mui buttons and export buttons
    await waitFor(() => {
      expect(screen.getAllByRole('button').length).toEqual(6);
    });
  });

  it('should open side panel if url contains open-side-panel query param', async () => {
    delete window.location;
    window.location = new URL(
      'http://admin.injuryprofiler.test:3002/growth_and_maturation/assessments?action=open-side-panel'
    );

    await renderAndAwait();
    await waitFor(() => {
      expect(dispatch).toHaveBeenCalledWith(onOpenAddAthletesSidePanel());
    });
  });
});
