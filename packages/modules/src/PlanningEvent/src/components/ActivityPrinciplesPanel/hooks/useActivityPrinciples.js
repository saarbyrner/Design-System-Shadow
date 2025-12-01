// @flow
import { useState, useEffect } from 'react';
import getPrinciples from '@kitman/modules/src/PlanningHub/src/services/getPrinciples';
import getCategories from '@kitman/modules/src/PlanningHub/src/services/getCategories';
import getTypes from '@kitman/modules/src/PlanningHub/src/services/getTypes';
import getPhases from '@kitman/modules/src/PlanningHub/src/services/getPhases';
import usePrinciplesFilter from '@kitman/modules/src/OrganisationSettings/src/components/planningSettings/hooks/usePrinciplesFilter';
import type {
  Principle,
  Principles,
  PrincipleCategories,
  PrincipleTypes,
  PrinciplePhases,
} from '@kitman/common/src/types/Principles';
import type { RequestStatus } from '../../../../types';

const useActivityPrinciples = () => {
  const [principlesRequestStatus, setPrinciplesRequestStatus] =
    useState<RequestStatus>('LOADING');

  const [initialPrinciples, setInitialPrinciples] = useState<Principles>([]);
  const [principles, setPrinciples] = useState<Principles>([]);
  const [hasInitialPrinciples, setHasInitialPrinciples] = useState(false);
  const [hasPrincipleWithCategory, setHasPrincipleWithCategory] =
    useState(false);
  const [hasPrincipleWithPhase, setHasPrincipleWithPhase] = useState(false);
  const [draggedPrinciple, setDraggedPrinciple] = useState<Principle | null>(
    null
  );

  const [categories, setCategories] = useState<PrincipleCategories>([]);
  const [types, setTypes] = useState<PrincipleTypes>([]);
  const [phases, setPhases] = useState<PrinciplePhases>([]);

  const {
    filteredPrinciples,
    searchFilterChars,
    filterPrinciplesByItem,
    filterPrinciplesBySearch,
    resetFilters,
  } = usePrinciplesFilter(initialPrinciples, 'NAME_WITH_ITEMS');

  useEffect(() => {
    setPrinciples(filteredPrinciples);
  }, [filteredPrinciples]);

  const fetchPrinciples = () => {
    Promise.all([
      getCategories(),
      getTypes(),
      getPhases(),
      getPrinciples({ onlyForCurrentSquad: true }),
    ]).then(
      ([fetchedCategories, fetchedTypes, fetchedPhases, fetchedPrinciples]) => {
        setCategories(fetchedCategories);
        setTypes(fetchedTypes);
        setPhases(fetchedPhases);
        setInitialPrinciples(fetchedPrinciples);
        setPrinciples(fetchedPrinciples);
        setHasInitialPrinciples(fetchedPrinciples.length > 0);
        setHasPrincipleWithCategory(
          fetchedPrinciples.some(
            (principle) => principle.principle_categories.length > 0
          )
        );
        setHasPrincipleWithPhase(
          fetchedPrinciples.some((principle) => principle.phases.length > 0)
        );
        setPrinciplesRequestStatus('SUCCESS');
      },
      () => setPrinciplesRequestStatus('FAILURE')
    );
  };

  const onDragPrinciple = (principle: Principle) =>
    setDraggedPrinciple(principle);
  const onDropPrinciple = () => setDraggedPrinciple(null);

  return {
    principlesRequestStatus,
    principles,
    hasInitialPrinciples,
    hasPrincipleWithCategory,
    categories,
    hasPrincipleWithPhase,
    phases,
    types,
    draggedPrinciple,
    fetchPrinciples,
    onDragPrinciple,
    onDropPrinciple,
    searchFilterChars,
    filterPrinciplesByItem,
    filterPrinciplesBySearch,
    resetPrinciplesFilters: resetFilters,
  };
};

export default useActivityPrinciples;
