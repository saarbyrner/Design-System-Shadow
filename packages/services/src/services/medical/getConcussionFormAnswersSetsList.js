// @flow
import $ from 'jquery';
import type {
  FormAnswersSetsFilter,
  FormAnswerSet,
  BaselinesRoster,
} from '@kitman/modules/src/Medical/shared/types/medical';

const getConcussionFormAnswersSetsList = (
  filter: FormAnswersSetsFilter
): Promise<Array<FormAnswerSet> | BaselinesRoster> => {
  let url = '/ui/concussion/form_answers_sets?';
  let firstParamAdded = false;
  if (filter.athleteId) {
    url += `${firstParamAdded ? '&' : ''}athlete_id=${filter.athleteId}`;
    firstParamAdded = true;
  }
  if (filter.category) {
    url += `${firstParamAdded ? '&' : ''}category=${filter.category}`;
    firstParamAdded = true;
  }
  if (filter.group) {
    url += `${firstParamAdded ? '&' : ''}group=${filter.group}`;
    firstParamAdded = true;
  }

  if (filter.illnessOccurenceId != null) {
    url += `${firstParamAdded ? '&' : ''}illness_occurrence_id=${
      filter.illnessOccurenceId
    }`;
    firstParamAdded = true;
  }

  if (filter.injuryOccurenceId != null) {
    url += `${firstParamAdded ? '&' : ''}injury_occurrence_id=${
      filter.injuryOccurenceId
    }`;
    firstParamAdded = true;
  }

  if (filter.chronicIssueId) {
    url += `${firstParamAdded ? '&' : ''}chronic_issue_id=${
      filter.chronicIssueId
    }`;
  }

  if (filter.formType) {
    url += `${firstParamAdded ? '&' : ''}form_type=${filter.formType}`;
  }

  if (filter.page) {
    url += `${firstParamAdded ? '&' : ''}page=${filter.page}`;
    firstParamAdded = true;
  }

  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url,
    })
      .done(resolve)
      .fail(reject);
  });
};

export default getConcussionFormAnswersSetsList;
