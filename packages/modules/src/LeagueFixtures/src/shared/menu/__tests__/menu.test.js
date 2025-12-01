import leagueFixturesRoutes, { leagueFixturesMenuItems } from '..';

const defaultLeagueFixturesRoute = {
  allowed: false,
  hasSubMenu: false,
  href: '/league-fixtures',
  icon: 'icon-workload',
  id: 'league-fixtures',
  matchPath: expect.any(Object),
  title: 'Schedule',
};

const scheduleRoute = {
  allowed: true,
  hasSubMenu: false,
  href: '/league-fixtures',
  id: 'schedule',
  matchPath: false,
  title: 'Schedule',
};

const disciplineRoute = {
  allowed: undefined,
  hasSubMenu: false,
  href: '/league-fixtures/discipline',
  id: 'discipline',
  matchPath: false,
  title: 'Discipline',
};

const fixtureFinderRoute = {
  allowed: false,
  href: '/fixture_finder',
  id: 'fixture_finder',
  matchPath: false,
  title: 'Fixture Finder',
  hasSubMenu: false,
};

const eventManagementRoute = {
  allowed: false,
  href: '/events_management',
  id: 'events_management',
  matchPath: false,
  title: 'Events Management',
  hasSubMenu: false,
};

describe('leagueFixturesRoutes', () => {
  afterEach(() => {
    window.featureFlags = {};
  });

  describe('default route', () => {
    it('does not return anything by default', () => {
      const result = leagueFixturesRoutes(
        '/league-fixtures',
        {},
        {
          isLeagueStaffUser: false,
          isScout: false,
        }
      );
      expect(result).toEqual([{ ...defaultLeagueFixturesRoute, href: '' }]);
    });

    it('returns 0 routes when the discipline flag is on but the user is not a league staff or scout user', () => {
      window.featureFlags['league-ops-discipline-area'] = true;
      const result = leagueFixturesRoutes(
        '/league-fixtures',
        {},
        {
          isLeagueStaffUser: false,
          isScout: false,
        }
      );

      expect(result).toEqual([{ ...defaultLeagueFixturesRoute, href: '' }]);
    });

    it('returns the schedule route when the user is a league user with the appropriate permissions', () => {
      const result = leagueFixturesRoutes(
        '/league-fixtures',
        { canViewGameSchedule: true },
        {
          isLeagueStaffUser: true,
          isScout: false,
        }
      );
      expect(result).toEqual([
        { ...defaultLeagueFixturesRoute, allowed: true },
      ]);
    });

    it('is allowed when user is scout with the correct permission', () => {
      const result = leagueFixturesRoutes(
        '/league-fixtures',
        { canViewGameSchedule: true },
        {
          isLeagueStaffUser: false,
          isScout: true,
        }
      );
      expect(result).toEqual([
        { ...defaultLeagueFixturesRoute, allowed: true },
      ]);
    });
  });

  describe('league fixtures menu items', () => {
    it('returns the schedule and discipline route when the flag is on', () => {
      window.featureFlags['league-ops-discipline-area'] = true;
      const result = leagueFixturesMenuItems({
        path: '/league-fixtures/discipline',
        permissions: {
          canViewGameSchedule: true,
          canViewDisciplineArea: true,
        },
        leagueOperations: {
          isLeagueStaffUser: true,
          isScout: false,
        },
      });

      expect(result).toEqual([
        scheduleRoute,
        { ...disciplineRoute, matchPath: true, allowed: true },
        fixtureFinderRoute,
        eventManagementRoute,
      ]);

      window.featureFlags['league-ops-discipline-area'] = false;
    });

    describe('[FEATURE_FLAG]: tso-fixture-finder', () => {
      it('does not return the fixture finder option by default only the schedule', () => {
        window.featureFlags['tso-fixture-finder'] = false;
        const result = leagueFixturesMenuItems({
          path: '/fixture-finder',
          permissions: { canViewGameSchedule: true },
          leagueOperations: {
            isLeagueStaffUser: true,
            isLeague: false,
          },
        });
        expect(result).toEqual([
          scheduleRoute,
          disciplineRoute,
          { ...fixtureFinderRoute, matchPath: true },
          eventManagementRoute,
        ]);
      });

      it('returns the fixture finder route when the flag is on', () => {
        window.featureFlags['tso-fixture-finder'] = true;
        const result = leagueFixturesMenuItems({
          path: '/fixture-finder',
          permissions: { canViewGameSchedule: true },
          leagueOperations: {
            isLeagueStaffUser: true,
            isLeague: true,
          },
        });
        expect(result).toEqual([
          scheduleRoute,
          disciplineRoute,
          { ...fixtureFinderRoute, matchPath: true, allowed: true },
          eventManagementRoute,
        ]);
      });
    });

    describe('[FEATURE_FLAG]: tso-event-management', () => {
      it('does not return the event management option by default only the schedule', () => {
        window.featureFlags['tso-event-management'] = false;
        const result = leagueFixturesMenuItems({
          path: '/events_management',
          permissions: { canViewGameSchedule: true, canViewTSOEvent: false },
          leagueOperations: {
            isLeagueStaffUser: true,
            isLeague: false,
          },
        });
        expect(result).toEqual([
          scheduleRoute,
          disciplineRoute,
          fixtureFinderRoute,
          { ...eventManagementRoute, matchPath: true },
        ]);
      });
      it('returns the event management  route when the flag is on', () => {
        window.featureFlags['tso-event-management'] = true;
        const result = leagueFixturesMenuItems({
          path: '/events_management',
          permissions: { canViewGameSchedule: true, canViewTSOEvent: true },
          leagueOperations: {
            isLeagueStaffUser: true,
            isLeague: true,
          },
        });
        expect(result).toEqual([
          scheduleRoute,
          disciplineRoute,
          fixtureFinderRoute,
          { ...eventManagementRoute, matchPath: true, allowed: true },
        ]);
      });
    });
  });
});
