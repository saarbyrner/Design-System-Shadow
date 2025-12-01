import { axios } from '@kitman/common/src/utils/services';
import { data } from '@kitman/services/src/mocks/handlers/AssessmentGroups/createAssessmentGroup';

import createAssessmentGroup, {
  GENERIC_CREATE_ASSESSMENT_GROUP_ENDPOINT,
} from '../createAssessmentGroup';

describe('createAssessmentGroup', () => {
  const args = {
    assessment_group_date: '2018-09-18T14:38:58+00:00',
    assessment_template_id: 12,
    athlete_ids: [1234],
    event_id: null,
    event_type: null,
    name: 'New GROUP',
  };

  it('calls the correct endpoint using the correct HTTP method and returns expected data', async () => {
    const createAssessmentGroupRequest = jest.spyOn(axios, 'post');
    const returnedData = await createAssessmentGroup(args);

    expect(returnedData).toEqual(data);
    expect(createAssessmentGroupRequest).toHaveBeenCalledTimes(1);
    expect(createAssessmentGroupRequest).toHaveBeenCalledWith(
      GENERIC_CREATE_ASSESSMENT_GROUP_ENDPOINT,
      args
    );
  });
});
