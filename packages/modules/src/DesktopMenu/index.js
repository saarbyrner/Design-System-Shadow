// @flow
import { type Node, useEffect, useState } from 'react';
import { matchPath } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';
import classNames from 'classnames';
import $ from 'jquery';

import useLocationPathname from '@kitman/common/src/hooks/useLocationPathname';
import useWindowSize from '@kitman/common/src/hooks/useWindowSize';
import { Link, TooltipMenu } from '@kitman/components';
import { type Permissions } from '@kitman/common/src/types/Permissions';
import { type Modules } from '@kitman/common/src/types/Modules';
import { getIsLocalStorageAvailable } from '@kitman/common/src/utils';
import useLeagueOperations from '@kitman/common/src/hooks/useLeagueOperations';
import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';
import { type I18nProps } from '@kitman/common/src/types/i18n';
import { setIsHomePageVisitedIntentionally } from '@kitman/modules/src/initialiseProfiler/modules/utilities/openLastKnownPageOnSignIn';
import MessageBadgeWrapper from '@kitman/modules/src/Messaging/src/components/MessageBadgeWrapper';
import { type DashboardGroupResponse } from '@kitman/modules/src/analysis/LookerDashboardGroup/types';

import menuItems from '../MainNav/resources/menuItems';
import { type MenuItem } from '../MainNav/types';
import {
  getSecondaryMenuItems,
  getSecondaryMenuTitle,
} from '../MainNav/resources/secondaryMenuBuilder';

type Props = {
  helpPath: string,
  permissions: Permissions,
  modules: Modules,
  orgNickname: string,
  logoPath: string,
  logoPathRetina: string,
  currentUser: Object,
  powerBiReports: Array<{ id: number, name: string }>,
  dashboardGroups: DashboardGroupResponse,
};

type State = {
  isMainMenuOpen: boolean,
  isSecondaryMenuOpen: boolean,
  activeSecondaryMenu: ?string,
  screenHeight: number,
  mainMenuContainerHeight: number,
};

const DesktopMenu = (props: I18nProps<Props>) => {
  const { preferences } = usePreferences();
  const leagueOperations = useLeagueOperations();

  const [state, setState] = useState<State>(() => {
    const isMainMenuOpen = getIsLocalStorageAvailable()
      ? JSON.parse(window.localStorage?.getItem('isMainMenuOpen'))
      : true;

    if (isMainMenuOpen) {
      $('.main').addClass('main--mainMenuOpen');
    }

    return {
      screenHeight: 833,
      mainMenuContainerHeight: 0,
      isMainMenuOpen,
      isSecondaryMenuOpen: false,
      activeSecondaryMenu: null,
    };
  });
  const { windowHeight } = useWindowSize();
  const locationPathname = useLocationPathname();

  const mainMenuItemHeight = 40;
  // extra elements: top padding of the menu, the logo size and bottom button sizes and paddings
  const extraElementsSize = 165;
  const allAllowedMenuItems: Array<MenuItem> = menuItems(
    locationPathname,
    props.permissions,
    false,
    leagueOperations,
    props.currentUser,
    props.powerBiReports,
    props.dashboardGroups
  ).filter((item) => item.allowed);

  const getMainMenuContainerHeight = (screenHeight: number) => {
    return screenHeight - extraElementsSize;
  };

  useEffect(() => {
    const mainMenuContainerHeight = getMainMenuContainerHeight(windowHeight);
    setState((prevState) => ({
      ...prevState,
      screenHeight: windowHeight,
      mainMenuContainerHeight,
    }));
  }, [windowHeight]);

  const isMenuAbbreviated = (screenHeight: number) => {
    const menuItemLength = allAllowedMenuItems.length;
    return (
      menuItemLength * mainMenuItemHeight + extraElementsSize > screenHeight
    );
  };

  const openSecondaryMenu = (menuId: string) => {
    setState((prevState) => ({
      ...prevState,
      isSecondaryMenuOpen: true,
      activeSecondaryMenu: menuId,
    }));
  };

  const closeSecondaryMenu = () => {
    setState((prevState) => ({
      ...prevState,
      isSecondaryMenuOpen: false,
      activeSecondaryMenu: null,
    }));
  };

  const onClickToggleMainMenu = () => {
    const isMainMenuOpen = !state.isMainMenuOpen;
    setState((prevState) => ({
      ...prevState,
      isMainMenuOpen,
    }));

    if (getIsLocalStorageAvailable()) {
      window.localStorage?.setItem('isMainMenuOpen', isMainMenuOpen);
    }

    if (isMainMenuOpen) {
      $('.main').addClass('main--mainMenuOpen');
    } else {
      $('.main').removeClass('main--mainMenuOpen');
    }

    window.dispatchEvent(new Event('resize'));
  };

  const getSecondaryMenuElements = (items: Array<MenuItem>): Node => {
    if (items.length > 0) {
      return items.map(
        (item) =>
          item.allowed && (
            <div
              className={classNames('mainNavBarDesktop__secondaryMenuItem', {
                'mainNavBarDesktop__secondaryMenuItem--active': item.matchPath,
              })}
              onClick={() => closeSecondaryMenu()}
              key={item.id}
            >
              <Link href={item.href}>{item.title}</Link>
            </div>
          )
      );
    }
    return null;
  };

  const getItemIcon = (item) => (
    <span className={`mainNavBarDesktop__menuItemIcon ${item.icon || ''}`} />
  );

  const handleSecondaryMenuOpening = (
    menuId: $PropertyType<MenuItem, 'id'>
  ) => {
    if (!state.isSecondaryMenuOpen) {
      // when there is no menu open
      openSecondaryMenu(menuId);
    } else if (
      state.isSecondaryMenuOpen &&
      state.activeSecondaryMenu !== menuId
    ) {
      // when there is a menu open but you click another menu item with submenu
      openSecondaryMenu(menuId);
    } else {
      closeSecondaryMenu();
    }
  };

  const getVisibleItemsLength = () => {
    // first get the non-integer number of elements fitting in the container
    // considering the space left for the ... button
    const rawCalculation =
      (state.mainMenuContainerHeight - mainMenuItemHeight) / mainMenuItemHeight;
    const floorCalculation = Math.floor(rawCalculation);
    const diff = rawCalculation - floorCalculation;
    // if the difference between the non-integer and the floor value is higher than 0.9
    // there is still space for one more item, so use rounding
    return diff < 0.9 ? floorCalculation : Math.round(rawCalculation);
  };

  const getMenuItems = (abbreviateMenu: boolean): Node => {
    const visibleItemsLength = getVisibleItemsLength();
    const visibleItems = abbreviateMenu
      ? allAllowedMenuItems.slice(0, visibleItemsLength)
      : allAllowedMenuItems;
    return visibleItems.map((item) => {
      return (
        item.allowed && (
          <div
            className={classNames(
              'mainNavBarDesktop__menuItem',
              `mainNavBarDesktop__menuItem--${item.id}`,
              {
                'mainNavBarDesktop__menuItem--active': item.matchPath,
                'mainNavBarDesktop__menuItem--submenuOpen':
                  item.id === state.activeSecondaryMenu,
                'mainNavBarDesktop__menuItem--settings': item.id === 'settings',
              }
            )}
            key={item.id}
          >
            {item.hasSubMenu ? (
              <div
                className="mainNavBarDesktop__menuItemBtn"
                onClick={() => handleSecondaryMenuOpening(item.id)}
              >
                <span
                  className={`mainNavBarDesktop__menuItemIcon ${
                    item.icon || ''
                  }`}
                />
                <span className="mainNavBarDesktop__menuItemText">
                  {item.title}
                </span>
              </div>
            ) : (
              <Link className="mainNavBarDesktop__menuItemBtn" href={item.href}>
                {item.id === 'messaging' ? (
                  <MessageBadgeWrapper>{getItemIcon(item)}</MessageBadgeWrapper>
                ) : (
                  getItemIcon(item)
                )}
                <span className="mainNavBarDesktop__menuItemText">
                  {item.title}
                </span>
              </Link>
            )}
          </div>
        )
      );
    });
  };

  const renderAbbreviatedMenu = (abbreviateMenu: boolean) => {
    const visibleItemsLength = getVisibleItemsLength();
    const cutItems = allAllowedMenuItems.slice(visibleItemsLength);
    const items = cutItems.map((item) => {
      return item.hasSubMenu
        ? {
            description: item.title,
            onClick: () => handleSecondaryMenuOpening(item.id),
            icon: item.icon,
          }
        : {
            description: item.title,
            href: item.href,
            icon: item.icon,
          };
    });

    return abbreviateMenu ? (
      <TooltipMenu
        placement="right-end"
        menuItems={items}
        tooltipTriggerElement={
          <div className="mainNavBarDesktop__menuItem mainNavBarDesktop__menuItem--ellipsis">
            <div className="mainNavBarDesktop__menuItemBtn">
              <span className="mainNavBarDesktop__menuItemIcon">...</span>
              <span className="mainNavBarDesktop__menuItemText">
                {props.t('More')}
              </span>
            </div>
          </div>
        }
      />
    ) : null;
  };

  // in order for the transition animation to work we must render the submenu
  // in all cases, only prevent opening it if it would be empty
  const secondaryMenuItems = getSecondaryMenuItems(
    state.activeSecondaryMenu,
    props.permissions,
    props.modules,
    leagueOperations,
    preferences,
    props?.currentUser?.athlete,
    props.powerBiReports,
    props.dashboardGroups
  );

  const secondaryMenuClasses = classNames('mainNavBarDesktop__secondaryMenu', {
    'mainNavBarDesktop__secondaryMenu--open':
      state.isSecondaryMenuOpen && secondaryMenuItems.length > 0,
    'mainNavBarDesktop__secondaryMenu--mainMenuOpen': state.isMainMenuOpen,
  });
  const fillerClasses = classNames('mainNavBarDesktop__filler', {
    'mainNavBarDesktop__filler--open': state.isSecondaryMenuOpen,
  });
  const abbreviateMenu = isMenuAbbreviated(state.screenHeight);
  const mainMenuClasses = classNames('mainNavBarDesktop', {
    'mainNavBarDesktop--open': state.isMainMenuOpen,
  });
  const toggleMainMenuClasses = classNames('mainNavBarDesktop__menuItemIcon', {
    'icon-double-arrow-right': !state.isMainMenuOpen,
    'icon-double-arrow-left': state.isMainMenuOpen,
  });

  // in order to have an initial height to the container set a starting height
  // if the menu is abbreviated, need to leave space for the ... button
  const menuItemContainerStyle = {
    height: abbreviateMenu
      ? state.mainMenuContainerHeight - mainMenuItemHeight
      : state.mainMenuContainerHeight,
  };

  return (
    <>
      <div className={secondaryMenuClasses}>
        <div className="mainNavBarDesktop__secondaryMenuTitle">
          {getSecondaryMenuTitle(state.activeSecondaryMenu)}
        </div>
        {getSecondaryMenuElements(secondaryMenuItems)}
      </div>

      <div className={mainMenuClasses}>
        <div className="mainNavBarDesktop__inner">
          <Link
            href="/"
            className={classNames('mainNavBarDesktop__logo', {
              'mainNavBarDesktop__logo--active': matchPath(
                '/home_dashboards/*',
                locationPathname
              ),
            })}
            onClick={() => setIsHomePageVisitedIntentionally(true)}
          >
            {window.featureFlags['ip-login-branding'] ? (
              <img
                src={props.logoPath}
                srcSet={`${props.logoPath} 1x, ${props.logoPathRetina} 2x`}
                alt={`${props.orgNickname}'s logo`}
                className="ip-org-logo-icon"
              />
            ) : (
              <span className="icon-kitman-logo" />
            )}
          </Link>
          <div
            className="mainNavBarDesktop__menuItemContainer"
            style={menuItemContainerStyle}
          >
            {getMenuItems(abbreviateMenu)}
          </div>
          {renderAbbreviatedMenu(abbreviateMenu)}
          <div className="mainNavBarDesktop__bottomContainer">
            <div className="mainNavBarDesktop__menuItem">
              <a
                href={props.helpPath}
                className="mainNavBarDesktop__menuItemBtn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="mainNavBarDesktop__menuItemIcon mainNavBarDesktop__menuItemIcon--questionMark icon-question" />
                <span className="mainNavBarDesktop__menuItemText">
                  {props.t('Help')}
                </span>
              </a>
            </div>
            <div className="mainNavBarDesktop__menuItem">
              <span
                className="mainNavBarDesktop__menuItemBtn mainNavBarDesktop__menuItemBtn--toggleMainMenu"
                onClick={() => onClickToggleMainMenu()}
              >
                <span className={toggleMainMenuClasses} />
                <span className="mainNavBarDesktop__menuItemText">
                  {props.t('Close Menu')}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className={fillerClasses} onClick={() => closeSecondaryMenu()} />
    </>
  );
};

export const DesktopMenuTranslated = withNamespaces()(DesktopMenu);
export default DesktopMenu;
