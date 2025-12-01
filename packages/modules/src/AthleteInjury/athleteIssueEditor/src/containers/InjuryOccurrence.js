import { connect } from 'react-redux';
import { InjuryOccurrenceTranslated as InjuryOccurrence } from '../components/InjuryOccurrence';
import {
  getGameAndTrainingOptions,
  updateOccurrenceDate,
  updateActivity,
  updateTrainingSession,
  updateGame,
  updateGameTime,
  updatePositionGroup,
  updateSessionCompleted,
  updatePeriod,
} from '../actions';

const mapStateToProps = (state) => ({
  activityGroupOptions: state.ModalData.activityGroupOptions,
  gameOptions: state.ModalData.gameOptions,
  periodOptions: state.ModalData.periodOptions,
  periodTerm: state.ModalData.periodTerm,
  trainingSessionOptions: state.ModalData.trainingSessionOptions,
  positionGroupOptions: state.ModalData.positionGroupOptions,
  isFetchingGameAndTrainingOptions:
    state.ModalData.isFetchingGameAndTrainingOptions,
  formMode: state.ModalData.formMode,
  formType: state.ModalData.formType || 'INJURY',

  activity_id: state.IssueData.activity_id,
  occurrenceDate: state.IssueData.occurrence_date,
  game: state.ModalData.gameOptions.length > 0 ? state.IssueData.game_id : null,
  gameTime: state.IssueData.occurrence_min,
  trainingSession:
    state.ModalData.trainingSessionOptions.length > 0
      ? state.IssueData.training_session_id
      : null,
  activityType: state.IssueData.activity_type,
  positionGroupId: state.IssueData.position_when_injured_id,
  isSessionCompleted: state.IssueData.session_completed,
  periodId: state.IssueData.association_period_id,
  priorResolvedDate: state.IssueData.prior_resolved_date,
  // The form should be disabled if the user
  // is editing an old injury recurrence.
  // The user should be able to edit the last injury recurrence
  // or a none recurrent injury.
  isDisabled:
    state.ModalData.formMode === 'EDIT' &&
    state.IssueData.has_recurrence &&
    !state.IssueData.is_last_occurrence,
});

const mapDispatchToProps = (dispatch) => ({
  getGameAndTrainingOptions: (occurrenceDate) => {
    dispatch(getGameAndTrainingOptions(occurrenceDate));
  },
  updateOccurrenceDate: (occurrenceDate) => {
    dispatch(updateOccurrenceDate(occurrenceDate));
  },
  updateActivity: (activityId, activityType) => {
    dispatch(updateActivity(activityId, activityType));
  },
  updateTrainingSession: (trainingSessionId) => {
    dispatch(updateTrainingSession(trainingSessionId));
  },
  updateGame: (gameId, gameDate) => {
    dispatch(updateGame(gameId, gameDate));
  },
  updateGameTime: (gameTime) => {
    dispatch(updateGameTime(gameTime));
  },
  updatePositionGroup: (positionGroupId) => {
    dispatch(updatePositionGroup(positionGroupId));
  },
  updateSessionCompleted: (isSessionCompleted) => {
    dispatch(updateSessionCompleted(isSessionCompleted));
  },
  updatePeriod: (periodId) => {
    dispatch(updatePeriod(periodId));
  },
});

const App = connect(mapStateToProps, mapDispatchToProps)(InjuryOccurrence);

export default App;
