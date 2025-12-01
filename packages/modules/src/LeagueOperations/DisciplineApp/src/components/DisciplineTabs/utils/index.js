/* eslint-disable camelcase */
// @flow
import { GridActionsCellItem, type GridRowParams } from '@mui/x-data-grid-pro';
import {
  type DisciplineSearchItem,
  type DisciplinaryIssue,
  type IssueType,
  type DisciplinaryIssueMode,
  type DisciplineDispatch,
  type DisciplineSearchParams,
} from '@kitman/modules/src/LeagueOperations/shared/types/discipline';
import {
  FALLBACK_DASH,
  CREATE_DISCIPLINARY_ISSUE,
  UPDATE_DISCIPLINARY_ISSUE,
  DELETE_DISCIPLINARY_ISSUE,
} from '@kitman/modules/src/LeagueOperations/shared/consts';
import type {
  AthleteDisciplineRow,
  UserDisciplineRow,
} from '@kitman/modules/src/LeagueOperations/shared/components/GridConfiguration/types';
import {
  type OnSetPanelState,
  type OnSetDisciplineProfile,
  onTogglePanel,
  onToggleModal,
  onSetDisciplineProfile,
  onSetDisciplinaryIssueDetails,
  onSetActiveDisciplineIssue,
  onSetUserToBeDisciplined,
} from '@kitman/modules/src/LeagueOperations/shared/redux/slices/disciplinaryIssueSlice';
import type { RequestStatus } from '@kitman/modules/src/LeagueOperations/shared/hooks/useManageGridData';
import { GridSearchTranslated as GridSearch } from '@kitman/modules/src/LeagueOperations/shared/components/GridSearch';
import type { DisciplinePermissions } from '@kitman/modules/src/LeagueOperations/shared/types/permissions';
import { FilterSelector } from '@kitman/modules/src/LeagueOperations/DisciplineApp/src/components/DisciplineFilters/index';

export const transformUserAvatar = (profile: DisciplineSearchItem) => [
  {
    id: profile.user_id,
    text:
      profile.firstname && profile.lastname
        ? `${profile.firstname} ${profile.lastname}`
        : FALLBACK_DASH,
    avatar_src: profile.avatar_url ?? '',
    href: window.getFlag('league-ops-discipline-area-v2')
      ? `/league-fixtures/discipline/${profile.user_id}`
      : `/registration/profile?id=${profile.user_id}`,
  },
];

export const getDisciplinaryIssueCount = ({
  disciplinary_issues,
  type,
}: {
  disciplinary_issues: Array<DisciplinaryIssue>,
  type: IssueType,
}) => {
  return disciplinary_issues?.find((issue) => issue.type === type)?.count || 0;
};

type Action = OnSetPanelState | OnSetDisciplineProfile;

export const onActionClick = ({
  row,
  mode,
  dispatch,
  openPanel = false,
}: {
  row: AthleteDisciplineRow | UserDisciplineRow,
  mode: DisciplinaryIssueMode,
  dispatch: DisciplineDispatch<Action>,
  openPanel: boolean,
}) => {
  dispatch(onTogglePanel({ isOpen: openPanel, mode }));
  if (mode === DELETE_DISCIPLINARY_ISSUE) {
    dispatch(onToggleModal({ isOpen: true }));
  }
  const user = {
    id: row.id,
    name: row.athlete[0].text,
    organisations: row.organisations,
  };

  const activeDiscipline = row.active_discipline;
  // Set the user to be disciplined, required for the panel
  // to display the correct user information
  dispatch(
    onSetUserToBeDisciplined({
      userToBeDisciplined: {
        ...user,
        squads: row.squads,
        organisations: row.organisations,
      },
    })
  );
  // set user_id in the disciplinary issue details, required for all cases. For
  // example, when creating a new issue, editing and on row click
  dispatch(
    onSetDisciplinaryIssueDetails({
      user_id: row.id,
    })
  );
  // if the active discipline is set, we need to set the disciplinary issue details for editing
  if (
    activeDiscipline &&
    Array.isArray(activeDiscipline?.reasons) &&
    typeof activeDiscipline?.start_date === 'string' &&
    typeof activeDiscipline?.end_date === 'string' &&
    Array.isArray(activeDiscipline?.additional_notes)
  ) {
    dispatch(
      onSetDisciplinaryIssueDetails({
        reason_ids: activeDiscipline.reasons.map((reason) => reason.id),
        start_date: activeDiscipline.start_date,
        end_date: activeDiscipline.end_date,
        kind: activeDiscipline.kind,
        squad_id: activeDiscipline?.squad?.id,
        number_of_games: activeDiscipline.number_of_games,
        note: activeDiscipline.additional_notes
          .map((note) => note.content)
          .join('\n'),
        competition_ids: activeDiscipline.competitions.map(
          (competition) => competition.id
        ),
      })
    );
    dispatch(
      onSetActiveDisciplineIssue({
        active_discipline: row.active_discipline,
      })
    );
  }

  dispatch(
    onSetDisciplineProfile({
      profile: user,
    })
  );
};

export const onBuildActions = ({
  row,
  dispatch,
  permissions,
}: {
  row: UserDisciplineRow,
  dispatch: DisciplineDispatch<Action>,
  permissions: DisciplinePermissions,
}): Array<GridActionsCellItem> => {
  const isSuspended = row.discipline_status === 'Suspended';
  const items = [
    {
      isVisible: permissions.canManageDiscipline,
      element: (
        <GridActionsCellItem
          label="Suspend"
          disabled={isSuspended}
          showInMenu
          onClick={() =>
            onActionClick({
              row,
              mode: CREATE_DISCIPLINARY_ISSUE,
              dispatch,
              openPanel: true,
            })
          }
        />
      ),
    },

    {
      isVisible: permissions.canManageDiscipline && isSuspended,
      element: (
        <GridActionsCellItem
          label="Edit"
          showInMenu
          onClick={() =>
            onActionClick({
              row,
              mode: UPDATE_DISCIPLINARY_ISSUE,
              dispatch,
              openPanel: true,
            })
          }
        />
      ),
    },

    {
      isVisible: permissions.canManageDiscipline && isSuspended,
      element: (
        <GridActionsCellItem
          label="Delete"
          showInMenu
          onClick={() =>
            onActionClick({
              row,
              mode: DELETE_DISCIPLINARY_ISSUE,
              dispatch,
              openPanel: false,
            })
          }
        />
      ),
    },
  ];
  return items.filter((i) => i.isVisible).map((i) => i.element);
};

export const renderFilters = ({
  onUpdate,
  filters,
  requestStatus,
}: {
  onUpdate: Function,
  filters: DisciplineSearchParams,
  requestStatus: RequestStatus,
}) => {
  return (
    <GridSearch
      value={filters.search_expression}
      onUpdate={(value) =>
        onUpdate({
          search_expression: value,
          page: 1,
        })
      }
      requestStatus={requestStatus}
    />
  );
};

export const renderSharedSlots = (
  dispatch: DisciplineDispatch<Action>,
  permissions: DisciplinePermissions,
  isLeague: boolean,
  initialFilters: DisciplineSearchParams
) => {
  const renderDisciplineFilters = ({
    onUpdate,
    requestStatus,
  }: {
    onUpdate: (args: {
      [key: string]: string | Array<string> | null | Object,
      page: number,
    }) => void,
    requestStatus: RequestStatus,
  }) => {
    return (
      <>
        {isLeague && (
          <FilterSelector
            type="club"
            initialFilters={initialFilters}
            onUpdate={(value) =>
              onUpdate({
                filter_organisation_ids: value,
                page: 1,
              })
            }
            requestStatus={requestStatus}
          />
        )}
        <FilterSelector
          type="date_range"
          initialFilters={initialFilters}
          onUpdate={(value) => {
            onUpdate({
              date_range: {
                start_date: value?.start_date,
                end_date: value?.end_date,
              },
              page: 1,
            });
          }}
          requestStatus={requestStatus}
        />
        <FilterSelector
          type="competition"
          initialFilters={initialFilters}
          onUpdate={(value) =>
            onUpdate({
              competition_ids: value,
              page: 1,
            })
          }
          requestStatus={requestStatus}
        />
        {/* TODO: BE work is required for this to correctly display the team filter, Task will be created to handle this */}
        {/* {isLeague && ( */}
        {/*  <FilterSelector */}
        {/*    type="team" */}
        {/*    initialFilters={initialFilters} */}
        {/*    onUpdate={(value) => */}
        {/*      onUpdate({ */}
        {/*        squad_ids: value, */}
        {/*        page: 1, */}
        {/*      }) */}
        {/*    } */}
        {/*    requestStatus={requestStatus} */}
        {/*  /> */}
        {/* )} */}
        <FilterSelector
          type="red_cards"
          initialFilters={initialFilters}
          onUpdate={(value) =>
            onUpdate({
              red_cards: value,
              page: 1,
            })
          }
          requestStatus={requestStatus}
        />
        <FilterSelector
          type="yellow_cards"
          initialFilters={initialFilters}
          onUpdate={(value) =>
            onUpdate({
              yellow_cards: value,
              page: 1,
            })
          }
          requestStatus={requestStatus}
        />
        <FilterSelector
          type="status"
          initialFilters={initialFilters}
          onUpdate={(value) =>
            onUpdate({
              filter_discipline_status: value,
              page: 1,
            })
          }
          requestStatus={requestStatus}
        />
      </>
    );
  };

  return {
    filters: ({
      onUpdate,
      filters,
      requestStatus,
    }: {
      onUpdate: Function,
      filters: DisciplineSearchParams,
      requestStatus: RequestStatus,
    }) => (
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
          flex: 1,
        }}
      >
        <GridSearch
          value={filters.search_expression}
          onUpdate={(value) =>
            onUpdate({
              search_expression: value,
              page: 1,
            })
          }
          requestStatus={requestStatus}
          sx={{
            width: 220,
          }}
        />
        {window.getFlag('league-ops-discipline-area-v2') &&
          renderDisciplineFilters({
            onUpdate,
            requestStatus,
          })}
      </div>
    ),
    onGetActions: (params: GridRowParams) =>
      onBuildActions({ row: params.row, dispatch, permissions }),
  };
};
