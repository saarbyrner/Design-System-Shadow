// @flow
import moment from 'moment';
import { Fragment } from 'react';

import { dateTransferFormat } from '@kitman/common/src/utils/dateFormatter';
import { DatePicker, Select, Textarea } from '@kitman/components';

import type {
  ScreeningAnswer,
  ConditionalFieldAnswer as ConditionalFieldAnswerV2,
  SerializedQuestion,
} from '@kitman/modules/src/ConditionalFields/shared/types';

import style from '../../styles';

type Props = {
  ques: SerializedQuestion,
  onChange: ({
    quest: SerializedQuestion,
    answer: ScreeningAnswer,
  }) => void,
  onClear: (question: SerializedQuestion) => void,
  conditionalFieldsAnswers: Array<ConditionalFieldAnswerV2>,
  isValidationCheckAllowed?: boolean,
};

const Question = ({
  ques,
  onChange,
  onClear,
  conditionalFieldsAnswers,
  isValidationCheckAllowed,
}: Props) => {
  const question = ques?.question;
  const children = ques?.children;

  const foundAnswer = conditionalFieldsAnswers?.find((answer) => {
    return answer.question_id === question.id;
  });

  let value;

  // NOTE: while BE support a question having multiple answers, FE does not yet.
  // Bellow we just select the first answer in the supplied array

  if (
    foundAnswer &&
    foundAnswer.answers?.length > 0 &&
    foundAnswer.answers[0].value
  ) {
    value = foundAnswer.answers[0].value;
  } else if (
    foundAnswer?.value &&
    Array.isArray(foundAnswer.value) &&
    foundAnswer.value.length > 0
  ) {
    value = foundAnswer.value[0];
  }

  let matchingChildren;
  if (value) {
    matchingChildren = children?.filter((child) => {
      return child.question.trigger_value === value;
    });
  }

  switch (question?.question_type) {
    case 'free-text':
      return (
        <Textarea
          label={question.question}
          // BE is expecting all values in an array - will be fixed eventually
          value={value || ''}
          onChange={(newValue) => {
            const answer = {
              question_id: ques.question.id,
              value: [newValue],
              ...(ques.parent_question_id && {
                parent_question_id: ques.parent_question_id,
              }),
            };
            return onChange({ quest: ques, answer });
          }}
          kitmanDesignSystem
          invalid={isValidationCheckAllowed && !value}
          displayValidationText
        />
      );
    case 'multiple-choice': {
      return (
        <Fragment key={question.id}>
          <Select
            value={value}
            label={question.question}
            options={question.question_metadata
              ?.slice()
              .sort((a, b) => a.order - b.order)
              .map((option) => ({
                label: option.value,
                value: option.value,
              }))}
            onChange={(newValue) => {
              const answer = {
                question_id: ques.question.id,
                value: [newValue],
                ...(ques.parent_question_id && {
                  parent_question_id: ques.parent_question_id,
                }),
              };
              return onChange({ quest: ques, answer });
            }}
            onClear={() => onClear(ques)}
            isClearable
            appendToBody
            invalid={isValidationCheckAllowed && !value}
            displayValidationText
          />
          {matchingChildren?.map((matchingChild) => (
            <div css={style.followUpQuestion}>
              <Question
                ques={{
                  ...matchingChild,
                  parent_question_id: ques.question.id,
                }}
                onChange={({ quest: suppliedQuestion, answer }) => {
                  return onChange({ quest: suppliedQuestion, answer });
                }}
                onClear={(suppliedQuestion) => onClear(suppliedQuestion)}
                conditionalFieldsAnswers={conditionalFieldsAnswers}
                isValidationCheckAllowed={isValidationCheckAllowed}
              />
            </div>
          ))}
        </Fragment>
      );
    }
    case 'date':
      return (
        <DatePicker
          label={question.question}
          name="conditional_fields_date_picker"
          value={value || ''}
          onDateChange={(newValue) => {
            const answer = {
              question_id: ques.question.id,
              value: [moment(newValue).format(dateTransferFormat)],
              ...(ques.parent_question_id && {
                parent_question_id: ques.parent_question_id,
              }),
            };
            return onChange({ quest: ques, answer });
          }}
          clearBtn
          kitmanDesignSystem
          invalid={!value && isValidationCheckAllowed}
          displayValidationText
        />
      );
    default:
      return null;
  }
};

export default Question;
