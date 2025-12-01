// @flow
import { withNamespaces } from 'react-i18next';
import type { ComponentType } from 'react';

import { InputText, Select } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import useDebouncedCallback from '@kitman/common/src/hooks/useDebouncedCallback';
import styles, { customSelectStyles } from './utils/styles';
import {
  createEventTypeOptions,
  createLocationTypeOptions,
} from './utils/helpers';
import { searchDebounceMs } from './utils/consts';
import type { Filters as FiltersType, OnFiltersChange } from './utils/types';

type Props = {
  filters: FiltersType,
  onFiltersChange: OnFiltersChange,
};

const Filters = ({
  t,
  onFiltersChange,
  filters: { eventTypes, locationTypes, searchValue },
}: I18nProps<Props>) => {
  const eventTypeOptions = createEventTypeOptions(t);
  const locationTypeOptions = createLocationTypeOptions(t);

  const delaySearchTermRequest = useDebouncedCallback((enteredText) => {
    if (searchValue === enteredText) return; // this is true at the first render. no need to send a request
    onFiltersChange('searchValue', enteredText);
  }, searchDebounceMs);

  return (
    <div css={styles.filtersContainer}>
      <InputText
        placeholder={t('Search')}
        onValidation={({ value }) => delaySearchTermRequest(value)}
        value={searchValue}
        kitmanDesignSystem
        searchIcon
      />
      <Select
        placeholder={t('Location type')}
        options={locationTypeOptions}
        onChange={(values) => onFiltersChange('locationTypes', values)}
        value={locationTypes}
        customSelectStyles={customSelectStyles}
        isMulti
      />
      <Select
        placeholder={t('Event type')}
        options={eventTypeOptions}
        onChange={(values) => onFiltersChange('eventTypes', values)}
        value={eventTypes}
        isMulti
        customSelectStyles={customSelectStyles}
      />
    </div>
  );
};

export const FiltersTranslated: ComponentType<Props> =
  withNamespaces()(Filters);
export default Filters;
