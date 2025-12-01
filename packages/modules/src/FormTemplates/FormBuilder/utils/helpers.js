// @flow
import type { Dispatch } from 'redux';
import i18n from '@kitman/common/src/utils/i18n';
import { INPUT_ELEMENTS } from '@kitman/modules/src/HumanInput/shared/constants';

import type {
  ElementTypes,
  HumanInputFormElement,
} from '@kitman/modules/src/HumanInput/types/forms';
import {
  updateQuestion,
  updateQuestionFromGroupLayoutElement,
} from '@kitman/modules/src/FormTemplates/redux/slices/formBuilderSlice';
import { NumberQuestionTranslated as Number } from '@kitman/modules/src/FormTemplates/FormBuilder/components/Questions/Number';
import { RangeQuestionTranslated as Range } from '@kitman/modules/src/FormTemplates/FormBuilder/components/Questions/Range';
import { TextQuestionTranslated as Text } from '@kitman/modules/src/FormTemplates/FormBuilder/components/Questions/Text';
import { DateTimeQuestionTranslated as DateTime } from '@kitman/modules/src/FormTemplates/FormBuilder/components/Questions/DateTime';
import { AttachmentQuestionTranslated as Attachment } from '@kitman/modules/src/FormTemplates/FormBuilder/components/Questions/Attachment';
import MultipleChoice from '../components/Questions/MultipleChoice';
import BooleanQuestion from '../components/Questions/BooleanQuestion';

type ParseQuestionElement = {
  questionElement: HumanInputFormElement,
  questionIndex: number,
  groupIndex: ?number,
  isChildOfGroup: ?boolean,
};

export const parseQuestionElement = ({
  questionElement,
  questionIndex,
  groupIndex,
  isChildOfGroup,
}: ParseQuestionElement) => {
  const elementType = questionElement.element_type;

  switch (elementType) {
    case INPUT_ELEMENTS.Text:
      return (
        <Text
          questionElement={questionElement}
          questionIndex={questionIndex}
          groupIndex={groupIndex}
          isChildOfGroup={isChildOfGroup}
        />
      );
    case INPUT_ELEMENTS.Number:
      return (
        <Number
          questionElement={questionElement}
          questionIndex={questionIndex}
          groupIndex={groupIndex}
          isChildOfGroup={isChildOfGroup}
        />
      );
    case INPUT_ELEMENTS.DateTime:
      return (
        <DateTime
          questionElement={questionElement}
          questionIndex={questionIndex}
          groupIndex={groupIndex}
          isChildOfGroup={isChildOfGroup}
        />
      );
    case INPUT_ELEMENTS.Boolean:
      return (
        <BooleanQuestion
          questionIndex={questionIndex}
          questionElement={questionElement}
          groupIndex={groupIndex}
          isChildOfGroup={isChildOfGroup}
        />
      );

    case INPUT_ELEMENTS.SingleChoice:
    case INPUT_ELEMENTS.MultipleChoice:
      return (
        <MultipleChoice
          questionElement={questionElement}
          questionIndex={questionIndex}
          groupIndex={groupIndex}
          isChildOfGroup={isChildOfGroup}
        />
      );

    case INPUT_ELEMENTS.Attachment:
      return (
        <Attachment
          questionElement={questionElement}
          questionIndex={questionIndex}
          groupIndex={groupIndex}
          isChildOfGroup={isChildOfGroup}
        />
      );

    case INPUT_ELEMENTS.Range:
      return (
        <Range
          questionElement={questionElement}
          questionIndex={questionIndex}
          groupIndex={groupIndex}
          isChildOfGroup={isChildOfGroup}
        />
      );

    default:
      // eslint-disable-next-line no-console
      console.warn(
        `Unsupported question element provided to mapper function: ${elementType}`
      );
      return (
        <div>
          {i18n.t('Unsupported element')}: {elementType}
        </div>
      );
  }
};

// mapping for BE question banks types
export const getQuestionElementType = (questionType: ElementTypes) => {
  switch (questionType) {
    case INPUT_ELEMENTS.Boolean:
      return 'boolean';
    case INPUT_ELEMENTS.DateTime:
      return 'date';
    case INPUT_ELEMENTS.MultipleChoice:
      return 'multiple_choice';
    case INPUT_ELEMENTS.Number:
      return 'number';
    case INPUT_ELEMENTS.Range:
      return 'range';
    case INPUT_ELEMENTS.SingleChoice:
      return 'single_choice';
    case INPUT_ELEMENTS.Text:
      return 'text';
    default:
      return '';
  }
};

export const updateQuestionElement = (
  actionPayload: Object,
  dispatch: Dispatch,
  isChildOfGroup: ?boolean,
  groupIndex: ?number
) => {
  if (isChildOfGroup) {
    dispatch(
      updateQuestionFromGroupLayoutElement({
        ...actionPayload,
        groupIndex,
      })
    );
  } else {
    dispatch(updateQuestion(actionPayload));
  }
};
