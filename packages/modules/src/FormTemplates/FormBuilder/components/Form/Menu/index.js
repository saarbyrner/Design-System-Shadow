// @flow
import { colors } from '@kitman/common/src/variables';
import { useSelector } from 'react-redux';
import { DndContext, closestCenter, DragOverlay } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import i18n from '@kitman/common/src/utils/i18n';
import MenuGroupAccordionSummary from '@kitman/modules/src/FormTemplates/FormBuilder/components/Form/Menu/MenuGroup/MenuGroupAccordionSummary';
import SortableItem from '@kitman/modules/src/FormTemplates/FormBuilder/components/Form/SortableItem';
import { getFormMenu } from '@kitman/modules/src/FormTemplates/redux/selectors/formBuilderSelectors';
import { MenuItem, MenuList, Box } from '@kitman/playbook/components';
import type { HumanInputFormElement } from '@kitman/modules/src/HumanInput/types/forms';
import { levelEnumLike } from '@kitman/modules/src/FormTemplates/FormBuilder/components/Form/Menu/utils/enum-likes';
import useSortableDragAndDrop from '@kitman/modules/src/FormTemplates/FormBuilder/hooks/useSortableDragAndDrop';

import MenuGroup from './MenuGroup';
import Header from './Header';
import { menuStructureHeight } from '../utils/consts';
import { menuWidth } from './utils/consts';
import { generateDefaultMenuGroupTitleByIndex } from '../utils/helpers';

const FormMenu = () => {
  const formMenuStructure: Array<HumanInputFormElement> =
    useSelector(getFormMenu);
  const {
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
    dropAnimationConfig,
    sensors,
    activeDnDElementIndex,
    activeId,
  } = useSortableDragAndDrop(formMenuStructure, levelEnumLike.menuGroup);

  const activeDnDMenuGroup = formMenuStructure[activeDnDElementIndex] || {};

  return (
    <Box
      sx={{
        borderRight: `1px solid ${colors.grey_disabled}`,
        minWidth: menuWidth,
      }}
    >
      <Header />
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <MenuList
          sx={{
            padding: 0,
            overflowX: 'hidden',
            overflowY: 'auto',
            height: menuStructureHeight,
          }}
        >
          <SortableContext
            items={formMenuStructure.map(({ id }) => id)}
            strategy={verticalListSortingStrategy}
          >
            {formMenuStructure.map((menuGroup, index) => {
              const elementId = menuGroup.config.element_id;
              return (
                <SortableItem id={menuGroup.id} key={elementId}>
                  <MenuItem
                    key={elementId}
                    disableRipple
                    sx={{
                      padding: 0,
                    }}
                  >
                    <MenuGroup
                      id={menuGroup.id}
                      menuItems={menuGroup.form_elements}
                      name={
                        menuGroup.config.title ??
                        generateDefaultMenuGroupTitleByIndex(index)
                      }
                      elementId={elementId}
                      menuGroupIndex={index}
                    />
                  </MenuItem>
                </SortableItem>
              );
            })}
          </SortableContext>
          <DragOverlay dropAnimation={dropAnimationConfig}>
            {activeId ? (
              <MenuItem disableRipple sx={{ padding: 0 }}>
                <MenuGroupAccordionSummary
                  id={activeDnDMenuGroup.id}
                  name={activeDnDMenuGroup.config.title ?? i18n.t('Section')}
                  elementId={activeDnDMenuGroup.config.element_id}
                  numberOfMenuItems={activeDnDMenuGroup.form_elements.length}
                  menuGroupIndex={activeId}
                />
              </MenuItem>
            ) : null}
          </DragOverlay>
        </MenuList>
      </DndContext>
    </Box>
  );
};

export default FormMenu;
