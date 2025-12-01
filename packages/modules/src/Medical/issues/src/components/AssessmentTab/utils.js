// @flow
import moment from 'moment';
import i18n from '@kitman/common/src/utils/i18n';
import type { columnCellDataType, responseDataRow } from './types';

const sectionFormatter = (columnCellData: columnCellDataType) => {
  const sectionValue = columnCellData.row.column_section;
  return <span className="mainValue sectionValue">{sectionValue}</span>;
};

const dateFormatter = (columnCellData: columnCellDataType) => {
  const columnKey = columnCellData.column.key;
  const columnValue = columnCellData.row[columnKey];

  return <div className={columnValue.backgroundAlert}>{columnValue.value}</div>;
};

const baselineFormatter = (columnCellData: columnCellDataType) => {
  const baselineValue = columnCellData.row.column_baseline;
  if (baselineValue.includes('/')) {
    const split = baselineValue.split('/');
    return (
      <>
        <span className="mainValue">{split[0]}</span>
        <span className="baselineSum"> /{split[1]}</span>
      </>
    );
  }
  return <span className="mainValue">{baselineValue}</span>;
};

const buildDataTableHeaderData = (responseData: Array<responseDataRow>) => {
  if (responseData.length === 0) {
    return [];
  }

  const columns = [];

  Object.entries(responseData[0]).forEach(([key, value]) => {
    if (key === 'column_baseline') {
      columns.push({
        name: i18n.t('Baseline'),
        key,
        width: 100,
        frozen: true,
        sticky: 'left',
        formatter: baselineFormatter,
      });
    } else if (key === 'column_section') {
      columns.push({
        name: i18n.t('Section'),
        key,
        frozen: true,
        width: 277,
        sticky: 'left',
        formatter: sectionFormatter,
      });
    } else if (typeof value === 'object' && value) {
      columns.push({
        name: moment(value.date).format('MMM DD'),
        key,
        width: 100,
        formatter: dateFormatter,
      });
    }
  });
  return columns;
};

export default buildDataTableHeaderData;
