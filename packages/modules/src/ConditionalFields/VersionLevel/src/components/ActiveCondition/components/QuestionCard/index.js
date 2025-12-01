// @flow
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Fragment, type ComponentType } from 'react';

import {
  InputTextField,
  SegmentedControl,
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
import type { RequiredFieldsAndValues } from '@kitman/modules/src/ConditionalFields/shared/types';

import {
  onUpdateActiveConditionQuestions,
  onUpdateQuestionMetaData,
  onAddQuestionMetaData,
  onAddFollowupQuestion,
} from '../../../../../../shared/redux/slices/conditionBuildViewSlice';

import { FollowupQuestionTranslated as FollowupQuestion } from '../FollowupQuestion';
import styles from '../../../VersionBuildViewTab/styles';

import type { ActiveQuestion } from '../../../../../../shared/types';

type Props = {
  question: ActiveQuestion,
  index: number,
  isPublished: boolean,
  setRequiredFieldsAndValues: (
    value:
      | RequiredFieldsAndValues
      | ((prev: RequiredFieldsAndValues) => RequiredFieldsAndValues)
  ) => void,
};

const QuestionCard = ({
  t,
  question,
  index,
  isPublished,
  setRequiredFieldsAndValues,
}: I18nProps<Props>) => {
  const dispatch = useDispatch();

  const activeConditionValidationStatus: ValidationStatus = useSelector(
    selectValidationStatus
  );

  const flattenedNamesList: Array<string> = useSelector(selectFlattenedNames);

  return (
    <div css={styles.conditionForm}>
      <div css={styles.questionFormRow1}>
        <InputTextField
          label={t('Question name')}
          value={question?.name ?? ''}
          onChange={({ target }) => {
            dispatch(
              onUpdateActiveConditionQuestions({
                key: 'name',
                index,
                value: target.value,
              })
            );
            setRequiredFieldsAndValues((prev) => {
              return { ...prev, questionName: !!target.value };
            });
          }}
          disabled={isPublished}
          invalid={
            activeConditionValidationStatus === 'PENDING' &&
            (!question?.name ||
              stringAppearsTwice(flattenedNamesList, question?.name))
          }
          kitmanDesignSystem
          displayValidationText
          customValidationText={
            stringAppearsTwice(flattenedNamesList, question?.name)
              ? t('Question name must be unique')
              : t('Question name is required')
          }
        />
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
              onUpdateActiveConditionQuestions({
                key: 'question_type',
                index,
                value,
              })
            );
            setRequiredFieldsAndValues((prev) => {
              return { ...prev, questionType: !!value };
            });
          }}
          isSeparated
          color={colors.grey_200}
          selectedButton={question?.question_type}
          isDisabled={isPublished}
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
              onUpdateActiveConditionQuestions({
                key: 'question',
                index,
                value: target.value,
              })
            );
            setRequiredFieldsAndValues((prev) => {
              return { ...prev, question: !!target.value };
            });
          }}
          disabled={isPublished}
          invalid={
            activeConditionValidationStatus === 'PENDING' && !question?.question
          }
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
                      onUpdateQuestionMetaData({
                        order: option.order,
                        index,
                        value: target.value,
                      })
                    );
                  }}
                  disabled={isPublished}
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
                  kitmanDesignSystem
                  displayValidationText
                />
              </div>
            ))}
            <div css={styles.addMetaDataOptionButton}>
              <TextButton
                text={t('+ option')}
                onClick={() => {
                  dispatch(onAddQuestionMetaData({ index }));
                }}
                disabled={isPublished}
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
      {!!question?.children?.length && (
        <div css={styles.questionFormRow5}>
          {question.children.map((followupQuestion, i) => {
            return (
              <Fragment key={`${followupQuestion.questionNumbering}`}>
                <FollowupQuestion
                  options={question?.question_options || []}
                  question={followupQuestion}
                  index={i}
                  isPublished={isPublished}
                  parentQuestion={question?.question}
                  questionNumbering={followupQuestion.questionNumbering}
                  parentQuestionNumbering={question.questionNumbering}
                />
              </Fragment>
            );
          })}
        </div>
      )}
      {question.question_type === 'multiple-choice' && !isPublished && (
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
  );
};

export const QuestionCardTranslated: ComponentType<Props> =
  withNamespaces()(QuestionCard);

export default QuestionCard;
