// @flow
import type { Ref } from 'react';

type Props = {
  icon: string,
  ignoreValidation: boolean,
  placeholder: string,
  onChange: Function,
  value: string,
  disabled?: boolean,
  inputRef?: ?Ref<'input'>,
};

export default function SearchBar(props: Props) {
  return (
    <div role="search">
      <span className={`searchBar__icon ${props.icon.toString()}`} role="img" />
      <input
        ref={props.inputRef}
        type="text"
        className="searchBar__input km-input-control"
        data-ignore-validation={props.ignoreValidation}
        placeholder={props.placeholder}
        onChange={props.onChange}
        value={props.value}
        disabled={props.disabled}
      />
    </div>
  );
}

SearchBar.defaultProps = {
  icon: 'icon-search',
  ignoreValidation: true,
  placeholder: '',
  value: '',
};
