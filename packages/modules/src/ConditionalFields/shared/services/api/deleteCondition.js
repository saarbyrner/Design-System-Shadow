// @flow
import { axios } from '@kitman/common/src/utils/services';

type RequestResponse = {
  message: string,
};
const deleteCondition = async ({
  rulesetId,
  versionId,
  conditionId,
}: {
  rulesetId: string,
  versionId: string,
  conditionId: string,
}): Promise<RequestResponse> => {
  const { data } = await axios.delete(
    `/conditional_fields/rulesets/${rulesetId}/versions/${versionId}/conditions/${conditionId}`
  );
  return data;
};

export default deleteCondition;
