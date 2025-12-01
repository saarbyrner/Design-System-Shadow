// @flow
/* eslint-disable react-hooks/rules-of-hooks */

import type { Node } from 'react';
import { useSelector } from 'react-redux';
import {
  getElementFactory,
  getFieldValueFactory,
} from '@kitman/modules/src/HumanInput/shared/redux/selectors/formStateSelectors';

import type {
  SelectOption,
  HumanInputFormElement,
} from '@kitman/modules/src/HumanInput/types/forms';
import { useGetFormDataSourceItemsQuery } from '@kitman/services/src/services/humanInput/humanInput';

type Props = {
  element: HumanInputFormElement,
  children: Function,
};

type RenderArgs = {
  selectOptions: Array<SelectOption>,
};

const args = (options: Array<SelectOption>): RenderArgs => {
  return {
    selectOptions: options,
  };
};

const SelectOptions = (props: Props): Node => {
  const {
    data_source: dataSource,
    items,
    custom_params: customParams,
  } = props.element.config;

  const dependentDataSourceElement = useSelector(
    getElementFactory(customParams?.data_depends_on || '')
  );

  const dependendDataSourceElementFormAnswer = useSelector(
    getFieldValueFactory(dependentDataSourceElement.id)
  );

  if (customParams?.data_depends_on) {
    const { data: dependentDataSourceOptions = [] } =
      useGetFormDataSourceItemsQuery(
        dependentDataSourceElement.config.data_source
      );
    const childrenDataOptions =
      dependentDataSourceOptions.find(
        ({ value: optionValue }) =>
          optionValue === dependendDataSourceElementFormAnswer
      )?.children || [];

    return props.children(args(childrenDataOptions));
  }

  if (items) return props.children(args(items));

  const { data: dropdownOptions = [] } = useGetFormDataSourceItemsQuery(
    dataSource,
    { skip: !dataSource }
  );

  return props.children(args(dropdownOptions));
};

export default SelectOptions;
