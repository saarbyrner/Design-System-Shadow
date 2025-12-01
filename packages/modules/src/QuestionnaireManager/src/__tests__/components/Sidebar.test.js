import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { buildAthletes, buildVariables, buildVariable } from '../test_utils';
import { checkedVariables } from '../../utils';
import Sidebar from '../../components/Sidebar';

describe('QuestionnaireManager <Sidebar /> component', () => {
  let baseProps;

  beforeEach(() => {
    baseProps = {
      groupedAthletes: {
        unavailable: buildAthletes(3),
        injured: buildAthletes(5),
        returning: buildAthletes(1),
        available: buildAthletes(2),
      },
      variables: buildVariables(5),
      checkedVariables: checkedVariables(buildAthletes(11)),
      groupingLabels: {
        unavailable: 'Unavailable',
        available: 'Available',
        injured: 'Available (Injured)',
        returning: 'Available (Returning from injury)',
      },
      toggleAllVariables: jest.fn(),
      t: i18nextTranslateStub(),
    };
  });

  it('renders the component', () => {
    const { container } = render(<Sidebar {...baseProps} />);

    expect(
      container.querySelector('.questionnaireManagerSidebar')
    ).toBeInTheDocument();
  });

  it('displays the correct group headings', () => {
    render(<Sidebar {...baseProps} />);

    expect(screen.getByText('Unavailable')).toBeInTheDocument();
    expect(screen.getByText('Available (Injured)')).toBeInTheDocument();
    expect(
      screen.getByText('Available (Returning from injury)')
    ).toBeInTheDocument();
    expect(screen.getByText('Available')).toBeInTheDocument();
  });

  it('displays the correct total number of athletes', () => {
    const { container } = render(<Sidebar {...baseProps} />);
    const athleteElements = container.querySelectorAll(
      '.questionnaireManagerSidebar__athlete'
    );

    // 3 + 5 + 1 + 2 = 11
    expect(athleteElements).toHaveLength(11);
  });

  it('displays a checkbox for each athlete', () => {
    render(<Sidebar {...baseProps} />);
    const checkboxes = screen.getAllByTestId('MultipleCheckboxChecker');

    expect(checkboxes).toHaveLength(11);
  });

  describe('MultipleCheckboxChecker state', () => {
    it('has the correct "ALL_CHECKED" state when the athlete has all variables checked', () => {
      const athletes = buildAthletes(1);
      const variables = [buildVariable('msk', 1), buildVariable('msk', 2)];
      const props = {
        ...baseProps,
        variables,
        groupedAthletes: {
          unavailable: athletes,
        },
        checkedVariables: {
          [athletes[0].id]: { 1: true, 2: true },
        },
      };
      render(<Sidebar {...props} />);

      const checkbox = screen.getByTestId('MultipleCheckboxChecker');

      expect(checkbox).toHaveClass('multipleCheckboxChecker--checked');
    });

    it('has the correct "PARTIALLY_CHECKED" state when the athlete has some variables checked', () => {
      const athletes = buildAthletes(1);
      const variables = [buildVariable('msk', 1), buildVariable('msk', 2)];
      const props = {
        ...baseProps,
        variables,
        groupedAthletes: {
          unavailable: athletes,
        },
        checkedVariables: {
          [athletes[0].id]: { 1: true, 2: false },
        },
      };
      render(<Sidebar {...props} />);

      const checkbox = screen.getByTestId('MultipleCheckboxChecker');

      expect(checkbox).toHaveClass('multipleCheckboxChecker--minus');
    });

    it('has the correct "EMPTY" state when the athlete has no variables checked', () => {
      const athletes = buildAthletes(1);
      const variables = [buildVariable('msk', 1), buildVariable('msk', 2)];
      const props = {
        ...baseProps,
        variables,
        groupedAthletes: {
          unavailable: athletes,
        },
        checkedVariables: {
          [athletes[0].id]: { 1: false, 2: false },
        },
      };
      render(<Sidebar {...props} />);

      const checkbox = screen.getByTestId('MultipleCheckboxChecker');

      // no additional class for empty state, just the base class
      expect(checkbox).toHaveClass('multipleCheckboxChecker');
    });
  });
});
