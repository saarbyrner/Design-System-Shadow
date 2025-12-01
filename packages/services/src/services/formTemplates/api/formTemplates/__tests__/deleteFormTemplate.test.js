import { axios } from '@kitman/common/src/utils/services';
import deleteFormTemplate from '../deleteFormTemplate'; 

describe('deleteFormTemplate', () => {
  let deleteFormTemplateRequest;

  beforeEach(() => {
    deleteFormTemplateRequest = jest.spyOn(axios, 'delete');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    jest.spyOn(axios, 'delete').mockResolvedValue({});
    const formTemplateId = 123;
    
    await deleteFormTemplate({ formTemplateId });

    expect(deleteFormTemplateRequest).toHaveBeenCalledTimes(1);
    expect(deleteFormTemplateRequest).toHaveBeenCalledWith(
      `/forms/form_templates/${formTemplateId}`
    );
  });
});
