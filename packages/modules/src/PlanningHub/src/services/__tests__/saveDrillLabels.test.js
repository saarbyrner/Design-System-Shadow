import $ from 'jquery';
import saveDrillLabels from '../saveDrillLabels';

describe('saveDrillLabels', () => {
  let saveDrillLabelsRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    saveDrillLabelsRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve([]));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    const drillLabels = [
      {
        id: 1,
        name: 'Updated drill label',
      },
      {
        id: 2,
        delete: true,
      },
      {
        name: 'New drill label',
      },
    ];

    await saveDrillLabels(drillLabels);

    expect(saveDrillLabelsRequest).toHaveBeenCalledTimes(1);
    expect(saveDrillLabelsRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/ui/planning_hub/event_activity_drill_labels/bulk_save',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({
        event_activity_drill_labels: drillLabels,
      }),
    });
  });
});
