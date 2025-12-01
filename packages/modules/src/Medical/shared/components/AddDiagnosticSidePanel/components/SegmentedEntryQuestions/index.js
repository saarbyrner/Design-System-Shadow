// @flow
import { SegmentedControl } from '@kitman/components';
import { colors } from '@kitman/common/src/variables';
import type { DiagnosticTypeQuestion } from '../../hooks/useDiagnosticForm';

const SegmentedEntryQuestions = ({
  question,
  questionLabel,
  askOnEntryIndex,
  choiceValue,
  choiceOnChange,
  invalid,
}: {
  question: DiagnosticTypeQuestion,
  questionLabel: string,
  askOnEntryIndex: number,
  choiceValue: number | null,
  choiceOnChange: Function,
  invalid?: boolean,
}) => {
  const sortedChoices = [...question.diagnostic_type_question_choices]
    .sort((a, b) => a.id - b.id)
    .map(({ id: value, name }) => {
      return { value, name };
    });

  return (
    <SegmentedControl
      label={questionLabel}
      buttons={sortedChoices}
      selectedButton={choiceValue}
      questionType={question.question_type}
      onClickButton={(value) => {
        const optionalText = question.diagnostic_type_question_choices.find(
          (choice) => choice.id === value
        )?.optional_text;

        choiceOnChange({ value, optionalText });
      }}
      color={colors.grey_200}
      isSeparated={askOnEntryIndex === 0}
      optional={!question.required}
      invalid={invalid}
    />
  );
};

export default SegmentedEntryQuestions;
