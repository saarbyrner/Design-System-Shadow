// @flow
import { useDispatch } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { Stack, Button } from '@kitman/playbook/components';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { mailingList } from '@kitman/modules/src/Contacts/shared/constants';
import type { MailingList } from '@kitman/modules/src/Contacts/shared/types';
import { onTogglePanel } from '@kitman/modules/src/PlanningEvent/src/redux/slices/matchDayEmailSlice';
import { toggleMatchDayView } from '@kitman/modules/src/PlanningEvent/src/redux/slices/planningEventSlice';
import usePdfTemplate from '@kitman/modules/src/PlanningEvent/src/hooks/usePdfTemplate';
import { Printable } from '@kitman/printing/src/renderers';
import {
  TeamRosterModern,
  TeamRosterClassic,
} from '@kitman/printing/src/templates';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';
import type { ComponentType } from 'react';

const styles = {
  toggleButton: {
    height: 'min-content',
  },
  button: {
    height: 'min-content',
  },
  team: {
    borderRadius: '0',
  },
};

type Props = {
  isLeague: boolean,
  eventId: number,
};

const MatchDayHeaderButtons = ({ t, isLeague, eventId }: I18nProps<Props>) => {
  const { permissions } = usePermissions();
  const { preferences } = usePreferences();

  const dispatch = useDispatch();
  const { getTemplateData, templateData, matchDayView } = usePdfTemplate();

  const handleOnToggle = () => {
    dispatch(onTogglePanel({ isOpen: true }));
  };

  const matchDayPermission =
    permissions?.leagueGame.manageGameInformation ||
    permissions?.leagueGame.manageGameTeam;

  const useCommunicationsFlow = preferences?.league_game_communications;
  const useTeamNotificationsFlow = preferences?.league_game_team_notifications;

  let TeamRosterComponent: ComponentType<any> | null = null;
  if (useCommunicationsFlow) {
    TeamRosterComponent = TeamRosterModern;
  } else if (useTeamNotificationsFlow) {
    TeamRosterComponent = TeamRosterClassic;
  }

  const showMatchDayEmailButton =
    matchDayPermission &&
    ((isLeague && useTeamNotificationsFlow) || useCommunicationsFlow);

  const renderButton = (
    listType: MailingList,
    permissionKey: string,
    preference: boolean
  ) => {
    const isVisible = preference && permissions?.leagueGame[permissionKey];

    if (!isVisible) return null;

    return (
      <Button
        color={matchDayView === listType ? 'primary' : 'secondary'}
        onClick={() => {
          dispatch(toggleMatchDayView(listType));
        }}
        sx={styles.button}
      >
        {listType.toUpperCase()}
      </Button>
    );
  };

  const renderDmnButton = () =>
    renderButton(
      mailingList.Dmn,
      'viewGameInformation',
      preferences?.league_game_information
    );
  const renderDmrButton = () =>
    renderButton(
      mailingList.Dmr,
      'viewGameTeam',
      preferences?.league_game_team
    );

  return (
    <Stack direction="row" gap={4}>
      {preferences?.league_game_team &&
        preferences?.league_game_information && (
          <Stack direction="row" gap={0.5}>
            {renderDmnButton()}
            {renderDmrButton()}
          </Stack>
        )}

      {showMatchDayEmailButton && (
        <Button color="primary" sx={styles.button} onClick={handleOnToggle}>
          {t('Email')}
        </Button>
      )}
      {!isLeague && (useTeamNotificationsFlow || useCommunicationsFlow) && (
        <Button
          color="primary"
          sx={styles.button}
          disabled={matchDayView !== 'dmr'}
          onClick={() => getTemplateData(eventId)}
        >
          <KitmanIcon
            name={KITMAN_ICON_NAMES.Print}
            sx={{
              marginRight: '6px',
            }}
          />
          {t('Team')}
        </Button>
      )}
      {!isLeague && matchDayView === 'dmr' && (
        <Printable>
          {templateData && TeamRosterComponent !== null && (
            <TeamRosterComponent templateData={templateData} />
          )}
        </Printable>
      )}
    </Stack>
  );
};

export const MatchDayHeaderButtonsTranslated = withNamespaces()(
  MatchDayHeaderButtons
);
export default MatchDayHeaderButtons;
