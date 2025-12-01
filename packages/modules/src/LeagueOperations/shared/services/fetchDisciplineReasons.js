// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { Meta } from '@kitman/modules/src/LeagueOperations/shared/types/common';

import { type DisciplineReasonOption } from '../types/discipline';

export type RequestResponse = {
  data: Array<DisciplineReasonOption>,
  meta: Meta,
};

const fetchDisciplineReasons = async (): Promise<RequestResponse> => {
  try {
    const { data } = await axios.get(`/discipline/discipline_reasons`);
    return data;
  } catch (err) {
    throw new Error(err);
  }
};

export default fetchDisciplineReasons;
