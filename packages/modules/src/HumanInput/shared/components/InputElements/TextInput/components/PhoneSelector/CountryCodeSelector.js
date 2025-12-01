// @flow
import type { ComponentType } from 'react';
import { useEffect, useState } from 'react';
import { withNamespaces, setI18n } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { Autocomplete, Box, TextField } from '@kitman/playbook/components';
import { countries } from '@kitman/components/src/PhoneNumberInput/constants';

setI18n(i18n);

type Props = {
  value: string,
  countryISOCode: string,
  onChange: Function,
  disablePortal?: boolean,
  label?: string,
};

const CountryCodeSelector = (props: I18nProps<Props>) => {
  const {
    value,
    countryISOCode,
    onChange,
    disablePortal = false,
    label = '',
    t,
  } = props;
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    if (value) {
      const searchByISOAndPhone = (country) => {
        return country.phone === value && country.code === countryISOCode;
      };

      const searchByPhone = (country) => {
        return country.phone === value;
      };
      const searchOptions = countryISOCode
        ? searchByISOAndPhone
        : searchByPhone;

      const defaultCountryCode = countries.find(searchOptions);

      setSelectedCountry(defaultCountryCode);
    } else {
      setSelectedCountry(null);
    }
  }, [value, countryISOCode]);

  return (
    <Autocomplete
      id="phoneCodeSelector"
      disablePortal={disablePortal}
      options={countries}
      getOptionLabel={(option) => option.phone}
      filterOptions={(options, state) => {
        const filteredOptions = options.filter((option) =>
          `${option.label} ${option.code} ${option.phone}`
            .toLowerCase()
            .includes(state.inputValue.toLowerCase())
        );

        return filteredOptions;
      }}
      onChange={(event, newValue) => {
        onChange(newValue?.phone);
      }}
      value={selectedCountry}
      renderOption={(renderProps, option) => (
        <Box
          {...renderProps}
          component="li"
          sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
          key={`${option.code}-${option.phone}`}
        >
          <img
            loading="lazy"
            width="20"
            srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
            src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
            alt=""
          />
          {option.label} ({option.code}) {option.phone}
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label || t('Country code')}
          inputProps={{
            ...params.inputProps,
            autoComplete: 'new-password',
          }}
          value={selectedCountry}
        />
      )}
      data-testid="autocomplete"
    />
  );
};

export const CountryCodeSelectorTranslated: ComponentType<Props> =
  withNamespaces()(CountryCodeSelector);
export default CountryCodeSelector;
