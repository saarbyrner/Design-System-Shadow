import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
import SidebarContainer from '../../containers/Sidebar';
import * as questionnaireActions from '../../actions';

jest.mock('../../actions');

describe('QuestionnaireManager <Sidebar /> Container', () => {
  const groupBy = 'availability';
  let preloadedState;
  let athletes;
  let variables;

  beforeEach(() => {
    jest.clearAllMocks();

    athletes = buildAthletes(5);
    variables = buildVariables(5);

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
      groupingLabels: {
        unavailable: 'Unavailable',
        available: 'Available',
        injured: 'Available (Injured)',
      },
    };
  });

  it('renders and maps state to props correctly', () => {
    renderWithRedux(<SidebarContainer />, {
      useGlobalStore: false,
      preloadedState,
    });

    // To verify that props are mapped correctly, we check the rendered output.
    // Check for a group heading from `groupingLabels`.
    expect(screen.getByText('Available (Injured)')).toBeInTheDocument();
  });

  it('maps dispatch to props and calls toggleAllVariables when an athlete checkbox is clicked', async () => {
    const user = userEvent.setup();
    renderWithRedux(<SidebarContainer />, {
      useGlobalStore: false,
      preloadedState,
    });

    // Find the "select all" checkbox within the first row and click it
    const selectAllCheckbox = screen.getAllByTestId(
      'MultipleCheckboxChecker'
    )[0];
    await user.click(selectAllCheckbox);

    // Verify that the correct action was dispatched with the correct arguments
    expect(questionnaireActions.toggleAllVariables).toHaveBeenCalledTimes(1);
    expect(questionnaireActions.toggleAllVariables).toHaveBeenCalledWith(
      athletes[0].id,
      preloadedState.variables.currentlyVisible
    );
  });
});
