// @flow
import { axios } from '@kitman/common/src/utils/services';

export type RequestResponse = {
  id: number,
  name: string,
  attachable_type: string,
};

const deleteEventAttachment = async (
  eventId: number,
  attachmentId: number
): Promise<RequestResponse> => {
  const { data } = await axios.delete(
    `/planning_hub/events/${eventId}/attachments/${attachmentId}`
  );

  return data;
};

export default deleteEventAttachment;
