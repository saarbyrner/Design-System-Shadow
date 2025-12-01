import $ from 'jquery';
import saveGridReordering from '../saveReordering';

describe('saveGridReordering', () => {
  let saveGridReorderingRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    saveGridReorderingRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve([]));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    await saveGridReordering(
      1,
      1440,
      'collections_tab_assessment',
      [12, 55, 232, 1]
    );

    expect(saveGridReorderingRequest).toHaveBeenCalledTimes(1);
    expect(saveGridReorderingRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/planning_hub/events/1/grid_columns/reorder',
      contentType: 'application/json',
      data: JSON.stringify({
        tab: 'collections_tab_assessment',
        ordered_ids: [12, 55, 232, 1],
        assessment_group_id: 1440,
      }),
    });
  });

  it('works with default columns', async () => {
    await saveGridReordering(1, 'default', 'collections_tab', [12, 55, 232, 1]);

    expect(saveGridReorderingRequest).toHaveBeenCalledTimes(1);
    expect(saveGridReorderingRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/planning_hub/events/1/grid_columns/reorder',
      contentType: 'application/json',
      data: JSON.stringify({
        tab: 'collections_tab',
        ordered_ids: [12, 55, 232, 1],
      }),
    });
  });
});
