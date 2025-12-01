// @flow
import { axios } from '@kitman/common/src/utils/services';

type Props = {
  eventId: number,
  kind: string,
};

const createMatchDayPdf = async (props: Props) => {
  const { eventId, kind } = props;

  const { data } = await axios.post(
    `/planning_hub/events/${eventId}/generate_pdf`,
    { kind }
  );
  return data;
};

export default createMatchDayPdf;
