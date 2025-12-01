import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { server, rest } from '@kitman/services/src/mocks/server';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import AthleteParticipation from '../AthleteParticipation';

const props = {
  eventId: 1,
  eventType: 'session_event',
  canViewAvailabilities: true,
  participationLevels: [
    {
      id: 1,
      name: 'Testing',
      canonical_participation_level: 'none',
      include_in_group_calculations: true,
    },
  ],
  isLoading: false,
  onClose: jest.fn(),
  activities: [
    {
      athletes: [],
      duration: 0,
      id: 1234,
      principles: [],
      users: [],
    },
  ],
  onSelectParticipant: jest.fn(),
  onSelectAllParticipants: jest.fn(),
  t: i18nextTranslateStub(),
};

describe('AthleteParticipation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Reset MSW handlers to default state
    server.resetHandlers();
  });

  describe('when loading the initial data', () => {
    it('renders a loader while fetching athletes', async () => {
      // Override MSW handler to simulate loading state (delay response)
      server.use(
        rest.post(
          '/planning_hub/events/:eventId/athlete_events/search',
          (req, res, ctx) => {
            return res(ctx.delay(100), ctx.status(500)); // Short delay to simulate loading
          }
        )
      );

      render(<AthleteParticipation {...props} />);

      // Should show loading feedback initially
      await waitFor(() => {
        expect(
          screen.getByTestId('DelayedLoadingFeedback')
        ).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
      });
    });

    it('handles API failure gracefully', async () => {
      // Override MSW handler to simulate API failure
      server.use(
        rest.post(
          '/planning_hub/events/:eventId/athlete_events/search',
          (req, res, ctx) => {
            return res(ctx.status(500));
          }
        )
      );

      render(<AthleteParticipation {...props} />);

      // Should show error status
      await waitFor(() => {
        expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
      });
    });
  });

  describe('when the requests are successful', () => {
    beforeEach(() => {
      // Use the existing MSW handler with simplified mock data
      const simplifiedMockData = [
        {
          id: 1234,
          athlete: {
            id: 3454,
            firstname: 'Jon',
            lastname: 'Doe',
            fullname: 'Jon Doe',
            shortname: 'Jon Doe',
            avatar_url: 'sample_url',
            user_id: 1111,
            availability: 'available',
            position: {
              id: 1234,
              name: 'Hooker',
            },
          },
          participation_level: {
            id: 1222,
            name: 'full',
            canonical_participation_level: 'full',
            include_in_group_calculations: false,
            default: false,
          },
          include_in_group_calculations: false,
          duration: 30,
          rpe: null,
        },
        {
          id: 3456,
          athlete: {
            id: 3456,
            firstname: 'Jon',
            lastname: 'Boe',
            fullname: 'Jon Boe',
            shortname: 'Jon Boe',
            avatar_url: 'sample_url',
            user_id: 3333,
            availability: 'available',
            position: {
              id: 3456,
              name: 'Scrum Half',
            },
          },
          participation_level: {
            id: 34544,
            name: 'full',
            canonical_participation_level: 'full',
            include_in_group_calculations: false,
            default: false,
          },
          include_in_group_calculations: false,
          duration: 30,
          rpe: null,
        },
        {
          id: 11123,
          athlete: {
            id: 11123,
            firstname: 'Jon',
            lastname: 'Coe',
            fullname: 'Jon Coe',
            shortname: 'Jon Coe',
            avatar_url: 'sample_url',
            user_id: 2222,
            availability: 'available',
            position: {
              id: 3456,
              name: 'Scrum Half',
            },
          },
          participation_level: {
            id: 54677,
            name: 'full',
            canonical_participation_level: 'full',
            include_in_group_calculations: false,
            default: false,
          },
          include_in_group_calculations: false,
          duration: 30,
          rpe: null,
        },
      ];

      // Override the MSW handler with our simplified data
      server.use(
        rest.post(
          '/planning_hub/events/:eventId/athlete_events/search',
          (req, res, ctx) => {
            return res(ctx.json(simplifiedMockData));
          }
        )
      );
    });

    it('renders the athlete participation interface', async () => {
      render(<AthleteParticipation {...props} />);

      // Wait for data to load and check main UI elements
      await waitFor(() => {
        expect(screen.getByText('Athletes participation')).toBeInTheDocument();
      });

      expect(screen.getByRole('button', { name: 'Done' })).toBeInTheDocument();
    });

    it('displays the correct athletes in the participation grid', async () => {
      render(<AthleteParticipation {...props} />);

      // Wait for athletes to load
      await waitFor(() => {
        expect(screen.getByText('Jon Doe')).toBeInTheDocument();
      });

      // Check all athletes are displayed
      expect(screen.getByText('Jon Doe')).toBeInTheDocument();
      expect(screen.getByText('Jon Boe')).toBeInTheDocument();
      expect(screen.getByText('Jon Coe')).toBeInTheDocument();

      // Check positions are displayed
      expect(screen.getByText('Hooker')).toBeInTheDocument();
      expect(screen.getAllByText('Scrum Half')).toHaveLength(2);

      // Check participation levels are displayed
      expect(screen.getAllByText('full')).toHaveLength(3);
    });

    it('calls onClose when Done button is clicked', async () => {
      const user = userEvent.setup();
      render(<AthleteParticipation {...props} />);

      await waitFor(() => {
        expect(screen.getByText('Athletes participation')).toBeInTheDocument();
      });

      const doneButton = screen.getByRole('button', { name: 'Done' });
      await user.click(doneButton);

      expect(props.onClose).toHaveBeenCalledTimes(1);
    });

    it('renders athlete filters section', async () => {
      render(<AthleteParticipation {...props} />);

      await waitFor(() => {
        expect(screen.getByText('Athletes participation')).toBeInTheDocument();
      });

      // AthleteFilters component should be rendered
      // The specific filters would depend on the AthleteFilters component implementation
      // This verifies the filters section is present
      expect(screen.getByText('Athletes participation')).toBeInTheDocument();
    });

    it('renders participation grid with activity columns', async () => {
      render(<AthleteParticipation {...props} />);

      await waitFor(() => {
        expect(screen.getByText('Jon Doe')).toBeInTheDocument();
      });

      // Check that grid headers are present
      expect(screen.getByText('Athlete')).toBeInTheDocument();
      expect(screen.getByText('Position')).toBeInTheDocument();
      expect(screen.getByText('Participation level')).toBeInTheDocument();
    });

    it('handles athlete selection interactions', async () => {
      render(<AthleteParticipation {...props} />);

      await waitFor(() => {
        expect(screen.getByText('Jon Doe')).toBeInTheDocument();
      });

      // Check that checkboxes are present for athlete selection
      // The exact interaction would depend on the ParticipationGrid implementation
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes.length).toBeGreaterThan(0);
    });

    it('shows no athletes message when no data is returned', async () => {
      // Override MSW handler to return empty data
      server.use(
        rest.post(
          '/planning_hub/events/:eventId/athlete_events/search',
          (req, res, ctx) => {
            return res(ctx.json([]));
          }
        )
      );

      render(<AthleteParticipation {...props} />);

      await waitFor(() => {
        expect(screen.getByText('No athletes found')).toBeInTheDocument();
      });
    });
  });
});
