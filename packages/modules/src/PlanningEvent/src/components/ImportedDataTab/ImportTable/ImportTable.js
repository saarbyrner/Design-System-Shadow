// @flow
import { useState, useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import moment from 'moment';
import $ from 'jquery';

import { AppStatus, TextButton, IconButton } from '@kitman/components';
import importWorkflow from '@kitman/modules/src/initialiseProfiler/modules/workloads/import_workflow';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import { colors } from '@kitman/common/src/variables';
import { type I18nProps } from '@kitman/common/src/types/i18n';
import { type Import } from '@kitman/modules/src/PlanningEvent/types';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import { getHumanReadableEventType } from '@kitman/common/src/utils/events';
import { type Event } from '@kitman/common/src/types/Event';
import { getImportTypeAndVendor } from '@kitman/common/src/utils/TrackingData/src/data/planningHub/getPlanningHubEventData';

type Props = {
  event: Event,
  showImport: boolean,
  onClickImportData: Function,
  canEditEvent: boolean,
};

const styles = {
  table: {
    width: '100%',
    marginTop: '30px',
    thead: {
      borderBottom: `2px solid ${colors.neutral_300}`,
      height: '30px',
    },
    tbody: {
      tr: {
        td: {
          height: '44px',
        },
      },
    },
  },
  th: {
    color: colors.grey_100,
    fontSize: '12px',
    fontWeight: 600,
    lineHeight: '16px',
  },
  cell: {
    color: colors.grey_300,
    fontSize: '14px',
    lineHeight: '20px',
    fontWeight: 400,
  },
  center: {
    textAlign: 'center',
  },
  right: {
    textAlign: 'right',
  },
  noData: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    textAlign: 'center',
    padding: '30px 0',
    gap: '12px',
    p: {
      color: colors.grey_300,
      fontSize: '14px',
      lineHeight: '20px',
      fontWeight: 400,
    },
  },
  status_complete: {
    color: colors.green_100,
    fontSize: '25px',
  },
  status_error: {
    color: colors.red_100,
    fontSize: '25px',
  },
  status_progress: {
    color: colors.s08,
    fontSize: '14px',
  },
};

export const hasProgressUpdated = (
  previousImportList: ?Array<Import>,
  importData: Import
) => {
  if (!previousImportList) {
    return false;
  }

  const importIndex = previousImportList.findIndex(
    (previousImport) => previousImport.id === importData.id
  );

  if (importIndex === -1) {
    return false;
  }

  return (
    previousImportList[importIndex].progressUpdated ||
    previousImportList[importIndex].progress !== importData.progress
  );
};

const ImportTable = (props: I18nProps<Props>) => {
  const { trackEvent } = useEventTracking();

  const [importList, setImportList] = useState();
  const [requestFailed, setRequestFailed] = useState(false);
  const [deleteDataStatus, setDeleteDataStatus] = useState();
  const [sourceToDelete, setSourceToDelete] = useState('');

  useEffect(() => {
    const getImports = () => {
      let previousImportList = null;

      // Request the import list every 3 seconds untill the imports are all complete.
      const getImportProgress = () => {
        $.getJSON(`/planning_hub/events/${props.event.id}/imports`)
          .done((imports) => {
            if (imports) {
              setImportList(
                imports.map((importData) => ({
                  ...importData,
                  progressUpdated: hasProgressUpdated(
                    previousImportList,
                    importData
                  ),
                }))
              );

              if (
                imports.length > 0 &&
                imports.filter((importData) => importData.progress < 100)
                  .length > 0
              ) {
                setTimeout(getImportProgress, 3000);
              }

              previousImportList = imports;
            }
          })
          .fail(() => {
            setRequestFailed(true);
          });
      };

      getImportProgress();
    };
    getImports();
  }, [props.event.id]);

  if (requestFailed) {
    return <AppStatus status="error" isEmbed />;
  }

  if (!importList) {
    return null;
  }

  if (importList.length === 0) {
    if (props.showImport) {
      importWorkflow();

      return (
        <div css={styles.noData} data-testid="ImportTable|Import Data">
          <p>{props.t('Import CSV or API data from vendors')}</p>
          <div>
            <TextButton
              onClick={props.onClickImportData}
              text={props.t('Import Data')}
              type="primary"
              size="small"
            />
          </div>
        </div>
      );
    }

    return (
      <div css={styles.noData}>
        <p data-testid="ImportTable|NoData">
          {props.t('No data has been imported')}
        </p>
      </div>
    );
  }

  const importStatusCell = (importData, importStatus) => {
    const reloadPageLink = (
      <div
        onClick={() =>
          window.location.assign(window.location.href.split('#')[0])
        }
        className="planningEventImportTable__reloadLink"
      >
        {props.t('Reload the page')}
      </div>
    );

    switch (importStatus) {
      case 'COMPLETE':
        return (
          <td css={[styles.center, styles.status_complete]}>
            <i className="icon-tick" />
            {importData.progressUpdated && reloadPageLink}
          </td>
        );
      case 'FAILED':
        return (
          <td css={[styles.center, styles.status_error]}>
            <i className="icon-error" />
            {importData.progressUpdated && reloadPageLink}
          </td>
        );
      case 'IN_PROGRESS':
      default:
        return (
          <td css={[styles.center, styles.status_progress]}>
            {props.t('In Progress')}
          </td>
        );
    }
  };

  const getSources = (): Array<{
    name: string,
    identifier: string,
    type: string,
  }> =>
    importList.reduce((types, importItem) => {
      const identifier = importItem?.source?.source_identifier;
      const sourceExists = types.find(
        (source) => source.identifier === identifier
      );
      if (!sourceExists) {
        types.push({
          name: importItem?.source?.name ?? 'No Source',
          identifier,
          type: importItem?.type,
        });
      }
      return types;
    }, []);

  const importRows = (importType) =>
    importList.map((importData) => {
      let importStatus;
      if (parseInt(importData.progress, 10) === 100) {
        importStatus =
          importData.steps?.length > 0 &&
          importData.steps[importData.steps.length - 1]?.step_status ===
            'failed'
            ? 'FAILED'
            : 'COMPLETE';
      } else {
        importStatus = 'IN_PROGRESS';
      }

      return (
        importData?.source?.source_identifier === importType && (
          <tr key={importData.id}>
            <td css={styles.cell}>
              {DateFormatter.formatStandard({
                date: moment(
                  importData.created_at,
                  DateFormatter.dateTransferFormat
                ),
                showTime: true,
              })}
            </td>
            <td css={styles.cell}>{importData.name}</td>
            <td css={[styles.cell, styles.center]}>{importData.type}</td>
            {importStatusCell(importData, importStatus)}
            <td />
          </tr>
        )
      );
    });

  const tableColumns = [
    {
      key: props.t('Date'),
      name: 'Date',
      width: '20%',
      css: styles.th,
    },
    {
      key: props.t('Source'),
      name: 'Source',
      width: '20%',
      css: styles.th,
    },
    {
      key: props.t('Type'),
      name: 'Type',
      width: '20%',
      css: [styles.th, styles.center],
    },
    {
      key: props.t('Status'),
      name: 'Status',
      width: '20%',
      css: [styles.th, styles.center],
    },
    {
      key: props.t('Delete'),
      name: 'Delete',
      width: '20%',
      css: [styles.th, styles.right],
    },
  ];

  const deleteImportedData = (sourceIdentity, sourceType) => {
    setDeleteDataStatus('PENDING');

    $.ajax({
      method: 'DELETE',
      url: `/planning_hub/events/${props.event.id}/imports/clear_data_by_source`,
      data: {
        source: sourceIdentity,
      },
    })
      .done(() => {
        setDeleteDataStatus('SUCCESS');
        window.location.reload();
      })
      .fail(() => {
        setDeleteDataStatus('FAILURE');
      });
    trackEvent(
      `Calendar — ${getHumanReadableEventType(
        props.event
      )} details — Imported data — Delete an import`,
      getImportTypeAndVendor({
        fileData: {
          source: sourceIdentity,
          file: null,
        },
        type: sourceType === 'CSV' ? 'FILE' : 'INTEGRATION',
      })
    );
  };

  const getStatus = () => {
    switch (deleteDataStatus) {
      case 'CONFIRM':
        return 'warning';
      case 'PENDING':
        return 'loading';
      case 'SUCCESS':
        return 'success';
      case 'FAILURE':
        return 'error';
      default:
        return null;
    }
  };

  const getAppStatusMessage = () => {
    switch (deleteDataStatus) {
      case 'CONFIRM':
        return props.t(
          'Delete all imported data associated with this session?'
        );
      case 'PENDING':
        return props.t('Deleting imported data');
      case 'SUCCESS':
        return props.t('Datapoints deleted');
      case 'FAILURE':
        return null;
      default:
        return null;
    }
  };

  const renderHeaderCell = (
    colName,
    sourceName,
    sourceIdentity,
    sourceType
  ) => {
    switch (colName) {
      case 'Source':
        return sourceName;
      case 'Delete':
        if (deleteDataStatus) {
          return (
            <AppStatus
              status={getStatus()}
              message={getAppStatusMessage()}
              hideConfirmation={() => setDeleteDataStatus(null)}
              confirmAction={() => {
                if (deleteDataStatus === 'CONFIRM') {
                  deleteImportedData(sourceToDelete, sourceType);
                }
              }}
            />
          );
        }

        return (
          sourceIdentity &&
          props.canEditEvent && (
            <IconButton
              icon="icon-bin"
              isBorderless
              isSmall
              onClick={() => {
                setDeleteDataStatus('CONFIRM');
                // $FlowIgnore[incompatible-call]
                setSourceToDelete(sourceIdentity);
              }}
            />
          )
        );

      default:
        return colName;
    }
  };

  return (
    <>
      {getSources().map((source) => {
        return (
          <table css={styles.table} key={source.identifier}>
            <thead>
              <tr>
                {tableColumns.map((column) => {
                  return (
                    <th
                      key={column.name}
                      css={column.css}
                      style={{ width: column.width }}
                    >
                      {renderHeaderCell(
                        column.name,
                        source.name,
                        source.identifier,
                        source.type
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>{importRows(source.identifier)}</tbody>
          </table>
        );
      })}
    </>
  );
};

export const ImportTableTranslated = withNamespaces()(ImportTable);
export default ImportTable;
