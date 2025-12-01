import * as redux from 'react-redux';
import { screen, waitFor } from '@testing-library/react';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import userEvent from '@testing-library/user-event';
import { rest, server } from '@kitman/services/src/mocks/server';
import mockAthleteReviews from '@kitman/modules/src/AthleteReviews/src/shared/services/mocks/data/athlete_reviews';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import DevelopmentGoalView from '../index';

describe('DevelopmentGoalView', () => {
  const mockDevelopmentGoal = mockAthleteReviews[0].development_goals[0];

  const defaultProps = {
    reviewId: 1,
    developmentGoalInfo: mockDevelopmentGoal,
    goalIndex: 0,
    dashboards: [],
    onSave: jest.fn(),
    setForm: jest.fn(),
    t: i18nextTranslateStub(),
  };

  const renderComponent = (props = defaultProps) =>
    renderWithRedux(<DevelopmentGoalView {...props} />, {});

  let useDispatchSpy;
  let mockDispatch;

  beforeEach(() => {
    useDispatchSpy = jest.spyOn(redux, 'useDispatch');
    mockDispatch = jest.fn();
    useDispatchSpy.mockReturnValue(mockDispatch);
  });

  describe('initial render', () => {
    it('renders out the default status', () => {
      renderComponent();

      expect(screen.getByText('Goal 1 Name')).toBeInTheDocument();
      expect(screen.getByText('Still in progress')).toBeInTheDocument();
    });

    it('renders out the ellipsis menu and options', async () => {
      const user = userEvent.setup();
      renderComponent();

      await user.click(screen.getByRole('button'));
      expect(screen.getByText('Add comment/status')).toBeInTheDocument();
      expect(screen.getByText('Delete')).toBeInTheDocument();
    });

    it('renders out the status options when clicking add comment/status', async () => {
      const user = userEvent.setup();
      renderComponent();

      await user.click(screen.getByRole('button'));
      await user.click(screen.getByText('Add comment/status'));

      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Save')).toBeInTheDocument();

      expect(screen.getAllByText('Still in progress').length).toEqual(2);
      expect(screen.getByText('Achieved')).toBeInTheDocument();
      expect(screen.getByText('Not Achieved')).toBeInTheDocument();
    });

    it('changes the status when a status option is clicked', async () => {
      const user = userEvent.setup();
      renderComponent();

      await user.click(screen.getByRole('button'));
      await user.click(screen.getByText('Add comment/status'));
      expect(screen.getAllByText('Achieved').length).toEqual(1);
      await user.click(screen.getByText('Achieved'));
      expect(screen.getAllByText('Achieved').length).toEqual(2);
    });

    it('reverts the status when cancel is clicked setting the previous option', async () => {
      const user = userEvent.setup();
      renderComponent();

      await user.click(screen.getByRole('button'));
      await user.click(screen.getByText('Add comment/status'));
      await user.click(screen.getByText('Achieved'));
      await user.click(screen.getByText('Cancel'));
      expect(screen.getByText('Still in progress')).toBeInTheDocument();
    });

    it('fires an onSave call when save is clicked after changing the status', async () => {
      const user = userEvent.setup();
      renderComponent();

      await user.click(screen.getByRole('button'));
      await user.click(screen.getByText('Add comment/status'));
      await user.click(screen.getByText('Achieved'));
      await user.click(screen.getByText('Save'));
      expect(defaultProps.onSave).toHaveBeenCalledWith({
        goalIndex: 0,
        newComment: { id: null, text: '' },
        newStatusValue: 'achieved',
      });
    });

    it('fires an onSave call when save is clicked after adding a comment', async () => {
      const user = userEvent.setup();
      renderComponent();

      await user.click(screen.getByRole('button'));
      await user.click(screen.getByText('Add comment/status'));
      await user.type(screen.getByRole('textbox', { name: 'Comment' }), 'Co');
      await user.click(screen.getByText('Save'));
      expect(defaultProps.onSave).toHaveBeenCalledWith({
        goalIndex: 0,
        newComment: { id: null, text: 'Co' },
        newStatusValue: null,
      });
    });
  });

  describe('Saved Comment Render', () => {
    const mockDevelopmentGoalWithComment = {
      ...mockDevelopmentGoal,
      comments: [
        {
          id: 4,
          development_goal_id: 1,
          user: {
            id: undefined,
            fullname: 'Test Name',
            avatar_url: null,
          },
          text: 'Test Comment 1',
          created_at: '2024-05-28T13:08:26+01:00',
        },
      ],
    };

    it('allows the user to successfully delete a comment', async () => {
      const user = userEvent.setup();
      renderComponent({
        ...defaultProps,
        developmentGoalInfo: mockDevelopmentGoalWithComment,
      });

      await waitFor(() => {
        expect(screen.getAllByRole('button')[1]).toBeInTheDocument();
      });
      await user.click(screen.getAllByRole('button')[1]);

      expect(screen.getByText('Delete comment')).toBeInTheDocument();
      await user.click(screen.getByText('Delete'));

      expect(mockDispatch).toHaveBeenCalledWith({
        payload: { status: 'SUCCESS', title: 'Comment deleted' },
        type: 'toasts/add',
      });
    });

    it('returns a error toast if the deletion of a comment fails', async () => {
      server.use(
        rest.delete(
          '/athletes/:athleteId/athlete_reviews/:reviewId/development_goal_comments/:comment_id',
          (req, res, ctx) => res(ctx.status(500))
        )
      );
      const user = userEvent.setup();
      renderComponent({
        ...defaultProps,
        developmentGoalInfo: mockDevelopmentGoalWithComment,
      });

      await waitFor(() => {
        expect(screen.getAllByRole('button')[1]).toBeInTheDocument();
      });
      await user.click(screen.getAllByRole('button')[1]);
      await user.click(screen.getByText('Delete'));

      expect(mockDispatch).toHaveBeenCalledWith({
        payload: { status: 'ERROR', title: 'Error deleting comment' },
        type: 'toasts/add',
      });
    });
  });
});
