import { screen } from '@testing-library/react';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import {
  groupAthletesByName,
  groupAthletesByAvailability,
  groupAthletesByScreening,
  groupAthletesByPosition,
  groupAthletesByPositionGroup,
} from '@kitman/common/src/utils';
import { checkedVariables as createCheckedVariables } from '../../utils';
import { buildAthletes, buildVariables, groupVariables } from '../test_utils';
import CheckboxCellsContainer from '../../containers/CheckboxCells';

describe('QuestionnaireManager <CheckboxCells /> Container', () => {
  let preloadedState;
  const athletes = buildAthletes(5);
  const variables = buildVariables(4);
  const selectedPlatform = 'well_being';
  const groupBy = 'last_screening';

  beforeEach(() => {
    const groupedAthletes = {
      position: groupAthletesByPosition(athletes),
      positionGroup: groupAthletesByPositionGroup(athletes),
      availability: groupAthletesByAvailability(athletes),
      last_screening: groupAthletesByScreening(athletes),
      name: groupAthletesByName(athletes),
    };
    const variablesByPlatform = groupVariables(variables);

    // Define a preloaded state for the Redux store that reflects the state
    // needed by the container to render the correct data.
    preloadedState = {
      athletes: {
        all: athletes,
        grouped: groupedAthletes,
        currentlyVisible: groupedAthletes[groupBy],
        groupBy,
      },
      variables: {
        byId: variables,
        byPlatform: variablesByPlatform,
        selectedPlatform,
        currentlyVisible: variablesByPlatform[selectedPlatform],
      },
      checkedVariables: createCheckedVariables(athletes),
    };
  });

  it('renders and maps state to props correctly, displaying the right number of checkboxes', () => {
    renderWithRedux(<CheckboxCellsContainer cellWidth={100} />, {
      useGlobalStore: false,
      preloadedState,
    });

    // To verify that props are mapped correctly, we check the outcome:
    // The number of checkboxes should equal (number of visible athletes) * (number of visible variables).
    const visibleAthletes = Object.values(
      preloadedState.athletes.currentlyVisible
    ).flat();
    const visibleVariables = preloadedState.variables.currentlyVisible;

    const expectedCheckboxCount =
      visibleAthletes.length * visibleVariables.length;

    // The connected child component renders a checkbox for each cell.
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(expectedCheckboxCount);
  });

  it('renders the correct number of rows based on the number of visible athletes', () => {
    const { container } = renderWithRedux(
      <CheckboxCellsContainer cellWidth={100} />,
      {
        useGlobalStore: false,
        preloadedState,
      }
    );

    const visibleAthletes = Object.values(
      preloadedState.athletes.currentlyVisible
    ).flat();

    const rows = container.querySelectorAll(
      '.questionnaireManagerCheckboxCells__row'
    );
    expect(rows).toHaveLength(visibleAthletes.length);
  });
});
