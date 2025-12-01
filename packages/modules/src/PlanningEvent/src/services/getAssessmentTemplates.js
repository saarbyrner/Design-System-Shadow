// @flow
import $ from 'jquery';
import type { AssessmentTemplate } from '../../types';

const getAssessmentsTemplates = (): Promise<Array<AssessmentTemplate>> => {
  return new Promise((resolve, reject) => {
    $.get('/assessment_templates')
      .done(({ assessment_templates: assessmentTemplates }) => {
        resolve(assessmentTemplates);
      })
      .fail(() => {
        reject();
      });
  });
};

export default getAssessmentsTemplates;
