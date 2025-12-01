// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { User } from '@kitman/modules/src/LeagueOperations/shared/types/common';

const fetchOrganisationLabelCategoriesGroups = async ({
  id,
}: {
  id: string | number,
}): Promise<User> => {
  const { data } = await axios.get(`/label_categories_groups/${id}/count`);
  return data;
};

export default fetchOrganisationLabelCategoriesGroups;
