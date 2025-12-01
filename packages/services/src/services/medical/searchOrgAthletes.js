// @flow
import type { MovementType } from '@kitman/modules/src/UserMovement/shared/types';
import { TRADE } from '@kitman/modules/src/UserMovement/shared/constants';
import { axios } from '@kitman/common/src/utils/services';

type ResponseAthlete = {
  fullname: string,
  id: number,
  date_of_birth: string,
};

type Response = {
  athletes: Array<ResponseAthlete>,
};

export const searchOrgAthletesURL = '/medical/rosters/search';

const searchOrgAthletes = async (
  searchExpression: string,
  transferType: MovementType = TRADE
): Promise<Response> => {
  const { data } = await axios.post(searchOrgAthletesURL, {
    search_expression: searchExpression,
    transfer_type: transferType,
  });

  return data;
};

export default searchOrgAthletes;
