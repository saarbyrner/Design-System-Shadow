// @flow
import { useState, type ComponentType } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withNamespaces } from 'react-i18next';

import { TextField } from '@kitman/playbook/components';
import useDebouncedCallback from '@kitman/common/src/hooks/useDebouncedCallback';
import { getFormTemplateSettingsFilters } from '@kitman/modules/src/FormTemplates/redux/selectors/formTemplateSettingsSelectors';
import { setSearchQueryFilter } from '@kitman/modules/src/FormTemplates/redux/slices/formTemplateSettingsSlice';
import type { I18nProps } from '@kitman/common/src/types/i18n';

const SearchFilter = ({ t }: I18nProps<{}>) => {
  const dispatch = useDispatch();
  const filters = useSelector(getFormTemplateSettingsFilters);

  // Local state for the input field to allow debouncing
  const [currentSearchQuery, setCurrentSearchQuery] = useState(
    filters?.searchQuery || ''
  );

  const debouncedSearch = useDebouncedCallback(
    (query: string) => {
      dispatch(setSearchQueryFilter(query));
    },
    400 // Debounce time in ms
  );

  const handleChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setCurrentSearchQuery(newValue);
    debouncedSearch(newValue);
  };

  return (
    <TextField
      label={t('Search categories')}
      value={currentSearchQuery}
      onChange={handleChange}
      size="small"
      sx={{ width: '20rem' }}
    />
  );
};

export const SearchFilterTranslated: ComponentType<{}> =
  withNamespaces()(SearchFilter);
export default SearchFilterTranslated;
