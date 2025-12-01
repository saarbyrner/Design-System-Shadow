import $ from 'jquery';
import updateActivityDrill from '../updateActivityDrill';

const mockedActivityDrill = {
  id: 5,
  name: 'My First Drill',
  sets: 5,
  reps: 10,
  rest_duration: 90,
  pitch_width: 50,
  pitch_length: 50,
  notes: 'This drill will make us win game 100% of the time 2',
  attachment: null,
  duration: null,
};

describe('updateActivityDrill', () => {
  let updateActivityDrillRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    updateActivityDrillRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(mockedActivityDrill));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    await updateActivityDrill(1, 1, {
      name: 'My First Drill',
      sets: 5,
      reps: 10,
      rest_duration: 90,
      pitch_width: 50,
      pitch_length: 50,
      notes: 'This drill will make us win game 100% of the time 2',
    });

    expect(updateActivityDrillRequest).toHaveBeenCalledTimes(1);
    expect(updateActivityDrillRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/ui/planning_hub/events/1/event_activities/1/event_activity_drills',
      contentType: 'application/json',
      data: JSON.stringify({
        name: 'My First Drill',
        sets: 5,
        reps: 10,
        rest_duration: 90,
        pitch_width: 50,
        pitch_length: 50,
        notes: 'This drill will make us win game 100% of the time 2',
      }),
    });
  });
});
