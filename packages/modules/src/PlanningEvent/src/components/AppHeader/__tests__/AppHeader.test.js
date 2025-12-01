import 'core-js/stable/structured-clone';
import $ from 'jquery';
import * as redux from 'react-redux';
import { within, screen } from '@testing-library/react';
import { server, rest } from '@kitman/services/src/mocks/server';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import useLeagueOperations from '@kitman/common/src/hooks/useLeagueOperations';
import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { data as customEventTypes } from '@kitman/services/src/mocks/handlers/planning/getCustomEventTypes';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { axios } from '@kitman/common/src/utils/services';
import * as preferenceContextContext from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';
import {
  getIsRepeatEvent,
  getHumanReadableEventType,
} from '@kitman/common/src/utils/events';
import { mailingList } from '@kitman/modules/src/Contacts/shared/constants';
import { getMatchDayView } from '@kitman/modules/src/PlanningEvent/src/redux/selectors/planningEventSelectors';
import getEventDeletionPrompt from '@kitman/services/src/services/planning/getEventDeletionPrompt';

import AppHeader from '../index';

jest.mock(
  '@kitman/modules/src/PlanningEvent/src/redux/selectors/planningEventSelectors',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/PlanningEvent/src/redux/selectors/planningEventSelectors'
    ),
    getMatchDayView: jest.fn(),
  })
);
jest.mock('@kitman/common/src/hooks/useLeagueOperations');
jest.mock('@kitman/common/src/contexts/PermissionsContext');
jest.mock('@kitman/common/src/contexts/PreferenceContext/preferenceContext');
jest.mock('@kitman/common/src/utils/events');
jest.mock('@kitman/services/src/services/planning/getEventDeletionPrompt');

describe('AppHeader', () => {
  const squad = { name: 'Squad Name', id: 1 };

  const defaultLeagueOps = {
    isLeagueStaffUser: true,
  };

  const sessionEvent = {
    id: '454565',
    type: 'session_event',
    game_day_plus: 2,
    game_day_minus: 3,
    session_type: { id: 1, name: 'Speed' },
    surface_type: { name: 'Artificial Turf' },
    surface_quality: { title: 'Icy/Frozen' },
    weather: { title: 'Drizzle' },
    description: 'My description',
    duration: 30,
    local_timezone: 'Europe/Berlin',
    start_date: '2020-12-19T17:00:00+00:00',
  };

  const defaultProps = {
    event: { ...sessionEvent, squad },
    onUpdateEvent: jest.fn(),
    setIsEditModalOpen: jest.fn(),
    eventConditions: {
      temperature_units: 'C',
    },
    canEditEvent: true,
    canDeleteEvent: true,
    canDownloadPlan: true,
    withMetaInformation: false,
    squadName: '',
    isEditModalOpen: false,
    hasGameDetailsMissing: false,
    t: i18nextTranslateStub(),
  };

  const renderComponent = ({
    leagueOpsProps = { isLeagueStaffUser: false },
    props = defaultProps,
    preferences = {},
    matchDayView = mailingList.Dmn,
  }) => {
    getMatchDayView.mockReturnValue(() => matchDayView);

    useLeagueOperations.mockReturnValue({
      ...defaultLeagueOps,
      ...leagueOpsProps,
    });
    usePermissions.mockReturnValue({
      permissions: {
        leagueGame: {
          manageGameInformation: true,
          viewGameInformation: true,
          viewGameTeam: true,
        },
      },
    });
    usePreferences.mockReturnValue({
      preferences,
    });

    return renderWithRedux(<AppHeader {...props} />);
  };

  beforeEach(() => {
    const deferred = $.Deferred();
    jest.spyOn($, 'ajax').mockImplementation(() => deferred.resolve([]));
    getIsRepeatEvent.mockReturnValue(false);
    getHumanReadableEventType.mockReturnValue('Event');
    getEventDeletionPrompt.mockReturnValue({
      issues: [],
      imported_data: [],
      assessments: [],
    });
  });

  const checkButtonDoesNotRender = (name) => {
    expect(
      screen.queryByRole('button', {
        name,
      })
    ).not.toBeInTheDocument();
  };

  const checkButtonDoesRender = (name) => {
    expect(
      screen.getByRole('button', {
        name,
      })
    ).toBeInTheDocument();
  };
  describe('when the event is a game', () => {
    const event = {
      id: '37198',
      type: 'game_event',
      duration: 80,
      local_timezone: 'Europe/Dublin',
      start_date: '2020-12-31T12:03:00+00:00',
      end_date: '2020-12-31T13:23:00+00:00',
      score: 2,
      opponent_score: 3,
      opponent_team: {
        id: 1,
        name: 'Cork',
      },
      venue_type: {
        id: 1,
        name: 'Home',
      },
      competition: {
        id: 1,
        name: 'Premier league',
      },
      organisation_team: {
        id: 1,
        name: 'B Team',
      },
      squad,
    };

    it('renders the correct header content', async () => {
      const user = userEvent.setup();
      renderComponent({ props: { ...defaultProps, event } });
      expect(screen.getByText('B Team vs Cork (2-3)')).toBeInTheDocument();
      checkButtonDoesRender('Edit details');
      expect(
        screen.getByText(
          'December 31, 2020 12:03 PM, (12:03 pm Europe/Dublin) (80 min)'
        )
      ).toBeInTheDocument();
      await user.click(screen.getAllByRole('button')[1]); // desktop menu
      checkButtonDoesRender('Delete');
      expect(screen.queryByText(squad.name)).not.toBeInTheDocument();
    });

    it('shows the squad name if the optimized-calendar FF is on', () => {
      window.featureFlags['optimized-calendar'] = true;

      renderComponent({ props: { ...defaultProps, event } });
      expect(screen.getByText(squad.name)).toBeInTheDocument();

      window.featureFlags['optimized-calendar'] = false;
    });

    it('renders the squad name header', async () => {
      renderComponent({
        props: {
          ...defaultProps,
          event: { ...event, organisation_team: undefined },
          squadName: 'Test Squad',
        },
      });
      expect(screen.getByText('Test Squad vs Cork (2-3)')).toBeInTheDocument();
    });

    it('[Feature Flag standard-date-formatting] is on', () => {
      window.featureFlags['standard-date-formatting'] = true;
      renderComponent({ props: { ...defaultProps, event } });
      expect(
        screen.getByText(
          'December 31, 2020 12:03 PM, (12:03 PM Europe/Dublin) (80 min)'
        )
      ).toBeInTheDocument();
      window.featureFlags['standard-date-formatting'] = false;
    });

    // eslint-disable-next-line jest/expect-expect
    it('only renders edit details when delete is disabled', async () => {
      const user = userEvent.setup();
      renderComponent({
        props: { ...defaultProps, event, canDeleteEvent: false },
      });
      await user.click(screen.getAllByRole('button')[1]);
      checkButtonDoesNotRender('Delete');
    });

    describe('Match day flow render', () => {
      const matchDayEvent = {
        ...event,
        league_setup: true,
      };

      const matchDayProps = {
        ...defaultProps,
        event: matchDayEvent,
        leagueEvent: matchDayEvent,
        canEditEvent: false,
        canDeleteEvent: false,
      };

      let useDispatchSpy;
      let mockDispatch;

      beforeEach(() => {
        useDispatchSpy = jest.spyOn(redux, 'useDispatch');
        mockDispatch = jest.fn();
        useDispatchSpy.mockReturnValue(mockDispatch);
      });

      it('does render the match day management event header when the user is a league user when the lock preference iso n', () => {
        renderComponent({
          leagueOpsProps: {
            isLeagueStaffUser: true,
          },
          props: {
            ...matchDayProps,
            squadName: 'Test Squad',
            leagueEvent: {
              ...matchDayEvent,
              organisation_team: { name: 'Test LEague Name' },
              squad: { owner_name: 'Test League Name' },
            },
          },
          preferences: {
            league_game_team: true,
            league_game_information: true,
          },
        });
        expect(
          screen.getByText('Test Squad Test League Name vs Cork (2-3)')
        ).toBeInTheDocument();
      });

      it('does not render edit details in the match day flow and the user is a league user', () => {
        renderComponent({
          leagueOpsProps: {
            isLeagueStaffUser: true,
          },
          props: matchDayProps,
          preferences: {
            league_game_team: true,
            league_game_information: true,
          },
        });
        expect(
          screen.queryByRole('button', {
            name: 'Edit details',
          })
        ).not.toBeInTheDocument();
      });

      it('renders the dmr/dmn toggle when the user is a league user', () => {
        renderComponent({
          leagueOpsProps: {
            isLeagueStaffUser: true,
          },
          props: {
            ...matchDayProps,
            squadName: 'Test Squad',
          },
          preferences: {
            league_game_team: true,
            league_game_information: true,
          },
        });
        expect(screen.getByText('DMN')).toBeInTheDocument();
        expect(screen.getByText('DMR')).toBeInTheDocument();
      });

      it('allows the league user to click the dmn/dmr toggles', async () => {
        const user = userEvent.setup();
        renderComponent({
          leagueOpsProps: {
            isLeagueStaffUser: true,
          },
          props: {
            ...matchDayProps,
            squadName: 'Test Squad',
          },
          preferences: {
            league_game_team: true,
            league_game_information: true,
          },
        });
        await user.click(screen.getByText('DMN'));
        expect(mockDispatch).toHaveBeenCalledWith({
          payload: mailingList.Dmn,
          type: 'gameEvent/toggleMatchDayView',
        });
        await user.click(screen.getByText('DMR'));
        expect(mockDispatch).toHaveBeenCalledWith({
          payload: mailingList.Dmr,
          type: 'gameEvent/toggleMatchDayView',
        });
      });

      it('renders the dmr/dmn toggle when the user is a club user', () => {
        renderComponent({
          leagueOpsProps: {
            isLeagueStaffUser: false,
            isOrgSupervised: true,
          },
          props: {
            ...matchDayProps,
            squadName: 'Test Squad',
          },
          preferences: {
            league_game_team: true,
            league_game_information: true,
            league_game_team_notifications: true,
            league_game_communications: false,
          },
        });
        expect(screen.getByText('DMN')).toBeInTheDocument();
        expect(screen.getByText('DMR')).toBeInTheDocument();
        expect(screen.queryByText('Email')).not.toBeInTheDocument();
        expect(
          screen.getByRole('button', { name: 'Team' })
        ).toBeInTheDocument();
      });

      it('allows the club user to click the dmn/dmr toggles', async () => {
        const user = userEvent.setup();
        renderComponent({
          leagueOpsProps: {
            isLeagueStaffUser: false,
            isOrgSupervised: true,
          },
          props: {
            ...matchDayProps,
            squadName: 'Test Squad',
          },
          preferences: {
            league_game_team: true,
            league_game_information: true,
          },
        });
        await user.click(screen.getByText('DMN'));
        expect(mockDispatch).toHaveBeenCalledWith({
          payload: mailingList.Dmn,
          type: 'gameEvent/toggleMatchDayView',
        });
        await user.click(screen.getByText('DMR'));
        expect(mockDispatch).toHaveBeenCalledWith({
          payload: mailingList.Dmr,
          type: 'gameEvent/toggleMatchDayView',
        });
      });

      describe('league_game_team_lock_minutes preference', () => {
        it('renders only the date not the time when the lock preference is on', () => {
          window.featureFlags['planning-game-events-field-view'] = true;
          renderComponent({
            props: matchDayProps,
            preferences: {
              league_game_team: true,
              league_game_information: true,
              league_game_team_lock_minutes: true,
            },
          });

          expect(screen.getByText('December 31, 2020,')).toBeInTheDocument();
          window.featureFlags['planning-game-events-field-view'] = false;
        });

        it('renders the dmr/dmn countdown when the user is a league user and the lock preference is on', () => {
          renderComponent({
            leagueOpsProps: {
              isLeagueStaffUser: true,
            },
            props: {
              ...matchDayProps,
              squadName: 'Test Squad',
            },
            preferences: {
              league_game_team: true,
              league_game_information: true,
              league_game_team_lock_minutes: true,
            },
          });
          expect(screen.getByText('Countdown')).toBeInTheDocument();
          expect(screen.getByText('00:00')).toBeInTheDocument();
        });

        it('renders the dmr/dmn statuses for both teams when the user is a league user and the lock preference is on', () => {
          renderComponent({
            leagueOpsProps: {
              isLeagueStaffUser: true,
            },
            props: {
              ...matchDayProps,
              squadName: 'Test Squad',
              leagueEvent: {
                ...matchDayEvent,
                home_dmr: ['players', 'captain'],
              },
            },
            preferences: {
              league_game_team: true,
              league_game_information: true,
              league_game_team_lock_minutes: true,
            },
          });
          expect(
            screen.getByTestId('ContrastOutlinedIcon')
          ).toBeInTheDocument();
          expect(
            screen.getByTestId('RadioButtonUncheckedRoundedIcon')
          ).toBeInTheDocument();
        });

        it('renders the dmr/dmn status for the clubs team when it is a club user and the lock preference is on', () => {
          renderComponent({
            props: {
              ...matchDayProps,
              squadName: 'Test Squad',
              event: { ...matchDayEvent, dmr: ['captain'] },
            },
            preferences: {
              league_game_team: true,
              league_game_information: true,
              league_game_team_lock_minutes: true,
            },
          });
          expect(
            screen.getByTestId('ContrastOutlinedIcon')
          ).toBeInTheDocument();
        });

        it('renders the lock icon when the game is past its lock time for the club user with the lock preference on', () => {
          Date.now = jest.fn(() => new Date('2023-05-10T12:35:37.000Z'));
          renderComponent({
            props: matchDayProps,
            preferences: {
              league_game_team: true,
              league_game_information: true,
              league_game_team_lock_minutes: true,
            },
          });
          expect(screen.getByTestId('LockIcon')).toBeInTheDocument();
        });

        it('renders email lock icon when the game has no dmn_notification_status set and the lock preference is on', () => {
          Date.now = jest.fn(() => new Date('2023-05-10T12:35:37.000Z'));
          renderComponent({
            props: matchDayProps,
            preferences: {
              league_game_team: true,
              league_game_information: true,
              league_game_team_lock_minutes: true,
            },
          });
          expect(screen.getByTestId('EmailIcon')).toBeInTheDocument();
        });

        it('renders the email icon when the game has its emails sent via the notification status and the lock preference is on', () => {
          Date.now = jest.fn(() => new Date('2023-05-10T12:35:37.000Z'));
          renderComponent({
            props: {
              ...matchDayProps,
              event: { ...matchDayEvent, dmn_notification_status: true },
            },
            preferences: {
              league_game_team: true,
              league_game_information: true,
              league_game_team_lock_minutes: true,
            },
          });
          expect(screen.getByTestId('MarkEmailReadIcon')).toBeInTheDocument();
        });

        it('renders the mail lock icon when the game has skip_automatic_game_team_email and matchDayView is dmr and the lock preference is on', () => {
          renderComponent({
            matchDayView: mailingList.Dmr,
            props: {
              ...matchDayProps,
              leagueEvent: {
                ...matchDayProps.leagueEvent,
                skip_automatic_game_team_email: true,
              },
            },
            preferences: {
              league_game_team: true,
              league_game_information: true,
              league_game_team_lock_minutes: true,
            },
          });
          expect(screen.getByTestId('MailLockIcon')).toBeInTheDocument();
        });

        it('does not render the mail lock icon when the game has skip_automatic_game_team_email and matchDayView is dmn when the lock preference is on', () => {
          renderComponent({
            props: {
              ...matchDayProps,
              leagueEvent: {
                ...matchDayProps.leagueEvent,
                skip_automatic_game_team_email: true,
              },
              matchDayView: 'dmn',
            },
            preferences: {
              league_game_team: true,
              league_game_information: true,
              league_game_team_lock_minutes: true,
            },
          });
          expect(screen.queryByTestId('MailLockIcon')).not.toBeInTheDocument();
        });

        it('renders the lock open icon when the game is not past its lock time for the club user with the lock preference on', () => {
          Date.now = jest.fn(() => new Date('2019-05-10T12:35:37.000Z'));
          renderComponent({
            props: matchDayProps,
            preferences: {
              league_game_team: true,
              league_game_information: true,
              league_game_team_lock_minutes: true,
            },
          });
          expect(screen.getByTestId('LockOpenIcon')).toBeInTheDocument();
        });

        it('if the lock preference is not set, it does not render the specific match day management event header', () => {
          renderComponent({
            leagueOpsProps: {
              isLeagueStaffUser: true,
            },
            props: {
              ...matchDayProps,
              squadName: 'Test Squad',
            },
            preferences: {
              league_game_team: true,
              league_game_information: true,
            },
          });

          expect(screen.queryByText('Countdown')).not.toBeInTheDocument();
          expect(screen.queryByText('00:00')).not.toBeInTheDocument();
          expect(
            screen.queryByTestId('ContrastOutlinedIcon')
          ).not.toBeInTheDocument();
          expect(
            screen.queryByTestId('RadioButtonUncheckedRoundedIcon')
          ).not.toBeInTheDocument();
          expect(screen.queryByTestId('LockIcon')).not.toBeInTheDocument();
          expect(
            screen.queryByTestId('MarkEmailReadIcon')
          ).not.toBeInTheDocument();
          expect(screen.queryByTestId('MailLockIcon')).not.toBeInTheDocument();
          expect(screen.queryByTestId('EmailIcon')).not.toBeInTheDocument();
        });
      });
    });

    it('does not render edit details when edit is disabled', async () => {
      const user = userEvent.setup();
      renderComponent({
        props: { ...defaultProps, event, canEditEvent: false },
      });
      expect(
        screen.queryByRole('button', {
          name: 'Edit details',
        })
      ).not.toBeInTheDocument();
      checkButtonDoesNotRender('Edit details');
      await user.click(screen.getAllByRole('button')[1]);
      checkButtonDoesRender('Delete');
    });

    // eslint-disable-next-line jest/expect-expect
    it('does not render the delete button if the event is a imported game event', async () => {
      renderComponent({
        props: {
          ...defaultProps,
          event: { ...event, league_setup: true },
          canEditEvent: false,
        },
      });

      checkButtonDoesNotRender('Delete');
    });

    describe('[featureFlag: event-collection-complete', () => {
      beforeEach(() => {
        window.featureFlags = { 'event-collection-complete': true };
      });

      afterEach(() => {
        window.featureFlags = {};
      });
      // eslint-disable-next-line jest/expect-expect
      it('renders the burger menu button option for a game', async () => {
        const user = userEvent.setup();
        renderComponent({ props: { ...defaultProps, event } });
        const burgerButtons = screen.getAllByRole('button');
        await user.click(burgerButtons[1]);
        checkButtonDoesNotRender('Mark game as complete');

        await user.click(burgerButtons[2]);
        checkButtonDoesRender('Mark game as complete');
      });

      it('allows the user to fire off the api request to mark as complete', async () => {
        const patchSpy = jest.spyOn(axios, 'patch');
        const user = userEvent.setup();
        renderComponent({ props: { ...defaultProps, event } });

        await user.click(screen.getAllByRole('switch')[0]);

        expect(patchSpy).toHaveBeenCalledWith(
          '/planning_hub/events/37198',
          { event_collection_complete: true, id: '37198' },
          { params: {} }
        );
      });
    });

    describe('mandatory fields banner', () => {
      it('renders the mandatory fields banner when game details has missing data', async () => {
        renderComponent({
          props: {
            ...defaultProps,
            event,
            squadName: 'Kitman FC',
            hasGameDetailsMissing: true,
          },
        });

        expect(
          screen.getByText('Mandatory game details missing')
        ).toBeInTheDocument();
      });
    });

    describe('edit details side panel', () => {
      it('renders the side panel when edit details is clicked', async () => {
        const user = userEvent.setup();
        renderComponent({ props: { ...defaultProps, event } });
        await user.click(
          screen.getByRole('button', {
            name: 'Edit details',
          })
        );
        expect(screen.getByText('Edit Game')).toBeInTheDocument();
      });
    });

    describe('delete prompt', () => {
      it('renders the delete prompt when the delete button is clicked', async () => {
        const user = userEvent.setup();
        renderComponent({});
        await user.click(screen.getAllByRole('button')[1]);
        await user.click(
          screen.getByRole('button', {
            name: 'Delete',
          })
        );
        expect(
          screen.getByText(
            'This will result in loss of participation data and any inputted data on this event. Action cannot be undone.'
          )
        ).toBeInTheDocument();
      });

      describe('repeat events / repeat-sessions', () => {
        const renderComponentAndTriggerDeleteModal = async (
          isParentEvent = true,
          isRepeatEvent = true
        ) => {
          getIsRepeatEvent.mockReturnValue(isRepeatEvent);
          const user = userEvent.setup();
          renderComponent({
            props: {
              ...defaultProps,
              event: {
                ...defaultProps.event,
                recurrence: { recurring_event_id: isParentEvent ? null : 1 },
              },
            },
          });
          await user.click(screen.getAllByRole('button')[1]);
          await user.click(
            screen.getByRole('button', {
              name: 'Delete',
            })
          );
        };

        it('should send the correct params to delete request', async () => {
          const deleteEventSpy = jest.spyOn(axios, 'delete');
          const user = userEvent.setup();
          await renderComponentAndTriggerDeleteModal(false);

          await user.click(screen.getAllByText('Delete')[1]);
          expect(deleteEventSpy).toHaveBeenCalledWith(
            '/planning_hub/events/454565',
            {
              params: {
                original_start_time: null,
                scope: 'this',
              },
            }
          );
        });
      });
    });

    describe('[Feature flag planning-game-events-field-view] is on', () => {
      beforeEach(() => {
        window.featureFlags['planning-game-events-field-view'] = true;
      });

      afterEach(() => {
        window.featureFlags['planning-game-events-field-view'] = false;
      });

      it('renders the correct title format', () => {
        renderComponent({
          props: { ...defaultProps, event, canDeleteEvent: false },
        });
        expect(screen.getByText('B Team v Cork')).toBeInTheDocument();
      });

      it('renders the correct date format', () => {
        renderComponent({
          props: { ...defaultProps, event, canDeleteEvent: false },
        });
        expect(
          screen.getByText('December 31, 2020, 12:03 PM - 1:23 PM')
        ).toBeInTheDocument();
      });

      it('renders the correct button', () => {
        renderComponent({
          props: { ...defaultProps, event, canDeleteEvent: false },
        });
        expect(screen.getAllByText('Game Details')[0]).toBeInTheDocument();
      });

      // eslint-disable-next-line jest/expect-expect
      it('renders the delete option', async () => {
        const user = userEvent.setup();
        renderComponent({
          props: { ...defaultProps, event },
        });
        await user.click(screen.getAllByRole('button')[1]); // desktop menu
        checkButtonDoesRender('Delete');
      });
    });

    describe('[FF event-attachments] is on', () => {
      beforeEach(() => {
        window.featureFlags['event-attachments'] = true;
      });

      afterEach(() => {
        window.featureFlags['event-attachments'] = false;
      });

      it('shows attachments if they exist on the event', () => {
        const eventAttachments = {
          ...event,
          attachments: [
            {
              attachment: {
                name: 'custom title',
                filename: 'my file name',
                download_url: 'my url',
                filetype: 'movie',
                confirmed: true,
              },
            },
          ],
        };
        renderComponent({
          props: {
            ...defaultProps,
            event: eventAttachments,
            canDeleteEvent: false,
            canEditEvent: false,
            withMetaInformation: false,
          },
        });
        const header = screen.getByTestId('EventAttachments|AppHeader');

        expect(within(header).getByText('Attachments')).toBeInTheDocument();
        expect(within(header).getByText('custom title')).toBeInTheDocument();
        expect(within(header).queryByText('Links')).not.toBeInTheDocument();
      });

      it('do not show unconfirmed attachments', () => {
        const eventAttachments = {
          ...event,
          attachments: [
            {
              attachment: {
                name: 'custom title',
                filename: 'my file name',
                download_url: 'my url',
                filetype: 'movie',
                confirmed: false,
              },
            },
          ],
        };

        renderComponent({
          props: {
            ...defaultProps,
            event: eventAttachments,
            canDeleteEvent: false,
            canEditEvent: false,
            withMetaInformation: false,
          },
        });
        const header = screen.getByTestId('EventAttachments|AppHeader');

        expect(
          within(header).queryByText('Attachments')
        ).not.toBeInTheDocument();
        expect(
          within(header).queryByText('custom title')
        ).not.toBeInTheDocument();
        expect(within(header).queryByText('Links')).not.toBeInTheDocument();
      });

      it('shows links if they exist on the event', () => {
        const eventAttachments = {
          ...event,
          attached_links: [
            {
              attached_link: { title: 'custom link title', uri: 'google.com' },
            },
          ],
        };
        renderComponent({
          props: {
            ...defaultProps,
            event: eventAttachments,
          },
        });

        const header = screen.getByTestId('EventAttachments|AppHeader');

        expect(within(header).getByText('Links')).toBeInTheDocument();
        expect(
          within(header).getByText('custom link title')
        ).toBeInTheDocument();
        expect(
          within(header).queryByText('Attachments')
        ).not.toBeInTheDocument();
      });

      it('shows links and files if they both exist', () => {
        const eventAttachments = {
          ...event,
          attached_links: [
            {
              attached_link: { title: 'custom link title', uri: 'google.com' },
            },
            { attached_link: { title: 'kitman labs', uri: 'kitmanlabs.com' } },
          ],
          attachments: [
            {
              attachment: {
                name: 'an example file',
                filename: 'my file name',
                download_url: 'my url',
                filetype: 'movie',
                confirmed: true,
              },
            },
          ],
        };
        renderComponent({
          props: {
            ...defaultProps,
            event: eventAttachments,
          },
        });
        const header = screen.getByTestId('EventAttachments|AppHeader');

        expect(within(header).getByText('Links')).toBeInTheDocument();
        expect(
          within(header).getByText('custom link title')
        ).toBeInTheDocument();
        expect(within(header).getByText('kitman labs')).toBeInTheDocument();
        expect(within(header).getByText('Attachments')).toBeInTheDocument();
        expect(within(header).getByText('an example file')).toBeInTheDocument();
      });
    });
  });

  describe('when the event is a training session', () => {
    it('renders the correct header content', () => {
      renderComponent({});
      expect(screen.getAllByText('Speed')[0]).toBeInTheDocument();
      expect(
        screen.getByText(
          'December 19, 2020 5:00 PM, (6:00 pm Europe/Berlin) (30 min)'
        )
      ).toBeInTheDocument();
      expect(screen.queryByText(squad.name)).not.toBeInTheDocument();
    });

    it('[Feature Flag standard-date-formatting] is on', () => {
      window.featureFlags['standard-date-formatting'] = true;
      renderComponent({});
      expect(
        screen.getByText(
          'December 19, 2020 5:00 PM, (6:00 PM Europe/Berlin) (30 min)'
        )
      ).toBeInTheDocument();
      window.featureFlags['standard-date-formatting'] = false;
    });
  });

  describe('renders the correct header buttons when the event is a session event', () => {
    beforeEach(() => {
      window.setFlag('event-collection-complete', true);
      window.setFlag('selection-tab-displaying-in-session', true);
      window.featureFlags['planning-game-events-field-view'] = true;
      window.setFlag('planning-tab-sessions', true);
    });

    afterEach(() => {
      window.setFlag('event-collection-complete', false);
      window.setFlag('selection-tab-displaying-in-session', false);
      window.featureFlags['planning-game-events-field-view'] = false;
      window.setFlag('planning-tab-sessions', false);
    });

    const checkBurgerMenuOption = () => {
      expect(
        screen.getByRole('button', {
          name: 'Delete',
        })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', {
          name: 'Duplicate event',
        })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', {
          name: 'Print/Download',
        })
      ).toBeInTheDocument();
    };

    it('renders the correct buttons', () => {
      renderComponent({});
      expect(screen.getByText('Complete')).toBeInTheDocument();
      expect(screen.getByRole('switch')).toBeInTheDocument();
      checkButtonDoesRender('Edit details');
    });

    it('does not render complete switch without FF', () => {
      window.setFlag('event-collection-complete', false);
      renderComponent({});
      expect(screen.queryByText('Complete')).not.toBeInTheDocument();
      expect(screen.queryByRole('switch')).not.toBeInTheDocument();
    });

    // eslint-disable-next-line jest/expect-expect
    it('renders the burger menu button option for a training session', async () => {
      const user = userEvent.setup();
      renderComponent({});
      const burgerButtons = screen.getAllByRole('button');
      await user.click(burgerButtons[1]); // desktop menu
      checkBurgerMenuOption();
      checkButtonDoesNotRender('Mark session as complete');

      await user.click(burgerButtons[2]); // mobile menu
      checkBurgerMenuOption();
      checkButtonDoesRender('Mark session as complete');
    });

    // eslint-disable-next-line jest/expect-expect
    it('does not render the burger menu button option print when canDeleteEvent prop false', async () => {
      const user = userEvent.setup();
      renderComponent({ props: { ...defaultProps, canDeleteEvent: false } });
      const burgerButtons = screen.getAllByRole('button');
      await user.click(burgerButtons[1]); // desktop menu
      checkButtonDoesNotRender('Delete');
      await user.click(burgerButtons[2]); // mobile menu
      checkButtonDoesNotRender('Delete');
    });

    // eslint-disable-next-line jest/expect-expect
    it('does not render the burger menu button option print without canDownloadPlan prop false', async () => {
      const user = userEvent.setup();
      renderComponent({ props: { ...defaultProps, canDownloadPlan: false } });
      const burgerButtons = screen.getAllByRole('button');
      await user.click(burgerButtons[1]); // desktop menu
      checkButtonDoesNotRender('Print/download');
      await user.click(burgerButtons[2]); // mobile menu
      checkButtonDoesNotRender('Print/download');
    });

    // eslint-disable-next-line jest/expect-expect
    it('does not render the burger menu button option Duplicate event without selection-tab-displaying-in-session FF', async () => {
      window.setFlag('selection-tab-displaying-in-session', false);
      const user = userEvent.setup();
      renderComponent({});
      const burgerButtons = screen.getAllByRole('button');
      await user.click(burgerButtons[1]); // desktop menu
      checkButtonDoesNotRender('Duplicate event');
      await user.click(burgerButtons[2]); // mobile menu
      checkButtonDoesNotRender('Duplicate event');
    });

    it(
      'renders ‘Duplicate event’ button outside of the tooltip menu if' +
        ' ‘duplicate-event-inside-an-event-nfl’ feature flag is true and' +
        ' ‘display_duplication_main_event_page’ preference is true',
      async () => {
        const user = userEvent.setup();
        jest.spyOn(preferenceContextContext, 'usePreferences').mockReturnValue({
          preferences: {
            display_duplication_main_event_page: true,
          },
        });
        window.setFlag('duplicate-event-inside-an-event-nfl', true);

        renderComponent({
          preferences: {
            display_duplication_main_event_page: true,
          },
        });

        expect(
          screen.getByTestId('duplicate-event-button-outside-tooltip-menu')
        ).toBeInTheDocument();

        const burgerButtons = screen.getAllByRole('button');

        await user.click(burgerButtons[1]); // desktop menu

        expect(
          screen.queryByTestId('TooltipMenu|PrimaryListItem')
        ).not.toBeInTheDocument();

        await user.click(burgerButtons[2]); // mobile menu

        expect(
          screen.getAllByTestId('TooltipMenu|PrimaryListItem').length
        ).toEqual(2);
      }
    );

    it(
      'doesn’t render ‘Duplicate event’ button outside of the tooltip menu if' +
        ' ‘duplicate-event-inside-an-event-nfl’ feature flag is false and' +
        ' ‘display_duplication_main_event_page’ preference is true',
      async () => {
        const user = userEvent.setup();
        jest.spyOn(preferenceContextContext, 'usePreferences').mockReturnValue({
          preferences: {
            display_duplication_main_event_page: true,
          },
        });
        window.featureFlags = { 'duplicate-event-inside-an-event-nfl': false };

        renderComponent({
          preferences: {
            display_duplication_main_event_page: true,
          },
        });

        expect(
          screen.queryByTestId('duplicate-event-button-outside-tooltip-menu')
        ).not.toBeInTheDocument();

        const burgerButtons = screen.getAllByRole('button');

        await user.click(burgerButtons[1]); // desktop menu

        expect(
          screen.getAllByTestId('TooltipMenu|PrimaryListItem').length
        ).toEqual(1);

        await user.click(burgerButtons[2]); // mobile menu

        expect(
          screen.getAllByTestId('TooltipMenu|PrimaryListItem').length
        ).toEqual(3);
      }
    );

    it(
      'doesn’t render ‘Duplicate event’ button outside of the tooltip menu if' +
        ' ‘duplicate-event-inside-an-event-nfl’ feature flag is true and' +
        ' ‘display_duplication_main_event_page’ preference is false',
      async () => {
        const user = userEvent.setup();
        jest.spyOn(preferenceContextContext, 'usePreferences').mockReturnValue({
          preferences: {
            display_duplication_main_event_page: false,
          },
        });
        window.featureFlags = { 'duplicate-event-inside-an-event-nfl': true };

        renderComponent({
          preferences: {
            display_duplication_main_event_page: false,
          },
        });

        expect(
          screen.queryByTestId('duplicate-event-button-outside-tooltip-menu')
        ).not.toBeInTheDocument();

        const burgerButtons = screen.getAllByRole('button');

        await user.click(burgerButtons[1]); // desktop menu

        expect(
          screen.getAllByTestId('TooltipMenu|PrimaryListItem').length
        ).toEqual(2);

        await user.click(burgerButtons[2]); // mobile menu

        expect(
          screen.getAllByTestId('TooltipMenu|PrimaryListItem').length
        ).toEqual(5);
      }
    );

    it(
      'doesn’t render ‘Duplicate event’ button outside of the tooltip menu if' +
        ' ‘duplicate-event-inside-an-event-nfl’ feature flag is false and' +
        ' ‘display_duplication_main_event_page’ preference is false',
      async () => {
        const user = userEvent.setup();
        jest.spyOn(preferenceContextContext, 'usePreferences').mockReturnValue({
          preferences: {
            display_duplication_main_event_page: false,
          },
        });
        window.featureFlags = { 'duplicate-event-inside-an-event-nfl': false };

        renderComponent({});

        expect(
          screen.queryByTestId('duplicate-event-button-outside-tooltip-menu')
        ).not.toBeInTheDocument();

        const burgerButtons = screen.getAllByRole('button');

        await user.click(burgerButtons[1]); // desktop menu

        expect(
          screen.getAllByTestId('TooltipMenu|PrimaryListItem').length
        ).toEqual(1);

        await user.click(burgerButtons[2]); // mobile menu

        expect(
          screen.getAllByTestId('TooltipMenu|PrimaryListItem').length
        ).toEqual(3);
      }
    );

    // eslint-disable-next-line jest/expect-expect
    it('renders the burger menu button option Duplicate event without selection-tab-displaying-in-session FF if duplicate-event-inside-an-event-nfl is true', async () => {
      window.setFlag('selection-tab-displaying-in-session', false);
      window.setFlag('duplicate-event-inside-an-event-nfl', true);
      const user = userEvent.setup();
      renderComponent({});
      const burgerButtons = screen.getAllByRole('button');
      await user.click(burgerButtons[1]); // desktop menu
      checkButtonDoesRender('Duplicate event');
      await user.click(burgerButtons[2]); // mobile menu
      checkButtonDoesRender('Duplicate event');
    });

    it('handles an error when completing a session', async () => {
      server.use(
        rest.patch(`planning_hub/events/${sessionEvent.id}`, (req, res, ctx) =>
          res(ctx.status(500))
        )
      );
      const user = userEvent.setup();
      renderComponent({});

      await user.click(screen.getByRole('switch'));
      await expect(
        screen.getByText('Something went wrong!')
      ).toBeInTheDocument();
    });
  });

  describe('when the event is a session event', () => {
    it('renders the meta information', () => {
      renderComponent({
        props: { ...defaultProps, withMetaInformation: true },
      });

      expect(screen.getAllByText('+2, -3')[0]).toBeInTheDocument();
      expect(screen.getByText('Artificial Turf')).toBeInTheDocument();
      expect(screen.getByText('Icy/Frozen')).toBeInTheDocument();
      expect(screen.getByText('Drizzle')).toBeInTheDocument();
      expect(screen.getAllByText('My description')[0]).toBeInTheDocument();
    });

    describe('[FeatureFlag planning-custom-org-event-details] is on', () => {
      beforeEach(() => {
        window.setFlag('planning-custom-org-event-details', true);
      });
      afterEach(() => {
        window.setFlag('planning-custom-org-event-details', false);
      });

      it('renders opponent team', () => {
        renderComponent({
          props: {
            ...defaultProps,
            event: {
              ...sessionEvent,
              opponent_team: { id: 30, name: 'Test Opposing Team Name' },
            },
            withMetaInformation: true,
          },
        });
        expect(screen.getByText('Test Opposing Team Name')).toBeInTheDocument();
      });

      it('renders specific meta data', () => {
        renderComponent({
          props: {
            ...defaultProps,
            event: {
              ...sessionEvent,
              field_condition: { id: 5, name: 'Test Field Condition' },
              temperature: 19,
              humidity: 13,
              opponent_team: { id: 3, name: 'Test Opposing Team Name' },
            },
            withMetaInformation: true,
          },
        });
        expect(screen.getByText('19 °C')).toBeInTheDocument();
        expect(screen.getByText('Test Field Condition')).toBeInTheDocument();
        expect(screen.getByText('13%')).toBeInTheDocument();
        expect(screen.getByText('Test Opposing Team Name')).toBeInTheDocument();
      });

      it('doesn’t show a field condition name if it’s not an object', () => {
        renderComponent({
          props: {
            ...defaultProps,
            event: {
              ...sessionEvent,
              field_condition: 5,
            },
            withMetaInformation: true,
          },
        });

        expect(
          screen.queryByText('Test Field Condition')
        ).not.toBeInTheDocument();
      });
    });

    it('does not render meta information when the event does not contain them', () => {
      renderComponent({
        props: {
          ...defaultProps,
          event: {
            id: '454565',
            type: 'session_event',
            session_type: { id: 1, name: 'Speed' },
          },
          withMetaInformation: true,
        },
      });

      expect(screen.getByTestId('AppHeader|metaInformations')).toBeEmpty();
    });

    describe('[Feature Flag planning-game-events-tab-v-2] is on', () => {
      beforeEach(() => {
        window.featureFlags['planning-game-events-tab-v-2'] = true;
      });

      afterEach(() => {
        window.featureFlags['planning-game-events-tab-v-2'] = false;
      });

      it('has a main button "Edit Details" in session', () => {
        renderComponent({});
        expect(
          screen.getByRole('button', {
            name: 'Edit details',
          })
        ).toBeInTheDocument();
      });

      it('has a main button "Add Athletes" in session', () => {
        renderComponent({
          props: {
            ...defaultProps,
            event: {
              id: '454565',
              type: 'game_event',
              session_type: { id: 1, name: 'Speed' },
            },
          },
        });
        expect(screen.getByText('Add Athletes')).toBeInTheDocument();
      });
    });
    describe('[FF event-attachments] is on', () => {
      beforeEach(() => {
        window.featureFlags['event-attachments'] = true;
      });

      afterEach(() => {
        window.featureFlags['event-attachments'] = false;
      });

      it('shows attachments if they exist on the event', () => {
        const eventAttachments = {
          ...sessionEvent,
          attachments: [
            {
              attachment: {
                name: 'custom title',
                filename: 'my file name',
                download_url: 'my url',
                filetype: 'movie',
                confirmed: true,
              },
            },
          ],
        };
        renderComponent({
          props: {
            ...defaultProps,
            event: eventAttachments,
          },
        });
        const header = screen.getByTestId('EventAttachments|AppHeader');

        expect(within(header).getByText('Attachments')).toBeInTheDocument();
        expect(within(header).getByText('custom title')).toBeInTheDocument();
        expect(within(header).queryByText('Links')).not.toBeInTheDocument();
      });

      it('shows links if they exist on the event', () => {
        const eventAttachments = {
          ...sessionEvent,
          attached_links: [
            {
              attached_link: { title: 'custom link title', uri: 'google.com' },
            },
          ],
        };
        renderComponent({
          props: {
            ...defaultProps,
            event: eventAttachments,
          },
        });
        const header = screen.getByTestId('EventAttachments|AppHeader');

        expect(within(header).getByText('Links')).toBeInTheDocument();
        expect(
          within(header).getByText('custom link title')
        ).toBeInTheDocument();
        expect(
          within(header).queryByText('Attachments')
        ).not.toBeInTheDocument();
      });

      it('shows links and files if they both exist', () => {
        const eventAttachments = {
          ...sessionEvent,
          attached_links: [
            {
              attached_link: { title: 'custom link title', uri: 'google.com' },
            },
            { attached_link: { title: 'kitman labs', uri: 'kitmanlabs.com' } },
          ],
          attachments: [
            {
              attachment: {
                name: 'an example file',
                filename: 'my file name',
                download_url: 'my url',
                filetype: 'movie',
                confirmed: true,
              },
            },
          ],
        };
        renderComponent({
          props: {
            ...defaultProps,
            event: eventAttachments,
          },
        });
        const header = screen.getByTestId('EventAttachments|AppHeader');

        expect(within(header).getByText('Links')).toBeInTheDocument();
        expect(
          within(header).getByText('custom link title')
        ).toBeInTheDocument();
        expect(within(header).getByText('kitman labs')).toBeInTheDocument();
        expect(within(header).getByText('Attachments')).toBeInTheDocument();
        expect(within(header).getByText('an example file')).toBeInTheDocument();
      });
    });
  });

  describe('when the event is a custom event', () => {
    const customTitle = 'Nutrition Sync - Player 2 Lexie';
    const customEvent = {
      custom_event_type: customEventTypes[0],
      id: 12345,
      name: customTitle,
      start_date: '2023-08-29T17:55:00Z',
      end_date: '2023-08-29T18:55:00Z',
      duration: 60,
      type: 'custom_event',
      local_timezone: 'Europe/Dublin',
      created_at: '2023-08-15T17:55:30Z',
      updated_at: '2023-08-15T17:55:30Z',
      description: null,
      attachments: [],
      attached_links: [],
      event_location: {
        id: 4,
        parent_id: null,
        parent_event_location_id: null,
        name: 'Etihad Campus',
        description: null,
        location_type: 'training_facility',
        address: null,
        uri: null,
        metadata: null,
        active: true,
        public: false,
        owner_organisation: {
          id: 6,
          handle: 'kitman',
          name: 'Kitman Rugby Club',
        },
        created_by: null,
        event_types: [],
        organisations: [],
        parent_associations: [],
        sports: [],
        parents: [],
      },
    };

    it('renders the correct header content', () => {
      renderComponent({
        props: {
          ...defaultProps,
          event: customEvent,
        },
      });

      // the name of the custom event
      expect(screen.getByText(customTitle)).toBeInTheDocument();

      // date and duration information
      expect(
        screen.getByText(
          'August 29, 2023 5:55 PM, (6:55 pm Europe/Dublin) (60 min)'
        )
      ).toBeInTheDocument();

      // the name of the custom event type the user selected
      expect(
        screen.getByText(customEvent.custom_event_type.name)
      ).toBeInTheDocument();
      expect(screen.queryByText(squad.name)).not.toBeInTheDocument();
    });

    it('renders the Delete button and Delete modal when clicked and canDeleteEvent is true', async () => {
      const user = userEvent.setup();
      renderComponent({
        props: {
          ...defaultProps,
          event: customEvent,
        },
      });
      await user.click(screen.getAllByRole('button')[1]);
      await user.click(
        screen.getByRole('button', {
          name: 'Delete',
        })
      );
      expect(
        screen.getByText(
          'This will result in loss of participation data and any inputted data on this event. Action cannot be undone.'
        )
      ).toBeInTheDocument();
    });

    it('does not render the Delete button when canDeleteEvent is false', async () => {
      const user = userEvent.setup();
      renderComponent({
        props: {
          ...defaultProps,
          event: customEvent,
          canDeleteEvent: false,
        },
      });
      await user.click(screen.getAllByRole('button')[1]);
      expect(
        screen.queryByRole('button', {
          name: 'Delete',
        })
      ).not.toBeInTheDocument();
    });

    it('renders edit details button when canEditEvent is true', async () => {
      renderComponent({
        props: {
          ...defaultProps,
          event: customEvent,
        },
      });
      expect(
        screen.getByRole('button', {
          name: 'Edit details',
        })
      ).toBeInTheDocument();
    });

    it('does not render edit details button when canEditEvent is false', async () => {
      renderComponent({
        props: {
          ...defaultProps,
          event: customEvent,
          canEditEvent: false,
        },
      });
      expect(
        screen.queryByRole('button', {
          name: 'Edit details',
        })
      ).not.toBeInTheDocument();
    });
  });

  describe('calendar-back-button-in-events FF', () => {
    describe('is on', () => {
      beforeAll(() => {
        window.featureFlags['calendar-back-button-in-events'] = true;
      });

      afterAll(() => {
        window.featureFlags['calendar-back-button-in-events'] = false;
      });

      it('shows ‘Calendar’ button which brings back to the calendar page', async () => {
        Object.defineProperty(window, 'location', {
          value: { href: '', pathname: '' },
          configurable: true,
        });

        const user = userEvent.setup();
        renderComponent({
          props: {
            ...defaultProps,
            event: {
              custom_event_type: customEventTypes[0],
              id: 12345,
              name: 'name',
              start_date: '2023-08-29T17:55:00Z',
              end_date: '2023-08-29T18:55:00Z',
              duration: 60,
              type: 'custom_event',
              local_timezone: 'Europe/Dublin',
              created_at: '2023-08-15T17:55:30Z',
              updated_at: '2023-08-15T17:55:30Z',
            },
            canEditEvent: false,
          },
        });

        await user.click(screen.getByRole('button', { name: 'Calendar' }));

        expect(window.location.href).toEqual(
          '/calendar?date=2023-08-29T17%3A55%3A00Z'
        );
      });
    });

    describe('is off', () => {
      it('doesn’t show ‘Calendar’ button', () => {
        renderComponent({
          props: {
            ...defaultProps,
            event: {
              custom_event_type: customEventTypes[0],
              id: 12345,
              name: 'name',
              start_date: '2023-08-29T17:55:00Z',
              end_date: '2023-08-29T18:55:00Z',
              duration: 60,
              type: 'custom_event',
              local_timezone: 'Europe/Dublin',
              created_at: '2023-08-15T17:55:30Z',
              updated_at: '2023-08-15T17:55:30Z',
            },
            canEditEvent: false,
          },
        });

        expect(
          screen.queryByRole('button', { name: 'Calendar' })
        ).not.toBeInTheDocument();
      });
    });
  });
});
