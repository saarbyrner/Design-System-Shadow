import $ from 'jquery';
import { renderHook } from '@testing-library/react-hooks';

import { concussionIncidentFormsData } from '@kitman/services/src/mocks/handlers/medical/getConcussionFormAnswersSetsList';
import formattedConcussionFormResults from '@kitman/services/src/mocks/handlers/medical/getFormResults/formattedConcussionFormResults.mock';

import useConcussionFormAnswersSetsList from '../useConcussionFormAnswersSetsList';

describe('useFormsData', () => {
  let ajaxSpy;

  beforeEach(() => {
    ajaxSpy = jest
      .spyOn($, 'ajax')
      .mockImplementation(() =>
        $.Deferred().resolveWith(null, [concussionIncidentFormsData])
      );
  });

  afterEach(() => {
    ajaxSpy.mockRestore();
  });

  it('returns the expected data when fetching concussion form results', async () => {
    const filter = { athleteId: '2942' };
    const { result } = renderHook(() =>
      useConcussionFormAnswersSetsList(filter)
    );

    result.current.fetchConcussionFormAnswersSetsList(filter);
    await Promise.resolve();

    expect(result.current.concussionSummaryList).toEqual(
      formattedConcussionFormResults
    );
  });
});
