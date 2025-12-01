import { screen } from '@testing-library/react';
import * as redux from 'react-redux';
import { server, rest } from '@kitman/services/src/mocks/server';
import { axios } from '@kitman/common/src/utils/services';
import userEvent from '@testing-library/user-event';
import useLocationPathname from '@kitman/common/src/hooks/useLocationPathname';
import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';
import mockAthleteReviews from '@kitman/modules/src/AthleteReviews/src/shared/services/mocks/data/athlete_reviews';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import CoachView from '../index';

jest.mock('@kitman/common/src/hooks/useLocationPathname');

describe('CoachView', () => {
  const mockReview = mockAthleteReviews[0];

  const defaultProps = {
    form: mockReview,
    setForm: jest.fn(),
    t: i18nextTranslateStub(),
  };

  const renderComponent = (props = defaultProps) =>
    renderWithProviders(<CoachView {...props} />);

  let useDispatchSpy;
  let mockDispatch;

  beforeEach(() => {
    useDispatchSpy = jest.spyOn(redux, 'useDispatch');
    mockDispatch = jest.fn();
    useDispatchSpy.mockReturnValue(mockDispatch);
    useLocationPathname.mockReturnValue('/athletes/123/athlete_reviews/1');
  });

  describe('initial render', () => {
    it('renders the development goal list out/comment', () => {
      renderComponent();
      expect(screen.getByText('Goal 1 Name')).toBeInTheDocument();
      expect(screen.getByText('Still in progress')).toBeInTheDocument();
      expect(screen.getByText('TESTER principle')).toBeInTheDocument();
      expect(screen.getByText('Goal 1 description')).toBeInTheDocument();
      expect(
        screen.getByRole('link', { name: 'Lampard highlights' })
      ).toBeInTheDocument();

      // comment display
      const avatar = screen.getByRole('img');
      expect(avatar).toHaveAttribute('src', 'FrankLampard.jpg');
      expect(avatar).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: 'Frank Lampard' })
      ).toBeInTheDocument();
      expect(screen.getByText('May 22, 2024')).toBeInTheDocument();
    });

    it('allows the user to save a status change on a development goal when they edit', async () => {
      jest.spyOn(axios, 'patch');
      const user = userEvent.setup();
      renderComponent();

      await user.click(screen.getByRole('button'));
      await user.click(screen.getByText('Add comment/status'));
      await user.click(screen.getByText('Achieved'));
      await user.click(screen.getByText('Save'));

      expect(axios.patch).toHaveBeenCalledWith(
        '/athletes/123/athlete_reviews/1',
        {
          ...mockReview,
          development_goals: [
            {
              ...mockReview.development_goals[0],
              status: 'achieved',
              principle_id: 1,
              development_goal_type_id: 1,
            },
          ],
        }
      );

      expect(mockDispatch).toHaveBeenCalledWith({
        payload: {
          status: 'SUCCESS',
          title: 'Development goal updated',
        },
        type: 'toasts/add',
      });
    });
  });

  it('allows the user to save add a comment and renders toast message', async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByRole('button'));
    await user.click(screen.getByText('Add comment/status'));
    await user.type(screen.getByRole('textbox', { name: 'Comment' }), 'Hello');
    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: {
        status: 'SUCCESS',
        title: 'Comment added',
      },
      type: 'toasts/add',
    });
  });

  describe('failed save render', () => {
    it('dispatches a toast if the status change save request fails', async () => {
      server.use(
        rest.patch(
          '/athletes/:athleteId/athlete_reviews/:reviewId',
          (req, res, ctx) => res(ctx.status(500))
        )
      );
      const user = userEvent.setup();
      renderComponent();

      await user.click(screen.getByRole('button'));
      await user.click(screen.getByText('Add comment/status'));
      await user.click(screen.getByText('Achieved'));
      await user.click(screen.getByRole('button', { name: 'Save' }));

      expect(mockDispatch).toHaveBeenCalledWith({
        payload: { status: 'ERROR', title: 'Error updating goal' },
        type: 'toasts/add',
      });
    });

    it('dispatches a toast if update development goal request fails', async () => {
      server.use(
        rest.patch(
          '/athletes/:athleteId/athlete_reviews/:reviewId/update_development_goal',
          (req, res, ctx) => res(ctx.status(500))
        )
      );
      const user = userEvent.setup();
      renderComponent();

      await user.click(screen.getByRole('button'));
      await user.click(screen.getByText('Add comment/status'));
      await user.type(screen.getByRole('textbox', { name: 'Comment' }), 'Co');
      await user.click(screen.getByRole('button', { name: 'Save' }));
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: { status: 'ERROR', title: 'Error adding comment' },
        type: 'toasts/add',
      });
    });
  });
});
