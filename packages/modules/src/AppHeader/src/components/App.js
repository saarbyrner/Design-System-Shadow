// @flow
import { useDispatch, useSelector } from 'react-redux';
import _last from 'lodash/last';

import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import useLocationPathname from '@kitman/common/src/hooks/useLocationPathname';
import PHIModal from '@kitman/modules/src/PHIModal/PHIModal';
import { TextButton } from '@kitman/components';

import PHIAndPIIAlertBanner from '@kitman/modules/src/AppHeader/src/components/PHIAndPIIAlertBanner/PHIAndPIIAlertBanner';
import { EventSwitcherSidePanelTranslated as EventSwitcherSidePanel } from '@kitman/modules/src/EventSwitcherSidePanel/EventSwitcherSidePanel';
import {
  onCloseEventSelect,
  onOpenEventSelect,
} from '@kitman/modules/src/EventSwitcherSidePanel/redux/slices/eventSwitchSlice';
import {
  onClosePlayerSelect,
  onOpenPlayerSelect,
} from '@kitman/modules/src/PlayerSelectSidePanel/redux/slices/playerSelectSlice';
import i18n from '@kitman/common/src/utils/i18n';
import { useBrowserTabTitle } from '@kitman/common/src/hooks';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import performanceMedicineEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/performanceMedicine';

import UserMenu from '../../../UserMenu';
import OrganisationSelector from './OrganisationSelector';
import getPageTitle from '../../resources/pageTitle';
import PHIAndPIICheck from '../../resources/PHIAndPIICheck';
import type { AppHeaderProps } from '../../types';
import PlayerSelectSidePanelContainer from '../../../PlayerSelectSidePanel/PlayerSelectSidePanelContainer';

const AppHeader = (props: AppHeaderProps) => {
  const { trackEvent } = useEventTracking();
  const { permissions } = usePermissions();
  const dispatch = useDispatch();
  const locationPathname = useLocationPathname();
  const { isPHI, isPII } = PHIAndPIICheck();
  const ipForGovernment = window.ipForGovernment;
  const pageTitle = getPageTitle(
    locationPathname,
    permissions,
    props.currentUser.athlete
  );
  useBrowserTabTitle(pageTitle);

  const { isPlayerSelectOpen } = useSelector(
    (state) => state.playerSelectSlice
  );

  const { isEventSwitcherOpen } = useSelector(
    (state) => state.eventSwitcherSlice
  );

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
    !canViewSessionPlanner; // only display canViewPlayerSelector when session planner isn't being displayed

  const handleShowPlayerSelect = () => {
    if (isPlayerSelectOpen) {
      trackEvent(performanceMedicineEventNames.playerListClosed);
      dispatch(onClosePlayerSelect());
    } else {
      trackEvent(performanceMedicineEventNames.playerListOpened);
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

  return (
    <>
      <header className="appHeader" data-testid="appHeader">
        <div className="appHeader__leftContent">
          <h2 className="appHeader__pageName">{pageTitle}</h2>
          {canViewSessionPlanner && (
            <>
              <TextButton
                onClick={handleShowEventSwitcher}
                text={i18n.t('Event list')}
                iconBefore="icon-calendar"
                iconAfter={
                  isEventSwitcherOpen
                    ? 'icon-double-arrow-left'
                    : 'icon-double-arrow-right'
                }
                size="extraSmall"
              />
              <EventSwitcherSidePanel
                isOpen={isEventSwitcherOpen}
                eventId={eventId}
                onClosePanel={handleShowEventSwitcher}
              />
            </>
          )}
          {canViewPlayerSelector && props.currentSquad && (
            <>
              {window.getFlag('show-accent-player-list-btn') && (
                <TextButton
                  text={i18n.t('Player list')}
                  className="appHeader__textButton--accent"
                  type="primary"
                  onClick={handleShowPlayerSelect}
                  iconAfter={
                    isPlayerSelectOpen
                      ? 'icon-double-arrow-left'
                      : 'icon-double-arrow-right'
                  }
                  size="small"
                  kitmanDesignSystem
                />
              )}

              {!window.getFlag('show-accent-player-list-btn') && (
                <TextButton
                  onClick={handleShowPlayerSelect}
                  text={i18n.t('Player list')}
                  iconBefore="icon-user"
                  iconAfter={
                    isPlayerSelectOpen
                      ? 'icon-double-arrow-left'
                      : 'icon-double-arrow-right'
                  }
                  size="extraSmall"
                />
              )}

              <PlayerSelectSidePanelContainer
                isOpen={isPlayerSelectOpen}
                setIsPlayerSelectPanelOpen={handleShowPlayerSelect}
                currentSquad={props.currentSquad}
              />
            </>
          )}
        </div>

        {props.adminBar?.include_admin_bar && (
          <div className="appHeader__orgSelector">
            <OrganisationSelector
              adminBar={props.adminBar}
              currentUserId={`${props.currentUser.id}`}
            />
          </div>
        )}

        <section className="appHeader__rightContent">
          <UserMenu
            orgNickname={props.orgNickname}
            locale={props.locale}
            logoPath={props.logoPath}
            logoPathRetina={props.logoPathRetina}
            currentUser={props.currentUser}
            currentSquad={props.currentSquad}
            availableSquads={props.availableSquads}
          />
        </section>
      </header>
      <PHIModal />
      {ipForGovernment && <PHIAndPIIAlertBanner isPHI={isPHI} isPII={isPII} />}
    </>
  );
};

export default AppHeader;
