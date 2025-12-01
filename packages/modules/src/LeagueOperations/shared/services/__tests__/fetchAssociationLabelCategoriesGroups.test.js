import { response } from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/mock_label_categories_group';
import { axios } from '@kitman/common/src/utils/services';
import fetchAssociationLabelCategoriesGroups from '../fetchAssociationLabelCategoriesGroups';

jest.mock('@kitman/common/src/utils/services', () => ({
  axios: {
    get: jest.fn(),
  },
}));

describe('fetchAssociationLabelCategoriesGroups', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the correct section statuses when the request succeeds', async () => {
    axios.get = jest.fn().mockResolvedValue({ data: response.data });

    const result = await fetchAssociationLabelCategoriesGroups({
      id: 123,
      organisationId: 456,
    });

    expect(result).toEqual(response.data);
    expect(axios.get).toHaveBeenCalledWith(
      '/label_categories_groups/123/count?organisation_id=456'
    );
  });
});
