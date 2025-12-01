// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { OfficialForm } from '../../../types';

export type RequestResponse = {
  message: string,
  status: number,
};

const createOfficial = async (
  official: OfficialForm
): Promise<RequestResponse> => {
  const { data } = await axios.post('/settings/officials', { official });

  return data;
};

export default createOfficial;
