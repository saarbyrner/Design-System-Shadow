// @flow
import { axios } from '@kitman/common/src/utils/services';
import { type AthletesInAssociationHierarchy } from './types';

const getAssociationHierarchy =
  async (): Promise<AthletesInAssociationHierarchy> => {
    const { data } = await axios.get(
      '/ui/organisation/athletes/association_hierarchy'
    );

    return data;
  };

export default getAssociationHierarchy;
