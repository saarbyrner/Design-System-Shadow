import { screen } from '@testing-library/react';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import {
  groupAthletesByName,
  groupAthletesByAvailability,
  groupAthletesByScreening,
  groupAthletesByPosition,
  groupAthletesByPositionGroup,
} from '@kitman/common/src/utils';
import { buildAthletes, buildVariables, groupVariables } from '../test_utils';
import { checkedVariables as createCheckedVariables } from '../../utils';
import ManagerContainer from '../../containers/Manager';

// Mock child containers to simplify the test setup, focusing only on the Manager container's logic.
jest.mock('../../containers/Sidebar', () => () => <div>Sidebar</div>);
jest.mock('../../containers/CheckboxCells', () => () => (
  <div>CheckboxCells</div>
));
jest.mock('../../containers/Footer', () => () => <div>Footer</div>);
jest.mock('../../containers/Header', () => () => <div>Header</div>);
jest.mock('../../containers/Controls', () => () => <div>Controls</div>);

describe('QuestionnaireManager <Manager /> Container', () => {
  let preloadedState;
  const athletes = buildAthletes(5);
  const variables = buildVariables(5);
  const groupBy = 'name';

  beforeEach(() => {
    const groupedAthletes = {
      position: groupAthletesByPosition(athletes),
      positionGroup: groupAthletesByPositionGroup(athletes),
      availability: groupAthletesByAvailability(athletes),
      last_screening: groupAthletesByScreening(athletes),
      name: groupAthletesByName(athletes),
    };
    const variablesByPlatform = groupVariables(variables);

    // Define a comprehensive preloaded state for the Redux store
    preloadedState = {
      athletes: {
        all: athletes,
        grouped: groupedAthletes,
        currentlyVisible: groupedAthletes[groupBy],
        groupBy,
      },
      variables: {
        currentlyVisible: variablesByPlatform.well_being,
      },
      checkedVariables: createCheckedVariables(athletes),
      // Add other necessary state slices with default values
      variablePlatforms: [],
      templateData: {},
      dialogues: {},
      modal: {
        status: 'CLOSED',
      },
      squadOptions: {
        squads: [{}],
      },
    };
  });

  it('renders the ManagerComponent and maps state to props correctly', () => {
    renderWithRedux(<ManagerContainer />, {
      useGlobalStore: false,
      preloadedState,
    });

    // To verify that props are mapped correctly, we check that the main child components are rendered,
    // which only happens when `allAthletes` has items.
    expect(screen.getByText('Sidebar')).toBeInTheDocument();
    expect(screen.getByText('Controls')).toBeInTheDocument();
    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('CheckboxCells')).toBeInTheDocument();
  });

  it('renders the NoAthletes component when the "allAthletes" state is empty', () => {
    // Override the state for this specific test
    preloadedState.athletes.all = [];

    renderWithRedux(<ManagerContainer />, {
      useGlobalStore: false,
      preloadedState,
    });

    // The "No athletes" message should be visible
    expect(
      screen.getByText(
        '#sport_specific__There_are_no_athletes_within_this_squad'
      )
    ).toBeInTheDocument();
    // The main manager UI should not be rendered
    expect(screen.queryByText('Controls')).not.toBeInTheDocument();
  });
});
