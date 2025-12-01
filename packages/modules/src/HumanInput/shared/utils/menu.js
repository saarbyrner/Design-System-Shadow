// @flow
import type {
  HumanInputFormElement,
  FormMenuItem,
} from '@kitman/modules/src/HumanInput/types/forms';

import { LAYOUT_ELEMENTS } from '@kitman/modules/src/HumanInput/shared/constants';

export const getFormFields = (
  formElements: Array<HumanInputFormElement>
): Array<number> => {
  return formElements.reduce((acc, curr) => {
    if (
      [
        LAYOUT_ELEMENTS.Menu,
        LAYOUT_ELEMENTS.MenuItem,
        LAYOUT_ELEMENTS.MenuGroup,
        LAYOUT_ELEMENTS.Section,
        LAYOUT_ELEMENTS.Group,
        LAYOUT_ELEMENTS.Content,
      ].includes(curr.element_type)
    ) {
      acc.push(...getFormFields(curr.form_elements));
    } else if (curr.id) {
      acc.push(curr.id);
    }
    return acc;
  }, []);
};

export const parseMenuElement = ({
  element,
  index,
}: {
  element: HumanInputFormElement,
  index: number,
}): FormMenuItem => {
  if ([LAYOUT_ELEMENTS.Section].includes(element.element_type)) {
    return parseMenuElement({ element: element.form_elements[0], index: 0 });
  }

  if (element.element_type === LAYOUT_ELEMENTS.MenuItem) {
    return {
      key: element.config.element_id,
      index,
      title: element.config.title,
      element_type: element.element_type,
      items: [],
      fields: getFormFields(element.form_elements),
    };
  }
  return {
    key: element.config.element_id,
    index,
    title: element.config.title,
    element_type: element.element_type,
    items: element?.form_elements.map((innerElement, innerIndex) => {
      return parseMenuElement({ element: innerElement, index: innerIndex });
    }),
    fields: getFormFields(element.form_elements),
  };
};

export const parseFormMenu = ({
  formElements,
}: {
  formElements: Array<HumanInputFormElement>,
}): Array<FormMenuItem> => {
  return formElements.map((element, index) => {
    return parseMenuElement({ element, index });
  });
};

export const DEFAULT_COLUMNS = '4';
