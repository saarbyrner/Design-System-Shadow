// @flow
import { axios } from '@kitman/common/src/utils/services';

export type Athlete = {
  id: number,
  avatar_url: ?string,
  email: string,
  firstname: string,
  lastname: string,
  kitman_id: string,
  position_name: string,
  jersey_number: ?number,
  date_of_birth: ?string,
};

export type RequestResponse = {
  organisation: {
    id: number,
    name: string,
    logo_full_path: ?string,
  },
  squad: {
    id: number,
    name: string,
  },
  athletes: Array<Athlete>,
};

export default async function getSquad(
  squadId: number
): Promise<RequestResponse> {
  const { data } = await axios.get(`/settings/squads/${squadId}`);
  return data;
}
