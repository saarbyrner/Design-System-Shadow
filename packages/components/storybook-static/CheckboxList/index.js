// @flow
import { useEffect, useState, useRef, Fragment } from 'react';
import type { SerializedStyles } from '@emotion/react';
import Checkbox from '../Checkbox';

export type ItemValue = number | string;

export type CheckboxListItem = {
  value: ItemValue,
  label: string,
  isDisabled?: boolean,
  nestedOptions?: Array<CheckboxListItem>,
};

export type Props = {
  items: Array<CheckboxListItem>,
  values?: Array<ItemValue>,
  onChange?: (items: ItemValue[]) => void,
  singleSelection?: boolean,
  kitmanDesignSystem?: boolean,
  clearAllOptions?: boolean,
  selectAllOptions?: boolean,
  liStyleOverride?: SerializedStyles,
};

const flattenNestedList = (list: Array<CheckboxListItem>) =>
  list.flatMap((obj) => {
    if (obj.nestedOptions) {
      return [obj.value, ...flattenNestedList(obj.nestedOptions)];
    }
    return obj.value;
  });

const CheckboxList = (props: Props) => {
  const [selectedItemsValues, setSelectedItemsValues] = useState(() =>
    props.selectAllOptions ? flattenNestedList(props.items) : props.values || []
  );
  const firstUpdate = useRef(true);

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

    if (props.onChange) {
      props.onChange(selectedItemsValues);
    }
  }, [selectedItemsValues]);

  useEffect(() => {
    if (props.clearAllOptions) {
      setSelectedItemsValues([]);
    }
  }, [props.clearAllOptions]);

  useEffect(() => {
    if (props.selectAllOptions) {
      setSelectedItemsValues(flattenNestedList(props.items));
    }
  }, [props.selectAllOptions, props.items]);

  const addSelectedItemsValues = (
    prevItemValues: Array<ItemValue>,
    itemValue: ItemValue
  ): Array<ItemValue> =>
    props.singleSelection ? [itemValue] : [...prevItemValues, itemValue];

  const toggleOption = (option) => {
    setSelectedItemsValues((prevSelectedItemsValues) =>
      prevSelectedItemsValues.includes(option)
        ? prevSelectedItemsValues.filter((value) => value !== option)
        : addSelectedItemsValues(prevSelectedItemsValues, option)
    );
  };

  // Expirimental nested checkbox list
  const toggleParentAndChildren = (parentOption) => {
    const { nestedOptions, value: parentValue } = parentOption;
    const childOptions = nestedOptions?.map((childOption) => childOption.value);

    setSelectedItemsValues((prevSelectedItemsValues) => {
      if (prevSelectedItemsValues.includes(parentValue)) {
        return prevSelectedItemsValues.filter(
          (value) => value !== parentValue && !childOptions?.includes(value)
        );
      }
      return [...prevSelectedItemsValues, parentValue, ...(childOptions || [])];
    });
  };

  const renderOptions = (options) => {
    return options.map((item) => (
      <Fragment key={item.value}>
        <li
          key={item.value}
          className="checkboxList__item"
          css={props.liStyleOverride}
        >
          <Checkbox
            id={`item_${item.value}`}
            toggle={() =>
              item.nestedOptions
                ? toggleParentAndChildren(item)
                : toggleOption(item.value)
            }
            isChecked={selectedItemsValues.includes(item.value)}
            label={item.label}
            isDisabled={item.isDisabled}
            kitmanDesignSystem={props.kitmanDesignSystem}
          />
        </li>
        {window.featureFlags['nested-checkbox-select'] &&
          item.nestedOptions && (
            <div className="checkboxList__nested">
              {renderOptions(item.nestedOptions)}
            </div>
          )}
      </Fragment>
    ));
  };

  return <ul className="checkboxList">{renderOptions(props.items)}</ul>;
};

CheckboxList.defaultProps = {
  singleSelection: false,
  kitmanDesignSystem: false,
};

export default CheckboxList;
