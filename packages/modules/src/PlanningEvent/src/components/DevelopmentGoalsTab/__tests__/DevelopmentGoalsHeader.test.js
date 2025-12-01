import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import DevelopmentGoalsHeader from '../DevelopmentGoalsHeader';

jest.mock('../DevelopmentGoalsFilters', () => ({
  DevelopmentGoalsFiltersTranslated: () => (
    <div data-testid="filters">DevelopmentGoalsFilters</div>
  ),
}));

jest.mock('../DevelopmentGoalCompletionActions', () => ({
  DevelopmentGoalCompletionActionsTranslated: () => (
    <div data-testid="actions">DevelopmentGoalCompletionActions</div>
  ),
}));

describe('<DevelopmentGoalsHeader />', () => {
  const props = {
    developmentGoalCompletionTypes: [
      {
        id: 1,
        name: 'Coached',
      },
      {
        id: 2,
        name: 'Practised',
      },
    ],
    t: i18nextTranslateStub(),
  };

  it('renders the correct title', () => {
    render(<DevelopmentGoalsHeader {...props} />);
    expect(
      screen.getByRole('heading', { name: 'Development Goals' })
    ).toBeInTheDocument();
  });

  it('shows the title with the correct terminology when developmentGoalTerminology exists', () => {
    render(
      <DevelopmentGoalsHeader
        {...props}
        developmentGoalTerminology="Custom terminology"
      />
    );

    expect(
      screen.getByRole('heading', { name: 'Custom terminology' })
    ).toBeInTheDocument();
  });

  it('shows the actions and hides the empty msg when shouldDisplayActions is true', () => {
    render(<DevelopmentGoalsHeader {...props} shouldDisplayActions />);
    expect(screen.getByTestId('actions')).toBeInTheDocument();
    expect(
      screen.queryByText('No development goals added')
    ).not.toBeInTheDocument();
  });

  it('shows the filters when shouldDisplayFilters is true', () => {
    render(<DevelopmentGoalsHeader {...props} shouldDisplayFilters />);
    expect(screen.getByTestId('filters')).toBeInTheDocument();
  });

  describe('when actions are not displayed', () => {
    it('shows the empty msg with the correct terminology when developmentGoalTerminology exists', () => {
      render(
        <DevelopmentGoalsHeader
          {...props}
          developmentGoalCompletionTypes={[]}
          developmentGoalTerminology="Custom terminology"
        />
      );

      expect(
        screen.getByText('No Custom terminology added')
      ).toBeInTheDocument();
    });

    it('shows the default empty message when no terminology is provided', () => {
      render(
        <DevelopmentGoalsHeader
          {...props}
          developmentGoalCompletionTypes={[]}
        />
      );

      expect(
        screen.getByText('No development goals added')
      ).toBeInTheDocument();
    });
  });

  it('displays a loader when loading', () => {
    render(<DevelopmentGoalsHeader {...props} isLoading />);

    expect(
      screen.getByTestId('DevelopmentGoalsTab|lineLoader')
    ).toBeInTheDocument();
  });
});
