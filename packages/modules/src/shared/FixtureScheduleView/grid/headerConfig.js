// @flow
import i18n from '@kitman/common/src/utils/i18n';
import { GridCellParams } from '@mui/x-data-grid';
import { Chip, Tooltip } from '@kitman/playbook/components';
import LimitedChips from '@kitman/modules/src/LeagueOperations/shared/components/LimitedChips';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import { FALLBACK_DASH } from '@kitman/common/src/variables';
import {
  ScoutAccessActionsMenuCell,
  getLeagueFixturesActionCell,
  getMatchDayActionsCell,
  getScoutAccessManagementActionsCell,
  renderCountdownCell,
  renderKitMatrixCardCell,
  renderMatchDayStatusCell,
  getScoutAttendeesCell,
} from './cellConfig';

const getGridToolTipLabels = () => ({
  homeOutfieldKit: i18n.t('Home Outfield Kit'),
  homeGkKit: i18n.t('Home GK Kit'),
  officialKit: i18n.t('Officials Kit'),
  awayGkKit: i18n.t('Away GK Kit'),
  awayOutfieldKit: i18n.t('Away Outfield Kit'),
});

const getTeamHeader = (team: string) => ({
  field: `${team.toLowerCase()}Team`,
  headerName: i18n.t('{{team}}', { team }),
  width: 150,
  sortable: false,
});

const getTeamIconHeader = (team: string) => ({
  field: `${team}TeamIcon`,
  headerName: '',
  renderCell: (params: GridCellParams) => {
    return <img src={params.value} alt={params.row.name} width={30} />;
  },
  width: 40,
  sortable: false,
});

const getScoreHeader = () => ({
  field: 'score',
  headerName: i18n.t('Score'),
  width: 75,
  sortable: false,
});

const getSquadHeader = () => ({
  field: 'squad',
  headerName: i18n.t('Squad'),
  width: 120,
  sortable: false,
});

const getCompetitionHeader = () => ({
  field: 'competition',
  headerName: i18n.t('Competition'),
  width: 140,
  sortable: false,
});

const getHomePlayerOutfieldKitHeader = () => ({
  field: 'homePlayer',
  headerName: '',
  width: 40,
  sortable: false,
  renderHeader: () => (
    <Tooltip title={getGridToolTipLabels().homeOutfieldKit}>
      <div>
        <KitmanIcon name={KITMAN_ICON_NAMES.GroupsOutlined} />
      </div>
    </Tooltip>
  ),
  renderCell: renderKitMatrixCardCell,
});

const getHomeGoalkeeperKitHeader = () => ({
  field: 'homeGoalkeeper',
  headerName: '',
  width: 40,
  sortable: false,
  renderHeader: () => (
    <Tooltip title={getGridToolTipLabels().homeGkKit}>
      <div>
        <KitmanIcon name={KITMAN_ICON_NAMES.BackHandOutlined} />
      </div>
    </Tooltip>
  ),
  renderCell: renderKitMatrixCardCell,
});

const getRefereeKitHeader = () => ({
  field: 'referee',
  headerName: '',
  width: 40,
  sortable: false,
  renderHeader: () => (
    <Tooltip title={getGridToolTipLabels().officialKit}>
      <div>
        <KitmanIcon name={KITMAN_ICON_NAMES.SportsOutlined} />
      </div>
    </Tooltip>
  ),
  renderCell: renderKitMatrixCardCell,
});

const getAwayGoalkeeperKitHeader = () => ({
  field: 'awayGoalkeeper',
  headerName: i18n.t('Away Team Goalkeeper'),
  width: 40,
  sortable: false,
  renderHeader: () => (
    <Tooltip title={getGridToolTipLabels().awayGkKit}>
      <div>
        <KitmanIcon name={KITMAN_ICON_NAMES.BackHandOutlined} />
      </div>
    </Tooltip>
  ),
  renderCell: renderKitMatrixCardCell,
});

const getAwayPlayerOutfieldKitHeader = () => ({
  field: 'awayPlayer',
  headerName: '',
  width: 40,
  sortable: false,
  renderHeader: () => (
    <Tooltip title={getGridToolTipLabels().awayOutfieldKit}>
      <div>
        <KitmanIcon name={KITMAN_ICON_NAMES.GroupsOutlined} />
      </div>
    </Tooltip>
  ),
  renderCell: renderKitMatrixCardCell,
});

const getMatchDayHeader = () => ({
  field: 'round',
  headerName: i18n.t('Match Day'),
  width: 100,
  sortable: false,
  align: 'center',
});

const getMatchIdHeader = (useMatchNumberDisplay: boolean) => ({
  field: 'matchId',
  headerName: useMatchNumberDisplay ? i18n.t('Match #') : i18n.t('Match ID'),
  width: useMatchNumberDisplay ? 140 : 175,
  sortable: false,
});

const getLeagueMatchDayHeader = () => ({
  field: 'round_number',
  headerName: i18n.t('Match Day'),
  width: 140,
  sortable: false,
});

const getDateHeader = () => ({
  field: 'date',
  headerName: i18n.t('Date'),
  width: 120,
  sortable: false,
});

const getTimeHeader = (useMatchDayTimeDisplay?: boolean) => ({
  field: 'time',
  headerName: i18n.t('Time'),
  width: useMatchDayTimeDisplay ? 140 : 200,
  sortable: false,
});

const getLocationHeader = () => ({
  field: 'location',
  headerName: i18n.t('Location / Pitch'),
  width: 150,
  sortable: false,
});

export const getStatusHeader = () => ({
  field: 'status',
  headerName: i18n.t('Status'),
  width: 200,
  sortable: false,
  renderCell: (params: GridCellParams) => (
    <Chip label={params.value.chipLabel} style={params.value.chipStyle} />
  ),
});

export const getAccessStatusHeader = (canManageAccess: boolean) => ({
  field: 'accessStatus',
  headerName: i18n.t('Access status'),
  width: 165,
  sortable: false,
  renderCell: (params: GridCellParams) =>
    getScoutAccessManagementActionsCell(params, canManageAccess),
});

export const getScoutAttendeesHeader = () => ({
  field: 'scoutAttendees',
  headerName: i18n.t('Scout attendees'),
  width: 220,
  sortable: false,
  renderCell: (params: GridCellParams) => getScoutAttendeesCell(params),
});

export const getLockStatusHeader = () => ({
  field: 'lock',
  headerName: '',
  width: 10,
  sortable: false,
  renderCell: (params: GridCellParams) => (
    <>
      {params?.value?.isLocked && (
        <Tooltip title={i18n.t('No longer accepting scout requests')}>
          <div>
            <KitmanIcon
              name={KITMAN_ICON_NAMES.Lock}
              style={{
                fontSize: '20px',
              }}
            />
          </div>
        </Tooltip>
      )}
    </>
  ),
});

const getKickTimeHeader = () => ({
  field: 'kickTime',
  headerName: i18n.t('Kick Time'),
  width: 140,
  sortable: false,
});

const getCountdownHeader = () => ({
  field: 'countdown',
  headerName: i18n.t('Countdown'),
  width: 120,
  sortable: false,
  renderCell: renderCountdownCell,
});

const getMatchMonitorHeader = () => ({
  field: 'match_monitors',
  headerName: i18n.t('Match Monitor Attendees'),
  width: 250,
  sortable: false,
  renderCell: (params: GridCellParams) => {
    const matchMonitors = params?.row?.matchMonitors.length
      ? params?.row?.matchMonitors.map((monitor) => ({
          ...monitor,
          name: monitor.fullname,
        }))
      : [];
    if (matchMonitors.length) {
      return <LimitedChips items={matchMonitors} maxVisible={1} />;
    }
    return FALLBACK_DASH;
  },
});

export const LeagueScheduleActionsHeader = {
  field: 'actions',
  type: 'actions',
  width: 10,
  getActions: getLeagueFixturesActionCell,
};

export const getScoutAccessActionsHeader = ({
  doesHaveExternalAccessActions,
}: {
  doesHaveExternalAccessActions: boolean,
}) => ({
  field: 'actions',
  type: 'actions',
  width: 10,
  renderCell: (params: GridCellParams) => (
    <ScoutAccessActionsMenuCell
      key={params?.value?.event?.id}
      event={params?.value?.event}
      isVisible={params?.value?.isVisible}
      doesHaveExternalAccessActions={doesHaveExternalAccessActions}
      handleMenuButtonAction={params?.value?.handleMenuButtonAction}
    />
  ),
});

export const MatchDayStatusHeader = {
  field: 'dmr',
  headerName: 'DMR',
  width: 60,
  sortable: false,
  align: 'center',
  renderCell: renderMatchDayStatusCell,
};

export const MatchDayActionsHeader = {
  field: 'actions',
  type: 'actions',
  width: 80,
  getActions: getMatchDayActionsCell,
};

export const getLeagueScheduleHeaders = (
  showMatchDayHeader: boolean = false,
  showMatchMonitorColumn: boolean = false
) => {
  return [
    getTeamHeader('Home'),
    getTeamIconHeader('home'),
    getScoreHeader(),
    getTeamIconHeader('away'),
    getTeamHeader('Away'),
    getMatchIdHeader(false),
    ...(showMatchDayHeader ? [getLeagueMatchDayHeader()] : []),
    getSquadHeader(),
    getCompetitionHeader(),
    getDateHeader(),
    getTimeHeader(),
    getLocationHeader(),
    ...(showMatchMonitorColumn ? [getMatchMonitorHeader()] : []),
  ];
};

export const MatchDayScheduleHeaders = [
  getTeamHeader('Home'),
  getTeamIconHeader('home'),
  getHomePlayerOutfieldKitHeader(),
  getHomeGoalkeeperKitHeader(),
  getRefereeKitHeader(),
  getAwayGoalkeeperKitHeader(),
  getAwayPlayerOutfieldKitHeader(),
  getTeamIconHeader('away'),
  getTeamHeader('Away'),
  getMatchDayHeader(),
  getMatchIdHeader(true),
  getDateHeader(),
  getTimeHeader(true),
  getKickTimeHeader(),
  getCountdownHeader(),
];
