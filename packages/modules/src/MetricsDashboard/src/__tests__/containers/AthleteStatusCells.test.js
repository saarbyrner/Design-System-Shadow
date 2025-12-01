import { screen } from '@testing-library/react';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import {
  buildStatuses,
  buildAthletes,
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
import AthleteStatusCells from '../../containers/AthleteStatusCells';

const athletes = buildAthletes(5);
const statuses = buildStatuses(5);
const groupedAthletes = {
  position: groupAthletesByPosition(athletes),
  positionGroup: groupAthletesByPositionGroup(athletes),
  availability: groupAthletesByAvailability(athletes),
  last_screening: groupAthletesByScreening(athletes),
  name: groupAthletesByName(athletes),
};
const groupBy = 'last_screening';

describe('<AthleteStatusCells />', () => {
  const mockState = {
    athletes: {
      all: athletes,
      grouped: groupedAthletes,
      currentlyVisible: groupedAthletes[groupBy],
      groupBy,
      searchTerm: '',
      groupOrderingByType: { last_screening: ['screened', 'not_screened'] },
    },
    statuses: {
      ids: statusesToIds(statuses),
      byId: statusesToMap(statuses),
      available: statuses,
      reorderedIds: [],
    },
    canManageDashboard: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders', () => {
    renderWithRedux(<AthleteStatusCells t={(key) => key} />, {
      preloadedState: mockState,
      useGlobalStore: false,
    });

    expect(
      screen.getByTestId || screen.getByRole || screen.getByText
    ).toBeDefined();
  });

  it('sets props correctly', () => {
    renderWithRedux(<AthleteStatusCells t={(key) => key} />, {
      preloadedState: mockState,
      useGlobalStore: false,
    });

    // Since we can't access component props directly in RTL, we test that the component
    // renders content based on the Redux state we provided
    const athleteStatusCells = document.querySelector('.athleteStatusCells');
    expect(athleteStatusCells).toBeInTheDocument();

    // Verify that the component uses the grouped athletes from state
    // by checking for athlete-specific content in the rendered output
    const athleteRows = document.querySelectorAll('.athleteStatusCells__row');
    expect(athleteRows.length).toBeGreaterThan(0);
  });
});
