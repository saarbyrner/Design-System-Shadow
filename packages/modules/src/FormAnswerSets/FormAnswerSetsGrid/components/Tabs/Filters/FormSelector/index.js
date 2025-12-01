// @flow
import { useDispatch, useSelector } from 'react-redux';
import { Autocomplete, TextField, Chip } from '@kitman/playbook/components';
import { renderCheckboxes as renderAutocompleteCheckboxes } from '@kitman/playbook/utils/Autocomplete';
import type { SxProps, Theme } from '@mui/material';
import { Tooltip } from '@mui/material';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { setFormFilter } from '@kitman/modules/src/FormAnswerSets/redux/slices/formAnswerSetsSlice';
import { selectFormFilter } from '@kitman/modules/src/FormAnswerSets/redux/selectors/formAnswerSetsSelectors';
import { useState, useEffect, useMemo } from 'react';
import { useFetchFormTypesQuery } from '@kitman/services/src/services/humanInput/humanInput';
import type { Option } from '@kitman/playbook/types';

type Props = {
  handleTrackEvent?: () => void,
  multiple?: boolean,
  sx?: SxProps<Theme>,
  limitTags?: number,
};

const FormSelector = ({
  t,
  handleTrackEvent,
  multiple = false,
  sx = {},
  limitTags,
}: I18nProps<Props>) => {
  const dispatch = useDispatch();
  const formId = useSelector(selectFormFilter);
  const [formSelected, setFormSelected] = useState<
    Option | Array<Option> | null
  >(multiple ? [] : null);
  const { data: formTypes = [], isLoading: formTypesLoading } =
    useFetchFormTypesQuery({
      category: 'medical,general',
    });

  const options = useMemo(
    () =>
      formTypes.map(({ id, name }) => ({
        id,
        label: name,
      })),
    [formTypes]
  );

  const tooltipTitle =
    multiple && Array.isArray(formSelected) && formSelected.length > 0
      ? formSelected.map((option) => option.label).join(', ')
      : '';

  // Sync local state with Redux state
  useEffect(() => {
    if (formId === null || formId === undefined) {
      setFormSelected(multiple ? [] : null);
    } else if (multiple) {
      // If multiple, formId should be an array
      const selectedForms = Array.isArray(formId)
        ? formId.map((id) => options.find((f) => f.id === id)).filter(Boolean)
        : [];
      setFormSelected(selectedForms);
    } else {
      const form = options.find((f) => f.id === formId);
      setFormSelected(form || null);
    }
  }, [formId, options, multiple]);

  const handleChange = (event, value: Option | Array<Option> | null) => {
    setFormSelected(value);

    if (multiple) {
      const selectedIds = Array.isArray(value) ? value.map((v) => v.id) : [];
      dispatch(setFormFilter(selectedIds.length > 0 ? selectedIds : null));
    } else {
      dispatch(setFormFilter(value?.id || null));
    }

    handleTrackEvent?.();
  };

  return (
    <Tooltip title={tooltipTitle} placement="top">
      <Autocomplete
        multiple={multiple}
        value={formSelected}
        onChange={handleChange}
        disabled={formTypesLoading}
        options={options}
        getOptionLabel={(option) => option.label || ''}
        renderInput={(params) => <TextField {...params} label={t('Form')} />}
        renderOption={multiple ? renderAutocompleteCheckboxes : null}
        disableCloseOnSelect={multiple}
        size="small"
        sx={{ width: '20rem', ...sx }}
        limitTags={limitTags}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => {
            const label = option.label || '';
            const truncatedLabel =
              label.length > 23 ? `${label.substring(0, 23)}...` : label;
            return (
              <Chip
                {...getTagProps({ index })}
                label={truncatedLabel}
                size="small"
              />
            );
          })
        }
      />
    </Tooltip>
  );
};

export const FormSelectorTranslated: ComponentType<Props> =
  withNamespaces()(FormSelector);

export default FormSelector;
