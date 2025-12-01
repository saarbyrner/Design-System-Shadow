// @flow
import { axios } from '@kitman/common/src/utils/services';

type Props = {
  eventId: number,
  kind: string,
};

const getMatchDayTemplateData = async (props: Props) => {
  const { eventId, kind } = props;

  const { data } = await axios.get(
    `/planning_hub/events/${eventId}/template_data`,
    { params: { kind } }
  );
  return data;
};

export default getMatchDayTemplateData;
