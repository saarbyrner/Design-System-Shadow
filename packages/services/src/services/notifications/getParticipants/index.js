// @flow
import { axios } from '@kitman/common/src/utils/services';

type Response = Array<{
  record_type: string,
  record_id: number,
  name: string,
  email: string,
}>;

const getParticipants = async ({
  eventId,
  recipientsType,
}: {
  eventId: number,
  recipientsType: 'event_participants_contacts',
}): Promise<Response> => {
  const { data } = await axios.get('/planning_hub/participants', {
    params: {
      event_id: eventId,
      recipients_type: recipientsType,
    },
  });

  return data;
};

export default getParticipants;
