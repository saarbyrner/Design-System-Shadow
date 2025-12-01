// @flow
import { axios } from '@kitman/common/src/utils/services';

type Props = {
  userEventRequestId: number,
};

const deleteEventActivity = async (props: Props) => {
  await axios.delete(
    `/planning_hub/user_event_requests/${props.userEventRequestId}`
  );
};

export default deleteEventActivity;
