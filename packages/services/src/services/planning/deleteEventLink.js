// @flow
import { axios } from '@kitman/common/src/utils/services';

export type RequestResponse = {
  id: number,
  attached_link_id: string,
  event_id: string,
};

const deleteEventLink = async (
  eventId: number,
  attachedLinkId: number
): Promise<RequestResponse> => {
  const { data } = await axios.delete(
    `/planning_hub/events/${eventId}/attached_links/${attachedLinkId}`
  );

  return data;
};

export default deleteEventLink;
