// @flow
import moment from 'moment';
import { type Node } from 'react';

import i18n from '@kitman/common/src/utils/i18n';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import styles from '@kitman/modules/src/shared/SubmissionsTable/styles';
import {
  SubmissionStatusChipBackgroundColors,
  SubmissionStatusChipIconFills,
} from '@kitman/modules/src/shared/SubmissionsTable/utils/consts';
import { Chip, IconButton, Stack } from '@kitman/playbook/components';
import { type SubmissionStatusChipBackgroundColor } from '@kitman/modules/src/shared/SubmissionsTable/types';
import { type EventImport } from '@kitman/services/src/services/planning_hub/events/id/imports/get';

import { type Row, type SourceToDelete } from './types';

type DeleteImport = (SourceToDelete: SourceToDelete) => void;

// Example: 4 June 2023 14:00.
const DATE_FORMAT = 'D MMMM YYYY H[:]mm';

const IMPORT_STATUS = Object.freeze({
  FAILED: 'FAILED',
  COMPLETE: 'COMPLETE',
  IN_PROGRESS: 'IN_PROGRESS',
});

export const getRowsFrom = (imports: Array<EventImport>): Array<Row> =>
  imports
    .map((imp) => ({
      id: imp.id,
      submissionDate: imp.createdAt,
      sourceNameAndImportTypeAndName: {
        sourceName: imp.source.name,
        importTypeAndName: `${imp.type} — ${imp.name}`,
      },
      submissionStatus: (() => {
        if (Number.parseInt(imp.progress.toString(), 10) === 100) {
          return imp.steps?.length > 0 &&
            // $FlowIgnore[prop-missing] outdated flow, 'at()' exists
            imp.steps.at(imp.steps.length - 1)?.stepStatus === 'failed'
            ? IMPORT_STATUS.FAILED
            : IMPORT_STATUS.COMPLETE;
        }
        return IMPORT_STATUS.IN_PROGRESS;
      })(),
      exportSuccessCsv: null,
      deleteImport: {
        sourceId: imp.source.sourceIdentifier,
        sourceType: imp.type,
      },
    }))
    .sort((a, b) => b.submissionDate.localeCompare(a.submissionDate));

export const renderSubmissionStatusCell = ({
  value,
}: {
  value: $Values<typeof IMPORT_STATUS>,
}): Node => {
  const properties: {
    backgroundColor: SubmissionStatusChipBackgroundColor,
    // $Exact is needed to destructure props into Chip.
    props: $Exact<{
      icon: Node,
      label: string,
    }>,
  } = {
    backgroundColor: SubmissionStatusChipBackgroundColors.Unsuccessful,
    props: {
      icon: (
        <KitmanIcon
          name={KITMAN_ICON_NAMES.ErrorOutline}
          sx={
            // style.getSubmissionStatusChipIconStyle is always a function,
            // this check is to make Flow happy.
            typeof styles.getSubmissionStatusChipIconStyle === 'function' &&
            styles.getSubmissionStatusChipIconStyle(
              SubmissionStatusChipIconFills.Unsuccessful
            )
          }
        />
      ),
      label: i18n.t('Unsuccessful'),
    },
  };
  switch (value) {
    case IMPORT_STATUS.IN_PROGRESS:
      properties.backgroundColor =
        SubmissionStatusChipBackgroundColors.InProgress;
      properties.props.icon = (
        <KitmanIcon
          name={KITMAN_ICON_NAMES.ContrastOutlined}
          sx={
            // style.getSubmissionStatusChipIconStyle is always a function,
            // this check is to make Flow happy.
            typeof styles.getSubmissionStatusChipIconStyle === 'function' &&
            styles.getSubmissionStatusChipIconStyle(
              SubmissionStatusChipIconFills.InProgress
            )
          }
        />
      );
      properties.props.label = i18n.t('In progress');
      break;
    case IMPORT_STATUS.COMPLETE:
      properties.backgroundColor =
        SubmissionStatusChipBackgroundColors.Completed;
      properties.props.icon = (
        <KitmanIcon
          name={KITMAN_ICON_NAMES.CheckCircleOutline}
          sx={
            // style.getSubmissionStatusChipIconStyle is always a function,
            // this check is to make Flow happy.
            typeof styles.getSubmissionStatusChipIconStyle === 'function' &&
            styles.getSubmissionStatusChipIconStyle(
              SubmissionStatusChipIconFills.Completed
            )
          }
        />
      );
      properties.props.label = i18n.t('Completed');
      break;
    case IMPORT_STATUS.FAILED:
    default:
    // Do nothing.
  }
  return (
    <Chip
      size="small"
      sx={
        // style.getSubmissionStatusChipStyle is always a function, this
        // check is to make Flow happy.
        typeof styles.getSubmissionStatusChipStyle === 'function' &&
        styles.getSubmissionStatusChipStyle(properties.backgroundColor)
      }
      {...properties.props}
    />
  );
};

export const getColumnsFrom = (
  {
    rows = [],
    canDelete = false,
    deleteImport = () => {},
  }: {
    rows: Array<Row>,
    canDelete: boolean,
    deleteImport: DeleteImport,
  } = {
    rows: [],
    canDelete: false,
    deleteImport: () => {},
  }
): ({
  [sourceName: string]: Array<{
    field: string,
    headerName?: string,
    flex: number,
    valueFormatter?: (params: { value: any }) => string,
    renderCell?: (params: { value: $Values<typeof IMPORT_STATUS> }) =>
      | Node
      | string,
    renderHeader?: () => Node,
  }>,
}) =>
  Object.fromEntries(
    Object.entries(
      rows.reduce((grouped, item) => {
        const key = item.sourceNameAndImportTypeAndName.sourceName;
        // eslint-disable-next-line no-param-reassign
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(item);
        return grouped;
      }, {})
    ).map(([sourceName, groupedRows]) => [
      sourceName,
      [
        {
          field: 'submissionDate',
          headerName: i18n.t('Submission date'),
          flex: 1,
          valueFormatter: ({ value }: { value: string }) =>
            moment(value).format(DATE_FORMAT),
        },
        {
          field: 'sourceNameAndImportTypeAndName',
          headerName: `${sourceName} ${i18n.t('import type and name')}`,
          flex: 2,
          valueFormatter: ({
            value: { importTypeAndName },
          }: {
            value: { importTypeAndName: string },
          }) => importTypeAndName,
        },
        {
          field: 'submissionStatus',
          headerName: i18n.t('Submission status'),
          flex: 1,
          renderCell: renderSubmissionStatusCell,
        },
        {
          field: 'deleteImport',
          flex: 1,
          renderHeader: () => {
            if (!canDelete) return null;

            // $FlowIgnore[incompatible-use]
            const { sourceId, sourceType } = groupedRows[0].deleteImport;
            return (
              <Stack
                direction="row"
                width="100%"
                justifyContent="end"
                alignItems="flex-end"
                marginRight="20px"
              >
                {/* TODO: Wrap in permissions as part of CAP-2058 */}
                {window.getFlag('pac-calendar-events-edit-imported-data') && (
                  <IconButton title={i18n.t('Edit import')} onClick={() => {}}>
                    <KitmanIcon name={KITMAN_ICON_NAMES.Edit} />
                  </IconButton>
                )}

                <IconButton
                  title={i18n.t('Delete import')}
                  onClick={() =>
                    deleteImport({
                      id: sourceId,
                      type: sourceType,
                    })
                  }
                >
                  <KitmanIcon name={KITMAN_ICON_NAMES.DeleteOutline} />
                </IconButton>
              </Stack>
            );
          },
          renderCell: () => '',
        },
      ],
    ])
  );
