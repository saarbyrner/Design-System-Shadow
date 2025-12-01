// @flow
import { useState, useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import {
  InputTextField,
  Select,
  TextButton,
  UserAvatar,
} from '@kitman/components';
import { useFetchOrganisationPreferenceQuery } from '@kitman/common/src/redux/global/services/globalApi';
import type { SelectOption as Option } from '@kitman/components/src/types';
import type { Validation } from '@kitman/common/src/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import saveForm from './saveForm';
import type { User, PhotoUploadState } from '../../../types';

type Props = {
  currentUser: User,
  languages: Array<Option>,
  photoUploadStatus: PhotoUploadState,
  saveUserFormStarted: Function,
  saveUserFormSuccess: Function,
  saveUserFormFailure: Function,
  onOpenImageUploadModal: Function,
};

export type FormFieldsValues = {
  firstname: string,
  lastname: string,
  email: string,
  locale: string,
  currentPassword: string,
  newPassword: string,
  newPasswordConfirmation: string,
};

type FieldNames = $Keys<FormFieldsValues>;

export type FormFieldsValid = {
  firstname: boolean,
  lastname: boolean,
  email: boolean,
  locale: boolean,
  currentPassword: boolean,
  newPassword: boolean,
  newPasswordConfirmation: boolean,
};
type FormFieldsTouched = FormFieldsValid;

export type FormFieldsErrors = {
  firstname: Array<Validation>,
  lastname: Array<Validation>,
  email: Array<Validation>,
  locale: Array<Validation>,
  currentPassword: Array<Validation>,
  newPassword: Array<Validation>,
  newPasswordConfirmation: Array<Validation>,
};

const validationCheck = (
  values,
  touched,
  t
): [FormFieldsValid, FormFieldsErrors] => {
  const newValid = {
    firstname: true,
    lastname: true,
    email: true,
    locale: true,
    currentPassword: true,
    newPassword: true,
    newPasswordConfirmation: true,
  };
  const newErrors = {
    firstname: [],
    lastname: [],
    email: [],
    locale: [],
    currentPassword: [],
    newPassword: [],
    newPasswordConfirmation: [],
  };

  const requireField = (name: string): void => {
    if (touched[name] && (values[name] == null || values[name] === '')) {
      newValid[name] = false;
      newErrors[name].push({
        isValid: false,
        message: t('A value is required'),
      });
    }
  };

  requireField('firstname');
  requireField('lastname');
  requireField('email');

  return [newValid, newErrors];
};

const EditUserProfile = (props: I18nProps<Props>) => {
  const [values, setValues] = useState(
    ({
      firstname: props.currentUser.firstname,
      lastname: props.currentUser.lastname,
      email: props.currentUser.email,
      locale: props.currentUser.locale,
      currentPassword: '',
      newPassword: '',
      newPasswordConfirmation: '',
    }: FormFieldsValues)
  );
  const [touched, setTouched] = useState(
    ({
      firstname: false,
      lastname: false,
      email: false,
      locale: false,
      currentPassword: false,
      newPassword: false,
      newPasswordConfirmation: false,
    }: FormFieldsTouched)
  );
  const [valid, setValid] = useState(
    ({
      firstname: true,
      lastname: true,
      email: true,
      locale: true,
      currentPassword: true,
      newPassword: true,
      newPasswordConfirmation: true,
    }: FormFieldsValid)
  );
  const [formValid, setFormValid] = useState(true);
  const [errors, setErrors] = useState(
    ({
      firstname: [],
      lastname: [],
      email: [],
      locale: [],
      currentPassword: [],
      newPassword: [],
      newPasswordConfirmation: [],
    }: FormFieldsErrors)
  );
  const [userFullName] = useState(`${values.firstname} ${values.lastname}`);
  useEffect(() => {
    const [newValid, newErrors] = validationCheck(values, touched, props.t);
    setErrors(newErrors);
    setValid(newValid);
    setFormValid(Object.values(newValid).every((v) => v === true));
  }, [values, touched, props.t]);
  const handleChange = (field: FieldNames, value: string) => {
    setValues((currentValues: FormFieldsValues) => {
      const nextValues = { ...currentValues };
      nextValues[field] = value;
      return nextValues;
    });
  };
  const handleBlur = (field: FieldNames) => {
    setTouched((currentTouched: FormFieldsTouched) => {
      const nextTouched = { ...currentTouched };
      nextTouched[field] = true;
      return nextTouched;
    });
  };

  const {
    data: preventFasAvatarUploadsOrgPreference,
    isLoading: isPreventFasAvatarUploadsOrgPreferenceLoading,
  } = useFetchOrganisationPreferenceQuery(
    'prevent_fas_org_athlete_avatar_uploads'
  );

  const shouldNotShowUploadPhotoButton =
    window.getFlag('cp-athlete-avatars-prevent-fas-avatar-upload') &&
    preventFasAvatarUploadsOrgPreference?.value === true;

  return (
    <div className="editUserProfileForm">
      <div className="editUserProfileForm__profileGrid">
        <div className="editUserProfileForm__header">
          <div className="editUserProfileForm__userDetails">
            <div className="editUserProfileForm__userFullName">
              <h1 className="kitmanHeading--L1">{userFullName}</h1>
            </div>
            <div className="editUserProfileForm__username">
              {props.currentUser.username}
            </div>
          </div>
        </div>

        <div className="editUserProfileForm__avatarDetails">
          <UserAvatar
            url={props.currentUser.avatar_url}
            firstname={props.currentUser.firstname}
            lastname={props.currentUser.lastname}
            displayInitialsAsFallback={false}
            displayPointerCursor={false}
            size="EXTRA_LARGE"
          />
          {!isPreventFasAvatarUploadsOrgPreferenceLoading &&
            !shouldNotShowUploadPhotoButton && (
              <div className="editUserProfileForm__avatarUpload">
                <TextButton
                  text={props.t('Upload photo')}
                  type="secondary"
                  onClick={props.onOpenImageUploadModal}
                  kitmanDesignSystem
                  isDisabled={props.photoUploadStatus !== 'IDLE'}
                />
              </div>
            )}
        </div>

        <div className="editUserProfileForm__detailsForm">
          <div className="editUserProfileForm__nameRow">
            <InputTextField
              value={values.firstname}
              label={props.t('First Name')}
              invalid={!valid.firstname}
              errors={errors.firstname}
              onChange={(e) => handleChange('firstname', e.target.value)}
              onBlur={() => handleBlur('firstname')}
              kitmanDesignSystem
              updatedValidationDesign
            />
            <InputTextField
              value={values.lastname}
              label={props.t('Last Name')}
              invalid={!valid.lastname}
              errors={errors.lastname}
              onChange={(e) => handleChange('lastname', e.target.value)}
              onBlur={() => handleBlur('lastname')}
              kitmanDesignSystem
              updatedValidationDesign
            />
          </div>
          <div className="editUserProfileForm__emailRow">
            <InputTextField
              value={values.email}
              label={props.t('Email')}
              invalid={!valid.email}
              errors={errors.email}
              onChange={(e) => handleChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              kitmanDesignSystem
              updatedValidationDesign
            />
          </div>
          <Select
            label={props.t('Language')}
            options={props.languages}
            value={values.locale}
            onChange={(newLocale) => {
              handleChange('locale', newLocale);
              // no separate blur for this so set touched here too
              handleBlur('locale');
            }}
          />
        </div>
      </div>

      <h2 className="kitmanHeading--L2">{props.t('Update your password')}</h2>

      <div className="editUserProfileForm__passwordForm">
        <div className="editUserProfileForm__inputContainer">
          <InputTextField
            value={values.currentPassword}
            inputType="password"
            label={props.t('Current Password')}
            invalid={!valid.currentPassword}
            errors={errors.currentPassword}
            onChange={(e) => handleChange('currentPassword', e.target.value)}
            onBlur={() => handleBlur('currentPassword')}
            kitmanDesignSystem
            updatedValidationDesign
          />
        </div>
        <div className="editUserProfileForm__inputContainer">
          <InputTextField
            value={values.newPassword}
            inputType="password"
            label={props.t('New Password')}
            invalid={!valid.newPassword}
            errors={errors.newPassword}
            onChange={(e) => handleChange('newPassword', e.target.value)}
            onBlur={() => handleBlur('newPassword')}
            kitmanDesignSystem
            updatedValidationDesign
          />
        </div>
        <div className="editUserProfileForm__inputContainer">
          <InputTextField
            value={values.newPasswordConfirmation}
            inputType="password"
            label={props.t('Confirm New Password')}
            invalid={!valid.newPasswordConfirmation}
            errors={errors.newPasswordConfirmation}
            onChange={(e) =>
              handleChange('newPasswordConfirmation', e.target.value)
            }
            onBlur={() => handleBlur('newPasswordConfirmation')}
            kitmanDesignSystem
            updatedValidationDesign
          />
        </div>
      </div>

      <div className="editUserProfileForm__footer">
        <TextButton
          type="primary"
          text={props.t('Update Profile')}
          onClick={() =>
            saveForm(
              values,
              setValid,
              setErrors,
              props.saveUserFormStarted,
              props.saveUserFormSuccess,
              props.saveUserFormFailure
            )
          }
          isDisabled={!formValid}
          kitmanDesignSystem
        />
      </div>
    </div>
  );
};

export const EditUserProfileTranslated = withNamespaces()(EditUserProfile);
export default EditUserProfile;
