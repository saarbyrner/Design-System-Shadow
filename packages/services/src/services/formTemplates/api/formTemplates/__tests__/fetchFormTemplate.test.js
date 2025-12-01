import { axios } from '@kitman/common/src/utils/services';

import data from '@kitman/services/src/services/formTemplates/api/mocks/data/formTemplates/fetchFormTemplate';
import fetchFormTemplate from '../fetchFormTemplate';

describe('fetchFormTemplate', () => {
  let fetchFormTemplateRequest;

  beforeEach(() => {
    fetchFormTemplateRequest = jest.spyOn(axios, 'get');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    const formTemplateId = 123;
    const returnedData = await fetchFormTemplate(formTemplateId);

    expect(returnedData).toEqual(data);
    expect(fetchFormTemplateRequest).toHaveBeenCalledTimes(1);
    expect(fetchFormTemplateRequest).toHaveBeenCalledWith(
      `/forms/form_templates/${formTemplateId}`,
      { headers: { Accept: 'application/json' } }
    );
  });
});
