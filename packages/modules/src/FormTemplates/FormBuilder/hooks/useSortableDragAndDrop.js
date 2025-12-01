// @flow
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  defaultDropAnimationSideEffects,
  type DropAnimation,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';

import type { HumanInputFormElement } from '@kitman/modules/src/HumanInput/types/forms';
import { levelEnumLike } from '@kitman/modules/src/FormTemplates/FormBuilder/components/Form/Menu/utils/enum-likes';
import {
  setMenuFormStructure,
  setMenuItemsStructureForMenuGroup,
  setQuestionsStructureForMenuItem,
  setQuestionsStructureForLayoutGroup,
} from '@kitman/modules/src/FormTemplates/redux/slices/formBuilderSlice';

type ReturnType = {
  handleDragStart: (event: Object) => void,
  handleDragEnd: (event: Object) => void,
  handleDragCancel: (event: Object) => void,
  dropAnimationConfig: DropAnimation,
  sensors: Object, // could not find a @dnd-kit type for this
  activeDnDElementIndex: number,
  activeId: number | null,
};

const useSortableDragAndDrop = (
  items: Array<HumanInputFormElement>,
  menuLevel: $Values<typeof levelEnumLike>,
  menuGroupIndex?: number,
  menuItemIndex?: number,
  groupIndex?: number
): ReturnType => {
  const dispatch = useDispatch();
  const [activeId, setActiveId] = useState(null);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const dropAnimationConfig: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.4',
        },
      },
    }),
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!event.over) {
      return;
    }

    if (active.id !== over.id) {
      const oldIndex = items.findIndex(
        (element: HumanInputFormElement) => element.id === active.id
      );
      const newIndex = items.findIndex(
        (element: HumanInputFormElement) => element.id === over.id
      );

      const updatedStructure = arrayMove(items, oldIndex, newIndex);

      if (menuLevel === levelEnumLike.menuGroup) {
        dispatch(setMenuFormStructure(updatedStructure));
      } else if (menuLevel === levelEnumLike.menuItem) {
        dispatch(
          setMenuItemsStructureForMenuGroup({
            updatedMenuItemsStructure: updatedStructure,
            menuGroupIndex,
          })
        );
      } else if (menuLevel === levelEnumLike.question) {
        dispatch(
          setQuestionsStructureForMenuItem({
            updatedQuestionsStructure: updatedStructure,
            menuGroupIndex,
            menuItemIndex,
          })
        );
      } else if (menuLevel === levelEnumLike.group) {
        dispatch(
          setQuestionsStructureForLayoutGroup({
            updatedQuestionsStructure: updatedStructure,
            menuGroupIndex,
            menuItemIndex,
            groupIndex,
          })
        );
      }

      setActiveId(null);
    }
  };

  const handleDragStart = (event) => {
    const { active } = event;

    setActiveId(active.id);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const activeDnDElementIndex = items.findIndex(
    (element: HumanInputFormElement) => element.id === activeId
  );

  return {
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
    dropAnimationConfig,
    sensors,
    activeDnDElementIndex,
    activeId,
  };
};

export default useSortableDragAndDrop;
