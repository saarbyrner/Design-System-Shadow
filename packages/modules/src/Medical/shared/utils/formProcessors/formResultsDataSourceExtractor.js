// @flow
import type { FormElement } from '../../types/medical/QuestionTypes';

const processElement = (element: FormElement, dataSources: Set<string>) => {
  if (!element.visible) {
    return;
  }

  if (element.element_type === 'Forms::Elements::Layouts::MenuGroup') {
    return; // Don't support nested menu group right now
  }

  if (element.element_type === 'Forms::Elements::Layouts::List') {
    return; // Not supported yet
  }

  if (element.element_type === 'Forms::Elements::Layouts::Group') {
    // eslint-disable-next-line no-use-before-define
    processGroup(element, dataSources);
    return;
  }

  if (element.element_type === 'Forms::Elements::Layouts::MenuItem') {
    element.form_elements?.forEach((childElement) =>
      processElement(childElement, dataSources)
    );
    return;
  }

  if (element.config?.data_source) {
    dataSources.add(element.config.data_source);
  }
};

export const processGroup = (
  menuGroup: FormElement,
  dataSources: Set<string>
) => {
  if (!menuGroup.visible) {
    return;
  }

  // Process its form_elements
  menuGroup.form_elements?.forEach((menuItem) => {
    processElement(menuItem, dataSources);
  });
};

const extractDataSources = (data: Object): Array<string> => {
  const dataSources: Set<string> = new Set();

  data.form_template_version.form_elements.forEach((section) => {
    if (!section.visible) {
      return;
    }
    section.form_elements.forEach((element: FormElement) => {
      if (!element.visible) {
        return;
      }

      if (element.element_type === 'Forms::Elements::Layouts::Group') {
        processGroup(element, dataSources);
      } else if (element.element_type === 'Forms::Elements::Layouts::Menu') {
        // Process its form_elements
        element.form_elements?.forEach((menuGroup) =>
          processGroup(menuGroup, dataSources)
        );
      } else {
        // Process single element
        processElement(element, dataSources);
      }
    });
  });

  return [...dataSources];
};

export default extractDataSources;
