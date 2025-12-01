// @flow
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useGetClinicalImpressionsBodyAreasQuery } from '@kitman/modules/src/Medical/shared/redux/services/medical';
import { Autocomplete } from '@kitman/playbook/components';
import {
  renderInput,
  renderCheckboxes,
} from '@kitman/playbook/utils/Autocomplete';
import type { CommonFieldProps } from '@kitman/modules/src/Medical/shared/components/ExportSettings/components/Field';
import Field from '@kitman/modules/src/Medical/shared/components/ExportSettings/components/Field';

type Props = {
  ...CommonFieldProps,
  label?: string,
  multiple?: boolean,
  required?: boolean,
  defaultValue?: Array<string>,
  performServiceCall: boolean,
};

const CIBodyPartsField = ({
  fieldKey,
  label,
  multiple,
  required,
  defaultValue = multiple ? [] : null,
  shouldResetValueOnClose,
  performServiceCall,
  isCached,
  t,
}: I18nProps<Props>) => {
  const defaultLabel = t('Body Part');

  const {
    data: bodyAreasData = [],
    error: isBodyAreasDataError,
    isLoading: isBodyAreasDataLoading,
  } = useGetClinicalImpressionsBodyAreasQuery(undefined, {
    skip: !performServiceCall,
  });

  return (
    <Field
      fieldKey={fieldKey}
      defaultValue={defaultValue}
      shouldResetValueOnClose={shouldResetValueOnClose}
      isCached={isCached}
    >
      {({ value = multiple ? [] : null, onChange }) => (
        <Autocomplete
          size="small"
          disableCloseOnSelect
          multiple={multiple}
          value={value}
          onChange={(e, val) => onChange(val)}
          options={bodyAreasData.map(({ id, name }) => ({
            id,
            label: name,
          }))}
          isOptionEqualToValue={({ id: optionId }, { id: valueId }) =>
            optionId === valueId
          }
          renderInput={(renderInputParams: Object) =>
            renderInput({
              params: renderInputParams,
              label: label || defaultLabel,
              loading: isBodyAreasDataLoading,
              error:
                required &&
                (isBodyAreasDataError ||
                  !value ||
                  (Array.isArray(value) && value.length === 0)),
            })
          }
          renderOption={multiple ? renderCheckboxes : undefined}
          getOptionLabel={(option) => option.label}
        />
      )}
    </Field>
  );
};

export const CIBodyPartsFieldTranslated: ComponentType<Props> =
  withNamespaces()(CIBodyPartsField);
export default CIBodyPartsField;
