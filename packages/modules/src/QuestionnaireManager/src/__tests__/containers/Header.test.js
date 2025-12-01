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
import HeaderContainer from '../../containers/Header';
import * as questionnaireActions from '../../actions';

jest.mock('../../actions');

describe('QuestionnaireManager <Header /> Container', () => {
  let preloadedState;
  const athletes = buildAthletes(5);
  const variables = buildVariables(4);
  const selectedPlatform = 'well_being';
  const groupBy = 'position';

  beforeEach(() => {
    jest.clearAllMocks();

    const groupedAthletes = {
      position: groupAthletesByPosition(athletes),
      positionGroup: groupAthletesByPositionGroup(athletes),
      availability: groupAthletesByAvailability(athletes),
      last_screening: groupAthletesByScreening(athletes),
      name: groupAthletesByName(athletes),
    };
    const variablesByPlatform = groupVariables(variables);

    preloadedState = {
      athletes: {
        all: athletes,
        grouped: groupedAthletes,
        currentlyVisible: groupedAthletes[groupBy],
        groupBy,
      },
      variables: {
        currentlyVisible: variablesByPlatform[selectedPlatform],
      },
      checkedVariables: createCheckedVariables(athletes),
    };
  });

  it('renders and maps state to props correctly, displaying variable names', () => {
    renderWithRedux(<HeaderContainer variableWidth={100} />, {
      useGlobalStore: false,
      preloadedState,
    });

    // To verify that props are mapped correctly, we check the outcome:
    // The names of the currently visible variables should be rendered.
    const visibleVariables = preloadedState.variables.currentlyVisible;
    visibleVariables.forEach((variable) => {
      expect(screen.getByText(variable.name)).toBeInTheDocument();
    });
  });

  it('maps dispatch to props and calls toggleAthletesPerVariable when a variable checkbox is clicked', async () => {
    const user = userEvent.setup();
    renderWithRedux(<HeaderContainer variableWidth={100} />, {
      useGlobalStore: false,
      preloadedState,
    });

    const visibleVariables = preloadedState.variables.currentlyVisible;
    const firstVariable = visibleVariables[0];

    // Find the "select all" checkbox within that header and click it
    const selectAllCheckbox = screen.getByTestId('MultipleCheckboxChecker');
    await user.click(selectAllCheckbox);

    // Verify that the correct action was dispatched with the correct variable ID
    expect(
      questionnaireActions.toggleAthletesPerVariable
    ).toHaveBeenCalledTimes(1);
    expect(questionnaireActions.toggleAthletesPerVariable).toHaveBeenCalledWith(
      firstVariable.id
    );
  });
});
