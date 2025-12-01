import { axios } from '@kitman/common/src/utils/services';
import { data } from '@kitman/services/src/mocks/handlers/AssessmentGroups/getAssessmentGroups';

import getAssessmentGroups, {
  GENERIC_GET_ASSESSMENT_GROUPS_ENDPOINT,
} from '../getAssessmentGroups';

describe('getAssessmentGroups', () => {
  it('calls the correct endpoint using the correct HTTP method and returns expected data', async () => {
    const filters = { athlete_ids: [12354] };
    const getAssessmentGroupsRequest = jest.spyOn(axios, 'post');
    const returnedData = await getAssessmentGroups(filters);

    expect(returnedData).toEqual(data);
    expect(getAssessmentGroupsRequest).toHaveBeenCalledTimes(1);
    expect(getAssessmentGroupsRequest).toHaveBeenCalledWith(
      GENERIC_GET_ASSESSMENT_GROUPS_ENDPOINT,
      filters
    );
  });
});
