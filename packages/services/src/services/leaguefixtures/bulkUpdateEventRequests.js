// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { FileInfo } from '@kitman/modules/src/KitMatrix/shared/types';

type RequestEvent = {
  id: number,
  status?: string,
  rejection_reason_id?: number,
  reason?: string,
};

type Params = {
  eventId: number,
  attachment?: FileInfo | null,
  requests: RequestEvent[],
};

const bulkUpdateEventRequests = async ({
  eventId,
  attachment,
  requests,
}: Params): Promise<void> => {
  const { data } = await axios.post(
    `/planning_hub/user_event_requests/bulk_save`,
    {
      event_id: eventId,
      user_event_request_attributes: requests,
      ...(attachment ? { attachment } : {}),
    }
  );
  return data;
};

export default bulkUpdateEventRequests;
