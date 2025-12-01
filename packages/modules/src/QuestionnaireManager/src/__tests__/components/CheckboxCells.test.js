import { screen } from '@testing-library/react';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';

import { buildAthletes, buildVariables, groupVariables } from '../test_utils';
import CheckboxCells from '../../components/CheckboxCells';

describe('QuestionnaireManager <CheckboxCells /> component', () => {
  let baseProps;
  let preloadedState;
  const variables = buildVariables(3);
  const selectedPlatform = 'well_being';
  const cellWidth = 128;

  beforeEach(() => {
    const groupedAthletes = {
      unavailable: buildAthletes(3),
      injured: buildAthletes(5),
      returning: buildAthletes(1),
      available: buildAthletes(2),
    };

    baseProps = {
      groupedAthletes,
      variables: groupVariables(variables)[selectedPlatform],
      cellWidth,
    };

    const initialCheckedVariables = {};

    Object.values(groupedAthletes)
      .flat()
      .forEach((athlete) => {
        initialCheckedVariables[athlete.id] = {};
      });

    preloadedState = {
      checkedVariables: initialCheckedVariables,
    };
  });

  it('renders the correct number of checkboxes', () => {
    renderWithRedux(<CheckboxCells {...baseProps} />, {
      useGlobalStore: false,
      preloadedState,
    });

    const numberOfAthletes = 11; // 3 + 5 + 1 + 2
    const numberOfVariables = baseProps.variables.length;
    const expectedNumberOfCheckboxes = numberOfAthletes * numberOfVariables;

    // The child Checkbox container renders an input with role="checkbox"
    const checkboxes = screen.getAllByRole('checkbox');

    expect(checkboxes).toHaveLength(expectedNumberOfCheckboxes);
  });

  it('renders the correct number of rows', () => {
    const { container } = renderWithRedux(<CheckboxCells {...baseProps} />, {
      useGlobalStore: false,
      preloadedState,
    });

    // Since rows are divs without a specific role, we query by class name
    const rows = container.querySelectorAll(
      '.questionnaireManagerCheckboxCells__row'
    );

    expect(rows).toHaveLength(11); // 3 + 5 + 1 + 2
  });

  it('renders the correct number of columns (cells) in the first row', () => {
    const { container } = renderWithRedux(<CheckboxCells {...baseProps} />, {
      useGlobalStore: false,
      preloadedState,
    });
    const firstRow = container.querySelector(
      '.questionnaireManagerCheckboxCells__row'
    );
    const cellsInFirstRow = firstRow.querySelectorAll(
      '.questionnaireManagerCheckboxCells__cell'
    );
    const expectedNumberOfColumns = baseProps.variables.length;

    expect(cellsInFirstRow).toHaveLength(expectedNumberOfColumns);
  });

  it('applies the correct width style to the cells', () => {
    const { container } = renderWithRedux(<CheckboxCells {...baseProps} />, {
      useGlobalStore: false,
      preloadedState,
    });
    const firstCell = container.querySelector(
      '.questionnaireManagerCheckboxCells__cell'
    );

    expect(firstCell).toHaveStyle({ width: `${cellWidth}px` });
  });
});
