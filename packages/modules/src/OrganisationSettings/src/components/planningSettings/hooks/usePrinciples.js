// @flow
import { useState, useEffect } from 'react';
import uuid from 'uuid';
import getPrinciples from '@kitman/modules/src/PlanningHub/src/services/getPrinciples';
import savePrinciples from '@kitman/modules/src/PlanningHub/src/services/savePrinciples';
import deletePrinciple from '@kitman/modules/src/PlanningHub/src/services/deletePrinciple';
import type { RequestStatus } from '@kitman/common/src/types';
import useDebouncedCallback from '@kitman/common/src/hooks/useDebouncedCallback';
import type {
  Principle,
  PrincipleId,
  Principles,
  PrincipleItemId,
  PrincipleItemType,
  PrincipleItems,
  PrincipleCategory,
  EditPrinciples,
} from '@kitman/common/src/types/Principles';
import usePrinciplesFilter from './usePrinciplesFilter';
import type { SettingsView } from '../types';

export const defaultNewCategory: PrincipleCategory = {
  id: 0,
  name: '',
  isNewCategory: true,
};

export const defaultNewPrinciple: Principle = {
  id: 0,
  name: '',
  principle_categories: [],
  principle_types: [],
  phases: [],
  squads: [],
  isNewPrinciple: true,
};

const validatePrinciples = (principles: EditPrinciples): boolean =>
  principles.every(
    (principle) => principle.name && principle.principle_type_ids.length > 0
  );

const usePrinciples = () => {
  const [requestStatus, setRequestStatus] = useState<RequestStatus>(null);
  const [view, setView] = useState<SettingsView>('PRESENTATION');
  const [initialPrinciples, setInitialPrinciples] = useState<Principles>([]);
  const [principles, setPrinciples] = useState<Principles>([]);
  const [shouldFiltersEmptied, setShouldFiltersEmptied] = useState(false);
  const [isValidationCheckAllowed, setIsValidationCheckAllowed] =
    useState(false);
  const [isSavingAllowed, setIsSavingAllowed] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const {
    filteredPrinciples,
    searchFilterChars,
    filterPrinciplesByItem,
    filterPrinciplesBySearch,
    resetFilters,
  } = usePrinciplesFilter(initialPrinciples);

  const fetchPrinciples = () => {
    setRequestStatus('PENDING');

    getPrinciples().then(
      (fetchedPrinciples) => {
        setRequestStatus('SUCCESS');
        setInitialPrinciples(fetchedPrinciples);
        setPrinciples(fetchedPrinciples);
        setShouldFiltersEmptied(false);
      },
      () => setRequestStatus('FAILURE')
    );
  };

  useEffect(() => {
    fetchPrinciples();
  }, []);

  useEffect(() => {
    setPrinciples(filteredPrinciples);
  }, [filteredPrinciples]);

  const changeView = (newView: SettingsView) => {
    setView(newView);
  };

  const showDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };
  const hideDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const addPrinciple = () => {
    setIsValidationCheckAllowed(false);
    setIsSavingAllowed(true);
    setPrinciples((prevPrinciples) => [
      ...prevPrinciples,
      {
        ...defaultNewPrinciple,
        id: `NEW_PRINCIPLE_${uuid.v4()}`,
      },
    ]);
  };

  const onCreatePrinciple = () => {
    changeView('EDIT');
    addPrinciple();
  };

  const onCancelPrinciplesEdit = () => {
    changeView('PRESENTATION');
    setIsValidationCheckAllowed(false);
    setIsSavingAllowed(false);
    setPrinciples(initialPrinciples);
  };

  const deleteNewPrinciple = (principleId: PrincipleId) => {
    setIsValidationCheckAllowed(false);
    setPrinciples((prevPrinciples) =>
      prevPrinciples.filter((prevPrinciple) => prevPrinciple.id !== principleId)
    );
  };

  const onDeletePrinciple = (deletablePrincipleId: PrincipleId) => {
    if (!deletablePrincipleId) {
      return;
    }

    setRequestStatus('PENDING');
    hideDeleteModal();

    deletePrinciple(deletablePrincipleId).then(
      () => {
        setRequestStatus('SUCCESS');
        fetchPrinciples();
        resetFilters();
        setShouldFiltersEmptied(true);
      },
      () => setRequestStatus('FAILURE')
    );
  };

  const updatePrincipleItems = ({
    principleItemIds,
    principleItemType,
    principleItems,
  }: {
    principleItemIds: PrincipleItemId[],
    principleItemType: PrincipleItemType,
    principleItems: PrincipleItems,
  }) => {
    setIsValidationCheckAllowed(false);
    setIsSavingAllowed(true);
    setPrinciples((prevPrinciples) =>
      prevPrinciples.map((prevPrinciple) => ({
        ...prevPrinciple,
        [`${principleItemType}`]: principleItems.filter((principleItem) =>
          principleItemIds.includes(principleItem.id)
        ),
      }))
    );
  };

  const updatePrincipleItemById = ({
    principleId,
    principleItemId,
    principleItemType,
    principleItems,
  }: {
    principleId: PrincipleId,
    principleItemId: (PrincipleItemId | null) | PrincipleItemId[],
    principleItemType: PrincipleItemType,
    principleItems: PrincipleItems,
  }) => {
    setIsValidationCheckAllowed(false);
    setIsSavingAllowed(true);
    setPrinciples((prevPrinciples) =>
      prevPrinciples.map((prevPrinciple) =>
        prevPrinciple.id === principleId
          ? {
              ...prevPrinciple,
              [`${principleItemType}`]: Array.isArray(principleItemId)
                ? principleItems.filter((squad) =>
                    principleItemId.includes(squad.id)
                  )
                : principleItems.filter((type) => type.id === principleItemId),
            }
          : prevPrinciple
      )
    );
  };

  const changePrincipleName = useDebouncedCallback(
    (principleId: PrincipleId, value: string) => {
      setIsValidationCheckAllowed(false);
      setIsSavingAllowed(true);
      setPrinciples((prevPrinciples) =>
        prevPrinciples.map((prevPrinciple) =>
          prevPrinciple.id === principleId
            ? {
                ...prevPrinciple,
                name: value,
              }
            : prevPrinciple
        )
      );
    },
    400,
    {
      leading: true,
    }
  );

  const onSavePrinciples = () => {
    setIsValidationCheckAllowed(true);
    setIsSavingAllowed(false);

    const editPrinciples: EditPrinciples = principles.map((principle) => ({
      ...(!principle.isNewPrinciple && { id: principle.id }),
      name: principle.name,
      principle_category_ids: principle.principle_categories.map(
        (category) => category.id
      ),
      principle_type_ids: principle.principle_types.map((type) => type.id),
      phase_ids: principle.phases.map((phase) => phase.id),
      squad_ids: principle.squads.map((squad) => squad.id),
    }));

    if (!validatePrinciples(editPrinciples)) {
      return;
    }

    setRequestStatus('PENDING');
    setView('PRESENTATION');

    savePrinciples(editPrinciples).then(
      () => {
        setRequestStatus('SUCCESS');
        setIsValidationCheckAllowed(false);
        resetFilters();
        setShouldFiltersEmptied(true);
        fetchPrinciples();
      },
      () => setRequestStatus('FAILURE')
    );
  };

  return {
    requestStatus,
    fetchPrinciples,
    view,
    principles,
    shouldFiltersEmptied,
    isValidationCheckAllowed,
    isSavingAllowed,
    isDeleteModalOpen,
    changeView,
    showDeleteModal,
    hideDeleteModal,
    searchFilterChars,
    filterPrinciplesByItem,
    filterPrinciplesBySearch,
    onCreatePrinciple,
    onCancelPrinciplesEdit,
    addPrinciple,
    deleteNewPrinciple,
    onDeletePrinciple,
    updatePrincipleItems,
    updatePrincipleItemById,
    changePrincipleName,
    onSavePrinciples,
  };
};

export default usePrinciples;
