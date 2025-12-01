// @flow
import { useMemo } from 'react';
import { css } from '@emotion/react';
import { useTable } from 'react-table';
import type { ComponentType } from 'react';
import type { Column } from 'react-table';
import moment from 'moment';
import { colors } from '@kitman/common/src/variables';
import type { MedicalHistories } from '@kitman/services/src/services/getAthleteMedicalHistory';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';

const styles = {
  tableResponsiveWrapper: css`
    overflow-x: auto;
  `,
  table: css`
    table-layout: fixed;
    width: 100%;

    thead {
      border-bottom: 2px solid #e8eaed;
    }

    tbody {
      .rowGroupHeader {
        background: #f6f6f6;
        color: ${colors.grey_100};
        td {
          font-family: 'Open Sans';
          font-style: normal;
          font-weight: 600;
          font-size: 12px;
          line-height: 16px;
          color: ${colors.grey_100};
        }
      }

      tr {
        border-bottom: 0.5px solid #e8eaed;

        &:last-of-type {
          border-bottom: 0;
        }
      }

      [class^='cell-'] {
        padding-right: 20px;
      }
    }

    th:first-of-type,
    td:first-of-type {
      padding-left: 24px;
    }
    th:last-of-type,
    td:last-of-type {
      padding-right: 24px;
    }

    th {
      font-family: 'Open Sans';
      font-style: normal;
      font-weight: 600;
      font-size: 14px;
      line-height: 16px;
      color: ${colors.grey_100};
      padding-bottom: 7px;
    }

    td {
      font-family: 'Open Sans';
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
      color: ${colors.grey_300};
      padding-top: 12px;
      padding-bottom: 12px;
    }
  `,
};

type MedicalHistoryTableProps = {
  columns: Array<Column>,
  data: MedicalHistories,
  tableCss: any,
};

const MedicalHistoryTable = ({
  columns,
  data,
  tableCss,
  t,
}: I18nProps<MedicalHistoryTableProps>) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
    });

  const { isEmpty, renderGroupRows } = useMemo(() => {
    const active = [];
    const expired = [];

    rows.forEach((row) => {
      if (moment(row.values.expiry).isSameOrAfter(new Date(), 'day')) {
        active.push(row);
      } else {
        expired.push(row);
      }
    });

    const getRows = (opts) => {
      const rowsData = opts.active ? active : expired;

      if (!rowsData.length) {
        return null;
      }

      return (
        <>
          <tr role="row" className="rowGroupHeader">
            <td colSpan={columns.length}>
              {opts.active ? t('Active') : t('Expired')}
            </td>
          </tr>
          {rowsData.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell, index) => {
                  return (
                    <td
                      {...cell.getCellProps()}
                      className={`cell-${index}`}
                      valign="top"
                    >
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </>
      );
    };

    return {
      isEmpty: !active.length && !expired.length,
      renderGroupRows: getRows,
    };
  }, [columns.length, prepareRow, rows, t]);

  if (isEmpty) {
    return null;
  }

  return (
    <div css={styles.tableResponsiveWrapper}>
      <table {...getTableProps()} css={[styles.table, tableCss]}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, index) => (
                <th className={`column-${index}`} {...column.getHeaderProps()}>
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {/* Active */}
          {renderGroupRows({ active: true })}
          {/* Expired */}
          {renderGroupRows({ active: false })}
        </tbody>
      </table>
    </div>
  );
};

const MedicalHistoryTableTranslated: ComponentType<MedicalHistoryTableProps> =
  withNamespaces()(MedicalHistoryTable);

export default MedicalHistoryTableTranslated;
