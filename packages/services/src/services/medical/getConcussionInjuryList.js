// @flow
import $ from 'jquery';
import type { ConcussionFilters } from '@kitman/modules/src/Medical/shared/types/medical';
import type { ConcussionIssue } from '@kitman/modules/src/Medical/shared/types';

const getConcussionInjuryList = (
  filter: ConcussionFilters
): Promise<Array<ConcussionIssue>> => {
  const athleteId = filter.athleteId || '';
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: `/ui/concussion/injuries?athlete_id=${athleteId}`,
    })
      .done(resolve)
      .fail(reject);
  });
};

export default getConcussionInjuryList;
