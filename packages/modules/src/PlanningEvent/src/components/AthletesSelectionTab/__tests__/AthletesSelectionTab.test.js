import * as redux from 'react-redux';
import {
  render,
  screen,
  within,
  waitFor,
  fireEvent,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ResizeObserverPolyfill from 'resize-observer-polyfill';
import { VirtuosoMockContext } from 'react-virtuoso';
import { Provider } from 'react-redux';
import selectEvent from 'react-select-event';

import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { server, rest } from '@kitman/services/src/mocks/server';
import { axios } from '@kitman/common/src/utils/services';
import { PlanningEventContextProvider } from '@kitman/modules/src/PlanningEvent/src/contexts';
import { data as athleteEvents } from '@kitman/services/src/mocks/handlers/planning/getAthleteEvents';
import { getAthleteEventsSortingOptions } from '@kitman/services/src/services/planning';
import { setupStore } from '@kitman/modules/src/AppRoot/store';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import PreferenceContext from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';
import { ClubPhysicianDMRRequiredRole } from '@kitman/modules/src/PlanningEvent/src/hooks/useUpdateDmrStatus';
import { MockedPermissionContextProvider } from '@kitman/common/src/contexts/PermissionsContext/__tests__/testUtils';

import AthletesSelectionTab from '../index';
import { getSortingOptionLabel } from '../utils';

jest.mock(
  '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/athleteEventApi',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/athleteEventApi'
    ),
    useUpdateAthleteEventsMutation: () => [
      'updateAthleteEvents',
      { isSuccess: true, isError: false },
    ],
  })
);

const evalCorrectDataDisplayInTable = async () => {
  await waitFor(() =>
    expect(screen.queryByText('Loading')).not.toBeInTheDocument()
  );
  const athleteFormatters = screen.getAllByTestId('athleteFormatter');
  expect(athleteFormatters).toHaveLength(4);

  const athlete1 = athleteFormatters[0];
  expect(within(athlete1).getByRole('img', { name: 'DA' })).toHaveAttribute(
    'src',
    'https://kitman-staging.imgix.net/avatar.jpg?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&w=100'
  );
  expect(within(athlete1).getByText('Daniel Athlete Athlete')).toHaveAttribute(
    'href',
    '/medical/athletes/80524'
  );

  expect(
    within(
      screen.getByRole('row', {
        name: 'DA Daniel Athlete Athlete Loose-head Prop unavailable Full In Out Out',
      })
    ).getByText('unavailable')
  ).toBeInTheDocument();

  const athlete2 = athleteFormatters[1];
  expect(within(athlete2).getByRole('img', { name: 'TA' })).toHaveAttribute(
    'src',
    'https://kitman-staging.imgix.net/avatar.jpg?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&w=100'
  );
  expect(within(athlete2).getByText('Test Athlete')).toHaveAttribute(
    'href',
    '/medical/athletes/78041'
  );

  expect(
    within(
      screen.getByRole('row', {
        name: 'TA Test Athlete Loose-head Prop unavailable Modified Out Out Out',
      })
    ).getByText('unavailable')
  ).toBeInTheDocument();

  const participationFormatter = screen.getAllByTestId(
    'participationFormatter'
  );
  expect(
    within(participationFormatter[0]).getByText('Full')
  ).toBeInTheDocument();

  expect(
    within(participationFormatter[1]).getByText('Modified')
  ).toBeInTheDocument();

  expect(
    within(participationFormatter[2]).getByText(
      'Modified - Injury - Ankle Fracture (Left)'
    )
  ).toBeInTheDocument();
};

describe('<AthletesSelectionTab />', () => {
  const { ResizeObserver } = window;

  const mockedAthleteEvents = [
    {
      id: 1,
      rating: null,
      athlete: {
        id: 2,
        user_id: 2,
        firstname: 'Harry',
        lastname: 'Doe',
        fullname: 'Harry Doe',
        shortname: 'J. Doe',
        availability: 'unavailable',
        avatar_url: 'avatar_url',
        squad_name: 'Squad 1',
        squad_number: 18,
        position: {
          id: 1,
          name: 'Forward',
          abbreviation: 'FW',
          order: 0,
          position_group: {
            id: 1,
            name: 'Forwards',
            order: 0,
          },
        },
      },
    },
    {
      id: 2,
      rating: null,
      athlete: {
        id: 3,
        user_id: 3,
        firstname: 'Michael',
        lastname: 'Yao',
        fullname: 'Michael Yao',
        shortname: 'M. Yao',
        availability: 'injured',
        avatar_url: 'avatar_url',
        squad_name: 'Squad 1',
        squad_number: -1,
        position: {
          id: 3,
          name: 'Midfielder',
          abbreviation: 'HB',
          order: 0,
          position_group: {
            id: 2,
            name: 'Midfielders',
            order: 1,
          },
        },
      },
    },
  ];

  const defaultStore = {
    planningEvent: {
      athleteEvents: { apiAthleteEvents: mockedAthleteEvents },
      eventPeriods: {
        localEventPeriods: [
          {
            id: 1,
            absolute_duration_start: 0,
            absolute_duration_end: 90,
            duration: 90,
            name: 'Period 1',
          },
        ],
      },
      gameActivities: {
        localGameActivities: [
          {
            kind: 'formation_change',
            absolute_minute: 0,
            relation: { number_of_players: 11 },
          },
        ],
      },
    },
  };

  const props = {
    requestStatus: 'SUCCESS',
    event: { id: 1, roster_submitted_by_club: false },
    leagueEvent: {},
    eventSessionActivities: [
      {
        athletes: [],
        duration: null,
        id: 1,
        principles: [],
        event_activity_drill: {
          name: '4x4',
        },
        event_activity_type: {
          id: 2,
          name: 'Warm Up',
          squads: [{ id: 8, name: 'International Squad' }],
        },
        users: [],
      },
      {
        athletes: [],
        duration: null,
        id: 2,
        principles: [],
        event_activity_drill: {
          name: 'Cardio',
        },
        event_activity_type: {
          id: 2,
          name: 'Training',
          squads: [{ id: 8, name: 'International Squad' }],
        },
        users: [],
      },
    ],
    participationLevels: [
      {
        id: 3865,
        name: 'Full',
        canonical_participation_level: 'full',
      },
      {
        id: 3866,
        name: 'Modified',
      },
      {
        id: 3867,
        name: 'Partial',
      },
      {
        id: 3868,
        name: 'No Participation',
        canonical_participation_level: 'none',
      },
    ],
    participationLevelReasons: [
      {
        id: 1,
        label: 'Injury',
        value: 1,
        requireIssue: true,
      },
      {
        id: 2,
        label: 'Rest-non-injury',
        value: 2,
        requireIssue: false,
      },
      {
        id: 3,
        label: 'Inactive',
        value: 3,
        require_issue: false,
      },
    ],
    isGameEventSelectionEnabled: false,
    toastAction: jest.fn(),
    onSaveParticipantsSuccess: jest.fn(),
    onUpdateEvent: jest.fn(),
    onUpdateLeagueEvent: jest.fn(),
    t: i18nextTranslateStub(),
  };

  const eventSessionActivitiesWithAthletes = [
    {
      duration: null,
      id: 10,
      principles: [],
      event_activity_drill: {
        name: '4x4',
      },
      event_activity_type: {
        id: 2,
        name: 'Warm Up',
        squads: [{ id: 8, name: 'International Squad' }],
      },
      users: [],
      order_label: '01A',
    },
    {
      duration: null,
      id: 9,
      principles: [],
      event_activity_drill: {
        name: 'Cardio',
      },
      event_activity_type: {
        id: 2,
        name: 'Training',
        squads: [{ id: 8, name: 'International Squad' }],
      },
      users: [],
      order_label: '01B',
    },
    {
      athletes: [],
      duration: null,
      id: 11,
      principles: [],
      event_activity_drill: {
        name: 'Stair Master',
      },
      event_activity_type: {
        id: 2,
        name: 'Training',
        squads: [{ id: 8, name: 'International Squad' }],
      },
      users: [],
      order_label: '02A',
    },
  ];

  const componentRender = (
    planningEventContextProviderValue,
    mockProps = props
  ) =>
    render(
      <Provider store={setupStore(defaultStore)}>
        <VirtuosoMockContext.Provider
          value={{ viewportHeight: 2000, itemHeight: 50 }}
        >
          <PlanningEventContextProvider
            value={planningEventContextProviderValue}
          >
            <AthletesSelectionTab {...mockProps} />
          </PlanningEventContextProvider>
        </VirtuosoMockContext.Provider>
      </Provider>
    );

  let useDispatchSpy;
  let mockDispatch;

  beforeEach(() => {
    delete window.ResizeObserver;
    window.ResizeObserver = ResizeObserverPolyfill;
    window.HTMLElement.prototype.getBoundingClientRect = jest.fn(() => ({
      width: 1000,
      height: 1000,
    }));

    useDispatchSpy = jest.spyOn(redux, 'useDispatch');
    mockDispatch = jest.fn();
    useDispatchSpy.mockReturnValue(mockDispatch);
    window.setFlag('session-type-favourite', true);
  });

  afterEach(() => {
    window.ResizeObserver = ResizeObserver;
    jest.resetAllMocks();
  });

  describe('<ReactDataGrid />', () => {
    const planningEventContextProviderValue = {
      dispatch: jest.fn(),
      athleteEvents: athleteEvents.athlete_events,
      selectionHeadersSummaryState: [{ test: 'test' }],
    };

    beforeEach(() => {
      // Otherwise tests will fail.
      // https://github.com/jsdom/jsdom/issues/1695#issuecomment-559095940
      window.HTMLElement.prototype.scrollIntoView = jest.fn();

      server.use(
        rest.post(
          '/planning_hub/events/:eventId/athlete_events/paginated',
          (req, res, ctx) =>
            res(
              ctx.json({
                athlete_events: athleteEvents.athlete_events.slice(0, 4),
              })
            )
        )
      );
    });

    it('has correct number of rows and columns', async () => {
      componentRender(planningEventContextProviderValue);
      await waitFor(() =>
        expect(screen.queryByText('Loading')).not.toBeInTheDocument()
      );
      expect(screen.getAllByRole('columnheader')).toHaveLength(7);
      expect(screen.getAllByRole('row')).toHaveLength(6);
    });

    it('has the correct summary headers', async () => {
      componentRender(planningEventContextProviderValue, {
        ...props,
        eventSessionActivities: eventSessionActivitiesWithAthletes,
      });
      await waitFor(() =>
        expect(screen.queryByText('Loading')).not.toBeInTheDocument()
      );
      expect(
        within(
          screen.getByRole('row', {
            name: 'DA Daniel Athlete Athlete Loose-head Prop unavailable Full In In In Out',
          })
        ).getByText('unavailable')
      ).toBeInTheDocument();
      const summaryRow = screen.getAllByRole('row')[1];
      expect(within(summaryRow).getAllByRole('checkbox')).toHaveLength(3);

      expect(within(summaryRow).getAllByRole('checkbox')[0]).toBeChecked();
      expect(within(summaryRow).getByText('01A')).toBeInTheDocument();
      expect(within(summaryRow).getByText('1 / 1')).toBeInTheDocument();

      expect(
        within(summaryRow).getAllByRole('checkbox')[1]
      ).toBePartiallyChecked();
      expect(within(summaryRow).getByText('01B')).toBeInTheDocument();
      expect(within(summaryRow).getByText('1 / 2')).toBeInTheDocument();

      expect(
        within(summaryRow).getAllByRole('checkbox')[2]
      ).not.toBePartiallyChecked();
      expect(within(summaryRow).getAllByRole('checkbox')[2]).not.toBeChecked();
      expect(within(summaryRow).getByText('02A')).toBeInTheDocument();
      expect(within(summaryRow).getByText('0 / 1')).toBeInTheDocument();
    });

    it('correctly updates header summary value', async () => {
      const user = userEvent.setup();
      componentRender(planningEventContextProviderValue, {
        ...props,
        eventSessionActivities: eventSessionActivitiesWithAthletes,
      });
      await waitFor(() =>
        expect(screen.queryByText('Loading')).not.toBeInTheDocument()
      );
      expect(
        within(
          screen.getByRole('row', {
            name: 'DA Daniel Athlete Athlete Loose-head Prop unavailable Full In In In Out',
          })
        ).getByText('unavailable')
      ).toBeInTheDocument();
      const summaryRow = screen.getAllByRole('row')[1];
      expect(within(summaryRow).getAllByRole('checkbox')).toHaveLength(3);
      expect(within(summaryRow).getAllByRole('checkbox')[0]).toBeChecked();

      const row = screen.getAllByRole('row')[2];
      const toggle = within(row).getAllByRole('switch')[1];

      expect(toggle).toBeChecked();
      await user.click(toggle);
      expect(toggle).not.toBeChecked();
      expect(
        within(summaryRow).getAllByRole('checkbox')[0]
      ).toBePartiallyChecked();
    });

    it('correctly updates values when header value clicked', async () => {
      const user = userEvent.setup();
      componentRender(planningEventContextProviderValue);
      await waitFor(() =>
        expect(screen.queryByText('Loading')).not.toBeInTheDocument()
      );
      expect(
        within(
          screen.getByRole('row', {
            name: 'DA Daniel Athlete Athlete Loose-head Prop unavailable Full In Out Out',
          })
        ).getByText('unavailable')
      ).toBeInTheDocument();
      const summaryRow = screen.getAllByRole('row')[1];
      expect(within(summaryRow).getAllByRole('checkbox')).toHaveLength(2);
      const checkbox = within(summaryRow).getAllByRole('checkbox')[0];
      expect(checkbox).not.toBeChecked();

      const allDisplayRows = screen.getAllByRole('row').slice(2);
      // eslint-disable-next-line no-restricted-syntax
      for (const displayRowBeforeClick of allDisplayRows) {
        const rowsToggles = within(displayRowBeforeClick)
          .getAllByRole('switch')
          .slice(1);
        expect(rowsToggles[0]).not.toBeChecked();
        expect(rowsToggles[1]).not.toBeChecked();
      }

      // click checkbox in summary row one
      await user.click(checkbox);
      expect(checkbox).toBeChecked();

      /* eslint-disable-next-line no-restricted-syntax */
      for (const displayRowAfterClick of allDisplayRows) {
        const rowCheckBox = within(displayRowAfterClick).getByRole('checkbox');
        expect(rowCheckBox).toBePartiallyChecked();
        const rowsToggles = within(displayRowAfterClick)
          .getAllByRole('switch')
          .slice(1);
        expect(rowsToggles[0]).toBeChecked();
        expect(rowsToggles[1]).not.toBeChecked();
      }
    });

    // eslint-disable-next-line jest/expect-expect
    it('shows correct data for each row', async () => {
      componentRender(planningEventContextProviderValue);
      await evalCorrectDataDisplayInTable();
    });

    describe('when feature flag ‘group-by-athlete-selection-sessions’ is on', () => {
      beforeEach(() => {
        window.setFlag('group-by-athlete-selection-sessions', true);
      });

      afterEach(() => {
        window.setFlag('group-by-athlete-selection-sessions', false);
      });

      it('displays sorting options', async () => {
        componentRender(planningEventContextProviderValue);
        await waitFor(() =>
          expect(screen.queryByText('Loading')).not.toBeInTheDocument()
        );

        expect(
          screen.getByText(
            getSortingOptionLabel(
              getAthleteEventsSortingOptions.Position,
              i18nextTranslateStub()
            )
          )
        ).toBeInTheDocument();
      });
    });

    describe('when feature flag ‘group-by-athlete-selection-sessions’ is off', () => {
      it('doesn’t display sorting options', async () => {
        componentRender(planningEventContextProviderValue);
        await waitFor(() =>
          expect(screen.queryByText('Loading')).not.toBeInTheDocument()
        );

        expect(
          screen.queryByText(
            getSortingOptionLabel(
              getAthleteEventsSortingOptions.Position,
              i18nextTranslateStub()
            )
          )
        ).not.toBeInTheDocument();
      });
    });

    describe('when feature flag ‘pac-sessions-athlete-selection-position-group-in-filter’ is on', () => {
      beforeEach(() => {
        window.setFlag(
          'pac-sessions-athlete-selection-position-group-in-filter',
          true
        );
      });

      afterEach(() => {
        window.setFlag(
          'pac-sessions-athlete-selection-position-group-in-filter',
          false
        );
      });

      it('displays sorting options', async () => {
        const user = userEvent.setup();
        componentRender(planningEventContextProviderValue);

        await waitFor(() =>
          expect(screen.queryByText('Loading')).not.toBeInTheDocument()
        );

        await user.click(screen.getByText('Position'));

        [
          ...screen.getAllByText('Select All'),
          ...screen.getAllByText('Clear'),
        ].forEach((button) => expect(button).toBeInTheDocument());
      });
    });

    describe('when feature flag ‘pac-sessions-athlete-selection-position-group-in-filter’ is off', () => {
      it('displays sorting options', async () => {
        const user = userEvent.setup();
        componentRender(planningEventContextProviderValue);

        await waitFor(() =>
          expect(screen.queryByText('Loading')).not.toBeInTheDocument()
        );

        await user.click(screen.getByText('Position'));

        [
          ...screen.queryAllByText('Select All'),
          ...screen.queryAllByText('Clear'),
        ].forEach((button) => expect(button).not.toBeInTheDocument());
      });
    });

    describe('activity togglers', () => {
      beforeEach(() => {
        // Otherwise tests will fail.
        // https://github.com/jsdom/jsdom/issues/1695#issuecomment-559095940
        window.HTMLElement.prototype.scrollIntoView = jest.fn();
      });

      it('can toggle an activity', async () => {
        const user = userEvent.setup();
        componentRender(planningEventContextProviderValue);
        await waitFor(() =>
          expect(screen.queryByText('Loading')).not.toBeInTheDocument()
        );
        // Take the second row because the first one is the header.
        const row = screen.getAllByRole('row')[2];
        const toggle = within(row).getAllByRole('switch')[1];

        expect(toggle).not.toBeChecked();
        await user.click(toggle);
        expect(toggle).toBeChecked();
      });

      it('can toggle multiple activities', async () => {
        const user = userEvent.setup();
        componentRender(planningEventContextProviderValue);
        await waitFor(() =>
          expect(screen.queryByText('Loading')).not.toBeInTheDocument()
        );
        // Take the second row because the first one is the header.
        const row = screen.getAllByRole('row')[2];
        const toggles = within(row).getAllByRole('switch').slice(1);

        toggles.forEach((toggle) => expect(toggle).not.toBeChecked());
        /* eslint-disable-next-line no-restricted-syntax */
        for (const toggle of toggles) {
          /* eslint-disable-next-line no-await-in-loop */
          await user.click(toggle);
          /* eslint-disable-next-line no-await-in-loop */
          await waitFor(() => expect(toggle).toBeChecked());
        }
      });

      describe('bulk toggle', () => {
        it('can toggle all activities in a row', async () => {
          const user = userEvent.setup();
          componentRender(planningEventContextProviderValue);
          await waitFor(() =>
            expect(screen.queryByText('Loading')).not.toBeInTheDocument()
          );
          // Take the third row because the first one is the header second one is mixed between checked and not checked.
          const row = screen.getAllByRole('row')[3];
          const bulkToggle = within(row).getByRole('checkbox');
          const toggles = within(row).getAllByRole('switch');

          toggles.forEach((toggle) => expect(toggle).not.toBeChecked());

          expect(bulkToggle).not.toBeChecked();
          await user.click(bulkToggle);
          await waitFor(() => expect(bulkToggle).toBeChecked());

          /* eslint-disable-next-line no-restricted-syntax */
          for (const toggle of toggles) {
            /* eslint-disable-next-line no-await-in-loop */
            await waitFor(() => expect(toggle).toBeChecked());
          }
        });

        describe('if all activities are selected', () => {
          it('de-selects all activities', async () => {
            const user = userEvent.setup();
            componentRender(planningEventContextProviderValue);
            await waitFor(() =>
              expect(screen.queryByText('Loading')).not.toBeInTheDocument()
            );
            // Take the third row because the first one is the header second one is mixed between checked and not checked.
            const row = screen.getAllByRole('row')[3];
            const bulkToggle = within(row).getByRole('checkbox');
            const toggles = within(row).getAllByRole('switch');

            toggles.forEach((toggle) => expect(toggle).not.toBeChecked());
            /* eslint-disable-next-line no-restricted-syntax */
            for (const toggle of toggles) {
              /* eslint-disable-next-line no-await-in-loop */
              await user.click(toggle);
              /* eslint-disable-next-line no-await-in-loop */
              await waitFor(() => expect(toggle).toBeChecked());
            }

            expect(bulkToggle).toBeChecked();
            await user.click(bulkToggle);
            await waitFor(() => expect(bulkToggle).not.toBeChecked());

            /* eslint-disable-next-line no-restricted-syntax */
            for (const toggle of toggles) {
              /* eslint-disable-next-line no-await-in-loop */
              await waitFor(() => expect(toggle).not.toBeChecked());
            }
          });
        });

        describe('if all activities are de-selected', () => {
          it('selects all activities', async () => {
            const user = userEvent.setup();
            componentRender(planningEventContextProviderValue);
            await waitFor(() =>
              expect(screen.queryByText('Loading')).not.toBeInTheDocument()
            );
            // Take the third row because the first one is the header second one is mixed between checked and not checked.
            const row = screen.getAllByRole('row')[3];
            const bulkToggle = within(row).getByRole('checkbox');

            expect(bulkToggle).not.toBeChecked();
            await user.click(bulkToggle);
            await waitFor(() => expect(bulkToggle).toBeChecked());

            /* eslint-disable-next-line no-restricted-syntax */
            for (const toggle of within(row).getAllByRole('switch')) {
              /* eslint-disable-next-line no-await-in-loop */
              await waitFor(() => expect(toggle).toBeChecked());
            }
          });
        });

        describe('if at least one activity is selected', () => {
          it('selects all activities', async () => {
            const user = userEvent.setup();
            componentRender(planningEventContextProviderValue);
            await waitFor(() =>
              expect(screen.queryByText('Loading')).not.toBeInTheDocument()
            );
            // Take the second row because the first one is the header.
            const row = screen.getAllByRole('row')[2];
            const bulkToggle = within(row).getByRole('checkbox');
            const toggles = within(row).getAllByRole('switch').slice(1);
            toggles.forEach((toggle) => expect(toggle).not.toBeChecked());
            const firstToggle = toggles[0];
            await user.click(firstToggle);
            await waitFor(() => expect(firstToggle).toBeChecked());

            expect(bulkToggle).not.toBeChecked();
            await user.click(bulkToggle);
            await waitFor(() => expect(bulkToggle).toBeChecked());

            /* eslint-disable-next-line no-restricted-syntax */
            for (const toggle of toggles) {
              /* eslint-disable-next-line no-await-in-loop */
              await waitFor(() => expect(toggle).toBeChecked());
            }
          });
        });
      });
    });

    describe('Participation Select values', () => {
      beforeEach(() => {
        // Otherwise tests will fail.
        // https://github.com/jsdom/jsdom/issues/1695#issuecomment-559095940
        window.HTMLElement.prototype.scrollIntoView = jest.fn();
      });

      it('can select participation level with no injury', async () => {
        componentRender(planningEventContextProviderValue);
        await waitFor(() =>
          expect(screen.queryByText('Loading')).not.toBeInTheDocument()
        );

        const participationFormatter = screen.getAllByTestId(
          'participationFormatter'
        );
        const select = within(participationFormatter[0]).getByTestId(
          'selectInput'
        );
        expect(
          within(participationFormatter[2]).getByText(
            'Modified - Injury - Ankle Fracture (Left)'
          )
        ).toBeInTheDocument();

        await userEvent.click(select);
        // test all options are available in the select
        expect(screen.getByText('Modified - Injury')).toBeInTheDocument();
        expect(screen.getByText('Modified - Inactive')).toBeInTheDocument();
        expect(
          screen.getByText('Modified - Rest-non-injury')
        ).toBeInTheDocument();

        expect(screen.getByText('Partial')).toBeInTheDocument();
        expect(screen.getByText('Partial - Injury')).toBeInTheDocument();
        expect(screen.getByText('Partial - Inactive')).toBeInTheDocument();
        expect(
          screen.getByText('Partial - Rest-non-injury')
        ).toBeInTheDocument();
        expect(screen.getByText('No Participation')).toBeInTheDocument();
        expect(
          screen.getByText('No Participation - Injury')
        ).toBeInTheDocument();
        expect(
          screen.getByText('No Participation - Inactive')
        ).toBeInTheDocument();

        // open up submenu and select an injury
        await userEvent.click(screen.getByText('No Participation'));
        expect(
          within(participationFormatter[0]).getByText('No Participation')
        ).toBeInTheDocument();
      });

      it('can select participation level and reason with no injury', async () => {
        componentRender(planningEventContextProviderValue);
        await waitFor(() =>
          expect(screen.queryByText('Loading')).not.toBeInTheDocument()
        );

        const participationFormatter = screen.getAllByTestId(
          'participationFormatter'
        );
        const select = within(participationFormatter[0]).getByTestId(
          'selectInput'
        );
        expect(
          within(participationFormatter[0]).getByText('Full')
        ).toBeInTheDocument();
        await userEvent.click(select);

        expect(screen.getByText('Modified - Injury')).toBeInTheDocument();
        await userEvent.click(
          screen.getAllByText('No Participation - Rest-non-injury')[0]
        );

        expect(
          within(participationFormatter[0]).getByText(
            'No Participation - Rest-non-injury'
          )
        ).toBeInTheDocument();
      });

      it('can select participation level with injury', async () => {
        componentRender(planningEventContextProviderValue);
        await waitFor(() =>
          expect(screen.queryByText('Loading')).not.toBeInTheDocument()
        );

        const participationFormatter = screen.getAllByTestId(
          'participationFormatter'
        );
        const select = within(participationFormatter[0]).getByTestId(
          'selectInput'
        );
        expect(
          within(participationFormatter[0]).getByText('Full')
        ).toBeInTheDocument();

        await userEvent.click(select);
        // test all options are available in the select
        expect(screen.getByText('Modified - Injury')).toBeInTheDocument();
        expect(screen.getByText('Modified - Inactive')).toBeInTheDocument();
        expect(
          screen.getByText('Modified - Rest-non-injury')
        ).toBeInTheDocument();

        expect(screen.getByText('Partial')).toBeInTheDocument();
        expect(screen.getByText('Partial - Injury')).toBeInTheDocument();
        expect(screen.getByText('Partial - Inactive')).toBeInTheDocument();
        expect(
          screen.getByText('Partial - Rest-non-injury')
        ).toBeInTheDocument();
        expect(screen.getByText('No Participation')).toBeInTheDocument();
        expect(
          screen.getByText('No Participation - Injury')
        ).toBeInTheDocument();
        expect(
          screen.getByText('No Participation - Inactive')
        ).toBeInTheDocument();

        // open up submenu and select an injury
        await userEvent.click(screen.getByText('No Participation - Injury'));
        expect(
          screen.getByText('Fracture tibia and fibula at ankle joint - [Right]')
        ).toBeInTheDocument();

        await userEvent.click(
          screen.getByText('Fracture tibia and fibula at ankle joint - [Right]')
        );
        await waitFor(
          () =>
            expect(
              within(participationFormatter[0]).getByText(
                'No Participation - Injury - Fracture tibia and fibula at ankle joint - [Right]'
              )
            ).toBeInTheDocument(),
          { timeout: 6000 }
        );
      });

      it('can de-select participation level injury', async () => {
        componentRender(planningEventContextProviderValue);

        const participationFormatter = await screen.findAllByTestId(
          'participationFormatter'
        );
        const select = within(participationFormatter[2]).getByTestId(
          'selectInput'
        );
        expect(
          within(participationFormatter[2]).getByText(
            'Modified - Injury - Ankle Fracture (Left)'
          )
        ).toBeInTheDocument();

        await userEvent.click(select);

        await userEvent.click(screen.getByText('Modified - Injury'));

        expect(screen.getAllByText('Ankle Fracture (Left)')).toHaveLength(2);

        await userEvent.click(screen.getAllByText('Ankle Fracture (Left)')[0]);

        expect(
          within(participationFormatter[2]).getByText(/Modified/)
        ).toBeInTheDocument();
      });
    });
  });

  describe('<MUIDataGrid', () => {
    const planningEventContextProviderValue = {
      dispatch: jest.fn(),
      athleteEvents: athleteEvents.athlete_events,
      selectionHeadersSummaryState: [{ test: 'test' }],
    };
    beforeEach(() => {
      window.setFlag('planning-area-mui-data-grid', true);
      server.use(
        rest.post(
          '/planning_hub/events/:eventId/athlete_events/paginated',
          (req, res, ctx) =>
            res(
              ctx.json({
                athlete_events: athleteEvents.athlete_events.slice(0, 4),
              })
            )
        )
      );
    });

    afterEach(() => {
      window.setFlag('planning-area-mui-data-grid', false);
    });
    it('has correct number of rows and columns', async () => {
      componentRender(planningEventContextProviderValue);
      await waitFor(() =>
        expect(screen.queryByText('Loading')).not.toBeInTheDocument()
      );
      expect(screen.getAllByRole('columnheader')).toHaveLength(7);
      expect(screen.getAllByRole('row')).toHaveLength(5);
    });

    it('has the correct summary headers', async () => {
      componentRender(planningEventContextProviderValue, {
        ...props,
        eventSessionActivities: eventSessionActivitiesWithAthletes,
      });
      await waitFor(() =>
        expect(screen.queryByText('Loading')).not.toBeInTheDocument()
      );
      expect(
        within(
          screen.getByRole('row', {
            name: 'DA Daniel Athlete Athlete Loose-head Prop unavailable Full In In In Out',
          })
        ).getByText('unavailable')
      ).toBeInTheDocument();
      const summaryRow = screen.getAllByRole('row')[0];
      expect(within(summaryRow).getAllByRole('checkbox')).toHaveLength(3);
      expect(within(summaryRow).getAllByRole('checkbox')[0]).toBeChecked();
      expect(within(summaryRow).getByText('01A')).toBeInTheDocument();
      expect(
        within(summaryRow).getAllByRole('checkbox')[1]
      ).toBePartiallyChecked();
      expect(within(summaryRow).getByText('01B')).toBeInTheDocument();
      expect(
        within(summaryRow).getAllByRole('checkbox')[2]
      ).not.toBePartiallyChecked();
      expect(within(summaryRow).getAllByRole('checkbox')[2]).not.toBeChecked();
      expect(within(summaryRow).getByText('02A')).toBeInTheDocument();
    });

    it('correctly updates header summary value', async () => {
      const user = userEvent.setup();
      componentRender(planningEventContextProviderValue, {
        ...props,
        eventSessionActivities: eventSessionActivitiesWithAthletes,
      });
      await waitFor(() =>
        expect(screen.queryByText('Loading')).not.toBeInTheDocument()
      );
      expect(
        within(
          screen.getByRole('row', {
            name: 'DA Daniel Athlete Athlete Loose-head Prop unavailable Full In In In Out',
          })
        ).getByText('unavailable')
      ).toBeInTheDocument();
      const summaryRow = screen.getAllByRole('row')[0];
      expect(within(summaryRow).getAllByRole('checkbox')).toHaveLength(3);
      expect(within(summaryRow).getAllByRole('checkbox')[0]).toBeChecked();

      const row = screen.getAllByRole('row')[1];
      const toggle = within(row).getAllByRole('switch')[1]; // 0: group calc 1: first column

      expect(toggle).toBeChecked();
      await user.click(toggle);
      expect(toggle).not.toBeChecked();
      expect(
        within(summaryRow).getAllByRole('checkbox')[0]
      ).toBePartiallyChecked();
    });

    it('correctly updates values when header value clicked', async () => {
      const user = userEvent.setup();
      componentRender(planningEventContextProviderValue);
      await waitFor(() =>
        expect(screen.queryByText('Loading')).not.toBeInTheDocument()
      );
      expect(
        within(
          screen.getByRole('row', {
            name: 'DA Daniel Athlete Athlete Loose-head Prop unavailable Full In Out Out',
          })
        ).getByText('unavailable')
      ).toBeInTheDocument();
      const summaryRow = screen.getAllByRole('row')[0];
      expect(within(summaryRow).getAllByRole('checkbox')).toHaveLength(2);
      const checkbox = within(summaryRow).getAllByRole('checkbox')[0];
      expect(checkbox).not.toBeChecked();

      const allDisplayRows = screen.getAllByRole('row').slice(2);
      // eslint-disable-next-line no-restricted-syntax
      for (const displayRowBeforeClick of allDisplayRows) {
        const rowsToggles = within(displayRowBeforeClick).getAllByRole(
          'switch'
        );
        expect(rowsToggles[1]).not.toBeChecked();
        expect(rowsToggles[2]).not.toBeChecked();
      }

      // click checkbox in summary row one
      await user.click(checkbox);
      expect(checkbox).toBeChecked();

      /* eslint-disable-next-line no-restricted-syntax */
      for (const displayRowAfterClick of allDisplayRows) {
        const rowCheckBox = within(displayRowAfterClick).getByRole('checkbox');
        expect(rowCheckBox).toBePartiallyChecked();
        const rowsToggles = within(displayRowAfterClick).getAllByRole('switch');
        expect(rowsToggles[1]).toBeChecked();
        expect(rowsToggles[2]).not.toBeChecked();
      }
    });

    // eslint-disable-next-line jest/expect-expect
    it('shows correct data for each row', async () => {
      componentRender(planningEventContextProviderValue);
      await evalCorrectDataDisplayInTable();
    });

    describe('activity togglers', () => {
      beforeEach(() => {
        // Otherwise tests will fail.
        // https://github.com/jsdom/jsdom/issues/1695#issuecomment-559095940
        window.HTMLElement.prototype.scrollIntoView = jest.fn();
      });

      it('can toggle an activity', async () => {
        const user = userEvent.setup();
        componentRender(planningEventContextProviderValue);
        await waitFor(() =>
          expect(screen.queryByText('Loading')).not.toBeInTheDocument()
        );
        // Take the second row because the first one is the header.
        const row = screen.getAllByRole('row')[2];
        const toggle = within(row).getAllByRole('switch')[0];

        expect(toggle).not.toBeChecked();
        await user.click(toggle);
        expect(toggle).toBeChecked();
      });

      it('can toggle multiple activities', async () => {
        const user = userEvent.setup();
        componentRender(planningEventContextProviderValue);
        await waitFor(() =>
          expect(screen.queryByText('Loading')).not.toBeInTheDocument()
        );
        // Take the second row because the first one is the header.
        const row = screen.getAllByRole('row')[2];
        const toggles = within(row).getAllByRole('switch');

        toggles.forEach((toggle) => expect(toggle).not.toBeChecked());
        /* eslint-disable-next-line no-restricted-syntax */
        for (const toggle of toggles) {
          /* eslint-disable-next-line no-await-in-loop */
          await user.click(toggle);
          /* eslint-disable-next-line no-await-in-loop */
          await waitFor(() => expect(toggle).toBeChecked());
        }
      });

      describe('bulk toggle', () => {
        it('can toggle all activities in a row', async () => {
          const user = userEvent.setup();
          componentRender(planningEventContextProviderValue);
          await waitFor(() =>
            expect(screen.queryByText('Loading')).not.toBeInTheDocument()
          );
          // Take the third row because the first one is the header second one is mixed between checked and not checked.
          const row = screen.getAllByRole('row')[2];
          const bulkToggle = within(row).getByRole('checkbox');
          const toggles = within(row).getAllByRole('switch');

          toggles.forEach((toggle) => expect(toggle).not.toBeChecked());

          expect(bulkToggle).not.toBeChecked();
          await user.click(bulkToggle);
          await waitFor(() => expect(bulkToggle).toBeChecked());

          /* eslint-disable-next-line no-restricted-syntax */
          for (const toggle of toggles) {
            /* eslint-disable-next-line no-await-in-loop */
            await waitFor(() => expect(toggle).toBeChecked());
          }
        });

        describe('if all activities are selected', () => {
          it('de-selects all activities', async () => {
            const user = userEvent.setup();
            componentRender(planningEventContextProviderValue);
            await waitFor(() =>
              expect(screen.queryByText('Loading')).not.toBeInTheDocument()
            );
            // Take the third row because the first one is the header second one is mixed between checked and not checked.
            const row = screen.getAllByRole('row')[2];
            const bulkToggle = within(row).getByRole('checkbox');
            const toggles = within(row).getAllByRole('switch');

            toggles.forEach((toggle) => expect(toggle).not.toBeChecked());
            /* eslint-disable-next-line no-restricted-syntax */
            for (const toggle of toggles) {
              /* eslint-disable-next-line no-await-in-loop */
              await user.click(toggle);
              /* eslint-disable-next-line no-await-in-loop */
              await waitFor(() => expect(toggle).toBeChecked());
            }

            expect(bulkToggle).toBeChecked();
            await user.click(bulkToggle);
            await waitFor(() => expect(bulkToggle).not.toBeChecked());

            /* eslint-disable-next-line no-restricted-syntax */
            for (const toggle of toggles) {
              /* eslint-disable-next-line no-await-in-loop */
              await waitFor(() => expect(toggle).not.toBeChecked());
            }
          });
        });

        describe('if all activities are de-selected', () => {
          it('selects all activities', async () => {
            const user = userEvent.setup();
            componentRender(planningEventContextProviderValue);
            await waitFor(() =>
              expect(screen.queryByText('Loading')).not.toBeInTheDocument()
            );
            // Take the third row because the first one is the header second one is mixed between checked and not checked.
            const row = screen.getAllByRole('row')[3];
            const bulkToggle = within(row).getByRole('checkbox');

            expect(bulkToggle).toBePartiallyChecked();
            await user.click(bulkToggle);
            await waitFor(() => expect(bulkToggle).toBeChecked());

            /* eslint-disable-next-line no-restricted-syntax */
            for (const toggle of within(row).getAllByRole('switch')) {
              /* eslint-disable-next-line no-await-in-loop */
              await waitFor(() => expect(toggle).toBeChecked());
            }
          });
        });

        describe('if at least one activity is selected', () => {
          it('selects all activities', async () => {
            const user = userEvent.setup();
            componentRender(planningEventContextProviderValue);
            await waitFor(() =>
              expect(screen.queryByText('Loading')).not.toBeInTheDocument()
            );
            // Take the second row because the first one is the header.
            const row = screen.getAllByRole('row')[2];
            const bulkToggle = within(row).getByRole('checkbox');
            const toggles = within(row).getAllByRole('switch');

            toggles.forEach((toggle) => expect(toggle).not.toBeChecked());
            const firstToggle = toggles[0];
            await user.click(firstToggle);
            await waitFor(() => expect(firstToggle).toBeChecked());

            expect(bulkToggle).not.toBeChecked();
            await user.click(bulkToggle);
            // todo: is not because 'Group Calc' must be added to MUI table in next PR
            await waitFor(() => expect(bulkToggle).toBeChecked());

            /* eslint-disable-next-line no-restricted-syntax */
            for (const toggle of toggles) {
              /* eslint-disable-next-line no-await-in-loop */
              await waitFor(() => expect(toggle).toBeChecked());
            }
          });
        });
      });
    });

    // / tester
    describe('Participation Select values', () => {
      it('can select participation level with no injury', async () => {
        componentRender(planningEventContextProviderValue);
        await waitFor(() =>
          expect(screen.queryByText('Loading')).not.toBeInTheDocument()
        );

        const participationFormatter = screen.getAllByTestId(
          'participationFormatter'
        );
        const select = within(participationFormatter[0]).getByTestId(
          'selectInput'
        );
        expect(
          within(participationFormatter[2]).getByText(
            'Modified - Injury - Ankle Fracture (Left)'
          )
        ).toBeInTheDocument();

        await userEvent.click(select);
        // test all options are available in the select
        expect(screen.getByText('Modified - Injury')).toBeInTheDocument();
        expect(screen.getByText('Modified - Inactive')).toBeInTheDocument();
        expect(
          screen.getByText('Modified - Rest-non-injury')
        ).toBeInTheDocument();

        expect(screen.getByText('Partial')).toBeInTheDocument();
        expect(screen.getByText('Partial - Injury')).toBeInTheDocument();
        expect(screen.getByText('Partial - Inactive')).toBeInTheDocument();
        expect(
          screen.getByText('Partial - Rest-non-injury')
        ).toBeInTheDocument();
        expect(screen.getByText('No Participation')).toBeInTheDocument();
        expect(
          screen.getByText('No Participation - Injury')
        ).toBeInTheDocument();
        expect(
          screen.getByText('No Participation - Inactive')
        ).toBeInTheDocument();

        // open up submenu and select an injury
        await userEvent.click(screen.getByText('No Participation'));
        expect(
          within(participationFormatter[0]).getByText('No Participation')
        ).toBeInTheDocument();
      });

      it('can select participation level and reason with no injury', async () => {
        componentRender(planningEventContextProviderValue);
        await waitFor(() =>
          expect(screen.queryByText('Loading')).not.toBeInTheDocument()
        );

        const participationFormatter = screen.getAllByTestId(
          'participationFormatter'
        );
        const select = within(participationFormatter[0]).getByTestId(
          'selectInput'
        );

        expect(
          within(participationFormatter[0]).getByText('Full')
        ).toBeInTheDocument();
        await userEvent.click(select);

        expect(screen.getByText('Modified - Injury')).toBeInTheDocument();
        await userEvent.click(
          screen.getAllByText('No Participation - Rest-non-injury')[0]
        );

        expect(
          within(participationFormatter[0]).getByText(
            'No Participation - Rest-non-injury'
          )
        ).toBeInTheDocument();
      });

      it('can select participation level with injury', async () => {
        componentRender(planningEventContextProviderValue);
        await waitFor(() =>
          expect(screen.queryByText('Loading')).not.toBeInTheDocument()
        );

        const participationFormatter = screen.getAllByTestId(
          'participationFormatter'
        );
        const select = within(participationFormatter[0]).getByTestId(
          'selectInput'
        );
        expect(
          within(participationFormatter[0]).getByText('Full')
        ).toBeInTheDocument();

        await userEvent.click(select);
        // test all options are available in the select
        expect(screen.getByText('Modified - Injury')).toBeInTheDocument();
        expect(screen.getByText('Modified - Inactive')).toBeInTheDocument();
        expect(
          screen.getByText('Modified - Rest-non-injury')
        ).toBeInTheDocument();

        expect(screen.getByText('Partial')).toBeInTheDocument();
        expect(screen.getByText('Partial - Injury')).toBeInTheDocument();
        expect(screen.getByText('Partial - Inactive')).toBeInTheDocument();
        expect(
          screen.getByText('Partial - Rest-non-injury')
        ).toBeInTheDocument();
        expect(screen.getByText('No Participation')).toBeInTheDocument();
        expect(
          screen.getByText('No Participation - Injury')
        ).toBeInTheDocument();
        expect(
          screen.getByText('No Participation - Inactive')
        ).toBeInTheDocument();

        // open up submenu and select an injury
        await userEvent.click(screen.getByText('No Participation - Injury'));
        expect(
          screen.getByText('Fracture tibia and fibula at ankle joint - [Right]')
        ).toBeInTheDocument();

        await userEvent.click(
          screen.getByText('Fracture tibia and fibula at ankle joint - [Right]')
        );
        expect(
          within(participationFormatter[0]).getByText(
            'No Participation - Injury - Fracture tibia and fibula at ankle joint - [Right]'
          )
        ).toBeInTheDocument();
      });

      it('can de-select participation level injury', async () => {
        componentRender(planningEventContextProviderValue);

        const participationFormatter = await screen.findAllByTestId(
          'participationFormatter'
        );
        const select = within(participationFormatter[2]).getByTestId(
          'selectInput'
        );
        expect(
          within(participationFormatter[2]).getByText(
            'Modified - Injury - Ankle Fracture (Left)'
          )
        ).toBeInTheDocument();

        await userEvent.click(select);

        await userEvent.click(screen.getByText('Modified - Injury'));

        expect(screen.getAllByText('Ankle Fracture (Left)')).toHaveLength(2);

        await userEvent.click(screen.getAllByText('Ankle Fracture (Left)')[0]);

        expect(
          within(participationFormatter[2]).getByText(/Modified/)
        ).toBeInTheDocument();
      });
    });
  });

  describe('Game Event Athlete Selection Tab', () => {
    const gameEventProps = {
      ...props,
      event: { ...props.event, type: 'GAME', league_setup: false },
      isGameEventSelectionEnabled: true,
    };
    const planningEventContextProviderValue = {
      dispatch: jest.fn(),
      athleteEvents: athleteEvents.athlete_events,
      selectionHeadersSummaryState: [{ test: 'test' }],
    };

    const gameEventComponentRender = (
      mockProps = gameEventProps,
      mockStore = defaultStore
    ) =>
      renderWithRedux(
        <PlanningEventContextProvider value={planningEventContextProviderValue}>
          <VirtuosoMockContext.Provider
            value={{ viewportHeight: 2000, itemHeight: 50 }}
          >
            <AthletesSelectionTab {...mockProps} />
          </VirtuosoMockContext.Provider>
        </PlanningEventContextProvider>,
        { preloadedState: mockStore }
      );

    beforeEach(() => {
      server.use(
        rest.get('/planning_hub/events/:eventId/participants', (_, res, ctx) =>
          res(ctx.json(null))
        )
      );
    });

    it('renders correctly', async () => {
      gameEventComponentRender(gameEventProps);
      expect(screen.getByText('Add Players')).toBeInTheDocument();

      expect(screen.getByText('Player')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Team')).toBeInTheDocument();
      expect(
        screen.queryByText('Individual Fixture Rating')
      ).not.toBeInTheDocument();
      expect(screen.queryByText('Designation')).not.toBeInTheDocument();
      expect(screen.queryByText('Jersey No.')).not.toBeInTheDocument();
      expect(screen.getByText('Harry Doe')).toBeInTheDocument();
      expect(screen.getByText('unavailable')).toBeInTheDocument();
      expect(screen.queryByText(18)).not.toBeInTheDocument();
      expect(screen.getByText('Michael Yao')).toBeInTheDocument();
      expect(screen.getByText('injured')).toBeInTheDocument();
      expect(screen.queryByText('00')).not.toBeInTheDocument();
      expect(screen.getAllByText('Squad 1')).toHaveLength(2);
      expect(screen.getAllByTestId('delete-athlete')).toHaveLength(2);
    });

    it('renders empty state', async () => {
      gameEventComponentRender(gameEventProps, {});
      expect(
        await screen.findByText('No players selected')
      ).toBeInTheDocument();
      expect(screen.getByText('Add Players')).toBeInTheDocument();
    });

    it('removes a player', async () => {
      const mock = jest.spyOn(axios, 'post');
      gameEventComponentRender();

      expect(screen.getByText('Michael Yao')).toBeInTheDocument();

      await userEvent.click(screen.getAllByTestId('delete-athlete')[1]);

      expect(mock).toHaveBeenNthCalledWith(
        4,
        '/planning_hub/events/1/participants',
        { athlete_ids: [2], send_notifications: false }
      );
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: [mockedAthleteEvents[0]],
        type: 'athleteEvents/setApiAthleteEvents',
      });

      expect(screen.queryByText('Michael Yao')).not.toBeInTheDocument();
    });

    it('searches player by name and lastname', async () => {
      gameEventComponentRender(gameEventProps);

      await screen.findByText('Harry Doe');
      expect(screen.getByText('Michael Yao')).toBeInTheDocument();

      const wrapper = screen.getByTestId('search-bar');
      const searchBar = wrapper.querySelector('input');
      fireEvent.change(searchBar, { target: { value: 'michael' } });

      expect(screen.queryByText('Harry Doe')).not.toBeInTheDocument();
      expect(screen.getByText('Michael Yao')).toBeInTheDocument();

      await userEvent.clear(searchBar);

      expect(screen.getByText('Harry Doe')).toBeInTheDocument();
      expect(screen.getByText('Michael Yao')).toBeInTheDocument();

      fireEvent.change(searchBar, { target: { value: 'yao' } });

      expect(screen.queryByText('Harry Doe')).not.toBeInTheDocument();
      expect(screen.getByText('Michael Yao')).toBeInTheDocument();

      await userEvent.clear(searchBar);

      expect(screen.getByText('Harry Doe')).toBeInTheDocument();
      expect(screen.getByText('Michael Yao')).toBeInTheDocument();

      fireEvent.change(searchBar, { target: { value: 'd' } });

      expect(screen.getByText('Harry Doe')).toBeInTheDocument();
      expect(screen.queryByText('Michael Yao')).not.toBeInTheDocument();

      fireEvent.change(searchBar, { target: { value: 'oe yao' } });
      await userEvent.clear(searchBar);

      expect(screen.getByText('Harry Doe')).toBeInTheDocument();
      expect(screen.getByText('Michael Yao')).toBeInTheDocument();
    });

    it('Imported game - renders the athlete selection count at the top when loading', async () => {
      gameEventComponentRender({
        ...gameEventProps,
        event: {
          ...props.event,
          type: 'game_event',
          league_setup: true,
          competition: {
            ...props.event.competition,
            maximum_players: 22,
          },
        },
      });
      expect(await screen.findByText('Selected (.../22)')).toBeInTheDocument();
    });

    it('Imported game - renders the athlete selection count at the top when finished loading', async () => {
      gameEventComponentRender({
        ...gameEventProps,
        event: {
          ...props.event,
          type: 'game_event',
          league_setup: true,
          competition: {
            ...props.event.competition,
            maximum_players: 22,
          },
        },
      });

      expect(await screen.findByText('Selected (2/22)')).toBeInTheDocument();
    });

    it('Imported game - displays a warning message informing the user the game is locked to roster changes', async () => {
      gameEventComponentRender({
        ...gameEventProps,
        event: {
          ...props.event,
          type: 'game_event',
          league_setup: true,
          competition: {
            ...props.event.competition,
            maximum_players: 22,
            athlete_selection_locked: true,
            athlete_selection_deadline: '2024-05-06',
          },
        },
      });

      expect(
        await screen.findByText(
          'Roster Updates have been disabled from: May 6, 2024'
        )
      ).toBeInTheDocument();
    });

    describe('Individual fixture rating', () => {
      beforeEach(() => {
        window.featureFlags['individual-game-rating'] = true;
      });

      afterEach(() => {
        window.featureFlags['individual-game-rating'] = false;
      });

      it('updates individual player rating', async () => {
        const mockPost = jest.spyOn(axios, 'post');

        gameEventComponentRender(gameEventProps);
        expect(screen.getByText('Harry Doe')).toBeInTheDocument();

        const wrapper = screen.getAllByTestId('cell-rating')[0];
        selectEvent.openMenu(wrapper.querySelector('.kitmanReactSelect input'));
        await selectEvent.select(
          wrapper.querySelector('.kitmanReactSelect input'),
          'Test Fixture 2'
        );

        expect(mockPost).toHaveBeenNthCalledWith(
          4,
          '/planning_hub/events/1/athlete_events/update_attributes',
          {
            athlete_id: 2,
            disable_grid: true,
            rating_id: 2,
          }
        );
        await waitFor(() => {
          expect(mockDispatch).toHaveBeenCalledWith({
            type: 'athleteEvents/updateAthleteEvent',
            payload: {
              id: 1,
              rating: { id: 2 },
              athlete: mockedAthleteEvents[0].athlete,
            },
          });
        });
      });
    });

    describe('Match Day Flow render', () => {
      const savedCaptainActivity = {
        id: 1,
        absolute_minute: 0,
        athlete_id: 2,
        kind: 'captain_assigned',
        minute: 0,
      };

      const testProps = {
        ...gameEventProps,
        event: {
          ...props.event,
          type: 'game_event',
          league_setup: true,
          event_users: [],
          dmr: [],
          competition: { show_captain: true },
          venue_type: { name: 'Away' },
          game_participants_lock_time: '2020-09-18T10:28:52Z',
          game_participants_unlocked: false,
        },
      };
      const mockedPermissionsContextValue = {
        permissions: {
          leagueGame: {
            manageGameTeam: false,
          },
        },
        permissionsRequestStatus: 'SUCCESS',
      };

      const mockManagePermissions = {
        mockPermissions: {
          ...mockedPermissionsContextValue,
          permissions: {
            leagueGame: {
              manageGameTeam: true,
            },
          },
        },
      };

      const matchDayFlowRender = ({
        preferences = {
          league_game_team: true,
          league_game_team_lock_minutes: true,
          league_game_match_report: false,
        },
        mockTestProps = testProps,
        mockPermissions = mockedPermissionsContextValue,
        mockStore = defaultStore,
      }) =>
        renderWithRedux(
          <PreferenceContext.Provider value={{ preferences }}>
            <MockedPermissionContextProvider
              permissionsContext={mockPermissions}
            >
              <PlanningEventContextProvider
                value={planningEventContextProviderValue}
              >
                <VirtuosoMockContext.Provider
                  value={{ viewportHeight: 2000, itemHeight: 50 }}
                >
                  <AthletesSelectionTab {...mockTestProps} />
                </VirtuosoMockContext.Provider>
              </PlanningEventContextProvider>
            </MockedPermissionContextProvider>
          </PreferenceContext.Provider>,
          { preloadedState: mockStore }
        );

      beforeEach(() =>
        jest.useFakeTimers().setSystemTime(new Date('2020-09-10T10:28:52Z'))
      );

      afterEach(() => jest.useRealTimers());

      it('renders  "Jersey No." columns when event league_setup and league_game_team is true', async () => {
        matchDayFlowRender({});
        expect(screen.getByText('Add Players')).toBeInTheDocument();

        expect(screen.getByText('Jersey No.')).toBeInTheDocument();
        expect(screen.queryByText('00')).toBeInTheDocument();
      });

      it('renders "Designation", "Jersey No." columns when event league_setup and the match day communications flow is true', async () => {
        matchDayFlowRender({
          preferences: {
            league_game_team: true,
            league_game_match_report: true,
          },
        });
        expect(screen.getByText('Add Players')).toBeInTheDocument();

        expect(screen.getByText('Designation')).toBeInTheDocument();
        expect(screen.getByText('Jersey No.')).toBeInTheDocument();
        expect(screen.queryByText(18)).toBeInTheDocument();
        expect(screen.queryByText('00')).toBeInTheDocument();
      });

      it('updates player jersey number', async () => {
        const mockPost = jest.spyOn(axios, 'post');
        matchDayFlowRender({
          preferences: {
            league_game_team: true,
            league_game_match_report: true,
          },
        });
        expect(screen.getByText('Harry Doe')).toBeInTheDocument();
        expect(screen.getByText(18)).toBeInTheDocument();

        const wrapper = screen.getAllByTestId('cell-jersey')[0];
        await selectEvent.openMenu(
          wrapper.querySelector('.kitmanReactSelect input')
        );

        await selectEvent.select(
          wrapper.querySelector('.kitmanReactSelect input'),
          '00'
        );

        await waitFor(() => {
          expect(
            screen.getByText('Duplicate jersey number')
          ).toBeInTheDocument();
        });

        // eslint-disable-next-line testing-library/no-wait-for-side-effects
        await waitFor(() => userEvent.click(screen.getByText('Confirm')));

        expect(mockPost).toHaveBeenNthCalledWith(
          4,
          '/planning_hub/events/1/athlete_events/update_attributes',
          {
            athlete_id: 3,
            squad_number: null,
            disable_grid: true,
          }
        );
        expect(mockPost).toHaveBeenNthCalledWith(
          5,
          '/planning_hub/events/1/athlete_events/update_attributes',
          {
            athlete_id: 2,
            squad_number: -1,
            disable_grid: true,
          }
        );

        expect(mockDispatch).toHaveBeenCalledWith({
          payload: {
            athlete: {
              ...mockedAthleteEvents[1].athlete,
              squad_number: null,
              user_id: 3,
            },
            id: 2,
            rating: null,
          },
          type: 'athleteEvents/updateAthleteEvent',
        });
        expect(mockDispatch).toHaveBeenCalledWith({
          payload: {
            athlete: {
              ...mockedAthleteEvents[0].athlete,
              squad_number: -1,
            },
            id: 1,
            rating: null,
          },
          type: 'athleteEvents/updateAthleteEvent',
        });
      });

      it('jersey number cell should be view only for clubs', () => {
        matchDayFlowRender({});
        expect(screen.getByText('Harry Doe')).toBeInTheDocument();
        expect(screen.getByText(18)).toBeInTheDocument();
        expect(screen.getByText('00')).toBeInTheDocument();

        const wrapper = screen.getAllByTestId('cell-jersey')[0];
        expect(
          wrapper.querySelector('.kitmanReactSelect input')
        ).not.toBeInTheDocument();
      });

      it('should allow the club user to assign a captain', async () => {
        const axiosSpy = jest.spyOn(axios, 'post');
        const user = userEvent.setup();
        matchDayFlowRender({});
        await waitFor(() => user.click(screen.getAllByRole('checkbox')[0]));
        expect(axiosSpy).toHaveBeenCalledWith(
          '/ui/planning_hub/events/1/game_periods/1/v2/game_activities/bulk_save',
          {
            game_activities: [
              {
                absolute_minute: 0,
                athlete_id: 2,
                kind: 'captain_assigned',
                minute: 0,
              },
            ],
          }
        );
      });

      it('should allow the captain toggle cell to unassign a captain', async () => {
        const user = userEvent.setup();

        matchDayFlowRender({
          mockTestProps: {
            ...testProps,
            event: {
              ...testProps.event,
              dmr: ['captain'],
            },
          },
          mockStore: {
            planningEvent: {
              ...defaultStore.planningEvent,
              gameActivities: { localGameActivities: [savedCaptainActivity] },
            },
          },
        });

        await waitFor(() => user.click(screen.getAllByRole('checkbox')[0]));
        expect(mockDispatch).toHaveBeenCalledWith({
          payload: [],
          type: 'gameActivities/setSavedGameActivities',
        });
      });

      it('should allow the captain toggle cell to reassign a captain', async () => {
        const user = userEvent.setup();
        matchDayFlowRender({
          mockTestProps: {
            ...testProps,
            event: {
              ...testProps.event,
              dmr: ['captain'],
            },
          },
          mockStore: {
            planningEvent: {
              ...defaultStore.planningEvent,
              gameActivities: { localGameActivities: [savedCaptainActivity] },
            },
          },
        });
        await waitFor(() => user.click(screen.getAllByRole('checkbox')[1]));
        expect(mockDispatch).toHaveBeenCalledWith({
          payload: [
            {
              absolute_minute: 0,
              athlete_id: 3,
              id: 1,
              kind: 'captain_assigned',
              minute: 0,
            },
          ],
          type: 'gameActivities/setSavedGameActivities',
        });
      });

      it('captain toggle is disabled when the dmr is locked for the club user and league_game_team_lock_minutes is on', async () => {
        const user = userEvent.setup();
        jest.useFakeTimers().setSystemTime(new Date('2020-09-20T10:28:52Z'));
        matchDayFlowRender({});

        await waitFor(() =>
          expect(() =>
            user.click(screen.getAllByRole('checkbox')[0])
          ).rejects.toThrow(/pointer-events: none/)
        );
      });

      it('renders the appropriate banner at the bottom', () => {
        matchDayFlowRender({
          mockTestProps: {
            ...testProps,
            event: {
              ...testProps.event,
              venue_type: { name: 'Home' },
              competition: {
                min_substitutes: 1,
                min_staffs: 1,
                required_designation_roles: [ClubPhysicianDMRRequiredRole],
                show_captain: true,
              },
            },
          },
        });

        expect(screen.getByText('Select players (min 12)')).toBeInTheDocument();
        expect(screen.getByText('Select captain')).toBeInTheDocument();
        expect(screen.getByText('Select starting 11')).toBeInTheDocument();
        expect(screen.getByText('Substitutions (min 1)')).toBeInTheDocument();
        expect(
          screen.getByText('Select staff personnel (min 1)')
        ).toBeInTheDocument();
        expect(screen.getByText('Select club physician')).toBeInTheDocument();
        expect(screen.queryByText('Save')).not.toBeInTheDocument();
      });

      it('does not render the captain business rule and column if the competition setting is false', () => {
        matchDayFlowRender({
          mockTestProps: {
            ...testProps,
            event: {
              ...testProps.event,
              venue_type: { name: 'Home' },
              competition: {
                show_captain: false,
              },
            },
          },
        });

        expect(screen.queryByText('Captain')).not.toBeInTheDocument();
        expect(screen.queryByText('Select captain')).not.toBeInTheDocument();
      });

      it('captain toggle is disabled after being toggled to assign a captain', async () => {
        server.use(
          rest.post(
            '/ui/planning_hub/events/1/game_periods/1/v2/game_activities/bulk_save',
            async (req, res, ctx) => {
              await new Promise((r) => setTimeout(r, 2000));
              return res(ctx.json());
            }
          )
        );

        const user = userEvent.setup();

        matchDayFlowRender({});

        await waitFor(() =>
          expect(() =>
            user.click(screen.getAllByRole('checkbox')[0])
          ).rejects.toThrow(/pointer-events: none/)
        );
      });

      it('athlete selection is not locked when the preference league_game_team_lock_minutes is off', () => {
        jest.useFakeTimers().setSystemTime(new Date('2020-09-20T10:28:52Z'));
        matchDayFlowRender({
          preferences: {
            league_game_team: true,
            league_game_team_lock_minutes: false,
          },
        });

        expect(
          screen.getByRole('button', { name: /Add players/i })
        ).toBeEnabled();
      });

      it('renders columns including the status column, when the preference league_game_team is off false', () => {
        matchDayFlowRender({
          preferences: { league_game_team: false },
          mockTestProps: {
            ...testProps,
            event: { ...testProps.event, competition: { show_captain: false } },
          },
        });

        const headers = screen.getAllByRole('columnheader');
        expect(headers).toHaveLength(4);
        expect(headers[0]).toHaveTextContent('Player');
        expect(headers[1]).toHaveTextContent('Status');
        expect(headers[2]).toHaveTextContent('Team');

        // this is empty because its has no value, bin icon column
        expect(headers[3]).toHaveTextContent('');
      });

      it('does not render the status column', () => {
        matchDayFlowRender({});

        const headers = screen.getAllByRole('columnheader');
        expect(headers).toHaveLength(4);
        expect(headers[1]).not.toHaveTextContent('Status');
        expect(headers[1]).toHaveTextContent('Jersey No.');
      });

      it('should refetch the game compliance rules when assigning a captain', async () => {
        const axiosSpy = jest.spyOn(axios, 'post');
        const axiosGetSpy = jest.spyOn(axios, 'get');
        const user = userEvent.setup();

        matchDayFlowRender({});

        await waitFor(() =>
          expect(screen.getAllByRole('checkbox')[0]).toBeInTheDocument()
        );
        await waitFor(() => user.click(screen.getAllByRole('checkbox')[0]));
        expect(axiosSpy).toHaveBeenCalledWith(
          '/ui/planning_hub/events/1/game_periods/1/v2/game_activities/bulk_save',
          {
            game_activities: [
              {
                absolute_minute: 0,
                athlete_id: 2,
                kind: 'captain_assigned',
                minute: 0,
              },
            ],
          }
        );
        expect(axiosGetSpy).toHaveBeenCalledWith(
          '/planning_hub/game_compliance/1/rules'
        );

        expect(testProps.onUpdateEvent).toHaveBeenCalledWith(
          {
            ...testProps.event,
            dmr: ['players', 'captain'],
          },
          true
        );
      });

      it('should refetch the game compliance rules when an athlete is removed with the bin icon', async () => {
        const axiosGetSpy = jest.spyOn(axios, 'get');
        const mockProps = {
          ...gameEventProps,
          event: {
            ...props.event,
            type: 'game_event',
            league_setup: true,
            event_users: [],
            competition: {
              min_substitutes: 1,
              min_staffs: 1,
              show_captain: true,
            },
            dmr: ['captain', 'players', 'subs'],
          },
        };
        const user = userEvent.setup();

        matchDayFlowRender({
          mockTestProps: mockProps,
          mockStore: {
            planningEvent: {
              ...defaultStore.planningEvent,
              gameActivities: {
                localGameActivities: [
                  savedCaptainActivity,
                  {
                    id: 1,
                    kind: 'formation_change',
                    relation: { number_of_players: 1 },
                  },
                ],
              },
            },
          },
        });

        await waitFor(() =>
          expect(screen.getByTestId('delete-athlete')).toBeInTheDocument()
        );
        await waitFor(() => user.click(screen.getByTestId('delete-athlete')));
        expect(axiosGetSpy).toHaveBeenCalledWith(
          '/planning_hub/game_compliance/1/rules'
        );

        expect(mockProps.onUpdateEvent).toHaveBeenCalledWith(
          {
            ...mockProps.event,
            dmr: ['players', 'captain'],
          },
          true
        );
      });

      describe('league admin user', () => {
        beforeEach(() => {
          server.use(
            rest.get(
              `/ui/organisation/organisations/current`,
              (req, res, ctx) =>
                res(
                  ctx.json({
                    association_admin: true,
                  })
                )
            ),
            rest.get(`/ui/current_user`, (req, res, ctx) =>
              res(
                ctx.json({
                  role: 'Account Admin',
                })
              )
            )
          );
        });

        it('should allow the league admin to assign a captain updating the league event', async () => {
          const user = userEvent.setup();
          matchDayFlowRender(mockManagePermissions);
          await waitFor(() =>
            expect(screen.getAllByRole('checkbox')[0]).toBeInTheDocument()
          );
          await waitFor(() => user.click(screen.getAllByRole('checkbox')[0]));
          expect(props.onUpdateLeagueEvent).toHaveBeenCalledWith({
            away_dmr: ['players', 'captain'],
          });
        });
      });
    });
  });
});
