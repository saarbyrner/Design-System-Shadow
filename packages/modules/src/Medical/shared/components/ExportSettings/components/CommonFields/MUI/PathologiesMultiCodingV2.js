// @flow
import { useState, useEffect, type ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import useDebouncedCallback from '@kitman/common/src/hooks/useDebouncedCallback';
import { useGetPathologiesMultiCodingV2Query } from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import { Autocomplete } from '@kitman/playbook/components';
import {
  VirtualizedListboxComponent,
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
  isV2MultiCodingSystem: boolean,
};

const PathologiesMultiCodingV2Field = ({
  fieldKey,
  label,
  multiple,
  defaultValue = multiple ? [] : null,
  shouldResetValueOnClose,
  performServiceCall,
  isCached,
  required,
  t,
}: I18nProps<Props>) => {
  const defaultLabel = t('Pathology');
  const [inputValue, setInputValue] = useState<string>('');
  const [searchExpression, setSearchExpression] = useState<string>('');

  const {
    data: pathologiesData = [],
    error: isPathologiesDataError,
    isFetching: isPathologiesDataFetching,
  } = useGetPathologiesMultiCodingV2Query(
    { searchExpression },
    {
      skip: !performServiceCall,
    }
  );

  const handleDebounceSearch = useDebouncedCallback(
    (searchString: string) => setSearchExpression(searchString),
    700
  );

  useEffect(() => {
    handleDebounceSearch(inputValue);
    return () => {
      // Do any clean up including debounces
      handleDebounceSearch?.cancel?.();
    };
  }, [inputValue]);

  return (
    <Field
      fieldKey={fieldKey}
      defaultValue={defaultValue}
      shouldResetValueOnClose={shouldResetValueOnClose}
      isCached={isCached}
    >
      {({ value = multiple ? [] : null, onChange }) => {
        return (
          <Autocomplete
            size="small"
            disableCloseOnSelect
            multiple={multiple}
            inputValue={inputValue}
            onClose={() => setInputValue('')}
            onInputChange={(e, val, reason) => {
              if (['input', 'clear'].includes(reason)) {
                setInputValue(val);
              }
            }}
            value={value}
            onChange={(e, val) => onChange(val)}
            options={pathologiesData.map((pathology) => ({
              label: `${pathology.code} ${pathology.pathology}`,
              id: pathology.code,
            }))}
            isOptionEqualToValue={({ id: optionId }, { id: valueId }) =>
              optionId === valueId
            }
            renderInput={(renderInputParams: Object) =>
              renderInput({
                params: renderInputParams,
                label: label || defaultLabel,
                loading: isPathologiesDataFetching,
                error:
                  required &&
                  (isPathologiesDataError ||
                    !value ||
                    (Array.isArray(value) && value.length === 0)),
              })
            }
            renderOption={multiple && renderCheckboxes}
            getOptionLabel={(option) => option.label}
            ListboxComponent={VirtualizedListboxComponent}
          />
        );
      }}
    </Field>
  );
};

export const PathologiesMultiCodingV2FieldTranslated: ComponentType<Props> =
  withNamespaces()(PathologiesMultiCodingV2Field);
export default PathologiesMultiCodingV2Field;
