import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithStore } from '@kitman/modules/src/analysis/Dashboard/utils/testUitils';
import { DevelopmentGoalWidgetTranslated as DevelopmentGoalWidget } from '../index';

describe('<DevelopmentGoalWidget />', () => {
  const defaultProps = {
    developmentGoals: [],
    totalCount: 3,
    nextId: null,
    hasError: false,
    canViewDevelopmentGoals: true,
    canCreateDevelopmentGoals: true,
    canEditDevelopmentGoals: true,
    canDeleteDevelopmentGoals: true,
    canManageDashboard: true,
    fetchNextDevelopmentGoals: jest.fn(),
    onClickAddDevelopmentGoal: jest.fn(),
    onClickDeleteDevelopmentGoalWidget: jest.fn(),
    onDeleteDevelopmentGoalSuccess: jest.fn(),
    onCloseDevelopmentGoalSuccess: jest.fn(),
    onClickEditDevelopmentGoal: jest.fn(),
    isLoadingWidgetContent: false,
    areCoachingPrinciplesEnabled: false,
    developmentGoalTerminology: '',
    t: (key) => key,
  };

  it('renders the correct title', () => {
    renderWithStore(<DevelopmentGoalWidget {...defaultProps} />);

    expect(screen.getByText('Development Goals (3)')).toBeVisible();
  });

  it('renders a meatball menu with the correct items', async () => {
    const user = userEvent.setup();
    renderWithStore(<DevelopmentGoalWidget {...defaultProps} />);

    const menuButton = screen.getByRole('button', { expanded: false });
    await user.click(menuButton);

    expect(screen.getByText('Add Development goal')).toBeInTheDocument();
    expect(screen.getByText('Remove widget')).toBeInTheDocument();
  });

  it('calls onClickAddDevelopmentGoal when clicking the add objective button', async () => {
    const user = userEvent.setup();
    renderWithStore(<DevelopmentGoalWidget {...defaultProps} />);

    const menuButton = screen.getByRole('button', { expanded: false });
    await user.click(menuButton);

    const addButton = screen.getByText('Add Development goal');
    await user.click(addButton);

    expect(defaultProps.onClickAddDevelopmentGoal).toHaveBeenCalledTimes(1);
  });

  it('calls onClickDeleteDevelopmentGoalWidget when the user confirms to delete the widget', async () => {
    const user = userEvent.setup();
    renderWithStore(<DevelopmentGoalWidget {...defaultProps} />);

    const menuButton = screen.getByRole('button', { expanded: false });
    await user.click(menuButton);

    const removeButton = screen.getByText('Remove widget');
    await user.click(removeButton);

    expect(screen.getByText('Delete widget?')).toBeInTheDocument();

    const confirmButton = screen.getByText('Delete');
    await user.click(confirmButton);

    expect(
      defaultProps.onClickDeleteDevelopmentGoalWidget
    ).toHaveBeenCalledTimes(1);
  });

  it('closes the confirm box when clicking the close button', async () => {
    const user = userEvent.setup();
    renderWithStore(<DevelopmentGoalWidget {...defaultProps} />);

    const menuButton = screen.getByRole('button', { expanded: false });
    await user.click(menuButton);

    const removeButton = screen.getByText('Remove widget');
    await user.click(removeButton);

    expect(screen.getByText('Delete widget?')).toBeInTheDocument();

    const closeButton = screen.getByRole('button', { name: 'Cancel' });
    await user.click(closeButton);

    expect(screen.queryByText('Delete widget?')).not.toBeInTheDocument();
  });

  it('renders an error when the widget contain errors', () => {
    renderWithStore(<DevelopmentGoalWidget {...defaultProps} hasError />);

    expect(screen.getByTestId('AppStatus-error')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
  });

  it('renders the list of objectives when there are development goals', () => {
    const developmentGoals = [
      {
        id: 1,
        description: 'Development Goal Description',
        principles: [{ id: 1, name: 'Technical' }],
        development_goal_types: [
          { id: 1, name: 'Offensive transition (with ball)' },
        ],
        athlete: { id: 1, fullname: 'John Doh' },
      },
      {
        id: 2,
        description: 'Development Goal Description',
        principles: [{ id: 1, name: 'Technical' }],
        development_goal_types: [
          { id: 1, name: 'Offensive transition (with ball)' },
        ],
        athlete: { id: 1, fullname: 'John Doh' },
      },
      {
        id: 3,
        description: 'Development Goal Description',
        principles: [{ id: 1, name: 'Technical' }],
        development_goal_types: [
          { id: 1, name: 'Offensive transition (with ball)' },
        ],
        athlete: { id: 2, fullname: 'Richard Roe' },
      },
    ];

    renderWithStore(
      <DevelopmentGoalWidget
        {...defaultProps}
        developmentGoals={developmentGoals}
      />
    );

    expect(screen.getByText('John Doh')).toBeInTheDocument();
    expect(screen.getByText('Richard Roe')).toBeInTheDocument();
    expect(screen.getAllByText('Offensive transition (with ball)').length).toBe(
      3
    );
  });

  it('hides the add development goal button when the user does not have the add permission', async () => {
    const user = userEvent.setup();
    renderWithStore(
      <DevelopmentGoalWidget
        {...defaultProps}
        canCreateDevelopmentGoals={false}
        developmentGoals={[]}
      />
    );

    const menuButton = screen.getByRole('button', { expanded: false });
    await user.click(menuButton);

    expect(screen.queryByText('Add Development goal')).not.toBeInTheDocument();
    expect(screen.getByText('Remove widget')).toBeInTheDocument();
    expect(
      screen.getByText('There are no development goals')
    ).toBeInTheDocument();
  });

  it('hides the remove widget button when the user does not have the manage dashboard permission', async () => {
    const user = userEvent.setup();
    renderWithStore(
      <DevelopmentGoalWidget {...defaultProps} canManageDashboard={false} />
    );

    const menuButton = screen.getByRole('button', { expanded: false });
    await user.click(menuButton);

    expect(screen.getByText('Add Development goal')).toBeInTheDocument();
    expect(screen.queryByText('Remove widget')).not.toBeInTheDocument();
  });

  it('hides the development goals when the user does not have the view permission', () => {
    const developmentGoals = [
      {
        id: 1,
        description: 'Development Goal Description',
        principles: [{ id: 1, name: 'Technical' }],
        development_goal_types: [
          { id: 1, name: 'Offensive transition (with ball)' },
        ],
      },
    ];

    renderWithStore(
      <DevelopmentGoalWidget
        {...defaultProps}
        canViewDevelopmentGoals={false}
        developmentGoals={developmentGoals}
      />
    );

    expect(
      screen.queryByText('Development Goal Description')
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(
        'Please contact your administrator for permission to view this data'
      )
    ).toBeInTheDocument();
  });

  it('shows the correct terminology when developmentGoalTerminology exists', async () => {
    const user = userEvent.setup();
    renderWithStore(
      <DevelopmentGoalWidget
        {...defaultProps}
        developmentGoalTerminology="Custom terminology"
      />
    );

    expect(screen.getByText('Custom terminology (3)')).toBeInTheDocument();

    const menuButton = screen.getByRole('button', { expanded: false });
    await user.click(menuButton);

    expect(screen.getByText('add Custom terminology')).toBeInTheDocument();
  });

  it('shows the correct terminology the user does not have the create DG permission', () => {
    renderWithStore(
      <DevelopmentGoalWidget
        {...defaultProps}
        canCreateDevelopmentGoals={false}
        developmentGoalTerminology="Custom terminology"
      />
    );

    expect(
      screen.getByText('There are no Custom terminology')
    ).toBeInTheDocument();
  });
});
