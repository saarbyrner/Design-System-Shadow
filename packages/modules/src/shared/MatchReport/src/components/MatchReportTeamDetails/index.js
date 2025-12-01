// @flow
import { useState, useEffect, useMemo } from 'react';
import type { ComponentType } from 'react';
import uuid from 'uuid';
import { withNamespaces } from 'react-i18next';
import { useFlexLayout } from 'react-table';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { TextButton } from '@kitman/components';
import type { EventAthlete } from '@kitman/common/src/types/Event';
import useLeagueOperations from '@kitman/common/src/hooks/useLeagueOperations';
import { formatTwoDigitYear } from '@kitman/common/src/utils/dateFormatter';
import DataTable from '@kitman/modules/src/Medical/shared/components/DataTable';
import { getPlayerNumber } from '@kitman/modules/src/PlanningEvent/src/helpers/utils';
import {
  handleFootballSinglePlayerEvent,
  getRedCard,
} from '@kitman/common/src/utils/planningEvent/gameActivityUtils';
import type {
  GameScores,
  GameActivityStorage,
} from '@kitman/common/src/types/GameEvent';
import {
  eventTypes,
  pitchViewFormats,
  teamTypes,
} from '@kitman/common/src/consts/gameEventConsts';
import MatchReportPitchView from '@kitman/modules/src/shared/PitchView/MatchReportPitchView';
import { setUnsavedGameActivities } from '@kitman/modules/src/PlanningEvent/src/redux/slices/gameActivitiesSlice';
import type { PitchViewInitialState } from '@kitman/common/src/types/PitchView';
import type { Squad } from '@kitman/services/src/services/getSquads';
import styles from '@kitman/modules/src/shared/MatchReport/styles';

import {
  handleMatchReportSubEvent,
  calculateTeamGoals,
} from '../../utils/matchReportUtils';
import { buildGridColumn } from './helpers';

type Props = {
  gameScores: GameScores,
  gameSquads: { squad: Squad, opponentSquad: Squad },
  setFlagDisciplinaryIssue: (boolean) => void,
  setGameScores: (GameScores) => void,
  isPitchViewEnabled: boolean,
  isReadOnlyMode: boolean,
};

export type TranslatedProps = I18nProps<Props>;

const MatchReportTeamDetails = (props: TranslatedProps) => {
  const dispatch = useDispatch();

  const { isScout } = useLeagueOperations();

  const { localGameActivities: gameActivities } =
    useSelector<GameActivityStorage>(
      (state) => state.planningEvent.gameActivities
    );

  const { teams, activeEventSelection } = useSelector<PitchViewInitialState>(
    (state) => state.planningEvent.pitchView
  );

  const [isPitchViewMode, setIsPitchViewMode] = useState(false);
  const [selectedTeamType, setSelectedTeamType] = useState<string>(
    teamTypes.home
  );

  const [initialSelectedPlayer, setInitialSelectedPlayer] =
    useState<?EventAthlete>(null);

  const isStaffSelectable =
    activeEventSelection === eventTypes.yellow ||
    activeEventSelection === eventTypes.red;

  const selectedTeam = useMemo(
    () => teams[selectedTeamType],
    [teams, selectedTeamType]
  );

  const selectedSquadOwnerId =
    selectedTeamType === teamTypes.home
      ? props.gameSquads.squad.owner_id
      : props.gameSquads.opponentSquad.owner_id;

  useEffect(() => {
    if (
      initialSelectedPlayer &&
      !selectedTeam.listPlayers.find(
        (player) => player.id === initialSelectedPlayer.id
      )
    )
      setInitialSelectedPlayer(null);
  }, []);

  useEffect(() => {
    if (initialSelectedPlayer && !activeEventSelection)
      setInitialSelectedPlayer(null);
  }, [activeEventSelection]);

  const handleAddingGoalsToScoreline = () => {
    const { teamScore } = calculateTeamGoals(
      selectedTeam.listPlayers,
      gameActivities
    );

    const { teamOwnGoalScore: opponentOwnGoalScore } = calculateTeamGoals(
      teams[
        selectedTeamType === teamTypes.home ? teamTypes.away : teamTypes.home
      ].listPlayers,
      gameActivities
    );

    if (selectedTeamType === teamTypes.home) {
      props.setGameScores({
        ...props.gameScores,
        orgScore: teamScore + opponentOwnGoalScore + 1,
      });
    } else {
      props.setGameScores({
        ...props.gameScores,
        opponentScore: teamScore + opponentOwnGoalScore + 1,
      });
    }
  };

  const onSelectTeamType = (homeOrAway) => {
    setSelectedTeamType(homeOrAway);

    if (initialSelectedPlayer) {
      setInitialSelectedPlayer(null);
    }
  };

  const handleOnPlayerEventClick = (athleteId: number) => {
    let newEvents = [];
    if (activeEventSelection === eventTypes.sub) {
      const subbedPlayer = selectedTeam.listPlayers.find(
        (player) => player.id === athleteId
      );
      if (initialSelectedPlayer && subbedPlayer) {
        if (initialSelectedPlayer.id !== subbedPlayer.id) {
          newEvents = handleMatchReportSubEvent(
            gameActivities,
            initialSelectedPlayer,
            subbedPlayer
          );
        }
        setInitialSelectedPlayer(null);
      } else {
        setInitialSelectedPlayer(subbedPlayer);
      }
    } else {
      newEvents = handleFootballSinglePlayerEvent({
        gameActivities,
        athleteId,
        eventType: activeEventSelection,
        organisationId: selectedSquadOwnerId,
      });

      if (
        activeEventSelection === eventTypes.red ||
        getRedCard(newEvents, athleteId)
      ) {
        props.setFlagDisciplinaryIssue(true);
      }

      if (activeEventSelection === eventTypes.goal) {
        handleAddingGoalsToScoreline();
      }
    }

    if (newEvents.length > 0)
      dispatch(setUnsavedGameActivities([...gameActivities, ...newEvents]));
  };

  const handleOnStaffEventClick = (staffId: number) => {
    let newEvents = [];
    newEvents = handleFootballSinglePlayerEvent({
      gameActivities,
      athleteId: staffId,
      eventType: activeEventSelection,
      organisationId: selectedSquadOwnerId,
      userType: 'staff',
    });

    if (
      activeEventSelection === eventTypes.red ||
      getRedCard(newEvents, staffId)
    ) {
      props.setFlagDisciplinaryIssue(true);
    }

    dispatch(setUnsavedGameActivities([...gameActivities, ...newEvents]));
  };

  const columns = {
    player: buildGridColumn({
      valueName: props.t('Player'),
      accessor: 'player',
      width: 170,
    }),
    jersey: buildGridColumn({
      valueName: props.t('Jersey'),
      accessor: 'jersey',
      width: 70,
    }),
    position: buildGridColumn({
      valueName: props.t('Position'),
      accessor: 'position',
      width: 70,
    }),
    dob: buildGridColumn({
      valueName: props.t('DOB'),
      accessor: 'birthYear',
      width: 70,
    }),
    gradYear: buildGridColumn({
      valueName: props.t('Grad year'),
      accessor: 'gradYear',
      width: 70,
    }),
    squad: buildGridColumn({
      valueName: props.t('Age group'),
      accessor: 'squad',
      width: 90,
    }),
    staff: buildGridColumn({
      valueName: props.t('Staff'),
      accessor: 'staff',
      width: 250,
    }),
    role: buildGridColumn({
      valueName: props.t('Role'),
      accessor: 'role',
      width: 250,
    }),
    designation: buildGridColumn({
      valueName: props.t('Designation'),
      accessor: 'designation',
      width: 80,
    }),
  };

  const getAthleteGridColumns = () => {
    if (isScout) {
      return [
        columns.player,
        columns.jersey,
        columns.position,
        columns.dob,
        columns.gradYear,
        columns.squad,
      ];
    }

    return [
      columns.player,
      columns.jersey,
      columns.position,
      columns.dob,
      columns.designation,
    ];
  };

  const getStaffGridColumns = () => [columns.staff, columns.role];

  const buildTeamAthleteDataRows = () => {
    return selectedTeam.listPlayers.map((data) => ({
      player: (
        <button
          type="button"
          key={uuid()}
          className={`player-avatar-wrapper${
            activeEventSelection ? ' athlete' : ''
          }`}
          data-testid="AllergyCardList|Avatar"
          onClick={() =>
            activeEventSelection && handleOnPlayerEventClick(data.id)
          }
          css={styles.button}
        >
          <img src={data.avatar_url} alt="player-avatar" />
          <span
            className={
              initialSelectedPlayer?.id === data.id ? 'selected_player' : ''
            }
          >
            {data.fullname}{' '}
            {initialSelectedPlayer?.id === data.id ? '(Sub-out)' : ''}
          </span>
        </button>
      ),
      jersey: (
        <span className="secondary-cell-data">
          {getPlayerNumber(data.squad_number)}
        </span>
      ),
      position: (
        <span className="secondary-cell-data">
          {data.position?.abbreviation}
        </span>
      ),
      birthYear: (
        <span className="secondary-cell-data">
          {data.date_of_birth && formatTwoDigitYear(moment(data.date_of_birth))}
        </span>
      ),
      designation: (
        <span className="secondary-cell-data">{data.designation}</span>
      ),
      gradYear: (
        <span className="secondary-cell-data">{data.graduation_date}</span>
      ),
      squad: <span className="secondary-cell-data">{data.squad_name}</span>,
    }));
  };

  const buildTeamStaffDataRows = () =>
    selectedTeam.staff.map((data) => ({
      staff: (
        <button
          type="button"
          key={uuid()}
          className={`player-avatar-wrapper${
            isStaffSelectable ? ' staff' : ''
          }`}
          onClick={() =>
            isStaffSelectable && handleOnStaffEventClick(data?.user?.id)
          }
          data-testid="AllergyCardList|Avatar"
          css={styles.button}
        >
          <img
            src={
              data.user?.avatar_url ||
              'https://kitman-staging.imgix.net/avatar.jpg?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&w=100'
            }
            alt="player-avatar"
          />
          <span>{data.user?.fullname}</span>
        </button>
      ),
      role: <span className="secondary-cell-data">{data.user?.role}</span>,
    }));

  return (
    <div className="team-list-area">
      <div css={styles.row}>
        {props.isPitchViewEnabled && (
          <div css={styles.buttonContainer}>
            <TextButton
              onClick={() => setIsPitchViewMode(false)}
              text={props.t('List view')}
              type={!isPitchViewMode ? 'primary' : 'secondary'}
              kitmanDesignSystem
            />
            <TextButton
              onClick={() => setIsPitchViewMode(true)}
              text={props.t('Pitch view')}
              type={isPitchViewMode ? 'primary' : 'secondary'}
              kitmanDesignSystem
            />
          </div>
        )}
        <div css={styles.buttonContainer}>
          <TextButton
            onClick={() => onSelectTeamType(teamTypes.home)}
            text={props.t('Home Team')}
            type={selectedTeamType === teamTypes.home ? 'primary' : 'secondary'}
            kitmanDesignSystem
          />
          <TextButton
            onClick={() => onSelectTeamType(teamTypes.away)}
            text={props.t('Away Team')}
            type={selectedTeamType === teamTypes.away ? 'primary' : 'secondary'}
            kitmanDesignSystem
          />
        </div>
      </div>
      {props.isPitchViewEnabled && isPitchViewMode ? (
        <MatchReportPitchView
          selectedTeamType={selectedTeamType}
          selectedSquadOrganisationId={selectedSquadOwnerId}
          pitchFormat={pitchViewFormats.matchReport}
          handleUpdateScoreline={handleAddingGoalsToScoreline}
        />
      ) : (
        <div css={styles.teamGrid}>
          <DataTable
            columns={getAthleteGridColumns()}
            data={buildTeamAthleteDataRows()}
            useLayout={useFlexLayout}
          />
          <DataTable
            columns={getStaffGridColumns()}
            data={buildTeamStaffDataRows()}
            useLayout={useFlexLayout}
          />
        </div>
      )}
    </div>
  );
};

export const MatchReportTeamDetailsTranslated: ComponentType<Props> =
  withNamespaces()(MatchReportTeamDetails);
export default MatchReportTeamDetails;
