// @flow
import React from 'react';
import style from './style';
import type {
  QuestionGroup,
  QuestionAndAnswer,
} from '../../types/medical/QuestionTypes';
import InlineAttachmentDisplay from './InlineAttachmentDisplay';

type Props = {
  group: QuestionGroup,
};

const getGroupCss = (group: QuestionGroup, isChildGroup: boolean) => {
  if (!group.isGroupInData) {
    return style.sectionElement;
  }

  if (isChildGroup) {
    return group.isConditional
      ? style.conditionalChildGroupRow
      : style.childGroupRow;
  }

  return group.isConditional ? style.conditionalGroupRow : style.plainGroupRow;
};

const renderGroup = (group: QuestionGroup, isChildGroup: boolean) => {
  return (
    <React.Fragment key={`${group.id}_${group.repeatableAnswerIndex || 0}`}>
      {group.title && (
        <div css={isChildGroup ? style.childGroupTitle : style.groupTitle}>
          <h3
            className="kitmanHeading--L3"
            data-testid="QuestionGroupDisplay|Title"
          >
            {group.title}
          </h3>
        </div>
      )}
      <div css={getGroupCss(group, isChildGroup)}>
        {
          // eslint-disable-next-line no-use-before-define
          renderQuestions(group)
        }
      </div>
    </React.Fragment>
  );
};

const renderAnswer = (questionAndAnswer: QuestionAndAnswer) => {
  if (!questionAndAnswer.answer) {
    return '-';
  }

  if (
    questionAndAnswer.renderConfig &&
    questionAndAnswer.renderConfig.renderAs === 'color'
  ) {
    const colorValue =
      questionAndAnswer.renderConfig.valueMap[questionAndAnswer.answer];
    return colorValue ? (
      <span css={style.rangeAnswer}>
        <span>{questionAndAnswer.answer} : </span>
        <div
          data-testid="QuestionGroupDisplay|AnswerRangeColor"
          css={style.colorAnswer}
          style={{ backgroundColor: colorValue }}
        />
      </span>
    ) : (
      questionAndAnswer.answer
    );
  }

  return questionAndAnswer.answer;
};

const renderQuestions = (group: QuestionGroup) => {
  const groupColumns = group.columns != null ? group.columns : 2;
  const widthPercentage = `${100 / groupColumns}%`;
  const gap = `${16 * (groupColumns - 1)}px`;
  const questionAndAnswerStyle = {
    '--group-width-percentage': widthPercentage,
    '--group-gap': gap,
  };

  return group.questionsAndAnswers.map((questionAndAnswer) => {
    switch (questionAndAnswer.type) {
      case 'attachment':
        return (
          <div style={{ width: '100%' }}>
            <InlineAttachmentDisplay
              key={questionAndAnswer.id}
              inlineAttachment={questionAndAnswer}
            />
          </div>
        );
      case 'questionAndAnswer':
      case 'descriptionContent':
        return (
          <div
            css={questionAndAnswerStyle}
            key={`question_${questionAndAnswer.id}`}
            data-testid="QuestionGroupDisplay|QuestionAndAnswer"
          >
            <div>
              <span
                css={style.question}
                data-testid="QuestionGroupDisplay|Question"
              >
                {questionAndAnswer.question}
              </span>
              {questionAndAnswer.type !== 'descriptionContent' && (
                <span
                  css={style.answer}
                  data-testid="QuestionGroupDisplay|Answer"
                >
                  {renderAnswer(questionAndAnswer)}
                </span>
              )}
            </div>
          </div>
        );
      case 'group': {
        return renderGroup(questionAndAnswer, true);
      }
      default:
        return null;
    }
  });
};

const QuestionGroupDisplay = (props: Props) => {
  return renderGroup(props.group, false);
};

export default QuestionGroupDisplay;
