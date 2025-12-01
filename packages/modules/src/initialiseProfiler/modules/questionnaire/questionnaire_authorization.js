// /app/views/select_athletes/_questionnaire_authorization.js.erb
export default () => {
  $(document).ready(() => {
    $('#km-modal').on('show.bs.modal', () => {
      const authorizationQuestionnaireRootElement = document.getElementById(
        'authorization_questionnaire_form'
      );
      if (authorizationQuestionnaireRootElement) {
        const newQuestionnairePath =
          authorizationQuestionnaireRootElement.dataset.newQuestionnairePath;
        $('#authorization_questionnaire_form')
          .on('ajax:before', () => {
            $('input[type="submit"]').attr('disabled', 'yes');
          })
          .on('ajax:success', (xhr, data) => {
            if (data.success === true) {
              location.replace(newQuestionnairePath); // eslint-disable-line no-restricted-globals
            } else {
              $('#authorization_questionnaire_form')[0].reset();
              $('.error-message').show();
              $('#authorization_questionnaire_form')
                .find('.control-group')
                .addClass('has-error');
              $('input[type="submit"]').removeAttr('disabled');
            }
          });
      }
    });
  });
};
