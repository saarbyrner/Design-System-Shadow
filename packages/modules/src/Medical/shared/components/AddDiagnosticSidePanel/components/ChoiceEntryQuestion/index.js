// @flow
import { Select } from '@kitman/components';
import OptionalInput from '../OptionalInput';
import style from '../../styles';
import type { DiagnosticTypeQuestion } from '../../hooks/useDiagnosticForm';

const ChoiceEntryQuestion = ({
  question,
  askOnEntryIndex,
  renderOptionalTextField,
  questionType,
  choiceValue,
  choiceOnChange,
  optionalTextInputValue,
  optionalTextLabel,
  optionalTextInputOnChange,
  isOptionalTextInvalid,
  isSelectInvalid,
  questionLabel,
}: {
  question: DiagnosticTypeQuestion,
  askOnEntryIndex: number,
  renderOptionalTextField: boolean | null,
  choiceValue: number | null,
  questionType: string,
  choiceOnChange: Function,
  optionalTextInputValue: string,
  optionalTextLabel: string,
  optionalTextInputOnChange: Function,
  isOptionalTextInvalid: boolean,
  isSelectInvalid: boolean,
  questionLabel: string,
}) => {
  return (
    <div css={[style.questionWithOptionalTextContainer]}>
      <div css={[style.askOnEntryQuestion]}>
        <Select
          label={questionLabel}
          value={choiceValue}
          onChange={(option) => {
            choiceOnChange({
              ...option,
              question,
              askOnEntryIndex,
              questionType,
            });
          }}
          options={question.diagnostic_type_question_choices.map((choice) => {
            return {
              ...choice,
              value: choice.id,
              label: choice.name,
            };
          })}
          returnObject
          appendToBody
          optional={!question.required}
          invalid={isSelectInvalid}
        />
      </div>
      {renderOptionalTextField && (
        <div
          key={`Optional_text_field_${askOnEntryIndex}`}
          css={[style.askOnEntryOptionalText]}
        >
          <OptionalInput
            askOnEntryIndex={askOnEntryIndex}
            optionalTextLabel={optionalTextLabel}
            value={optionalTextInputValue}
            inputOnChange={(e) => {
              optionalTextInputOnChange(e);
            }}
            invalid={isOptionalTextInvalid}
          />
        </div>
      )}
    </div>
  );
};

export default ChoiceEntryQuestion;
