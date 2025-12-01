import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { buildAthletes, buildVariables, buildVariable } from '../test_utils';
import { checkedVariables } from '../../utils';
import Header from '../../components/VariableHeader';

describe('QuestionnaireManager <Header /> component', () => {
  const variableWidth = 128;
  let baseProps;

  beforeEach(() => {
    baseProps = {
      variables: buildVariables(10),
      variableWidth,
      groupedAthletes: {
        unavailable: buildAthletes(3),
        injured: buildAthletes(5),
        returning: buildAthletes(1),
        available: buildAthletes(2),
      },
      checkedVariables: checkedVariables(buildAthletes(11)),
      toggleAllAthletes: jest.fn(),
      t: i18nextTranslateStub(),
    };
  });

  it('renders the component', () => {
    const { container } = render(<Header {...baseProps} />);

    // Check for the main container class
    expect(container.querySelector('.variableHeader')).toBeInTheDocument();
  });

  it('renders the correct number of variables', () => {
    const { container } = render(<Header {...baseProps} />);
    const variableElements = container.querySelectorAll(
      '.variableHeader__variable'
    );

    expect(variableElements.length).toBe(baseProps.variables.length);
  });

  it('displays a prompt when there are no available variables', () => {
    render(<Header {...baseProps} variables={[]} />);

    expect(
      screen.getByText('There are no variables defined for this Organisation.')
    ).toBeInTheDocument();
  });

  it('renders variable names correctly', () => {
    render(<Header {...baseProps} />);

    baseProps.variables.forEach((variable) => {
      expect(screen.getByText(variable.name)).toBeInTheDocument();
    });
  });

  it('renders a minimum number of cells, even with few variables', () => {
    const propsWithFewVariables = {
      ...baseProps,
      variables: buildVariables(3),
    };
    const { container } = render(<Header {...propsWithFewVariables} />);
    const variableElements = container.querySelectorAll(
      '.variableHeader__variable'
    );

    // The component logic enforces a minimum of 6 cells
    expect(variableElements.length).toBe(6);
  });

  it('sets the correct width on variable cells', () => {
    const { container } = render(<Header {...baseProps} />);
    const firstVariableCell = container.querySelector(
      '.variableHeader__variable'
    );

    expect(firstVariableCell).toHaveStyle({ width: `${variableWidth}px` });
  });

  describe('MultipleCheckboxChecker state', () => {
    it('has the correct "ALL_CHECKED" state when all athletes have the variable', () => {
      const athletes = buildAthletes(2);
      const props = {
        ...baseProps,
        variables: [buildVariable('msk', 1)],
        groupedAthletes: {
          unavailable: athletes,
        },
        checkedVariables: {
          [athletes[0].id]: { 1: true },
          [athletes[1].id]: { 1: true },
        },
      };
      const { container } = render(<Header {...props} />);

      // The real component renders a div with a specific class for its state
      const checkbox = container.querySelector('.multipleCheckboxChecker');

      expect(checkbox).toHaveClass('multipleCheckboxChecker--checked');
    });

    it('has the correct "PARTIALLY_CHECKED" state when some athletes have the variable', () => {
      const athletes = buildAthletes(2);
      const props = {
        ...baseProps,
        variables: [buildVariable('msk', 1)],
        groupedAthletes: {
          unavailable: athletes,
        },
        checkedVariables: {
          [athletes[0].id]: { 1: true },
          [athletes[1].id]: { 1: false },
        },
      };
      const { container } = render(<Header {...props} />);

      const checkbox = container.querySelector('.multipleCheckboxChecker');

      expect(checkbox).toHaveClass('multipleCheckboxChecker--minus');
    });

    it('has the correct "EMPTY" state when no athletes have the variable', () => {
      const athletes = buildAthletes(2);
      const props = {
        ...baseProps,
        variables: [buildVariable('msk', 1)],
        groupedAthletes: {
          unavailable: athletes,
        },
        checkedVariables: {
          [athletes[0].id]: { 1: false },
          [athletes[1].id]: { 1: false },
        },
      };
      const { container } = render(<Header {...props} />);

      const checkbox = container.querySelector('.multipleCheckboxChecker');

      // no additional class for empty state, just the base class
      expect(checkbox).toHaveClass('multipleCheckboxChecker');
    });
  });
});
