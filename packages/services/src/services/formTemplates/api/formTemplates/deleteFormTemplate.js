// @flow
import { axios } from '@kitman/common/src/utils/services';

export const generateDeleteFormTemplateUrl = (formTemplateId: number) =>
  `/forms/form_templates/${formTemplateId}`;

export type DeleteFormTemplateReturnType = void;

const deleteFormTemplate = async ({
  formTemplateId,
}: {
  formTemplateId: number,
}): Promise<DeleteFormTemplateReturnType> => {
  const url = generateDeleteFormTemplateUrl(formTemplateId);
  const { data } = await axios.delete(url);
  return data;
};

export default deleteFormTemplate;
