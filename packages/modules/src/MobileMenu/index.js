// @flow
import { type Node, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import classNames from 'classnames';
import _last from 'lodash/last';

import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import useLeagueOperations from '@kitman/common/src/hooks/useLeagueOperations';
import useLocationPathname from '@kitman/common/src/hooks/useLocationPathname';
import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';
import { type Permissions } from '@kitman/common/src/types/Permissions';
import { type Modules } from '@kitman/common/src/types/Modules';
import { type Squad } from '@kitman/common/src/types/__common';
import { Link } from '@kitman/components';
import { breakPoints } from '@kitman/common/src/variables';
import { EventSwitcherSidePanelTranslated as EventSwitcherSidePanel } from '@kitman/modules/src/EventSwitcherSidePanel/EventSwitcherSidePanel';
import {
  onOpenEventSelect,
  onCloseEventSelect,
} from '@kitman/modules/src/EventSwitcherSidePanel/redux/slices/eventSwitchSlice';
import { type I18nProps } from '@kitman/common/src/types/i18n';
import { setIsHomePageVisitedIntentionally } from '@kitman/modules/src/initialiseProfiler/modules/utilities/openLastKnownPageOnSignIn';
import MessageBadgeWrapper from '@kitman/modules/src/Messaging/src/components/MessageBadgeWrapper';
import { type DashboardGroupResponse } from '@kitman/modules/src/analysis/LookerDashboardGroup/types';

import PlayerSelectSidePanelContainer from '../PlayerSelectSidePanel/PlayerSelectSidePanelContainer';
import {
  onOpenPlayerSelect,
  onClosePlayerSelect,
} from '../PlayerSelectSidePanel/redux/slices/playerSelectSlice';
import menuItems from '../MainNav/resources/menuItems';
import UserMenu from '../UserMenu';
import type { MenuItem } from '../MainNav/types';
import {
  getSecondaryMenuItems,
  getSecondaryMenuTitle,
} from '../MainNav/resources/secondaryMenuBuilder';

type Props = {
  locale: string,
  helpPath: string,
  permissions: Permissions,
  modules: Modules,
  logoPath: string,
  logoPathRetina: string,
  currentUser: Object,
  currentSquad: ?Squad,
  availableSquads: Array<Squad>,
  orgNickname: string,
  powerBiReports: Array<{ id: number, name: string }>,
  dashboardGroups: DashboardGroupResponse,
};

type State = {
  isMenuOpen: boolean,
  isSecondaryMenuActive: boolean,
  activeSecondaryMenu: ?string,
};

const MobileMenu = (props: I18nProps<Props>) => {
  const { permissions } = usePermissions();
  const leagueOperations = useLeagueOperations();
  const { preferences } = usePreferences();

  const [state, setState] = useState<State>({
    isMenuOpen: false,
    isSecondaryMenuActive: false,
    activeSecondaryMenu: null,
  });
  const locationPathname = useLocationPathname();
  const allowedMenuItems = menuItems(
    locationPathname,
    props.permissions,
    true,
    leagueOperations,
    props.currentUser,
    props.powerBiReports,
    props.dashboardGroups
  );

  const dispatch = useDispatch();

  /*
   * giving the url /medical/athletes/30693
   * the athleteId is the last part of the URL
   */
  const pathname = useLocationPathname();
  const eventId = parseInt(_last(pathname.split('/')), 10);
  const inPlanningArea = pathname.split('/')[1] === 'planning_hub';

  const canViewSessionPlanner =
    window.getFlag('event-selector-side-nav') &&
    props.currentSquad &&
    inPlanningArea &&
    permissions.workloads.canViewWorkload &&
    !!eventId;

  const canViewPlayerSelector =
    window.getFlag('player-selector-side-nav') &&
    permissions.medical.issues.canView &&
    !canViewSessionPlanner;

  const withIPBranding = window.getFlag('ip-login-branding');

  const { isPlayerSelectOpen } = useSelector(
    (defaultRootState) => defaultRootState.playerSelectSlice
  );
  const { isEventSwitcherOpen } = useSelector(
    (defaultRootState) => defaultRootState.eventSwitcherSlice
  );

  const handleShowPlayerSelect = () => {
    if (isPlayerSelectOpen) {
      dispatch(onClosePlayerSelect());
    } else {
      dispatch(onOpenPlayerSelect());
    }
  };

  const handleShowEventSwitcher = () => {
    if (isEventSwitcherOpen) {
      dispatch(onCloseEventSelect());
    } else {
      dispatch(onOpenEventSelect());
    }
  };

  const toggleMenu = () => {
    setState((prevState) => ({
      ...prevState,
      isMenuOpen: !prevState.isMenuOpen,
    }));
  };

  const toggleSecondaryMenu = (menuId: ?string) => {
    setState((prevState) => ({
      ...prevState,
      isSecondaryMenuActive: !prevState.isSecondaryMenuActive,
      activeSecondaryMenu: menuId,
    }));
  };

  const getItemIcon = (item) => (
    <span
      className={
        withIPBranding
          ? `ip-mainNavBarMobile__menuItemIcon ${item.icon}`
          : `mainNavBarMobile__menuItemIcon ${item.icon}`
      }
    />
  );

  const getSecondaryMenuElements = (items: Array<MenuItem>): Node => {
    if (items.length > 0) {
      return items.map(
        (item) =>
          item.allowed && (
            <div
              className={classNames({
                'ip-mainNavBarMobile__menuItem': withIPBranding,
                'ip-mainNavBarMobile__menuItem--active':
                  item.matchPath && withIPBranding,
                mainNavBarMobile__menuItem: !withIPBranding,
                'mainNavBarMobile__menuItem--active':
                  item.matchPath && !withIPBranding,
              })}
              key={item.id}
              onClick={() => toggleMenu()}
            >
              <Link
                className={
                  withIPBranding
                    ? 'ip-mainNavBarMobile__menuLink'
                    : 'mainNavBarMobile__menuLink'
                }
                href={item.href}
              >
                <span>{item.title}</span>
              </Link>
            </div>
          )
      );
    }
    return null;
  };

  const getMenuItems = () => {
    return allowedMenuItems.map((item) => {
      return (
        item.allowed && (
          <div
            className={classNames({
              'ip-mainNavBarMobile__menuItem': withIPBranding,
              [`ip-mainNavBarMobile__menuItem--${item.id}`]: withIPBranding,
              'ip-mainNavBarMobile__menuItem--active':
                item.matchPath && withIPBranding,
              'ip-mainNavBarMobile__menuItem--settings':
                item.id === 'settings' && withIPBranding,
              mainNavBarMobile__menuItem: !withIPBranding,
              [`mainNavBarMobile__menuItem--${item.id}`]: !withIPBranding,
              'mainNavBarMobile__menuItem--active':
                item.matchPath && !withIPBranding,
              'mainNavBarMobile__menuItem--settings':
                item.id === 'settings' && !withIPBranding,
            })}
            onClick={() => {
              if (!item.hasSubMenu) {
                // Close the menu when the user navigates to another page
                toggleMenu();
              }
            }}
            key={item.id}
          >
            {item.hasSubMenu ? (
              <div
                className={
                  withIPBranding
                    ? 'ip-mainNavBarMobile__menuLink'
                    : 'mainNavBarMobile__menuLink'
                }
                onClick={() => toggleSecondaryMenu(item.id)}
              >
                <span
                  className={
                    withIPBranding
                      ? `ip-mainNavBarMobile__menuItemIcon ${item.icon}`
                      : `mainNavBarMobile__menuItemIcon ${item.icon}`
                  }
                />
                <span>{item.title}</span>
                <span
                  className={
                    withIPBranding
                      ? 'ip-icon-next-right ip-mainNavBarMobile__chevron'
                      : 'icon-next-right ip-mainNavBarMobile__chevron'
                  }
                />
              </div>
            ) : (
              <Link
                className={
                  withIPBranding
                    ? 'ip-mainNavBarMobile__menuLink'
                    : 'mainNavBarMobile__menuLink'
                }
                href={item.href}
              >
                {item.id === 'messaging' ? (
                  <MessageBadgeWrapper>{getItemIcon(item)}</MessageBadgeWrapper>
                ) : (
                  getItemIcon(item)
                )}
                <span>{item.title}</span>
              </Link>
            )}
          </div>
        )
      );
    });
  };

  const menuClasses = classNames({
    'ip-mainNavBarMobile__menu': withIPBranding,
    'ip-mainNavBarMobile__menu--open': state.isMenuOpen && withIPBranding,
    mainNavBarMobile__menu: !withIPBranding,
    'mainNavBarMobile__menu--open': state.isMenuOpen && !withIPBranding,
  });

  const primaryContentClasses = classNames({
    'ip-mainNavBarMobile__menuContent': withIPBranding,
    'ip-mainNavBarMobile__menuContent--primary': withIPBranding,
    'ip-mainNavBarMobile__menuContent--active':
      !state.isSecondaryMenuActive && withIPBranding,
    mainNavBarMobile__menuContent: !withIPBranding,
    'mainNavBarMobile__menuContent--primary': !withIPBranding,
    'mainNavBarMobile__menuContent--active':
      !state.isSecondaryMenuActive && !withIPBranding,
  });
  const secondaryContentClasses = classNames({
    'ip-mainNavBarMobile__menuContent': withIPBranding,
    'ip-mainNavBarMobile__menuContent--secondary': withIPBranding,
    'ip-mainNavBarMobile__menuContent--active':
      state.isSecondaryMenuActive && withIPBranding,
    mainNavBarMobile__menuContent: !withIPBranding,
    'mainNavBarMobile__menuContent--secondary': !withIPBranding,
    'mainNavBarMobile__menuContent--active':
      state.isSecondaryMenuActive && !withIPBranding,
  });

  const secondaryItems = getSecondaryMenuItems(
    state.activeSecondaryMenu,
    props.permissions,
    props.modules,
    leagueOperations,
    preferences,
    props.currentUser?.athlete,
    props.powerBiReports,
    props.dashboardGroups
  );

  const isCellPhoneWidth = window.matchMedia(
    `(max-width: ${breakPoints.tablet})`
  ).matches;

  return (
    <div
      className={withIPBranding ? 'ip-mainNavBarMobile' : 'mainNavBarMobile'}
    >
      {withIPBranding ? (
        <div className="ip-mainNavBarMobile__wrapper">
          <button
            className="ip-mainNavBarMobile__menuBtn"
            type="button"
            onClick={() => toggleMenu()}
          >
            <span className="ip-mainNavBarMobile__burger icon-burger" />
          </button>
          {canViewPlayerSelector && props.currentSquad && (
            <>
              <button
                className="ip-mainNavBarMobile__playerSelectorBtn"
                onClick={handleShowPlayerSelect}
                type="button"
              >
                <span className="icon-user" />
                {isPlayerSelectOpen && (
                  <span className="icon-double-arrow-left" />
                )}
                {!isPlayerSelectOpen && (
                  <span className="icon-double-arrow-right" />
                )}
              </button>
              <PlayerSelectSidePanelContainer
                isOpen={isPlayerSelectOpen}
                setIsPlayerSelectPanelOpen={handleShowPlayerSelect}
                currentSquad={props.currentSquad}
                width={isCellPhoneWidth && '100%'}
                left={0}
              />
            </>
          )}
          {canViewSessionPlanner && (
            <>
              <button
                className="ip-mainNavBarMobile__playerSelectorBtn"
                onClick={handleShowEventSwitcher}
                type="button"
              >
                <span className="icon-calendar" />
                {isEventSwitcherOpen ? (
                  <span className="icon-double-arrow-left" />
                ) : (
                  <span className="icon-double-arrow-right" />
                )}
              </button>
              <EventSwitcherSidePanel
                isOpen={isEventSwitcherOpen}
                eventId={eventId}
                onClosePanel={handleShowEventSwitcher}
                width={isCellPhoneWidth && '100%'}
                left={0}
              />
            </>
          )}
          <Link
            href="/"
            className="ip-mainNavBarMobile__logo"
            onClick={() => setIsHomePageVisitedIntentionally(true)}
          >
            <img
              src={props.logoPath}
              srcSet={`${props.logoPath} 1x, ${props.logoPathRetina} 2x`}
              alt={`${props.orgNickname}'s Logo`}
              className="ip-org-logo-icon"
            />
          </Link>
          <div className="ip-mainNavBarMobile__userMenu">
            <UserMenu
              orgNickname={props.orgNickname}
              locale={props.locale}
              logoPath={props.logoPath}
              logoPathRetina={props.logoPathRetina}
              currentUser={props.currentUser}
              currentSquad={props.currentSquad}
              availableSquads={props.availableSquads}
            />
          </div>
        </div>
      ) : (
        <div className="mainNavBarMobile__wrapper">
          <button
            className="mainNavBarMobile__menuBtn"
            type="button"
            onClick={() => toggleMenu()}
          >
            <span className="mainNavBarMobile__burger icon-burger" />
          </button>
          <Link
            href="/"
            className="mainNavBarMobile__logo"
            onClick={() => setIsHomePageVisitedIntentionally(true)}
          >
            <span className="icon-kitman-logo" />
          </Link>
          <div className="mainNavBarMobile__userMenu">
            <UserMenu
              orgNickname={props.orgNickname}
              locale={props.locale}
              logoPath={props.logoPath}
              logoPathRetina={props.logoPathRetina}
              currentUser={props.currentUser}
              currentSquad={props.currentSquad}
              availableSquads={props.availableSquads}
            />
          </div>
        </div>
      )}

      {withIPBranding ? (
        <div className={menuClasses}>
          <div className="ip-mainNavBarMobile__menuInner">
            <div className="ip-mainNavBarMobile__closeBtn">
              <button type="button" onClick={() => toggleMenu()}>
                <span className="icon-close" />
              </button>
            </div>
            <div className={primaryContentClasses}>
              <div className="ip-mainNavBarMobile__menuContentInner">
                {getMenuItems()}
                <div className="ip-mainNavBarMobile__bottomContainer">
                  <div className="ip-mainNavBarMobile__menuItem">
                    <div
                      className="ip-mainNavBarMobile__menuLink"
                      onClick={() => {
                        window.open(props.helpPath, '_blank');
                      }}
                    >
                      <span className="ip-mainNavBarMobile__menuItemIcon icon-question" />
                      <span>{props.t('Help')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={secondaryContentClasses}>
              <div className="ip-mainNavBarMobile__menuContentInner">
                <div
                  className="ip-mainNavBarMobile__contentBack"
                  onClick={() => toggleSecondaryMenu(null)}
                >
                  <span className="icon-next-left" />
                  {getSecondaryMenuTitle(state.activeSecondaryMenu)}
                </div>
                {getSecondaryMenuElements(secondaryItems)}
              </div>
            </div>
          </div>
          <div
            className="ip-mainNavBarMobile__filler"
            onClick={() => toggleMenu()}
          />
        </div>
      ) : (
        <div className={menuClasses}>
          <div className="mainNavBarMobile__menuInner">
            <div className="mainNavBarMobile__closeBtn">
              <button type="button" onClick={() => toggleMenu()}>
                <span className="icon-close" />
              </button>
            </div>
            <div className={primaryContentClasses}>
              <div className="mainNavBarMobile__menuContentInner">
                {getMenuItems()}
                <div className="mainNavBarMobile__bottomContainer">
                  <div className="mainNavBarMobile__menuItem">
                    <div
                      className="mainNavBarMobile__menuLink"
                      onClick={() => {
                        window.open(props.helpPath, '_blank');
                      }}
                    >
                      <span className="mainNavBarMobile__menuItemIcon icon-question" />
                      <span>{props.t('Help')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={secondaryContentClasses}>
              <div className="mainNavBarMobile__menuContentInner">
                <div
                  className="mainNavBarMobile__contentBack"
                  onClick={() => toggleSecondaryMenu(null)}
                >
                  <span className="icon-next-left" />
                  {getSecondaryMenuTitle(state.activeSecondaryMenu)}
                </div>
                {getSecondaryMenuElements(secondaryItems)}
              </div>
            </div>
          </div>
          <div
            className="mainNavBarMobile__filler"
            onClick={() => toggleMenu()}
          />
        </div>
      )}
    </div>
  );
};

export const MobileMenuTranslated = withNamespaces()(MobileMenu);
export default MobileMenu;
