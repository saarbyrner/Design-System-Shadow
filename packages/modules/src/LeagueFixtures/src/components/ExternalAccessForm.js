// @flow
import { useState, useImperativeHandle, forwardRef } from 'react';
import isEmpty from 'lodash/isEmpty';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import {
  TextField,
  Grid2 as Grid,
  Button,
  IconButton,
} from '@kitman/playbook/components';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import styles from './styles';
import { validateAllFieldsWithErrors, validateFieldWithError } from './utils';

export type emailAutocorrectOptions = {
  label: string,
  id: number,
};
export type externalAccessForm = {
  firstName?: string,
  lastName?: string,
  email?: string,
  id?: number,
};

type Props = I18nProps<{
  requests?: Array<externalAccessForm>,
  onFormChange: (newFormData: Array<externalAccessForm>) => void,
}>;

type Error = {
  firstName?: boolean,
  lastName?: boolean,
  email?: boolean,
};

export type FormReference = {
  checkFormValidation: () => boolean,
} | null;

const ExternalAccessForm = (props: Props, ref) => {
  const createNewRequest = (): externalAccessForm => ({
    firstName: '',
    lastName: '',
    email: '',
  });
  const initialRequests = props.requests
    ? props.requests
    : [createNewRequest()];
  const [requests, setRequests] = useState(initialRequests);
  const [showErrors, setShowErrors] = useState([]);
  const [emailInputValue, setEmailInputValue] = useState([]);

  const addNewRequest = () => {
    const newRequest: externalAccessForm = createNewRequest();
    setRequests([...requests, newRequest]);
  };

  const checkValidation = (
    currentData?: externalAccessForm = {},
    index?: number = 0
  ) => {
    let errors: Array<Error> = [];
    // if only one field needs validation for example on blur or on change
    if (!isEmpty(currentData)) {
      const { id, ...currData } = currentData;
      errors = validateFieldWithError(currData, index, showErrors);
    } else {
      // validate all fields except id
      const validateAllRequests = requests.map(
        ({ id, ...otherFields }) => otherFields
      );
      errors = validateAllFieldsWithErrors(validateAllRequests);
    }

    const allValid = errors.every((error) =>
      Object.values(error).every((e) => e === false)
    );
    setShowErrors(errors);

    return allValid;
  };

  const checkAllFieldsValidation = () => {
    return checkValidation();
  };

  const handleChange = (data: externalAccessForm, index: number) => {
    const updatedRequests = requests.map((request, i) =>
      i === index ? { ...request, ...data } : request
    );
    checkValidation(data, index);
    setRequests(updatedRequests);
    props.onFormChange(updatedRequests);
  };

  useImperativeHandle(ref, () => ({
    checkFormValidation: checkAllFieldsValidation,
  }));

  const deleteRequest = (index: number) => {
    const deletedRequests = requests.filter((request, i) => index !== i);
    setRequests(deletedRequests);
    setEmailInputValue(emailInputValue.filter((email, i) => index !== i));
    setShowErrors(showErrors.filter((error, i) => index !== i));
    props.onFormChange(deletedRequests);
  };

  const formFields = (request: externalAccessForm, index: number) => {
    return (
      <div
        key={index}
        css={
          requests?.length > 1 && index < requests?.length - 1
            ? [styles.wrapper, styles.border]
            : styles.wrapper
        }
      >
        <div css={styles.header}>
          <h5 css={styles.title}>Request {index + 1}</h5>
          {index > 0 && (
            <span css={styles.binIcon}>
              <IconButton onClick={() => deleteRequest(index)}>
                <KitmanIcon
                  name={KITMAN_ICON_NAMES.DeleteOutline}
                  fontSize="small"
                />
              </IconButton>
            </span>
          )}
        </div>

        <Grid container spacing={2}>
          <Grid xs={12} md={6}>
            <TextField
              label={props.t('First Name')}
              value={request.firstName}
              onChange={(e) =>
                handleChange({ firstName: e.target.value }, index)
              }
              inputType="text"
              fullWidth
              onBlur={(e) =>
                checkValidation({ firstName: e.target.value }, index)
              }
              error={
                showErrors && showErrors.length && showErrors[index]?.firstName
              }
            />
          </Grid>
          <Grid xs={12} md={6}>
            <TextField
              label={props.t('Last Name')}
              value={request.lastName}
              onChange={(e) =>
                handleChange({ lastName: e.target.value }, index)
              }
              inputType="text"
              fullWidth
              onBlur={(e) =>
                checkValidation({ lastName: e.target.value }, index)
              }
              error={
                showErrors && showErrors.length && showErrors[index]?.lastName
              }
            />
          </Grid>
          <Grid xs={12}>
            <TextField
              label={props.t('Email')}
              value={request.email || ''}
              inputType="email"
              onChange={(e) => handleChange({ email: e.target.value }, index)}
              onBlur={(e) => checkValidation({ email: e.target.value }, index)}
              error={
                showErrors && showErrors?.length > 0 && showErrors[index]?.email
              }
              fullWidth
            />
          </Grid>
        </Grid>
      </div>
    );
  };

  return (
    <>
      {requests.map((request, index) => formFields(request, index))}
      <div css={styles.wrapper}>
        <Button
          onClick={() => addNewRequest()}
          disabled={requests?.length > 4}
          color="primary"
        >
          {props.t('Add')}
        </Button>
      </div>
    </>
  );
};

export default forwardRef<Props, FormReference>(ExternalAccessForm);
