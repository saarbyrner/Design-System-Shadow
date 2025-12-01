// @flow
import i18n from '@kitman/common/src/utils/i18n';
import {
  getIsIntegerValid,
  isDateValid,
  isEmailValid,
  parseBoolean,
} from '@kitman/modules/src/shared/MassUpload/utils';

const generateInvalidListErrorMessage = (data: Array<string>) => {
  if (!data.length) {
    return i18n.t(`Incorrect value. No accepted values are available.`);
  }

  return i18n.t(`Invalid input. Accepted values: {{values}}`, {
    values: data.join(', '),
    interpolation: { escapeValue: false },
  });
};

const createListValidator =
  (
    options: Array<string>,
    params: {
      isMultiple?: boolean,
      customMessage?: string,
      isRequired?: boolean,
    } = {}
  ) =>
  (value: string): string | null => {
    if (!value && !params.isRequired) {
      return null;
    }

    if (!value && params.isRequired) {
      return i18n.t(`Field is required.`);
    }

    const values = params?.isMultiple
      ? value.split(',').map((item) => item.trim())
      : [value];
    const isValid = values.every((entry) => options.includes(entry));

    if (!isValid) {
      return params?.customMessage ?? generateInvalidListErrorMessage(options);
    }

    return null;
  };

const createDateValidator =
  (params: { acceptedDateFormats: Array<string> }) => (value: string) => {
    const isValid = isDateValid({
      date: value,
      acceptedFormats: params.acceptedDateFormats,
    });
    if (!isValid) {
      return i18n.t(
        'The date entered is in not a valid format. Check the Instructions tab for more information.'
      );
    }
    return null;
  };

const createIntegerValidator =
  (params: { isRequired: boolean } = {}) =>
  (value: string) => {
    if (!params.isRequired && !value) {
      return null;
    }

    const isValid = getIsIntegerValid(value);
    if (!isValid) {
      return i18n.t('Invalid number.');
    }

    return null;
  };

const createEmailValidator =
  (params: { isRequired: boolean } = {}) =>
  (value: string) => {
    if (!params.isRequired && !value) {
      return null;
    }

    const isValid = isEmailValid({ email: value });
    if (!isValid) {
      return i18n.t('Invalid email address.');
    }

    return null;
  };

const createBooleanValidator =
  (params: { isRequired: boolean } = {}) =>
  (value: string) => {
    if (!params.isRequired && !value) {
      return null;
    }

    const parsedBoolean = parseBoolean(value);

    if (parsedBoolean === undefined) {
      return i18n.t('Invalid value.');
    }

    return null;
  };

export {
  generateInvalidListErrorMessage,
  createListValidator,
  createIntegerValidator,
  createDateValidator,
  createBooleanValidator,
  createEmailValidator,
};
