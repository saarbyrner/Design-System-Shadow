import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { getActiveSquad } from '@kitman/common/src/redux/global/selectors';
import * as disciplineApi from '@kitman/modules/src/LeagueOperations/shared/redux/api/disciplineApi';
import useDiscipline from '@kitman/modules/src/LeagueOperations/shared/hooks/useDiscipline';
import {
  getDisciplinePermissions,
  getRegistrationUserTypeFactory,
} from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/leagueOperationsSelectors';
import {
  REDUCER_KEY as DISCIPLINE_SLICE,
  initialState as disciplineInitialState,
} from '@kitman/modules/src/LeagueOperations/shared/redux/slices/disciplinaryIssueSlice';
import { REDUCER_KEY as DISCIPLINE_API } from '@kitman/modules/src/LeagueOperations/shared/redux/api/disciplineApi';

import {
  MOCK_CURRENT_USER,
  MOCK_PERMISSIONS,
} from '@kitman/modules/src/LeagueOperations/__tests__/test_utils';
import { data as MOCK_ACTIVE_SQUAD } from '@kitman/services/src/mocks/handlers/getActiveSquad';
import { response as mockAthleteDiscipline } from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/mock_search_discipline';
import { response as mockStaffDiscipline } from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/discipline_staff.mock';
import { REDUCER_KEY as REGISTRATIONS_GRID_SLICE } from '../../shared/redux/slices/registrationGridSlice';
import { REDUCER_KEY as LEAGUE_OPERATIONS_API } from '../../shared/redux/api/leagueOperations';
import DisciplineApp from '../index';

jest.mock('@kitman/components/src/DelayedLoadingFeedback');
jest.mock('@kitman/modules/src/LeagueOperations/shared/hooks/useDiscipline');
jest.mock('@kitman/common/src/redux/global/services/globalApi', () => ({
  ...jest.requireActual('@kitman/common/src/redux/global/services/globalApi'),
  useGetOrganisationQuery: jest.fn(() => ({ data: {} })),
}));
jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/api/disciplineApi',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/LeagueOperations/shared/redux/api/disciplineApi'
    ),
    useSearchDisciplineQuery: jest.fn(),
    useSearchDisciplineAthleteListNoMergeStrategyQuery: jest.fn(),
    useSearchDisciplineUserListNoMergeStrategyQuery: jest.fn(),
  })
);
jest.mock('@kitman/common/src/redux/global/selectors', () => ({
  ...jest.requireActual('@kitman/common/src/redux/global/selectors'),
  getActiveSquad: jest.fn(),
}));
jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/selectors/leagueOperationsSelectors',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/LeagueOperations/shared/redux/selectors/leagueOperationsSelectors'
    ),
    getDisciplinePermissions: jest.fn(),
    getRegistrationUserTypeFactory: jest.fn(),
  })
);
const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

const createFakeStore = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => state,
});

const defaultStore = createFakeStore({
  globalApi: {},
  [DISCIPLINE_API]: {},
  [DISCIPLINE_SLICE]: disciplineInitialState,
  [LEAGUE_OPERATIONS_API]: {},
  [REGISTRATIONS_GRID_SLICE]: {
    bulkActions: {
      selectedAthleteIds: [],
      originalSelectedLabelIds: [],
      selectedLabelIds: [],
    },
  },
});

const defaultProps = {
  t: i18nextTranslateStub(),
};

const renderWithProviders = (store = defaultStore, localProps = {}) => {
  render(
    <Provider store={store}>
      <DisciplineApp {...defaultProps} {...localProps} />
    </Provider>
  );
};

describe('<DisciplineApp/>', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initial loading state', () => {
    beforeEach(() => {
      useDiscipline.mockReturnValue({ isLoading: true });
      getDisciplinePermissions.mockReturnValue(
        () => MOCK_PERMISSIONS.discipline
      );
      getRegistrationUserTypeFactory.mockReturnValue(
        () => MOCK_CURRENT_USER.registration.user_type
      );
    });

    it('renders loading indicator', () => {
      renderWithProviders();
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });

  describe('Failure state', () => {
    beforeEach(() => {
      useDiscipline.mockReturnValue({ isError: true });
      getDisciplinePermissions.mockReturnValue(
        () => MOCK_PERMISSIONS.discipline
      );
      getRegistrationUserTypeFactory.mockReturnValue(
        () => MOCK_CURRENT_USER.registration.user_type
      );
    });

    it('renders error message', () => {
      renderWithProviders();
      expect(screen.getByText(/Something went wrong!/i)).toBeInTheDocument();
      expect(screen.getByText(/Go back and try again/i)).toBeInTheDocument();
    });
  });

  describe('[SUCCESS STATE]: league-ops-discipline-area-v3 is true', () => {
    let latestQueryParams = {};

    beforeEach(() => {
      window.setFlag('league-ops-discipline-area-v3', true);

      useDiscipline.mockReturnValue({ isSuccess: true });
      getActiveSquad.mockReturnValue(() => MOCK_ACTIVE_SQUAD);
      getDisciplinePermissions.mockReturnValue(
        () => MOCK_PERMISSIONS.discipline
      );
      getRegistrationUserTypeFactory.mockReturnValue(
        () => MOCK_CURRENT_USER.registration.user_type
      );

      disciplineApi.useSearchDisciplineAthleteListNoMergeStrategyQuery.mockImplementation(
        (params) => {
          latestQueryParams = params;
          return {
            data: mockAthleteDiscipline,
            isLoading: false,
            isFetching: false,
          };
        }
      );
    });

    it('renders discipline grid headers', () => {
      renderWithProviders();

      const expectedHeaders = [
        'Player',
        'Club',
        'Red cards',
        'Yellow cards',
        'Total suspensions',
        'Suspended',
        'Discipline status',
      ];

      const columnHeaders = screen.getAllByRole('columnheader');
      expectedHeaders.forEach((header) => {
        const match = columnHeaders.find(
          (el) => el.textContent?.trim() === header
        );
        expect(match).toBeDefined();
      });
    });

    it('updates athlete list query when filters change', async () => {
      const user = userEvent.setup();
      renderWithProviders();

      fireEvent.change(screen.getByLabelText('Search'), {
        target: { value: 'Ronaldo' },
      });

      await waitFor(() => {
        expect(latestQueryParams.search_expression).toBe('Ronaldo');
      });

      const yellowCardsInput = screen.getByPlaceholderText('Yellow cards');
      user.click(yellowCardsInput);
      const option = await screen.findByText('1-5');
      user.click(option);

      await waitFor(() => {
        expect(latestQueryParams.yellow_cards).toEqual({ min: 1, max: 5 });
      });
    });

    describe('The suspend header button is clicked', () => {
      it('Opens the suspend panel', async () => {
        const user = userEvent.setup();
        renderWithProviders();

        const suspendMenuItem = screen.getByRole('button', {
          name: /suspend/i,
        });
        expect(suspendMenuItem).toBeInTheDocument();
        await user.click(suspendMenuItem);

        expect(mockDispatch).toHaveBeenCalledWith({
          payload: { isOpen: true },
          type: 'LeagueOperations.discipline.slice.manage/onTogglePanel',
        });
      });
    });

    describe('The suspend menu item is clicked', () => {
      it('Sets the user to be suspended and opens the suspend panel', async () => {
        const user = userEvent.setup();
        renderWithProviders();

        const moreActionsButton = screen
          .getAllByTestId('MoreVertIcon')[0]
          .closest('button');
        await user.click(moreActionsButton);

        const suspendMenuItem = screen.getByRole('menuitem', {
          name: /suspend/i,
        });
        expect(suspendMenuItem).toBeInTheDocument();
        await user.click(suspendMenuItem);

        expect(mockDispatch).toHaveBeenCalledWith({
          payload: { isOpen: true, mode: 'CREATE_DISCIPLINARY_ISSUE' },
          type: 'LeagueOperations.discipline.slice.manage/onTogglePanel',
        });

        expect(mockDispatch).toHaveBeenCalledWith({
          payload: {
            userToBeDisciplined: {
              id: 16,
              name: 'Roy Keane',
              organisations: undefined,
              squads: [{ id: 1, name: 'U13' }],
            },
          },
          type: 'LeagueOperations.discipline.slice.manage/onSetUserToBeDisciplined',
        });
      });
    });

    describe('The edit menu item is clicked', () => {
      it('Sets the user suspension to be edited and opens the suspend panel', async () => {
        const user = userEvent.setup();
        renderWithProviders();

        const moreActionsButton = screen
          .getAllByTestId('MoreVertIcon')[4]
          .closest('button');
        await user.click(moreActionsButton);

        const editMenuItem = screen.getByRole('menuitem', {
          name: /edit/i,
        });
        expect(editMenuItem).toBeInTheDocument();
        await user.click(editMenuItem);

        expect(mockDispatch).toHaveBeenCalledWith({
          payload: { isOpen: true, mode: 'UPDATE_DISCIPLINARY_ISSUE' },
          type: 'LeagueOperations.discipline.slice.manage/onTogglePanel',
        });

        expect(mockDispatch).toHaveBeenCalledWith({
          payload: {
            userToBeDisciplined: {
              id: 5,
              name: 'Test Test',
              organisations: undefined,
              squads: [{ id: 1, name: 'U13' }],
            },
          },
          type: 'LeagueOperations.discipline.slice.manage/onSetUserToBeDisciplined',
        });
      });
    });

    describe('The delete menu item is clicked', () => {
      it('Sets the user suspension to be deleted and shows the confirm suspension modal', async () => {
        const user = userEvent.setup();
        renderWithProviders();

        const moreActionsButton = screen
          .getAllByTestId('MoreVertIcon')[4]
          .closest('button');
        await user.click(moreActionsButton);

        const deleteMenuItem = screen.getByRole('menuitem', {
          name: /delete/i,
        });
        expect(deleteMenuItem).toBeInTheDocument();
        await user.click(deleteMenuItem);

        expect(mockDispatch).toHaveBeenCalledWith({
          payload: { isOpen: true },
          type: 'LeagueOperations.discipline.slice.manage/onToggleModal',
        });

        expect(mockDispatch).toHaveBeenCalledWith({
          payload: {
            userToBeDisciplined: {
              id: 5,
              name: 'Test Test',
              organisations: undefined,
              squads: [{ id: 1, name: 'U13' }],
            },
          },
          type: 'LeagueOperations.discipline.slice.manage/onSetUserToBeDisciplined',
        });
      });
    });

    describe('The tab is switched to staff', () => {
      beforeEach(() => {
        disciplineApi.useSearchDisciplineUserListNoMergeStrategyQuery.mockImplementation(
          (params) => {
            latestQueryParams = params;
            return {
              data: mockStaffDiscipline,
              isLoading: false,
              isFetching: false,
            };
          }
        );
      });
      it('calls the get discipline staff query', async () => {
        const user = userEvent.setup();
        renderWithProviders();
        const staffTab = screen.getByRole('tab', { name: 'Staff' });
        expect(staffTab).toBeInTheDocument();
        await user.click(staffTab);
        expect(
          disciplineApi.useSearchDisciplineUserListNoMergeStrategyQuery
        ).toHaveBeenCalled();
      });
    });
  });
});
