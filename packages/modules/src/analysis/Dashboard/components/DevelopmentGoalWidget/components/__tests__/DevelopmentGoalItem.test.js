import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { rest, server } from '@kitman/services/src/mocks/server';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import DevelopmentGoalItem from '../DevelopmentGoalItem';

describe('DevelopmentGoalItem Component', () => {
  const user = userEvent.setup({
    advanceTimers: jest.advanceTimersByTime,
  });

  const props = {
    developmentGoal: {
      id: 1,
      description: 'Development Goal Description',
      principles: [
        {
          id: 1,
          name: 'Technical',
          principle_categories: [
            {
              id: 1,
              name: 'Line-out',
            },
          ],
          phases: [
            {
              id: 1,
              name: 'Backline',
            },
          ],
          principle_types: [
            {
              id: 1,
              name: 'Technical',
            },
          ],
        },
      ],
      development_goal_types: [
        {
          id: 1,
          name: 'Offensive transition (with ball)',
        },
      ],
      start_time: '2020-06-18T00:00:00+00:00',
      close_time: '2020-08-01T00:00:00+00:00',
    },
    canEditDevelopmentGoals: true,
    canDeleteDevelopmentGoals: true,
    onClickEditDevelopmentGoal: jest.fn(),
    onDeleteDevelopmentGoalSuccess: jest.fn(),
    onCloseDevelopmentGoalSuccess: jest.fn(),
    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    const juneTwentyTwenty = new Date('June 20, 2020 00:00:00');
    jest.useFakeTimers().setSystemTime(juneTwentyTwenty);
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it('renders the list of objective details without coaching principles', () => {
    render(<DevelopmentGoalItem {...props} />);

    expect(
      screen.getByText('Development Goal Description')
    ).toBeInTheDocument();
    expect(screen.getByText('Jun 18, 2020 - Aug 1, 2020')).toBeInTheDocument();
    expect(
      screen.getByText('Offensive transition (with ball)')
    ).toBeInTheDocument();
  });

  it('renders the list of objective details with coaching principles enabled', () => {
    render(<DevelopmentGoalItem {...props} areCoachingPrinciplesEnabled />);

    expect(
      screen.getByText('Technical (Line-out, Backline, Technical)')
    ).toBeInTheDocument();
  });

  it('renders the correct date when there is no close date', () => {
    render(
      <DevelopmentGoalItem
        {...props}
        developmentGoal={{ ...props.developmentGoal, close_time: null }}
      />
    );

    expect(screen.getByText('Jun 18, 2020')).toBeInTheDocument();
  });

  it('does not render the close label when the close time is in the future', () => {
    const developmentGoalInThePast = {
      ...props.developmentGoal,
      close_time: '2020-08-01T00:00:00+01:00',
    };

    render(
      <DevelopmentGoalItem
        {...props}
        developmentGoal={developmentGoalInThePast}
      />
    );
    expect(screen.queryByText('Closed')).not.toBeInTheDocument();
  });

  it('renders the close label when the closed time is in the past', () => {
    const developmentGoalInThePast = {
      ...props.developmentGoal,
      close_time: '2020-01-01T00:00:00+01:00',
    };
    render(
      <DevelopmentGoalItem
        {...props}
        developmentGoal={developmentGoalInThePast}
      />
    );

    expect(screen.getByText('Closed')).toBeInTheDocument();
  });

  it('disables the close button when the start time is in the future', async () => {
    const developmentGoalInThePast = {
      ...props.developmentGoal,
      start_time: '2020-10-01T00:00:00+01:00',
    };
    render(
      <DevelopmentGoalItem
        {...props}
        developmentGoal={developmentGoalInThePast}
      />
    );

    const actionMenu = screen.getByTestId('DevelopmentGoalItem|TooltipButton');
    await user.click(actionMenu);

    expect(screen.getByRole('button', { name: 'Close' })).toHaveClass(
      'tooltipMenu__item--disabled'
    );
  });

  it('disables the close button when the closed time is in the past', async () => {
    const developmentGoalInThePast = {
      ...props.developmentGoal,
      close_time: '2020-01-01T00:00:00+01:00',
    };
    render(
      <DevelopmentGoalItem
        {...props}
        developmentGoal={developmentGoalInThePast}
      />
    );

    const actionMenu = screen.getByTestId('DevelopmentGoalItem|TooltipButton');
    await user.click(actionMenu);

    expect(screen.getByRole('button', { name: 'Close' })).toHaveClass(
      'tooltipMenu__item--disabled'
    );
  });

  describe('when the close request is successful', () => {
    const closedDevelopmentGoal = {
      id: 1,
      description: 'Closed development goal',
      close_time: '2020-06-20T00:00:00+01:00',
    };

    beforeEach(() => {
      server.use(
        rest.patch('/ui/planning_hub/development_goals/1', (req, res, ctx) => {
          return res(ctx.json(closedDevelopmentGoal));
        })
      );
    });

    it('closes the development goal when clicking the close button', async () => {
      render(<DevelopmentGoalItem {...props} />);

      const actionMenu = screen.getByTestId(
        'DevelopmentGoalItem|TooltipButton'
      );
      await user.click(actionMenu);
      await user.click(screen.getByRole('button', { name: 'Close' }));

      expect(props.onCloseDevelopmentGoalSuccess).toHaveBeenCalledWith(
        closedDevelopmentGoal
      );
    });
  });

  describe('when the close development goal request fails', () => {
    beforeEach(() => {
      server.use(
        rest.patch('/ui/planning_hub/development_goals/1', (req, res, ctx) => {
          return res(ctx.status(500));
        })
      );
    });

    it('shows an error message', async () => {
      render(<DevelopmentGoalItem {...props} />);

      const actionMenu = screen.getByTestId(
        'DevelopmentGoalItem|TooltipButton'
      );
      await user.click(actionMenu);
      await user.click(screen.getByRole('button', { name: 'Close' }));

      expect(screen.getByTestId('AppStatus-error')).toBeInTheDocument();
    });
  });

  it('calls the correct prop when clicking the edit button', async () => {
    render(<DevelopmentGoalItem {...props} />);

    const actionMenu = screen.getByTestId('DevelopmentGoalItem|TooltipButton');
    await user.click(actionMenu);
    await user.click(screen.getByRole('button', { name: 'Edit' }));

    expect(props.onClickEditDevelopmentGoal).toHaveBeenCalled();
  });

  const deleteDevelopmentGoal = async () => {
    // Click the delete button
    const actionMenu = screen.getByTestId('DevelopmentGoalItem|TooltipButton');
    await user.click(actionMenu);
    await user.click(screen.getByRole('button', { name: 'Delete' }));

    expect(screen.getByText('Delete Development Goal')).toBeInTheDocument();

    // Click the confirm button
    await user.click(
      screen.getByRole('button', { name: 'Delete', hidden: true })
    );
  };

  describe('when the delete request is successful', () => {
    beforeEach(() => {
      server.use(
        rest.delete('/ui/planning_hub/development_goals/1', (req, res, ctx) => {
          return res(ctx.json([]));
        })
      );
    });

    it('deletes the development goal when confirming the deletion', async () => {
      render(<DevelopmentGoalItem {...props} />);

      await deleteDevelopmentGoal();

      //  When the request succeed, onDeleteDevelopmentGoalSuccess is called
      expect(props.onDeleteDevelopmentGoalSuccess).toHaveBeenCalled();
    });
  });

  describe('when the delete request fails', () => {
    beforeEach(() => {
      server.use(
        rest.delete('/ui/planning_hub/development_goals/1', (req, res, ctx) => {
          return res(ctx.status(500));
        })
      );
    });

    it('shows an error message', async () => {
      render(<DevelopmentGoalItem {...props} />);

      await deleteDevelopmentGoal();

      expect(screen.getByTestId('AppStatus-error')).toBeInTheDocument();
    });
  });

  it('hides the delete button when the user does not have the delete permission', async () => {
    render(
      <DevelopmentGoalItem {...props} canDeleteDevelopmentGoals={false} />
    );

    const actionMenu = screen.getByTestId('DevelopmentGoalItem|TooltipButton');
    await user.click(actionMenu);

    expect(
      screen.queryByRole('button', { name: 'Delete' })
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });

  it('hides the edit and close buttons when the user does not have the edit permission', async () => {
    render(<DevelopmentGoalItem {...props} canEditDevelopmentGoals={false} />);

    const actionMenu = screen.getByTestId('DevelopmentGoalItem|TooltipButton');
    await user.click(actionMenu);

    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Edit' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Close' })
    ).not.toBeInTheDocument();
  });

  it('hides the menu when the user does not have the edit or delete permission', async () => {
    render(
      <DevelopmentGoalItem
        {...props}
        canEditDevelopmentGoals={false}
        canDeleteDevelopmentGoals={false}
      />
    );

    expect(
      screen.queryByRole('button', { name: 'Delete' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Edit' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Close' })
    ).not.toBeInTheDocument();
  });
});
