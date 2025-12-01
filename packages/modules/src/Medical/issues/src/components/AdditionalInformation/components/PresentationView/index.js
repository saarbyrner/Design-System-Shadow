// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';
import PresentationViewItem from '@kitman/modules/src/Medical/shared/components/PresentationViewItem';

import type {
  ConditionWithQuestions,
  ConditionalFieldAnswer,
} from '@kitman/modules/src/ConditionalFields/shared/types';

type Props = {
  conditionalFields: Array<ConditionWithQuestions>,
  conditionalFieldsAnswers: Array<ConditionalFieldAnswer>,
  highlightEmptyQuestions: boolean,
};

const style = {
  questionsList: css`
    display: block;
    color: ${colors.grey_200};
    margin-bottom: 0;
    margin-top: 12px;
    list-style: none;
    padding: 0;
    li {
      line-height: 16px;
    }
  `,
  rootQuestion: css`
    display: block;
    background-color: ${colors.background};
    border-bottom: 2px solid ${colors.neutral_300};
    border-top: 2px solid ${colors.neutral_300};
    color: ${colors.grey_200};
    margin-bottom: 16px;
    padding: 18px 16px;
    &:last-of-type {
      margin-bottom: 0px;
    }
  `,
  followUpQuestion: css`
    list-style: none;
    padding-left: 16px;
    margin-top: 16px;
  `,
};

const PresentationViewV2 = (props: Props) => {
  const renderQuestionList = (questionsList) =>
    questionsList.slice().map(({ question, children }) => {
      const answers = props.conditionalFieldsAnswers?.find((answer) => {
        return answer.question_id === question.id;
      })?.answers;

      return (
        <li
          key={question.id}
          css={!question.parent_question_id ? [style.rootQuestion] : []}
        >
          {answers &&
            answers.map(({ value }) => {
              return (
                <PresentationViewItem
                  label={question.question}
                  value={value}
                  highlightEmptyFields={props.highlightEmptyQuestions}
                  key={question.id}
                />
              );
            })}
          {!answers && (
            <PresentationViewItem
              label={question.question}
              value=""
              highlightEmptyFields={props.highlightEmptyQuestions}
            />
          )}

          {children.length > 0 && (
            <ul css={style.followUpQuestion}>
              {renderQuestionList(
                children
                  .filter((child) => {
                    return !!answers?.find(
                      ({ value }) => value === child.question.trigger_value
                    );
                  })
                  .map((child) => ({
                    ...child,
                    question: {
                      ...child.question,
                      parent_question_id: question.id,
                    },
                  }))
              )}
            </ul>
          )}
        </li>
      );
    });

  return (
    <ul css={style.questionsList}>
      {props.conditionalFields.map((rule) => {
        return renderQuestionList(rule.questions);
      })}
    </ul>
  );
};

export default PresentationViewV2;
