// @flow
import $ from 'jquery';

const fetchAssessmentTrainingVariables = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: `/ui/organisation_training_variables?platform_type=assessment`,
      contentType: 'application/json',
    })
      .done((response) => resolve(response))
      .fail(() => reject());
  });
};

export default fetchAssessmentTrainingVariables;
