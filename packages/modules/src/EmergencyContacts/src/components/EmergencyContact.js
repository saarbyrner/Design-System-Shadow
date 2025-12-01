// @flow
import { withNamespaces } from 'react-i18next';
import { useState, useEffect } from 'react';
import { InputTextField, Select } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { SelectOption as Option } from '@kitman/components/src/types';
import type { Validation } from '@kitman/common/src/types';
import PhoneCountryPrefixSelector from './PhoneCountryPrefixSelector';
import { validateEmergencyContactField } from '../EmergencyContactValidationHelper';
import type { EmergencyContactState, InternationalPhoneNumber } from '../types';
import styling from './style';
import CountrySelector from './CountrySelector';

export type PhoneValidation = {
  country: Array<Validation>,
  number: Array<Validation>,
};

export type EmergencyContactValidity = {
  firstname: Array<Validation>,
  lastname: Array<Validation>,
  email: Array<Validation>,
  phone_numbers: Array<PhoneValidation>,
  contact_relation: Array<Validation>,
  address_1: Array<Validation>,
  address_2: Array<Validation>,
  address_3: Array<Validation>,
  city: Array<Validation>,
  state_county: Array<Validation>,
  zip_postal_code: Array<Validation>,
  country: Array<Validation>,
};

type Props = {
  readOnly: boolean,
  doubleRowLayout: boolean,
  relationOptions: Array<Option>,
  contact: EmergencyContactState,
  validationResult?: EmergencyContactValidity,
  onChange?: Function,
};

const numbersRegex = new RegExp(/^[0-9,\s()#*-.-]+$/);

export type formFieldNames = {
  firstname: string,
  lastname: string,
  email: string,
  contact_relation: string,
  phone_numbers: Array<InternationalPhoneNumber>,
  address_1: string,
  address_2: string,
  address_3: string,
  city: string,
  state_county: string,
  zip_postal_code: string,
  country: string,
};
type FieldNames = $Keys<formFieldNames>;

const allValid: EmergencyContactValidity = {
  firstname: [],
  lastname: [],
  email: [],
  phone_numbers: [],
  contact_relation: [],
  address_1: [],
  address_2: [],
  address_3: [],
  city: [],
  state_county: [],
  zip_postal_code: [],
  country: [],
};

const EmergencyContacts = (props: I18nProps<Props>) => {
  const [contact, setContact] = useState<EmergencyContactState>(props.contact);
  const [validation, setValidation] = useState<EmergencyContactValidity>(
    props.validationResult || allValid
  );

  useEffect(() => {
    setContact(props.contact);
  }, [props.contact]);

  useEffect(() => {
    setValidation(props.validationResult || allValid);
  }, [props.validationResult]);

  useEffect(() => {
    props.onChange?.(contact);
  }, [contact]);

  const localFieldValidityCheck = (field: string, value: string) => {
    const singleFieldValidation = validateEmergencyContactField(field, value);
    if (validation[(field: string)].length !== singleFieldValidation.length) {
      setValidation(
        (prevState: EmergencyContactValidity): EmergencyContactValidity => {
          return { ...prevState, [(field: string)]: singleFieldValidation };
        }
      );
    }
  };

  const phoneNumberValidityCheck = (index: number, value: string) => {
    const singleFieldValidation = validateEmergencyContactField(
      'phone_number',
      value,
      index > 0
    );
    const indexedValidation = validation.phone_numbers[index];

    if (
      !indexedValidation ||
      indexedValidation.number.length !== singleFieldValidation.length
    ) {
      setValidation(
        (prevState: EmergencyContactValidity): EmergencyContactValidity => {
          // eslint-disable-next-line camelcase
          const phone_numbers = [...prevState.phone_numbers];
          if (!phone_numbers[index]) {
            while (phone_numbers.length < index + 1)
              phone_numbers.push({
                number: [],
                country: [],
              });
          }

          phone_numbers[index].number = singleFieldValidation;
          return { ...prevState, phone_numbers };
        }
      );
    }
  };

  const phoneCountryValidityCheck = (index: number, value: string) => {
    const singleFieldValidation = validateEmergencyContactField(
      'phone_country',
      value,
      index > 0
    );
    const indexedValidation = validation.phone_numbers[index];

    if (
      !indexedValidation ||
      indexedValidation.country.length !== singleFieldValidation.length
    ) {
      setValidation(
        (prevState: EmergencyContactValidity): EmergencyContactValidity => {
          // eslint-disable-next-line camelcase
          const phone_numbers = [...prevState.phone_numbers];
          if (!phone_numbers[index]) {
            while (phone_numbers.length < index + 1)
              phone_numbers.push({
                number: [],
                country: [],
              });
          }

          phone_numbers[index].country = singleFieldValidation;
          return { ...prevState, phone_numbers };
        }
      );
    }
  };

  const handleChange = (field: string, value: string) => {
    setContact((prevState: EmergencyContactState): EmergencyContactState => {
      return { ...prevState, [(field: string)]: value };
    });

    // Only validate onChange() if already an error, the handleBlur() will do final check
    if (validation[(field: string)].length > 0) {
      localFieldValidityCheck(field, value);
    }
  };

  const handleBlur = (field: FieldNames, value: string) => {
    localFieldValidityCheck(field, value);
  };

  const handleChangePhoneNumber = (index: number, value: string) => {
    if (value === '' || numbersRegex.test(value)) {
      setContact((prevState: EmergencyContactState): EmergencyContactState => {
        if (prevState.phone_numbers) {
          // eslint-disable-next-line camelcase
          const phone_numbers = [...prevState.phone_numbers];
          phone_numbers[index].number = value;
          return { ...prevState, phone_numbers };
        }
        return { ...prevState };
      });

      // Only validate onChange() if already an error, the handleBlur() will do final check
      if (
        validation.phone_numbers[index] &&
        validation.phone_numbers[index].number.length > 0
      ) {
        phoneNumberValidityCheck(index, value);
      }
    }
  };

  const handleChangePhoneCountry = (index: number, value: string) => {
    setContact((prevState: EmergencyContactState): EmergencyContactState => {
      if (prevState.phone_numbers) {
        // eslint-disable-next-line camelcase
        const phone_numbers = [...prevState.phone_numbers];
        phone_numbers[index].country = value;
        return { ...prevState, phone_numbers };
      }
      return { ...prevState };
    });

    // Only validate onChange() if already an error, the handleBlur() will do final check
    if (
      validation.phone_numbers[index] &&
      validation.phone_numbers[index].country.length > 0
    ) {
      phoneCountryValidityCheck(index, value);
    }
  };

  const handleBlurPhoneNumber = (index: number, value: string) => {
    phoneNumberValidityCheck(index, value);
  };

  const style = styling();

  const addPhoneNumbers = () => {
    if (props.contact.phone_numbers) {
      return props.contact.phone_numbers.map(
        (phone: InternationalPhoneNumber, index: number) => {
          return (
            <div key={`phone_entry_${index + 1}`}>
              <label css={style.label}>{`${props.t('Phone number')} ${
                index + 1
              }`}</label>
              {index > 0 && (
                <span css={style.labelOptional}>{props.t('Optional')}</span>
              )}
              <div css={style.phoneEntry}>
                <span css={style.phonePrefix}>
                  <PhoneCountryPrefixSelector
                    selectedCountry={phone.country || ''}
                    onChange={(country) => {
                      handleChangePhoneCountry(index, country);
                    }}
                    errors={
                      validation.phone_numbers[index]
                        ? validation.phone_numbers[index].country
                        : []
                    }
                    isClearable={index > 0}
                    isDisabled={props.readOnly}
                  />
                </span>
                <InputTextField
                  value={phone.number || ''}
                  invalid={
                    validation.phone_numbers[index] &&
                    validation.phone_numbers[index].number.some(
                      (validity) => validity.isValid === false
                    )
                  }
                  errors={
                    validation.phone_numbers[index]
                      ? validation.phone_numbers[index].number
                      : []
                  }
                  updatedValidationDesign
                  inputType="tel"
                  onChange={(e) =>
                    handleChangePhoneNumber(index, e.target.value)
                  }
                  onBlur={(e) => handleBlurPhoneNumber(index, e.target.value)}
                  kitmanDesignSystem
                  disabled={props.readOnly}
                />
              </div>
            </div>
          );
        }
      );
    }
    return undefined;
  };

  return (
    <div css={style.emergencyContact}>
      <div css={props.doubleRowLayout ? style.doubleRow : style.singleColumn}>
        <div>
          <label css={style.label}>{props.t('First name')}</label>
          <InputTextField
            value={contact.firstname || ''}
            invalid={validation.firstname.some(
              (validity) => validity.isValid === false
            )}
            errors={validation.firstname}
            updatedValidationDesign
            onChange={(e) => {
              const maxLengthSlice = e.target.value.slice(0, 45);
              handleChange('firstname', maxLengthSlice);
            }}
            onBlur={(e) => {
              const maxLengthSlice = e.target.value.slice(0, 45);
              handleBlur('firstname', maxLengthSlice);
            }}
            kitmanDesignSystem
            disabled={props.readOnly}
          />
        </div>
        <div>
          <label css={style.label}>{props.t('Last name')}</label>
          <InputTextField
            value={contact.lastname || ''}
            invalid={validation.lastname.some(
              (validity) => validity.isValid === false
            )}
            errors={validation.lastname}
            updatedValidationDesign
            onChange={(e) => {
              const maxLengthSlice = e.target.value.slice(0, 45);
              handleChange('lastname', maxLengthSlice);
            }}
            onBlur={(e) => {
              const maxLengthSlice = e.target.value.slice(0, 45);
              handleBlur('lastname', maxLengthSlice);
            }}
            kitmanDesignSystem
            disabled={props.readOnly}
          />
        </div>
        <div>
          <label css={style.label}>{props.t('Relation')}</label>
          <span css={style.labelOptional}>{props.t('Optional')}</span>
          <Select
            options={props.relationOptions}
            isLoading={
              !props.relationOptions || props.relationOptions.length === 0
            }
            value={contact.contact_relation}
            onBlur={handleBlur(
              'contact_relation',
              contact.contact_relation || ''
            )}
            onChange={(newRelation) => {
              handleChange('contact_relation', newRelation);
            }}
            isClearable
            onClear={() => {
              handleChange('contact_relation', '');
            }}
            isDisabled={props.readOnly}
          />
        </div>
      </div>
      <div css={props.doubleRowLayout ? style.doubleRow : style.singleColumn}>
        {addPhoneNumbers()}
        <div>
          <label css={style.label}>{props.t('Email')}</label>
          <span css={style.labelOptional}>{props.t('Optional')}</span>
          <InputTextField
            value={contact.email || ''}
            invalid={validation.email.length > 0}
            errors={validation.email}
            updatedValidationDesign
            inputType="email"
            onChange={(e) => handleChange('email', e.target.value)}
            onBlur={(e) => handleBlur('email', e.target.value)}
            kitmanDesignSystem
            disabled={props.readOnly}
          />
        </div>
      </div>
      <div css={props.doubleRowLayout ? style.doubleRow : style.singleColumn}>
        <div>
          <label css={style.label}>{props.t('Address line 1')}</label>
          <span css={style.labelOptional}>{props.t('Optional')}</span>
          <InputTextField
            value={contact.address_1 || ''}
            invalid={validation.address_1?.length > 0}
            errors={validation.address_1}
            updatedValidationDesign
            onChange={(e) => handleChange('address_1', e.target.value)}
            onBlur={(e) => handleBlur('address_1', e.target.value)}
            kitmanDesignSystem
            disabled={props.readOnly}
            maxLength={128}
          />
        </div>
        <div>
          <label css={style.label}>{props.t('Address line 2')}</label>
          <span css={style.labelOptional}>{props.t('Optional')}</span>
          <InputTextField
            value={contact.address_2 || ''}
            invalid={validation.address_2?.length > 0}
            errors={validation.address_2}
            updatedValidationDesign
            onChange={(e) => handleChange('address_2', e.target.value)}
            onBlur={(e) => handleBlur('address_2', e.target.value)}
            kitmanDesignSystem
            disabled={props.readOnly}
            maxLength={128}
          />
        </div>
        <div>
          <label css={style.label}>{props.t('Address line 3')}</label>
          <span css={style.labelOptional}>{props.t('Optional')}</span>
          <InputTextField
            value={contact.address_3 || ''}
            invalid={validation.address_3?.length > 0}
            errors={validation.address_3}
            updatedValidationDesign
            onChange={(e) => handleChange('address_3', e.target.value)}
            onBlur={(e) => handleBlur('address_3', e.target.value)}
            kitmanDesignSystem
            disabled={props.readOnly}
            maxLength={128}
          />
        </div>
      </div>
      <div css={props.doubleRowLayout ? style.doubleRow : style.singleColumn}>
        <div>
          <label css={style.label}>{props.t('City')}</label>
          <span css={style.labelOptional}>{props.t('Optional')}</span>
          <InputTextField
            value={contact.city || ''}
            invalid={validation.city?.length > 0}
            errors={validation.city}
            updatedValidationDesign
            onChange={(e) => handleChange('city', e.target.value)}
            onBlur={(e) => handleBlur('city', e.target.value)}
            kitmanDesignSystem
            disabled={props.readOnly}
            maxLength={50}
          />
        </div>
        <div>
          <label css={style.label}>{props.t('State/ County')}</label>
          <span css={style.labelOptional}>{props.t('Optional')}</span>
          <InputTextField
            value={contact.state_county || ''}
            invalid={validation.state_county?.length > 0}
            errors={validation.state_county}
            updatedValidationDesign
            onChange={(e) => handleChange('state_county', e.target.value)}
            onBlur={(e) => handleBlur('state_county', e.target.value)}
            kitmanDesignSystem
            disabled={props.readOnly}
            maxLength={50}
          />
        </div>
      </div>
      <div css={props.doubleRowLayout ? style.doubleRow : style.singleColumn}>
        <div>
          <label css={style.label}>{props.t('Zip/ Postal code')}</label>
          <span css={style.labelOptional}>{props.t('Optional')}</span>
          <InputTextField
            value={contact.zip_postal_code || ''}
            invalid={validation.zip_postal_code?.length > 0}
            errors={validation.zip_postal_code}
            updatedValidationDesign
            onChange={(e) => handleChange('zip_postal_code', e.target.value)}
            onBlur={(e) => handleBlur('zip_postal_code', e.target.value)}
            kitmanDesignSystem
            disabled={props.readOnly}
            maxLength={50}
          />
        </div>

        <div>
          <label css={style.label}>{props.t('Country')}</label>
          <span css={style.labelOptional}>{props.t('Optional')}</span>
          <CountrySelector
            selectedCountry={contact.country || ''}
            onChange={(newCountry) => {
              handleChange('country', newCountry);
            }}
            isClearable
            isDisabled={props.readOnly}
          />
        </div>
      </div>
    </div>
  );
};

export const EmergencyContactsTranslated = withNamespaces()(EmergencyContacts);
export default EmergencyContacts;
