/* eslint-disable react/no-array-index-key */
// @flow
import { withNamespaces } from 'react-i18next';
import type { ComponentType } from 'react';
import { DatePicker, InputTextField } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import ChoiceEntryQuestion from '../ChoiceEntryQuestion';
import SegmentedEntryQuestions from '../SegmentedEntryQuestions';
import style from '../../styles';
import type {
  DiagnosticTypeQuestion,
  FormState,
} from '../../hooks/useDiagnosticForm';

type Props = {
  questions: Array<DiagnosticTypeQuestion>,
  index: number,
  formState: FormState,
  choiceOnChange: Function,
  optionalTextInputOnChange: Function,
  isValidationCheckAllowed: boolean,
};

const AskOnEntryComponent = ({
  questions,
  index,
  formState,
  choiceOnChange,
  optionalTextInputOnChange,
  isValidationCheckAllowed,
  t,
}: I18nProps<Props>) => {
  return (
    <div css={[style.askOnEntryQuestionsContainer, style.gridRow3]}>
      {questions.map((question, askOnEntryIndex) => {
        switch (question.question_type) {
          case 'text': {
            return (
              <div
                key={`${question.label}_${askOnEntryIndex}`}
                css={[style.askOnEntryQuestion]}
              >
                <InputTextField
                  label={t(question.label)}
                  value={
                    (typeof formState?.queuedDiagnostics[index]?.answers[
                      askOnEntryIndex
                    ]?.value === 'string' &&
                      formState?.queuedDiagnostics[index]?.answers[
                        askOnEntryIndex
                      ]?.value) ||
                    ''
                  }
                  onChange={(e) => {
                    choiceOnChange({
                      option: {
                        askOnEntryIndex,
                        question,
                        value: e.target.value,
                        questionType: question.question_type,
                      },
                    });
                  }}
                  // disabled={requestStatus === 'PENDING'}
                  invalid={
                    isValidationCheckAllowed &&
                    formState?.queuedDiagnostics[index]?.answers[
                      askOnEntryIndex
                    ]?.required &&
                    !formState.queuedDiagnostics[index].answers[askOnEntryIndex]
                      .value
                  }
                  kitmanDesignSystem
                  optional={!question.required}
                />
              </div>
            );
          }

          case 'choice': {
            return (
              <div
                css={[style.questionWithOptionalTextContainer]}
                key={`${question.label}_${askOnEntryIndex}`}
              >
                <ChoiceEntryQuestion
                  question={question}
                  questionLabel={question.label}
                  index={index}
                  askOnEntryIndex={askOnEntryIndex}
                  renderOptionalTextField={
                    formState?.queuedDiagnostics[index]?.answers[
                      askOnEntryIndex
                    ]?.optionalTextRequired
                  }
                  choiceValue={
                    (typeof formState?.queuedDiagnostics[index]?.answers[
                      askOnEntryIndex
                    ]?.value === 'number' &&
                      formState?.queuedDiagnostics[index]?.answers[
                        askOnEntryIndex
                      ]?.value) ||
                    null
                  }
                  questionType={question.question_type}
                  choiceOnChange={(option) => {
                    choiceOnChange({
                      option,
                      question,
                      askOnEntryIndex,
                    });
                  }}
                  optionalTextInputValue={
                    formState?.queuedDiagnostics[index]?.answers[
                      askOnEntryIndex
                    ]?.optionalText || ''
                  }
                  optionalTextLabel={
                    formState?.queuedDiagnostics[index]?.answers[
                      askOnEntryIndex
                    ]?.label || ''
                  }
                  optionalTextInputOnChange={(e) =>
                    optionalTextInputOnChange({ e, askOnEntryIndex, question })
                  }
                  isSelectInvalid={
                    isValidationCheckAllowed &&
                    formState?.queuedDiagnostics[index]?.answers[
                      askOnEntryIndex
                    ]?.required &&
                    !formState.queuedDiagnostics[index].answers[askOnEntryIndex]
                      .value
                  }
                  isOptionalTextInvalid={
                    isValidationCheckAllowed &&
                    typeof formState?.queuedDiagnostics[index]?.answers[
                      askOnEntryIndex
                    ]?.optionalTextRequired === 'boolean' &&
                    formState?.queuedDiagnostics[index]?.answers[
                      askOnEntryIndex
                    ]?.optionalTextRequired &&
                    !formState.queuedDiagnostics[index].answers[askOnEntryIndex]
                      .optionalText
                  }
                />
              </div>
            );
          }

          case 'datetime': {
            return (
              <div
                key={`${question.label}_${askOnEntryIndex}`}
                css={[
                  askOnEntryIndex === 2
                    ? style.cardiacSegment
                    : style.askOnEntryQuestion,
                ]}
              >
                <DatePicker
                  label={t(question.label)}
                  onDateChange={(date) => {
                    choiceOnChange({
                      option: {
                        askOnEntryIndex,
                        question,
                        value: date,
                        questionType: question.question_type,
                      },
                    });
                  }}
                  value={
                    formState?.queuedDiagnostics[index]?.answers[
                      askOnEntryIndex
                    ]?.value || null
                  }
                  invalid={
                    isValidationCheckAllowed &&
                    formState.queuedDiagnostics[index]?.answers[askOnEntryIndex]
                      ?.required &&
                    !formState?.queuedDiagnostics[index]?.answers[
                      askOnEntryIndex
                    ]?.value
                  }
                  maxDate={null}
                  minDate={null}
                  kitmanDesignSystem
                  optional={!question.required}
                />
              </div>
            );
          }

          case 'segmented_choice': {
            return (
              <div
                css={askOnEntryIndex === 0 ? style.cardiacSegment : style.type}
                key={`${question.label}_${askOnEntryIndex}`}
              >
                <SegmentedEntryQuestions
                  question={question}
                  questionLabel={question.label}
                  askOnEntryIndex={askOnEntryIndex}
                  choiceValue={
                    typeof formState?.queuedDiagnostics[index]?.answers[
                      askOnEntryIndex
                    ]?.value === 'number'
                      ? formState?.queuedDiagnostics[index]?.answers[
                          askOnEntryIndex
                        ]?.value
                      : null
                  }
                  choiceOnChange={(option) => {
                    choiceOnChange({
                      option: {
                        askOnEntryIndex,
                        question,
                        value: option.value,
                        optionalTextRequired: option.optionalText,
                        questionType: question.question_type,
                      },
                    });
                  }}
                  invalid={
                    isValidationCheckAllowed &&
                    formState.queuedDiagnostics[index]?.answers[askOnEntryIndex]
                      ?.required &&
                    !formState?.queuedDiagnostics[index]?.answers[
                      askOnEntryIndex
                    ]?.value
                  }
                />
              </div>
            );
          }

          default:
            return null;
        }
      })}
    </div>
  );
};

export const AskOnEntryComponentTranslated: ComponentType<Props> =
  withNamespaces()(AskOnEntryComponent);

export default AskOnEntryComponent;
