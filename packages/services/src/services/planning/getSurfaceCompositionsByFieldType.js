// @flow
import { axios } from '@kitman/common/src/utils/services';

export type SurfaceComposition = {
  id: number,
  name: string,
};

export type FieldType = {
  id: number,
  name: string,
  surfaceConditions: Array<SurfaceComposition>,
};

export type SurfaceCompositionDropdownOptions = Array<FieldType>;

const getSurfaceCompositionsByFieldType =
  async (): Promise<SurfaceCompositionDropdownOptions> => {
    const { data } = await axios.get(`/surface_types`);

    return data;
  };

export default getSurfaceCompositionsByFieldType;
