// @flow
import { axios } from '@kitman/common/src/utils/services';

type Organisation = {
  id: number,
  name: string,
  logo_full_path: string,
  unassigned_org_name?: ?string,
};

type AssociatedAthlete = {
  id: number,
  fullname: string,
  position: string,
  organisations: Array<Organisation>,
  avatar_url?: string,
  date_of_birth: string,
};

export type UserData = {
  id: number,
  firstname: string,
  lastname: string,
  fullname: string,
  username: string,
  email: string,
  date_of_birth: string,
  athlete?: AssociatedAthlete,
};

export type Params = {
  userId: number,
  include_athlete: boolean,
};

const fetchUserData = async ({
  userId,
  // eslint-disable-next-line camelcase
  include_athlete = false, // this is what the BE expects as a key. Let's keep it same
}: Params): Promise<UserData> => {
  try {
    const { data } = await axios.get(`/users/${userId}`, {
      headers: {
        Accept: 'application/json',
      },
      params: {
        include_athlete,
      },
    });

    return data;
  } catch (err) {
    throw new Error(err);
  }
};

export default fetchUserData;
