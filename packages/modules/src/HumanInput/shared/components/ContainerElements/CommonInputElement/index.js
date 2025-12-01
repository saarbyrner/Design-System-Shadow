// @flow

import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import i18n from '@kitman/common/src/utils/i18n';
import type { Node } from 'react';
import { FormControl, FormHelperText } from '@kitman/playbook/components';
import { getFieldValidationFactory } from '@kitman/modules/src/HumanInput/shared/redux/selectors/formValidationSelectors';
import {
  getFieldValueFactory,
  getFormattedValueFactory,
  getModeFactory,
} from '@kitman/modules/src/HumanInput/shared/redux/selectors/formStateSelectors';

import type { HumanInputFormElement } from '@kitman/modules/src/HumanInput/types/forms';
import type { ValidationStatus } from '@kitman/modules/src/HumanInput/types/validation';

import useRequiredFields from '@kitman/modules/src/HumanInput/hooks/useRequiredFields';

import { MODES } from '@kitman/modules/src/HumanInput/shared/constants';

import useConditionalValidation from '../../../../hooks/useConditionalValidation';

type Props = {
  element: HumanInputFormElement,
  children: Function,
  repeatableGroupInfo: ?{ repeatable: boolean, groupNumber: number },
};

type RenderArgs = {
  element: HumanInputFormElement,
  value: string | number | boolean | Object | [] | null,
  validationStatus: {
    status: ValidationStatus,
    message: ?string,
  },
  onChange: Function,
  onBlur: Function,
};

const CommonInputElement = (props: Props): Node => {
  const { repeatableGroupInfo } = props;

  const { onChange } = useConditionalValidation({
    element: props.element,
    repeatableGroupInfo,
  });
  const formattedValue = useSelector(
    getFormattedValueFactory(props.element.id)
  );

  const getStateValue = useSelector(getFieldValueFactory(props.element.id));
  // Check if element has a "default_value" within "custom_params" or within "config" for eForms; if not, return default state value on initialisation
  const initialisedValue =
    props.element.config.custom_params?.default_value ||
    props.element.config?.default_value ||
    getStateValue;

  // Get value to be shown from state; otherwise, set initialised values
  const value = repeatableGroupInfo?.repeatable
    ? getStateValue?.[repeatableGroupInfo?.groupNumber]
    : getStateValue || initialisedValue;

  const mode = useSelector(getModeFactory());
  let validationStatus = useSelector(
    getFieldValidationFactory(props.element.id)
  );

  if (
    repeatableGroupInfo?.repeatable &&
    validationStatus?.length &&
    validationStatus[repeatableGroupInfo?.groupNumber]
  ) {
    validationStatus = validationStatus[repeatableGroupInfo?.groupNumber];
  }

  const { showOptionalIndicator, showRequiredIndicator } = useRequiredFields();
  const isViewMode = mode === MODES.VIEW;

  const isOptionalField = props.element.config.optional || false;

  const isErrorState = validationStatus?.status === 'INVALID';
  const isReadOnly = !!props.element.config.custom_params?.readonly;

  useEffect(() => {
    // get the element's value from the state
    // if its a child element of a repeatable group, get the value from the group
    const stateValue = repeatableGroupInfo?.repeatable
      ? getStateValue?.[repeatableGroupInfo?.groupNumber]
      : getStateValue;

    // update the value if the default value is in element's config and the state value is not set
    // also trigger validation
    if (props.element.config?.default_value && !stateValue) {
      onChange(props.element.config?.default_value);
    }
  }, [
    props.element.config?.default_value,
    getStateValue,
    repeatableGroupInfo,
    onChange,
  ]);

  const renderReadOnlyIndicator = (): Node => {
    return isReadOnly && <FormHelperText>{i18n.t('Read only')}</FormHelperText>;
  };

  const renderErrorMessage = (): Node => {
    return isErrorState ? (
      <FormHelperText>{validationStatus.message}</FormHelperText>
    ) : null;
  };

  const renderOptionalIndicator = (): Node => {
    return isOptionalField ? (
      <FormHelperText>{i18n.t('Optional')}</FormHelperText>
    ) : null;
  };

  const renderRequiredIndicator = (): Node => {
    return !isOptionalField ? (
      <FormHelperText>{i18n.t('Required')}</FormHelperText>
    ) : null;
  };

  const correctValue = isViewMode && formattedValue ? formattedValue : value;

  const renderArgs: RenderArgs = {
    element: props.element,
    value: correctValue,
    validationStatus,
    onChange,
    onBlur: onChange,
  };

  return (
    <FormControl fullWidth error={isErrorState}>
      {props.children(renderArgs)}
      {!isViewMode && renderReadOnlyIndicator()}
      {!isViewMode && renderErrorMessage()}
      {!isViewMode &&
        showOptionalIndicator &&
        !isReadOnly &&
        renderOptionalIndicator()}
      {!isViewMode &&
        showRequiredIndicator &&
        !isErrorState &&
        !isReadOnly &&
        renderRequiredIndicator()}
    </FormControl>
  );
};

export default CommonInputElement;
