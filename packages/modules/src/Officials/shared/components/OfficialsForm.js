// @flow
import { useState } from 'react';
import {
  InputTextField,
  DatePicker,
  TextButton,
  Select,
  RadioList,
} from '@kitman/components';
import { withNamespaces } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { dateTransferFormat } from '@kitman/common/src/utils/dateFormatter';
import { css } from '@emotion/react';
import { languageDropdownOptions } from '@kitman/modules/src/Officials/shared/languageDropdownOptions';
import {
  preventPrecedingSpaces,
  isEmailValid,
} from '@kitman/modules/src/Officials/shared/utils';
import useLocationPathname from '@kitman/common/src/hooks/useLocationPathname';
import { parseBoolean } from '@kitman/modules/src/shared/MassUpload/utils/index';
import { parseFromTypeFromLocation } from '@kitman/modules/src/Scouts/shared/routes/utils';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { redirectUrl } from '@kitman/modules/src/AdditionalUsers/shared/utils';
import { onUpdateForm } from '../redux/slices/officialSlice';

type Props = {
  onClickSave: Function,
  isRequestPending: boolean,
};

const style = {
  button: css`
    margin-left: 12px;
  `,
  footer: css`
    display: flex;
    justify-content: flex-end;
  `,
  field: css`
    margin-bottom: 16px;
  `,
  wrapper: css`
    background-color: white;
    padding: 20px;
    min-height: 500px;
  `,
};
function OfficialsForm(props: I18nProps<Props>) {
  const dispatch = useDispatch();
  const { formState } = useSelector((state) => state.officialSlice);
  const { id } = parseFromTypeFromLocation(useLocationPathname());
  const [isEmailValidationCheckAllowed, setIsEmailValidationCheckAllowed] =
    useState(false);
  const isEmailInvalid =
    isEmailValidationCheckAllowed && !isEmailValid(formState.email);

  const canSubmit = () => {
    const requiredFields = ['firstname', 'lastname', 'email', 'locale'];
    return (
      !props.isRequestPending &&
      !isEmailInvalid &&
      requiredFields.every((field) => formState[field])
    );
  };

  // determine whether to show status, if we are in edit mode by the id
  const isEditMode = /^\d+$/.test(id); // TODO: this will be be updated and the refactor to align with Scouts implementation

  return (
    <div css={style.wrapper}>
      <div className="row">
        <div className="col-lg-4" css={style.field}>
          <InputTextField
            label={props.t('First Name')}
            value={formState.firstname}
            onChange={(e) => {
              dispatch(
                onUpdateForm({
                  firstname: e.target.value,
                })
              );
            }}
            inputType="text"
            onKeyDown={preventPrecedingSpaces}
            kitmanDesignSystem
          />
        </div>
        <div className="col-lg-4" css={style.field}>
          <DatePicker
            label={props.t('DOB')}
            onDateChange={(date) => {
              dispatch(
                onUpdateForm({
                  date_of_birth: moment(date).format(dateTransferFormat),
                })
              );
            }}
            name="date_of_birth"
            value={formState.date_of_birth}
            disableFutureDates
            kitmanDesignSystem
            optional
          />
        </div>
      </div>
      <div className="row">
        <div className="col-lg-4" css={style.field}>
          <InputTextField
            label={props.t('Last Name')}
            value={formState.lastname}
            onChange={(e) => {
              dispatch(
                onUpdateForm({
                  lastname: e.target.value,
                })
              );
            }}
            inputType="text"
            onKeyDown={preventPrecedingSpaces}
            kitmanDesignSystem
          />
        </div>
        <div className="col-lg-4" css={style.field}>
          <Select
            onChange={(value) => {
              dispatch(
                onUpdateForm({
                  locale: value,
                })
              );
            }}
            options={languageDropdownOptions}
            label={props.t('Language')}
            value={formState.locale}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-lg-4" css={style.field}>
          <InputTextField
            label={props.t('Email')}
            value={formState.email}
            onChange={(e) => {
              dispatch(
                onUpdateForm({
                  email: e.target.value,
                })
              );
            }}
            inputType="email"
            errors={
              isEmailInvalid
                ? [
                    {
                      message: 'Must be a valid email address.',
                      isValid: true,
                    },
                  ]
                : []
            }
            invalid={isEmailInvalid}
            onKeyDown={preventPrecedingSpaces}
            onBlur={() => setIsEmailValidationCheckAllowed(true)}
            kitmanDesignSystem
          />
        </div>
      </div>

      <div className="row">
        <div className="col-lg-4" css={style.field}>
          <Select
            onChange={() => {}}
            options={[{ label: 'Referee', value: 1 }]}
            label={props.t('Role')}
            value={1}
            isDisabled
          />
        </div>
        <div className="col-lg-4" css={style.field}>
          <Select
            onChange={() => {}}
            options={[{ label: 'MLS NEXT', value: 1 }]}
            label={props.t('Division')}
            value={1}
            isDisabled
          />
        </div>
      </div>
      {isEditMode && (
        <div className="row">
          <div className="col-lg-4" css={style.field}>
            <RadioList
              radioName="Official|Status"
              label={props.t('Status')}
              value={formState.is_active}
              options={[
                {
                  value: true,
                  name: props.t('Active'),
                },
                {
                  value: false,
                  name: props.t('Inactive'),
                },
              ]}
              change={(value) => {
                dispatch(
                  onUpdateForm({
                    is_active: parseBoolean(value),
                  })
                );
              }}
              kitmanDesignSystem
            />
          </div>
        </div>
      )}
      <div css={style.footer}>
        <a href={redirectUrl('official')}>
          <TextButton
            type="secondary"
            text={props.t('Cancel')}
            kitmanDesignSystem
          />
        </a>
        <div css={style.button}>
          <TextButton
            onClick={() => props.onClickSave()}
            type="primary"
            text={props.t('Save')}
            isDisabled={!canSubmit()}
            kitmanDesignSystem
          />
        </div>
      </div>
    </div>
  );
}

export const OfficialsFormTranslated = withNamespaces()(OfficialsForm);
export default OfficialsForm;
