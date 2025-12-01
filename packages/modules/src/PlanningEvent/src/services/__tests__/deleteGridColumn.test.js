import $ from 'jquery';
import deleteGridColumn from '../deleteGridColumn';

describe('deleteGridColumn', () => {
  let deleteGridColumnRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    deleteGridColumnRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve([]));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    await deleteGridColumn(1, 4, 'collections_tab');

    expect(deleteGridColumnRequest).toHaveBeenCalledTimes(1);
    expect(deleteGridColumnRequest).toHaveBeenCalledWith({
      method: 'DELETE',
      url: '/planning_hub/events/1/grid_columns/4',
      contentType: 'application/json',
      data: JSON.stringify({
        tab: 'collections_tab',
      }),
    });
  });
});
