// @flow
import { Select } from '@kitman/components';
import type { Validation } from '@kitman/common/src/types';
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';
import { useGetInternationalPhonePrefixesQuery } from '../redux/services/emergencyContactsApi';

type Props = {
  selectedCountry: string, // Country code e.g. IE
  isClearable: boolean,
  onBlur?: Function,
  errors?: Array<Validation>,
  onChange: Function,
  isDisabled: boolean,
};

const style = {
  wrapper: css`
    position: relative;
  `,
  error: css`
    bottom: -18px;
    color: ${colors.red_100};
    left: 0;
    position: absolute;
    font-size: 12px;
    font-weight: 600;
    line-height: 16px;

    .icon-validation-error::before {
      position: relative;
      font-size: 16px;
      top: 2px;
    }
  `,
};

const PhoneCountryPrefixSelector = (props: Props) => {
  const { data: selectOptions = [], isLoading } =
    useGetInternationalPhonePrefixesQuery();

  return (
    <div css={style.wrapper}>
      <Select
        invalid={props.errors && props.errors.length > 0}
        onChange={(id) => {
          props.onChange(id);
        }}
        onBlur={() => props?.onBlur && props.onBlur()}
        isLoading={!selectOptions || isLoading}
        options={selectOptions ?? []}
        value={props.selectedCountry}
        isClearable={props.isClearable}
        onClear={() => {
          props.onChange('');
        }}
        showAutoWidthDropdown
        isDisabled={props.isDisabled}
      />
      {props.errors && props.errors.length > 0 && (
        <span css={style.error}>
          <i className="icon-validation-error" />
          {props.errors.map((error) => error.message).join(' ')}
        </span>
      )}
    </div>
  );
};

export default PhoneCountryPrefixSelector;
