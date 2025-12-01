// @flow

import { DndContext, closestCenter, DragOverlay } from '@dnd-kit/core';
import { useDispatch } from 'react-redux';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import i18n from '@kitman/common/src/utils/i18n';
import {
  Accordion,
  AccordionDetails,
  MenuItem as MuiMenuItem,
  MenuList,
} from '@kitman/playbook/components';
import SortableItem from '@kitman/modules/src/FormTemplates/FormBuilder/components/Form/SortableItem';
import useSortableDragAndDrop from '@kitman/modules/src/FormTemplates/FormBuilder/hooks/useSortableDragAndDrop';
import MenuItemAccordionSummary from '@kitman/modules/src/FormTemplates/FormBuilder/components/Form/Menu/MenuItem/MenuItemAccordionSummary';
import type { HumanInputFormElement } from '@kitman/modules/src/HumanInput/types/forms';
import { levelEnumLike } from '@kitman/modules/src/FormTemplates/FormBuilder/components/Form/Menu/utils/enum-likes';

import {
  setCurrentMenuGroupIndex,
  setCurrentMenuItemIndex,
} from '@kitman/modules/src/FormTemplates/redux/slices/formBuilderSlice';
import MenuItem from '../MenuItem';
import MenuGroupAccordionSummary from './MenuGroupAccordionSummary';
import { generateDefaultMenuItemTitleByIndex } from '../../utils/helpers';

type Props = {
  id: number,
  name: string,
  menuItems: Array<HumanInputFormElement>,
  elementId: string,
  menuGroupIndex: number,
};

const MenuGroup = ({
  id,
  name,
  menuItems,
  elementId,
  menuGroupIndex,
}: Props) => {
  const dispatch = useDispatch();

  const {
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
    dropAnimationConfig,
    sensors,
    activeDnDElementIndex,
    activeId,
  } = useSortableDragAndDrop(menuItems, levelEnumLike.menuItem, menuGroupIndex);

  const numberOfMenuItems = menuItems.length;
  const activeDnDMenuItem = menuItems[activeDnDElementIndex] || {};
  return (
    <Accordion
      onChange={() => {
        dispatch(setCurrentMenuGroupIndex(menuGroupIndex));
        dispatch(setCurrentMenuItemIndex(0));
      }}
    >
      <MenuGroupAccordionSummary
        id={id}
        name={name}
        elementId={elementId}
        numberOfMenuItems={numberOfMenuItems}
        menuGroupIndex={menuGroupIndex}
      />
      <AccordionDetails sx={{ padding: 0 }}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <MenuList sx={{ padding: 0 }}>
            <SortableContext
              items={menuItems.map((menuItem) => menuItem.id)}
              strategy={verticalListSortingStrategy}
            >
              {menuItems.map((menuItem, index) => {
                const menuItemElementId = menuItem.config.element_id;
                return (
                  <SortableItem id={menuItem.id} key={menuItem.id}>
                    <MuiMenuItem
                      key={menuItemElementId}
                      disableRipple
                      sx={{ padding: 0 }}
                    >
                      <MenuItem
                        id={menuItem.id}
                        name={
                          menuItem.config.title ??
                          generateDefaultMenuItemTitleByIndex({
                            menuGroupIndex,
                            menuItemIndex: index,
                          })
                        }
                        questions={menuItem.form_elements}
                        menuItemIndex={index}
                        menuGroupIndex={menuGroupIndex}
                        elementId={menuItemElementId}
                        isLastMenuItem={index === numberOfMenuItems - 1}
                      />
                    </MuiMenuItem>
                  </SortableItem>
                );
              })}
            </SortableContext>
            <DragOverlay dropAnimation={dropAnimationConfig}>
              {activeId ? (
                <MuiMenuItem disableRipple sx={{ padding: 0 }}>
                  <MenuItemAccordionSummary
                    isCurrentMenuItem
                    id={activeDnDMenuItem.id}
                    numberOfQuestions={
                      activeDnDMenuItem.form_elements?.length || 0
                    }
                    setIsAccordionExpanded={() => {}}
                    isAccordionExpanded={false}
                    elementId={activeDnDMenuItem.config.element_id}
                    onClickAccordionSummary={() => {}}
                    name={activeDnDMenuItem.config.title ?? i18n.t('Menu Item')}
                    menuGroupIndex={menuGroupIndex}
                    menuItemIndex={activeId}
                  />
                </MuiMenuItem>
              ) : null}
            </DragOverlay>
          </MenuList>
        </DndContext>
      </AccordionDetails>
    </Accordion>
  );
};

export default MenuGroup;
