// @flow
import { useState, useEffect } from 'react';
import uuid from 'uuid';
import type { Squads } from '@kitman/services/src/services/getSquads';
import type { DeletableItemId } from '@kitman/common/src/types/DeletionAvailability';
import type { RequestStatus } from '@kitman/common/src/types';
import type {
  ArchiveAction,
  SettingsEditItem,
  SettingsItem,
  SettingsView,
} from '../types';

const defaultNewItem: SettingsItem = {
  id: 0,
  name: '',
  isNewItem: true,
};

const defaultNewItemWithSquads: SettingsItem = {
  id: 0,
  name: '',
  squads: [],
  isNewItem: true,
};

const buildEditItemWithSquadsToSave = (
  item: SettingsItem
): SettingsEditItem => ({
  event_activity_type_category_id: item.event_activity_type_category?.value,
  name: item.name,
  squad_ids: item.squads?.map((squad) => squad.id),
  ...(!item.isNewItem && {
    id: item.id,
  }),
});

const buildEditItemToSave = (item: SettingsItem): SettingsEditItem => ({
  event_activity_type_category_id: item.event_activity_type_category?.value,
  name: item.name,
  ...(!item.isNewItem && {
    id: item.id,
  }),
});

const useSettings = ({
  activityTypeCategoriesEnabled = false,
  getRequest,
  postRequest,
  withSquads = false,
}: {
  activityTypeCategoriesEnabled?: boolean,
  getRequest: Function,
  postRequest: Function,
  withSquads?: boolean,
}) => {
  const [requestStatus, setRequestStatus] = useState<RequestStatus>(null);
  const [view, setView] = useState<SettingsView>('PRESENTATION');
  const [initialItems, setInitialItems] = useState<Array<SettingsItem>>([]);
  const [items, setItems] = useState<Array<SettingsItem>>([]);
  const [isSavingAllowed, setIsSavingAllowed] = useState(false);
  const [isValidationCheckAllowed, setIsValidationCheckAllowed] =
    useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);

  const fetchItems = () => {
    setRequestStatus('PENDING');
    getRequest().then(
      (fetchedItems) => {
        setRequestStatus('SUCCESS');
        setInitialItems(fetchedItems);
        setItems(fetchedItems);
      },
      () => setRequestStatus('FAILURE')
    );
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const changeView = (newView: SettingsView) => setView(newView);

  const changeName = (currentId: number | string, name: string) => {
    setIsValidationCheckAllowed(false);
    setIsSavingAllowed(true);

    setItems((prevItems) =>
      prevItems.map((prevItem) =>
        prevItem.id === currentId
          ? {
              ...prevItem,
              name,
            }
          : prevItem
      )
    );
  };

  const changeActivityCategory = (
    currentId: number | string,
    eventActivityTypeCategory: any
  ) => {
    setIsValidationCheckAllowed(false);
    setIsSavingAllowed(true);
    setItems((prevItems) => {
      return prevItems.map((prevItem) =>
        prevItem.id === currentId
          ? {
              ...prevItem,
              event_activity_type_category: eventActivityTypeCategory,
            }
          : prevItem
      );
    });
  };

  const changeSquads = (
    currentId: number | string,
    squadIds: Array<number | string>,
    selectedSquads: Squads
  ) => {
    setIsValidationCheckAllowed(false);
    setIsSavingAllowed(true);

    setItems((prevItems) =>
      prevItems.map((prevItem) =>
        prevItem.id === currentId
          ? {
              ...prevItem,
              squads: selectedSquads.filter((squad) =>
                squadIds.includes(squad.id)
              ),
            }
          : prevItem
      )
    );
  };

  const cancelEdit = () => {
    setIsValidationCheckAllowed(false);
    changeView('PRESENTATION');

    setItems(initialItems);
  };

  const saveEdit = () => {
    setIsValidationCheckAllowed(true);

    const allItemsWithName = items.every((item) => item.name);

    const allItemsWithCategory = items.every(
      (item) => item.event_activity_type_category
    );
    if (!allItemsWithCategory && activityTypeCategoriesEnabled) {
      return;
    }
    if (!allItemsWithName) {
      return;
    }

    setRequestStatus('PENDING');
    setIsValidationCheckAllowed(false);
    changeView('PRESENTATION');

    const builder = withSquads
      ? buildEditItemWithSquadsToSave
      : buildEditItemToSave;
    const editItems = items.map(builder);

    postRequest(editItems).then(
      () => {
        setRequestStatus('SUCCESS');
        fetchItems();
      },
      () => {
        setRequestStatus('FAILURE');
      }
    );
  };

  const addNewItem = () => {
    setIsValidationCheckAllowed(false);

    const newItemId = `NEW_ITEM_${uuid.v4()}`;
    setItems((prevItems) => [
      ...prevItems,
      {
        ...(withSquads ? defaultNewItemWithSquads : defaultNewItem),
        id: newItemId,
      },
    ]);
  };

  const deleteNewItem = (itemId: DeletableItemId) => {
    setItems((prevItems) =>
      prevItems.filter((prevItem) => prevItem.id !== itemId)
    );
  };

  const deleteItem = (deletableItemId: DeletableItemId) => {
    setIsDeleteModalOpen(false);
    setRequestStatus('PENDING');

    postRequest([
      {
        id: deletableItemId,
        delete: true,
      },
    ]).then(
      () => {
        setRequestStatus('SUCCESS');
        fetchItems();
      },
      () => {
        setRequestStatus('FAILURE');
      }
    );
  };

  const showDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };
  const hideDeleteModal = () => setIsDeleteModalOpen(false);

  const archiveItem = (itemId: number | string, action: ArchiveAction) => {
    setRequestStatus('PENDING');

    postRequest([
      {
        id: itemId,
        archived: action === 'ARCHIVE',
      },
    ]).then(
      () => {
        setRequestStatus('SUCCESS');
        fetchItems();
      },
      () => setRequestStatus('FAILURE')
    );
  };

  const showArchiveModal = () => setIsArchiveModalOpen(true);
  const hideArchiveModal = () => setIsArchiveModalOpen(false);

  return {
    requestStatus,
    view,
    items,
    isSavingAllowed,
    isValidationCheckAllowed,
    isDeleteModalOpen,
    isArchiveModalOpen,
    fetchItems,
    changeActivityCategory,
    changeView,
    changeName,
    changeSquads,
    cancelEdit,
    saveEdit,
    deleteItem,
    addNewItem,
    deleteNewItem,
    showDeleteModal,
    hideDeleteModal,
    archiveItem,
    showArchiveModal,
    hideArchiveModal,
  };
};

export default useSettings;
