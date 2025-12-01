// @flow
import { useState } from 'react';
import { css } from '@emotion/react';
import { breakPoints } from '@kitman/common/src/variables';
import { TextField } from '@kitman/playbook/components';
import { InputText } from '@kitman/components';

const style = {
  filter: css`
    @media (min-width: ${breakPoints.desktop}) {
      min-width: 180px;

      .inputText {
        width: 240px;
      }
    }

    @media (max-width: ${breakPoints.desktop}) {
      display: block;
      margin-bottom: 10px;
      width: 100%;
    }
  `,
  noMargin: css`
    .inputText {
      width: 100%;
    }
    @media (max-width: ${breakPoints.desktop}) {
      margin-bottom: 0;
    }
  `,
};

type Props = {
  placeholder: string,
  onValidation: Function,
};

export const SearchBar = ({
  placeholder,
  onChange,
  value,
}: {
  value: string,
  placeholder: string,
  onChange: Function,
}) => {
  return (
    <div css={[style.filter, style.noMargin]}>
      <InputText
        kitmanDesignSystem
        onValidation={({ value: newValue }) => {
          onChange(newValue);
        }}
        placeholder={placeholder}
        searchIcon
        value={value}
      />
    </div>
  );
};

const SearchBarFilter = ({ placeholder, onValidation }: Props) => {
  const [searchValue, setSearchValue] = useState<string>('');

  return (
    <div css={style.filter}>
      <InputText
        kitmanDesignSystem
        onValidation={({ value }) => {
          setSearchValue(value);
          onValidation(value);
        }}
        placeholder={placeholder}
        searchIcon
        value={searchValue}
      />
    </div>
  );
};

export const SearchBarFilterMui = ({ placeholder, onValidation }: Props) => {
  const [searchValue, setSearchValue] = useState<string>('');

  return (
    <TextField
      placeholder={placeholder}
      value={searchValue}
      onChange={(event) => {
        const textValue = event.target.value;
        setSearchValue(textValue);
        onValidation(textValue);
      }}
      sx={{ width: '17rem' }}
    />
  );
};

export default SearchBarFilter;