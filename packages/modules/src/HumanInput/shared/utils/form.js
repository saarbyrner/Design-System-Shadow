// @flow

import type { Node } from 'react';
import type {
  ElementTypes,
  HumanInputFormElement,
  Mode,
  FormAnswer,
  FieldState,
  ElementState,
} from '@kitman/modules/src/HumanInput/types/forms';
import i18n from '@kitman/common/src/utils/i18n';

import {
  COMPOSITE_SECTIONS,
  DEFAULT_COLUMNS,
  INPUT_ELEMENTS,
  LAYOUT_ELEMENTS,
  INPUT_ELEMENTS_ARRAY,
} from '@kitman/modules/src/HumanInput/shared/constants';

import { Grid } from '@kitman/playbook/components';
import Select from '@kitman/modules/src/HumanInput/shared/components/InputElements/Select';
import Number from '@kitman/modules/src/HumanInput/shared/components/InputElements/Number';
import DateTime from '@kitman/modules/src/HumanInput/shared/components/InputElements/DateTime';
import Attachment from '@kitman/modules/src/HumanInput/shared/components/InputElements/Attachment';
import Content from '@kitman/modules/src/HumanInput/shared/components/LayoutElements/Content';
import Group from '@kitman/modules/src/HumanInput/shared/components/LayoutElements/Group';
import Range from '@kitman/modules/src/HumanInput/shared/components/InputElements/Range';

import { BooleanInputTranslated as Boolean } from '@kitman/modules/src/HumanInput/shared/components/InputElements/Boolean';
import TextInput from '@kitman/modules/src/HumanInput/shared/components/InputElements/TextInput';
import { FormAnswerTranslated as Answer } from '@kitman/modules/src/HumanInput/shared/components/InputElements/Answer';

import CommonInputElement from '@kitman/modules/src/HumanInput/shared/components/ContainerElements/CommonInputElement';
import ConditionalRender from '@kitman/modules/src/HumanInput/shared/components/ContainerElements/ConditionalRender';
import { ManageAttachmentTranslated as ManageAttachment } from '@kitman/modules/src/HumanInput/shared/components/ContainerElements/ManageAttachment';

export const getDefaultValue = (
  elementType: ElementTypes
): string | boolean | number | [] | Object => {
  switch (elementType) {
    case INPUT_ELEMENTS.Attachment:
      return null;
    case INPUT_ELEMENTS.Boolean:
      return null;
    case INPUT_ELEMENTS.MultipleChoice:
      return [];
    case INPUT_ELEMENTS.Number:
      return null;
    case INPUT_ELEMENTS.DateTime:
      return null;
    case INPUT_ELEMENTS.SingleChoice:
    case INPUT_ELEMENTS.Text:
      return '';
    case INPUT_ELEMENTS.Range:
      return null;
    default:
      return {};
  }
};

export const createElementMap = (
  formElement: HumanInputFormElement
): ElementState => {
  const key = formElement?.config?.element_id;
  if (!key) return {};

  const root = formElement.form_elements;

  if (COMPOSITE_SECTIONS.includes(formElement.element_type)) {
    return Object.assign({}, ...root.map(createElementMap));
  }

  return {
    [key]: formElement,
  };
};

export const parseFormInputElement = ({
  element,
  mode,
  repeatableGroupInfo = {},
}: {
  element: HumanInputFormElement,
  mode: Mode,
  repeatableGroupInfo?: { repeatable: boolean, groupNumber: number },
}): Node => {
  if (mode === 'VIEW' && INPUT_ELEMENTS_ARRAY.includes(element.element_type)) {
    return (
      <ConditionalRender element={element}>
        <CommonInputElement
          element={element}
          repeatableGroupInfo={repeatableGroupInfo}
        >
          {({ value }) => (
            <Answer
              element={element}
              value={value}
              repeatableGroupInfo={repeatableGroupInfo}
            />
          )}
        </CommonInputElement>
      </ConditionalRender>
    );
  }

  switch (element.element_type) {
    case INPUT_ELEMENTS.Text:
      return (
        <ConditionalRender element={element}>
          <CommonInputElement
            element={element}
            repeatableGroupInfo={repeatableGroupInfo}
          >
            {({ value, validationStatus, onChange, onBlur }) => (
              <TextInput
                element={element}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                validationStatus={validationStatus}
              />
            )}
          </CommonInputElement>
        </ConditionalRender>
      );
    case INPUT_ELEMENTS.Number:
      return (
        <ConditionalRender element={element}>
          <CommonInputElement
            element={element}
            repeatableGroupInfo={repeatableGroupInfo}
          >
            {({ value, validationStatus, onChange, onBlur }) => (
              <Number
                element={element}
                value={value}
                validationStatus={validationStatus}
                onChange={onChange}
                onBlur={onBlur}
              />
            )}
          </CommonInputElement>
        </ConditionalRender>
      );
    case INPUT_ELEMENTS.DateTime:
      return (
        <ConditionalRender element={element}>
          <CommonInputElement
            element={element}
            repeatableGroupInfo={repeatableGroupInfo}
          >
            {({ value, validationStatus, onChange }) => (
              <DateTime
                element={element}
                value={value}
                validationStatus={validationStatus}
                onChange={onChange}
              />
            )}
          </CommonInputElement>
        </ConditionalRender>
      );
    case INPUT_ELEMENTS.Boolean:
      return (
        <ConditionalRender element={element}>
          <CommonInputElement
            element={element}
            repeatableGroupInfo={repeatableGroupInfo}
          >
            {({ value, onChange }) => (
              <Boolean element={element} value={value} onChange={onChange} />
            )}
          </CommonInputElement>
        </ConditionalRender>
      );
    case INPUT_ELEMENTS.SingleChoice:
    case INPUT_ELEMENTS.MultipleChoice:
      return (
        <ConditionalRender element={element}>
          <CommonInputElement
            element={element}
            repeatableGroupInfo={repeatableGroupInfo}
          >
            {({ value, validationStatus, onChange }) => (
              <Select
                element={element}
                value={value}
                validationStatus={validationStatus}
                multi={element.element_type === INPUT_ELEMENTS.MultipleChoice}
                onChange={onChange}
              />
            )}
          </CommonInputElement>
        </ConditionalRender>
      );
    case INPUT_ELEMENTS.Attachment:
      return (
        <ConditionalRender element={element}>
          <CommonInputElement
            element={element}
            repeatableGroupInfo={repeatableGroupInfo}
          >
            {({ onChange }) => (
              <ManageAttachment
                repeatableGroupInfo={repeatableGroupInfo}
                element={element}
                onChange={onChange}
              >
                {({
                  queuedAttachment,
                  onDeleteAttachment,
                  onAddAttachment,
                  onErrorAttachment,
                  onWarningAttachment,
                  acceptedFilesTypes,
                }) => (
                  <Attachment
                    element={element}
                    queuedAttachment={queuedAttachment}
                    onDeleteAttachment={onDeleteAttachment}
                    onAddAttachment={onAddAttachment}
                    onErrorAttachment={onErrorAttachment}
                    onWarningAttachment={onWarningAttachment}
                    acceptedFilesTypes={acceptedFilesTypes}
                  />
                )}
              </ManageAttachment>
            )}
          </CommonInputElement>
        </ConditionalRender>
      );
    case INPUT_ELEMENTS.Range:
      return (
        <ConditionalRender element={element}>
          <CommonInputElement
            element={element}
            repeatableGroupInfo={repeatableGroupInfo}
          >
            {({ value, onChange }) => (
              <Range
                element={element}
                value={value || null}
                onChange={onChange}
              />
            )}
          </CommonInputElement>
        </ConditionalRender>
      );
    case LAYOUT_ELEMENTS.Group:
      return <Group element={element} mode={mode} />;
    case LAYOUT_ELEMENTS.Content:
      return (
        <ConditionalRender element={element}>
          <Content element={element} />
        </ConditionalRender>
      );

    default:
      // eslint-disable-next-line no-console
      console.warn(
        `Unsupported element provided to mapper function: ${element.element_type}`
      );
      return (
        <div>
          {i18n.t('Unsupported element')}: {element.element_type}
        </div>
      );
  }
};

export const buildFormState = (
  formElement: HumanInputFormElement,
  isChildOfRepeatableGroup: boolean = false
): FieldState => {
  const id = formElement?.id;
  if (!id) return {};

  const root = formElement.form_elements;

  if (COMPOSITE_SECTIONS.includes(formElement.element_type)) {
    const isRepeatableGroup =
      formElement.element_type === LAYOUT_ELEMENTS.Group &&
      formElement.config.repeatable;

    return Object.assign(
      {},
      ...root.map((ele) => buildFormState(ele, isRepeatableGroup))
    );
  }

  return {
    [id]: isChildOfRepeatableGroup
      ? []
      : getDefaultValue(formElement.element_type),
  };
};

export const setFormAnswer = (formAnswer: FormAnswer): FieldState => {
  const id = formAnswer.form_element?.id;

  return typeof id === 'number' && id !== null
    ? {
        [id]: formAnswer.value,
      }
    : {};
};

export const extractByElementType = ({
  formElement,
  elementType,
}: {
  formElement: HumanInputFormElement,
  elementType: string,
}): Array<HumanInputFormElement> => {
  const elements: Array<HumanInputFormElement> = [];

  function searchByElementType(currentFormElement: HumanInputFormElement) {
    if (currentFormElement.element_type === elementType) {
      elements.push(currentFormElement);
    }
    return currentFormElement.form_elements.map(searchByElementType);
  }

  searchByElementType(formElement);
  return elements;
};

export const renderFormElement = (
  element: HumanInputFormElement,
  mode: Mode
): Node => {
  return (
    element.visible && (
      <Grid item xs={DEFAULT_COLUMNS} key={element.config.element_id} pt={0}>
        {parseFormInputElement({ element, mode })}
      </Grid>
    )
  );
};

export const elementIsChildOfRepeatableGroup = (
  repeatableGroupElements: Array<HumanInputFormElement>,
  elementId: number
) => {
  return repeatableGroupElements.some((repeatableGroup) => {
    const childElements = repeatableGroup.form_elements;

    return childElements.find(({ id }) => id === elementId);
  });
};

// Helper to get a flat list of all nested form elements.
export const flattenElements = (
  elements: Array<HumanInputFormElement>
): Array<HumanInputFormElement> => {
  const flatList = [];
  const queue = [...elements];
  while (queue.length > 0) {
    const current = queue.shift();
    if (current) {
      flatList.push(current);
      if (current.form_elements && current.form_elements.length > 0) {
        queue.push(...current.form_elements);
      }
    }
  }
  return flatList;
};
