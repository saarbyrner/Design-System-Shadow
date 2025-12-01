// @flow

// TODO: replace all assignments to window.location... with calls to React
// Router’s `useNavigate` once the migration to SPA is completed.

import switchOrganisation from '@kitman/services/src/services/settings/organisation_switcher/put';
import { isConnectedToStaging } from '@kitman/common/src/variables/isConnectedToStaging';

const IS_TRYING_TO_RESTORE_LAST_KNOWN_PAGE = 'isTryingToRestoreLastKnownPage';
const IS_HOME_PAGE_VISITED_INTENTIONALLY = 'isHomePageVisitedIntentionally';

const setIsTryingToRestoreLastKnownPageToFalse = () =>
  window.sessionStorage?.setItem(IS_TRYING_TO_RESTORE_LAST_KNOWN_PAGE, false);

const getLastKnownPageKeyOf = (userId: string): string =>
  `lastKnownPageOf${userId}`;
const getLastKnownSquadKeyOf = (userId: string): string =>
  `lastKnownSquadOf${userId}`;
const getLastKnownOrgKeyOf = (userId: string): string =>
  `lastKnownOrgOf${userId}`;

const getIsHomePage = (): boolean => {
  const homepagePaths: Array<string> = ['dashboards/show'];

  // The feature-flag-to-path mapping is defined in medinah’s
  // spec/controllers/home_controller_spec.rb.
  if (window.getFlag('homepage-medical-area')) {
    homepagePaths.push('medical/rosters');
  }
  if (window.getFlag('homepage-availability-sheet')) {
    homepagePaths.push('athletes/availability');
  }
  if (window.getFlag('web-home-page')) {
    homepagePaths.push('home_dashboards');
  }

  return (
    homepagePaths.some((path) => window.location.toString().includes(path)) ||
    new URL(window.location).pathname === '/'
  );
};

export const setIsHomePageVisitedIntentionally = (value: boolean) =>
  window.sessionStorage?.setItem(IS_HOME_PAGE_VISITED_INTENTIONALLY, value);
const setIsHomePageVisitedIntentionallyToFalse = () =>
  setIsHomePageVisitedIntentionally(false);

const getIsServicePage = (): boolean =>
  ['settings/set_squad'].some((path) =>
    window.location.toString().includes(path)
  );

// The last known page-related functions.
const setLastKnownPage = (userId: string) => {
  // Prevent an infinite redirect loop if the last known page is a home or a
  // service page. Also, it’s not useful to store these types of pages anyway.
  if (getIsHomePage() || getIsServicePage()) return;
  window.sessionStorage?.setItem(
    getLastKnownPageKeyOf(userId),
    window.location
  );
};

const invalidateLastKnownPage = (userId: string) =>
  window.sessionStorage?.setItem(getLastKnownPageKeyOf(userId), '');

// restoreLastKnownPage returns true if the last known page has been opened,
// otherwise false.
const restoreLastKnownPage = (userId: string): boolean => {
  const lastKnownPage = window.sessionStorage?.getItem(
    getLastKnownPageKeyOf(userId)
  );

  if (
    window.sessionStorage?.getItem(IS_HOME_PAGE_VISITED_INTENTIONALLY) ===
    'true'
  ) {
    setIsTryingToRestoreLastKnownPageToFalse();
    setIsHomePageVisitedIntentionallyToFalse();
    // The last known page needs to be invalidated, otherwise home page reloads
    // redirect to it.
    invalidateLastKnownPage(userId);
    return false;
  }

  if (!(lastKnownPage && getIsHomePage())) {
    setIsTryingToRestoreLastKnownPageToFalse();
    setIsHomePageVisitedIntentionallyToFalse();
    return false;
  }

  // Prevent infinite attempts to restore the last known page.
  if (
    window.sessionStorage?.getItem(IS_TRYING_TO_RESTORE_LAST_KNOWN_PAGE) ===
    'true'
  ) {
    setIsTryingToRestoreLastKnownPageToFalse();
    setIsHomePageVisitedIntentionallyToFalse();
    invalidateLastKnownPage(userId);
    window.location.href = '/';
    return false;
  }

  window.sessionStorage?.setItem(IS_TRYING_TO_RESTORE_LAST_KNOWN_PAGE, true);
  window.location = lastKnownPage;
  return true;
};

// The last known squad-related functions.
export const setLastKnownSquad = (squadId: number, userId: string) => {
  setIsTryingToRestoreLastKnownPageToFalse();
  setIsHomePageVisitedIntentionallyToFalse();
  invalidateLastKnownPage(userId);
  window.sessionStorage?.setItem(getLastKnownSquadKeyOf(userId), squadId);
  // If local development environment is connected to staging, squad change is
  // handled here by setting last_selected_squad_id cookie’s value.
  // <SquadSelector /> cannot handle it because React Router tries to handle
  // the path and returns <NoRoute /> instead of passing request right through
  // to be handled by medinah. This happens only when local development
  // environment is connected to staging and not on staging and production
  // because of our proxy config’s `context` function which could have been
  // configured to handle the path instead of React Router, but there is no
  // benefit in that.
  if (!(document && isConnectedToStaging)) return;
  document.cookie = [
    `last_selected_squad_id=${squadId}`,
    'path=/',
    'expires=Fri, 01 Jan 9999 00:00:00 GMT',
  ].join(';');
  window.location.reload();
};

const invalidateLastKnownSquad = (userId: string) =>
  window.sessionStorage?.setItem(getLastKnownSquadKeyOf(userId), '');

// restoreLastKnownSquad returns true if the squad has been switched, otherwise
// false.
const restoreLastKnownSquad = (
  validIds: Array<string>,
  currentSquadId?: string,
  userId: string
): boolean => {
  const lastKnownSquad = window.sessionStorage?.getItem(
    getLastKnownSquadKeyOf(userId)
  );
  if (!lastKnownSquad) return false;

  if (!validIds.includes(lastKnownSquad)) {
    invalidateLastKnownPage(userId);
    invalidateLastKnownSquad(userId);
    return false;
  }

  if (
    !currentSquadId ||
    currentSquadId === lastKnownSquad ||
    // If local development environment is connected to staging, squad
    // restoration is handled via last_selected_squad_id cookie which is set in
    // setLastKnownSquad.
    isConnectedToStaging
  ) {
    return false;
  }

  window.location.href = `/settings/set_squad/${lastKnownSquad}`;
  return true;
};

// The last known org-related functions.
export const setLastKnownOrg = (orgId: number, userId: string) => {
  setIsTryingToRestoreLastKnownPageToFalse();
  setIsHomePageVisitedIntentionallyToFalse();
  invalidateLastKnownPage(userId);
  invalidateLastKnownSquad(userId);
  window.sessionStorage?.setItem(getLastKnownOrgKeyOf(userId), orgId);
};

const invalidateLastKnownOrg = (userId: string) =>
  window.sessionStorage?.setItem(getLastKnownOrgKeyOf(userId), '');

const ADMIN_ACCOUNT_SUBDOMAIN = 'admin';
// restoreLastKnownOrg returns true if the org has been switched,
// otherwise false.
const restoreLastKnownOrg = async (
  currentOrgId: string,
  userId: string
): Promise<boolean> => {
  const lastKnownOrg = window.sessionStorage?.getItem(
    getLastKnownOrgKeyOf(userId)
  );
  const isAdminAccount = [
    ['injuryprofiler.net'],
    ['injuryprofiler.com'],
    ['kitmanlabs.io'],
  ]
    .map((pattern) => {
      pattern.unshift(`${ADMIN_ACCOUNT_SUBDOMAIN}.`);
      return pattern;
    })
    .some((pattern) =>
      pattern.every((urlSegment) =>
        window.location.toString().includes(urlSegment)
      )
    );

  if (
    !lastKnownOrg ||
    currentOrgId === lastKnownOrg ||
    !(isConnectedToStaging || isAdminAccount)
  ) {
    return false;
  }

  try {
    await switchOrganisation(lastKnownOrg);
  } catch {
    setIsTryingToRestoreLastKnownPageToFalse();
    setIsHomePageVisitedIntentionallyToFalse();
    invalidateLastKnownPage(userId);
    invalidateLastKnownSquad(userId);
    invalidateLastKnownOrg(userId);
    return false;
  }

  window.location.href = '/';
  return true;
};

export type SetLastKnownPage = null | ((userId: string) => void);
// The main function. Must be imported and called only once.
export const openLastKnownPageOnSignIn = async (
  // All the IDs are strings because they are compared to session storage
  // values which are strings.
  userId: string,
  currentOrgId: string,
  validSquadsIds: Array<string>,
  currentSquadId?: string
): Promise<SetLastKnownPage> => {
  if (!window.getFlag('cp-open-last-known-page-on-sign-in')) {
    setIsTryingToRestoreLastKnownPageToFalse();
    setIsHomePageVisitedIntentionallyToFalse();
    invalidateLastKnownPage(userId);
    invalidateLastKnownSquad(userId);
    invalidateLastKnownOrg(userId);
    return null;
  }

  if (
    // The order is important here, first we must check the least specific/the
    // broadest last known state and only then we must check more
    // specific/narrower one.
    [
      await restoreLastKnownOrg(currentOrgId, userId),
      restoreLastKnownSquad(validSquadsIds, currentSquadId, userId),
      restoreLastKnownPage(userId),
    ].some(Boolean)
  ) {
    return null;
  }

  // Although in the majority of cases calling setCookie here won’t do anything
  // because users usually land on a home page, it’s useful when a user follows
  // a link from outside the app.
  setLastKnownPage(userId);
  return setLastKnownPage;
};
