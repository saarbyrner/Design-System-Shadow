import $ from 'jquery';
import saveActivityTypes from '../saveActivityTypes';

describe('saveActivityTypes', () => {
  let saveActivityTypesRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    saveActivityTypesRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve([]));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    const activityTypes = [
      {
        id: 1,
        name: 'Updated activity type',
      },
      {
        id: 2,
        delete: true,
      },
      {
        name: 'New activity type',
      },
    ];

    await saveActivityTypes(activityTypes);

    expect(saveActivityTypesRequest).toHaveBeenCalledTimes(1);
    expect(saveActivityTypesRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/ui/planning_hub/event_activity_types/bulk_save',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({ event_activity_types: activityTypes }),
    });
  });
});
