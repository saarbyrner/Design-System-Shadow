import { axios } from '@kitman/common/src/utils/services';
import { data as mockActivityTypeCategories } from '@kitman/services/src/mocks/handlers/getActivityTypeCategories';
import getActivityTypeCategories from '../getActivityTypeCategories';

describe('getActivityTypeCategories', () => {
  let request;

  beforeEach(() => {
    request = jest
      .spyOn(axios, 'get')
      .mockImplementation(() => ({ data: mockActivityTypeCategories }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('makes the call to the correct endpoint', async () => {
    await getActivityTypeCategories();

    expect(request).toHaveBeenCalledWith(
      '/ui/planning_hub/event_activity_type_categories'
    );
  });

  it('returns the correct data', async () => {
    const data = await getActivityTypeCategories();

    expect(data).toEqual(mockActivityTypeCategories);
  });
});
