import { venueTypes } from '@kitman/common/src/consts/gameEventConsts';
import {
  calculatePermission,
  checkCustomEventPermissionObject,
  getPlayerNumber,
  mapEventActivityGlobalState,
  getEventName,
  getPermission,
  updateClubAndLeagueEventsCompliance,
  getViewerPageLink,
} from '../utils';

describe('utils', () => {
  describe('calculatePermission', () => {
    const permissionList = ['create-custom-event', 'edit-custom-event'];

    beforeEach(() => {
      window.featureFlags['custom-events'] = false;
      window.featureFlags['staff-visibility-custom-events'] = false;
    });

    beforeEach(() => {
      window.featureFlags['custom-events'] = false;
      window.featureFlags['staff-visibility-custom-events'] = false;
    });
    describe('when custom events FF is off', () => {
      it('returns false regardless of permission status', () => {
        const result = calculatePermission(
          permissionList,
          'create-custom-event'
        );
        expect(result).toBe(false);
      });
    });
    describe('when custom events FF is on', () => {
      beforeEach(() => {
        window.featureFlags['custom-events'] = true;
      });
      describe('when staff visibility FF is off', () => {
        it('returns a true permission regardless of permission status', () => {
          const result = calculatePermission(
            ['create-custom-event'],
            'create-custom-event'
          );
          expect(result).toBe(true);
        });
      });
      describe('when staff visibility FF is on', () => {
        beforeEach(() => {
          window.featureFlags['staff-visibility-custom-events'] = true;
        });
        it('returns true if the permission is in the list', () => {
          const result = calculatePermission(
            permissionList,
            'create-custom-event'
          );
          expect(result).toBe(true);
        });

        it('returns false if the permission is not the list', () => {
          const result = calculatePermission(
            permissionList,
            'delete-custom-event'
          );
          expect(result).toBe(false);
        });
      });
    });
  });

  describe('checkCustomEventPermissionObject', () => {
    describe('when custom events FF is off', () => {
      it('returns false regardless of permission status', () => {
        window.featureFlags['custom-events'] = false;
        const result = checkCustomEventPermissionObject(
          { canCreateCustomEventCalendar: true },
          'canCreateCustomEventCalendar'
        );
        expect(result).toBe(false);
      });
    });

    describe('when custom events FF is on', () => {
      beforeEach(() => {
        window.featureFlags['custom-events'] = true;
      });

      afterEach(() => {
        window.featureFlags['custom-events'] = false;
      });
      describe('when staff visibility is off', () => {
        it('returns true as the default', () => {
          window.featureFlags['staff-visibility-custom-events'] = false;
          const result = checkCustomEventPermissionObject(
            { canCreateCustomEventCalendar: false },
            'canCreateCustomEventCalendar'
          );
          expect(result).toBe(true);
        });
      });

      describe('when staff visibility is on', () => {
        beforeEach(() => {
          window.featureFlags['staff-visibility-custom-events'] = true;
        });

        afterEach(() => {
          window.featureFlags['staff-visibility-custom-events'] = false;
        });

        it('returns true if one of the options is true - they are super admin', () => {
          const result = checkCustomEventPermissionObject(
            {
              canCreateCustomEventCalendar: false,
              isSuperAdminCustomEventCalendar: true,
            },
            'canCreateCustomEventCalendar'
          );
          expect(result).toBe(true);
        });

        it('returns true if one of the options is true - they are not super admin', () => {
          const result = checkCustomEventPermissionObject(
            {
              canCreateCustomEventCalendar: true,
              isSuperAdminCustomEventCalendar: false,
            },
            'canCreateCustomEventCalendar'
          );
          expect(result).toBe(true);
        });
        it('returns false if both of the options are false', () => {
          const result = checkCustomEventPermissionObject(
            {
              canCreateCustomEventCalendar: false,
              isSuperAdminCustomEventCalendar: false,
            },
            'canCreateCustomEventCalendar'
          );
          expect(result).toBe(false);
        });
      });
    });
  });

  describe('getPlayerNumber', () => {
    it('returns the squad_number if  available', () => {
      expect(getPlayerNumber(20)).toEqual('#20');
    });

    it('returns a 0 if a player number is the 0 value', () => {
      expect(getPlayerNumber(0)).toEqual('#0');
    });

    it('returns a 00 if a player number is the -1 value', () => {
      expect(getPlayerNumber(-1)).toEqual('#00');
    });

    it('returns a hash if no player number is available', () => {
      expect(getPlayerNumber(null)).toEqual('#');
    });
  });

  describe('mapEventActivityGlobalState', () => {
    it('maps data correctly', () => {
      expect(
        mapEventActivityGlobalState([
          {
            event_activity_id: 2,
            state: 'all_in',
            count: 1,
            total_count: 3,
          },
        ])
      ).toEqual([
        {
          eventActivityId: 2,
          state: 'all_in',
          count: 1,
          totalCount: 3,
        },
      ]);
    });

    it('returns an empty array when called with an empty array', () => {
      expect(mapEventActivityGlobalState([])).toEqual([]);
    });
  });

  describe('getEventName', () => {
    const event = {
      name: 'Event Name',
      type: 'session_event',
      session_type: {
        name: 'Session Type Name',
      },
      organisation_team: {
        name: 'Organisation Team Name',
      },
      score: 0,
      opponent_score: 1,
      opponent_squad: {
        owner_name: 'Opponent Squad’s Owner Name',
        name: 'Opponent Squad Name',
      },
      opponent_team: {
        name: 'Opponent Team Name',
      },
      theme: {
        id: 1,
        name: 'Session Theme',
      },
    };

    const squadName = 'Squad Name';

    const tests = [
      // event.type equals ‘session_event’.
      [
        'event.type equals ‘session_event’',
        event.name,
        {
          event,
          squadName,
          isPitchViewToggleEnabled: false,
        },
      ],
      [
        'event.type equals ‘session_event’, and event.name is null',
        event.theme.name,
        {
          event: { ...event, name: null },
          squadName,
          isPitchViewToggleEnabled: false,
        },
      ],
      [
        'event.type equals ‘session_event’, and event.name and event.theme are null',
        event.session_type.name,
        {
          event: { ...event, name: null, theme: null },
          squadName,
          isPitchViewToggleEnabled: false,
        },
      ],

      // event.type equals ‘game_event’.
      [
        'event.type equals ‘game_event’',
        `${event.organisation_team.name} vs ${event.opponent_squad.name} ${event.opponent_squad.owner_name} (${event.score}-${event.opponent_score})`,
        {
          event: { ...event, type: 'game_event' },
          squadName,
          isPitchViewToggleEnabled: false,
        },
      ],
      [
        'event.type equals ‘game_event’ and event.opponent_squad is null',
        `${event.organisation_team.name} vs ${event.opponent_team.name} (${event.score}-${event.opponent_score})`,
        {
          event: { ...event, type: 'game_event', opponent_squad: null },
          squadName,
          isPitchViewToggleEnabled: false,
        },
      ],
      [
        'event.type equals ‘game_event’, and event.opponent_squad and event.opponent_squad are null',
        `${event.organisation_team.name} vs  (${event.score}-${event.opponent_score})`,
        {
          event: {
            ...event,
            type: 'game_event',
            opponent_squad: null,
            opponent_team: null,
          },
          squadName,
          isPitchViewToggleEnabled: false,
        },
      ],
      [
        'event.type equals ‘game_event’ and event.organisation_team is null',
        `${squadName} vs ${event.opponent_squad.name} ${event.opponent_squad.owner_name} (${event.score}-${event.opponent_score})`,
        {
          event: {
            ...event,
            type: 'game_event',
            organisation_team: null,
          },
          squadName,
          isPitchViewToggleEnabled: false,
        },
      ],
      [
        'event.type equals ‘game_event’ and event.score is null',
        `${event.organisation_team.name} vs ${event.opponent_squad.name} ${event.opponent_squad.owner_name} `,
        {
          event: {
            ...event,
            type: 'game_event',
            score: null,
          },
          squadName,
          isPitchViewToggleEnabled: false,
        },
      ],
      [
        'event.type equals ‘game_event’ and event.opponent_score is null',
        `${event.organisation_team.name} vs ${event.opponent_squad.name} ${event.opponent_squad.owner_name} `,
        {
          event: {
            ...event,
            type: 'game_event',
            opponent_score: null,
          },
          squadName,
          isPitchViewToggleEnabled: false,
        },
      ],
      [
        'event.type equals ‘game_event’, and event.score and event.opponent_score are null',
        `${event.organisation_team.name} vs ${event.opponent_squad.name} ${event.opponent_squad.owner_name} `,
        {
          event: {
            ...event,
            type: 'game_event',
            score: null,
            opponent_score: null,
          },
          squadName,
          isPitchViewToggleEnabled: false,
        },
      ],
      [
        'event.type equals ‘game_event’',
        `${event.organisation_team.name} vs ${event.opponent_squad.name} ${event.opponent_squad.owner_name} (${event.score}-${event.opponent_score})`,
        {
          event: { ...event, type: 'game_event' },
          squadName,
          isPitchViewToggleEnabled: false,
        },
      ],
      [
        'event.type equals ‘game_event’ and isPitchViewToggleEnabled equals ‘true’',
        `${event.organisation_team.name} v ${event.opponent_squad.name} ${event.opponent_squad.owner_name}`,
        {
          event: { ...event, type: 'game_event' },
          squadName,
          isPitchViewToggleEnabled: true,
        },
      ],

      // event.type is null.
      [
        'event.type is null',
        event.name,
        {
          event: {
            ...event,
            type: null,
          },
          squadName,
          isPitchViewToggleEnabled: false,
        },
      ],
      [
        'event.type and event.name are null',
        '',
        {
          event: {
            ...event,
            type: null,
            name: null,
          },
          squadName,
          isPitchViewToggleEnabled: false,
        },
      ],
    ];

    it.each(tests)('when %s, returns ‘%s’', (description, expected, arg) =>
      expect(getEventName(arg)).toEqual(expected)
    );
  });

  describe('getPermission', () => {
    it('returns false if permission name not supported', () => {
      expect(
        getPermission({
          name: 'test',
          event: { type: 'session_event' },
          permissions: {
            workloads: {
              trainingSessions: {
                canEdit: true,
              },
            },
          },
        })
      ).toBe(false);
      expect(
        getPermission({
          name: '',
          event: { type: 'session_event' },
          permissions: {
            workloads: {
              trainingSessions: {
                canEdit: true,
              },
            },
          },
        })
      ).toBe(false);
    });
    it('returns false when the event is undefined', () => {
      expect(
        getPermission({
          name: 'edit',
          event: undefined,
          permissions: {
            workloads: {
              trainingSessions: {
                canEdit: true,
              },
            },
          },
        })
      ).toBe(false);
    });
    it('returns false when the event has an undefined type', () => {
      expect(
        getPermission({
          name: 'edit',
          event: { type: undefined },
          permissions: {
            workloads: {
              trainingSessions: {
                canEdit: true,
              },
            },
          },
        })
      ).toBe(false);
    });
    it('returns false when the permissions are undefined', () => {
      expect(
        getPermission({
          name: 'edit',
          event: { type: 'session_event' },
          permissions: undefined,
        })
      ).toBe(false);
    });
    describe('edit permission', () => {
      it('returns true when the user has the edit permission', () => {
        expect(
          getPermission({
            name: 'edit',
            event: { type: 'session_event' },
            permissions: {
              workloads: {
                trainingSessions: {
                  canEdit: true,
                },
              },
            },
          })
        ).toBe(true);
        expect(
          getPermission({
            name: 'edit',
            event: { type: 'game_event' },
            permissions: {
              workloads: {
                games: {
                  canEdit: true,
                },
              },
            },
          })
        ).toBe(true);
        window.featureFlags['custom-events'] = true;
        expect(
          getPermission({
            name: 'edit',
            event: { type: 'custom_event' },
            permissions: {
              workloads: {
                games: {
                  canEdit: true,
                },
              },
            },
          })
        ).toBe(true);
      });
      it('return false for event with type custom_event if the custom-events feature flag is off', () => {
        window.featureFlags['custom-events'] = false;
        expect(
          getPermission({
            name: 'edit',
            event: { type: 'custom_event' },
            permissions: {
              workloads: {
                games: {
                  canEdit: true,
                },
              },
            },
          })
        ).toBe(false);
      });
    });

    describe('delete permission', () => {
      it('returns true when the user has the delete permission', () => {
        expect(
          getPermission({
            name: 'delete',
            event: { type: 'session_event' },
            permissions: {
              workloads: {
                trainingSessions: {
                  canDelete: true,
                },
              },
            },
          })
        ).toBe(true);
        expect(
          getPermission({
            name: 'delete',
            event: { type: 'game_event' },
            permissions: {
              workloads: {
                games: {
                  canDelete: true,
                },
              },
            },
          })
        ).toBe(true);
        window.featureFlags['custom-events'] = true;
        expect(
          getPermission({
            name: 'delete',
            event: { type: 'custom_event' },
            permissions: {
              workloads: {
                games: {
                  canDelete: true,
                },
              },
            },
          })
        ).toBe(true);
      });
      it('return false for event with type custom_event if the custom-events feature flag is off', () => {
        window.featureFlags['custom-events'] = false;
        expect(
          getPermission({
            name: 'delete',
            event: { type: 'custom_event' },
            permissions: {
              workloads: {
                games: {
                  canDelete: true,
                },
              },
            },
          })
        ).toBe(false);
      });
    });
  });

  describe('updateClubAndLeagueEventsCompliance', () => {
    const mockUpdatedEvent = {
      id: 1,
      type: 'game_event',
      dmr: ['lineup', 'captain'],
      venue_type: { name: venueTypes.home },
    };

    const mockClubUpdate = jest.fn();
    const mockLeagueUpdate = jest.fn();

    it('calls on the update functions as well with the updated statuses as a league user', () => {
      updateClubAndLeagueEventsCompliance({
        isLeague: true,
        updatedEvent: mockUpdatedEvent,
        leagueEvent: {
          id: 1,
          type: 'game_event',
        },
        updateClubEvent: mockClubUpdate,
        updateLeagueEvent: mockLeagueUpdate,
      });
      expect(mockClubUpdate).toHaveBeenCalledWith(mockUpdatedEvent, true);
      expect(mockLeagueUpdate).toHaveBeenCalledWith({
        id: 1,
        type: 'game_event',
        home_dmr: ['lineup', 'captain'],
      });
    });

    it('calls on the club update function only', () => {
      updateClubAndLeagueEventsCompliance({
        isLeague: false,
        updatedEvent: mockUpdatedEvent,
        leagueEvent: {},
        updateClubEvent: mockClubUpdate,
        updateLeagueEvent: mockLeagueUpdate,
      });

      expect(mockClubUpdate).toHaveBeenCalledWith(mockUpdatedEvent, true);
      expect(mockLeagueUpdate).not.toHaveBeenCalled();
    });
  });

  describe('getViewerPageLink', () => {
    it('returns the staging viewer link with the division appended', () => {
      Object.defineProperty(window, 'location', {
        value: {
          href: 'www.stuff.staging.com',
        },
        writable: true, // possibility to override
      });
      expect(getViewerPageLink('mls-next', '')).toEqual(
        'https://mls-assist.staging.theintelligenceplatform.com/?division=mls-next'
      );
    });

    it('returns the staging viewer link with the division appended and org appended', () => {
      Object.defineProperty(window, 'location', {
        value: {
          href: 'www.stuff.staging.com',
        },
        writable: true, // possibility to override
      });
      expect(getViewerPageLink('kls-next', 'kls')).toEqual(
        'https://mls-assist.staging.theintelligenceplatform.com/?org=kls&division=kls-next'
      );
    });

    it('returns the production viewer link with the division appended', () => {
      Object.defineProperty(window, 'location', {
        value: {
          href: 'www.stuff.com',
        },
        writable: true, // possibility to override
      });
      expect(getViewerPageLink('mls-next', '')).toEqual(
        'https://mls-assist.theintelligenceplatform.com/?division=mls-next'
      );
    });
  });
});
