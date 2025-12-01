/* eslint-disable react/jsx-no-bind */
// @flow
import structuredClone from 'core-js/stable/structured-clone';
import { withNamespaces } from 'react-i18next';
import { useState, type ComponentType } from 'react';

import { TextButton } from '@kitman/components';
import {
  getNewGroupId,
  getNewItemId,
} from '@kitman/modules/src/OrganisationSettings/src/components/CalendarSettings/utils/helpers';
import type { Option } from '@kitman/components/src/Select';
import type { I18nProps } from '@kitman/common/src/types/i18n';

import { EventTypeGroupTranslated as EventTypeGroup } from './EventTypeGroup';
import { EventTypeListTranslated as EventTypeList } from './EventTypeList';
import styles from './utils/styles';
import { UNGROUPED_ID } from '../utils/consts';
import { useGetCalendarSettingsPermissions } from '../../utils/hooks';
import { duplicateNameCustomValidation } from '../../utils/helpers';
import type {
  GroupedEventTypesArray,
  NewCustomEvent,
  NewGroup,
} from '../utils/types';
import type {
  ChangeNameData,
  ChangeSquadsData,
  ChangeColorData,
} from './utils/types';

import { Indexes } from '../types';

type Props = {
  formData: GroupedEventTypesArray,
  onFormChange: (newFormData: GroupedEventTypesArray) => void,
  ungroupedIndex: number,
  eventNamesSet: Set<string>,
  allSquadsOptions: Array<Option>,
};

const EditForm = ({
  formData,
  onFormChange,
  ungroupedIndex,
  eventNamesSet,
  t,
  allSquadsOptions,
}: I18nProps<Props>) => {
  const [groupIndexWithNewItem, setGroupIndexWithNewItem] = useState<
    number | null
  >(null);

  const { canCreateCustomEvents } = useGetCalendarSettingsPermissions();

  const createNewChild = (): NewCustomEvent => ({
    name: '',
    id: getNewItemId(),
    squads: [],
    is_archived: false,
    is_selectable: true,
  });

  const addNewGroup = ({ isUngrouped }: { isUngrouped: boolean }) => {
    const clonedFormData: GroupedEventTypesArray = structuredClone(formData);
    const newChildren: Array<NewCustomEvent> = [createNewChild()];
    clonedFormData.push(
      ({
        name: isUngrouped ? t('Ungrouped') : '',
        id: isUngrouped ? UNGROUPED_ID : getNewGroupId(),
        squads: [],
        children: newChildren,
        shared: false,
      }: NewGroup)
    );
    onFormChange(clonedFormData);
  };

  const addEventToGroup = (groupIndex: number) => {
    setGroupIndexWithNewItem(groupIndex);

    const clonedFormData = structuredClone(formData);
    clonedFormData[groupIndex].children.push(createNewChild());
    onFormChange(clonedFormData);
  };

  const removeEventFromGroup = (groupIndex: number, eventIndex: number) => {
    const clonedFormData = structuredClone(formData);
    clonedFormData[groupIndex].children.splice(eventIndex, 1);
    onFormChange(clonedFormData);
  };

  const changeName = (
    groupIndex: number,
    { newName, eventIndex }: ChangeNameData
  ) => {
    const trimmedName = newName.trim();
    const clonedFormData = structuredClone(formData);
    if (eventIndex === null) {
      clonedFormData[groupIndex].name = trimmedName;
    } else {
      clonedFormData[groupIndex].children[eventIndex].name = trimmedName;
    }

    onFormChange(clonedFormData);
  };

  const getChangeIsSharedGroupHandler = (groupIndex: number) => (value: boolean) => {
    const clonedFormData = structuredClone(formData);
    clonedFormData[groupIndex].shared = value;
    onFormChange(clonedFormData);
  };

  const getChangeIsSharedUngroupedHandler = (groupIndex: number) => (eventIndex: number, value: boolean) => {
    const clonedFormData = structuredClone(formData);
    clonedFormData[groupIndex].children[eventIndex].shared = value;
    onFormChange(clonedFormData);
  }

  const changeSquads = (
    groupIndex: number,
    { newSquadIds, eventIndex }: ChangeSquadsData
  ) => {
    const clonedFormData = structuredClone(formData);
    if (eventIndex === null) {
      const group = clonedFormData[groupIndex];
      group.squads = newSquadIds;
      // the children cannot have a squad that the parent doesn't have
      const parentSelectedSquads = new Set(newSquadIds);
      group.children.forEach(({ squads: childrenSquads }, index) => {
        const squadsIntersectedWithParentSelectedSquads = childrenSquads.filter(
          (squadId) => parentSelectedSquads.has(squadId)
        );
        group.children[index].squads =
          squadsIntersectedWithParentSelectedSquads;
      });
    } else {
      clonedFormData[groupIndex].children[eventIndex].squads = newSquadIds;
    }
    onFormChange(clonedFormData);
  };

  const changeColor = (
    groupIndex: number,
    { newColor, eventIndex }: ChangeColorData
  ) => {
    const clonedFormData = structuredClone(formData);
    if (eventIndex === Indexes.AllEvents) {
      clonedFormData[groupIndex].children.forEach((child) => {
        // eslint-disable-next-line no-param-reassign
        child.colour = newColor;
      });
    } else {
      clonedFormData[groupIndex].children[eventIndex].colour = newColor;
    }
    onFormChange(clonedFormData);
  };

  return (
    <>
      {formData.map((group, index) => {
        const { id, children } = group;
        const boundRemoveEventFromGroup = removeEventFromGroup.bind(
          null,
          index
        );
        const boundChangeName = changeName.bind(null, index);
        const boundChangeSquads = changeSquads.bind(null, index);
        const boundChangeColor = changeColor.bind(null, index);
        const boundChangeIsGroupShared = getChangeIsSharedGroupHandler(index);
        const boundChangeIsShared = getChangeIsSharedUngroupedHandler(index);

        const boundDuplicateNameCustomValidation =
          duplicateNameCustomValidation.bind(null, t, eventNamesSet);

        const isGroupWithNewItem = groupIndexWithNewItem === index;
        return (
          <div key={`parent_${id}`}>
            {id === UNGROUPED_ID ? (
              <div css={styles.group}>
                 <EventTypeList
                  onSharedChange={boundChangeIsShared}
                  eventTypes={children}
                  onRemovingNewEventFromGroup={boundRemoveEventFromGroup}
                  isGroupWithNewItem={isGroupWithNewItem}
                  onChangingName={boundChangeName}
                  onChangingSquads={boundChangeSquads}
                  onChangingColor={boundChangeColor}
                  duplicateNameCustomValidation={
                    boundDuplicateNameCustomValidation
                  }
                  allSquadsOptions={allSquadsOptions}
                 />
              </div>
            ) : (
              <EventTypeGroup
                group={group}
                onAddingEventToGroup={addEventToGroup.bind(null, index)}
                onRemovingNewEventFromGroup={boundRemoveEventFromGroup}
                isGroupWithNewItem={isGroupWithNewItem}
                onChangingName={boundChangeName}
                onChangingSquads={boundChangeSquads}
                onChangingColor={boundChangeColor}
                onSharedChange={boundChangeIsGroupShared}
                duplicateNameCustomValidation={
                  boundDuplicateNameCustomValidation
                }
                allSquadsOptions={allSquadsOptions}
                canCreateCustomEvents={canCreateCustomEvents}
              />
            )}
          </div>
        );
      })}
      {canCreateCustomEvents && (
        <div css={styles.addEventsAndGroupsButtonContainer}>
          <TextButton
            size="large"
            type="secondary"
            text={t('Add New Event')}
            kitmanDesignSystem
            onClick={() => {
              if (ungroupedIndex === -1) addNewGroup({ isUngrouped: true });
              else addEventToGroup(ungroupedIndex);
            }}
          />
          <TextButton
            size="large"
            type="secondary"
            text={t('Add Group')}
            kitmanDesignSystem
            onClick={() => addNewGroup({ isUngrouped: false })}
          />
        </div>
      )}
    </>
  );
};

export const EditFormTranslated: ComponentType<Props> =
  withNamespaces()(EditForm);
export default EditForm;
