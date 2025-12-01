/* eslint-disable camelcase */
// @flow
import moment from 'moment';
import {
  type OnSetPanelState,
  type OnSetDisciplineProfile,
  onTogglePanel,
  onToggleModal,
  onSetDisciplinaryIssueDetails,
  onSetActiveDisciplineIssue,
  onSetUserToBeDisciplined,
  onSetDisciplineProfile,
} from '@kitman/modules/src/LeagueOperations/shared/redux/slices/disciplinaryIssueSlice';
import {
  FALLBACK_DASH,
  UPDATE_DISCIPLINARY_ISSUE,
  DELETE_DISCIPLINARY_ISSUE,
  USER_ENDPOINT_MONTH_DAY_FORMAT,
  USER_ENDPOINT_MONTH_DAY_YEAR_FORMAT,
} from '@kitman/modules/src/LeagueOperations/shared/consts';
import type {
  DisciplinaryIssueMode,
  DisciplineDispatch,
} from '@kitman/modules/src/LeagueOperations/shared/types/discipline';
import type { Competitions } from '@kitman/services/src/services/getCompetitions';
import type { NextGameDisciplineIssue } from '@kitman/modules/src/LeagueOperations/shared/services/fetchNextGameDisciplineIssue';
import type { User } from '@kitman/modules/src/LeagueOperations/shared/types/common';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import { Box } from '@kitman/playbook/components';

type Action = OnSetPanelState | OnSetDisciplineProfile;
type OnSetDisciplineIssueDataProps = {
  openPanel: boolean,
  dispatch: DisciplineDispatch<Action>,
  mode: DisciplinaryIssueMode,
  issue: {
    row: {
      id: number,
      kind: string,
      start_date: string | null,
      end_date: string | null,
      reasons: ?Array<{
        id: number,
        reason_name: string,
      }>,
      additional_notes: ?Array<{
        id: number,
        content: string,
      }>,
      competitions: Array<{ id: number, name: string }> | [],
      game_events: Array<any> | [],
      number_of_games: number | null,
      squad: any | null,
    },
  },
  profile: User,
};

type RowDataType = {
  id: number,
  kind: string,
  start_date: string | null,
  end_date: string | null,
  reasons: Array<{ id: number, reason_name: string }>,
  additional_notes: Array<{ id: number, content: string }>,
  competitions: Array<{ id: number | string, name: string, color?: string }>,
  number_of_games: number | null,
  game_events: Array<NextGameDisciplineIssue> | [],
};

// TODO: this re-used functionality, and maybe refactored later
// See "onActionClick" in "LeagueOperations/DisciplineApp/src/components/DisciplineTabs/utils/index.js"
export const setDisciplinaryIssueData = ({
  issue,
  openPanel,
  dispatch,
  profile,
  mode,
}: OnSetDisciplineIssueDataProps) => {
  dispatch(onTogglePanel({ isOpen: openPanel, mode }));
  if (mode === DELETE_DISCIPLINARY_ISSUE) {
    dispatch(onToggleModal({ isOpen: true }));
  }

  const { row } = issue;
  const user = {
    id: profile.id,
    name: `${profile.firstname} ${profile.lastname}`,
    squads: profile.squads,
    organisations: profile.organisations,
  };
  // Set the user to be disciplined, required for the panel
  // to display the correct user information
  dispatch(
    onSetUserToBeDisciplined({
      userToBeDisciplined: user,
    })
  );

  dispatch(
    onSetDisciplinaryIssueDetails({
      user_id: profile.id,
    })
  );

  // set selected discipline issue, set the disciplinary issue details for editing
  dispatch(
    onSetDisciplinaryIssueDetails({
      reason_ids: row.reasons?.map((reason) => reason.id),
      start_date: row.start_date,
      end_date: row.end_date,
      kind: row.kind,
      squad_id: row?.squad?.id,
      number_of_games: row.number_of_games,
      note: row.additional_notes?.map((note) => note.content).join('\n'),
      competition_ids: row.competitions.map((competition) => competition.id),
    })
  );
  dispatch(
    onSetActiveDisciplineIssue({
      active_discipline: {
        id: row.id,
        start_date: row.start_date,
        end_date: row.end_date,
        reasons: row.reasons,
        squad: row.squad,
        additional_notes: row.additional_notes,
        competitions: row.competitions,
        kind: row.kind,
        number_of_games: row.number_of_games,
      },
    })
  );

  dispatch(
    onSetDisciplineProfile({
      profile: user,
    })
  );
};

// Transform raw suspension data into a more usable format for the grid
export const transformSuspensionRows = (
  rawRowData: any,
  disciplineCompetitions: Array<Competitions> = []
) => {
  return rawRowData.map((row) => {
    let suspendedInfo;
    const {
      id,
      kind,
      start_date,
      end_date,
      reasons,
      additional_notes,
      competitions,
      number_of_games,
      game_events,
    }: RowDataType = row;

    // Get the duration information for the suspension
    const getDurationInfo = () => {
      if (start_date && end_date && kind === 'date_range') {
        suspendedInfo = `${moment(start_date).format(
          // return as "MMM D - MMM D, YYYY" format
          USER_ENDPOINT_MONTH_DAY_FORMAT
        )} - ${moment(end_date).format(USER_ENDPOINT_MONTH_DAY_YEAR_FORMAT)}`;
      } else if (number_of_games && kind === 'number_of_games') {
        const gameText = number_of_games > 1 ? 'games' : 'game';
        suspendedInfo = `${number_of_games} ${gameText}`;
      } else {
        suspendedInfo = FALLBACK_DASH;
      }
      return suspendedInfo;
    };
    /**
     * display selected row competitions.
     * But BE sets competitions as empty array when all competitions are selected,
     * so we need to handle that case here, to ensure all competitions are displayed,
     */
    const rowCompetition =
      (competitions.length > 0 && competitions) || disciplineCompetitions;

    return {
      id,
      duration: getDurationInfo(),
      reason: reasons.map((item) => item.reason_name).join(', '),
      competition: rowCompetition,
      notes: additional_notes[0]?.content || FALLBACK_DASH,
      kind,
      game_events,
      row,
    };
  });
};

// Build action buttons for each row, and handle icon actions
export const onBuildActions = ({
  row,
  openPanel,
  dispatch,
  profile,
}: {
  row: any,
  openPanel: boolean,
  dispatch: any,
  profile: User,
}) => {
  const actions = [
    {
      icon: KITMAN_ICON_NAMES.EditOutlined,
      onClick: () =>
        setDisciplinaryIssueData({
          issue: row,
          openPanel,
          dispatch,
          profile,
          mode: UPDATE_DISCIPLINARY_ISSUE,
        }),
    },
    {
      icon: KITMAN_ICON_NAMES.DeleteOutline,
      onClick: () =>
        setDisciplinaryIssueData({
          issue: row,
          openPanel,
          dispatch,
          profile,
          mode: DELETE_DISCIPLINARY_ISSUE,
        }),
    },
  ];

  return [
    <Box display="flex" alignItems="center" gap={1} key="actions">
      {actions.map((action, idx) => (
        <KitmanIcon
          key={action.icon}
          name={action.icon}
          sx={{
            cursor: 'pointer',
            mr: idx === actions.length - 1 ? 2 : 1,
          }}
          fontSize="small"
          onClick={action.onClick}
        />
      ))}
    </Box>,
  ];
};
