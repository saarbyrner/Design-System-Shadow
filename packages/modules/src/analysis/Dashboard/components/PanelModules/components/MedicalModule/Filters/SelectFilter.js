// @flow
import { useMemo } from 'react';
import { CheckboxList, IconButton, Select } from '@kitman/components';
import { colors } from '@kitman/common/src/variables';
import _findIndex from 'lodash/findIndex';
import Panel from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/components/Panel/index';
import type { TableWidgetSourceSubtypes } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/types';
import { fullWidthMenuCustomStyles } from '@kitman/components/src/Select';

type Props = {
  untranslatedLabel: string,
  isLoading: boolean,
  options: Array<{
    label: string,
    value?: any,
    options?: Array<{ label: string, value?: any }>,
  }>,
  value: $Values<TableWidgetSourceSubtypes>,
  onChange: Function,
  onClickRemove: Function,
  singleSelect?: boolean,
  allowClearAll?: boolean,
  allowSelectAll?: boolean,
};

function SelectFilter(props: Props) {
  const fullOptions = useMemo(() => {
    const isGrouped =
      _findIndex(props.options, (option) => !!option?.options) > -1;
    const options = isGrouped
      ? props.options.flatMap(
          (optionsGroup) => optionsGroup?.options || optionsGroup
        )
      : props.options;

    return options;
  }, [props.options]);

  return (
    <Panel.Field
      styles={{
        '.checkboxList': {
          display: 'flex',
          '&__item': {
            marginRight: '10px',
          },
        },
      }}
    >
      <Panel.FieldTitle
        data-testid="SelectFilter|Title"
        styles={{
          display: 'flex',
          justifyContent: 'space-between',
          '.iconButton': {
            padding: 0,
            minWidth: 'auto',
            width: '20px',
            height: '20px',
            fontWeight: 'bold',
            color: colors.grey_100,
            '&::before': {
              fontSize: '16px',
            },
          },
        }}
      >
        <span>{props.untranslatedLabel}</span>
        <IconButton
          onClick={props.onClickRemove}
          icon="icon-close"
          isSmall
          isBorderless
        />
      </Panel.FieldTitle>

      {!props.isLoading && fullOptions.length <= 5 && (
        <CheckboxList
          data-testid="SelectFilter|CheckboxList"
          // $FlowIgnore Select and CheckboxList options will be the same in this case
          items={props.options}
          // $FlowIgnore Select and CheckboxList value will be the same in this case
          values={props.value}
          onChange={props.onChange}
          singleSelection={props.singleSelect}
          kitmanDesignSystem
        />
      )}

      {(fullOptions.length > 5 || props.isLoading) && (
        <Select
          data-testid="SelectFilter|Select"
          value={props.value}
          options={props.options}
          onChange={props.onChange}
          inlineShownSelection
          inlineShownSelectionMaxWidth={300}
          isLoading={props.isLoading}
          menuPosition="fixed"
          isMulti={!props.singleSelect}
          appendToBody
          selectAllGroups
          hideOnSearch
          allowSelectAll={props.allowSelectAll}
          allowClearAll={props.allowClearAll}
          customSelectStyles={fullWidthMenuCustomStyles}
          minMenuHeight={300}
        />
      )}
    </Panel.Field>
  );
}

export default SelectFilter;
