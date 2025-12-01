import { axios } from '@kitman/common/src/utils/services';
import data from '@kitman/services/src/services/formTemplates/api/mocks/data/formTemplates/fetchFormAssignments';
import fetchFormAssignments from '../fetchFormAssignments';

describe('fetchFormAssignments', () => {
  let fetchFormAssignmentsRequest;

  beforeEach(() => {
    fetchFormAssignmentsRequest = jest.spyOn(axios, 'get');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    const formId = 123;
    const returnedData = await fetchFormAssignments(formId);

    expect(returnedData).toEqual(data);
    expect(fetchFormAssignmentsRequest).toHaveBeenCalledTimes(1);
    expect(fetchFormAssignmentsRequest).toHaveBeenCalledWith(
      `/forms/${formId}/assignments`,
      { headers: { Accept: 'application/json' } }
    );
  });
});
