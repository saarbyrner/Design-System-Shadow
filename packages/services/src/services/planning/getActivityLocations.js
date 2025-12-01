// @flow
import { axios } from '@kitman/common/src/utils/services';

export type ActivityLocation = {
  id: number,
  name: string,
  is_active: boolean,
  is_owned_by_org: boolean,
  organisation_name: string,
};

const getActivityLocations = async (): Promise<Array<ActivityLocation>> => {
  const { data } = await axios.get(`/ui/activity_locations`);

  return data;
};

export default getActivityLocations;
