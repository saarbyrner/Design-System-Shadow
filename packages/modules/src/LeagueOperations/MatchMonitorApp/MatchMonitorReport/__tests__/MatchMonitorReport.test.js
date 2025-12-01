import { screen, render, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { Provider } from 'react-redux';
import {
  getMatchMonitorReport,
  getRegisteredPlayers,
  getUnregisteredPlayers,
} from '@kitman/modules/src/LeagueOperations/MatchMonitorApp/MatchMonitorReport/src/shared/redux/selectors';
import { useGetCurrentUserQuery } from '@kitman/common/src/redux/global/services/globalApi';
import {
  REDUCER_KEY as MATCH_MONITOR_SLICE,
  initialState,
} from '@kitman/modules/src/LeagueOperations/MatchMonitorApp/MatchMonitorReport/src/shared/redux/slices/matchMonitorSlice';
import useMatchMonitorReport from '@kitman/modules/src/LeagueOperations/MatchMonitorApp/MatchMonitorReport/src/shared/hooks/useMatchMonitorReport';
import { mockGame as mockedEvent } from '@kitman/modules/src/shared/FixtureScheduleView/__tests__/mockFixtureGame';
import mockMatchReport from '@kitman/modules/src/LeagueOperations/MatchMonitorApp/MatchMonitorReport/src/shared/redux/services/mocks/data/match_monitor_report';
import useGlobal from '@kitman/common/src/redux/global/hooks/useGlobal';
import { useSaveMatchMonitorReportMutation } from '@kitman/modules/src/LeagueOperations/MatchMonitorApp/MatchMonitorReport/src/shared/redux/services';
import useLeagueOperations from '@kitman/common/src/hooks/useLeagueOperations';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import { MockedPermissionContextProvider } from '@kitman/common/src/contexts/PermissionsContext/__tests__/testUtils';

import MatchMonitorReportApp from '../index';

jest.mock(
  '@kitman/modules/src/LeagueOperations/MatchMonitorApp/MatchMonitorReport/src/shared/hooks/useMatchMonitorReport'
);
jest.mock('@kitman/components/src/DelayedLoadingFeedback');
jest.mock('@kitman/common/src/redux/global/hooks/useGlobal');
jest.mock('@kitman/common/src/hooks/useLeagueOperations');
jest.mock('@kitman/common/src/hooks/useEventTracking');

jest.mock('@kitman/common/src/redux/global/services/globalApi', () => ({
  ...jest.requireActual('@kitman/common/src/redux/global/services/globalApi'),
  useGetCurrentUserQuery: jest.fn(),
}));

jest.mock(
  '@kitman/modules/src/LeagueOperations/MatchMonitorApp/MatchMonitorReport/src/shared/redux/slices/matchMonitorSlice',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/LeagueOperations/MatchMonitorApp/MatchMonitorReport/src/shared/redux/slices/matchMonitorSlice'
    ),
    onMatchMonitorReportChange: jest.fn(),
  })
);

jest.mock(
  '@kitman/modules/src/LeagueOperations/MatchMonitorApp/MatchMonitorReport/src/shared/redux/selectors',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/LeagueOperations/MatchMonitorApp/MatchMonitorReport/src/shared/redux/selectors'
    ),
    getMatchMonitorReport: jest.fn(),
    getRegisteredPlayers: jest.fn(),
    getUnregisteredPlayers: jest.fn(),
  })
);

jest.mock(
  '@kitman/modules/src/LeagueOperations/MatchMonitorApp/MatchMonitorReport/src/shared/redux/services',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/LeagueOperations/MatchMonitorApp/MatchMonitorReport/src/shared/redux/services'
    ),
    useSaveMatchMonitorReportMutation: jest.fn(),
  })
);

const mockDispatch = jest.fn();

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: mockDispatch,
  getState: () => state,
});

const defaultStore = storeFake({
  globalApi: {},
  [MATCH_MONITOR_SLICE]: initialState,
  planningEvent: {
    gameActivities: { localGameActivities: [], apiGameActivities: [] },
    eventPeriods: { localEventPeriods: [], apiEventPeriods: [] },
  },
});

const mockedPermissionsContextValue = {
  permissions: {
    matchMonitor: {
      manageMatchMonitorReport: true,
    },
  },
};

const props = {
  t: i18nextTranslateStub(),
};

const mockSaveMatchMonitorReport = jest.fn(() => Promise.resolve());
useSaveMatchMonitorReportMutation.mockReturnValue([mockSaveMatchMonitorReport]);

const renderWithProviders = (
  storeArg,
  localProps,
  permissionsContext = mockedPermissionsContextValue
) => {
  return render(
    <Provider store={storeArg}>
      <MockedPermissionContextProvider permissionsContext={permissionsContext}>
        <MatchMonitorReportApp {...props} {...localProps} />
      </MockedPermissionContextProvider>
    </Provider>
  );
};

describe('<MatchMonitorReport />', () => {
  beforeEach(() => {
    useEventTracking.mockReturnValue({
      trackEvent: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('[INITIAL STATE] - loading', () => {
    beforeEach(() => {
      useMatchMonitorReport.mockReturnValue({
        hasFailed: false,
        isLoading: true,
        isSuccess: false,
        event: null,
      });
      useGlobal.mockReturnValue({
        isLoading: true,
        hasFailed: false,
        isSuccess: false,
      });
      useGetCurrentUserQuery.mockReturnValue({
        isLoading: false,
      });
    });
    it('renders the loading message', async () => {
      renderWithProviders(defaultStore);
      expect(screen.getByText('Loading ...')).toBeInTheDocument();
    });
  });
  describe('[FAILURE STATE]', () => {
    beforeEach(() => {
      useMatchMonitorReport.mockReturnValue({
        hasFailed: true,
        isLoading: false,
        isSuccess: false,
        event: null,
      });
      useGlobal.mockReturnValue({
        isLoading: true,
        hasFailed: false,
        isSuccess: false,
      });
      useGetCurrentUserQuery.mockReturnValue({
        isLoading: false,
      });
    });
    it('renders the loading message', async () => {
      renderWithProviders(defaultStore);

      expect(screen.getByText(/Something went wrong!/i)).toBeInTheDocument();
      expect(screen.getByText(/Go back and try again/i)).toBeInTheDocument();
    });
  });

  describe('[SUCCESS STATE]', () => {
    beforeEach(() => {
      useMatchMonitorReport.mockReturnValue({
        hasFailed: false,
        isLoading: false,
        isSuccess: true,
        event: mockedEvent,
      });
      useGlobal.mockReturnValue({
        isLoading: false,
        hasFailed: false,
        isSuccess: true,
      });
      useGetCurrentUserQuery.mockReturnValue({
        isLoading: false,
        data: { id: 1 },
      });
      useLeagueOperations.mockReturnValue({
        isLeague: false,
      });
    });

    describe('MatchMonitorReportApp autosave feature', () => {
      beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
        window.setFlag('league-ops-match-monitor-v3', true);
        getRegisteredPlayers.mockReturnValue(
          mockMatchReport.game_monitor_report_athletes
        );
        getUnregisteredPlayers.mockReturnValue(
          mockMatchReport.game_monitor_report_unregistered_athletes
        );
        useLeagueOperations.mockReturnValue({
          isLeague: false,
        });
      });

      afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
      });

      it('save button does not render', () => {
        getMatchMonitorReport.mockReturnValue(initialState.matchMonitorReport);
        renderWithProviders(defaultStore, { event: mockedEvent });
        expect(
          screen.queryByRole('button', { name: 'Save' })
        ).not.toBeInTheDocument();
      });

      it('calls autosave when the report changes', async () => {
        const updatedReport = {
          ...mockMatchReport,
          notes: 'new note',
        };

        const store = storeFake({
          globalApi: {},
          [MATCH_MONITOR_SLICE]: {
            ...initialState,
            matchMonitorReport: mockMatchReport,
          },
          planningEvent: {
            gameActivities: { localGameActivities: [], apiGameActivities: [] },
            eventPeriods: { localEventPeriods: [], apiEventPeriods: [] },
          },
        });

        getMatchMonitorReport.mockReturnValue(mockMatchReport);

        const { rerender } = renderWithProviders(store, { event: mockedEvent });

        await waitFor(() => {
          expect(
            screen.getByText('Manchester United U19 vs Chelsea U19')
          ).toBeInTheDocument();
        });

        const updatedStore = storeFake({
          globalApi: {},
          [MATCH_MONITOR_SLICE]: {
            ...initialState,
            matchMonitorReport: updatedReport,
          },
          planningEvent: {
            gameActivities: { localGameActivities: [], apiGameActivities: [] },
            eventPeriods: { localEventPeriods: [], apiEventPeriods: [] },
          },
        });

        getMatchMonitorReport.mockReturnValue(updatedReport);

        act(() =>
          rerender(
            <Provider store={updatedStore}>
              <MockedPermissionContextProvider
                permissionsContext={mockedPermissionsContextValue}
              >
                <MatchMonitorReportApp {...props} event={mockedEvent} />
              </MockedPermissionContextProvider>
            </Provider>
          )
        );

        act(() => {
          jest.advanceTimersByTime(2000);
        });

        await waitFor(() => {
          expect(mockSaveMatchMonitorReport).toHaveBeenCalledTimes(1);
        });

        expect(mockSaveMatchMonitorReport).toHaveBeenCalledWith({
          id: mockedEvent.id,
          matchReport: {
            ...updatedReport,
            monitor_issue: true,
          },
        });
      });
    });

    describe('The match monitor report is empty', () => {
      beforeEach(() => {
        getRegisteredPlayers.mockReturnValue([]);
        getUnregisteredPlayers.mockReturnValue([]);
        getMatchMonitorReport.mockReturnValue(initialState.matchMonitorReport);
      });
      it('renders report title and save/submit buttons', async () => {
        renderWithProviders(defaultStore, { event: mockedEvent });
        expect(
          screen.getByText(`Manchester United U19 vs Chelsea U19`)
        ).toBeInTheDocument();
        const submitButton = screen.getByRole('button', {
          name: 'Submit Report',
        });
        expect(submitButton).toBeInTheDocument();
        expect(
          screen.getByRole('button', { name: 'Save' })
        ).toBeInTheDocument();
      });
      it('renders the registered and unregistered player table empty state messages', () => {
        renderWithProviders(defaultStore, { event: mockedEvent });
        expect(
          screen.getByText(
            `Click add existing player button (above) to add players who are not in the squad.`
          )
        ).toBeInTheDocument();
        expect(
          screen.getByText(
            `Click add new player button (above) to add players who are not in the squad.`
          )
        ).toBeInTheDocument();
      });
    });
    describe('The match monitor report has been completed', () => {
      beforeEach(() => {
        getRegisteredPlayers.mockReturnValue(
          mockMatchReport.game_monitor_report_athletes
        );
        getUnregisteredPlayers.mockReturnValue(
          mockMatchReport.game_monitor_report_unregistered_athletes
        );
        getMatchMonitorReport.mockReturnValue(mockMatchReport);
        useLeagueOperations.mockReturnValue({
          isLeague: false,
        });
      });
      it('Renders the registered players table headers', () => {
        renderWithProviders(defaultStore, { event: mockedEvent });
        expect(
          screen.queryAllByRole('columnheader', { name: 'Player' })[0]
        ).toBeInTheDocument();
        expect(
          screen.queryByRole('columnheader', { name: 'Primary' })
        ).toBeInTheDocument();
        expect(
          screen.queryByRole('columnheader', { name: 'Compliant' })
        ).toBeInTheDocument();
      });

      it('Does not render actions without the manage-match-monitor-report permission', () => {
        renderWithProviders(
          defaultStore,
          { event: mockedEvent },
          {
            permissions: {
              matchMonitor: {
                manageMatchMonitorReport: false,
              },
            },
          }
        );
        expect(
          screen.queryByRole('button', { name: 'Edit' })
        ).not.toBeInTheDocument();

        expect(
          screen.queryByRole('button', { name: 'Add/Remove Existing Players' })
        ).not.toBeInTheDocument();

        expect(
          screen.queryByRole('button', { name: 'Add New Player' })
        ).not.toBeInTheDocument();
      });

      it('Renders the registered home players rows', () => {
        renderWithProviders(defaultStore, { event: mockedEvent });
        expect(screen.getByText('Mason Mount')).toBeInTheDocument();
        expect(
          screen.queryAllByText('Manchester United')[0]
        ).toBeInTheDocument();
        const checkbox = screen.getAllByRole('checkbox')[0];
        expect(checkbox).toBeInTheDocument();
      });
      it('Renders the registered away players rows', async () => {
        const user = userEvent.setup();
        renderWithProviders(defaultStore, { event: mockedEvent });
        const awayBtn = screen.queryByRole('button', { name: 'Away' });
        expect(awayBtn).toBeInTheDocument();
        await user.click(awayBtn);
        expect(screen.getByText('Mohammad Salah')).toBeInTheDocument();
        expect(screen.getByText('Liverpool')).toBeInTheDocument();
        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).toBeInTheDocument();
      });
      it('Renders the unregistered players table headers', () => {
        renderWithProviders(defaultStore, { event: mockedEvent });
        expect(
          screen.queryAllByRole('columnheader', { name: 'Player' })[1]
        ).toBeInTheDocument();
        expect(
          screen.queryByRole('columnheader', { name: 'DOB' })
        ).toBeInTheDocument();
        expect(
          screen.queryByRole('columnheader', { name: 'Club' })
        ).toBeInTheDocument();
        expect(
          screen.queryByRole('columnheader', { name: 'Registration' })
        ).toBeInTheDocument();
        expect(
          screen.queryByRole('columnheader', { name: 'Notes' })
        ).toBeInTheDocument();
      });
      it('Renders the unregistered player rows', () => {
        renderWithProviders(defaultStore, { event: mockedEvent });
        expect(screen.getByText('Luke Shaw')).toBeInTheDocument();
        expect(screen.getByText('26/02/1994')).toBeInTheDocument();
        expect(
          screen.queryAllByText('Manchester United')[1]
        ).toBeInTheDocument();
        expect(screen.getByText('Registered')).toBeInTheDocument();
        expect(screen.getByText('free text')).toBeInTheDocument();
      });
      it('Calls the correct endpoint when saving the report', async () => {
        const user = userEvent.setup();
        renderWithProviders(defaultStore, { event: mockedEvent });
        const submitBtn = screen.getByRole('button', { name: 'Submit Report' });
        expect(submitBtn).toBeInTheDocument();
        await user.click(submitBtn);
        expect(mockSaveMatchMonitorReport).toHaveBeenCalled();
        expect(mockSaveMatchMonitorReport).toHaveBeenCalledWith({
          id: 1,
          matchReport: { ...mockMatchReport, submitted: true },
        });
      });

      describe('Submit report flow', () => {
        const originalLocation = window.location;

        beforeAll(() => {
          delete window.location;
          window.location = { ...originalLocation, assign: jest.fn() };
        });

        afterAll(() => {
          window.location = originalLocation;
        });
        it('Calls the correct endpoint when submitting the report and redirects to the league schedule page', async () => {
          const user = userEvent.setup();
          renderWithProviders(defaultStore, { event: mockedEvent });
          const submitBtn = screen.getByRole('button', {
            name: 'Submit Report',
          });
          expect(submitBtn).toBeInTheDocument();
          await user.click(submitBtn);
          expect(mockSaveMatchMonitorReport).toHaveBeenCalled();
          expect(mockSaveMatchMonitorReport).toHaveBeenCalledWith({
            id: 1,
            matchReport: { ...mockMatchReport, submitted: true },
          });
          expect(window.location.assign).toHaveBeenCalledWith(
            '/league-fixtures'
          );
        });
      });
    });
    describe('The user is a league admin', () => {
      beforeEach(() => {
        getRegisteredPlayers.mockReturnValue(
          mockMatchReport.game_monitor_report_athletes
        );
        getUnregisteredPlayers.mockReturnValue(
          mockMatchReport.game_monitor_report_unregistered_athletes
        );
        getMatchMonitorReport.mockReturnValue(mockMatchReport);
        useLeagueOperations.mockReturnValue({
          isLeague: true,
        });
      });
      it('renders the correct header buttons', () => {
        renderWithProviders(defaultStore, { event: mockedEvent });
        expect(
          screen.getByRole('button', { name: 'Edit' })
        ).toBeInTheDocument();
      });
      it('renders the correct header buttons when Edit is clicked', async () => {
        const user = userEvent.setup();
        renderWithProviders(defaultStore, { event: mockedEvent });
        const editBtn = screen.getByRole('button', { name: 'Edit' });
        expect(editBtn).toBeInTheDocument();
        await user.click(editBtn);
        expect(
          screen.getByRole('button', { name: 'Cancel' })
        ).toBeInTheDocument();
        expect(
          screen.getByRole('button', { name: 'Submit Report' })
        ).toBeInTheDocument();
      });
      it('save button calls the correct endpoint', async () => {
        const user = userEvent.setup();
        renderWithProviders(defaultStore, { event: mockedEvent });
        const editBtn = screen.getByRole('button', { name: 'Edit' });
        expect(editBtn).toBeInTheDocument();
        await user.click(editBtn);
        const submitBtn = screen.getByRole('button', { name: 'Submit Report' });
        expect(submitBtn).toBeInTheDocument();
        await user.click(submitBtn);
        expect(mockSaveMatchMonitorReport).toHaveBeenCalledWith({
          id: 1,
          matchReport: { ...mockMatchReport, submitted: true },
        });
      });
      it('can submit the report with only one compliant team', async () => {
        const user = userEvent.setup();
        renderWithProviders(defaultStore, { event: mockedEvent });
        const editBtn = screen.getByRole('button', { name: 'Edit' });
        expect(editBtn).toBeInTheDocument();
        await user.click(editBtn);

        const checkboxes = screen.getAllByRole('checkbox');

        expect(checkboxes).toHaveLength(2);
        await user.click(checkboxes[0]);
        await user.click(checkboxes[1]);

        const submitBtn = screen.getByRole('button', { name: 'Submit Report' });
        expect(submitBtn).toBeEnabled();
      });
    });
  });
});
