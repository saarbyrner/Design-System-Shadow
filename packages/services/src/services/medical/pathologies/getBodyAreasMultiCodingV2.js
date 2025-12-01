// @flow
import { axios } from '@kitman/common/src/utils/services';

export type BodyAreaMultiCodingV2 = {
  id: number,
  coding_system_id: number,
  coding_system_body_region: {
    id: number,
    coding_system_id: number,
    name: string,
  },
  name: string,
};

export const url = '/emr/pathologies/body_areas';
const getBodyAreasMultiCodingV2 = async (): Promise<
  Array<BodyAreaMultiCodingV2>
> => {
  const { data } = await axios.get(url);

  return data;
};

export default getBodyAreasMultiCodingV2;
