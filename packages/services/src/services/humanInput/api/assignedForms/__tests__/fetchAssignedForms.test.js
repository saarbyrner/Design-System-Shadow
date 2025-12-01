import { axios } from '@kitman/common/src/utils/services';

import { data } from '@kitman/services/src/services/humanInput/api/mocks/data/assignedForms/assignedForms.mock';
import fetchAssignedForms from '@kitman/services/src/services/humanInput/api/assignedForms/fetchAssignedForms';

describe('fetchForm', () => {
  let fetchFormRequest;

  beforeEach(() => {
    fetchFormRequest = jest.spyOn(axios, 'get').mockResolvedValue({ data });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    const formId = '68';
    const formStatus = 'not_started';
    const page = '1';
    const perPage = '10';

    const props = {
      formId,
      formStatus,
      page,
      perPage,
    };

    const returnedData = await fetchAssignedForms(props);

    expect(returnedData).toEqual(data);
    expect(fetchFormRequest).toHaveBeenCalledTimes(1);
    expect(fetchFormRequest).toHaveBeenCalledWith('/forms/assignments/search', {
      params: {
        form_id: formId,
        page,
        per_page: perPage,
        status: formStatus,
      },
    });
  });
});
