// @flow
import { axios } from '@kitman/common/src/utils/services';
import baseLabelsURL from '@kitman/services/src/services/OrganisationSettings/DynamicCohorts/Labels/consts';

export const deleteLabel = async (id: number) => {
  await axios.delete(`${baseLabelsURL}/${id}`);
};

export default deleteLabel;
