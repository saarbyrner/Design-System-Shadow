// @flow

export type MenuItem = {
  id: string,
  title: string,
  href: string,
  icon?: string,
  matchPath: Object | null,
  allowed: boolean,
  hasSubMenu: boolean,
};
