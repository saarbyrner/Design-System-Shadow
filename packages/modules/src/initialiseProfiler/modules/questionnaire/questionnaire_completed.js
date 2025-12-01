// /app/views/questionnaires/completed.html.erb
export default () => {
  $(document).ready(() => {
    const questionnaireRootElement = document.getElementById(
      'athlete_questionnaire_completed'
    );
    if (questionnaireRootElement) {
      const newAuthPath = questionnaireRootElement.dataset.newAuthPath;
      const delay = 3000;
      window.setInterval(() => {
        window.location.href = newAuthPath;
      }, delay);
    }
  });
};
