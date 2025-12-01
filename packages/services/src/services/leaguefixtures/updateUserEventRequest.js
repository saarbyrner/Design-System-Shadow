// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { FileInfo } from '@kitman/modules/src/KitMatrix/shared/types';
import type { Option } from '@kitman/components/src/Select';
import type { UserEventRequest } from './getUserEventRequests';

type Props = {
  id: number,
  status?: string,
  rejectOption?: Option,
  attachment?: ?FileInfo,
};

const updateUserEventRequest = async (
  props: Props
): Promise<UserEventRequest> => {
  const { data } = await axios.patch(
    `/planning_hub/user_event_requests/${props.id}`,
    {
      status: props.status,
      reason: props.rejectOption?.requiresText
        ? props.rejectOption.label
        : undefined,
      rejection_reason_id: props.rejectOption?.value,
      ...(props.attachment !== undefined
        ? {
            attachment: props.attachment,
          }
        : {}),
    }
  );
  return data;
};

export default updateUserEventRequest;
