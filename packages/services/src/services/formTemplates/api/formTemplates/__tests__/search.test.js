import { axios } from '@kitman/common/src/utils/services';

import { formTemplateMocks } from '@kitman/services/src/services/formTemplates/api/mocks/data/formTemplates/search';
import searchFormTemplates, { SEARCH_FORM_TEMPLATES_URL } from '../search';

describe('searchFormTemplates', () => {
  let searchFormTemplatesRequest;

  beforeEach(() => {
    searchFormTemplatesRequest = jest.spyOn(axios, 'post');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    const requestBody = {
      searchQuery: '',
      filters: {},
      pagination: {},
    };
    const returnedData = await searchFormTemplates(requestBody);

    expect(returnedData).toEqual(formTemplateMocks);
    expect(searchFormTemplatesRequest).toHaveBeenCalledTimes(1);
    expect(searchFormTemplatesRequest).toHaveBeenCalledWith(
      SEARCH_FORM_TEMPLATES_URL,
      { ...requestBody, isInCamelCase: true }
    );
  });
});
