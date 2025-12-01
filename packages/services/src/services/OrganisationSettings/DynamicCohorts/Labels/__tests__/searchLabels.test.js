import { axios } from '@kitman/common/src/utils/services';
import { searchLabels } from '@kitman/services/src/services/OrganisationSettings/index';
import { paginatedLabelResponse } from '@kitman/services/src/mocks/handlers/OrganisationSettings/DynamicCohorts/Labels/searchLabels';

describe('searchLabels', () => {
  let searchLabelsRequest;

  beforeEach(() => {
    searchLabelsRequest = jest.spyOn(axios, 'post');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the right response', async () => {
    const response = await searchLabels({ nextId: null });

    expect(searchLabelsRequest).toHaveBeenCalledTimes(1);
    expect(response).toEqual(paginatedLabelResponse);
  });
});
