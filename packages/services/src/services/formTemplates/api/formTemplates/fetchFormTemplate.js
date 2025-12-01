// @flow
import { axios } from '@kitman/common/src/utils/services';
import { type CreateFormTemplateReturnType } from '@kitman/services/src/services/formTemplates/api/formTemplates/create';

export const generateFetchFormTemplatetUrl = (formTemplateId: number) =>
  `/forms/form_templates/${formTemplateId}`;

const fetchFormTemplate = async (
  formAnswersSetId: number
): Promise<CreateFormTemplateReturnType> => {
  const url = generateFetchFormTemplatetUrl(formAnswersSetId);
  const { data } = await axios.get(url, {
    headers: { Accept: 'application/json' },
  });

  return data;
};

export default fetchFormTemplate;
