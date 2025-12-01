// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';
import type { Question } from '@kitman/common/src/types/Issues';
import PresentationViewItem from '@kitman/modules/src/Medical/shared/components/PresentationViewItem';

type Props = {
  conditionalFields: Array<Question>,
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

const PresentationView = (props: Props) => {
  const renderQuestionList = (questionsList) =>
    questionsList
      .sort((a, b) => a.order - b.order)
      .map((question) => {
        const followUpQuestions = props.conditionalFields.filter(
          (q) => q.parent_question_id === question.id
        );

        return (
          <li
            key={question.id}
            css={!question.parent_question_id ? [style.rootQuestion] : []}
          >
            <PresentationViewItem
              label={question.question}
              value={question.answer?.value}
              highlightEmptyFields={props.highlightEmptyQuestions}
            />
            {followUpQuestions.length > 0 && (
              <ul css={style.followUpQuestion}>
                {renderQuestionList(followUpQuestions)}
              </ul>
            )}
          </li>
        );
      });

  return (
    <ul css={style.questionsList}>
      {renderQuestionList(
        props.conditionalFields.filter(
          (question) => !question.parent_question_id
        )
      )}
    </ul>
  );
};

export default PresentationView;
