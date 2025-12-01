// @flow
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Fragment, type ComponentType } from 'react';

import {
  InputTextField,
  SegmentedControl,
  Select,
  TextButton,
} from '@kitman/components';
import { colors } from '@kitman/common/src/variables';
import type { I18nProps } from '@kitman/common/src/types/i18n';

import {
  selectValidationStatus,
  selectFlattenedNames,
} from '@kitman/modules/src/ConditionalFields/shared/redux/selectors/conditionBuildView';
import type { ValidationStatus } from '@kitman/modules/src/ConditionalFields/shared/redux/slices/conditionBuildViewSlice';
import { stringAppearsTwice } from '@kitman/modules/src/ConditionalFields/shared/utils';

import {
  onUpdateFollowupQuestion,
  onUpdateFollowupQuestionMetaData,
  onAddFollowupQuestionMetaData,
  onUpdateFollowupTrigger,
  onAddFollowupQuestion,
} from '../../../../../../shared/redux/slices/conditionBuildViewSlice';

import { FollowupQuestionHeaderTranslated as FollowupQuestionHeader } from '../FollowupHeader';

import styles from '../../../VersionBuildViewTab/styles';

import type {
  ActiveQuestion,
  QuestionMetaDataForMultipleChoice,
} from '../../../../../../shared/types';

type Props = {
  question: ActiveQuestion,
  index: number,
  options: QuestionMetaDataForMultipleChoice,
  isPublished: boolean,
  parentQuestion: string,
  parentQuestionNumbering: string,
};

const FollowupQuestion = ({
  question,
  index,
  options,
  isPublished,
  parentQuestion,
  parentQuestionNumbering,
  t,
}: I18nProps<Props>) => {
  const dispatch = useDispatch();

  const activeConditionValidationStatus: ValidationStatus = useSelector(
    selectValidationStatus
  );

  const flattenedNamesList: Array<string> = useSelector(selectFlattenedNames);

  // the questionNumbering is a string like "1.1.1.1" and the first number is the main question,
  // so we need count the followup questions without counting the main question
  const followupQuestionLevel =
    question.questionNumbering.split('.').length - 1;

  return (
    <Fragment>
      <FollowupQuestionHeader
        order={index + 1}
        parentQuestion={parentQuestion}
        parentQuestionNumbering={parentQuestionNumbering}
      />
      <div css={styles.followupQuestion}>
        <div css={styles.questionFormRow1}>
          <h6>
            {t('Question')} {question.questionNumbering}
          </h6>
          <InputTextField
            label={t('Question name')}
            value={question?.name ?? ''}
            onChange={({ target }) => {
              dispatch(
                onUpdateFollowupQuestion({
                  key: 'name',
                  value: target.value,
                  questionNumbering: question.questionNumbering,
                })
              );
            }}
            disabled={false} // todo: figure out what i want here
            invalid={
              activeConditionValidationStatus === 'PENDING' &&
              (!question?.name ||
                stringAppearsTwice(flattenedNamesList, question?.name))
            }
            displayValidationText
            customValidationText={
              stringAppearsTwice(flattenedNamesList, question?.name)
                ? t('Question name must be unique')
                : t('Question name is required')
            }
            kitmanDesignSystem
          />
          <div>
            <Select
              label={t('Trigger')}
              options={
                options.map((option) => ({ ...option, label: option.value })) ||
                []
              }
              value={question?.trigger_value ?? null}
              onChange={(value) => {
                dispatch(
                  onUpdateFollowupTrigger({
                    questionNumbering: question.questionNumbering,
                    value,
                  })
                );
              }}
              isDisabled={false}
              invalid={
                activeConditionValidationStatus === 'PENDING' &&
                !question?.trigger_value
              }
              displayValidationText
            />
          </div>
        </div>
        <div css={[styles.questionFormRow2, styles.columnSpan2]}>
          <SegmentedControl
            label={t('Question type')}
            buttons={[
              { name: t('Multiple choice'), value: 'multiple-choice' },
              { name: t('Open question'), value: 'free-text' },
              { name: t('Date'), value: 'date' },
            ]}
            width="inline"
            onClickButton={(value) => {
              dispatch(
                onUpdateFollowupQuestion({
                  key: 'question_type',
                  value,
                  questionNumbering: question.questionNumbering,
                })
              );
            }}
            isSeparated
            color={colors.grey_200}
            selectedButton={question?.question_type}
            isDisabled={false}
            invalid={
              activeConditionValidationStatus === 'PENDING' &&
              !question?.question_type
            }
            displayValidationText
          />
        </div>
        <div css={styles.questionFormRow3}>
          <InputTextField
            label={t('Question')}
            value={question?.question || ''}
            onChange={({ target }) => {
              dispatch(
                onUpdateFollowupQuestion({
                  key: 'question',
                  value: target.value,
                  questionNumbering: question.questionNumbering,
                })
              );
            }}
            disabled={false} // todo: figure out what i want here
            invalid={
              activeConditionValidationStatus === 'PENDING' &&
              !question?.question
            } // TODO: figure out what I want here
            kitmanDesignSystem
            displayValidationText
          />
        </div>
        <div css={styles.questionFormRow4}>
          {(question.question_type === 'multiple-choice' ||
            question.question_type === 'boolean') && (
            <div css={styles.questionOptionContainer}>
              {question?.question_options?.map((option) => (
                <div
                  key={`option_${option.order}`}
                  css={styles.questionOptionItem}
                >
                  <InputTextField
                    label={`Option ${option.order}`}
                    value={option.value}
                    onChange={({ target }) => {
                      dispatch(
                        onUpdateFollowupQuestionMetaData({
                          order: option.order,
                          value: target.value,
                          questionNumbering: question.questionNumbering,
                        })
                      );
                    }}
                    disabled={false} // todo: figure out what i want here
                    invalid={
                      activeConditionValidationStatus === 'PENDING' &&
                      (!option?.value ||
                        stringAppearsTwice(
                          question?.question_options.map(({ value }) => value),
                          option?.value
                        ))
                    }
                    customValidationText={
                      stringAppearsTwice(
                        question?.question_options.map(({ value }) => value),
                        option?.value
                      )
                        ? t('Options  must be unique')
                        : t('Option is required')
                    }
                    displayValidationText
                    kitmanDesignSystem
                  />
                </div>
              ))}
              <div css={styles.addMetaDataOptionButton}>
                <TextButton
                  text={t('+ option')}
                  onClick={() => {
                    dispatch(
                      onAddFollowupQuestionMetaData({
                        questionNumbering: question.questionNumbering,
                      })
                    );
                  }}
                  disabled={false} // todo: figure out what i want here
                  type="subtle"
                  kitmanDesignSystem
                />
              </div>
            </div>
          )}
          {question.question_type === 'date' && (
            <p css={styles.dateTextPrompt}>
              {t('A date selector will show when answering')}
            </p>
          )}
        </div>
        {question.question_type === 'multiple-choice' &&
          !isPublished &&
          followupQuestionLevel <= 3 && (
            <div css={styles.questionFormRow6}>
              <TextButton
                text={t('+ follow-up')}
                onClick={() => {
                  dispatch(
                    onAddFollowupQuestion({
                      questionNumbering: question.questionNumbering,
                    })
                  );
                }}
                disabled={isPublished}
                type="primary"
                kitmanDesignSystem
              />
            </div>
          )}
      </div>
      <hr css={styles.hr} />
      {Boolean(question.children.length) && (
        <div css={styles.questionFormRow5}>
          {question.children.map((followupQuestion, i) => {
            return (
              <FollowupQuestion
                key={`${followupQuestion.questionNumbering}`}
                options={question?.question_options || []}
                question={followupQuestion}
                index={i}
                isPublished={isPublished}
                parentQuestion={question?.question}
                questionNumbering={followupQuestion.questionNumbering}
                parentQuestionNumbering={question.questionNumbering}
                t={t}
              />
            );
          })}
        </div>
      )}
    </Fragment>
  );
};

export const FollowupQuestionTranslated: ComponentType<Props> =
  withNamespaces()(FollowupQuestion);

export default FollowupQuestion;
