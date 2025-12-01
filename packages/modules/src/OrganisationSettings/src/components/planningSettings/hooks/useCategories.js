// @flow
import { useState, useEffect } from 'react';
import uuid from 'uuid';
import getCategoriesRequest from '@kitman/modules/src/PlanningHub/src/services/getCategories';
import saveCategoriesRequest from '@kitman/modules/src/PlanningHub/src/services/saveCategories';
import type { RequestStatus } from '@kitman/common/src/types';
import type {
  PrincipleCategory,
  PrincipleCategoryId,
  PrincipleCategories,
  EditPrincipleCategories,
} from '@kitman/common/src/types/Principles';

export const defaultNewCategory: PrincipleCategory = {
  id: 0,
  name: '',
  isNewCategory: true,
};

const useCategories = () => {
  const [requestStatus, setRequestStatus] = useState<RequestStatus>(null);
  const [initialCategories, setInitialCategories] =
    useState<PrincipleCategories>([]);
  const [categories, setCategories] = useState<PrincipleCategories>([]);
  const [isCategoriesSidePanelOpen, setIsCategoriesSidePanelOpen] =
    useState(false);
  const [
    isCategoriesValidationCheckAllowed,
    setIsCategoriesValidationCheckAllowed,
  ] = useState(false);
  const [isCategoriesSavingAllowed, setIsCategoriesSavingAllowed] =
    useState(false);

  const getCategories = () => {
    setRequestStatus('PENDING');

    getCategoriesRequest().then(
      (fetchedCategories) => {
        setRequestStatus('SUCCESS');
        setInitialCategories(fetchedCategories);
        setCategories(fetchedCategories);
      },
      () => setRequestStatus('FAILURE')
    );
  };

  useEffect(() => {
    getCategories();
  }, []);

  const showCategoriesSidePanel = () => setIsCategoriesSidePanelOpen(true);
  const hideCategoriesSidePanel = (reset: boolean = true) => {
    if (reset) {
      setCategories(initialCategories);
    }
    setIsCategoriesValidationCheckAllowed(false);
    setIsCategoriesSavingAllowed(false);
    setIsCategoriesSidePanelOpen(false);
  };

  const addCategory = () => {
    setIsCategoriesSavingAllowed(true);
    setCategories((prevCategories) => [
      ...prevCategories,
      {
        ...defaultNewCategory,
        id: `NEW_CATEGORY_${uuid.v4()}`,
      },
    ]);
  };

  const editCategory = (id: PrincipleCategoryId, name: string) => {
    setIsCategoriesSavingAllowed(true);
    setCategories((prevCategories) =>
      prevCategories.map((prevCategory) =>
        prevCategory.id === id ? { ...prevCategory, name } : prevCategory
      )
    );
  };

  const deleteCategory = (id: PrincipleCategoryId) => {
    setIsCategoriesSavingAllowed(true);
    setCategories((prevCategories) =>
      prevCategories.filter((prevCategory) => prevCategory.id !== id)
    );
  };

  const saveCategories = (): Promise<void> =>
    new Promise<void>((resolve: (value: any) => void) => {
      setIsCategoriesValidationCheckAllowed(true);

      if (!categories.every((category) => category.name)) {
        return;
      }

      const editedCategories: EditPrincipleCategories = categories.map(
        (category) => ({
          ...(!category.isNewCategory && {
            id: category.id,
          }),
          name: category.name,
        })
      );

      hideCategoriesSidePanel(false);
      saveCategoriesRequest(editedCategories).then(
        () => {
          getCategories();
          resolve();
        },
        () => setRequestStatus('FAILURE')
      );
    });

  return {
    requestStatus,
    categories,
    isCategoriesValidationCheckAllowed,
    isCategoriesSavingAllowed,
    isCategoriesSidePanelOpen,
    showCategoriesSidePanel,
    hideCategoriesSidePanel,
    addCategory,
    editCategory,
    deleteCategory,
    saveCategories,
  };
};

export default useCategories;
