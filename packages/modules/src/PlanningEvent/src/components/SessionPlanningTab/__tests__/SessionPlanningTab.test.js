import {
  render,
  screen,
  waitFor,
  within,
  fireEvent,
} from '@testing-library/react';
import {
  buildEvent,
  i18nextTranslateStub,
} from '@kitman/common/src/utils/test_utils';
import { server } from '@kitman/services/src/mocks/server';
import { rest } from 'msw';
import SessionPlanningTab from '../index';

jest.mock('@kitman/common/src/utils', () => ({
  ...jest.requireActual('@kitman/common/src/utils'),
  TrackEvent: jest.fn(),
}));

describe('<SessionPlanningTab />', () => {
  const updateEventSessionActivities = jest.fn();
  const props = {
    event: buildEvent(),
    canEditEvent: true,
    participationLevels: [
      {
        id: 1,
        name: 'Testing',
        canonical_participation_level: 'none',
        include_in_group_calculations: true,
      },
    ],
    areCoachingPrinciplesEnabled: true,
    eventSessionActivities: [
      {
        athletes: [],
        duration: null,
        id: 1,
        principles: [],
        event_activity_drill: null,
        event_activity_type: null,
        users: [],
      },
    ],
    eventSessionDataRequestStatus: true,
    isEventSessionDataLoaded: true,
    fetchEventSessionActivities: jest.fn(),
    updateEventSessionActivities,
    t: i18nextTranslateStub(),
  };

  // Mock data
  const mockedPrinciples = [
    {
      id: 1,
      name: 'First principle',
      principle_categories: [
        {
          id: 1,
          name: 'Recovery and Regeneration',
        },
      ],
      principle_types: [
        {
          id: 1,
          name: 'Technical',
        },
      ],
      phases: [],
      squads: [],
    },
    {
      id: 2,
      name: 'Second principle',
      principle_categories: [
        {
          id: 1,
          name: 'Recovery and Regeneration',
        },
      ],
      principle_types: [
        {
          id: 2,
          name: 'Tactical',
        },
      ],
      phases: [],
      squads: [],
    },
    {
      id: 3,
      name: 'Third principle',
      principle_categories: [
        {
          id: 2,
          name: 'Blocking + 1 v 1 Situations',
        },
      ],
      principle_types: [
        {
          id: 1,
          name: 'Technical',
        },
      ],
      phases: [],
      squads: [],
    },
  ];

  const mockedActivityTypes = [
    {
      id: 1,
      name: 'First activity',
    },
    {
      id: 2,
      name: 'Second activity',
    },
  ];

  const mockedAthleteEvents = [
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

  const mockedActivityDrill = {
    name: 'My First Drill',
    sets: 5,
    reps: 10,
    rest_duration: 90,
    pitch_width: 50,
    pitch_length: 50,
    notes: 'This drill will make us win game 100% of the time 2',
    diagram: null,
    attachments: [],
  };

  // Helper to mock feature flags
  const mockFeatureFlag = (flagName, value) => {
    window.getFlag = jest.fn((flag) => (flag === flagName ? value : false));
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    // Reset feature flags
    window.getFlag = jest.fn(() => false);

    // Setup MSW handlers

    server.use(
      rest.get(
        `/ui/planning_hub/events/${props.event.id}/event_activities`,
        (req, res, ctx) => {
          return res(ctx.json([props.eventSessionActivities[0]]));
        }
      ),
      rest.get('/ui/planning_hub/event_activity_types', (req, res, ctx) => {
        const currentSquad = req.url.searchParams.get('current_squad');
        if (currentSquad === 'true') {
          return res(ctx.json(mockedActivityTypes));
        }
        return res(ctx.json([]));
      }),
      rest.get('/ui/planning_hub/principle_categories', (req, res, ctx) => {
        return res(ctx.json([{ id: 1, name: 'Recovery and Regeneration' }]));
      }),
      rest.get('/ui/planning_hub/principle_types', (req, res, ctx) => {
        return res(ctx.json([{ id: 1, name: 'Technical' }]));
      }),
      rest.get('/ui/planning_hub/phases', (req, res, ctx) => {
        return res(ctx.json([{ id: 1, name: 'Attacking' }]));
      }),
      rest.post('/ui/planning_hub/principles/search', (req, res, ctx) => {
        return res(ctx.json(mockedPrinciples));
      }),
      rest.post(
        `/planning_hub/events/${props.event.id}/athlete_events/search`,
        (req, res, ctx) => {
          return res(ctx.json(mockedAthleteEvents));
        }
      ),
      rest.patch(
        `/ui/planning_hub/events/${props.event.id}/event_activities/1`,
        (req, res, ctx) => {
          return res(
            ctx.json({
              ...props.eventSessionActivities[0],
              principles: [
                {
                  id: 1,
                  name: 'First principle',
                  principle_categories: [],
                  principle_types: [{ id: 1, name: 'Technical' }],
                  phases: [],
                },
              ],
            })
          );
        }
      ),
      rest.post(
        `/ui/planning_hub/events/${props.event.id}/event_activities/1/event_activity_drills`,
        (req, res, ctx) => {
          return res(ctx.json(mockedActivityDrill));
        }
      )
    );
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    server.resetHandlers();
    delete window.getFlag;
  });

  describe('when the requests are successful', () => {
    it('renders the correct grid content', async () => {
      render(<SessionPlanningTab {...props} />);

      await waitFor(() => {
        expect(screen.queryByText('Loading')).not.toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByText('Session planning')).toBeInTheDocument();
      });
    });

    describe('when viewing the Athlete Participation', () => {
      it('shows the Athlete Participation', async () => {
        render(<SessionPlanningTab {...props} />);

        const tabHeaderDesktop = document.querySelector(
          '.planningEventGridTab__actions--desktop'
        );

        expect(tabHeaderDesktop).toBeInTheDocument();

        const athleteParticipationButton = within(tabHeaderDesktop).getByTestId(
          'athlete-participation-button'
        );

        expect(athleteParticipationButton).toBeInTheDocument();

        fireEvent.click(athleteParticipationButton);
        await waitFor(() => {
          expect(
            screen.getByText('Athletes participation')
          ).toBeInTheDocument();
        });
      });

      describe('when selecting an athlete', () => {
        beforeEach(() => {
          // Override the update endpoint to return activity with selected athlete
          server.use(
            rest.patch(
              `/ui/planning_hub/events/${props.event.id}/event_activities/1`,
              (req, res, ctx) => {
                return res(
                  ctx.json({
                    athletes: [3454],
                    duration: null,
                    id: 1,
                    principles: [],
                    event_activity_drill: null,
                    event_activity_type: null,
                    users: [],
                  })
                );
              }
            )
          );
        });

        it('populates the grid with the correct activities', async () => {
          render(<SessionPlanningTab {...props} />);

          await waitFor(() => {
            expect(screen.queryByText('Loading')).not.toBeInTheDocument();
          });

          // Click athlete participation button
          const athleteParticipationButton = screen.getByTestId(
            'athlete-participation-button'
          );
          fireEvent.click(athleteParticipationButton);

          await waitFor(() => {
            expect(
              screen.getByText('Athletes participation')
            ).toBeInTheDocument();
          });
          const participationBody = document.querySelector(
            '.participationGrid__body'
          );
          const athleteCheckbox =
            within(participationBody).getAllByRole('checkbox')[0];

          expect(athleteCheckbox).toBeInTheDocument();

          fireEvent.click(athleteCheckbox);

          await waitFor(() => {
            expect(updateEventSessionActivities).toHaveBeenCalledWith([
              {
                athletes: [3454],
                duration: null,
                id: 1,
                principles: [],
                event_activity_drill: null,
                event_activity_type: null,
                users: [],
              },
            ]);
          });
        });
      });

      describe('when selecting all athletes', () => {
        beforeEach(() => {
          server.use(
            rest.patch(
              `/ui/planning_hub/events/${props.event.id}/event_activities/1`,
              (req, res, ctx) => {
                return res(
                  ctx.json({
                    athletes: [3454, 1234, 3333],
                    duration: null,
                    id: 1,
                    principles: [],
                    event_activity_drill: null,
                    event_activity_type: null,
                    users: [],
                  })
                );
              }
            )
          );
        });

        it('populates the grid with the correct activities', async () => {
          render(<SessionPlanningTab {...props} />);

          await waitFor(() => {
            expect(screen.queryByText('Loading')).not.toBeInTheDocument();
          });

          // Click athlete participation button
          const athleteParticipationButton = screen.getByTestId(
            'athlete-participation-button'
          );
          fireEvent.click(athleteParticipationButton);

          await waitFor(() => {
            expect(
              screen.getByText('Athletes participation')
            ).toBeInTheDocument();
          });
          const participationHeaderCell = document.querySelector(
            '.participationGrid__header'
          );

          expect(participationHeaderCell).toBeInTheDocument();

          const selectAllCheckboxes = within(
            participationHeaderCell
          ).getAllByRole('checkbox');

          fireEvent.click(selectAllCheckboxes[0]);

          await waitFor(() => {
            expect(updateEventSessionActivities).toHaveBeenCalledWith([
              {
                athletes: [3454, 1234, 3333],
                duration: null,
                id: 1,
                principles: [],
                event_activity_drill: null,
                event_activity_type: null,
                users: [],
              },
            ]);
          });
        });
      });
    });

    describe('when clicking add principles button', () => {
      it('shows the add principles panel', async () => {
        render(<SessionPlanningTab {...props} />);

        await waitFor(() => {
          expect(screen.queryByText('Loading')).not.toBeInTheDocument();
        });

        const addPrinciplesButton = screen.getByTestId('add-principle-button');
        expect(addPrinciplesButton).toBeInTheDocument();

        fireEvent.click(addPrinciplesButton);

        await waitFor(() => {
          expect(
            document.querySelector('.activityPrinciplesPanel')
          ).toBeInTheDocument();
        });
      });

      it('populates the add principles panel with fetched data', async () => {
        render(<SessionPlanningTab {...props} />);

        await waitFor(() => {
          expect(screen.queryByText('Loading')).not.toBeInTheDocument();
        });

        const addPrinciplesButton = screen.getByTestId('add-principle-button');

        fireEvent.click(addPrinciplesButton);

        await waitFor(() => {
          expect(
            document.querySelector('.activityPrinciplesPanel')
          ).toBeInTheDocument();
        });

        expect(screen.getByText('First principle')).toBeInTheDocument();
        expect(screen.getByText('Second principle')).toBeInTheDocument();
        expect(screen.getByText('Third principle')).toBeInTheDocument();
      });

      describe('when filtering principles', () => {
        it('filters principles by search', async () => {
          render(<SessionPlanningTab {...props} />);

          await waitFor(() => {
            expect(screen.queryByText('Loading')).not.toBeInTheDocument();
          });

          const addPrinciplesButton = screen.getByTestId(
            'add-principle-button'
          );
          fireEvent.click(addPrinciplesButton);
          const activityPrinciplePanel = document.querySelector(
            '.activityPrinciplesPanel'
          );
          await waitFor(() => {
            expect(activityPrinciplePanel).toBeInTheDocument();
          });

          const searchInput = within(
            activityPrinciplePanel
          ).getByPlaceholderText('Search principles');
          fireEvent.change(searchInput, { target: { value: 'th' } });

          await waitFor(() => {
            expect(screen.getByText('Third principle')).toBeInTheDocument();
          });
          expect(screen.queryByText('First principle')).not.toBeInTheDocument();
        });
      });

      describe('when dragging and dropping a principle', () => {
        it('adds principle to activity', async () => {
          render(<SessionPlanningTab {...props} />);

          await waitFor(() => {
            expect(screen.queryByText('Loading')).not.toBeInTheDocument();
          });

          const addPrinciplesButton = screen.getByTestId(
            'add-principle-button'
          );
          fireEvent.click(addPrinciplesButton);

          await waitFor(() => {
            expect(
              document.querySelector('.activityPrinciplesPanel')
            ).toBeInTheDocument();
          });

          const principleItems = screen.getAllByText(/principle/i);
          expect(principleItems.length).toBeGreaterThan(0);
        });
      });
    });

    describe('when viewing the Drill Panel', () => {
      beforeEach(() => {
        mockFeatureFlag(
          'session-planning-tab-adding-drills-to-activites',
          true
        );
      });

      it('shows the panel when feature flag is enabled', async () => {
        render(<SessionPlanningTab {...props} />);

        await waitFor(() => {
          expect(screen.queryByText('Loading')).not.toBeInTheDocument();
        });

        const addDrillButton = screen.getByTestId(
          `add-activity-drill-button-${props.eventSessionActivities[0].id}`
        );

        expect(addDrillButton).toBeInTheDocument();

        fireEvent.click(addDrillButton);

        await waitFor(() => {
          expect(
            document.querySelector('.activityDrillPanel')
          ).toBeInTheDocument();
        });
      });

      it('does not show the panel when feature flag is disabled', async () => {
        mockFeatureFlag(
          'session-planning-tab-adding-drills-to-activites',
          false
        );

        render(<SessionPlanningTab {...props} />);

        await waitFor(() => {
          expect(screen.queryByText('Loading')).not.toBeInTheDocument();
        });

        const addDrillButton = screen.queryByTestId(
          `add-activity-drill-button-${props.eventSessionActivities[0].id}`
        );

        expect(addDrillButton).not.toBeInTheDocument();
      });
    });
  });

  describe('when the requests fail', () => {
    beforeEach(() => {
      // Override MSW handlers to return errors
      server.use(
        rest.get(
          `/ui/planning_hub/events/${props.event.id}/event_activities`,
          (req, res, ctx) => {
            return res(ctx.status(500), ctx.json({ error: 'Server error' }));
          }
        ),
        rest.get('/ui/planning_hub/event_activity_types', (req, res, ctx) => {
          return res(ctx.status(500), ctx.json({ error: 'Server error' }));
        })
      );
    });

    it('shows an error message', async () => {
      render(<SessionPlanningTab {...props} />);

      await waitFor(() => {
        expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
      });
    });
  });
});
