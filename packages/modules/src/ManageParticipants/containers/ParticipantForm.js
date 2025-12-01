import { useSelector, useDispatch } from 'react-redux';
import {
  updateDuration,
  updateParticipationLevel,
  updateRPE,
  toggleIncludeInGroupCalculations,
  updateAllDurations,
  updateAllParticipationLevels,
  toggleAllIncludeInGroupCalculations,
} from '../redux/actions/participantForm';
import { showCancelConfirm } from '../redux/actions/appStatus';

import { saveParticipationForm } from '../redux/actions/serverInteractions';

import { ParticipantFormTranslated as ParticipantForm } from '../components/ParticipantForm';

const ParticipantFormContainer = () => {
  const dispatch = useDispatch();

  const eventType = useSelector((state) => state.participantForm.event.type);
  const eventDuration = useSelector(
    (state) => state.participantForm.event.duration
  );

  const availableSquads = useSelector(
    (state) => state.staticData.availableSquads
  );

  const primarySquads = useSelector((state) => state.staticData.primarySquads);

  const participationLevels = useSelector(
    (state) => state.staticData.participationLevels
  );

  const participants = useSelector(
    (state) => state.participantForm.participants
  );

  return (
    <ParticipantForm
      eventType={eventType}
      showSquadTab={eventType === 'GAME'}
      availableSquads={availableSquads}
      primarySquads={primarySquads}
      participants={participants}
      participationLevels={participationLevels}
      onDurationChange={(athleteId, duration) => {
        dispatch(updateDuration(athleteId, duration));
      }}
      onParticipationLevelChange={(
        athleteId,
        participationLevel,
        isAthletePrimarySquadSelected
      ) => {
        dispatch(
          updateParticipationLevel(
            athleteId,
            participationLevel,
            eventDuration,
            isAthletePrimarySquadSelected
          )
        );
      }}
      onRpeChange={(athleteId, rpe) => {
        dispatch(updateRPE(athleteId, rpe));
      }}
      onToggleIncludeInGroupCalculations={(athleteId) => {
        dispatch(toggleIncludeInGroupCalculations(athleteId));
      }}
      onChangeAllDurations={(filteredAthletes, duration) => {
        dispatch(
          updateAllDurations(filteredAthletes, duration, participationLevels)
        );
      }}
      onChangeAllParticipationLevels={(
        filteredAthletes,
        participationLevel,
        selectedSquadId
      ) => {
        dispatch(
          updateAllParticipationLevels(
            filteredAthletes,
            participationLevel,
            eventDuration,
            selectedSquadId
          )
        );
      }}
      onToggleAllIncludeInGroupCalculations={(
        filteredAthletes,
        includeInGroupCalculations
      ) => {
        dispatch(
          toggleAllIncludeInGroupCalculations(
            filteredAthletes,
            includeInGroupCalculations,
            participationLevels
          )
        );
      }}
      onClickSave={() => {
        dispatch(saveParticipationForm());
      }}
      onClickCancel={() => {
        dispatch(showCancelConfirm());
      }}
    />
  );
};

export default ParticipantFormContainer;
