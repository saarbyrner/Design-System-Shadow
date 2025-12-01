import $ from 'jquery';
import deleteActivityDrill from '../deleteActivityDrill';

describe('deleteActivityDrill', () => {
  let deleteActivityDrillRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    deleteActivityDrillRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve([]));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    await deleteActivityDrill(1, 4);

    expect(deleteActivityDrillRequest).toHaveBeenCalledTimes(1);
    expect(deleteActivityDrillRequest).toHaveBeenCalledWith({
      method: 'DELETE',
      url: '/ui/planning_hub/events/1/event_activities/4/event_activity_drills',
      contentType: 'application/json',
    });
  });
});
