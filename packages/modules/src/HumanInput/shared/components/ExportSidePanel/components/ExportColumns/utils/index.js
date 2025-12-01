// @flow
import type { Field } from '@kitman/services/src/services/exports/generic/redux/services/types';

type Option = {
  label: string,
  value: string,
};

export const processChildren = (
  children: ?Array<Field>,
  group: ?string
): Array<Option> => {
  const result = [];
  let itemValue = '';

  children?.forEach((item) => {
    if (item.type === 'menu_item' || item.type === 'group') {
      // if the item is type menu_item or group, process their children with recursion
      result.push(...processChildren(item.children, item.key));
    } else {
      // if the item does not have children, process it as an option with label and value

      if (item.field && item.object && group) {
        itemValue = item.address
          ? `${item.field}-${item.object}-${group}-${item.address}`
          : `${item.field}-${item.object}-${group}`;
      }

      result.push({
        label: item.label,
        value: itemValue,
      });
    }
  });

  return result;
};

export const processMenuItems = (
  menuItems: Array<Field>
): Array<{ label: string, options: Array<Option> }> => {
  return menuItems.map((item) => {
    const groupLabel = item.label;
    const options = processChildren(item.children, item?.key);

    return {
      label: groupLabel,
      options,
    };
  });
};
