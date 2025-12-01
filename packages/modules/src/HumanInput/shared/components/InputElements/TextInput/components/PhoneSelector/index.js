// @flow

import { useState, useEffect, useRef } from 'react';
import { Stack, FormControl } from '@kitman/playbook/components';
import type { HumanInputFormElement } from '@kitman/modules/src/HumanInput/types/forms';
import type { ValidationStatus } from '@kitman/modules/src/HumanInput/types/validation';

import { CountryCodeSelectorTranslated as CountryCodeSelector } from '@kitman/modules/src/HumanInput/shared/components/InputElements/TextInput/components/PhoneSelector/CountryCodeSelector';
import StandardInput from '@kitman/modules/src/HumanInput/shared/components/InputElements/TextInput/components/StandardInput';
import parsePhoneNumber from 'libphonenumber-js';
import { northAmericanTerritoriesAreaCodes } from './utils/consts';

type Props = {
  element: HumanInputFormElement,
  value: string,
  validationStatus: {
    status: ValidationStatus,
    message: ?string,
  },
  onChange: Function,
};

const PhoneSelector = (props: Props) => {
  const { element, value, onChange, validationStatus } = props;
  const { custom_params: customParams = {} } = element.config;
  const [countryCallingCode, setCountryCallingCode] = useState<string>(
    customParams.default_country_code || ''
  );
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [countryISOCode, setCountryISOCode] = useState<string>('');
  const isInitialMount = useRef(true);

  const getNumberValue = (phoneNumberValue): string => {
    /**
     * TECH DEBT: This will be revised when we integrate repeatability.
     */
    if (Array.isArray(phoneNumberValue)) {
      return phoneNumberValue[0] || '';
    }
    return phoneNumberValue || '';
  };

  useEffect(() => {
    const numberValue = getNumberValue(value);
    const parsedNumber = parsePhoneNumber(numberValue);

    if (parsedNumber) {
      const areaCode = parsedNumber.nationalNumber.slice(0, 3);
      if (northAmericanTerritoriesAreaCodes.has(+areaCode)) {
        const countryCallingCodeWithAreaCode = `+${parsedNumber.countryCallingCode}-${areaCode}`;
        setCountryCallingCode(countryCallingCodeWithAreaCode);
        setPhoneNumber(parsedNumber.nationalNumber.slice(3));
      } else {
        setCountryCallingCode(`+${parsedNumber.countryCallingCode}`);
        setPhoneNumber(parsedNumber.nationalNumber);
      }
      setCountryISOCode(parsedNumber?.country);
    } else {
      setCountryISOCode('');
      if (!numberValue) {
        setCountryCallingCode(customParams.default_country_code || '');
        setPhoneNumber('');
      } else if (isInitialMount.current) {
        // On initial mount, if the number is not valid, we try to split it.
        if (numberValue.includes('+')) {
          setCountryCallingCode(numberValue);
          setPhoneNumber('');
        } else {
          setPhoneNumber(numberValue);
        }
      }
    }

    if (isInitialMount.current) {
      isInitialMount.current = false;
    }
  }, [value, customParams.default_country_code]);

  const selectorChange = (selectedValue: ?string) => {
    const newCountryCode = selectedValue || '';
    const combinedValue = newCountryCode
      ? newCountryCode.concat(phoneNumber)
      : ''.concat(phoneNumber);

    onChange(combinedValue.replace(/-/g, ''));
    setCountryCallingCode(newCountryCode);
  };

  const textInputChange = (inputText: string) => {
    const combinedValue = countryCallingCode
      ? countryCallingCode.concat(inputText)
      : ''.concat(inputText);
    setPhoneNumber(inputText);
    onChange(combinedValue.replace(/-/g, ''));
  };

  return (
    <Stack direction="row" spacing={2}>
      <FormControl fullWidth>
        <CountryCodeSelector
          defaultValue={customParams.default_country_code}
          value={countryCallingCode}
          countryISOCode={countryISOCode}
          onChange={selectorChange}
        />
      </FormControl>
      <FormControl fullWidth>
        <StandardInput
          element={element}
          validationStatus={validationStatus}
          value={phoneNumber}
          onChange={textInputChange}
        />
      </FormControl>
    </Stack>
  );
};

export default PhoneSelector;
