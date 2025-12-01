// @flow
import i18n from '@kitman/common/src/utils/i18n';
import type { MenuItem } from '@kitman/modules/src/MainNav/types';

const USER_TYPES = [
  'staff',
  'organisation_admin',
  'association_admin',
  'athlete',
];
const registrationRoutes = (
  matchPath: Function,
  hasSubMenu: Function,
  currentUser: Object
): Array<MenuItem> => {
  return [
    {
      id: 'registration',
      title: i18n.t('Registration'),
      href: '/registration',
      icon: 'icon-document',
      matchPath,
      allowed:
        window.featureFlags['league-ops-registration-module'] &&
        USER_TYPES.includes(currentUser?.registration?.user_type),
      hasSubMenu,
    },
  ];
};

export default registrationRoutes;
