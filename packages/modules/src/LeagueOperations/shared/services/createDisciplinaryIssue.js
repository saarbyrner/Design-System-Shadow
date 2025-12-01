/* eslint-disable camelcase */
// @flow
import { axios } from '@kitman/common/src/utils/services';

import { type CreateDisciplinaryIssueParams } from '../types/discipline';

const createDisciplinaryIssue = async ({
  user_id,
  reason_ids,
  start_date,
  end_date,
  note,
  competition_ids,
  kind,
  squad_id,
  number_of_games,
}: CreateDisciplinaryIssueParams): Promise<Object> => {
  try {
    const { data } = await axios.post(`/discipline/create`, {
      user_id,
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

export default createDisciplinaryIssue;
