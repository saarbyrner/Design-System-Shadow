// @flow

import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';

import { Box, TextField } from '@kitman/playbook/components';

import useDebouncedCallback from '@kitman/common/src/hooks/useDebouncedCallback';
import { setSearchQuery } from '../../redux/slices/formTemplatesSlice';
import { getSearchQuery } from '../../redux/selectors/formTemplateSelectors';
import { getFiltersTranslations } from '../utils/helpers';
import Category from './Category';

const Filters = () => {
  const dispatch = useDispatch();

  // A local state is necessary because of the debouncing mechanism.
  // Otherwise, it will not send the correct values
  const searchQuery: string = useSelector(getSearchQuery);
  const [currentSearchQuery, setCurrentSearchQuery] = useState(searchQuery);

  const translations = getFiltersTranslations();

  const debouncedSearch = useDebouncedCallback(
    () => dispatch(setSearchQuery(currentSearchQuery)),
    400
  );

  return (
    <Box display="flex" gap="0.5rem">
      <TextField
        variant="filled"
        label={translations.search}
        value={currentSearchQuery}
        sx={{
          width: '18.75rem',
        }}
        onChange={(event) => {
          setCurrentSearchQuery(event.target.value);
          debouncedSearch();
        }}
      />
      <Category categoryLabelTranslated={translations.category} />
    </Box>
  );
};

export default Filters;
