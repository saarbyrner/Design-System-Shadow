// @flow
import i18n from '@kitman/common/src/utils/i18n';
import { matchPath } from 'react-router-dom';
import type { MenuItem } from '@kitman/modules/src/MainNav/types';
import type { Permissions } from '@kitman/common/src/types/Permissions';
import type { LeagueOperations } from '@kitman/common/src/hooks/useLeagueOperations';
import {
  getFirstSubmenuUrl,
  hasSubMenu,
} from '@kitman/modules/src/MainNav/resources/menuItems';

export const leagueFixturesMenuItems = ({
  leagueOperations,
  path,
  permissions,
}: {
  leagueOperations: LeagueOperations,
  permissions: Permissions,
  path: string,
}): Array<MenuItem> => {
  const canViewSchedule = permissions?.canViewGameSchedule;

  const items = [
    {
      id: 'schedule',
      title: i18n.t('Schedule'),
      href: '/league-fixtures',
      matchPath:
        !!matchPath('/league-fixtures/*', path) &&
        !matchPath('/league-fixtures/discipline/*', path),
      allowed:
        canViewSchedule &&
        (leagueOperations.isLeagueStaffUser || leagueOperations.isScout),
      hasSubMenu: false,
    },
    {
      id: 'discipline',
      title: i18n.t('Discipline'),
      href: '/league-fixtures/discipline',
      matchPath: !!matchPath('/league-fixtures/discipline/*', path),
      allowed:
        window.featureFlags['league-ops-discipline-area'] &&
        permissions?.canViewDisciplineArea,
      hasSubMenu: false,
    },
    {
      id: 'fixture_finder',
      title: i18n.t('Fixture Finder'),
      href: '/fixture_finder',
      matchPath: !!matchPath('/fixture-finder/*', path),
      allowed: !!(
        window.featureFlags['tso-fixture-finder'] && leagueOperations.isLeague
      ),
      hasSubMenu: false,
    },
    {
      id: 'events_management',
      title: i18n.t('Events Management'),
      href: '/events_management',
      matchPath: !!matchPath('/events_management/*', path),
      allowed: !!(
        window.featureFlags['tso-event-management'] &&
        permissions?.canViewTSOEvent &&
        leagueOperations.isLeague
      ),
      hasSubMenu: false,
    },
  ];

  return items;
};

const leagueFixturesRoutes = (
  path: Function,
  permissions: Permissions,
  leagueOperations: LeagueOperations
): Array<MenuItem> => {
  const { isLeagueStaffUser, isScout } = leagueOperations;

  const leagueOpsUserPerms =
    permissions?.canViewGameSchedule && (isLeagueStaffUser || isScout);

  return [
    {
      id: 'league-fixtures',
      title: i18n.t('Schedule'),
      href: getFirstSubmenuUrl(
        leagueFixturesMenuItems({ path, permissions, leagueOperations })
      ),
      icon: 'icon-workload',
      matchPath:
        matchPath('/league-fixtures/*', path) ||
        matchPath('/league-fixtures/discipline/*', path) ||
        matchPath('/events-management/*', path) ||
        matchPath('/fixture-finder/*', path) ||
        matchPath('?new-league-fixture', path),
      allowed: !!leagueOpsUserPerms,

      hasSubMenu: hasSubMenu(
        leagueFixturesMenuItems({ path, permissions, leagueOperations })
      ),
    },
  ];
};

export default leagueFixturesRoutes;
