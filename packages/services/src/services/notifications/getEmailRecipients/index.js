// @flow
import { axios } from '@kitman/common/src/utils/services';

type Props = {
  eventId: number,
  includeDmr?: boolean,
  includeDmn?: boolean,
};

const getEmailRecipients = async (props: Props) => {
  const { eventId, includeDmr = false, includeDmn = false } = props;

  let urlParams = {};

  if (includeDmr) {
    urlParams = { ...urlParams, include_dmr: true };
  }
  if (includeDmn) {
    urlParams = { ...urlParams, include_dmn: true };
  }

  const { data } = await axios.get(
    `/planning_hub/events/${eventId}/recipients`,
    { params: urlParams }
  );
  return data;
};

export default getEmailRecipients;
