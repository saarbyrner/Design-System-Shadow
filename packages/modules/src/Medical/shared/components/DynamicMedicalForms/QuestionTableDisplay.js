// @flow
import { useMemo } from 'react';
import { Accordion } from '@kitman/components';
import tableStyle from './tableStyle';
import type { QuestionGroup } from '../../types/medical/QuestionTypes';

type Props = {
  group: QuestionGroup,
  expandTable?: boolean,
};

const QuestionTableDisplay = (props: Props) => {
  const style = useMemo(
    () => tableStyle(props.group.columns || 3),
    [props.group.columns]
  );

  const renderQuestions = () => {
    return props.group.questionsAndAnswers.map((questionAndAnswer) => {
      if (questionAndAnswer.type !== 'questionAndAnswer') {
        return undefined;
      }
      return (
        <div
          css={style.tableQuestionAnswer}
          key={`question_${questionAndAnswer.id}`}
          data-testid="QuestionTableDisplay|QuestionAndAnswer"
        >
          <div css={style.tableQuestionCell}>
            <span
              css={style.tableQuestion}
              data-testid="QuestionTableDisplay|Question"
            >
              {questionAndAnswer.question}
            </span>
            <span
              css={style.tableAnswer}
              data-testid="QuestionTableDisplay|Answer"
            >
              {questionAndAnswer.answer || '-'}
            </span>
          </div>
        </div>
      );
    });
  };

  return (
    <div css={style.table}>
      <Accordion
        title={<div css={style.tableTitle}>{props.group.title}</div>}
        content={<div css={style.tableContent}>{renderQuestions()}</div>}
        iconAlign="left"
        isOpen={props.expandTable}
      />
    </div>
  );
};

export default QuestionTableDisplay;
