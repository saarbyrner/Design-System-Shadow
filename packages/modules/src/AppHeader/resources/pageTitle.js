// @flow
import i18n from '@kitman/common/src/utils/i18n';
import type { PermissionsType } from '@kitman/common/src/contexts/PermissionsContext/types';
import menuItems from '../../MainNav/resources/menuItems';
import {
  athletesMenuItems,
  analysisMenuItems,
  workloadsMenuItems,
  formsMenuItems,
  settingsMenuItems,
} from '../../MainNav/resources/secondaryMenuItems';

export default (
  path: string,
  permissions: PermissionsType,
  isAthlete: boolean
) => {
  if (
    path?.startsWith('/league-fixtures/reports/') ||
    path?.startsWith('/planning_hub/league-schedule/reports/')
  ) {
    return i18n.t('Officials report');
  }
  if (
    path === '/league-fixtures' ||
    path?.endsWith('/planning_hub/league-schedule')
  ) {
    return i18n.t('Schedule');
  }

  const mainSectionMatch = menuItems(path).filter((item) => item.matchPath);
  if (mainSectionMatch.length === 0) {
    return '';
  }

  const mainSection = mainSectionMatch[0];
  let secondarySectionMatch = [];

  switch (mainSection.id) {
    case 'analysis':
      secondarySectionMatch = analysisMenuItems(path, permissions).filter(
        (item) => item.matchPath
      );
      break;
    case 'athletes':
      secondarySectionMatch = athletesMenuItems(path).filter(
        (item) => item.matchPath
      );
      break;
    case 'workloads':
      secondarySectionMatch = workloadsMenuItems(path).filter(
        (item) => item.matchPath
      );
      break;
    case 'forms':
      secondarySectionMatch = formsMenuItems(path, isAthlete).filter(
        (item) => item.matchPath
      );
      break;
    case 'settings':
      secondarySectionMatch = settingsMenuItems(path).filter(
        (item) => item.matchPath
      );
      break;
    default:
      break;
  }

  return secondarySectionMatch.length === 0
    ? mainSection.title
    : secondarySectionMatch[0].title;
};
