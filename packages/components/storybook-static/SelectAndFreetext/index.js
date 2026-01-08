// @flow
import { useEffect } from 'react';
import type { ComponentType } from 'react';
import type { SerializedStyles } from '@emotion/react';
import { withNamespaces } from 'react-i18next';
import type { InjuryOnset } from '@kitman/services/src/services/medical/getInjuryOnset';
import { checkOptionRequiresTextField } from '@kitman/modules/src/Medical/shared/utils';
import { ValidationText } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { Option } from '../Select';
import { SelectTranslated as Select } from '../Select';
import Textarea from '../Textarea';

export const getSelectOptions = (options: Array<InjuryOnset>): Array<Option> =>
  options.map(({ name, id, require_additional_input: requiresText }) => ({
    label: name,
    value: id,
    ...(requiresText
      ? {
          requiresText,
        }
      : {}),
  }));

type CSSProperties = {
  [key: string]: string | number,
};

type ContainerStyle = SerializedStyles | CSSProperties;

interface Props {
  selectLabel: string;
  selectedField: ?number | ?string;
  onSelectedField: (string) => void;
  currentFreeText: string;
  onUpdateFreeText: (string) => void;
  invalidFields: boolean;
  options: Array<Option>;
  featureFlag: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  groupBy?: string;
  showAutoWidthDropdown?: boolean;
  selectContainerStyle?: ContainerStyle;
  textareaLabel?: ?string;
  textAreaContainerStyle?: ContainerStyle;
  isSearchable?: boolean;
  allowClearAll?: boolean;
  appendToBody?: boolean;
  customMaxLimit?: number;
  invalidText?: boolean;
  displayValidationText?: boolean;
  customValidationText?: string;
  showOptionTooltip?: boolean;
}

const SelectAndFreetext = (props: I18nProps<Props>) => {
  const {
    selectContainerStyle,
    selectLabel,
    selectedField,
    onSelectedField,
    currentFreeText,
    onUpdateFreeText,
    invalidFields,
    options,
    featureFlag,
    disabled,
    isLoading,
    groupBy,
    showAutoWidthDropdown,
    textareaLabel,
    textAreaContainerStyle,
    isSearchable,
    allowClearAll,
    appendToBody = true,
    customMaxLimit = 65535,
    invalidText,
    t: translate,
    displayValidationText,
    customValidationText,
    showOptionTooltip,
  } = props;

  const fieldRequiresText = checkOptionRequiresTextField(
    options,
    selectedField || ''
  );

  useEffect(() => {
    if (!fieldRequiresText && currentFreeText !== '') onUpdateFreeText('');
  }, [currentFreeText, fieldRequiresText, onUpdateFreeText]);

  return (
    <>
      <div css={selectContainerStyle} data-testid="options-select-container">
        <Select
          appendToBody={appendToBody}
          value={selectedField}
          invalid={invalidFields}
          label={selectLabel}
          options={options}
          onChange={onSelectedField}
          isDisabled={disabled}
          isLoading={isLoading}
          groupBy={groupBy}
          showAutoWidthDropdown={showAutoWidthDropdown}
          isSearchable={isSearchable}
          allowClearAll={allowClearAll}
          showOptionTooltip={showOptionTooltip}
        />
        {displayValidationText && invalidFields && (
          <ValidationText customValidationText={customValidationText} />
        )}
      </div>
      {featureFlag && fieldRequiresText && (
        <div css={textAreaContainerStyle}>
          <Textarea
            label={textareaLabel || translate('Other Reason')}
            value={currentFreeText}
            onChange={onUpdateFreeText}
            name="AddAvailabilityReopen|OtherReason"
            maxLimit={customMaxLimit}
            kitmanDesignSystem
            optionalText="Optional"
            invalid={invalidText}
          />
          {displayValidationText && invalidText && (
            <ValidationText customValidationText={customValidationText} />
          )}
        </div>
      )}
    </>
  );
};

export const SelectAndFreetextTranslated: ComponentType<Props> =
  withNamespaces()(SelectAndFreetext);

export default SelectAndFreetext;
