import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { rest, server } from '@kitman/services/src/mocks/server';
import GameFieldsV2 from '../GameFieldsV2';

describe('GameFieldsV2', () => {
  const mockOnUpdateEventDetails = jest.fn();
  const mockOnDataLoadingStatusChanged = jest.fn();

  const mockEventValidity = { type: 'game_event' };

  const mockEvent = {
    venue_type: {
      id: 1,
      name: 'Home',
    },
    competition: {
      competition_categories: [],
      id: 14,
      name: 'Kitman Series',
      format: null,
    },
    competition_category: null,
    opponent_squad: null,
    opponent_team: {
      id: 76,
      name: 'Australia',
    },
    organisation_format: null,
    organisation_team: null,
    organisation_fixture_rating: null,
    opponent_score: 0,
    score: 0,
    squad: {
      id: 8,
      name: 'International Squad',
      owner_id: 6,
      owner_name: 'Kitman Rugby Club',
      logo_full_path:
        'https://kitman-staging.imgix.net/kitman-stock-assets/test.png?ixlib=rails-4.2.0&fit=fill&trim=off&bg=00FFFFFF&w=100&h=100',
    },
    status: null,
    number_of_periods: 2,
    editable: true,
    fas_game_key: null,
    mls_game_key: null,
    game_event_id: null,
    disciplinary_issue: null,
    roster_submitted_by_id: null,
    match_report_submitted_by_id: null,
    id: 2209383,
    name: null,
    start_date: '2024-01-08T14:46:56Z',
    end_date: '2024-01-08T17:26:56Z',
    duration: 160,
    type: 'game_event',
    local_timezone: 'Europe/Dublin',
    surface_type: null,
    surface_quality: null,
    weather: null,
    temperature: null,
    humidity: null,
    field_condition: null,
    created_at: '2024-01-08T14:47:30Z',
    updated_at: '2024-01-08T14:47:30Z',
    workload_units: {},
    description: 'test description',
    event_collection_complete: null,
    athlete_ids: [],
    visibility_ids: [],
    custom_periods: [],
    competition_id: 1,
    custom_period_duration_enabled: false,
  };

  const mockEventWithPeriods = {
    ...mockEvent,
    custom_periods: [
      {
        absolute_duration_end: 80,
        absolute_duration_start: 0,
        duration: 80,
        name: 'Period 1',
      },
      {
        absolute_duration_end: 160,
        absolute_duration_start: 80,
        duration: 80,
        name: 'Period 2',
      },
    ],
  };

  const mockEventWithSavedPeriods = {
    ...mockEvent,
    custom_periods: [
      {
        id: 1,
        absolute_duration_end: 80,
        absolute_duration_start: 0,
        duration: 80,
        name: 'Period 1',
      },
      {
        id: 2,
        absolute_duration_end: 160,
        absolute_duration_start: 80,
        duration: 80,
        name: 'Period 2',
      },
    ],
    custom_period_duration_enabled: true,
  };

  const mockSquadData = [
    {
      label: 'International Squad',
      value: 8,
      duration: 80,
      created: '2013-10-17T16:10:14.000+01:00',
    },
  ];

  const renderComponent = (event = mockEvent) =>
    renderWithRedux(
      <GameFieldsV2
        event={event}
        eventValidity={mockEventValidity}
        onUpdateEventDetails={mockOnUpdateEventDetails}
        onDataLoadingStatusChanged={mockOnDataLoadingStatusChanged}
        squad={mockSquadData}
        t={i18nextTranslateStub()}
      />
    );

  beforeEach(() => {
    server.use(
      rest.get('/competitions', (req, res, ctx) => {
        return res(
          ctx.json([
            {
              competition_categories: [
                { id: 27, name: 'Test Competition Type' },
              ],
              squads: [
                {
                  id: 8,
                  name: 'International Squad',
                },
              ],
              teams: [],
              id: 1,
              name: 'Test Competition',
              format: null,
            },
            {
              competition_categories: [],
              squads: [
                {
                  id: 8,
                  name: 'International Squad',
                },
              ],
              teams: [],
              id: 2,
              name: 'test222',
              format: null,
            },
          ])
        );
      })
    );
  });

  describe('initial render', () => {
    it('renders the game fields firing off an event update for the default competition and competition type', async () => {
      renderComponent({ ...mockEvent, competition_id: null, id: null });
      await waitFor(() => {
        expect(mockOnDataLoadingStatusChanged).toHaveBeenCalledWith(
          'SUCCESS',
          'competition_id',
          null
        );
      });
      expect(mockOnUpdateEventDetails).toHaveBeenCalledWith({
        competition_category_id: 27,
        competition_id: 1,
      });
    });

    it('fails to render the competition dropdown if the api fails', async () => {
      server.use(
        rest.get('/venues', (req, res, ctx) => {
          return res(ctx.status(200), ctx.json({ data: [] }));
        }),
        rest.get('/competitions', (req, res, ctx) => {
          return res(ctx.status(500));
        })
      );

      renderComponent({ ...mockEvent, competition_id: null, id: null });

      await waitFor(() => {
        expect(mockOnDataLoadingStatusChanged).toHaveBeenCalledWith(
          'FAILURE',
          'competition_id',
          expect.stringContaining('Request failed with status code 500')
        );
      });
    });
  });

  describe('[Feature Flag - manually-add-opposition-name] game render', () => {
    beforeEach(() => {
      window.featureFlags = {
        'manually-add-opposition-name': true,
      };
    });

    afterEach(() => {
      window.featureFlags = {
        'manually-add-opposition-name': false,
      };
    });

    it('renders out the the custom option in the opposition dropdown', async () => {
      const user = userEvent.setup();
      renderComponent();
      await user.click(screen.getByLabelText('Opposition'));
      await user.click(screen.getByText('Custom'));
      expect(mockOnUpdateEventDetails).toHaveBeenCalledWith({ team_id: -1 });
    });

    it('renders out the custom opposition name text area and allows text to be entered', async () => {
      renderComponent({
        ...mockEvent,
        opponent_team: { id: 15, name: 'Custom Team Name', custom: true },
        team_id: 15,
        current_opposition_name: '',
      });
      await waitFor(() => {
        expect(screen.getByText('Custom Opposition Name')).toBeInTheDocument();
      });
      fireEvent.change(screen.getAllByDisplayValue('')[3], {
        target: { value: 'Test Name Updated' },
      });
      expect(mockOnUpdateEventDetails).toHaveBeenCalledWith({
        custom_opposition_name: 'Test Name Updated',
      });
    });
  });

  describe('[Feature Flag - games-custom-duration-and-additional-time] game render', () => {
    beforeEach(() => {
      window.featureFlags = {
        'games-custom-duration-and-additional-time': true,
      };
    });

    afterEach(() => {
      window.featureFlags = {
        'games-custom-duration-and-additional-time': false,
      };
    });

    it('renders out the split evenly view of the period/duration info', () => {
      renderComponent();
      expect(screen.getByDisplayValue('160')).toBeInTheDocument();
      expect(screen.getByDisplayValue('2')).toBeInTheDocument();
      expect(screen.getByText('Split Evenly')).toBeInTheDocument();
      expect(screen.getByDisplayValue('80')).toBeInTheDocument();
      expect(screen.getByText('Custom')).toBeInTheDocument();
    });

    it('clicking custom shifts it to custom period mode', async () => {
      const user = userEvent.setup();
      renderComponent();
      await user.click(screen.getByText('Custom'));
      expect(mockOnUpdateEventDetails).toHaveBeenCalledWith({
        custom_period_duration_enabled: true,
      });
    });

    it('editing a custom period duration updates the custom periods', async () => {
      renderComponent({
        ...mockEventWithPeriods,
        custom_period_duration_enabled: true,
      });
      expect(screen.getByText('Period 1')).toBeInTheDocument();
      expect(screen.getByText('Period 2')).toBeInTheDocument();
      expect(screen.getAllByDisplayValue('80').length).toEqual(2);
      fireEvent.change(screen.getAllByRole('spinbutton')[5], {
        target: { value: '40' },
      });
      fireEvent.blur(screen.getAllByRole('spinbutton')[5]);
      expect(mockOnUpdateEventDetails).toHaveBeenCalledWith({
        custom_periods: [
          {
            absolute_duration_end: 40,
            absolute_duration_start: 0,
            duration: 40,
            name: 'Period 1',
          },
          {
            absolute_duration_end: 120,
            absolute_duration_start: 40,
            duration: 80,
            name: 'Period 2',
          },
        ],
        duration: 120,
      });
    });

    it('editing the duration updates the custom periods', async () => {
      renderComponent({
        ...mockEventWithPeriods,
        custom_period_duration_enabled: true,
      });
      fireEvent.change(screen.getAllByRole('spinbutton')[3], {
        target: { value: '100' },
      });
      expect(mockOnUpdateEventDetails).toHaveBeenCalledWith({
        duration: '100',
      });
      expect(mockOnUpdateEventDetails).toHaveBeenCalledWith({
        custom_periods: [
          {
            absolute_duration_end: 50,
            absolute_duration_start: 0,
            duration: 50,
            name: 'Period 1',
          },
          {
            absolute_duration_end: '100',
            absolute_duration_start: 50,
            duration: 50,
            name: 'Period 2',
          },
        ],
      });
    });

    describe('updating game with existing periods', () => {
      it('allows the user to see the custom periods that exist', async () => {
        renderComponent(mockEventWithSavedPeriods);
        expect(screen.getByText('Period 1')).toBeInTheDocument();
        expect(screen.getByText('Period 2')).toBeInTheDocument();
        expect(screen.getAllByDisplayValue('80').length).toEqual(2);
      });

      it('allows the user to remove periods and add', async () => {
        renderComponent(mockEventWithSavedPeriods);
        fireEvent.change(screen.getAllByRole('spinbutton')[4], {
          target: { value: '1' },
        });
        expect(mockOnUpdateEventDetails).toHaveBeenCalledWith({ duration: 80 });
        expect(mockOnUpdateEventDetails).toHaveBeenCalledWith({
          custom_periods: [
            {
              absolute_duration_end: 80,
              absolute_duration_start: 0,
              delete: false,
              duration: 80,
              id: 1,
              name: 'Period 1',
            },
            {
              absolute_duration_end: 160,
              absolute_duration_start: 80,
              delete: true,
              duration: 80,
              id: 2,
              name: 'Period 2',
            },
          ],
        });
        mockOnUpdateEventDetails.mockReset();
        fireEvent.change(screen.getAllByRole('spinbutton')[4], {
          target: { value: '3' },
        });
        expect(mockOnUpdateEventDetails).toHaveBeenCalledWith({
          custom_periods: [
            {
              absolute_duration_end: 80,
              absolute_duration_start: 0,
              duration: 80,
              id: 1,
              name: 'Period 1',
            },
            {
              absolute_duration_end: 160,
              absolute_duration_start: 80,
              duration: 80,
              id: 2,
              name: 'Period 2',
            },
            {
              absolute_duration_end: 160,
              absolute_duration_start: 160,
              duration: 0,
              name: 'Period 3',
            },
          ],
          duration: 160,
        });
      });

      it('allows the user to add periods back (restore those that were marked to delete', async () => {
        const mockEventWithDeletedPeriod = {
          ...mockEventWithSavedPeriods,
          custom_periods: [
            mockEventWithSavedPeriods.custom_periods[0],
            {
              ...mockEventWithSavedPeriods.custom_periods[1],
              delete: true,
            },
          ],
        };
        renderComponent(mockEventWithDeletedPeriod);
        fireEvent.change(screen.getAllByRole('spinbutton')[4], {
          target: { value: '3' },
        });
        expect(mockOnUpdateEventDetails).toHaveBeenCalledWith({
          custom_periods: [
            {
              absolute_duration_end: 80,
              absolute_duration_start: 0,
              duration: 80,
              id: 1,
              name: 'Period 1',
            },
            {
              absolute_duration_end: 160,
              absolute_duration_start: 80,
              delete: false,
              duration: 80,
              id: 2,
              name: 'Period 2',
            },
          ],
          duration: 160,
        });
      });
    });
  });

  describe('description field', () => {
    it('should render the description field in the document', async () => {
      renderComponent(mockEvent);
      const descriptionElement = screen.getByTestId(
        'GameFields|DescriptionField'
      );
      expect(descriptionElement).toBeInTheDocument();
    });

    it('should update the description when a user types a character', async () => {
      const user = userEvent.setup();
      renderComponent(mockEvent);

      const descriptionElement = screen.getByText(mockEvent.description);

      await user.click(descriptionElement);
      await user.type(descriptionElement, '1');

      const expectedDescription = `${mockEvent.description}1`;

      expect(mockOnUpdateEventDetails).toHaveBeenCalledWith({
        description: expectedDescription,
      });
    });

    it('should allow pasting only up to 250 characters', async () => {
      const user = userEvent.setup();
      renderComponent(mockEvent);

      const descriptionElement = screen.getByText(mockEvent.description);

      const longText = '1'.repeat(260);

      await user.click(descriptionElement);
      await user.paste(longText);

      const expectedDescription = `${mockEvent.description}${longText}`.slice(
        0,
        250
      );

      expect(mockOnUpdateEventDetails).toHaveBeenCalledWith(
        expect.objectContaining({
          description: expectedDescription,
        })
      );
    });
  });
});
