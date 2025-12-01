// @flow
import { axios } from '@kitman/common/src/utils/services';

export type IsActivityTypeCategoryEnabled = {
  value: boolean,
};

/**
 * @deprecated
 * Use useFetchOrganisationPreferenceQuery from @kitman/common/src/redux/global/services/globalApi if within RTK context
 * Use @kitman/services/src/services/fetchOrganisationPreference if standalone service
 */

const getIsActivityTypeCategoryEnabled =
  async (): Promise<IsActivityTypeCategoryEnabled> => {
    const { data } = await axios.get(
      '/organisation_preferences/enable_activity_type_category'
    );

    return data;
  };

export default getIsActivityTypeCategoryEnabled;
