import { axios } from '@kitman/common/src/utils/services';

import updateFormAssignments from '../updateFormAssignments';

describe('updateFormAssignments', () => {
  let updateFormAssignmentsRequest;

  beforeEach(() => {
    updateFormAssignmentsRequest = jest.spyOn(axios, 'post');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    const formId = 123;
    const requestBody = {
      athlete_ids: [1, 2, 3],
    };

    await updateFormAssignments({ formId, requestBody });

    expect(updateFormAssignmentsRequest).toHaveBeenCalledTimes(1);
    expect(updateFormAssignmentsRequest).toHaveBeenCalledWith(
      `/forms/${formId}/assignments`,
      requestBody
    );
  });
});
