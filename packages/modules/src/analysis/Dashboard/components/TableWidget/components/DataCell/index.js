// @flow
import { withNamespaces } from 'react-i18next';
import classNames from 'classnames';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type {
  TableWidgetCellData,
  TableWidgetFormatRule,
  DynamicRowData,
} from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/types';
import {
  getCellColour,
  getCellDetails,
  getFormattedCellValue,
} from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/utils';
import colors from '@kitman/common/src/variables/colors';
import { NOT_AVAILABLE } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/consts';

import Table from '../Table';

type Props = {
  columnData: Array<TableWidgetCellData>,
  id: number | string,
  orderedFormattingRules: Array<TableWidgetFormatRule>,
  calculation: string,
  isLoading: boolean,
  rowData: DynamicRowData,
};

const DataCell = (props: I18nProps<Props>) => {
  if (props.isLoading) {
    return <Table.LoadingCell />;
  }

  const isDynamic = props.rowData?.isDynamic;
  const label = props.rowData?.label;
  const isChildRow = isDynamic && label;

  const cellDetails = getCellDetails(props.columnData, props.id, props.rowData);

  const isForbidden = cellDetails?.status === 'FORBIDDEN';

  const classes = classNames('tableWidget__dataCell', {
    'tableWidget__dataCell--forbidden': isForbidden,
  });

  const cellStyle = isForbidden
    ? {}
    : getCellColour(
        props.orderedFormattingRules,
        cellDetails?.value,
        props.calculation,
        ...(isChildRow ? [colors.neutral_100] : [])
      );

  const title =
    cellDetails?.value === NOT_AVAILABLE.value &&
    props.t('Grouping not available');

  return (
    <td className={classes} style={cellStyle} title={title}>
      {getFormattedCellValue(cellDetails?.value, props.calculation)}
    </td>
  );
};

export default DataCell;
export const DataCellTranslated = withNamespaces()(DataCell);
