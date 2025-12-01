// @flow
import { axios } from '@kitman/common/src/utils/services';

import type { OfficialForm } from '../../../types';

export type RequestResponse = {
  message: string,
  status: number,
};

const updateOfficial = async ({
  id,
  official,
}: {
  id: number,
  official: OfficialForm,
}): Promise<RequestResponse> => {
  const { data } = await axios.put(`/settings/officials/${id}`, {
    official,
  });

  return data;
};

export default updateOfficial;
