// @flow
import { withNamespaces } from 'react-i18next';
import { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import moment from 'moment-timezone';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import type { ImportsItem, ImportType } from '@kitman/common/src/types/Imports';
import type { Cell } from '@kitman/components/src/DataGrid';
import { DataGrid } from '@kitman/components';
import type { ImportFilters } from '@kitman/services/src/services/imports/importMassAthletes';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import style from '../styles';
import Filters from '../Filters/index';

type Props = {
  isNextPageAvailable: boolean,
  fetchedData: Array<ImportsItem>,
  isLoading: boolean,
  fetchMoreItems: Function,
  filters: ImportFilters,
  setFilters: Function,
};

const ImportList = (props: I18nProps<Props>) => {
  const [rows, setRows] = useState([]);
  const columns = [
    {
      id: 'name',
      content: props.t('Name'),
      isHeader: true,
    },
    {
      id: 'import_type',
      content: props.t('Import Type'),
      isHeader: true,
    },
    {
      id: 'created_at',
      content: props.t('Created Date & Time'),
      isHeader: true,
    },
    {
      id: 'download_link',
      content: props.t('Download link'),
      isHeader: true,
    },
    {
      id: 'status',
      content: props.t('Status'),
      isHeader: true,
    },
    {
      id: 'creator',
      content: props.t('Creator'),
      isHeader: true,
    },
    {
      id: 'errors',
      content: props.t('Errors'),
      isHeader: true,
    },
  ];

  const getStatusIndicator = (
    itemStatus: $PropertyType<ImportsItem, 'status'>
  ) => {
    if (itemStatus === 'pending' || itemStatus === 'running') {
      return (
        <span
          css={css`
            ${style.statusIndicator} ${style.inProgressStatus}
          `}
        >
          {props.t('In progress')}
        </span>
      );
    }
    if (itemStatus === 'completed') {
      return (
        <span
          css={css`
            ${style.statusIndicator} ${style.successStatus}
          `}
        >
          {props.t('Completed')}
        </span>
      );
    }
    if (itemStatus === 'errored') {
      return (
        <span
          css={css`
            ${style.statusIndicator} ${style.errorStatus}
          `}
        >
          {props.t('Error')}
        </span>
      );
    }
    return null;
  };

  const getImportTypeText = (importType: ImportType) => {
    switch (importType) {
      case 'athlete_import': {
        return props.t('Athlete Import');
      }
      case 'user_import': {
        return props.t('Staff Import');
      }
      case 'official_import': {
        return props.t('Official Import');
      }
      case 'scout_import': {
        return props.t('Scout Import');
      }
      default: {
        return '';
      }
    }
  };

  const getRowCellContent = (columnCell: Cell, importedItem: ImportsItem) => {
    switch (columnCell.id) {
      case 'name': {
        return (
          <div>
            {importedItem.attachments?.length
              ? importedItem.attachments.map((attachment) => (
                  <div>{attachment?.filename}</div>
                ))
              : '--'}
          </div>
        );
      }
      case 'import_type': {
        return getImportTypeText(importedItem.import_type);
      }
      case 'created_at': {
        return DateFormatter.formatStandard({
          date: moment(importedItem.created_at),
          showTime: true,
        });
      }
      case 'download_link': {
        return (
          <span css={style.downloadLink}>
            {importedItem.status === 'completed' ? (
              <>
                <i className="icon-link" />
                <a
                  href={importedItem.attachments[0]?.url || ''}
                  title={importedItem.name}
                >
                  {props.t('Link')}
                </a>
              </>
            ) : (
              <span>--</span>
            )}
          </span>
        );
      }
      case 'creator': {
        return importedItem.created_by?.fullname;
      }
      case 'status': {
        return getStatusIndicator(importedItem.status);
      }
      case 'errors': {
        if (importedItem.import_errors?.length === 0) return <span>--</span>;

        return (
          <ul css={style.errorList}>
            {importedItem.import_errors?.map((error) => (
              <li>{error.error}</li>
            ))}
          </ul>
        );
      }
      default: {
        return null;
      }
    }
  };

  const getRowCellStyle = (columnCell: Cell) => {
    return columnCell.id === 'errors'
      ? css`
          max-width: 100%;
          padding: 0 !important;
        `
      : null;
  };

  const buildRowCells = (importedItem: ImportsItem) => {
    const itemCells = [];
    columns.forEach((columnCell) => {
      itemCells.push({
        id: columnCell.id,
        content: getRowCellContent(columnCell, importedItem),
        style: getRowCellStyle(columnCell),
      });
    });
    return itemCells;
  };

  const buildRows = () => {
    return props.fetchedData?.map((importedItem) => {
      return {
        id: importedItem.id,
        cells: buildRowCells(importedItem),
      };
    });
  };

  useEffect(() => {
    setRows(buildRows());
  }, [props.fetchedData]);

  return (
    <div css={style.container}>
      <div css={style.header}>
        <h6>{props.t('Your Imports')}</h6>
      </div>
      <Filters
        {...props}
        filters={props.filters}
        onUpdateFilters={(updatedFilter) => props.setFilters(updatedFilter)}
        isDisabled={false}
      />
      <DataGrid
        columns={columns}
        rows={rows}
        isFullyLoaded={!props.isNextPageAvailable && !props.isLoading}
        fetchMoreData={props.fetchMoreItems}
        isTableEmpty={props.fetchedData?.length === 0}
        emptyTableText={props.t('No Imports have been made.')}
        scrollOnBody
      />
    </div>
  );
};

export const ImportListTranslated = withNamespaces()(ImportList);
export default ImportList;
