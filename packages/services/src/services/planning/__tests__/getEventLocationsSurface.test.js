import { axios } from '@kitman/common/src/utils/services';
import getEventLocationsSurface from '../getEventLocationsSurface';

describe('getEventLocationsSurface', () => {
  const returnData = { id: 1, name: 'Surface 1' };
  const eventId = 1;
  const eventDate = '2023-04-09';
  it('makes a back-end call to the correct URL with the correct HTTP verb and body', async () => {
    jest.spyOn(axios, 'get').mockResolvedValue({ data: returnData });
    const eventLocationSurface = await getEventLocationsSurface(
      eventId,
      eventDate
    );
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      `/ui/activity_locations/${eventId}/surface_type?date=${eventDate}`
    );
    expect(eventLocationSurface).toEqual(returnData);
  });
});
