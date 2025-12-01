// @flow
import { useState, useEffect } from 'react';
import _isEmpty from 'lodash/isEmpty';
import type { TableElementFilters, TableElementFilter } from '../../types';

export const useIsFiltersOpen = (
  filters: ?TableElementFilters,
  isEditMode: boolean,
  isSidebarOpen: boolean,
  filtersToListen: Array<TableElementFilter>
) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const openFilters = () => setIsFilterOpen(true);
  const closeFilters = () => setIsFilterOpen(false);

  const openIfFiltersPresent = () => {
    let filtersToCheck = [];

    if (filters) {
      Object.keys(filters).forEach((filter) => {
        if (filtersToListen.indexOf(filter) > -1) {
          filtersToCheck = [...filtersToCheck, ...filters[filter]];
        }
      });
    }

    if (!_isEmpty(filtersToCheck)) {
      setIsFilterOpen(true);
    } else if (_isEmpty(filters)) {
      // Closing if the new filters object is completely empty
      setIsFilterOpen(false);
    }
  };

  useEffect(() => {
    if (!isSidebarOpen) {
      setIsFilterOpen(false);
    } else if (isEditMode) {
      openIfFiltersPresent();
    }
  }, [isSidebarOpen, filters]);

  return { isFilterOpen, openFilters, closeFilters };
};
