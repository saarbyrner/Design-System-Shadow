import { axios } from '@kitman/common/src/utils/services';
import data from '@kitman/services/src/services/formTemplates/api/mocks/data/formTemplates/fetchFormTemplate';
import updateFormTemplateMetadata from '../updateFormTemplateMetadata';

describe('updateFormTemplateMetadata', () => {
  let updateFormTemplateMetadataRequest;

  beforeEach(() => {
    updateFormTemplateMetadataRequest = jest.spyOn(axios, 'put');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    const formId = 1;
    const formTemplateId = 123;
    const requestBody = { name: 'new name' };
    const returnedData = await updateFormTemplateMetadata({
      formId,
      formTemplateId,
      requestBody,
    });

    expect(returnedData).toEqual(data);
    expect(updateFormTemplateMetadataRequest).toHaveBeenCalledTimes(1);
    expect(updateFormTemplateMetadataRequest).toHaveBeenCalledWith(
      `/forms/${formId}/form_templates/${formTemplateId}/update_form_only`,
      requestBody
    );
  });
});
