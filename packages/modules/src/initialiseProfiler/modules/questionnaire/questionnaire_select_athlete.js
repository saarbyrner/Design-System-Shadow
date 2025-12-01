// app/views/select_athletes/select_athlete.html.erb
export default () => {
  $(document).ready(() => {
    const selectAthleteForm = document.getElementById('select_athlete_form');
    if (selectAthleteForm) {
      const startQuestionnairePath =
        selectAthleteForm.dataset.startquestionnairepath;
      $('input[name="set_athlete"]').on('click', (e) => {
        e.preventDefault();
        const athleteId = $('select[name="athlete"]').val();
        location.href = `${startQuestionnairePath}?athlete=${athleteId}`; // eslint-disable-line no-restricted-globals
      });
    }
  });
};
