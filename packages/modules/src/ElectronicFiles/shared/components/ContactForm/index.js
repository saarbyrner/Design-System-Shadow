// @flow
import { useState, useEffect, type ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import parsePhoneNumber from 'libphonenumber-js';
import {
  DATA_KEY,
  type NewContact,
  type ExistingContact,
  type FaxNumber,
  type Validation,
  type ContactFormData,
  type Errors as ErrorsType,
} from '@kitman/modules/src/ElectronicFiles/shared/types';
import {
  Box,
  TextField,
  Grid2 as Grid,
  FavoriteCheckbox,
} from '@kitman/playbook/components';
import Errors from '@kitman/modules/src/ElectronicFiles/shared/components/Errors';
import { validateField } from '@kitman/modules/src/ElectronicFiles/shared/utils';
import { CountryCodeSelectorTranslated as CountryCodeSelector } from '@kitman/modules/src/HumanInput/shared/components/InputElements/TextInput/components/PhoneSelector/CountryCodeSelector';

type Props = {
  data: ContactFormData,
  validation: Validation,
  handleChange: (value: $Shape<NewContact & ExistingContact>) => void,
  handleValidation: (errors: ErrorsType) => void,
  onAddToFavoritesChange?: (checked: boolean) => void,
  showAddToFavoritesCheckbox?: boolean,
  stackFields?: boolean,
};

const getDefaultValues = (faxNumber: FaxNumber) => {
  const countryCode = `+${faxNumber.country_code}`;
  return {
    phoneNumberString: faxNumber.number_international_e164.replace(
      countryCode,
      ''
    ),
    countryCallingCode: countryCode,
    countryISOCode: faxNumber.country,
  };
};

const ContactForm = ({
  data,
  validation,
  handleChange,
  handleValidation,
  onAddToFavoritesChange,
  showAddToFavoritesCheckbox = false,
  stackFields = false,
  t,
}: I18nProps<Props>) => {
  const [phoneNumberString, setPhoneNumberString] = useState<string>('');
  const [countryCallingCode, setCountryCallingCode] = useState<string>('+1');
  const [countryISOCode, setCountryISOCode] = useState<string>('US');
  const [isAddToFavoritesChecked, setIsAddToFavoritesChecked] =
    useState<boolean>(false);

  useEffect(() => {
    if (!data.contact?.id || !data.contact?.fax_number) {
      return;
    }
    const defaultValues = getDefaultValues(data.contact?.fax_number);
    setPhoneNumberString(defaultValues.phoneNumberString);
    setCountryCallingCode(defaultValues.countryCallingCode);
    setCountryISOCode(defaultValues.countryISOCode);
    setIsAddToFavoritesChecked(data.contact?.favorite || false);
    handleChange({
      fax_number: data.contact?.fax_number?.number_international_e164,
    });
  }, []);

  const getCombinedValue = (code: string, number: string) => {
    return code ? code.concat(number) : number;
  };

  const getParsedPhoneNumber = (code: string, number: string) => {
    const combinedValue = getCombinedValue(code, number);
    const parsedNumber = parsePhoneNumber(combinedValue);
    if (parsedNumber?.isValid()) {
      return {
        code,
        nationalNumber: parsedNumber.nationalNumber,
        internationalNumber: `+${parsedNumber.countryCallingCode}${parsedNumber.nationalNumber}`,
      };
    }
    return {
      code,
      nationalNumber: number,
      internationalNumber: combinedValue,
    };
  };

  const onCountryCallingCodeChange = (code: string) => {
    const parsedNumber = getParsedPhoneNumber(code, phoneNumberString);
    setCountryCallingCode(parsedNumber.code);
    setCountryISOCode('');
    handleChange({ fax_number: parsedNumber.internationalNumber });
    handleValidation(validateField(DATA_KEY.countryCode, parsedNumber.code));
    handleValidation(
      validateField(DATA_KEY.faxNumber, parsedNumber.internationalNumber)
    );
  };

  const onPhoneNumberChange = (number: string) => {
    const parsedNumber = getParsedPhoneNumber(countryCallingCode, number);
    setPhoneNumberString(parsedNumber.nationalNumber);
    handleChange({
      fax_number: parsedNumber.internationalNumber,
    });
    handleValidation(
      validateField(DATA_KEY.faxNumber, parsedNumber.internationalNumber)
    );
  };

  const onPhoneNumberValidation = (number: string) => {
    const parsedNumber = getParsedPhoneNumber(countryCallingCode, number);
    handleValidation(
      validateField(DATA_KEY.faxNumber, parsedNumber.internationalNumber)
    );
  };

  return (
    <>
      <CountryCodeSelector
        value={countryCallingCode}
        countryISOCode={countryISOCode}
        onChange={(value) => onCountryCallingCodeChange(value)}
        disablePortal
      />
      <TextField
        label={t('Fax number')}
        value={phoneNumberString}
        onChange={(e) => {
          onPhoneNumberChange(e.target.value);
          onPhoneNumberValidation(e.target.value);
        }}
        onBlur={(e) => onPhoneNumberValidation(e.target.value)}
        variant="filled"
        size="small"
        margin="dense"
        fullWidth
        error={
          !!validation.errors?.countryCode?.length ||
          !!validation.errors?.faxNumber?.length
        }
        helperText={
          <Errors
            errors={[
              ...(validation.errors?.countryCode || []),
              ...(validation.errors?.faxNumber || []),
            ]}
          />
        }
        FormHelperTextProps={{ component: 'div' }}
        sx={{ mt: 2 }}
      />
      <Grid container spacing={!stackFields ? 2 : 0}>
        <Grid xs={12} md={stackFields ? 12 : 4}>
          <TextField
            label={t('First name')}
            value={data.contact?.first_name || ''}
            onChange={(e) => {
              handleChange({ first_name: e.target.value });
              handleValidation(
                validateField(DATA_KEY.firstName, e.target.value)
              );
            }}
            onBlur={(e) =>
              handleValidation(
                validateField(DATA_KEY.firstName, e.target.value)
              )
            }
            variant="filled"
            size="small"
            margin="dense"
            fullWidth
            error={!!validation.errors?.firstName?.length}
            helperText={<Errors errors={validation.errors?.firstName} />}
            FormHelperTextProps={{ component: 'div' }}
          />
        </Grid>
        <Grid xs={12} md={stackFields ? 12 : 4}>
          <TextField
            label={t('Last name')}
            value={data.contact?.last_name || ''}
            onChange={(e) => {
              handleChange({ last_name: e.target.value });
              handleValidation(
                validateField(DATA_KEY.lastName, e.target.value)
              );
            }}
            onBlur={(e) =>
              handleValidation(validateField(DATA_KEY.lastName, e.target.value))
            }
            variant="filled"
            size="small"
            margin="dense"
            fullWidth
            error={!!validation.errors?.lastName?.length}
            helperText={<Errors errors={validation.errors?.lastName} />}
            FormHelperTextProps={{ component: 'div' }}
          />
        </Grid>
        <Grid xs={12} md={stackFields ? 12 : 4}>
          <TextField
            label={t('Company name')}
            value={data.contact?.company_name || ''}
            onChange={(e) => {
              handleChange({ company_name: e.target.value });
              handleValidation(
                validateField(DATA_KEY.companyName, e.target.value)
              );
            }}
            onBlur={(e) =>
              handleValidation(
                validateField(DATA_KEY.companyName, e.target.value)
              )
            }
            variant="filled"
            size="small"
            margin="dense"
            fullWidth
            error={!!validation.errors?.companyName?.length}
            helperText={<Errors errors={validation.errors?.companyName} />}
            FormHelperTextProps={{ component: 'div' }}
          />
        </Grid>
      </Grid>
      {showAddToFavoritesCheckbox && (
        <Box mt={1} ml={2}>
          <FavoriteCheckbox
            label={
              isAddToFavoritesChecked
                ? t('Added to favorites')
                : t('Add to favorites')
            }
            checked={isAddToFavoritesChecked}
            onChange={(checked: boolean) => {
              setIsAddToFavoritesChecked(checked);
              onAddToFavoritesChange?.(checked);
            }}
            tooltipTitle={
              isAddToFavoritesChecked ? t('Remove from favorites') : null
            }
          />
        </Box>
      )}
    </>
  );
};

export const ContactFormTranslated: ComponentType<Props> =
  withNamespaces()(ContactForm);
export default ContactForm;
