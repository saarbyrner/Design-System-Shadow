import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';
import { rest, server } from '@kitman/services/src/mocks/server';
import Toasts from '@kitman/modules/src/Toasts';
import useLocationPathname from '@kitman/common/src/hooks/useLocationPathname';
import colors from '@kitman/common/src/variables/colors';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { AthleteReviewsListTranslated as AthleteReviewsList } from '..';
import { getStatusLabelsEnumLike } from '../../shared/enum-likes';

jest.mock('@kitman/common/src/hooks/useLocationPathname');

describe('AthleteReviewsList', () => {
  const props = {};

  beforeEach(() => {
    useLocationPathname.mockReturnValue('/athletes/123/athlete_reviews');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const statusLabels = getStatusLabelsEnumLike(i18nextTranslateStub());

  it('renders the header', async () => {
    renderWithProviders(<AthleteReviewsList {...props} />);

    await waitFor(() => {
      expect(
        screen.queryByTestId('DelayedLoadingFeedback')
      ).not.toBeInTheDocument();
    });

    expect(screen.getByRole('heading', { level: 5 })).toHaveTextContent(
      'Personal goals & reviews archive'
    );
  });

  describe('when the accessing the reviews of the athlete with ID 123', () => {
    it('renders the action buttons', async () => {
      renderWithProviders(<AthleteReviewsList {...props} />);

      await waitFor(() => {
        expect(
          screen.queryByTestId('DelayedLoadingFeedback')
        ).not.toBeInTheDocument();
      });

      expect(screen.getByRole('link', { name: 'New review' })).toHaveAttribute(
        'href',
        '/athletes/123/athlete_reviews/new'
      );
    });
  });

  it('renders the filters', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AthleteReviewsList {...props} />);

    await waitFor(() => {
      expect(
        screen.queryByTestId('DelayedLoadingFeedback')
      ).not.toBeInTheDocument();
    });

    const staffField = screen.getAllByLabelText('Staff')[0];
    const selectedStaffUser = 'Rod Murphy';
    await user.click(staffField);
    await user.click(
      screen.getByRole('option', {
        name: selectedStaffUser,
      })
    );

    within(staffField).getByText(selectedStaffUser);
    // closing the MUI select component
    await user.click(screen.getByRole('presentation').firstChild);

    expect(
      screen.getByRole('textbox', {
        name: 'Start',
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('textbox', {
        name: 'End',
      })
    ).toBeInTheDocument();

    const reviewType = screen.getByRole('combobox', {
      name: 'Review Type',
    });
    const reviewTypeValue = 'Test Review';
    await user.click(reviewType);
    await user.click(screen.getByRole('option', { name: reviewTypeValue }));
    expect(reviewType).toHaveValue(reviewTypeValue);

    const statusField = screen.getByRole('combobox', {
      name: 'Status',
    });
    const statusValue = 'Completed';
    await user.click(statusField);
    await user.click(screen.getByRole('option', { name: statusValue }));
    expect(statusField).toHaveValue(statusValue);
  });

  it('renders the development goals table', async () => {
    renderWithProviders(<AthleteReviewsList {...props} />);

    await waitFor(() => {
      expect(
        screen.queryByTestId('DelayedLoadingFeedback')
      ).not.toBeInTheDocument();
    });
    expect(
      screen.getByRole('row', {
        name: 'Start Date Due Date Review Type Description Staff Squad Status',
      })
    ).toBeInTheDocument();

    // Table Content
    expect(
      screen.getByRole('row', {
        name: "January 31, 2024 October 27, 2024 A review description Stuart O'Brien, Stephen Smith Completed",
      })
    ).toBeInTheDocument();
  });

  it('renders the correct color for each status', async () => {
    renderWithProviders(<AthleteReviewsList {...props} />);

    await waitFor(() => {
      expect(
        screen.queryByTestId('DelayedLoadingFeedback')
      ).not.toBeInTheDocument();
    });

    const completeStatusCell = screen.getByRole('cell', { name: 'Completed' });
    expect(completeStatusCell).toBeInTheDocument();
    expect(completeStatusCell.firstChild).toHaveStyle({
      'background-color': colors.mui_success,
    });

    const inprogressStatusCell = screen.getByRole('cell', {
      name: 'In progress',
    });
    expect(inprogressStatusCell).toBeInTheDocument();
    expect(inprogressStatusCell.firstChild).toHaveStyle({
      'background-color': colors.mui_default,
    });

    const upcomingStatusCell = screen.getByRole('cell', { name: 'Upcoming' });
    expect(upcomingStatusCell).toBeInTheDocument();
    expect(upcomingStatusCell.firstChild).toHaveStyle({
      'background-color': colors.mui_primary,
    });
  });

  it('shows the correct menu items for each reviews status', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AthleteReviewsList {...props} />);

    await waitFor(() => {
      expect(
        screen.queryByTestId('DelayedLoadingFeedback')
      ).not.toBeInTheDocument();
    });

    const menuItems = screen.getAllByTestId('MoreVertIcon');
    expect(menuItems.length).toEqual(3);

    // row 1 review status = Complete
    await user.click(menuItems[0]);
    [
      statusLabels.deleted,
      statusLabels.in_progress,
      statusLabels.upcoming,
    ].forEach((statusName) => {
      expect(
        screen.getByRole('menuitem', {
          name: `Mark as ${statusName.toLowerCase()}`,
        })
      ).toBeInTheDocument();
    });

    // row 2 review status = upcoming
    await user.click(menuItems[1]);
    [
      statusLabels.deleted,
      statusLabels.in_progress,
      statusLabels.completed,
    ].forEach((statusName) => {
      expect(
        screen.getByRole('menuitem', {
          name: `Mark as ${statusName.toLowerCase()}`,
        })
      ).toBeInTheDocument();
    });

    // row 3 review status = in_progress
    await user.click(menuItems[2]);
    [
      statusLabels.deleted,
      statusLabels.upcoming,
      statusLabels.completed,
    ].forEach((statusName) => {
      expect(
        screen.getByRole('menuitem', {
          name: `Mark as ${statusName.toLowerCase()}`,
        })
      ).toBeInTheDocument();
    });
  });

  it('renders an error if the staff service call fails', async () => {
    server.use(
      rest.get('/users/staff_only', (req, res, ctx) => res(ctx.status(500)))
    );
    renderWithProviders(<AthleteReviewsList {...props} />);

    await waitFor(() => {
      expect(
        screen.queryByTestId('DelayedLoadingFeedback')
      ).not.toBeInTheDocument();
    });

    expect(screen.getAllByText('Something went wrong!')[0]).toBeInTheDocument();
  });
  const deleteReview = async () => {
    await waitFor(() => {
      expect(
        screen.queryByTestId('DelayedLoadingFeedback')
      ).not.toBeInTheDocument();
    });

    // Click the delete button
    await userEvent.click(screen.getAllByTestId('MoreVertIcon')[0]);
    await userEvent.click(
      screen.getByRole('menuitem', { name: 'Mark as deleted' })
    );

    // Click the confirm button
    expect(screen.getByText('Delete review')).toBeInTheDocument();
    expect(
      screen.getByText('Are you sure you want to delete this review?')
    ).toBeInTheDocument();

    await userEvent.click(
      screen.getByRole('button', { name: 'Delete', hidden: true })
    );
  };

  // Delete a review

  it('shows a toast message when delete review fails', async () => {
    server.use(
      rest.patch(
        '/athletes/:athleteId/athlete_reviews/:reviewId',
        (req, res, ctx) => res(ctx.status(500))
      )
    );
    renderWithProviders(
      <>
        <Toasts />
        <AthleteReviewsList {...props} />
      </>
    );
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    await deleteReview();
    expect(
      screen.getByRole('heading', {
        name: 'Error editing review status',
        hidden: true,
      })
    ).toBeInTheDocument();
  });
});
