// @flow
import { useState, useEffect } from 'react';
import classNames from 'classnames';
import { withNamespaces, setI18n } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import type { ButtonSize } from '@kitman/components/src/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import {
  Checkbox,
  DropdownWrapper,
  MultipleCheckboxChecker,
} from '@kitman/components';

// set the i18n instance
setI18n(i18n);

export type MultiSelectDropdownItem = {
  id: string,
  description?: string,
  name: string,
  isGroupOption?: boolean,
};

export type Items = Array<MultiSelectDropdownItem>;

type Props = {
  customClass: string,
  hasApply: boolean,
  buttonSize?: ButtonSize,
  hasSearch: boolean,
  hasSelectAll: boolean,
  isOptional: boolean,
  label: string,
  dropdownTitle?: string,
  listItems: Items,
  onApply: Function,
  onItemSelect: Function,
  onSelectAll: Function,
  selectedItems: Array<string | number>,
  disabledItems: Array<$PropertyType<MultiSelectDropdownItem, 'id'>>,
  showDropdownButton: boolean,
  disabled?: boolean,
  invalid?: ?boolean,
  emptyText?: string,
};

function MultiSelectDropdown(props: I18nProps<Props>) {
  const [dropdownTitle, setDropdownTitle] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const classes = classNames('multiSelectDropdown', {
    'multiSelectDropdown--noButton': !props.showDropdownButton,
  });

  const updateDropdownTitle = () => {
    const selectedListItems = props.listItems.filter(
      (listItem) =>
        props.selectedItems.includes(listItem.id.toString()) ||
        props.selectedItems.includes(listItem.id)
    );
    if (selectedListItems.length) {
      setDropdownTitle(
        selectedListItems
          .map((item) =>
            item.description ? `${item.name} - ${item.description}` : item.name
          )
          .join(', ')
      );
    } else {
      setDropdownTitle('');
    }
  };

  useEffect(() => {
    if (!props.hasApply) {
      updateDropdownTitle();
    }
  });

  const getSelectAllType = () => {
    const someItemsSelected = props.selectedItems.length > 0;
    const allItemsSelected =
      someItemsSelected &&
      props.selectedItems.length === props.listItems.length;

    let type = 'EMPTY';
    if (someItemsSelected) {
      type = 'PARTIALLY_CHECKED';
    }
    if (allItemsSelected) {
      type = 'ALL_CHECKED';
    }
    return type;
  };

  const getListItems = (hasSelectAll, listItems, onSelectAll, onItemSelect) => {
    const items = listItems.filter(
      (value) =>
        // when checking if any item matches the given searchTerm
        // we replace the itemCount [eg: (25)] with an empty string
        // otherwise they would be searchable
        value.name
          .replace(/\((\d+)\)/g, '')
          .trim()
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (value.description &&
          value.description
            .trim()
            .toLowerCase()
            .includes(searchTerm.toLowerCase()))
    );

    return (
      <ul className={classes}>
        {/* Select All */}
        {hasSelectAll && items.length ? (
          <li
            className="multiSelectDropdown__selectAll"
            onClick={() => onSelectAll(items)}
          >
            <MultipleCheckboxChecker
              type={getSelectAllType()}
              onClick={() => onSelectAll(items)}
            />
            <span className="multiSelectDropdown__selectAllText">
              {props.t('Select All')}
            </span>
          </li>
        ) : null}
        {items.length ? (
          items.map((item) => (
            <li
              className={classNames('multiSelectDropdown__item', {
                'multiSelectDropdown__item--bold': item.isGroupOption,
              })}
              key={item.id}
            >
              <Checkbox
                id={item.id.toString()} // checkbox expects id to be a string
                isChecked={
                  props.selectedItems.includes(item.id) ||
                  props.selectedItems.includes(item.id.toString())
                }
                label={item.name}
                secondaryLabel={item.description ? `- ${item.description}` : ''}
                toggle={(checkbox) => {
                  // In the treatment tracker modal, props.selectedItems is a
                  // stringified array. We can't use filter on a string.
                  // We need to investigate why we stringify the selected items
                  // so we can remove this condition.
                  if (props.selectedItems.filter) {
                    const newSelectedItems = checkbox.checked
                      ? [...props.selectedItems, item.id]
                      : props.selectedItems.filter(
                          (selectedItemId) => selectedItemId !== item.id
                        );
                    onItemSelect(checkbox, item.name, newSelectedItems);
                  } else {
                    onItemSelect(checkbox, item.name);
                  }
                }}
                isDisabled={props.disabledItems.includes(item.id.toString())}
              />
            </li>
          ))
        ) : (
          <li className="multiSelectDropdown__noresults">
            {`${props.t('Nothing found for')} `}
            &#34;
            <span>{searchTerm}</span>
            &#34;
          </li>
        )}
      </ul>
    );
  };

  const getEmptyText = () => (
    <div className="multiSelectDropdown__emptyText">
      {props.emptyText || props.t('No items available')}
    </div>
  );

  return (
    <DropdownWrapper
      label={props.label}
      hasSearch={props.hasSearch}
      hasApply={props.hasApply}
      buttonSize={props.buttonSize}
      showDropdownButton={props.showDropdownButton}
      dropdownTitle={
        props.dropdownTitle || props.dropdownTitle === ''
          ? props.dropdownTitle
          : dropdownTitle
      }
      searchTerm={searchTerm}
      onTypeSearchTerm={(typpedSearchTerm) => {
        setSearchTerm(typpedSearchTerm);
      }}
      onApply={() => {
        updateDropdownTitle();
        props.onApply();
      }}
      isOptional={props.isOptional}
      disabled={props.disabled}
      customClass={
        props.invalid
          ? `${props.customClass} dropdownWrapper--invalid`
          : props.customClass
      }
      maxHeight={props.hasSearch ? '270' : null}
    >
      {props.listItems.length > 0
        ? getListItems(
            props.hasSelectAll,
            props.listItems,
            props.onSelectAll,
            props.onItemSelect
          )
        : getEmptyText()}
    </DropdownWrapper>
  );
}

MultiSelectDropdown.defaultProps = {
  customClass: '',
  hasApply: false,
  hasSearch: false,
  hasSelectAll: false,
  isOptional: false,
  label: '',
  listItems: [],
  onApply: () => {},
  onItemSelect: () => {},
  onSelectAll: () => {},
  selectedItems: [],
  disabledItems: [],
  showDropdownButton: true,
  invalid: false,
};

export default MultiSelectDropdown;
export const MultiSelectDropdownTranslated =
  withNamespaces()(MultiSelectDropdown);
