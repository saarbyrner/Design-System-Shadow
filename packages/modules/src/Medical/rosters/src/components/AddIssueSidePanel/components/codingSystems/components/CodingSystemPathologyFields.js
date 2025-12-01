// @flow
import { useState, useEffect, useCallback } from 'react';
import type { ComponentType } from 'react';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { withNamespaces } from 'react-i18next';
import {
  Autocomplete,
  Box,
  IconButton,
  InputAdornment,
  TextField,
} from '@kitman/playbook/components';
import { useGetPathologiesMultiCodingV2Query } from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import style from '@kitman/modules/src/Medical/rosters/src/components/AddIssueSidePanel/AddIssueSidePanelStyle';
import useDebouncedCallback from '@kitman/common/src/hooks/useDebouncedCallback';
import type { MultiCodingV2Pathology } from '@kitman/modules/src/Medical/shared/types/medical/MultiCodingV2';
import type { MenuItem } from '@mui/material';
import type { StandardCodingSystemProps } from '../types';
import PathologyItem from './PathologyItem';

type Props = {
  codingSystemProps: StandardCodingSystemProps,
  invalidFields: Array<string>,
  renderPathologyRelatedFields: boolean,
  isEditMode?: boolean,
};

const CodingSystemPathologyFields = ({
  t,
  codingSystemProps,
  invalidFields,
  renderPathologyRelatedFields,
  isEditMode,
}: I18nProps<Props>) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [searchExpression, setSearchExpression] = useState<string>('');
  const [dropDownItems, setDropDownItems] = useState<Array<MenuItem>>([]);
  const [selectedPathology, setSelectedPathology] =
    useState<?MultiCodingV2Pathology>(
      codingSystemProps.selectedCodingSystemPathology ?? null
    );
  const isDisabled =
    !!codingSystemProps.isPathologyFieldDisabled && !isEditMode;

  const handleDebounceSearch = useDebouncedCallback(
    (searchString: string) => setSearchExpression(searchString),
    700
  );

  const {
    data: pathologiesData = [],
    isFetching: isPathologiesDataFetching,
    isSuccess: isPathologuesDataSucessful,
  } = useGetPathologiesMultiCodingV2Query({ searchExpression });

  const getPathologyLabel = useCallback((pathology: MultiCodingV2Pathology) => {
    const codeAsSuffix = pathology.code ? ` - ${pathology.code}` : '';
    const pathologyName =
      typeof pathology.pathology === 'string' ? pathology.pathology : '';

    return `${pathologyName}${codeAsSuffix}`;
  }, []);

  useEffect(() => {
    if (!codingSystemProps.isPathologyFieldDisabled) {
      return;
    }

    const pathology = codingSystemProps.selectedCodingSystemPathology;

    if (!pathology) {
      return;
    }

    const pathologyLabel = getPathologyLabel(pathology);

    setInputValue(pathologyLabel);
    setSearchExpression(pathologyLabel);
    setSelectedPathology(
      codingSystemProps.selectedCodingSystemPathology ?? null
    );
  }, [codingSystemProps, getPathologyLabel]);

  // Search input
  useEffect(() => {
    handleDebounceSearch(inputValue);
    return () => {
      handleDebounceSearch?.cancel?.();
    };
  }, [handleDebounceSearch, inputValue]);

  useEffect(() => {
    // Populate dropDownItems from fetched data (when needed)
    if (inputValue.trim().length > 2 && isPathologuesDataSucessful) {
      const newDropDownItems = pathologiesData.map(
        (pathology: MultiCodingV2Pathology) => {
          return {
            ...pathology,
            label: getPathologyLabel(pathology),
          };
        }
      );

      // Only set new dropdown items if needed
      setDropDownItems((prevItems) => {
        if (newDropDownItems.length === 0 && prevItems.length === 0) {
          return prevItems;
        }
        return newDropDownItems;
      });
    } else {
      // If input is too short or data not successful, clear the dropdown items (already empty, avoid setting state)
      setDropDownItems((prevItems) => {
        if (prevItems.length === 0) {
          return prevItems;
        }
        return [];
      });
    }
  }, [
    inputValue,
    isPathologuesDataSucessful,
    pathologiesData,
    getPathologyLabel,
  ]);

  const isInvalid = invalidFields.includes('primary_pathology_id');

  // Render info field related to the selected pathology
  const renderItem = (labelKey, valueKey) => {
    const displayText =
      typeof selectedPathology?.[valueKey] === 'object' &&
      selectedPathology?.[valueKey] !== null
        ? selectedPathology?.[valueKey].name
        : selectedPathology?.[valueKey];

    return (
      // Allow flex to resize
      <Box sx={[style.codingItem, { width: 'unset' }]}>
        <PathologyItem
          label={`${labelKey}: `}
          value={typeof displayText === 'string' ? displayText : 'N/A'}
        />
      </Box>
    );
  };

  const renderCodingSystemDetails = () => {
    return (
      <Box sx={style.codingSystemDetails}>
        {renderItem(t('Classification'), 'coding_system_classification')}
        {renderItem(t('Body area'), 'coding_system_body_area')}
        {renderItem(t('Code'), 'code')}
      </Box>
    );
  };

  const noOptionsText =
    searchExpression.length > 2 && pathologiesData.length < 1
      ? t('No Pathology found')
      : t('Search by Pathology name or code');

  const onClearPathology = () => {
    setInputValue('');
    setSelectedPathology(null);
    codingSystemProps?.onSelectCodingSystemPathology?.(null);
  };

  const onChangePathology = (e, selectedOptions) => {
    if (isDisabled || !selectedOptions?.id) return;

    setSelectedPathology(selectedOptions);
    codingSystemProps?.onSelectCodingSystemPathology?.(
      pathologiesData.find(
        (pathology) => pathology.id === selectedOptions?.id
      ) ?? null
    );
  };

  const onInputChangePathology = (event, newInputValue) => {
    if (isDisabled) return;
    setInputValue(newInputValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ width: '60%' }}>
        <Autocomplete
          fullWidth
          size="small"
          limitTags={1}
          disablePortal
          disableCloseOnSelect
          includeInputInList
          blurOnSelect
          loading={isPathologiesDataFetching}
          value={selectedPathology}
          onChange={onChangePathology}
          options={dropDownItems}
          filterOptions={(option) => option}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={(params) => (
            <TextField
              {...params}
              label={t('Pathologies')}
              error={isInvalid}
              InputProps={{
                ...params.InputProps,
                endAdornment: isDisabled ? undefined : (
                  <InputAdornment
                    position="end"
                    sx={style.clearPathologySearchBtn}
                  >
                    {selectedPathology?.id ? (
                      <IconButton
                        aria-label={t('clear')}
                        onClick={onClearPathology}
                        edge="end"
                      >
                        <KitmanIcon name={KITMAN_ICON_NAMES.Close} />
                      </IconButton>
                    ) : null}
                  </InputAdornment>
                ),
              }}
            />
          )}
          inputValue={inputValue}
          onInputChange={onInputChangePathology}
          renderOption={(selectProps, selectOptions) => (
            <li {...selectProps} key={selectOptions.id}>
              {selectOptions.label}
            </li>
          )}
          noOptionsText={noOptionsText}
          getOptionLabel={(option) => option.label || ''}
        />
      </Box>
      {renderPathologyRelatedFields && (
        <Box sx={{ padding: '1rem 0rem' }}>{renderCodingSystemDetails()}</Box>
      )}
    </Box>
  );
};

export const CodingSystemPathologyFieldsTranslated: ComponentType<Props> =
  withNamespaces()(CodingSystemPathologyFields);

export default CodingSystemPathologyFields;
