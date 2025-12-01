// @flow

import { axios } from '@kitman/common/src/utils/services';

type Response = Array<{ id: number, reason: string }>;

const fetchRegistrationStatusReasons = async (): Promise<Response> => {
  const { data } = await axios.get('/ui/registration_status_reasons');
  return data;
};

export default fetchRegistrationStatusReasons;
