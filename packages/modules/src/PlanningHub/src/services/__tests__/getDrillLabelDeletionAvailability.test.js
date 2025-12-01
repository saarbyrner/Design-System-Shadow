import $ from 'jquery';
import getDrillLabelDeletionAvailability from '../getDrillLabelDeletionAvailability';

const mockedData = [
  {
    ok: true,
    drills_count: 0,
  },
];

describe('getActivityTypeDeletionAvailability', () => {
  let getDrillLabelDeletionAvailabilityRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    getDrillLabelDeletionAvailabilityRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(mockedData));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getDrillLabelDeletionAvailability(4);

    expect(returnedData).toEqual(mockedData);

    expect(getDrillLabelDeletionAvailabilityRequest).toHaveBeenCalledTimes(1);
    expect(getDrillLabelDeletionAvailabilityRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/ui/planning_hub/event_activity_drill_labels/4/check_destruction',
    });
  });
});
