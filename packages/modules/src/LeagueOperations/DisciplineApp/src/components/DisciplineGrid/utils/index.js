/* eslint-disable camelcase */
// @flow
import type { Node } from 'react';
import moment from 'moment';
import { MenuItem } from '@kitman/playbook/components';
import GridRowActions from '@kitman/modules/src/LeagueOperations/shared/components/GridRowActions';
import i18n from '@kitman/common/src/utils/i18n';
import {
  ELIGIBLE,
  CARD_RED,
  CARD_YELLOW,
  FALLBACK_DASH,
} from '@kitman/modules/src/LeagueOperations/shared/consts';
import {
  type DisciplineSearchItem,
  type DisciplinaryIssue,
  type IssueType,
  type DisciplineOrganisation,
  type DisciplinaryStatus,
} from '@kitman/modules/src/LeagueOperations/shared/types/discipline';
import {
  type UserDisciplineRow,
  type AvatarCell,
} from '@kitman/modules/src/LeagueOperations/shared/components/GridConfiguration/types';
import {
  formatAvatarCell,
  formatDisciplinaryStatusCell,
} from '@kitman/modules/src/LeagueOperations/shared/components/GridConfiguration/cells';
import {
  getDisciplinaryIssueCount,
  onActionClick,
} from '@kitman/modules/src/LeagueOperations/DisciplineApp/src/components/DisciplineTabs/utils';
import { getSuspendedInfo } from '@kitman/modules/src/LeagueOperations/shared/components/Tabs/TabAthleteDiscipline/utils';

type Permissions = {
  canManageDiscipline: boolean,
};

type Row<TValue> = {
  value: TValue,
  row: UserDisciplineRow,
};

type Dispatch = () => void;

type BuildActionsProps = {
  row: UserDisciplineRow,
  permissions: Permissions,
  dispatch: Dispatch,
};

type GetColumnProps = {
  permissions: Permissions,
  dispatch: Dispatch,
};

const buildActions = ({
  row,
  permissions,
  dispatch,
}: BuildActionsProps): Array<Node> => {
  const isSuspended = row.discipline_status === 'Suspended';
  const actions = [
    {
      isVisible: permissions.canManageDiscipline,
      element: (
        <MenuItem
          key="suspendDisciplineAction"
          onClick={() =>
            onActionClick({
              row,
              mode: 'CREATE_DISCIPLINARY_ISSUE',
              dispatch,
              openPanel: true,
            })
          }
        >
          {i18n.t('Suspend')}
        </MenuItem>
      ),
    },
    {
      isVisible: permissions.canManageDiscipline && isSuspended,
      element: (
        <MenuItem
          key="editDisciplineAction"
          onClick={() =>
            onActionClick({
              row,
              mode: 'UPDATE_DISCIPLINARY_ISSUE',
              dispatch,
              openPanel: true,
            })
          }
        >
          {i18n.t('Edit')}
        </MenuItem>
      ),
    },
    {
      isVisible: permissions.canManageDiscipline && isSuspended,
      element: (
        <MenuItem
          key="deleteDisciplineAction"
          onClick={() =>
            onActionClick({
              row,
              mode: 'DELETE_DISCIPLINARY_ISSUE',
              dispatch,
              openPanel: false,
            })
          }
        >
          {i18n.t('Delete')}
        </MenuItem>
      ),
    },
  ];

  return actions
    .filter((action) => action.isVisible)
    .map((action) => action.element);
};

export const getDisciplineColumns = ({
  permissions,
  dispatch,
}: GetColumnProps) => [
  {
    field: 'athlete',
    headerName: i18n.t('Player'),
    flex: 1,
    sortable: false,
    minWidth: 250,
    renderCell: ({ value }: Row<Array<AvatarCell>>) => {
      return formatAvatarCell(value);
    },
  },
  {
    field: 'club',
    headerName: i18n.t('Club'),
    flex: 1,
    sortable: false,
    minWidth: 200,
    renderCell: ({ value }: Row<Array<DisciplineOrganisation>>) => {
      const clubs = value.map(
        ({ id, logo_full_path: avatar_src, name: text }) => ({
          id,
          text,
          avatar_src,
        })
      );
      return formatAvatarCell(clubs);
    },
  },
  {
    field: 'red_cards',
    headerName: i18n.t('Red cards'),
    flex: 1,
    sortable: false,
    minWidth: 85,
    renderCell: ({
      value,
    }: Row<{
      disciplinary_issues: Array<DisciplinaryIssue>,
      type: IssueType,
    }>) => getDisciplinaryIssueCount(value),
  },
  {
    field: 'yellow_cards',
    headerName: i18n.t('Yellow cards'),
    flex: 1,
    sortable: false,
    minWidth: 85,
    renderCell: ({
      value,
    }: Row<{
      disciplinary_issues: Array<DisciplinaryIssue>,
      type: IssueType,
    }>) => getDisciplinaryIssueCount(value),
  },
  {
    field: 'total_suspensions',
    headerName: i18n.t('Total suspensions'),
    flex: 1,
    sortable: false,
    minWidth: 85,
  },
  {
    field: 'suspended_until',
    headerName: i18n.t('Suspended'),
    flex: 1,
    sortable: false,
    minWidth: 100,
    renderCell: ({ value }: Row<DisciplineSearchItem>) =>
      getSuspendedInfo(value),
  },
  {
    field: 'discipline_status',
    headerName: i18n.t('Discipline status'),
    flex: 1,
    sortable: false,
    minWidth: 100,
    renderCell: ({ value: status }: Row<DisciplinaryStatus>) =>
      formatDisciplinaryStatusCell({ status, withTooltip: false }),
  },
  {
    field: 'actions',
    headerName: '',
    sortable: false,
    filterable: false,
    flex: 1,
    align: 'right',
    minWidth: 55,
    maxWidth: 55,
    renderCell: ({ row }: Row<UserDisciplineRow>) => (
      <GridRowActions>
        {buildActions({ row, permissions, dispatch, onActionClick })}
      </GridRowActions>
    ),
  },
];

export const mapDataToRows = (
  rows: Array<DisciplineSearchItem> = []
): Array<Object> =>
  rows.map((row) => {
    const {
      user_id,
      organisations,
      disciplinary_issues,
      total_disciplines,
      discipline_status,
      squads,
      jersey_number,
      active_discipline,
      firstname,
      lastname,
      avatar_url,
    } = row;

    return {
      id: user_id,
      athlete: [
        {
          id: user_id,
          text: `${firstname} ${lastname}`,
          avatar_src: avatar_url,
          href: `/league-fixtures/discipline/${user_id}`,
        },
      ],
      discipline_status: discipline_status ?? ELIGIBLE,
      club: organisations || [],
      jersey_no: jersey_number ?? FALLBACK_DASH,
      red_cards: {
        disciplinary_issues,
        type: CARD_RED,
      },
      yellow_cards: {
        disciplinary_issues,
        type: CARD_YELLOW,
      },
      total_suspensions: total_disciplines || 0,
      suspended_until: row,
      team: squads?.[0]?.name ?? FALLBACK_DASH,
      active_discipline: active_discipline ?? null,
      squads,
    };
  });

export const getDefaultFilters = (seasonMarkers: {
  start_date: string | null,
  end_date: string | null,
}) => ({
  search_expression: '',
  page: 1,
  per_page: 30,
  competition_ids: [],
  filter_organisation_ids: [],
  filter_discipline_status: '',
  red_cards: { max: null, min: null },
  yellow_cards: { max: null, min: null },
  date_range: {
    start_date: moment(seasonMarkers.start_date).format('YYYY-MM-DD'),
    end_date: moment(seasonMarkers.end_date).format('YYYY-MM-DD'),
  },
});
