// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { User } from '@kitman/modules/src/LeagueOperations/shared/types/common';

const fetchAssociationLabelCategoriesGroups = async ({
  id,
  organisationId,
}: {
  id: string | number,
  organisationId: string | number,
}): Promise<User> => {
  const { data } = await axios.get(
    `/label_categories_groups/${id}/count?organisation_id=${organisationId}`
  );

  return data;
};

export default fetchAssociationLabelCategoriesGroups;
