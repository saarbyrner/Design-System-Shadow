// @flow
import type {
  CreateFormTemplateRequestBody,
  CreateFormTemplatesForm,
} from '@kitman/services/src/services/formTemplates/api/formTemplates/create';
import type { HumanInputFormElement } from '@kitman/modules/src/HumanInput/types/forms';
import type { FormStructure } from '@kitman/modules/src/FormTemplates/shared/types';
import type { FormMetaData } from '@kitman/modules/src/FormTemplates/redux/slices/utils/types';

export const buildCreateFormTemplateRequestBody = ({
  formMetaData,
  formStructure,
}: {
  formMetaData: FormMetaData,
  formStructure: FormStructure,
}): CreateFormTemplateRequestBody => {
  const { title, type, description, formCategoryId } = formMetaData;

  // Recursively update 'order' field to ensure correct numbering for backend validation
  const orderFormElements = (elements: Array<HumanInputFormElement>) => {
    return elements.map((element, index) => {
      const orderedElement = {
        ...element,
        order: index + 1,
      };

      if (element.form_elements && element.form_elements.length > 0) {
        orderedElement.form_elements = orderFormElements(element.form_elements);
      }

      return orderedElement;
    });
  };

  const orderedFormElements = orderFormElements(formStructure.form_elements);

  const form: CreateFormTemplatesForm = {
    category: formMetaData.productArea, // to be changed in the future, once we have more clarity from the BE
    group: 'default_group', // to be changed in the future, once we have more clarity from the BE
    form_type: type,
    key: 'default_key', // to be changed in the future, once we have more clarity from the BE
    name: title,
    fullname: description,
    config: null, // to be changed in the future, once we have more clarity from the BE
    enabled: true,
  };

  const formTemplateVersion = {
    name: title,
    config: formStructure.config || null,
    form_elements: orderedFormElements,
  };

  return {
    form,
    form_template: { name: title },
    form_template_version: formTemplateVersion,
    form_elements: orderedFormElements,
    form_category_id: formCategoryId,
  };
};
