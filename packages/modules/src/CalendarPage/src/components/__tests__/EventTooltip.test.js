/* eslint-disable jest-dom/prefer-enabled-disabled */
import { RRule } from 'rrule';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { useGetActiveSquadQuery } from '@kitman/common/src/redux/global/services/globalApi';
import useLeagueOperations from '@kitman/common/src/hooks/useLeagueOperations';
import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { data as mockSquads } from '@kitman/services/src/mocks/handlers/getPermittedSquads';
import { interpolateRRuleIntoDisplayableText } from '@kitman/modules/src/PlanningEventSidePanel/src/components/common/RepeatEvent/RepeatEventCustomConfigModal/utils/config-helpers';
import { getIsRepeatEvent } from '@kitman/common/src/utils/events';

import EventTooltip from '../EventTooltip';
import { repeatEventRecurrenceTestId } from '../EventTooltip/consts';

jest.mock('@kitman/common/src/redux/global/services/globalApi', () => ({
  ...jest.requireActual('@kitman/common/src/redux/global/services/globalApi'),
  useGetActiveSquadQuery: jest.fn(),
}));
jest.mock('@kitman/common/src/hooks/useLeagueOperations');
jest.mock('@kitman/common/src/contexts/PreferenceContext/preferenceContext');
jest.mock('@kitman/common/src/contexts/PermissionsContext');
jest.mock('@kitman/common/src/utils/events');

describe('<EventTooltip />', () => {
  const t = i18nextTranslateStub();
  const squad = mockSquads[0];

  const emptyRecurrence = {
    rule: null,
    original_start_time: null,
    recurring_event_id: null,
    rrule_instances: null,
  };

  const color = '#FF0000';

  const commonEventAttributes = {
    backgroundColor: color,
    borderColor: color,
    start: '2021-09-15T23:00:00Z',
    title: 'My title',
  };
  const existingEventCommonAttributes = {
    id: '112',
    url: '/planning_hub/events/112',
  };

  const calendarEvent = {
    ...commonEventAttributes,
    ...existingEventCommonAttributes,
    extendedProps: {
      description: 'My description',
      eventCollectionComplete: false,
      type: 'TRAINING_SESSION',
      squad,
      recurrence: {
        ...emptyRecurrence,
      },
    },
  };

  const calendarGameEvent = {
    ...commonEventAttributes,
    ...existingEventCommonAttributes,
    extendedProps: {
      description: 'My description',
      eventCollectionComplete: false,
      type: 'GAME',
      squad,
      recurrence: {
        ...emptyRecurrence,
        league_setup: true,
      },
    },
  };

  const calendarEventDifferentSquad = {
    ...calendarEvent,
    extendedProps: {
      ...calendarEvent.extendedProps,
      squad: mockSquads[1],
    },
  };

  const newEvent = {
    ...commonEventAttributes,
    extendedProps: {
      incompleteEvent: true,
      eventCollectionComplete: false,
      type: 'UNKNOWN',
      recurrence: { ...emptyRecurrence },
    },
  };

  const existingCustomEvent = {
    ...commonEventAttributes,
    ...existingEventCommonAttributes,
    extendedProps: {
      description: 'My description',
      incompleteEvent: false,
      eventCollectionComplete: true,
      type: 'CUSTOM_EVENT',
      visibilityIds: [12345],
      squad,
      recurrence: { ...emptyRecurrence },
    },
  };

  const props = {
    active: true,
    canCreateGames: true,
    canEditGames: true,
    canDeleteGames: true,
    isTrainingSessionsAdmin: true,
    customEventPermissions: {},
    currentUserId: 1,
    calendarEvent,
    onClickOutside: jest.fn(),
    onDeleteEvent: jest.fn(),
    onDuplicateEvent: jest.fn(),
    onEditEvent: jest.fn(),
    onEditNewEvent: jest.fn(),
    t,
  };

  const deleteButtonText = 'Delete';
  const editButtonText = 'Edit';
  const moreDetailsButtonText = 'More details';
  const duplicateButtonText = 'Duplicate';
  const trainingSessionButtonText = 'Session';
  const gameButtonText = 'Game';
  const customEventButtonText = 'Event';

  let tippyTargetElement;
  let container;

  const tippyTargetElementId = 'tippyTargetElement';
  const containerClassName = 'fc-view-harness';

  const renderComponent = (extraProps) => {
    return renderWithRedux(
      <EventTooltip {...props} element={tippyTargetElement} {...extraProps} />,
      {
        preloadedState: {},
        useGlobalStore: true,
      }
    );
  };
  const renderDefaultHooks = () => {
    usePreferences.mockReturnValue({ preferences: {} });
    usePermissions.mockReturnValue({ permissions: {} });
  };

  beforeEach(() => {
    useGetActiveSquadQuery.mockReturnValue({
      data: {
        ...squad,
        owner_id: 1234,
      },
      isSuccess: true,
    });
    getIsRepeatEvent.mockReturnValue(false);
    container = document.createElement('div');
    container.setAttribute('class', containerClassName);
    document.body.appendChild(container);

    tippyTargetElement = document.createElement('div');
    tippyTargetElement.setAttribute('id', tippyTargetElementId);
    document.body.appendChild(tippyTargetElement);
  });

  afterEach(() => {
    const existingDiv = document.getElementById(tippyTargetElementId);
    if (existingDiv) {
      document.body.removeChild(existingDiv);
    }

    const existingContainer =
      document.getElementsByClassName(containerClassName);
    if (existingContainer.length > 0) {
      document.body.removeChild(existingContainer[0]);
    }
  });

  it('renders a tippy component with event content', async () => {
    useLeagueOperations.mockReturnValue({ isLeague: false });
    renderDefaultHooks();
    renderComponent();

    expect(await screen.findByText(calendarEvent.title)).toBeInTheDocument();
    expect(
      screen.queryByText(calendarEvent.extendedProps.squad.name)
    ).not.toBeInTheDocument();

    expect(
      screen.getByText(calendarEvent.extendedProps.description)
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: deleteButtonText })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: editButtonText })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: moreDetailsButtonText })
    ).toBeInTheDocument();
  });

  it('Edit button is not disabled', () => {
    useLeagueOperations.mockReturnValue({ isLeague: true });
    renderDefaultHooks();
    renderComponent();

    const editButton = screen.getByRole('button', { name: /edit/i });

    expect(editButton).not.toBeDisabled();
  });

  it('Edit button is not disabled, when preferences and permissions are enabled', () => {
    useLeagueOperations.mockReturnValue({ isLeague: true });
    usePreferences.mockReturnValue({
      preferences: { league_game_schedule: true },
    });
    usePermissions.mockReturnValue({
      permissions: { leagueGame: { manageGameTeam: true } },
    });
    renderComponent();

    const editButton = screen.getByRole('button', { name: /edit/i });

    expect(editButton).not.toBeDisabled();
  });

  it('shows the squad name if the optimized-calendar FF is on', async () => {
    window.featureFlags['optimized-calendar'] = true;
    renderComponent();

    expect(
      await screen.findByText(calendarEvent.extendedProps.squad.name)
    ).toBeInTheDocument();

    window.featureFlags['optimized-calendar'] = false;
  });

  it('calls the onEditEvent callback when button pressed', async () => {
    renderComponent();

    await userEvent.click(screen.getByRole('button', { name: editButtonText }));

    expect(props.onEditEvent).toHaveBeenCalled();
  });

  it('does not show the Edit button if not an admin', async () => {
    renderComponent({ isTrainingSessionsAdmin: false });
    await waitFor(() => {
      expect(
        screen.queryByRole('button', { name: editButtonText })
      ).not.toBeInTheDocument();
    });

    expect(
      screen.getByRole('button', { name: moreDetailsButtonText })
    ).toBeInTheDocument();
  });

  describe('when calendar-web-drag-n-drop and calendar-duplicate-event flags are on', () => {
    beforeEach(() => {
      window.featureFlags['calendar-web-drag-n-drop'] = true;
      window.setFlag('calendar-duplicate-event', true);
    });

    afterEach(() => {
      window.featureFlags['calendar-web-drag-n-drop'] = false;
      window.setFlag('calendar-duplicate-event', false);
    });

    it('does not show the Edit, duplicate, delete buttons if not an admin', async () => {
      renderComponent({ isTrainingSessionsAdmin: false });

      await waitFor(() => {
        expect(
          screen.queryByRole('button', { name: editButtonText })
        ).not.toBeInTheDocument();
        expect(
          screen.queryByRole('button', { name: deleteButtonText })
        ).not.toBeInTheDocument();
        expect(
          screen.queryByRole('button', { name: duplicateButtonText })
        ).not.toBeInTheDocument();
      });

      expect(
        screen.getByRole('button', { name: moreDetailsButtonText })
      ).toBeInTheDocument();
    });

    it('does not show the Duplicate button when can create games and games admin is false and the event is of type game', async () => {
      useLeagueOperations.mockReturnValue({ isLeague: false });
      usePreferences.mockReturnValue({
        preferences: { league_game_schedule: false },
      });
      usePermissions.mockReturnValue({
        permissions: { leagueGame: { manageGameTeam: true } },
      });
      renderComponent({
        calendarEvent: {
          ...calendarEvent,
          extendedProps: { type: 'GAME', squad },
        },
        canCreateGames: false,
        isGamesAdmin: false,
      });

      await waitFor(() => {
        expect(
          screen.queryByRole('button', { name: duplicateButtonText })
        ).not.toBeInTheDocument();
      });
    });

    it('calls the onDeleteEvent callback when button pressed', async () => {
      renderComponent();

      await userEvent.click(
        screen.getByRole('button', { name: deleteButtonText })
      );

      expect(props.onDeleteEvent).toHaveBeenCalled();
    });

    it('calls the onDuplicateEvent callback when button pressed', async () => {
      renderComponent();
      await userEvent.click(
        screen.getByRole('button', { name: duplicateButtonText })
      );

      expect(props.onDuplicateEvent).toHaveBeenCalled();
    });
  });

  describe('when calendar-duplicate-event flag is off', () => {
    beforeEach(() => {
      window.setFlag('calendar-duplicate-event', false);
    });

    it('does not show the duplicate button', async () => {
      renderComponent({ isTrainingSessionsAdmin: true });
      await waitFor(() => {
        expect(
          screen.queryByRole('button', { name: duplicateButtonText })
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('When a new event', () => {
    it('renders a tippy component with event content', async () => {
      renderComponent({ calendarEvent: newEvent });

      expect(
        await screen.findByRole('button', { name: trainingSessionButtonText })
      ).toBeInTheDocument();

      expect(
        screen.getByRole('button', { name: gameButtonText })
      ).toBeInTheDocument();

      expect(
        screen.queryByRole('button', { name: duplicateButtonText })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: deleteButtonText })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: editButtonText })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: moreDetailsButtonText })
      ).not.toBeInTheDocument();
    });

    it('calls the onEditNewEvent callback when SegmentedControl pressed', async () => {
      renderComponent({ calendarEvent: newEvent });
      await userEvent.click(
        await screen.findByRole('button', { name: gameButtonText })
      );

      expect(props.onEditNewEvent).toHaveBeenCalledWith('game_event');
    });

    it('hides the new game button when can create games and games admin is false', async () => {
      renderComponent({
        calendarEvent: newEvent,
        canCreateGames: false,
        isGamesAdmin: false,
      });

      expect(
        await screen.findByRole('button', { name: trainingSessionButtonText })
      ).toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: gameButtonText })
      ).not.toBeInTheDocument();
    });

    it("renders more details button when isTsoEvent is true (extendedProps.type === 'EVENT')", async () => {
      renderComponent({
        calendarEvent: {
          ...newEvent,
          url: 'test/url',
          extendedProps: { type: 'EVENT', squad },
        },
      });
      expect(
        await screen.findByRole('button', { name: moreDetailsButtonText })
      ).toBeInTheDocument();
    });
  });

  describe('Custom Events', () => {
    it('should not contain the custom event option because permission is false', async () => {
      renderComponent({ calendarEvent: newEvent });
      await waitFor(() => {
        expect(
          screen.queryByRole('button', { name: customEventButtonText })
        ).not.toBeInTheDocument();
      });
    });
    it('should contain the custom event option when create is true', async () => {
      renderComponent({
        calendarEvent: newEvent,
        customEventPermissions: {
          canCreate: true,
          canEdit: false,
          canDelete: false,
        },
      });

      expect(
        await screen.findByRole('button', { name: customEventButtonText })
      ).toBeInTheDocument();
    });

    describe('repeat event recurrence rule', () => {
      beforeEach(() => {
        window.featureFlags['custom-events'] = true;
      });

      afterEach(() => {
        window.featureFlags['custom-events'] = false;
      });
      const customEventPermissions = {
        canCreate: true,
        canEdit: true,
        canDelete: true,
      };

      it('should not show the rule or icon because getIsRepeatEvent is false', () => {
        renderComponent({
          calendarEvent: existingCustomEvent,
          customEventPermissions,
        });

        expect(
          screen.queryByTestId(repeatEventRecurrenceTestId)
        ).not.toBeInTheDocument();
        expect(
          screen.queryByTestId('SyncOutlinedIcon')
        ).not.toBeInTheDocument();
      });

      it('should show the rule and icon because getIsRepeatEvent is true', async () => {
        getIsRepeatEvent.mockReturnValue(true);
        const rule = 'DTSTART:20240319T080000\nRRULE:FREQ=DAILY';
        renderComponent({
          calendarEvent: {
            ...existingCustomEvent,
            extendedProps: {
              ...existingCustomEvent.extendedProps,
              recurrence: {
                ...existingCustomEvent.extendedProps.recurrence,
                rule,
              },
            },
          },
          customEventPermissions,
        });

        expect(
          await screen.findByText(
            interpolateRRuleIntoDisplayableText(RRule.fromString(rule), t)
          )
        ).toBeInTheDocument();
        expect(screen.getByTestId('SyncOutlinedIcon')).toBeInTheDocument();
      });

      it('should render description if session is NOT virtual', async () => {
        getIsRepeatEvent.mockReturnValue(true);
        const rule = 'DTSTART:20240319T080000\nRRULE:FREQ=DAILY';
        renderComponent({
          calendarEvent: {
            ...existingCustomEvent,
            extendedProps: {
              ...existingCustomEvent.extendedProps,
              recurrence: {
                ...existingCustomEvent.extendedProps.recurrence,
                rule,
              },
              isVirtualEvent: false,
              type: 'TRAINING_SESSION',
            },
          },
          customEventPermissions,
        });

        expect(
          screen.getByText(existingCustomEvent.extendedProps.description)
        ).toBeInTheDocument();
      });

      it('should render description if session is virtual and description is in recurrence preferences', async () => {
        getIsRepeatEvent.mockReturnValue(true);
        const rule = 'DTSTART:20240319T080000\nRRULE:FREQ=DAILY';
        renderComponent({
          calendarEvent: {
            ...existingCustomEvent,
            extendedProps: {
              ...existingCustomEvent.extendedProps,
              recurrence: {
                ...existingCustomEvent.extendedProps.recurrence,
                rule,
                preferences: [{ id: 1, perma_id: 'description' }],
              },
              isVirtualEvent: true,
              type: 'TRAINING_SESSION',
            },
          },
          customEventPermissions,
        });

        expect(
          screen.getByText(existingCustomEvent.extendedProps.description)
        ).toBeInTheDocument();
      });

      it('should NOT render description if session is virtual and description is NOT in recurrence preferences', async () => {
        getIsRepeatEvent.mockReturnValue(true);
        const rule = 'DTSTART:20240319T080000\nRRULE:FREQ=DAILY';
        renderComponent({
          calendarEvent: {
            ...existingCustomEvent,
            extendedProps: {
              ...existingCustomEvent.extendedProps,
              recurrence: {
                ...existingCustomEvent.extendedProps.recurrence,
                rule,
                preferences: [{ id: 1, perma_id: 'surface_type' }],
              },
              isVirtualEvent: true,
              type: 'TRAINING_SESSION',
            },
          },
          customEventPermissions,
        });

        expect(
          screen.queryByText(existingCustomEvent.extendedProps.description)
        ).not.toBeInTheDocument();
      });

      it('should render description if event type is custom event', async () => {
        getIsRepeatEvent.mockReturnValue(true);
        const rule = 'DTSTART:20240319T080000\nRRULE:FREQ=DAILY';
        renderComponent({
          calendarEvent: {
            ...existingCustomEvent,
            extendedProps: {
              ...existingCustomEvent.extendedProps,
              recurrence: {
                ...existingCustomEvent.extendedProps.recurrence,
                rule,
                preferences: [{ id: 1, perma_id: 'surface_type' }],
              },
              isVirtualEvent: true,
            },
          },
          customEventPermissions,
        });

        expect(
          screen.getByText(existingCustomEvent.extendedProps.description)
        ).toBeInTheDocument();
      });
    });

    it('for an existing event, when the staff visibility FF is off, all buttons should show', async () => {
      renderComponent({
        calendarEvent: existingCustomEvent,
        customEventPermissions: {
          canCreate: true,
          canEdit: true,
          canDelete: true,
        },
      });

      expect(
        await screen.findByRole('button', { name: deleteButtonText })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: editButtonText })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: moreDetailsButtonText })
      ).toBeInTheDocument();
    });

    describe('when the staff visibility FF is on', () => {
      beforeEach(() => {
        window.featureFlags['custom-events'] = true;
        window.featureFlags['staff-visibility-custom-events'] = true;
      });

      afterEach(() => {
        window.featureFlags['custom-events'] = false;
        window.featureFlags['staff-visibility-custom-events'] = false;
      });
      it('should not contain any footer buttons if the current user is not in the visibility array', async () => {
        renderComponent({
          calendarEvent: existingCustomEvent,
          currentUserId: 9876,
        });

        await waitFor(() => {
          expect(
            screen.queryByRole('button', { name: deleteButtonText })
          ).not.toBeInTheDocument();
          expect(
            screen.queryByRole('button', { name: editButtonText })
          ).not.toBeInTheDocument();
          expect(
            screen.queryByRole('button', { name: moreDetailsButtonText })
          ).not.toBeInTheDocument();
        });
      });

      it('should contain all footer buttons if the current user is not in the visibility array BUT is a super admin', async () => {
        renderComponent({
          calendarEvent: existingCustomEvent,
          currentUserId: 9876,
          customEventPermissions: {
            canCreate: true,
            canEdit: true,
            canDelete: true,
            isSuperAdmin: true,
          },
        });

        expect(
          await screen.findByRole('button', { name: deleteButtonText })
        ).toBeInTheDocument();
        expect(
          screen.getByRole('button', { name: editButtonText })
        ).toBeInTheDocument();
        expect(
          screen.getByRole('button', { name: moreDetailsButtonText })
        ).toBeInTheDocument();
      });

      it('should contain the more details button if the current user is in the visibility array', async () => {
        renderComponent({
          calendarEvent: existingCustomEvent,
          currentUserId: existingCustomEvent.extendedProps.visibilityIds[0],
        });

        expect(
          await screen.findByRole('button', { name: moreDetailsButtonText })
        ).toBeInTheDocument();
        expect(
          screen.queryByRole('button', { name: editButtonText })
        ).not.toBeInTheDocument();
        expect(
          screen.queryByRole('button', { name: deleteButtonText })
        ).not.toBeInTheDocument();
      });

      it('should contain the edit and delete buttons if the current user is in the visibility array and they have permissions', async () => {
        renderComponent({
          calendarEvent: existingCustomEvent,
          currentUserId: existingCustomEvent.extendedProps.visibilityIds[0],
          customEventPermissions: {
            canCreate: true,
            canEdit: true,
            canDelete: true,
            isSuperAdmin: false,
          },
        });

        expect(
          await screen.findByRole('button', { name: moreDetailsButtonText })
        ).toBeInTheDocument();
        expect(
          await screen.findByRole('button', { name: editButtonText })
        ).toBeInTheDocument();
        expect(
          screen.getByRole('button', { name: deleteButtonText })
        ).toBeInTheDocument();
      });

      it('should contain all buttons when user is a super admin and in visibility array', async () => {
        renderComponent({
          calendarEvent: existingCustomEvent,
          currentUserId: existingCustomEvent.extendedProps.visibilityIds[0],
          customEventPermissions: {
            canCreate: true,
            canEdit: true,
            canDelete: true,
            isSuperAdmin: true,
          },
        });

        expect(
          await screen.findByRole('button', { name: deleteButtonText })
        ).toBeInTheDocument();
        expect(
          screen.getByRole('button', { name: editButtonText })
        ).toBeInTheDocument();
        expect(
          screen.getByRole('button', { name: moreDetailsButtonText })
        ).toBeInTheDocument();
      });
    });
  });

  describe('testing event collection complete FF', () => {
    const checkboxIconId = 'CheckBoxIcon';
    const emptyCheckBoxBlockId = 'emptyCheckBoxBlock';

    beforeEach(() => {
      window.setFlag('event-collection-complete', true);
    });

    afterEach(() => {
      window.setFlag('event-collection-complete', false);
    });

    const trainingCalendarEventMarkedComplete = {
      calendarEvent: {
        ...calendarEvent,
        extendedProps: {
          ...calendarEvent.extendedProps,
          eventCollectionComplete: true,
        },
      },
    };

    const calendarGameEventMarkedComplete = {
      calendarEvent: {
        ...calendarGameEvent,
        extendedProps: {
          ...calendarGameEvent.extendedProps,
          eventCollectionComplete: true,
        },
      },
    };

    it('correctly displays checkbox when a session is marked as complete', () => {
      renderComponent(trainingCalendarEventMarkedComplete);
      expect(screen.getByTestId(checkboxIconId)).toHaveStyle({
        color,
      });
    });

    it('correctly displays checkbox when a game is marked as complete', () => {
      renderComponent(calendarGameEventMarkedComplete);
      expect(screen.getByTestId(checkboxIconId)).toHaveStyle({
        color,
      });
    });

    it('correctly displays empty block when a training session is marked as incomplete', () => {
      renderComponent();
      expect(screen.getByTestId(emptyCheckBoxBlockId)).toHaveStyle({
        backgroundColor: color,
      });
    });

    it('correctly displays empty block when a game is marked as incomplete', () => {
      renderComponent(calendarGameEvent);
      expect(screen.getByTestId(emptyCheckBoxBlockId)).toHaveStyle({
        backgroundColor: color,
      });
    });

    it('does not display empty block for a training session when collection complete FF is off', () => {
      window.setFlag('event-collection-complete', false);
      renderComponent();
      expect(screen.queryByTestId(checkboxIconId)).not.toBeInTheDocument();
    });

    it('does not display empty block for a game when collection complete FF is off', () => {
      window.setFlag('event-collection-complete', false);
      renderComponent(calendarGameEvent);
      expect(screen.queryByTestId(checkboxIconId)).not.toBeInTheDocument();
    });

    it('does not display empty block when collection complete when event type is not TRAINING_SESSION or GAME', () => {
      renderComponent(existingCustomEvent);
      expect(screen.queryByTestId(checkboxIconId)).not.toBeInTheDocument();
    });
  });

  describe('event + its squad', () => {
    const wrongSquadMessage =
      'To edit/view this event, please change to the relevant squad.';

    it('should show the footer buttons because optimized-calendar FF is off', async () => {
      renderComponent();
      expect(
        await screen.findByRole('button', { name: deleteButtonText })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: editButtonText })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: moreDetailsButtonText })
      ).toBeInTheDocument();

      expect(screen.queryByText(wrongSquadMessage)).not.toBeInTheDocument();
    });

    describe('with optimized-calendar FF on', () => {
      beforeEach(() => {
        window.featureFlags['optimized-calendar'] = true;
      });
      afterEach(() => {
        window.featureFlags['optimized-calendar'] = false;
      });

      it('should show the footer buttons because the squads are identical', async () => {
        renderComponent();
        expect(
          await screen.findByRole('button', { name: deleteButtonText })
        ).toBeInTheDocument();
        expect(
          screen.getByRole('button', { name: editButtonText })
        ).toBeInTheDocument();
        expect(
          screen.getByRole('button', { name: moreDetailsButtonText })
        ).toBeInTheDocument();

        expect(screen.queryByText(wrongSquadMessage)).not.toBeInTheDocument();
      });

      it('should show the message because the user squad is different from the event squad', async () => {
        renderComponent({
          calendarEvent: calendarEventDifferentSquad,
        });
        expect(await screen.findByText(wrongSquadMessage)).toBeInTheDocument();
        expect(
          screen.queryByRole('button', { name: deleteButtonText })
        ).not.toBeInTheDocument();
        expect(
          screen.queryByRole('button', { name: editButtonText })
        ).not.toBeInTheDocument();
        expect(
          screen.queryByRole('button', { name: moreDetailsButtonText })
        ).not.toBeInTheDocument();
      });

      it('should not show any footer because it is a new event', async () => {
        renderComponent({
          calendarEvent: newEvent,
        });

        await waitFor(() => {
          expect(screen.queryByText(wrongSquadMessage)).not.toBeInTheDocument();
          expect(
            screen.queryByRole('button', { name: deleteButtonText })
          ).not.toBeInTheDocument();
          expect(
            screen.queryByRole('button', { name: editButtonText })
          ).not.toBeInTheDocument();
          expect(
            screen.queryByRole('button', { name: moreDetailsButtonText })
          ).not.toBeInTheDocument();
        });
      });
    });
  });

  describe('league game event tooltips', () => {
    const leagueCalendarGameEvent = {
      ...calendarGameEvent,
      extendedProps: { ...calendarGameEvent.extendedProps, leagueSetup: true },
    };

    it('Edit button is disabled if isDisabledForMatchDay true', () => {
      useLeagueOperations.mockReturnValue({ isLeague: false });
      renderDefaultHooks();
      usePreferences.mockReturnValue({
        preferences: { league_game_schedule: true },
      });
      usePermissions.mockReturnValue({
        permissions: { leagueGame: { manageGameTeam: true } },
      });
      renderComponent({
        calendarEvent: leagueCalendarGameEvent,
      });

      const editButton = screen.getByRole('button', { name: /edit/i });

      expect(editButton).toBeDisabled();
    });

    it('does not display a delete button for a club user on a league game event', async () => {
      useLeagueOperations.mockReturnValue({ isLeague: false });
      renderDefaultHooks();
      renderComponent({ calendarEvent: leagueCalendarGameEvent });
      await waitFor(() => {
        expect(
          screen.queryByRole('button', { name: deleteButtonText })
        ).not.toBeInTheDocument();
      });
    });

    it('does  display a delete button for a league user on a league game event', async () => {
      useLeagueOperations.mockReturnValue({ isLeague: true });
      renderDefaultHooks();
      renderComponent({ calendarEvent: leagueCalendarGameEvent });
      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: deleteButtonText })
        ).toBeInTheDocument();
      });
    });
  });
});
