import { screen, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import userEvent from '@testing-library/user-event';
import useDisciplineProfileId from '@kitman/modules/src/LeagueOperations/shared/hooks/useDisciplineProfileId';
import {
  MOCK_CURRENT_USER,
  MOCK_PERMISSIONS,
  MOCK_DISCIPLINE_LIST,
} from '@kitman/modules/src/LeagueOperations/__tests__/test_utils';
import { getProfile } from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationProfileSelectors';
import {
  REDUCER_KEY as DISCIPLINE_REDUCER_KEY,
  initialState as disciplineInitialState,
} from '@kitman/modules/src/LeagueOperations/shared/redux/slices/disciplinaryIssueSlice';
import { useLeagueOperations } from '@kitman/common/src/hooks';
import {
  useFetchDisciplineSuspensionIssueQuery,
  useCreateDisciplinaryIssueMutation,
  useUpdateDisciplinaryIssueMutation,
  useDeleteDisciplinaryIssueMutation,
  useFetchNextGameDisciplineIssueQuery,
  useFetchDisciplineCompetitionsQuery,
} from '@kitman/modules/src/LeagueOperations/shared/redux/api/disciplineApi';
import { getDisciplinePermissions } from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/leagueOperationsSelectors';
import { useFetchRegistrationGridsQuery } from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGridApi';
import { SUSPENSION_DETAILS } from '@kitman/modules/src/LeagueOperations/technicalDebt/grids/mlsNext/columnDefinitions';
import { REDUCER_KEY as formStateSlice } from '@kitman/modules/src/HumanInput/shared/redux/slices/formStateSlice';
import DisciplineProfileApp from '../index';

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/hooks/useDisciplineProfileId'
);

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationProfileSelectors',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationProfileSelectors'
    ),
    getProfile: jest.fn(),
  })
);

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/selectors/leagueOperationsSelectors',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/LeagueOperations/shared/redux/selectors/leagueOperationsSelectors'
    ),
    getDisciplinePermissions: jest.fn(),
  })
);

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/api/disciplineApi',
  () => ({
    useFetchDisciplineSuspensionIssueQuery: jest.fn(),
    useCreateDisciplinaryIssueMutation: jest.fn(),
    useUpdateDisciplinaryIssueMutation: jest.fn(),
    useDeleteDisciplinaryIssueMutation: jest.fn(),
    useFetchNextGameDisciplineIssueQuery: jest.fn(),
    useFetchDisciplineCompetitionsQuery: jest.fn(),
  })
);

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGridApi',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGridApi'
    ),
    useFetchRegistrationGridsQuery: jest.fn(),
  })
);

jest.mock('@kitman/common/src/hooks/useLeagueOperations');

const mockDispatch = jest.fn();

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: mockDispatch,
  getState: () => state,
});

const defaultStore = storeFake({
  globalApi: {},
  [formStateSlice]: {
    originalForm: {},
    form: {},
    elements: {},
    structure: {},
    config: {
      mode: 'VIEW',
      showMenuIcons: false,
      showUnsavedChangesModal: false,
    },
  },
  [DISCIPLINE_REDUCER_KEY]: disciplineInitialState,
  'LeagueOperations.registration.slice.grids': {
    bulkActions: {
      selectedAthleteIds: [],
      originalSelectedLabelIds: [],
      selectedLabelIds: [],
    },
  },
});

describe('<DisciplineProfileApp />', () => {
  beforeEach(() => {
    useFetchRegistrationGridsQuery.mockReturnValue({
      data: SUSPENSION_DETAILS,
      isLoading: false,
      isFetching: false,
      isError: false,
    });
    useFetchNextGameDisciplineIssueQuery.mockReturnValue({});
    useFetchDisciplineCompetitionsQuery.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('Loading state', () => {
    beforeEach(() => {
      useDisciplineProfileId.mockReturnValue({
        isLoading: true,
        isError: false,
        isSuccess: false,
      });
    });
    it('renders the loading state', () => {
      render(<DisciplineProfileApp />);
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });
  describe('Error state', () => {
    beforeEach(() => {
      useDisciplineProfileId.mockReturnValue({
        isLoading: false,
        isError: true,
        isSuccess: false,
      });
    });
    it('renders the error state', () => {
      render(<DisciplineProfileApp />);
      expect(screen.getByText(/Something went wrong!/i)).toBeInTheDocument();
      expect(screen.getByText(/Go back and try again/i)).toBeInTheDocument();
    });
  });
  describe('Success state', () => {
    const createMock = jest.fn();
    const updateMock = jest.fn();
    const deleteMock = jest.fn();
    beforeEach(() => {
      useLeagueOperations.mockReturnValue({
        isLeague: false,
      });
      useDisciplineProfileId.mockReturnValue({
        isLoading: false,
        isError: false,
        isSuccess: true,
      });
      getDisciplinePermissions.mockReturnValue(
        () => MOCK_PERMISSIONS.discipline
      );
      getProfile.mockReturnValue(MOCK_CURRENT_USER);
      useFetchDisciplineSuspensionIssueQuery.mockReturnValue({
        data: {
          data: MOCK_DISCIPLINE_LIST,
          meta: {
            current_page: 1,
            next_page: null,
            prev_page: null,
            total_pages: 1,
            total_count: 2,
          },
        },
      });
      useCreateDisciplinaryIssueMutation.mockReturnValue([
        createMock,
        {
          isLoading: false,
          isError: false,
          isSuccess: false,
        },
      ]);
      useUpdateDisciplinaryIssueMutation.mockReturnValue([
        updateMock,
        {
          isLoading: false,
          isError: false,
          isSuccess: false,
        },
      ]);
      useDeleteDisciplinaryIssueMutation.mockReturnValue([
        deleteMock,
        {
          isLoading: false,
          isError: false,
          isSuccess: false,
        },
      ]);
    });
    it('renders user profile', () => {
      render(
        <Provider store={defaultStore}>
          <DisciplineProfileApp />
        </Provider>
      );
      expect(screen.getByText('Hacksaw Jim Duggan')).toBeInTheDocument();
    });
    it('switches tabs correctly', async () => {
      const user = userEvent.setup();
      render(
        <Provider store={defaultStore}>
          <DisciplineProfileApp />
        </Provider>
      );

      expect(
        screen.getByRole('tabpanel', { name: 'Current suspensions' })
      ).toBeInTheDocument();

      await user.click(
        screen.getByRole('tab', {
          name: 'Past suspensions',
        })
      );
      expect(
        screen.getByRole('tabpanel', { name: 'Past suspensions' })
      ).toBeInTheDocument();

      await user.click(
        screen.getByRole('tab', {
          name: 'Current suspensions',
        })
      );
      expect(
        screen.getByRole('tabpanel', { name: 'Current suspensions' })
      ).toBeInTheDocument();
    });

    it('sets user to be disciplined and opens panel when suspend button is clicked', async () => {
      render(
        <Provider store={defaultStore}>
          <DisciplineProfileApp />
        </Provider>
      );
      const suspendBtn = screen.getByText('Suspend');
      expect(suspendBtn).toBeInTheDocument();
      await userEvent.click(suspendBtn);

      expect(mockDispatch).toHaveBeenCalledWith({
        payload: {
          userToBeDisciplined: {
            name: 'Hacksaw Jim Duggan',
            squads: undefined,
            user_id: 11111,
          },
        },
        type: 'LeagueOperations.discipline.slice.manage/onSetUserToBeDisciplined',
      });

      expect(mockDispatch).toHaveBeenCalledWith({
        payload: { isOpen: true },
        type: 'LeagueOperations.discipline.slice.manage/onTogglePanel',
      });
    });

    it('dispatch is called to show the confirmation modal when a discipline row is deleted', async () => {
      render(
        <Provider store={defaultStore}>
          <DisciplineProfileApp />
        </Provider>
      );
      const deleteBtn = screen.getByTestId('DeleteOutlineIcon');
      expect(deleteBtn).toBeInTheDocument();
      await userEvent.click(deleteBtn);
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: { isOpen: true },
        type: 'LeagueOperations.discipline.slice.manage/onToggleModal',
      });
    });

    it('dispatch is called to open the discipline panel when a discipline row is edited', async () => {
      render(
        <Provider store={defaultStore}>
          <DisciplineProfileApp />
        </Provider>
      );
      const editBtn = screen.getByTestId('EditOutlinedIcon');
      expect(editBtn).toBeInTheDocument();
      await userEvent.click(editBtn);
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: { isOpen: true, mode: 'UPDATE_DISCIPLINARY_ISSUE' },
        type: 'LeagueOperations.discipline.slice.manage/onTogglePanel',
      });
    });

    it('switches to past suspensions as a org user', async () => {
      const user = userEvent.setup();
      useLeagueOperations.mockReturnValue({
        isLeague: false,
      });

      render(
        <Provider store={defaultStore}>
          <DisciplineProfileApp />
        </Provider>
      );

      expect(
        screen.getByRole('tabpanel', { name: 'Current suspensions' })
      ).toBeInTheDocument();

      await user.click(
        screen.getByRole('tab', {
          name: 'Past suspensions',
        })
      );
      expect(screen.queryByTestId('EditOutlinedIcon')).not.toBeInTheDocument();
      expect(screen.queryByTestId('DeleteOutlineIcon')).not.toBeInTheDocument();
    });
    it('switches to past suspensions as a league user', async () => {
      const user = userEvent.setup();
      useLeagueOperations.mockReturnValue({
        isLeague: true,
      });

      render(
        <Provider store={defaultStore}>
          <DisciplineProfileApp />
        </Provider>
      );

      await user.click(
        screen.getByRole('tab', {
          name: 'Current suspensions',
        })
      );
      expect(
        screen.getByRole('tabpanel', { name: 'Current suspensions' })
      ).toBeInTheDocument();

      await user.click(
        screen.getByRole('tab', {
          name: 'Past suspensions',
        })
      );

      expect(
        screen.getByRole('tabpanel', { name: 'Past suspensions' })
      ).toBeInTheDocument();

      expect(screen.getByTestId('EditOutlinedIcon')).toBeInTheDocument();
      expect(screen.getByTestId('DeleteOutlineIcon')).toBeInTheDocument();
    });

    it('displays the date range on hover tooltip', async () => {
      const user = userEvent.setup();

      useLeagueOperations.mockReturnValue({
        isLeague: true,
      });

      render(
        <Provider store={defaultStore}>
          <DisciplineProfileApp />
        </Provider>
      );

      const tooltipTarget = screen.getByText('August 13 - August 28, 2025');
      expect(tooltipTarget).toBeInTheDocument();
      await user.hover(tooltipTarget);
      expect(await screen.findByRole('tooltip')).toBeInTheDocument();
      expect(
        screen.getByRole('tooltip', { name: 'August 13 - August 28, 2025' })
      ).toBeInTheDocument();
    });
    it('displays the number of games on hover tooltip', async () => {
      const user = userEvent.setup();
      useFetchDisciplineSuspensionIssueQuery.mockReturnValue({
        data: {
          data: [
            {
              id: 1,
              kind: 'number_of_games',
              start_date: '2025-08-13T00:00:00-05:00',
              end_date: '2026-06-18T23:59:59-04:00',
              reasons: [
                {
                  id: 1,
                  reason_name: 'Red card',
                },
              ],
              additional_notes: [],
              competitions: [{ id: 1797, name: 'Fest' }],
              game_events: [
                {
                  id: 4691679,
                  name: null,
                  start_date: '2026-06-14T00:00:00Z',
                  end_date: '2026-06-14T01:30:00Z',
                  local_timezone: 'GMT',
                  squad: {
                    id: 3494,
                    name: 'U13',
                    owner_id: 1267,
                    owner_name: 'KL Galaxy',
                    logo_full_path: 'someUrlLink',
                  },
                  opponent_squad: {
                    id: 3496,
                    name: 'U13',
                    owner_id: 1268,
                    owner_name: 'KL Toronto',
                    logo_full_path: 'someUrlLink',
                  },
                },
              ],
              number_of_games: 1,
              squad: { id: 3494, name: 'U13' },
            },
          ],
          meta: {
            current_page: 1,
            next_page: null,
            prev_page: null,
            total_pages: 1,
            total_count: 2,
          },
        },
      });
      useLeagueOperations.mockReturnValue({
        isLeague: true,
      });

      render(
        <Provider store={defaultStore}>
          <DisciplineProfileApp />
        </Provider>
      );
      const tooltipTarget = screen.getByText('1 game');
      expect(tooltipTarget).toBeInTheDocument();
      await user.hover(tooltipTarget);
      expect(await screen.findByRole('tooltip')).toBeInTheDocument();
      expect(
        screen.getByRole('tooltip', {
          name: 'vs KL Toronto (U13) - June 14, 2026',
        })
      ).toBeInTheDocument();
    });
  });
});
