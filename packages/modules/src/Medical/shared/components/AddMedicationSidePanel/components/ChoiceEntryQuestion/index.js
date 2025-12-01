// @flow
import { Select } from '@kitman/components';
import type { SelectOption as Option } from '@kitman/components/src/types';
import styles from '../../styles';
import OptionalInput from './OptionalInput';

type Props = {
  choiceOnChange: Function,
  choiceValue: string,
  isSelectDisabled: boolean,
  isSelectInvalid: boolean,
  isOptionalTextInvalid: boolean,
  choiceLabel: string,
  optionalTextInputOnChange: Function,
  optionalTextInputValue: string,
  optionalTextLabel: string,
  choiceOptions: Array<Option>,
  renderOptionalTextField: boolean | null,
};

const ChoiceEntryQuestion = ({
  choiceOnChange,
  choiceValue,
  isSelectInvalid,
  isSelectDisabled,
  isOptionalTextInvalid,
  choiceLabel,
  optionalTextInputOnChange,
  optionalTextInputValue,
  optionalTextLabel,
  choiceOptions,
  renderOptionalTextField,
}: Props) => {
  return (
    <div css={[styles.questionWithOptionalTextContainer]}>
      <div css={[styles.askOnEntryQuestion]}>
        <Select
          label={choiceLabel}
          value={choiceValue}
          onChange={(option) => choiceOnChange(option)}
          options={choiceOptions}
          returnObject
          appendToBody
          isDisabled={isSelectDisabled}
          invalid={isSelectInvalid}
        />
      </div>
      {renderOptionalTextField && (
        <div css={[styles.askOnEntryOptionalText]}>
          <OptionalInput
            optionalTextLabel={optionalTextLabel}
            value={optionalTextInputValue}
            inputOnChange={(e) => {
              optionalTextInputOnChange(e);
            }}
            invalid={isOptionalTextInvalid}
            isDisabled={isSelectDisabled}
          />
        </div>
      )}
    </div>
  );
};

export default ChoiceEntryQuestion;
