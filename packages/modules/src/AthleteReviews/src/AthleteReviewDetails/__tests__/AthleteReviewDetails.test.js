import { screen, waitFor } from '@testing-library/react';
import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';
import userEvent from '@testing-library/user-event';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';
import useLocationPathname from '@kitman/common/src/hooks/useLocationPathname';
import { server, rest } from '@kitman/services/src/mocks/server';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import Toasts from '@kitman/modules/src/Toasts';
import fullMockData from '@kitman/modules/src/AthleteReviews/src/shared/services/mocks/data/athlete_reviews';
import AthleteReviewDetails from '..';
import { getStatusLabelsEnumLike } from '../../shared/enum-likes';

jest.mock('@kitman/common/src/hooks/useLocationAssign');
jest.mock('@kitman/common/src/hooks/useLocationPathname');

describe('DevelopmentGoalsList', () => {
  const props = {};
  const mockLocationAssign = jest.fn();
  const statusLabels = getStatusLabelsEnumLike(i18nextTranslateStub());
  const reviewStatuses = [
    statusLabels.completed,
    statusLabels.deleted,
    statusLabels.in_progress,
    statusLabels.upcoming,
  ];

  beforeEach(() => {
    useLocationPathname.mockReturnValue('/athletes/123/athlete_reviews/456');
    useLocationAssign.mockReturnValue(mockLocationAssign);
    window.featureFlags = {
      'athlete-profile-goals-and-reviews': false,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
    window.featureFlags = {};
  });

  it('renders the header', async () => {
    renderWithProviders(<AthleteReviewDetails {...props} />);
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });
    expect(
      screen.getByRole('heading', {
        name: 'Wilt Chamberlain - Test Review',
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Jan 31, 2024 - Oct 27, 2024 | Stuart O'Brien, Stephen Smith"
      )
    ).toBeInTheDocument();
    expect(screen.getByText('A review description')).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: 'Download' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', {
        name: 'Self Assessment - Five Star Frog Splash',
      })
    ).toBeInTheDocument();
  });

  it('renders the body', async () => {
    renderWithProviders(<AthleteReviewDetails {...props} />);
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    const dashboardUrl = screen.getByRole('link', { name: 'Dashboard 1' });
    const dashboardLink = '/analysis/dashboard/6287';
    const url1 = screen.getByRole('link', { name: 'Lampard highlights' });
    const url2 = screen.getByRole('link', { name: 'Gerrard highlights' });
    const url1Link =
      'https://github.com/KitmanLabs/kitman-frontend/pull/6211/files';
    const url2Link =
      'https://github.com/KitmanLabs/kitman-frontend/pull/621143/files';

    expect(
      screen.getByRole('heading', {
        name: 'Goal 1 Name',
      })
    ).toBeInTheDocument();

    expect(screen.getByRole('heading', { name: '1.' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Career goal' })
    ).toBeInTheDocument();

    expect(dashboardUrl).toBeInTheDocument();
    expect(dashboardUrl).toHaveAttribute('href', dashboardLink);

    expect(url1).toBeInTheDocument();
    expect(url1).toHaveAttribute('href', url1Link);

    expect(url2).toBeInTheDocument();
    expect(url2).toHaveAttribute('href', url2Link);

    // comment display
    const avatar = screen.getByRole('img');
    expect(avatar).toHaveAttribute('src', 'FrankLampard.jpg');
    expect(avatar).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Frank Lampard' })
    ).toBeInTheDocument();
    expect(screen.getByText('1st comment')).toBeInTheDocument();
    expect(screen.getByText('May 22, 2024')).toBeInTheDocument();
  });

  it('renders the correct sub-headers when two goals have the same development goal type', async () => {
    server.use(
      rest.get(
        '/athletes/:athleteId/athlete_reviews/:reviewId',
        (req, res, ctx) =>
          res(
            ctx.json({
              event: {
                ...fullMockData[0],
                development_goals: [
                  { ...fullMockData[0].development_goals[0] },
                  {
                    ...fullMockData[0].development_goals[0],
                    id: 2,
                    additional_name: '1st under Video analysis',
                    development_goal_types: [
                      { id: 2, name: 'Video analysis ' },
                    ],
                  },
                  {
                    ...fullMockData[0].development_goals[0],
                    id: 3,
                    additional_name: '2nd under Video analysis',
                    development_goal_types: [
                      { id: 2, name: 'Video analysis ' },
                    ],
                  },
                ],
              },
            })
          )
      )
    );
    renderWithProviders(<AthleteReviewDetails {...props} />);
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });
    expect(
      screen.getByRole('heading', { name: 'Career goal' })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { name: 'Video analysis' })
    ).toBeInTheDocument();

    // there is an item under Career Goal & Video Analysis marked as first goal
    expect(screen.getAllByRole('heading', { name: '1.' })).toHaveLength(2);
    expect(
      screen.getByRole('heading', {
        name: 'Goal 1 Name',
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: '1st under Video analysis',
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: '2nd under Video analysis',
      })
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '2.' })).toBeInTheDocument();
  });

  test.each(reviewStatuses)(
    'shows the correct sub menu options when review status is %s',
    async (status) => {
      const user = userEvent.setup();
      renderWithProviders(
        <AthleteReviewDetails
          {...props}
          form={{ ...props.form, review_status: status }}
        />
      );
      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });
      await user.click(screen.getAllByTestId('MoreVertIcon')[0]);

      // all options should show in the menu bar the current status
      // therefore we are splicing that item
      const reviewStatusesCopy = reviewStatuses.splice();
      const currentStatusIndex = reviewStatusesCopy.indexOf(status);
      reviewStatusesCopy.splice(currentStatusIndex, 1);

      expect(
        screen.getByRole('menuitem', { name: 'Edit' })
      ).toBeInTheDocument();

      reviewStatusesCopy.forEach((statusName) => {
        expect(
          screen.getByRole('menuitem', {
            name: `Mark as ${statusName.toLowerCase()}`,
          })
        ).toBeInTheDocument();
      });
    }
  );

  it('allows a user to create a comment on a development goal', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AthleteReviewDetails {...props} />);
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });
    await user.click(screen.getAllByTestId('MoreVertIcon')[1]);
    await user.click(screen.getByText('Add comment/status'));
    await user.type(screen.getByRole('textbox', { name: 'Comment' }), 'Co');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);

    // newly created comment appears
    const newCommentAvatar = images[1];
    expect(newCommentAvatar).toHaveAttribute('src', 'JohnCena.jpg');
    expect(newCommentAvatar).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'John Cena' })
    ).toBeInTheDocument();
    expect(screen.getByText('May 23, 2024')).toBeInTheDocument();
    expect(screen.getByText('Co')).toBeInTheDocument();
  });
  it('allows the user to change the review status', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AthleteReviewDetails {...props} />);
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });
    await user.click(screen.getAllByTestId('MoreVertIcon')[0]);
    const markAsInProgress = screen.getByRole('menuitem', {
      name: 'Mark as in progress',
    });
    expect(markAsInProgress).toBeInTheDocument();

    // upon clicking mark as in progress when the review status changes so will the menu options
    await user.click(markAsInProgress);
    expect(
      screen.getByRole('menuitem', {
        name: 'Mark as upcoming',
      })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('menuitem', { name: 'Mark as inprogress' })
    ).not.toBeInTheDocument();
  });

  it('shows a toast message when review status change succeeds', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <>
        <Toasts />
        <AthleteReviewDetails {...props} />
      </>
    );
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });
    await user.click(screen.getAllByTestId('MoreVertIcon')[0]);
    await user.click(
      screen.getByRole('menuitem', {
        name: 'Mark as in progress',
      })
    );

    expect(
      screen.getByRole('heading', {
        name: 'Review marked as in progress',
        hidden: true,
      })
    ).toBeInTheDocument();
  });

  it('shows a toast message when review status change fails', async () => {
    server.use(
      rest.patch(
        '/athletes/:athleteId/athlete_reviews/:reviewId',
        (req, res, ctx) => res(ctx.status(500))
      )
    );

    const user = userEvent.setup();
    renderWithProviders(
      <>
        <Toasts />
        <AthleteReviewDetails {...props} />
      </>
    );
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });
    await user.click(screen.getAllByTestId('MoreVertIcon')[0]);
    await user.click(
      screen.getByRole('menuitem', {
        name: 'Mark as in progress',
        hidden: true,
      })
    );
    expect(
      screen.getByRole('heading', {
        name: 'Error editing review status',
        hidden: true,
      })
    ).toBeInTheDocument();
  });

  describe('renders the error screen', () => {
    const testServiceCallFailureHandling = () => {
      expect(screen.getByText('Something went wrong!')).toBeInTheDocument();

      expect(
        screen.getByRole('button', {
          name: 'Go back and try again',
        })
      ).toBeInTheDocument();
    };

    it('renders error if the staff api fails', async () => {
      server.use(
        rest.get('/users/staff_only', (req, res, ctx) => res(ctx.status(500)))
      );

      renderWithProviders(<AthleteReviewDetails {...props} />);
      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });
      testServiceCallFailureHandling();
    });

    it('renders error if the get review api fails', async () => {
      server.use(
        rest.get(
          '/athletes/:athleteId/athlete_reviews/:reviewId',
          (req, res, ctx) => res(ctx.status(500))
        )
      );
      renderWithProviders(<AthleteReviewDetails {...props} />);
      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });
      testServiceCallFailureHandling();
    });

    it('renders error if the dashboards api fails', async () => {
      server.use(
        rest.get('/ui/squads/:squadId/dashboards', (req, res, ctx) =>
          res(ctx.status(500))
        )
      );
      renderWithProviders(<AthleteReviewDetails {...props} />);
      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });
      testServiceCallFailureHandling();
    });
  });
  it('navigates to the correct page when clicking the edit link', async () => {
    renderWithProviders(<AthleteReviewDetails {...props} />);
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    await userEvent.click(screen.getAllByTestId('MoreVertIcon')[0]);
    await userEvent.click(screen.getByRole('menuitem', { name: /Edit/i }));

    expect(mockLocationAssign).toHaveBeenCalledWith(
      '/athletes/123/athlete_reviews/456/edit'
    );
  });
});
