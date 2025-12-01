import { screen } from '@testing-library/react';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import {
  buildStatuses,
  buildAthletes,
  buildTemplates,
} from '@kitman/common/src/utils/test_utils';
import {
  statusesToIds,
  statusesToMap,
  groupAthletesByAvailability,
  groupAthletesByScreening,
  groupAthletesByPosition,
  groupAthletesByPositionGroup,
  groupAthletesByName,
} from '@kitman/common/src/utils';
import Header from '../../containers/Header';
import { HeaderTranslated as HeaderComponent } from '../../components/Header';

// Mock the Header component to test props
jest.mock('../../components/Header', () => ({
  HeaderTranslated: jest.fn(
    ({
      athleteFilters,
      alarmFilters,
      groupBy,
      dashboards,
      currentDashboardId,
      canManageDashboard,
      isFilterShown,
      isFilteringOn,
      addedStatusCount,
    }) => (
      <div data-testid="header">
        <div data-testid="athlete-filters">
          {JSON.stringify(athleteFilters)}
        </div>
        <div data-testid="alarm-filters">{JSON.stringify(alarmFilters)}</div>
        <div data-testid="group-by">{groupBy}</div>
        <div data-testid="dashboards">{JSON.stringify(dashboards)}</div>
        <div data-testid="current-dashboard-id">{currentDashboardId}</div>
        <div data-testid="can-manage-dashboard">
          {canManageDashboard ? 'true' : 'false'}
        </div>
        <div data-testid="is-filter-shown">
          {isFilterShown ? 'true' : 'false'}
        </div>
        <div data-testid="is-filtering-on">
          {isFilteringOn ? 'true' : 'false'}
        </div>
        <div data-testid="added-status-count">{addedStatusCount}</div>
      </div>
    )
  ),
}));

describe('Dashboard Header Container', () => {
  const athletes = buildAthletes(5);
  const groupedAthletes = {
    position: groupAthletesByPosition(athletes),
    positionGroup: groupAthletesByPositionGroup(athletes),
    availability: groupAthletesByAvailability(athletes),
    last_screening: groupAthletesByScreening(athletes),
    name: groupAthletesByName(athletes),
  };
  const groupBy = 'last_screening';
  const statuses = buildStatuses(10);
  const dashboards = buildTemplates(5);

  const preloadedState = {
    athletes: {
      all: athletes,
      grouped: groupedAthletes,
      currentlyVisible: groupedAthletes[groupBy],
      groupBy,
      searchTerm: '',
      alarmFilters: [],
      athleteFilters: [],
    },
    showDashboardFilters: false,
    dashboards: {
      all: dashboards,
      currentId: 1,
    },
    canManageDashboard: true,
    statuses: {
      ids: statusesToIds(statuses),
      byId: statusesToMap(statuses),
      available: [],
      reorderedIds: [],
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders', () => {
    renderWithRedux(<Header />, {
      preloadedState,
      useGlobalStore: false,
    });

    // Verify the component renders
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  it('sets props correctly', () => {
    renderWithRedux(<Header />, {
      preloadedState,
      useGlobalStore: false,
    });

    // Verify the props are passed correctly to Header component
    expect(screen.getByTestId('athlete-filters')).toHaveTextContent(
      JSON.stringify(preloadedState.athletes.athleteFilters)
    );
    expect(screen.getByTestId('alarm-filters')).toHaveTextContent(
      JSON.stringify(preloadedState.athletes.alarmFilters)
    );
    expect(screen.getByTestId('group-by')).toHaveTextContent(
      preloadedState.athletes.groupBy
    );
    expect(screen.getByTestId('dashboards')).toHaveTextContent(
      JSON.stringify(dashboards)
    );
    expect(screen.getByTestId('current-dashboard-id')).toHaveTextContent(
      preloadedState.dashboards.currentId.toString()
    );
    expect(screen.getByTestId('can-manage-dashboard')).toHaveTextContent(
      'true'
    );
    expect(screen.getByTestId('is-filter-shown')).toHaveTextContent('false');
    expect(screen.getByTestId('is-filtering-on')).toHaveTextContent('false');
    expect(screen.getByTestId('added-status-count')).toHaveTextContent(
      preloadedState.statuses.ids.length.toString()
    );

    // Verify the mock was called with the expected props
    expect(HeaderComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        athleteFilters: preloadedState.athletes.athleteFilters,
        alarmFilters: preloadedState.athletes.alarmFilters,
        groupBy: preloadedState.athletes.groupBy,
        dashboards,
        currentDashboardId: preloadedState.dashboards.currentId,
        canManageDashboard: preloadedState.canManageDashboard,
        isFilterShown: preloadedState.showDashboardFilters,
        isFilteringOn: false, // No filters applied in this test
        addedStatusCount: preloadedState.statuses.ids.length,
      }),
      {}
    );
  });
});
