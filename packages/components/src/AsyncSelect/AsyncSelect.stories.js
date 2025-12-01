// @flow
import { useState } from 'react';
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';
import AsyncSelect from '.';

const filterColors = (inputValue: string) => {
  return inputValue.length > 3
    ? [
        { value: 'value 1', label: 'value 1' },
        { value: 'value 2', label: 'value 2' },
        { value: 'value 3', label: 'value 3' },
        { value: 'value 4', label: 'value 4' },
        { value: 'value 5', label: 'value 5' },
        { value: 'value 6', label: 'value 6' },
        { value: 'value 7', label: 'value 7' },
        { value: 'value 8', label: 'value 8' },
        { value: 'value 9', label: 'value 9' },
      ].filter((i) => i.label.toLowerCase().includes(inputValue.toLowerCase()))
    : [];
};

const loadOptions = (inputValue: string, callback: Function) => {
  setTimeout(() => {
    callback(filterColors(inputValue));
  }, 1000);
};

export const Basic = (inputArgs: Object) => {
  const [value, setValue] = useState(null);

  return (
    <div
      css={css`
        display: flex;
      `}
    >
      <div
        css={css`
          flex: 1;
          max-width: 50%;
        `}
      >
        <AsyncSelect
          label={inputArgs.label}
          placeholder={inputArgs.placeholder}
          value={value}
          onChange={(selectedValue) => setValue(selectedValue)}
          loadOptions={loadOptions}
        />
      </div>

      {inputArgs['Show value'] && (
        <pre
          css={css`
            margin: 20px 10px;
            background-color: ${colors.neutral_200};
            color: ${colors.grey_400};
            padding: 10px;
            border-radius: 8px;
            flex: 1;
            max-height: 80vh;
            overflow: auto;
          `}
        >
          {value ? JSON.stringify(value, null, 2) : ''}
        </pre>
      )}
    </div>
  );
};

Basic.args = {
  label: 'Codes',
  placeholder: 'Search body part, body area, injury type...',
  minimumLetters: 3,
};

export default {
  title: 'Form Components/AsyncSelect',
  component: AsyncSelect,
  argTypes: {
    label: {
      control: { type: 'text' },
    },
    placeholder: {
      control: { type: 'text' },
    },
    minimumLetters: {
      control: { type: 'number' },
    },
  },
};
