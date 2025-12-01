// @flow
import { axios } from '@kitman/common/src/utils/services';

export type ActivityTypeCategoryEnabled = {
  value: boolean,
};

const getIsActivityTypeCategoriesEnabled =
  async (): Promise<ActivityTypeCategoryEnabled> => {
    const { data } = await axios.get(
      '/organisation_preferences/enable_activity_type_category'
    );

    return data;
  };

export default getIsActivityTypeCategoriesEnabled;
