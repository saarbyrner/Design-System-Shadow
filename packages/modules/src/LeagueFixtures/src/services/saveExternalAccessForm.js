// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { UserEventRequest } from '@kitman/services/src/services/leaguefixtures/getUserEventRequests';
import { type externalAccessForm } from '../components/ExternalAccessForm';

export default async (
  params: externalAccessForm,
  gameId: number
): Promise<UserEventRequest> => {
  const { firstName, lastName, email, id } = params;
  const sendingToApi = id
    ? { association_external_scout_id: id }
    : {
        scout_name: firstName,
        scout_surname: lastName,
        email,
      };

  const { data } = await axios.post(`/planning_hub/user_event_requests`, {
    event_id: gameId,
    ...sendingToApi,
  });

  return data;
};
