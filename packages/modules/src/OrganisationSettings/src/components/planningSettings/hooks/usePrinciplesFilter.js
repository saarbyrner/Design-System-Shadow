// @flow
import { useState, useEffect, useCallback } from 'react';
import { getPrincipleNameWithItems } from '@kitman/common/src/utils/planningEvent';
import type {
  Principles,
  PrincipleFilter,
} from '@kitman/common/src/types/Principles';

const defaultPrincipleFilter: PrincipleFilter = {
  category: [],
  type: [],
  phase: [],
  squad: [],
};

type PrincipleNameType = 'DEFAULT' | 'NAME_WITH_ITEMS';

const usePrinciplesFilter = (
  initialPrinciples: Principles,
  principleNameType: PrincipleNameType = 'DEFAULT'
) => {
  const [principleFilter, setPrincipleFilter] = useState(
    defaultPrincipleFilter
  );
  const [filteredPrinciples, setFilteredPrinciples] =
    useState<Principles>(initialPrinciples);
  const [searchFilterChars, setSearchFilterChars] = useState('');

  useEffect(() => {
    const filters = [
      principleFilter.category,
      principleFilter.type,
      principleFilter.phase,
      principleFilter.squad,
    ];

    const hasSelectedFilter = (filter) => filter.length > 0;
    const hasSelectedFilters = filters.some(hasSelectedFilter);

    if (!hasSelectedFilters && !searchFilterChars) {
      setFilteredPrinciples(initialPrinciples);
      return;
    }

    const totalSelectedFilters = filters.filter(hasSelectedFilter).length;

    const updatedInitialPrinciples = searchFilterChars
      ? initialPrinciples.filter((principle) => {
          const currentPrincipleName =
            principleNameType === 'NAME_WITH_ITEMS'
              ? getPrincipleNameWithItems(principle)
              : principle.name;
          return currentPrincipleName
            .toLowerCase()
            .includes(searchFilterChars.toLowerCase());
        })
      : initialPrinciples;

    setFilteredPrinciples(
      updatedInitialPrinciples.filter((principle) => {
        const matchedCategories = principle.principle_categories
          .map((category) => category.id)
          .filter((categoryId) =>
            principleFilter.category.includes(categoryId)
          );

        const matchedTypes = principle.principle_types
          .map((type) => type.id)
          .filter((typeId) => principleFilter.type.includes(typeId));

        const matchedPhases = principle.phases
          .map((phase) => phase.id)
          .filter((phaseId) => principleFilter.phase.includes(phaseId));

        const matchedSquads = principle.squads
          .map((squad) => squad.id)
          .filter((squadId) => principleFilter.squad.includes(squadId));

        const matchedFilters = [
          matchedCategories,
          matchedTypes,
          matchedPhases,
          matchedSquads,
        ].filter((filter) => filter.length > 0);

        return totalSelectedFilters === matchedFilters.length;
      })
    );
  }, [searchFilterChars, principleFilter]);

  const filterPrinciplesByItem = useCallback(
    (filterType: string, filterIds: Array<number>) => {
      setPrincipleFilter((prevFilter) => ({
        ...prevFilter,
        [filterType]: filterIds,
      }));
    },
    [setPrincipleFilter]
  );

  const filterPrinciplesBySearch = (chars: string) => {
    setSearchFilterChars(chars);
  };

  const resetFilters = () => {
    setPrincipleFilter(defaultPrincipleFilter);
  };

  return {
    filteredPrinciples,
    searchFilterChars,
    filterPrinciplesBySearch,
    filterPrinciplesByItem,
    resetFilters,
  };
};

export default usePrinciplesFilter;
