// @flow
import $ from 'jquery';
import type { Action, ThunkAction } from '../types/actions';

export const saveParticipationFormLoading = (): Action => ({
  type: 'SAVE_PARTICIPATION_FORM_LOADING',
});

export const saveParticipationFormFailure = (): Action => ({
  type: 'SAVE_PARTICIPATION_FORM_FAILURE',
});

export const saveParticipationFormSuccess = (): Action => ({
  type: 'SAVE_PARTICIPATION_FORM_SUCCESS',
});

export const saveParticipationForm =
  (): ThunkAction =>
  (dispatch: (action: Action | ThunkAction) => Action, getState: Function) => {
    dispatch(saveParticipationFormLoading());

    const participantForm = getState().participantForm;
    const endpoint =
      participantForm.event.type === 'GAME'
        ? `/workloads/game_modal/${participantForm.event.id}/participants`
        : `/workloads/training_session_modal/${participantForm.event.id}/participants`;

    const requestData = {
      event: {
        rpe_collection_kiosk: participantForm.event.rpe_collection_kiosk,
        rpe_collection_athlete: participantForm.event.rpe_collection_athlete,
        mass_input: participantForm.event.mass_input,
      },
      participants: participantForm.participants.map((participant) => ({
        athlete_id: participant.athlete_id,
        rpe: participant.rpe,
        duration: participant.duration,
        participation_level_id: participant.participation_level_id,
        include_in_group_calculations:
          participant.include_in_group_calculations,
      })),
    };

    $.ajax({
      method: 'POST',
      url: endpoint,
      contentType: 'application/json',
      data: JSON.stringify(requestData),
    })
      .done(() => {
        dispatch(saveParticipationFormSuccess());

        const eventUrl =
          participantForm.event.type === 'GAME'
            ? `/workloads/games/${participantForm.event.id}`
            : `/workloads/training_sessions/${participantForm.event.id}`;

        window.location.href = eventUrl;
      })
      .fail(() => {
        dispatch(saveParticipationFormFailure());
      });
  };
