// @flow
import { withNamespaces } from 'react-i18next';
import type { ComponentType } from 'react';
import { Select } from '@kitman/components';
import { useSelector } from 'react-redux';
import { processMenuItems } from '@kitman/modules/src/HumanInput/shared/components/ExportSidePanel/components/ExportColumns/utils';
import type { Field } from '@kitman/modules/src/HumanInput/shared/redux/slices/humanInputSlice';
import { getExportableFieldsFactory } from '@kitman/services/src/services/exports/generic/redux/selectors/genericExportsSelectors';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  value: Array<Field>,
  onUpdate: Function,
};

const ExportColumns = ({ t, value, onUpdate }: I18nProps<Props>) => {
  const exportableFields = useSelector(getExportableFieldsFactory());
  const exportableColumnsItems = exportableFields.flatMap(
    (group) => group.children
  );
  const options = processMenuItems(exportableColumnsItems);
  const selectedValues = value?.map((item) => {
    return item.address
      ? `${item.field}-${item.object}-${item.group}-${item.address}`
      : `${item.field}-${item.object}-${item.group}`;
  });

  return (
    <Select
      isMulti
      isSearchable
      isClearable
      appendToBody
      selectAllGroups
      multiSelectSubMenu
      value={selectedValues}
      options={options}
      onChange={(selectedColumnsIds) => {
        onUpdate(
          selectedColumnsIds.map((selectedColumnId) => {
            const [field, object, group, address] = selectedColumnId.split('-');

            return { field, object, group, address };
          })
        );
      }}
      label={t('Columns')}
    />
  );
};

export const ExportColumnsTranslated: ComponentType<Props> =
  withNamespaces()(ExportColumns);
export default ExportColumns;
