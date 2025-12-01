// @flow
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { Game } from '@kitman/common/src/types/Event';
import { Stack } from '@kitman/playbook/components';
import type {
  GameScores,
  MatchReportPenaltyListStorage,
} from '@kitman/common/src/types/GameEvent';
import colors from '@kitman/common/src/variables/colors';
import TabContainer from '@kitman/modules/src/LeagueOperations/shared/components/TabsContainer';
import type { TabConfig } from '@kitman/modules/src/LeagueOperations/shared/types/tabs';
import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';

import { TabMatchReportEventsTranslated as TabMatchReportEvents } from './TabMatchReportEvents';
import { MatchReportHeaderMUITranslated as MatchReportHeaderMUI } from './MatchReportHeader/MatchReportHeaderMUI';
import MatchReportScorelineSubHeader from './MatchReportScorelineSubHeader';
import { MATCH_REPORT_TABS } from '../consts/matchReportConsts';

type Props = {
  event: ?Game,
  areHeaderButtonsDisabled?: boolean,
  isEditMode?: boolean,
  gameScores: GameScores,
  setGameScores: (GameScores) => void,
  penaltyShootoutActivities: MatchReportPenaltyListStorage,
  enableEditMode: () => void,
  handleOnSaveReport: ({ isSubmit: boolean }) => void,
  handleRevertingReportChanges: () => void,
};
const MatchReportMUI = (props: I18nProps<Props>) => {
  const { preferences } = usePreferences();

  const tabs: Array<TabConfig> = [
    {
      isPermitted: true,
      label: props.t('Athlete events'),
      value: MATCH_REPORT_TABS.PLAYERS,
      content: <TabMatchReportEvents tabTitle={MATCH_REPORT_TABS.PLAYERS} />,
    },
    {
      isPermitted: true,
      label: props.t('Staff events'),
      value: MATCH_REPORT_TABS.STAFF,
      content: <TabMatchReportEvents tabTitle={MATCH_REPORT_TABS.STAFF} />,
    },
    {
      isPermitted: preferences?.league_game_forms_tab,
      label: props.t('Forms'),
      value: MATCH_REPORT_TABS.FORM,
      content: <div>Forms</div>,
    },
  ].filter((tab) => tab.isPermitted);

  return (
    <Stack
      sx={{ flexDirection: 'column', backgroundColor: colors.white, flex: 1 }}
    >
      <MatchReportHeaderMUI {...props} />
      <MatchReportScorelineSubHeader
        event={props.event}
        isEditMode={props.isEditMode}
        gameScores={props.gameScores}
        setGameScores={props.setGameScores}
        penaltyActivities={props.penaltyShootoutActivities.localPenaltyLists}
      />
      <TabContainer
        titles={tabs.map(({ isPermitted, label, value }) => ({
          isPermitted,
          label,
          value,
        }))}
        content={tabs}
      />
    </Stack>
  );
};

export const MatchReportMUITranslated: ComponentType<Props> =
  withNamespaces()(MatchReportMUI);

export default MatchReportMUI;
