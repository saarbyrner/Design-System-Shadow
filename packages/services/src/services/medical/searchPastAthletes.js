// @flow
import { axios } from '@kitman/common/src/utils/services';

type PastAthlete = {
  id: number,
  fullname: string,
};

export type Response = {
  athletes: Array<PastAthlete>,
};

const searchPastAthletes = async ({
  searchString,
}: {
  searchString: string,
}): Promise<Response> => {
  const { data } = await axios.post('/medical/rosters/search_past_athletes', {
    search_expression: searchString,
  });

  return data;
};

export default searchPastAthletes;
