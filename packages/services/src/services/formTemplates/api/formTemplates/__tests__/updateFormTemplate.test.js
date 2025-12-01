import { axios } from '@kitman/common/src/utils/services';

import data from '@kitman/services/src/services/formTemplates/api/mocks/data/formTemplates/fetchFormTemplate';
import updateFormTemplate from '../updateFormTemplate';

describe('updateFormTemplate', () => {
  let updateFormTemplateRequest;

  beforeEach(() => {
    updateFormTemplateRequest = jest.spyOn(axios, 'put');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    const formTemplateId = 123;
    const requestBody = {};
    const returnedData = await updateFormTemplate({
      formTemplateId,
      requestBody,
    });

    expect(returnedData).toEqual(data);
    expect(updateFormTemplateRequest).toHaveBeenCalledTimes(1);
    expect(updateFormTemplateRequest).toHaveBeenCalledWith(
      `/forms/form_templates/${formTemplateId}`,
      requestBody
    );
  });
});
