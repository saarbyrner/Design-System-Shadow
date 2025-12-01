import { screen } from '@testing-library/react';
import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import userEvent from '@testing-library/user-event';
import useLocationPathname from '@kitman/common/src/hooks/useLocationPathname';
import { data as mockStaffUsers } from '@kitman/services/src/mocks/handlers/medical/getStaffUsers';
import { data as athleteReviewTypes } from '@kitman/services/src/mocks/handlers/getAthleteReviewTypes';
import Header from '../Header';
import { getDefaultReviewForm } from '../../shared/utils';
import { getStatusLabelsEnumLike } from '../../shared/enum-likes';

jest.mock('@kitman/common/src/hooks/useLocationPathname');

describe('Header', () => {
  const props = {
    form: {
      ...getDefaultReviewForm(),
      attached_links: [
        {
          id: 1,
          uri: 'tester/athleteReview/1',
          title: 'Five Star Frog Splash',
        },
      ],
      athlete_review_type_id: 1,
      start_date: '2020-12-31T12:03:00+00:00',
      end_date: '2021-12-31T12:03:00+00:00',
      user_ids: [1236, 1239],
      review_description: 'Review Description',
      review_note: 'Review Note',
      development_goals: [
        {
          athlete: {
            fullname: 'Wilt Chamberlain',
            avatar_url: '/avatar.jpg',
            date_of_birth: '1995-05-10',
            position: { name: 'Forward' },
          },
        },
      ],
    },
    squad_name: 'First Squad',
    staffUsers: mockStaffUsers,
    athleteReviewTypes,
    t: i18nextTranslateStub(),
  };
  const downloadBtnLabel = 'Download';
  const backBtnLabel = 'Athlete reviews';

  beforeEach(() => {
    useLocationPathname.mockReturnValue('/athletes/123/athlete_reviews');
    window.featureFlags = {
      'athlete-profile-goals-and-reviews': true,
    };
  });

  afterEach(() => {
    window.featureFlags = {};
  });

  it('renders', async () => {
    renderWithProviders(<Header {...props} />);
    const downloadBtn = screen.getByRole('button', {
      name: downloadBtnLabel,
    });
    expect(downloadBtn).toBeInTheDocument();
    const backBtn = screen.getByRole('link', {
      name: backBtnLabel,
    });
    expect(backBtn).toHaveAttribute('href', '/athletes/123/athlete_reviews');

    const athleteNames = await screen.findAllByText('Wilt Chamberlain');
    expect(athleteNames[0]).toBeInTheDocument();
    expect(athleteNames[1]).toBeInTheDocument();
    expect(
      screen.getByText(
        "Dec 31, 2020 - Dec 31, 2021 | Stuart O'Brien, Stephen Smith"
      )
    ).toBeInTheDocument();

    const reviewDescriptionElements = screen.getAllByText('Review Description');
    expect(reviewDescriptionElements[0]).toBeInTheDocument();
    expect(reviewDescriptionElements[1]).toBeInTheDocument();

    expect(
      screen.getByRole('link', {
        name: 'Self Assessment - Five Star Frog Splash',
      })
    ).toBeInTheDocument();
  });

  it('should render athlete details when isGoalsAndReviewsEnabled is true', async () => {
    renderWithProviders(<Header {...props} />);
    const athleteNames = await screen.findAllByText('Wilt Chamberlain');
    expect(athleteNames[0]).toBeInTheDocument();
    expect(athleteNames[1]).toBeInTheDocument();
    const athletePositions = await screen.findAllByText('Forward');
    expect(athletePositions[0]).toBeInTheDocument();
    expect(athletePositions[1]).toBeInTheDocument();
    expect(screen.getByText('DoB')).toBeInTheDocument();
    expect(screen.getByText('1995-05-10')).toBeInTheDocument();
    expect(screen.getByText('Positions')).toBeInTheDocument();
  });

  it('renders the review note if FF athlete-profile-goals-and-reviews is enabled', async () => {
    window.featureFlags = {
      'athlete-profile-goals-and-reviews': true,
    };

    renderWithProviders(<Header {...props} />);
    const downloadBtn = screen.getByRole('button', {
      name: downloadBtnLabel,
    });
    expect(downloadBtn).toBeInTheDocument();
    const backBtn = screen.getByRole('link', {
      name: backBtnLabel,
    });
    expect(backBtn).toHaveAttribute('href', '/athletes/123/athlete_reviews');

    const athleteNames = await screen.findAllByText('Wilt Chamberlain');
    expect(athleteNames[0]).toBeInTheDocument();
    expect(athleteNames[1]).toBeInTheDocument();

    expect(
      screen.getByText(
        "Dec 31, 2020 - Dec 31, 2021 | Stuart O'Brien, Stephen Smith"
      )
    ).toBeInTheDocument();

    const reviewDescriptionElements = screen.getAllByText('Review Description');
    expect(reviewDescriptionElements[0]).toBeInTheDocument();
    expect(reviewDescriptionElements[1]).toBeInTheDocument();

    expect(
      screen.getByRole('link', {
        name: 'Self Assessment - Five Star Frog Splash',
      })
    ).toBeInTheDocument();
  });

  describe('download button on click', () => {
    const windowLocation = window.location;

    beforeEach(() => {
      delete window.location;
      window.location = { ...windowLocation, assign: jest.fn() };
      window.featureFlags = { 'athlete-profile-goals-and-reviews': false };
    });

    afterEach(() => {
      window.location = windowLocation;
      window.featureFlags = {};
    });

    it('clicking the download button fires off an api call to request the PDF to be downloaded', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Header {...props} />);

      const downloadBtn = screen.getByRole('button', {
        name: downloadBtnLabel,
      });
      await user.click(downloadBtn);
      expect(window.location.href).toEqual(
        '/athletes/123/athlete_reviews/0/export.pdf'
      );
    });
  });

  describe('renders the correct menu items', () => {
    const statusLabels = getStatusLabelsEnumLike(i18nextTranslateStub());
    const reviewStatuses = [
      statusLabels.completed,
      statusLabels.deleted,
      statusLabels.in_progress,
      statusLabels.upcoming,
    ];
    test.each(reviewStatuses)(
      'shows the correct sub menu options when review status is %s',
      async (status) => {
        const user = userEvent.setup();
        renderWithProviders(
          <Header {...props} form={{ ...props.form, review_status: status }} />
        );
        await user.click(screen.getByTestId('MoreVertIcon'));

        // all options should show in the menu bar the current status
        // therefore we are splicing that item
        const reviewStatusesCopy = reviewStatuses.splice();
        const currentStatusIndex = reviewStatusesCopy.indexOf(status);
        reviewStatusesCopy.splice(currentStatusIndex, 1);

        reviewStatusesCopy.forEach((statusName) => {
          expect(
            screen.getByRole('menuitem', {
              name: `Mark as ${statusName.toLowerCase()}`,
            })
          ).toBeInTheDocument();
        });
      }
    );
  });
});
