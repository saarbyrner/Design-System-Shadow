// @flow
import classNames from 'classnames';

import { type Squad } from '@kitman/common/src/types/__common';
import { type InitialData } from '@kitman/services/src/services/getInitialData';
import { TooltipMenu } from '@kitman/components';
import { localeSortByField } from '@kitman/common/src/utils/localeSort';
import { zIndices } from '@kitman/common/src/variables';
import { setLastKnownSquad } from '@kitman/modules/src/initialiseProfiler/modules/utilities/openLastKnownPageOnSignIn';
import { isConnectedToStaging } from '@kitman/common/src/variables/isConnectedToStaging';

type Props = {
  locale: string,
  currentSquad: Squad,
  currentUser: $PropertyType<InitialData, 'current_user'>,
  availableSquads: Array<Squad>,
};

function getSquadChangeHref(squadId: string | number) {
  if (isConnectedToStaging) return null;

  if (window.getFlag('redirect-after-squad-change')) {
    return `/settings/set_squad/${squadId}?redirect_route=${window.location.pathname}${window.location.search}`;
  }

  return `/settings/set_squad/${squadId}`;
}

const SquadSelector = (props: Props) => {
  const isAllowedToChangeSquad = !props.currentUser.athlete;
  const menuItems = localeSortByField(
    props.availableSquads.map((squad) => {
      return {
        description: squad.name,
        // If local development environment is connected to staging, squad
        // change is handled in setLastKnownSquad by setting
        // last_selected_squad_id cookie's value. Nothing must be passed to
        // href because otherwise React Router tries to handle the path and
        // returns <NoRoute /> instead of passing request right through to be
        // handled by medinah. This happens only when local development
        // environment is connected to staging and not on staging and
        // production because of our proxy config's context function which
        // could have been configured to handle the path instead of React
        // Router, but there is no benefit in that.
        href: getSquadChangeHref(squad.id),
        isSelected: props.currentSquad
          ? props.currentSquad.id === squad.id
          : false,
        onClick: () => {
          // Mark that we want to restore after squad change
          // This flag will survive the page reload via sessionStorage
          // Persist last known squad (cookie) for server-driven change paths
          setLastKnownSquad(squad.id, `${props.currentUser.id}`);

          // The href will naturally handle the navigation to /settings/set_squad/:id
          // which triggers a server-side redirect back to the app with the new squad
        },
      };
    }),
    'description',
    props.locale
  );

  const triggerElClassnames = classNames('squadSelector__tooltipTriggerEl', {
    'squadSelector__tooltipTriggerEl--disabled': !isAllowedToChangeSquad,
  });

  return (
    <div data-testid="squadSelector" className="squadSelector">
      <TooltipMenu
        placement="bottom-end"
        disabled={!isAllowedToChangeSquad}
        offset={[0, 3]}
        menuItems={menuItems}
        closeOnResize
        tooltipTriggerElement={
          <div className={triggerElClassnames}>
            <span className="squadSelector__squadName">
              {props.currentSquad.name}
            </span>
            <span className="squadSelector__dropdownIcon icon-down" />
          </div>
        }
        kitmanDesignSystem
        zIndex={zIndices.navBarDropDown}
      />
    </div>
  );
};

export default SquadSelector;
