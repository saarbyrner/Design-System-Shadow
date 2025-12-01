// @flow
import { useDispatch, useSelector } from 'react-redux';
import type { SelectChangeEvent } from '@mui/material';

import {
  FormControl,
  Autocomplete,
  AutocompleteGroupHeader,
  AutocompleteGroupItems,
  TextField,
} from '@kitman/playbook/components';
import { useListFormCategoriesQuery } from '@kitman/services/src/services/formTemplates';
import { sortFormCategories } from '@kitman/services/src/services/formTemplates/api/formCategories/utils/sort';
import type {
  FormCategories,
  MetaCamelCase,
} from '@kitman/services/src/services/formTemplates/api/types';
import { initialData } from '@kitman/modules/src/FormTemplates/FormTemplateSettings/hooks/useListFormCategories';
import { setCategoryFilter } from '../../redux/slices/formTemplatesSlice';
import { getFilterCategory } from '../../redux/selectors/formTemplateSelectors';

type Props = {
  categoryLabelTranslated: string,
};

const Category = ({ categoryLabelTranslated }: Props) => {
  const dispatch = useDispatch();

  const {
    data = initialData,
  }: {
    data: {
      formCategories: FormCategories,
      pagination: MetaCamelCase,
    },
  } = useListFormCategoriesQuery({});
  const selectedCategory: string = useSelector(getFilterCategory);

  const handleChange = (event: SelectChangeEvent<string>, value) => {
    dispatch(setCategoryFilter(value));
  };

  return (
    <FormControl sx={{ width: '12rem' }}>
      <Autocomplete
        options={[...data.formCategories].sort(sortFormCategories)}
        groupBy={(option) => option.productArea}
        getOptionLabel={(option) => option?.name || ''}
        sx={{ width: 300 }}
        inputValue={selectedCategory}
        value={selectedCategory}
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
    </FormControl>
  );
};

export default Category;
