import 'bootstrap-select';
import notify from './utilities/notifications';

export default () => {
  const generateOptions = (options) => {
    let updatedSelectOptions = '';

    options.forEach((optionData) => {
      const selectOption = `<option value="${optionData.value}" data-game-date="${optionData.game_date}">${optionData.name}</option>`;
      updatedSelectOptions = updatedSelectOptions.concat(selectOption);
    });

    return updatedSelectOptions;
  };

  const refreshSelectPicker = (pickerEl) => {
    pickerEl.selectpicker('refresh');
    pickerEl.selectpicker('val', '');
  };

  // return training sessions and injuries based on date
  $(document).ready(() => {
    $(document).on('change', '.js-occurencePicker', (e) => {
      const athleteId = $(e.target).parents('.km-form-control')[0].dataset
        .athleteid;

      // show loader and disabled calendar picker
      $('.js-gameAndTrainingLoader').show();
      $('#inputDate').attr('disabled', true);
      $.ajax({
        type: 'GET',
        url: `/athletes/${athleteId}/injuries/game_and_training_options`,
        data: { date: e.target.value },
        success: (data) => {
          const gameOptions = generateOptions(data.games);
          const trainingSessionOptions = generateOptions(
            data.training_sessions
          );

          // update select with new options
          $('#inputGame').html(gameOptions);
          $('#inputTrainingSession').html(trainingSessionOptions);

          // reset and update select picker so the new options are visible
          refreshSelectPicker($('#inputTrainingSession'));
          refreshSelectPicker($('#inputGame'));

          // hide loader and enable calendar picker
          $('.js-gameAndTrainingLoader').hide();
          $('#inputDate').attr('disabled', false);
        },
        error: () => {
          notify('Something went wrong', 'warning');
        },
      });
    });

    // the occurrence date needs to match the game date.
    // to achieve this, whenever a game is selected, we update
    // the occurrence date field
    $(document).on('change', '.js-gamePicker', (e) => {
      const gameDate = $(
        `.js-gamePicker option[value='${e.target.value}']`
      ).data('game-date');
      if (gameDate) {
        $('.js-occurencePicker').val(gameDate);
      }
    });

    // we want to make sure the user can't save both a game_id and training_session_id
    // this is validated for in the InjuryOcurrence model, but the user should not be able get
    // into this state.  If the user changes between activity (e.g game or training session),
    // we need to clear the values
    $(document).on('change', '#inputEditOccurrence, #inputOccurrence', () => {
      // clear training session value value
      refreshSelectPicker($('#inputTrainingSession'));
      refreshSelectPicker($('#inputGame'));
      $('#injury_form_mins').val('');
    });
  });
};
