import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';

import {
  useGetImportJobsQuery,
  useLazyDeleteMassUploadQuery,
} from '@kitman/modules/src/shared/MassUpload/redux/massUploadApi';
import {
  useGetSquadAthletesQuery,
  useGetPermissionsQuery,
  useGetTrainingVariablesQuery,
} from '@kitman/common/src/redux/global/services/globalApi';
import { dataInCamelCase } from '@kitman/services/src/mocks/handlers/imports/genericImport';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import { data as mockTrainingVariables } from '@kitman/services/src/mocks/handlers/getTrainingVariables';

import LeagueBenchmarkingApp from '..';

jest.mock('@kitman/modules/src/shared/MassUpload/redux/massUploadApi');
jest.mock('@kitman/common/src/redux/global/services/globalApi');
jest.mock('@kitman/common/src/hooks/useEventTracking');

describe('<LeagueBenchmarkingApp />', () => {
  const storeFake = (state) => ({
    default: () => {},
    subscribe: () => {},
    dispatch: () => {},
    getState: () => ({ ...state }),
  });

  const store = storeFake({
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
      },
    },
  });

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

    useLazyDeleteMassUploadQuery.mockReturnValue([
      jest.fn(),
      {
        isLoading: false,
        isSuccess: true,
        isError: false,
      },
    ]);

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
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render as expected', () => {
    render(
      <Provider store={store}>
        <LeagueBenchmarkingApp />
      </Provider>
    );

    expect(screen.getByText('League benchmarking')).toBeInTheDocument();
  });
});
