import initQuestionnaireForm from './questionnaire_form';
import initQuestionnaireAuthorizarion from './questionnaire_authorization';
import initQuestionnaireCompleted from './questionnaire_completed';
import initQuestionnaireSelectAthlete from './questionnaire_select_athlete';

export default () => {
  initQuestionnaireForm();
  initQuestionnaireAuthorizarion();
  initQuestionnaireCompleted();
  initQuestionnaireSelectAthlete();
};
