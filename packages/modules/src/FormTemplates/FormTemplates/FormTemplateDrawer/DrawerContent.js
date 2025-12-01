// @flow

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  TextField,
  FormControl,
  Autocomplete,
  AutocompleteGroupHeader,
  AutocompleteGroupItems,
} from '@kitman/playbook/components';
import { useListFormCategoriesQuery } from '@kitman/services/src/services/formTemplates';
import type {
  FormCategories,
  MetaCamelCase,
} from '@kitman/services/src/services/formTemplates/api/types';
import { initialData } from '@kitman/modules/src/FormTemplates/FormTemplateSettings/hooks/useListFormCategories';
import { sortFormCategories } from '@kitman/services/src/services/formTemplates/api/formCategories/utils/sort';
import { setMetaDataField } from '../../redux/slices/formBuilderSlice';
import { getFormMetaData } from '../../redux/selectors/formBuilderSelectors';
import { getDrawerTranslations } from './utils/helpers';
import type { FormMetaData } from '../../redux/slices/utils/types';

const DrawerContent = () => {
  const dispatch = useDispatch();
  const {
    data = initialData,
  }: {
    data: {
      formCategories: FormCategories,
      pagination: MetaCamelCase,
    },
  } = useListFormCategoriesQuery({});

  const {
    templateTitle,
    category,
    description,
    optional,
    maxCharacters100Message,
  } = getDrawerTranslations();
  const formMetaData: FormMetaData = useSelector(getFormMetaData);
  const [titleHelperText, setTitleHelperText] = useState<string>('');
  const [descriptionHelperText, setDescriptionHelperText] =
    useState<string>(optional);
  const [categorySelected, setCategorySelected] = useState(
    formMetaData.formCategoryName || ''
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        rowGap: '1rem',
        height: '54rem',
      }}
    >
      <Box>
        <TextField
          fullWidth
          label={templateTitle}
          value={formMetaData.title}
          onChange={(event) =>
            dispatch(
              setMetaDataField({
                value: event.target.value,
                field: 'title',
              })
            )
          }
          onFocus={() => setTitleHelperText(maxCharacters100Message)}
          onBlur={() => setTitleHelperText('')}
          inputProps={{ maxLength: 100 }}
          helperText={titleHelperText}
        />
      </Box>

      <Box sx={{ display: 'flex', columnGap: '0.5rem' }}>
        <TextField
          fullWidth
          label={description}
          onFocus={() =>
            setDescriptionHelperText(`${optional} - ${maxCharacters100Message}`)
          }
          onBlur={() => setDescriptionHelperText(optional)}
          value={formMetaData.description}
          onChange={(event) =>
            dispatch(
              setMetaDataField({
                value: event.target.value,
                field: 'description',
              })
            )
          }
          inputProps={{ maxLength: 100 }}
          helperText={descriptionHelperText}
        />
      </Box>
      <Box sx={{ display: 'flex', columnGap: '0.5rem' }}>
        <FormControl sx={{ width: '12rem' }}>
          <Autocomplete
            options={[...data.formCategories].sort(sortFormCategories)}
            groupBy={(option) => option.productArea}
            getOptionLabel={(option) => option?.name || ''}
            sx={{ width: 300 }}
            inputValue={categorySelected}
            value={categorySelected}
            onChange={(event, value) => {
              setCategorySelected(value?.name || '');
              dispatch(
                setMetaDataField({
                  value: value?.name,
                  field: 'category',
                })
              );
              dispatch(
                setMetaDataField({
                  value: value?.productArea,
                  field: 'productArea',
                })
              );
              dispatch(
                setMetaDataField({
                  value: value?.id,
                  field: 'formCategoryId',
                })
              );
            }}
            renderInput={(params) => <TextField {...params} label={category} />}
            renderGroup={(params) => (
              <li key={params.key}>
                <AutocompleteGroupHeader>
                  {params.group}
                </AutocompleteGroupHeader>
                <AutocompleteGroupItems>
                  {params.children}
                </AutocompleteGroupItems>
              </li>
            )}
            filterOptions={(x) => x}
          />
        </FormControl>
      </Box>
    </Box>
  );
};

export default DrawerContent;
