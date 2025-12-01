import { axios } from '@kitman/common/src/utils/services';

import createFormTemplate, { CREATE_FORM_TEMPLATES_URL } from '../create';
import { createFormTemplateMock } from '../../mocks/data/formTemplates/create';

describe('createFormTemplate', () => {
  let createFormTemplateRequest;

  beforeEach(() => {
    createFormTemplateRequest = jest.spyOn(axios, 'post');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    await createFormTemplate(createFormTemplateMock);

    expect(createFormTemplateRequest).toHaveBeenCalledTimes(1);
    expect(createFormTemplateRequest).toHaveBeenCalledWith(
      CREATE_FORM_TEMPLATES_URL,
      { ...createFormTemplateMock }
    );
  });
});
