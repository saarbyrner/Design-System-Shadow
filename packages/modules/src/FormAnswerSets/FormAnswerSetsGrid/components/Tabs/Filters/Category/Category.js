// @flow
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFormCategoryFilter } from '@kitman/modules/src/FormAnswerSets/redux/slices/formAnswerSetsSlice';
import { selectFormCategoryFilter } from '@kitman/modules/src/FormAnswerSets/redux/selectors/formAnswerSetsSelectors';
import type { SelectChangeEvent } from '@mui/material';

import {
  Autocomplete,
  AutocompleteGroupHeader,
  AutocompleteGroupItems,
  TextField,
} from '@kitman/playbook/components';
import { useListFormCategoriesQuery } from '@kitman/services/src/services/formTemplates';
import { sortFormCategories } from '@kitman/services/src/services/formTemplates/api/formCategories/utils/sort';
import type {
  FormCategories,
  FormCategory as FormCategoryType,
  MetaCamelCase,
} from '@kitman/services/src/services/formTemplates/api/types';
import { initialData } from '@kitman/modules/src/FormTemplates/FormTemplateSettings/hooks/useListFormCategories';

type Props = {
  categoryLabelTranslated: string,
  handleTrackEvent?: () => void,
};

const Category = ({ categoryLabelTranslated, handleTrackEvent }: Props) => {
  const dispatch = useDispatch();
  const formCategoryId = useSelector(selectFormCategoryFilter);
  const [categorySelected, setCategorySelected] =
    useState<FormCategoryType | null>(null);

  const {
    data = initialData,
  }: {
    data: {
      formCategories: FormCategories,
      pagination: MetaCamelCase,
    },
  } = useListFormCategoriesQuery({ includeDeleted: true });

  // Sync local state with Redux state
  useEffect(() => {
    if (formCategoryId == null) {
      setCategorySelected(null);
    } else {
      const category = data.formCategories.find(
        (cat) => cat.id === formCategoryId
      );
      setCategorySelected(category || null);
    }
  }, [formCategoryId, data.formCategories]);

  const handleChange = (
    event: SelectChangeEvent<string>,
    value: FormCategoryType | null
  ) => {
    setCategorySelected(value);
    dispatch(setFormCategoryFilter(value?.id || null));
    handleTrackEvent?.();
  };

  return (
    <Autocomplete
      options={[...data.formCategories].sort(sortFormCategories)}
      groupBy={(option) => option.productArea}
      getOptionLabel={(option) => option?.name || ''}
      sx={{ width: '15rem' }}
      inputValue={categorySelected?.name || ''}
      value={categorySelected}
      onChange={handleChange}
      renderInput={(params) => (
        <TextField {...params} label={categoryLabelTranslated} />
      )}
      renderGroup={(params) => (
        <li key={params.key}>
          <AutocompleteGroupHeader>{params.group}</AutocompleteGroupHeader>
          <AutocompleteGroupItems>{params.children}</AutocompleteGroupItems>
        </li>
      )}
      filterOptions={(x) => x}
    />
  );
};

export default Category;
