// @flow
import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';
import DivisionSquadSelector from '@kitman/modules/src/LeagueOperations/shared/components/DivisionSquadSelector';
import type { Squad } from '@kitman/common/src/types/__common';
import SquadSelector from './SquadSelector';
import { ProfileTooltipTranslated as ProfileTooltip } from './ProfileTooltip';

type Props = {
  locale: string,
  logoPath: string,
  logoPathRetina: string,
  currentUser: Object,
  currentSquad: ?Squad,
  availableSquads: Array<Squad>,
  orgNickname: string,
};

const UserMenu = (props: Props) => {
  const { preferences } = usePreferences();
  const getUserInitials = () =>
    `${props.currentUser.firstname[0].toUpperCase()}${props.currentUser.lastname[0].toUpperCase()}`;

  const getSquadLogo = () =>
    window.featureFlags['ip-login-branding'] ? (
      <img
        src={props.logoPath}
        srcSet={`${props.logoPath} 1x, ${props.logoPathRetina} 2x`}
        alt={`${props.orgNickname}'s logo`}
        className="ip-userMenu__ip-orgLogo"
      />
    ) : (
      <img
        src={props.logoPath}
        srcSet={`${props.logoPath} 1x, ${props.logoPathRetina} 2x`}
        alt="Squad Logo"
        className="userMenu__orgLogo"
      />
    );

  const renderSquadSelector = () => {
    if (props.currentSquad) {
      if (preferences?.division_squad_selector_enabled) {
        return (
          <DivisionSquadSelector
            locale={props.locale}
            currentUser={props.currentUser}
            currentSquad={props.currentSquad}
            availableSquads={props.availableSquads}
          />
        );
      }
      return (
        <SquadSelector
          locale={props.locale}
          currentUser={props.currentUser}
          currentSquad={props.currentSquad}
          availableSquads={props.availableSquads}
          userInitials={getUserInitials()}
        />
      );
    }

    return null;
  };

  return (
    <div
      className={
        window.featureFlags['ip-login-branding'] ? 'ip-userMenu' : 'userMenu'
      }
    >
      {!window.getFlag('league-ops-hide-squad-selector') && getSquadLogo()}
      {!window.getFlag('league-ops-hide-squad-selector') &&
        renderSquadSelector()}
      <ProfileTooltip
        currentUser={props.currentUser}
        userInitials={getUserInitials()}
      />
    </div>
  );
};

export default UserMenu;
