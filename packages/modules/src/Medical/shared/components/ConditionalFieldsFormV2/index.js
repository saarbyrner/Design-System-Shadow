// @flow
import { Fragment } from 'react';
import _unionBy from 'lodash/unionBy';
import { withNamespaces } from 'react-i18next';
import { getDescendantQuestionIds } from '@kitman/modules/src/Medical/shared/components/ConditionalFieldsFormV2/utils';
import Question from '@kitman/modules/src/Medical/shared/components/ConditionalFieldsFormV2/components/Question';
import style from '@kitman/modules/src/Medical/shared/components/ConditionalFieldsFormV2/styles';

// Types:
import type { ComponentType } from 'react';
import type {
  ConditionWithQuestions,
  ConditionalFieldAnswer as ConditionalFieldAnswerV2,
  SerializedQuestion,
} from '@kitman/modules/src/ConditionalFields/shared/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  conditions: Array<ConditionWithQuestions>,
  conditionalFieldsAnswers: Array<ConditionalFieldAnswerV2>,
  onChange: (Array<ConditionalFieldAnswerV2>) => void,
  validQuestionEvent: boolean,
  isValidationCheckAllowed?: boolean,
};

const ConditionalFieldsFormV2 = (props: I18nProps<Props>) => {
  const conditions = props.conditions;

  const onChange = (
    question: SerializedQuestion,
    answer: ConditionalFieldAnswerV2
  ) => {
    // Add/update the current answer
    const answersWithNew = _unionBy(
      [answer],
      props.conditionalFieldsAnswers,
      'question_id'
    );

    // Get IDs of all descendant questions for the current question
    const descendantIdsToRemove = getDescendantQuestionIds(question);

    // Filter out answers for descendant questions
    const updatedAnswers = answersWithNew.filter(
      (ans) => !descendantIdsToRemove.includes(ans.question_id)
    );

    props.onChange(updatedAnswers);
  };

  const onClear = (question: SerializedQuestion) => {
    // Clear the answer

    // Get IDs of all descendant questions for the current question
    const descendantIdsToRemove = getDescendantQuestionIds(question);

    // Include the current question's ID in the list to remove
    const allIdsToRemove = [question.question.id, ...descendantIdsToRemove];

    // Filter out the current question's answer and all descendant answers
    const updatedAnswers = props.conditionalFieldsAnswers.filter(
      ({ question_id: questionId }) => !allIdsToRemove.includes(questionId)
    );

    props.onChange(updatedAnswers);
  };

  const renderQuestionList = (questionsList) =>
    questionsList.slice().map((question) => {
      return question.questions.map((q) => {
        return (
          <div
            key={q.question.id}
            css={
              q.question?.parent_question_id // only followup questions have parent_id
                ? [style.followUpQuestion]
                : [style.question]
            }
          >
            <Question
              childMatch={false}
              ques={q}
              onChange={({ quest, answer }) => {
                return onChange(quest, {
                  ...answer,
                  answers: [], // NOTE: Added to make flow happy. answer.value property will get used in submission
                  screening_ruleset_version_id:
                    question.screening_ruleset_version_id,
                });
              }}
              onClear={onClear}
              conditionalFieldsAnswers={props.conditionalFieldsAnswers}
              isValidationCheckAllowed={props.isValidationCheckAllowed}
            />
          </div>
        );
      });
    });

  return (
    <Fragment>
      <h4 css={style.heading}>{props.t('Logic builder')}</h4>
      {props.validQuestionEvent && renderQuestionList(conditions)}
    </Fragment>
  );
};

export const ConditionalFieldsFormV2Translated: ComponentType<Props> =
  withNamespaces()(ConditionalFieldsFormV2);

export default ConditionalFieldsFormV2;
