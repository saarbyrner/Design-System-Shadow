// @flow
import moment from 'moment/moment';
import i18n from '@kitman/common/src/utils/i18n';
import { formatTwoDigitYear } from '@kitman/common/src/utils/dateFormatter';
import { getPlayerNumber } from '@kitman/modules/src/PlanningEvent/src/helpers/utils';
import { Stack, Typography } from '@kitman/playbook/components';
import { colors } from '@kitman/common/src/variables';

import { MATCH_REPORT_TABS } from '../../consts/matchReportConsts';

type GridData = {
  id: number,
  avatar_url?: string,
  fullname?: string,
  squad_number?: number,
  position?: { abbreviation: string },
  date_of_birth?: string,
  designation?: string,
  graduation_date?: string,
  squad_name?: string,
  user?: {
    avatar_url: string,
    fullname: string,
    role: string,
  },
};

type PlayerRow = {
  id: number,
  player: { avatar?: string, name?: string },
  jersey?: string,
  position?: string,
  dateOfBirth?: string,
  designation?: string,
  gradYear?: string,
  squad?: string,
};

type StaffRow = {
  id: number,
  staff: { avatar?: string, name?: string },
  role?: string,
};

type GridRow = PlayerRow | StaffRow;

type Props = {
  currentTab: $Values<typeof MATCH_REPORT_TABS>,
  gridData: Array<GridData>,
  isScout: boolean,
};

const useTeamDetailsGridConfig = (props: Props) => {
  const { currentTab, gridData, isScout } = props;

  const renderTeamInfoCell = (teamInfo: { avatar: string, name: string }) => (
    <Stack flexDirection="row" alignItems="center" gap={1}>
      <img
        src={
          teamInfo.avatar ||
          'https://kitman-staging.imgix.net/avatar.jpg?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&w=100'
        }
        alt={teamInfo?.name}
        style={{ width: '25px', borderRadius: '15px' }}
      />
      <Typography
        sx={{
          whiteSpace: 'pre-line',
          color: colors.grey_200,
          fontWeight: '600',
          fontSize: '14px',
        }}
      >
        {teamInfo?.name}
      </Typography>
    </Stack>
  );

  let columns =
    currentTab === MATCH_REPORT_TABS.PLAYERS
      ? [
          {
            field: 'player',
            headerName: i18n.t('Player'),
            flex: 1,
            minWidth: 207,
            sortable: false,
            renderCell: ({ row }: { row: Object }) =>
              renderTeamInfoCell(row.player),
          },
          {
            field: 'jersey',
            headerName: i18n.t('Jersey'),
            minWidth: 104,
            flex: 0.25,
            sortable: false,
          },
          {
            field: 'position',
            headerName: i18n.t('Position'),
            minWidth: 104,
            flex: 0.25,
            sortable: false,
          },
          {
            field: 'dateOfBirth',
            headerName: i18n.t('DOB'),
            minWidth: 104,
            flex: 0.25,
            sortable: false,
          },
        ]
      : [
          {
            field: 'staff',
            headerName: i18n.t('Staff'),
            flex: 1,
            minWidth: 303,
            sortable: false,
            renderCell: ({ row }: { row: Object }) =>
              renderTeamInfoCell(row.staff),
          },
          {
            field: 'role',
            headerName: i18n.t('Role'),
            flex: 1,
            minWidth: 303,
            sortable: false,
          },
        ];

  if (currentTab === MATCH_REPORT_TABS.PLAYERS && isScout) {
    columns = [
      ...columns,
      {
        field: 'gradYear',
        headerName: i18n.t('Grad year'),
        minWidth: 104,
        flex: 0.25,
        sortable: false,
      },
      {
        field: 'squad',
        headerName: i18n.t('Age group'),
        minWidth: 115,
        flex: 0.4,
        sortable: false,
      },
    ];
  } else if (currentTab === MATCH_REPORT_TABS.PLAYERS && !isScout) {
    columns = [
      ...columns,
      {
        field: 'designation',
        headerName: i18n.t('Designation'),
        minWidth: 125,
        flex: 0.5,
        sortable: false,
      },
    ];
  }

  let rows: Array<GridRow> = [];
  if (currentTab === MATCH_REPORT_TABS.PLAYERS) {
    rows = gridData.map((data) => ({
      id: data.id,
      player: { avatar: data?.avatar_url, name: data?.fullname },
      jersey: getPlayerNumber(data.squad_number),
      position: data.position?.abbreviation,
      dateOfBirth: formatTwoDigitYear(moment(data.date_of_birth)),
      designation: data.designation,
      gradYear: data.graduation_date,
      squad: data.squad_name,
    }));
  }
  if (currentTab === MATCH_REPORT_TABS.STAFF) {
    rows = gridData.map((data) => ({
      id: data.id,
      staff: { avatar: data.user?.avatar_url, name: data.user?.fullname },
      role: data.user?.role,
    }));
  }

  const dataGridCustomStyle = {
    color: colors.grey_100,
    fontsize: '13px',
    '&, [class^=MuiDataGrid]': {
      borderTop: 'none',
      borderRight: 'none',
      borderLeft: 'none',
    },
    '[class^=MuiDataGrid-columnHeader]': {
      fontWeight: '600',
      fontSize: '14px',
    },
  };

  return {
    columns,
    rows,
    dataGridCustomStyle,
  };
};

export default useTeamDetailsGridConfig;
