// @flow
import { useState } from 'react';
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { useSelector } from 'react-redux';
import type { PitchViewInitialState } from '@kitman/common/src/types/PitchView';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import colors from '@kitman/common/src/variables/colors';
import {
  Stack,
  ToggleButtonGroup,
  ToggleButton,
  DataGrid,
} from '@kitman/playbook/components';
import { teamTypes } from '@kitman/common/src/consts/gameEventConsts';
import useLeagueOperations from '@kitman/common/src/hooks/useLeagueOperations';
import useWindowSize from '@kitman/common/src/hooks/useWindowSize';

import useTeamDetailsGridConfig from '../MatchReportTeamDetails/useTeamDetailsGridConfig';
import { MATCH_REPORT_TABS } from '../../consts/matchReportConsts';

type Props = {
  tabTitle: $Values<typeof MATCH_REPORT_TABS>,
};
const TabMatchReportEvents = (props: I18nProps<Props>) => {
  const { isScout } = useLeagueOperations();
  const { windowWidth, tabletSize } = useWindowSize();

  const isSmallDevice = windowWidth < tabletSize;

  const { teams } = useSelector<PitchViewInitialState>(
    (state) => state.planningEvent.pitchView
  );

  const [selectedTeamButton, setSelectedTeamButton] = useState<string>(
    teamTypes.home
  );

  const selectedTeam = teams[selectedTeamButton];
  const selectedTeamInfo =
    props.tabTitle === MATCH_REPORT_TABS.PLAYERS
      ? selectedTeam.listPlayers
      : selectedTeam.staff;

  const { columns, rows, dataGridCustomStyle } = useTeamDetailsGridConfig({
    currentTab: props.tabTitle,
    gridData: selectedTeamInfo,
    isScout,
  });

  const renderTeamRosterInformation = () => (
    <Stack sx={{ flexDirection: 'column', flex: 1 }}>
      <ToggleButtonGroup
        color="primary"
        value={selectedTeamButton}
        exclusive
        onChange={(event, newValue) => {
          if (newValue) {
            setSelectedTeamButton(newValue);
          }
        }}
      >
        <ToggleButton value={teamTypes.home}>{props.t('Home')}</ToggleButton>
        <ToggleButton value={teamTypes.away}>{props.t('Away')}</ToggleButton>
      </ToggleButtonGroup>

      <Stack sx={{ flex: 1 }}>
        <DataGrid
          columns={columns}
          rows={rows}
          sx={dataGridCustomStyle}
          hideFooter
        />
      </Stack>
    </Stack>
  );
  return (
    <Stack
      sx={{
        flexDirection: isSmallDevice ? 'column' : 'row',
        backgroundColor: colors.white,
        padding: '24px 12px',
        flex: 1,
      }}
    >
      {renderTeamRosterInformation()}
    </Stack>
  );
};

export const TabMatchReportEventsTranslated: ComponentType<Props> =
  withNamespaces()(TabMatchReportEvents);

export default TabMatchReportEvents;
