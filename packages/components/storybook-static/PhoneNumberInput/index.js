// @flow
import { useMemo } from 'react';
import { withNamespaces } from 'react-i18next';
import {
  MenuItem,
  TextField,
  Stack,
  Box,
  ListSubheader,
} from '@kitman/playbook/components';
import parsePhoneNumber from 'libphonenumber-js';
import type { CountryCode } from 'libphonenumber-js';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import {
  countries,
  nonSuggestedCountries,
  suggestedCountries,
} from './constants';

type Props = {
  phone: string,
  defaultCountryCode?: CountryCode,
  countryCode: CountryCode,
  onChangePhone: (phone: string, formattedPhone: string) => void,
  onChangeCountryCode: (countryCode: CountryCode) => void,
  onSuccess: (phone: string) => void,
  onError: (error: string) => void,
};

const PhoneNumberInput = ({
  phone,
  defaultCountryCode = 'US',
  countryCode,
  onChangePhone,
  onChangeCountryCode,
  onSuccess,
  onError,
  t,
}: I18nProps<Props>) => {
  const defaultCountry = useMemo(
    () => countries.find((item) => item.code === defaultCountryCode),
    [defaultCountryCode]
  );
  const localDefaultCountryCode = countryCode || (defaultCountry?.code ?? '');

  const validatePhoneNumber = (cc: CountryCode) => {
    const validation = parsePhoneNumber(phone, cc);
    if (validation?.isValid()) {
      onSuccess(validation.nationalNumber);
    } else if (phone) {
      // IMPROVEMENT IDEA: custom error message coming from the props
      onError(t('Enter a valid phone number'));
    }
  };

  const renderCountryFlag = (cc: CountryCode) => {
    return (
      <img
        loading="lazy"
        width="30"
        srcSet={`https://flagcdn.com/w40/${cc.toLowerCase()}.png 2x`}
        src={`https://flagcdn.com/w20/${cc.toLowerCase()}.png`}
        alt=""
        style={{ marginRight: 5 }}
      />
    );
  };

  const renderCountryOption = (option) => {
    return (
      <MenuItem key={option.code} value={option.code}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ width: '100%' }}
        >
          <Box sx={{ '& > img': { mr: 2, flexShrink: 0 } }}>
            {renderCountryFlag(option.code)}
            <span>{option.label}</span>
          </Box>
          <span>{option.phone}</span>
        </Stack>
      </MenuItem>
    );
  };

  return (
    <TextField
      id="phoneNumber"
      placeholder="Phone"
      value={phone}
      onChange={(e) => {
        // NOTE: remove e.persist() if React version is 17+.
        e.persist();
        const phoneCode =
          countries.find((country) => country.code === localDefaultCountryCode)
            ?.phone ?? '';
        onChangePhone(e.target?.value, `${phoneCode}${e.target?.value}`);
      }}
      onBlur={() => {
        validatePhoneNumber(localDefaultCountryCode);
      }}
      sx={{
        '#countryCode-field': {
          paddingRight: 0,
          marginRight: '2px',
        },
        '#phoneNumber': {
          padding: '12px 0',
        },
      }}
      InputProps={{
        startAdornment: (
          <Stack direction="row" alignItems="center" gap={0}>
            {/* IMPROVEMENT IDEA: use Autocomplete instead */}
            <TextField
              select
              id="countryCode-field"
              value={localDefaultCountryCode}
              onChange={(e) => {
                onChangeCountryCode(e.target?.value);
                validatePhoneNumber(e.target?.value);
              }}
              variant="standard"
              SelectProps={{
                IconComponent: () => null,
                disableUnderline: true,
                sx: {
                  paddingRight: 0,
                },
                renderValue: renderCountryFlag,
              }}
            >
              <ListSubheader>{t('Suggested')}</ListSubheader>
              {suggestedCountries.map((option) => {
                return renderCountryOption(option);
              })}
              <ListSubheader>{t('Others')}</ListSubheader>
              {nonSuggestedCountries.map((option) => {
                return renderCountryOption(option);
              })}
            </TextField>
            <Box sx={{ marginRight: '5px' }}>
              {
                countries.find((item) => item.code === localDefaultCountryCode)
                  ?.phone
              }
            </Box>
          </Stack>
        ),
      }}
    />
  );
};

export default withNamespaces()(PhoneNumberInput);
