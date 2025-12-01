// @flow
import { axios } from '@kitman/common/src/utils/services';

type AssessmentTemplates = {
  id: number,
  name: string,
};
export const GENERIC_ASSESSMENT_TEMPLATES_ENDPOINT = '/assessment_templates';

const getAssessmentTemplates = async (): Promise<AssessmentTemplates> => {
  const { data } = await axios.get(GENERIC_ASSESSMENT_TEMPLATES_ENDPOINT);
  return data;
};

export default getAssessmentTemplates;
