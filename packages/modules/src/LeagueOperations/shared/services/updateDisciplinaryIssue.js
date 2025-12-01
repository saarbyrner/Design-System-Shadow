/* eslint-disable camelcase */
// @flow
import { axios } from '@kitman/common/src/utils/services';

import { type UpdateDisciplinaryIssueParams } from '../types/discipline';

type Response = {
  message: string,
};

const updateDisciplinaryIssue = async ({
  user_id,
  id,
  reason_ids,
  start_date,
  end_date,
  note,
  competition_ids,
  kind,
  squad_id,
  number_of_games,
}: UpdateDisciplinaryIssueParams): Promise<Response> => {
  try {
    const { data } = await axios.put(`/discipline/update`, {
      user_id,
      id,
      reason_ids,
      start_date,
      end_date,
      note,
      competition_ids,
      kind,
      squad_id,
      number_of_games,
    });
    return data;
  } catch (err) {
    throw new Error(err);
  }
};

export default updateDisciplinaryIssue;
