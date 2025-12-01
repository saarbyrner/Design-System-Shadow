// @flow
import { axios } from '@kitman/common/src/utils/services';

import { type DeleteDisciplinaryIssueParams } from '../types/discipline';

type Response = {
  message: string,
};

const deleteDisciplinaryIssue = async ({
  id,
}: DeleteDisciplinaryIssueParams): Promise<Response> => {
  try {
    const { data } = await axios.put(`/discipline/archive`, {
      id,
    });
    return data;
  } catch (err) {
    throw new Error(err);
  }
};

export default deleteDisciplinaryIssue;
