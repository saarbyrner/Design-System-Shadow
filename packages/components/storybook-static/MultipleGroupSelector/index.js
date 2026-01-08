// @flow
import { withNamespaces } from 'react-i18next';
import _cloneDeep from 'lodash/cloneDeep';
import { DropdownWrapper, Checkbox } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { GroupItem, GroupItems, GroupSelections } from './types';

type Props = {
  label?: string,
  showDropdownButton: boolean,
  maxHeight: number,
  groupItems: GroupItems,
  activeSelections: GroupSelections,
  onUpdatedSelection: Function,
};

const MultipleGroupSelector = (props: I18nProps<Props>) => {
  const onClickGroupSubItem = (checkboxStatus) => {
    // Split the checkboxStatus id in two at the first colon encountered
    const splitIds = checkboxStatus.id.split(/:([^]+)/).filter((item) => item);
    const groupId = splitIds[0];
    const subGroupId = splitIds[1];

    const updatedSelection = _cloneDeep(props.activeSelections);
    if (updatedSelection[groupId] !== undefined) {
      const subGroupIndex = updatedSelection[groupId].indexOf(subGroupId);
      const updatedGroup =
        subGroupIndex === -1
          ? [...updatedSelection[groupId], subGroupId]
          : [
              ...updatedSelection[groupId].slice(0, subGroupIndex),
              ...updatedSelection[groupId].slice(subGroupIndex + 1),
            ];
      updatedSelection[groupId] = updatedGroup;
    } else {
      updatedSelection[groupId] = [subGroupId];
    }

    if (props.onUpdatedSelection) {
      props.onUpdatedSelection(updatedSelection);
    }
  };

  const onClickSelectAllForGroup = (group) => {
    const updatedSelection = _cloneDeep(props.activeSelections);
    const allGroupSubItems = group.subItems.map((subItem) => subItem.id);
    updatedSelection[group.id] = allGroupSubItems;

    if (props.onUpdatedSelection) {
      props.onUpdatedSelection(updatedSelection);
    }
  };

  const onClickClearAllForGroup = (group) => {
    const updatedSelection = _cloneDeep(props.activeSelections);
    if (updatedSelection[group.id] !== undefined) {
      delete updatedSelection[group.id];
    }

    if (props.onUpdatedSelection) {
      props.onUpdatedSelection(updatedSelection);
    }
  };

  const getSelectedItemNames = () => {
    const selectedItemNames = [];
    props.groupItems.forEach((group) => {
      if (props.activeSelections[group.id] !== undefined) {
        if (group.subItems) {
          group.subItems.forEach((subItem) => {
            if (props.activeSelections[group.id].includes(subItem.id)) {
              selectedItemNames.push(subItem.name);
            }
          });
        }
      }
    });

    return selectedItemNames.join(', ');
  };

  const addGroupSubItems = (group: GroupItem) => {
    return (
      <ul className="multipleGroupSelector__subItemList">
        {group.subItems?.map((subItem) => (
          <li
            key={`${group.id}:${subItem.id}`}
            className="multipleGroupSelector__subItem"
          >
            <Checkbox
              id={`${group.id}:${subItem.id}`}
              label={subItem.name}
              toggle={onClickGroupSubItem}
              isChecked={
                props.activeSelections[group.id] &&
                props.activeSelections[group.id].indexOf(subItem.id) !== -1
              }
            />
          </li>
        ))}
      </ul>
    );
  };

  const groupEntries = (
    <ul className="multipleGroupSelector__groupList">
      {props.groupItems.map((group) => (
        <li className="multipleGroupSelector__section" key={group.id}>
          <header>
            <span className="multipleGroupSelector__groupName">
              {group.name}
            </span>
            <span>
              <span
                className="multipleGroupSelector__selectAll"
                onClick={() => onClickSelectAllForGroup(group)}
              >
                {props.t('Select All')}
              </span>
              <span
                className="multipleGroupSelector__clearAll"
                onClick={() => onClickClearAllForGroup(group)}
              >
                {props.t('Clear')}
              </span>
            </span>
          </header>
          {addGroupSubItems(group)}
        </li>
      ))}
    </ul>
  );

  return (
    <DropdownWrapper
      label={props.label ?? undefined}
      hasSearch={false}
      showDropdownButton={props.showDropdownButton}
      dropdownTitle={getSelectedItemNames()}
      maxHeight={props.maxHeight ? props.maxHeight : 390}
    >
      <div className="multipleGroupSelector">{groupEntries}</div>
    </DropdownWrapper>
  );
};

MultipleGroupSelector.defaultProps = {
  label: '',
  showDropdownButton: true,
  maxHeight: 390,
};

export const MultipleGroupSelectorTranslated = withNamespaces()(
  MultipleGroupSelector
);
export default MultipleGroupSelector;
