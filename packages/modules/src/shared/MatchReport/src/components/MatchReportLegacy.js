// @flow
import { useRef } from 'react';
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import moment from 'moment-timezone';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useSelector } from 'react-redux';
import type { PitchViewInitialState } from '@kitman/common/src/types/PitchView';
import useLeagueOperations from '@kitman/common/src/hooks/useLeagueOperations';
import { matchReportEventListGameView } from '@kitman/common/src/consts/gameEventConsts';
import { Checkbox, RichTextEditor, TextButton } from '@kitman/components';
import type { Game } from '@kitman/common/src/types/Event';
import type {
  GameScores,
  MatchReportNoteStorage,
  MatchReportPenaltyListStorage,
  TeamsPenalties,
} from '@kitman/common/src/types/GameEvent';
import EventListMatchReportContainer from '@kitman/modules/src/PlanningEvent/src/components/EventList/Containers/EventListMatchReportContainer';
import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';

import styles from '../../styles';
import { MatchReportHeaderTranslated as MatchReportHeader } from './MatchReportHeader';
import { MatchReportTeamDetailsTranslated as MatchReportTeamDetails } from './MatchReportTeamDetails';
import { MatchReportPenaltyShootoutListTranslated as MatchReportPenaltyShootoutList } from './MatchReportPenaltyShootoutList';
import {
  formatMatchReportDate,
  getHomeAndAwayTeamAthletesWithTeamName,
  getMatchReportEventName,
  getStaffMembersWithTeamName,
  getPlayersEligibleForPenalties,
} from '../utils/matchReportUtils';

type Props = {
  event: Object,
  selectedEventListGameView: string,
  setSelectedEventListGameView: (string) => void,
  gameScores: GameScores,
  setGameScores: (GameScores) => void,
  penaltyShootoutActivities: MatchReportPenaltyListStorage,
  gameNotes: MatchReportNoteStorage,
  updateGameNotes: (string, string) => void,
  updatePenaltyLists: (TeamsPenalties, TeamsPenalties) => void,
  readOnlyMode: boolean,
  setReadOnlyMode: (boolean) => void,
  flagDisciplinaryIssue: boolean,
  setFlagDisciplinaryIssue: (boolean) => void,
  setShowSaveReportModal: (boolean) => void,
  setFinalSubmitMode: (boolean) => void,
  checkIfHeaderButtonsAreDisabled: (isOfficial?: boolean) => boolean,
  revertLocalChanges: () => void,
};

const MatchReportLegacy = (props: I18nProps<Props>) => {
  const editorRef = useRef(null);
  const { preferences } = usePreferences();

  const {
    event,
    selectedEventListGameView,
    setSelectedEventListGameView,
    gameScores,
    setGameScores,
    penaltyShootoutActivities,
    gameNotes,
    updateGameNotes,
    updatePenaltyLists,
    readOnlyMode,
    setReadOnlyMode,
    flagDisciplinaryIssue,
    setFlagDisciplinaryIssue,
    setShowSaveReportModal,
    setFinalSubmitMode,
    checkIfHeaderButtonsAreDisabled,
    revertLocalChanges,
  } = props;

  const { isLeague, isOfficial, isScout, isOrgSupervised } =
    useLeagueOperations();

  const { pitchActivities: matchReportActivities } =
    useSelector<PitchViewInitialState>(
      (state) => state.planningEvent.pitchView
    );

  const renderSubmitButton = () => (
    <TextButton
      onClick={() => {
        setShowSaveReportModal(true);
        setFinalSubmitMode(true);
      }}
      text={props.t('Submit Report')}
      type="primary"
      isDisabled={checkIfHeaderButtonsAreDisabled(isOfficial)}
      kitmanDesignSystem
    />
  );

  const renderLeagueEditButtons = () => {
    if (isOrgSupervised || isScout) return null;

    if (!readOnlyMode)
      return (
        <div css={styles.headerButtons}>
          {renderSubmitButton()}
          <TextButton
            onClick={() => {
              revertLocalChanges();
              setReadOnlyMode(true);
            }}
            text={props.t('Cancel')}
            type="secondary"
            kitmanDesignSystem
          />
        </div>
      );
    return (
      <TextButton
        onClick={() => setReadOnlyMode(false)}
        text={props.t('Edit')}
        type="primary"
        kitmanDesignSystem
      />
    );
  };
  const renderOfficialsHeaderButtons = () => {
    if (isOrgSupervised || isScout) return null;

    return (
      <div css={styles.headerButtons}>
        {renderSubmitButton()}
        <TextButton
          onClick={() => setShowSaveReportModal(true)}
          text={props.t('Save')}
          type="secondary"
          isDisabled={checkIfHeaderButtonsAreDisabled()}
          kitmanDesignSystem
        />
      </div>
    );
  };
  const getEventDateTimeInfo = () => {
    const startOrgDate = moment.tz(event?.start_date, event?.local_timezone);
    return (
      <div css={styles.eventTime}>
        {formatMatchReportDate(startOrgDate)}
        {event?.local_timezone ? `, ${event.local_timezone}` : ''}
      </div>
    );
  };
  const renderAppHeader = () => (
    <header css={styles.matchReportHeader}>
      <div css={styles.eventTitleWrapper}>
        <h1 css={styles.eventTitle}>{getMatchReportEventName(event)}</h1>
        {isLeague ? renderLeagueEditButtons() : renderOfficialsHeaderButtons()}
      </div>
      {getEventDateTimeInfo()}
    </header>
  );

  const renderMatchReportRegularTimeEventList = (gameEvent: Game) => (
    <EventListMatchReportContainer
      isReadOnly={readOnlyMode}
      players={getHomeAndAwayTeamAthletesWithTeamName({
        gameEvent,
        isScout,
        t: props.t,
      })}
      staff={getStaffMembersWithTeamName({ gameEvent, isScout, t: props.t })}
      gameScores={gameScores}
      setFlagDisciplinaryIssue={setFlagDisciplinaryIssue}
      setGameScores={setGameScores}
    />
  );

  const renderMatchReportPenaltyShootoutList = (gameEvent: Game) => (
    <MatchReportPenaltyShootoutList
      isReadOnly={readOnlyMode}
      gameEvent={gameEvent}
      players={{
        homePlayers: getPlayersEligibleForPenalties(
          gameEvent?.home_athletes,
          matchReportActivities
        ),
        awayPlayers: getPlayersEligibleForPenalties(
          gameEvent?.away_athletes,
          matchReportActivities
        ),
      }}
      penaltyActivities={penaltyShootoutActivities.localPenaltyLists}
      setPenaltyActivities={(penaltyActivities) => {
        updatePenaltyLists(
          penaltyShootoutActivities.apiPenaltyLists,
          penaltyActivities
        );
      }}
    />
  );
  return (
    <>
      {renderAppHeader()}
      <div css={styles.matchReportPageContainer}>
        <MatchReportHeader
          isReadOnly={readOnlyMode}
          event={event}
          currentView={selectedEventListGameView}
          setCurrentView={setSelectedEventListGameView}
          gameScores={gameScores}
          setGameScores={setGameScores}
          penaltyActivities={penaltyShootoutActivities.localPenaltyLists}
        />
        {event && (
          <div css={styles.matchReportTeamEventWrapper}>
            <MatchReportTeamDetails
              gameScores={gameScores}
              gameSquads={{
                squad: event.squad,
                opponentSquad: event.opponent_squad,
              }}
              setFlagDisciplinaryIssue={setFlagDisciplinaryIssue}
              setGameScores={setGameScores}
              isPitchViewEnabled={preferences?.league_match_report_pitch_view}
              isReadOnlyMode={readOnlyMode}
            />
            {selectedEventListGameView === matchReportEventListGameView.regular
              ? renderMatchReportRegularTimeEventList(event)
              : renderMatchReportPenaltyShootoutList(event)}
          </div>
        )}
        {(isLeague || isOfficial) && (
          <div css={styles.textAreaContainer}>
            <h4>{props.t('Game notes')}</h4>
            <div className="rich-text-display">
              <RichTextEditor
                label={props.t(`Notes about the game`)}
                onChange={(changedNotes) =>
                  updateGameNotes(gameNotes.apiNotes, changedNotes)
                }
                value={gameNotes.localNotes}
                isDisabled={readOnlyMode}
                forwardedRef={editorRef}
                kitmanDesignSystem
              />
            </div>
            <Checkbox
              data-testid="MatchReport|FlagIssue"
              id="flag-disciplinary-issue"
              name="flag-disciplinary-issue"
              isChecked={flagDisciplinaryIssue}
              toggle={() => setFlagDisciplinaryIssue(!flagDisciplinaryIssue)}
              label={props.t('Flag as a game with a disciplinary issue')}
              isLabelPositionedOnTheLeft
              isDisabled={readOnlyMode}
              kitmanDesignSystem
            />
          </div>
        )}
      </div>
    </>
  );
};

export const MatchReportLegacyTranslated: ComponentType<Props> =
  withNamespaces()(MatchReportLegacy);
export default MatchReportLegacy;
