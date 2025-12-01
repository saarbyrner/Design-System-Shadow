// @flow
import _orderBy from 'lodash/orderBy';
import _groupBy from 'lodash/groupBy';
import _isArray from 'lodash/isArray';

import { type SelectOption } from '@kitman/components/src/types';
import { type StatusVariable } from '@kitman/common/src/types';
import {
  KITMAN_VARIABLE_CUSTOM_SOURCE_NAME,
  BENCHMARK_TESTING_VARIABLE_CUSTOM_SOURCE_NAME,
} from '@kitman/common/src/consts/analysis';

/**
 * includeSourceName() whether or not we should include the source name with the status name
 */
const getMustIncludeSourceName = (status: StatusVariable) =>
  status.source_key
    ? ['kitman:tv', 'kitman'].indexOf(status.source_key.split('|')[0]) === -1 ||
      status.source_name === BENCHMARK_TESTING_VARIABLE_CUSTOM_SOURCE_NAME
    : false;

/*
 * - Return the available variables formatted to the GroupedDropdown format.
 * - Add the unit if exists.
 * - Add the source if it’s not a Kitman one.
 * - Add isGroupOption heading objects for each of the unique item
 *   descriptions.
 * - Add ‘Kitman variable’ as a group option heading object for anything
 *   without a description.
 */
export const formatAvailableVariablesForGroupedDropdown = (
  availableVariables: Array<StatusVariable>
): Array<Object> => {
  const variables = availableVariables.map((variable) => {
    const unit = variable.localised_unit ? `(${variable.localised_unit})` : '';
    const source = getMustIncludeSourceName(variable)
      ? variable.source_name
      : '';

    return {
      key_name: variable.source_key,
      name: `${variable.name} ${unit}`,
      description: source === '' ? KITMAN_VARIABLE_CUSTOM_SOURCE_NAME : source,
    };
  });

  // Get group headings
  const uniqueDescriptions = [
    ...new Set(variables.map((option) => option.description)),
  ];
  const groupOptions = uniqueDescriptions.map((desc) => {
    return {
      name: desc === '' ? KITMAN_VARIABLE_CUSTOM_SOURCE_NAME : desc,
      isGroupOption: true,
      description: desc === '' ? KITMAN_VARIABLE_CUSTOM_SOURCE_NAME : desc,
    };
  });

  const groupedDropdownVariables = [];
  groupOptions.forEach((group) => {
    groupedDropdownVariables.push(group);
    variables.forEach((variable) => {
      if (variable.description === group.name) {
        groupedDropdownVariables.push(variable);
      } else if (
        variable.description === '' &&
        group.name === KITMAN_VARIABLE_CUSTOM_SOURCE_NAME
      ) {
        groupedDropdownVariables.push(variable);
      }
    });
  });
  return _orderBy(groupedDropdownVariables, 'description');
};
/*
 * - Return the available variables formatted to the Dropdown format
 * - Add the unit if existing
 * - Add the source if not kitman
 */
export const formatAvailableVariables = (
  availableVariables: Array<StatusVariable>
): Array<Object> =>
  availableVariables.map((variable) => {
    const unit = variable.localised_unit ? `(${variable.localised_unit})` : '';
    const source = getMustIncludeSourceName(variable)
      ? variable.source_name
      : '';

    return {
      id: variable.source_key,
      title: `${variable.name} ${unit}`,
      description: source,
    };
  });

/*
 * - Return the available variables formatted to the Select format
 * - Add the unit if existing
 */
export const formatAvailableVariablesForSelect = (
  availableVariables: Array<StatusVariable>
): Array<Object> =>
  availableVariables.map((variable) => {
    const unit = variable.localised_unit ? `(${variable.localised_unit})` : '';

    return {
      value: variable.source_key,
      label: `${variable.name} ${unit}`,
    };
  });

export const formatAvailableVariablesForGroupedSelect = (
  availableVariables: Array<StatusVariable>
): Array<SelectOption> => {
  const groupedVariables = _groupBy(availableVariables, (variable) => {
    return getMustIncludeSourceName(variable)
      ? variable.source_name
      : KITMAN_VARIABLE_CUSTOM_SOURCE_NAME;
  });
  const groupedOptions: Array<SelectOption> = Object.entries(
    groupedVariables
  ).map(([label, opts]): SelectOption => {
    const options = _isArray(opts)
      ? // $FlowIgnore[incompatible-use] Lodash guard not working with Flow
        opts.map((variable) => {
          const unit = variable.localised_unit
            ? `(${variable.localised_unit})`
            : '';

          return {
            value: variable.source_key,
            label: `${variable.name} ${unit}`,
          };
        })
      : [];

    return {
      label,
      options,
    };
  });

  const orderdOptions: SelectOption[] = _orderBy(groupedOptions, 'label');

  return orderdOptions;
};
