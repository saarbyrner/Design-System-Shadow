// @flow
import { axios } from '@kitman/common/src/utils/services';

export type FixtureRating = {
  id: number,
  name: string,
};

const getFixtureRatings = async (): Promise<Array<FixtureRating>> => {
  const { data } = await axios.get('/ui/organisation_fixture_ratings');

  return data;
};

export default getFixtureRatings;
