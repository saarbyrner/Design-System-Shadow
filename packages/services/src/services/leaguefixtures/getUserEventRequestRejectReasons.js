// @flow
import { axios } from '@kitman/common/src/utils/services';

export type RejectReason = {
  id: number,
  name: string,
  require_additional_input: boolean,
};

export default async (): Promise<Array<RejectReason>> => {
  const url = '/planning_hub/user_event_requests/rejection_reasons';

  const { data } = await axios.get(url);
  return data.map((rejectReason) => ({
    id: rejectReason.id,
    name: rejectReason.type_name,
    require_additional_input: rejectReason.require_additional_input,
  }));
};
