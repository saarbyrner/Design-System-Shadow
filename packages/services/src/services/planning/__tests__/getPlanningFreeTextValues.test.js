import { axios } from '@kitman/common/src/utils/services';
import getPlanningFreeTextValues from '../getPlanningFreeTextValues';

describe('getPlanningFreeTextValues', () => {
  const eventId = 123;

  const returnValue = {
    event_evaluation_went_well: '<p>Nothing, it went great!</p>',
    event_evaluation_went_wrong: '<p>use weak foot next time!</p>',
  };

  beforeAll(() =>
    jest.spyOn(axios, 'get').mockResolvedValue({ data: returnValue })
  );

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('makes a back-end call to the correct URL with the correct HTTP verb and body', async () => {
    await getPlanningFreeTextValues(eventId, [
      'event_evaluation_went_well',
      'event_evaluation_went_wrong',
    ]);

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      `/planning_hub/events/${eventId}/freetext_values`,
      {
        params: {
          freetext_component_names: [
            'event_evaluation_went_well',
            'event_evaluation_went_wrong',
          ],
        },
      }
    );
  });

  it('returns `data` property value from a response object', async () => {
    const planningData = await getPlanningFreeTextValues(eventId);
    expect(planningData).toMatchObject(returnValue);
  });
});
