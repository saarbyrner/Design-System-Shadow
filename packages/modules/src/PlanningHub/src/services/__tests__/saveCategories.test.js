import $ from 'jquery';
import saveCategories from '../saveCategories';

describe('saveCategories', () => {
  let saveCategoriesRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    saveCategoriesRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve([]));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    const categories = [
      {
        id: 1,
        name: 'Recovery and Regeneration',
      },
      {
        id: 3,
        name: 'Wide Play and Box Management',
      },
      {
        id: 4,
        name: 'Shot Stopping',
      },
      {
        name: 'Game Planification',
      },
    ];

    await saveCategories(categories);

    expect(saveCategoriesRequest).toHaveBeenCalledTimes(1);
    expect(saveCategoriesRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/ui/planning_hub/principle_categories/bulk_save',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({ principle_categories: categories }),
    });
  });
});
