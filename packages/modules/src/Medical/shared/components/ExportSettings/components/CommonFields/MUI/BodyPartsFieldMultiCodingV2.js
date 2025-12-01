// @flow
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useGetBodyAreasMultiCodingV2Query } from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import { Autocomplete } from '@kitman/playbook/components';
import {
  renderInput,
  renderCheckboxes,
} from '@kitman/playbook/utils/Autocomplete';
import Field, {
  type CommonFieldProps,
} from '@kitman/modules/src/Medical/shared/components/ExportSettings/components/Field';

type Props = {
  ...CommonFieldProps,
  label?: string,
  multiple?: boolean,
  required?: boolean,
  defaultValue?: Array<string>,
  performServiceCall: boolean,
};

const BodyPartsFieldMultiCodingV2 = ({
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
  } = useGetBodyAreasMultiCodingV2Query(undefined, {
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
          onChange={(_, val) => onChange(val)}
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

export const BodyPartsFieldMultiCodingV2Translated: ComponentType<Props> =
  withNamespaces()(BodyPartsFieldMultiCodingV2);
export default BodyPartsFieldMultiCodingV2;
