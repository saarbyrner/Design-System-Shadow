// @flow

import type { HumanInputFormElement } from '@kitman/modules/src/HumanInput/types/forms';
import SelectOptions from '@kitman/modules/src/HumanInput/shared/components/InputElements/Select/components/SelectOptions';
import { BaseAnswerTranslated as BaseAnswer } from '@kitman/modules/src/HumanInput/shared/components/InputElements/Answer/components/BaseAnswer';

type Props = {
  element: HumanInputFormElement,
  value?: string | boolean,
};

const SelectAnswer = ({ element, value = '-' }: Props) => {
  return (
    <SelectOptions element={element}>
      {({ selectOptions }) => {
        if (Array.isArray(value) && value.length > 0) {
          const options = selectOptions.filter((selectOption) =>
            value.includes(selectOption?.value)
          );

          return (
            <BaseAnswer
              text={element.config.text}
              value={options.map((opt) => opt.label).join(', ')}
            />
          );
        }

        if (!Array.isArray(value) && value !== '-') {
          const option = selectOptions.find(
            (selectOption) => selectOption.value === value.toString()
          );

          return (
            <BaseAnswer text={element.config.text} value={option?.label} />
          );
        }

        return <BaseAnswer text={element.config.text} />;
      }}
    </SelectOptions>
  );
};

export default SelectAnswer;
