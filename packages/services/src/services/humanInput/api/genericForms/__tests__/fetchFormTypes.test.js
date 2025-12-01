import { axios } from '@kitman/common/src/utils/services';

import formTypesMockData from '@kitman/services/src/services/humanInput/api/mocks/data/formTypes.mock';
import fetchFormTypes, { generateFetchFormTypesUrl } from '../fetchFormTypes';

describe('fetchFormTypes', () => {
  let fetchFormAnswersSetRequest;

  beforeEach(() => {
    fetchFormAnswersSetRequest = jest.spyOn(axios, 'get');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    const filters = { category: 'medical' };
    const returnedData = await fetchFormTypes(filters);

    expect(returnedData).toEqual(formTypesMockData);
    expect(fetchFormAnswersSetRequest).toHaveBeenCalledTimes(1);
    expect(fetchFormAnswersSetRequest).toHaveBeenCalledWith(
      generateFetchFormTypesUrl(filters)
    );
  });
  it('calls the correct endpoint with group', async () => {
    const filters = { group: 'testGroup' };
    const returnedData = await fetchFormTypes(filters);

    expect(returnedData).toEqual(formTypesMockData);
    expect(fetchFormAnswersSetRequest).toHaveBeenCalledTimes(1);
    expect(fetchFormAnswersSetRequest).toHaveBeenCalledWith(
      generateFetchFormTypesUrl(filters)
    );
  });
  it('calls the correct endpoint with form_type', async () => {
    const filters = { form_type: 'testFormType' };
    const returnedData = await fetchFormTypes(filters);

    expect(returnedData).toEqual(formTypesMockData);
    expect(fetchFormAnswersSetRequest).toHaveBeenCalledTimes(1);
    expect(fetchFormAnswersSetRequest).toHaveBeenCalledWith(
      generateFetchFormTypesUrl(filters)
    );
  });
  it('calls the correct endpoint with key', async () => {
    const filters = { key: 'testKey' };
    const returnedData = await fetchFormTypes(filters);

    expect(returnedData).toEqual(formTypesMockData);
    expect(fetchFormAnswersSetRequest).toHaveBeenCalledTimes(1);
    expect(fetchFormAnswersSetRequest).toHaveBeenCalledWith(
      generateFetchFormTypesUrl(filters)
    );
  });
});
