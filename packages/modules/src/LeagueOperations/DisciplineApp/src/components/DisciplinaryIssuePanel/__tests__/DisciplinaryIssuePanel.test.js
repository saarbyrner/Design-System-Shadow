import i18n from 'i18next';
import { setI18n } from 'react-i18next';
import {
  render,
  screen,
  waitFor,
  act,
  fireEvent,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { MOCK_REGISTRATION_PROFILE } from '@kitman/modules/src/LeagueOperations/__tests__/test_utils';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { data as mockedDisciplineAthletes } from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/discipline_athletes.mock';
import { data as mockedDisciplineStaff } from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/discipline_staff.mock';
import {
  useCreateDisciplinaryIssueMutation,
  useUpdateDisciplinaryIssueMutation,
  useLazySearchDisciplineDropdownUserListQuery,
  useLazySearchDisciplineDropdownAthleteListQuery,
  useFetchDisciplineCompetitionsQuery,
  useFetchNextGameDisciplineIssueQuery,
} from '@kitman/modules/src/LeagueOperations/shared/redux/api/disciplineApi';
import { getOrganisation } from '@kitman/common/src/redux/global/selectors';
import useBaseDisciplinaryIssue from '@kitman/modules/src/LeagueOperations/shared/hooks/useBaseDisciplinaryIssue';

import {
  getDisciplineProfile,
  getIsCreatePanelOpen,
  getIsUpdatePanelOpen,
  getCurrentDisciplinaryIssue,
  getDisciplinaryIssueMode,
} from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/disciplinaryIssueSelectors';
import {
  REDUCER_KEY as DISCIPLINARY_SLICE,
  initialState,
} from '@kitman/modules/src/LeagueOperations/shared/redux/slices/disciplinaryIssueSlice';

import { data as mockedDisciplineReasons } from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/mock_discipline_reasons';
import { data as mockedDisciplineCompetitions } from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/mock_discipline_competitions';

import {
  issue as mockedIssue,
  emptyIssue as mockedEmptyIssue,
} from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/discipline_issue.mock';
import fetchDisciplineReasons from '@kitman/modules/src/LeagueOperations/shared/services/fetchDisciplineReasons';
import {
  CREATE_DISCIPLINARY_ISSUE,
  UPDATE_DISCIPLINARY_ISSUE,
} from '@kitman/modules/src/LeagueOperations/shared/consts';
import DisciplinaryIssuePanel from '..';

const i18nT = i18nextTranslateStub();

setI18n(i18n);

jest.mock('@kitman/common/src/redux/global/selectors', () => ({
  ...jest.requireActual('@kitman/common/src/redux/global/selectors'),
  getOrganisation: jest.fn(),
}));
jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/selectors/disciplinaryIssueSelectors',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/LeagueOperations/shared/redux/selectors/disciplinaryIssueSelectors'
    ),
    getIsCreatePanelOpen: jest.fn(),
    getIsUpdatePanelOpen: jest.fn(),
    getDisciplineProfile: jest.fn(),
    getCurrentDisciplinaryIssue: jest.fn(),
    getDisciplinaryIssueMode: jest.fn(),
  })
);

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/services/fetchDisciplineReasons'
);

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/api/disciplineApi'
);

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/hooks/useBaseDisciplinaryIssue',
  () => jest.fn()
);

const props = {
  t: i18nT,
};

const mockSelectors = ({
  isCreateOpen = false,
  isUpdateOpen = false,
  profile = null,
  issue = null,
  mode = CREATE_DISCIPLINARY_ISSUE,
}) => {
  getIsCreatePanelOpen.mockReturnValue(isCreateOpen);
  getIsUpdatePanelOpen.mockReturnValue(isUpdateOpen);
  getDisciplineProfile.mockReturnValue(profile);
  getCurrentDisciplinaryIssue.mockReturnValue(issue);
  getDisciplinaryIssueMode.mockReturnValue(mode);
  getOrganisation.mockReturnValue(() => ({
    id: '1',
    name: 'Test Organisation',
    country: 'Test Country',
    locale: 'en-gb',
  }));
};

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const defaultStore = {
  [DISCIPLINARY_SLICE]: initialState,
};

const userName = `${MOCK_REGISTRATION_PROFILE.firstname} ${MOCK_REGISTRATION_PROFILE.lastname}`;

describe('<DisciplinaryIssuePanel/>', () => {
  const createMock = jest.fn();
  const updateMock = jest.fn();
  const triggerUserQueryMock = jest.fn();
  const triggerAthleteQueryMock = jest.fn();

  const mockIssueSelector = { isCreateOpen: true, issue: mockedIssue };
  const issueMockSetup = async (
    issueSelectorContent = mockIssueSelector,
    defaultBaseDisciplinaryIssue = {}
  ) => {
    useBaseDisciplinaryIssue.mockReturnValue(defaultBaseDisciplinaryIssue);
    fetchDisciplineReasons.mockResolvedValueOnce({
      data: mockedDisciplineReasons,
    });
    useLazySearchDisciplineDropdownUserListQuery.mockReturnValue([
      triggerUserQueryMock,
      {
        data: { data: mockedDisciplineStaff, meta: { total_pages: 0 } },
        isFetching: false,
      },
    ]);
    useLazySearchDisciplineDropdownAthleteListQuery.mockReturnValue([
      triggerAthleteQueryMock,
      {
        data: { data: mockedDisciplineAthletes, meta: { total_pages: 0 } },
        isFetching: false,
      },
    ]);
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
    useFetchDisciplineCompetitionsQuery.mockReturnValue({
      data: mockedDisciplineCompetitions,
      isFetching: false,
    });

    window.getFlag = jest.fn().mockReturnValue(true);

    useFetchNextGameDisciplineIssueQuery.mockReturnValue({
      data: [],
      isSuccess: false,
      isFetching: false,
      error: null,
    });
    mockSelectors(issueSelectorContent);
    await act(async () => {
      render(
        <Provider store={storeFake(defaultStore)}>
          <LocalizationProvider
            dateAdapter={AdapterMoment}
            adapterLocale="en-gb"
          >
            <DisciplinaryIssuePanel {...props} />
          </LocalizationProvider>
        </Provider>
      );
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('NOT OPEN', () => {
    beforeEach(() => {
      mockSelectors({ isCreateOpen: false });
      render(
        <Provider store={storeFake(defaultStore)}>
          <DisciplinaryIssuePanel {...props} />
        </Provider>
      );
    });
    it('does not render', () => {
      expect(() => screen.getByText('Suspension')).toThrow();
      expect(() => screen.getByTestId('CloseIcon')).toThrow();
    });
  });

  describe('IS OPEN', () => {
    describe('FORM IS EMPTY', () => {
      beforeEach(async () => {
        useBaseDisciplinaryIssue.mockReturnValue({});
        await issueMockSetup({
          ...mockIssueSelector,
          issue: mockedEmptyIssue,
        });
      });
      it('renders the form elements', () => {
        expect(screen.getByLabelText('User')).toBeInTheDocument();
        expect(screen.getByLabelText('Reason')).toBeInTheDocument();
        expect(screen.getByLabelText('Competition')).toBeInTheDocument();
        expect(screen.getByLabelText('Start date')).toBeInTheDocument();
        expect(screen.getByLabelText('End date')).toBeInTheDocument();
        expect(screen.getByLabelText('Notes (optional)')).toBeInTheDocument();
      });

      it('allows selecting start and end dates to be the same', () => {
        const startDateInput = screen.getByLabelText('Start date');
        const endDateInput = screen.getByLabelText('End date');

        // Check initial values
        expect(startDateInput).toHaveValue('');
        expect(endDateInput).toHaveValue('');

        // Simulate user changing the start date
        fireEvent.change(startDateInput, { target: { value: '20/10/2024' } });
        expect(startDateInput).toHaveValue('20/10/2024');

        // Simulate user changing the end date
        fireEvent.change(endDateInput, { target: { value: '20/10/2024' } });
        expect(endDateInput).toHaveValue('20/10/2024');
      });

      it('disables the save button', () => {
        expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
      });
    });

    describe('FORM IS COMPLETE', () => {
      describe('VALID ISSUE', () => {
        beforeEach(async () => {
          await issueMockSetup(
            {
              ...mockIssueSelector,
              issue: mockedIssue,
            },
            {
              mode: CREATE_DISCIPLINARY_ISSUE,
              issue: mockedIssue,
              profile: {
                user_id: 1,
                name: userName,
              },
              isIssueFormComplete: true,
              getModalText: () => 'Test modal text',
              handleOnCancel: jest.fn(),
              modalContent: () => 'Test modal content',
              formValidation: true,
            }
          );
        });

        it('renders the form elements', () => {
          expect(screen.getByLabelText('User')).toBeInTheDocument();
          expect(screen.getByLabelText('Reason')).toBeInTheDocument();
          expect(screen.getByLabelText('Competition')).toBeInTheDocument();
          expect(screen.getByLabelText('Start date')).toBeInTheDocument();
          expect(screen.getByLabelText('End date')).toBeInTheDocument();
          expect(screen.getByLabelText('Notes (optional)')).toBeInTheDocument();
        });

        it('correctly maps the issue to inputs', async () => {
          // Ensure the data for the dropdowns has been fetched
          await waitFor(() =>
            expect(triggerAthleteQueryMock).toHaveBeenCalled()
          );
          await waitFor(() =>
            expect(fetchDisciplineReasons).toHaveBeenCalled()
          );
          await waitFor(() =>
            expect(useFetchDisciplineCompetitionsQuery).toHaveBeenCalled()
          );

          expect(screen.getByLabelText('Reason')).toHaveTextContent(
            'Violent conduct'
          );
          expect(screen.getByLabelText('Competition')).toHaveTextContent(
            'Fest'
          );
          expect(screen.getByLabelText('User')).toHaveValue('Peter Schmeichel');
          expect(screen.getByLabelText('Start date')).toHaveValue('19/10/2024');
          expect(screen.getByLabelText('End date')).toHaveValue('19/11/2024');
          expect(screen.getByLabelText('Notes (optional)')).toHaveValue(
            'This is my note'
          );
        });

        it('enables the save button', () => {
          expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled();
        });
      });

      describe('INVALID ISSUE', () => {
        beforeEach(async () => {
          useBaseDisciplinaryIssue.mockReturnValue({});
          await issueMockSetup({
            ...mockIssueSelector,
            issue: {
              ...mockedIssue,
              start_date: '2024-10-19T00:00:00-05:00',
              end_date: '2024-09-19T00:00:00-05:00',
            },
          });
        });

        it('does not allow the end date to be before the start date/start date after the end date', () => {
          const startDateInput = screen.getByLabelText('Start date');
          const endDateInput = screen.getByLabelText('End date');

          // Check initial values
          expect(startDateInput).toHaveValue('19/10/2024');
          expect(endDateInput).toHaveValue('19/09/2024');

          expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
        });
      });
    });
    describe('Selected Profile for create mode', () => {
      beforeEach(async () => {
        await issueMockSetup({
          isCreateOpen: true,
          profile: {
            id: 1,
            name: userName,
          },
        });
      });
      it('displays the correct title', () => {
        expect(screen.getByText(`Suspend ${userName}`)).toBeInTheDocument();
        expect(screen.getByTestId('CloseIcon')).toBeInTheDocument();
      });
      it('user selection dropdown does not appear', () => {
        expect(screen.queryByLabelText('User')).not.toBeInTheDocument();
      });
    });

    describe('Selected Profile for update mode', () => {
      beforeEach(async () => {
        await issueMockSetup({
          isUpdateOpen: true,
          profile: {
            id: 1,
            name: userName,
          },
          mode: UPDATE_DISCIPLINARY_ISSUE,
        });
      });

      it('displays the correct title', () => {
        expect(
          screen.getByText(`Edit Suspension ${userName}`)
        ).toBeInTheDocument();
        expect(screen.getByTestId('CloseIcon')).toBeInTheDocument();
      });
      it('user selection dropdown does not appear', () => {
        expect(screen.queryByLabelText('User')).not.toBeInTheDocument();
      });
    });
  });

  describe('DisciplinaryIssuePanel V2', () => {
    beforeEach(() => {
      window.setFlag('league-ops-discipline-area-v2', true);
    });
    describe('DisciplinaryIssuePanel V2', () => {
      describe('date range', () => {
        beforeEach(async () => {
          await issueMockSetup({
            ...mockIssueSelector,
            issue: {
              kind: 'date_range',
              user_id: 1,
              reason_ids: [1],
              start_date: '2024-10-19T00:00:00-05:00',
              end_date: '2024-11-19T00:00:00-05:00',
              note: 'This is my note',
              competition_ids: [1],
            },
          });
        });
        it('renders the date range form elements', () => {
          expect(screen.getByLabelText('User')).toBeInTheDocument();
          expect(screen.getByLabelText('Reason')).toBeInTheDocument();
          expect(screen.getByLabelText('Start date')).toBeInTheDocument();
          expect(screen.getByLabelText('End date')).toBeInTheDocument();
          expect(screen.getByLabelText('Notes (optional)')).toBeInTheDocument();
          expect(
            screen.getByText(
              'Suspension will remain active until midnight on end date'
            )
          ).toBeInTheDocument();
        });
      });

      describe('number of games', () => {
        beforeEach(async () => {
          await issueMockSetup({
            ...mockIssueSelector,
            issue: {
              kind: 'number_of_games',
              number_of_games: 3,
              user_id: 1,
              reason_ids: [1],
              start_date: '2024-10-19T00:00:00-05:00',
              end_date: null,
              note: 'This is my note',
              competition_ids: [1],
            },
          });
        });
        it('renders the number of games form elements', () => {
          const [userDropdown, gamesDropdown, teamDropdown] =
            screen.getAllByRole('combobox');
          const [startDateInput, notesInput] = screen.getAllByRole('textbox');

          expect(userDropdown).toHaveAccessibleName('User');
          expect(gamesDropdown).toHaveAccessibleName('Number of games');
          expect(teamDropdown).toHaveAccessibleName('Team to apply suspension');
          expect(startDateInput).toHaveAccessibleName('Start date and time');
          expect(notesInput).toHaveAccessibleName('Notes (optional)');
        });
      });
    });
  });
});
