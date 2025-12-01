// @flow
import { axios } from '@kitman/common/src/utils/services';

const getEventLocationsSurface = async (
  eventId: number,
  eventDate: string
): Promise<{
  id: number,
  name: string,
} | null> => {
  const { data } = await axios.get(
    `/ui/activity_locations/${eventId}/surface_type?date=${eventDate}`
  );

  return data;
};

export default getEventLocationsSurface;
