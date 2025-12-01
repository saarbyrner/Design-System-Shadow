// @flow
import { axios } from '@kitman/common/src/utils/services';

export type RequestResponse = {
  status: number,
};

export type PushType = 'training_session' | 'well-being';
export type PushScope = 'entire_squad' | 'non_compliant_athletes';

const sendNotifications = async (
  pushType: PushType,
  pushScope: ?PushScope
): Promise<RequestResponse> => {
  const { data } = await axios.post('/settings/athlete_push', null, {
    params: {
      push_type: pushType,
      push_scope: pushScope,
    },
  });

  return data;
};

export default sendNotifications;
