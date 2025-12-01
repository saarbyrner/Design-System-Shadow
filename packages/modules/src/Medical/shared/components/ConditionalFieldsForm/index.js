// @flow
import { useState } from 'react';
import _unionBy from 'lodash/unionBy';
import { AppStatus, Select, Textarea } from '@kitman/components';
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';
import type { Question as QuestionType } from '@kitman/common/src/types/Issues';
import { getFollowUpQuestions } from '../../../rosters/src/services/getConditionalFields';
import type { ConditionalFieldAnswer, RequestStatus } from '../../types';

type Props = {
  initialQuestions: Array<QuestionType>,
  conditionalFieldsAnswers: Array<ConditionalFieldAnswer>,
  onChange: Function,
  validQuestionEvent: boolean,
  isValidationCheckAllowed?: boolean,
};

type PropsQuestion = {
  question: QuestionType,
  value: ?string,
  onChange: Function,
  onClear: Function,
  isValidationCheckAllowed?: boolean,
};

const style = {
  question: css`
    padding-bottom: 16px;
    padding-top: 16px;
    border-bottom: 1px solid ${colors.neutral_300};

    &:last-of-type {
      border-bottom: 0px;
      padding-bottom: 0px;
    }

    &:first-of-type {
      padding-top: 0px;
    }

    .kitmanReactSelect,
    .textarea__input {
      width: 297px;
    }
  `,
  followUpQuestion: css`
    border-left: 4px solid ${colors.neutral_400};
    border-top: 1px solid ${colors.neutral_300};
    padding: 16px 0 22px 16px;

    textarea {
      min-height: unset;
    }

    &:last-of-type {
      border-bottom: 1px solid ${colors.neutral_300};
    }
  `,
  followUpQuestionList: css`
    margin-top: 16px;
  `,
};

const Question = ({
  question,
  value,
  onChange,
  onClear,
  isValidationCheckAllowed,
}: PropsQuestion) => {
  switch (question.question_type) {
    case 'free-text':
      return (
        <Textarea
          label={question.question}
          value={value}
          onChange={(newValue) => onChange(newValue)}
          kitmanDesignSystem
          invalid={isValidationCheckAllowed && !value}
          displayValidationText
        />
      );
    case 'multiple-choice':
      return (
        <Select
          value={value}
          label={question.question}
          options={question.question_metadata
            .sort((a, b) => a.order - b.order)
            .map((option) => ({
              label: option.value,
              value: option.value,
            }))}
          onChange={(newValue) => onChange(newValue)}
          onClear={onClear}
          isClearable
          appendToBody
          invalid={isValidationCheckAllowed && !value}
          displayValidationText
        />
      );
    default:
      return null;
  }
};

const ConditionalFieldsForm = (props: Props) => {
  const [questions, setQuestions] = useState<Array<QuestionType>>(
    props.initialQuestions || []
  );
  const [disabledQuestions, setDisabledQuestions] = useState<Array<number>>([]);
  const [followUpQuestionsRequestStatus, setFollowUpQuestionsRequestStatus] =
    useState<RequestStatus>(null);
  /*
   * Find all questions that are children of the question
   * Recurse to find all children of children
   */
  const getFollowingQuestions = (question) => {
    const followUpQuestions = questions.filter(
      (q) => q.parent_question_id === question.id
    );

    return [
      ...followUpQuestions,
      ...followUpQuestions.map((q) => getFollowingQuestions(q)).flat(),
    ];
  };

  /*
   * Find all questions that are parent of the question
   * Recurse to find all parents of parent
   */
  const getParentQuestions = (question) => {
    const parentQuestions = questions.filter(
      (q) => q.id === question.parent_question_id
    );

    return [
      ...parentQuestions,
      ...parentQuestions.map((q) => getParentQuestions(q)).flat(),
    ];
  };

  /*
   * 1. Disable the question and all the parent questions
   * 2. Fetch follow up questions
   * 3. Re-enable disabled fields
   * 4. Add follow up questions
   */
  const fetchFollowUpQuestions = (question, answer) => {
    // Free text questions don't have follow up questions
    if (question.question_type === 'free-text') return;

    const parentQuestions = getParentQuestions(question).map(({ id }) => id);

    // 1. Disable the question and all the parent questions
    setDisabledQuestions(parentQuestions);

    // 2. Fetch follow up questions
    getFollowUpQuestions(answer)
      .then((data) => {
        // 3. Re-enable disabled fields
        setDisabledQuestions((prevDisabledQuestions) =>
          prevDisabledQuestions.filter((id) => !parentQuestions.includes(id))
        );

        // 4. Add follow up questions
        setQuestions((prevQuestions) => [...prevQuestions, ...data.questions]);
      })
      .catch(() => setFollowUpQuestionsRequestStatus('FAILURE'));
  };

  const onChange = (question, answer) => {
    let updatedAnswers = _unionBy(
      [answer],
      props.conditionalFieldsAnswers,
      'question_id'
    );

    const followingQuestions = getFollowingQuestions(question).map(
      ({ id }) => id
    );

    // Remove following questions and their answers
    if (followingQuestions.length > 0) {
      setQuestions((q) =>
        q.filter(({ id }) => !followingQuestions.includes(id))
      );

      updatedAnswers = updatedAnswers.filter(
        ({ question_id: questionId }) =>
          !followingQuestions.includes(questionId)
      );
    }

    props.onChange(updatedAnswers);
    fetchFollowUpQuestions(question, answer);
  };

  const onClear = (question) => {
    // Clear the answer
    let updatedAnswers = props.conditionalFieldsAnswers.filter(
      ({ question_id: questionId }) => question.id !== questionId
    );

    // Remove following questions and their answers
    const followingQuestions = getFollowingQuestions(question).map(
      ({ id }) => id
    );
    if (followingQuestions.length > 0) {
      setQuestions((q) =>
        q.filter(({ id }) => !followingQuestions.includes(id))
      );

      updatedAnswers = updatedAnswers.filter(
        ({ question_id: questionId }) =>
          !followingQuestions.includes(questionId)
      );
    }
    props.onChange(updatedAnswers);
  };

  const renderQuestionList = (questionsList) =>
    questionsList
      .sort((a, b) => a.order - b.order)
      .map((question) => {
        const followUpQuestions = questions.filter(
          (q) => q.parent_question_id === question.id
        );

        return (
          <div
            key={question.id}
            css={
              question.parent_question_id
                ? [style.followUpQuestion]
                : [style.question]
            }
          >
            <Question
              question={question}
              value={
                props.conditionalFieldsAnswers.find(
                  (answer) => answer.question_id === question.id
                )?.value
              }
              onChange={(value) => {
                const answer = { question_id: question.id, value };
                onChange(question, answer);
              }}
              onClear={() => onClear(question)}
              disabled={disabledQuestions.includes(question.id)}
              isValidationCheckAllowed={props.isValidationCheckAllowed}
            />
            {followUpQuestions.length > 0 && (
              <div css={style.followUpQuestionList}>
                {renderQuestionList(followUpQuestions)}
              </div>
            )}
          </div>
        );
      });

  if (followUpQuestionsRequestStatus === 'FAILURE') {
    return <AppStatus status="error" isEmbed />;
  }

  return (
    <>
      {props.validQuestionEvent &&
        renderQuestionList(
          questions.filter((question) => !question.parent_question_id)
        )}
    </>
  );
};

export default ConditionalFieldsForm;
