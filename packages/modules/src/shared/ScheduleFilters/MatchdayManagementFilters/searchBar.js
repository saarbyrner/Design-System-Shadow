// @flow
import { breakPoints } from '@kitman/common/src/variables';
import { InputText } from '@kitman/components';
import { filtersStyle } from '@kitman/modules/src/LeagueOperations/technicalDebt/components/CommonGridStyle';

const style = {
  ...filtersStyle,
  noMargin: {
    '.inputText': {
      width: '100%',
    },
    [`@media (max-width: ${breakPoints.desktop})`]: {
      marginBottom: '0',
    },
  },
};

const SearchBar = ({
  placeholder,
  onChange,
  value,
  inputType,
}: {
  value: string,
  placeholder: string,
  onChange: (?string | ?number) => void,
  inputType?: string,
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
        inputType={inputType || 'text'}
      />
    </div>
  );
};

export default SearchBar;
