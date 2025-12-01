// @flow
import moment from 'moment';
import { type Node } from 'react';

import i18n from '@kitman/common/src/utils/i18n';
import {
  type CamelCasedImportsItem,
  type ImportStatus,
} from '@kitman/common/src/types/Imports';
import { IMPORT_STATUS } from '@kitman/common/src/consts/imports';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import { Chip } from '@kitman/playbook/components';
import {
  IMPORT_TYPES,
  IMPORT_TYPES_WITH_DELETE,
} from '@kitman/modules/src/shared/MassUpload/New/utils/consts';

import styles from '../styles';
import type {
  SubmissionStatusChipBackgroundColor,
  SubmissionsRow,
} from '../types';
import {
  SubmissionStatusChipBackgroundColors,
  SubmissionStatusChipIconFills,
} from './consts';
import DeleteImport from '../components/DeleteImport';

// Example: 4 June 2023 14:00.
const dateFormat = 'D MMMM YYYY H[:]mm';

export const transformImportsListToRows = (
  list: Array<CamelCasedImportsItem> = []
): Array<SubmissionsRow> =>
  list
    .map((submission) => {
      const hasBothCsvs = submission.attachments.length > 1;
      const errorsCsv = submission.attachments.find(
        (csv) => csv.filename === 'errors.csv'
      );

      let submissionStatus = submission.status;
      if (
        submission.status === IMPORT_STATUS.Completed &&
        submission.importErrors?.length > 0
      ) {
        submissionStatus = IMPORT_STATUS.Errored;
      }

      return {
        id: submission.id,
        submissionDate: submission.createdAt,
        submittedBy: submission.createdBy.fullname,
        submissionStatus,
        exportSuccessCsv:
          // $FlowIgnore type will never been boolean
          (hasBothCsvs || !errorsCsv) && submission.attachments[0]?.url,
        exportErrorCsv: errorsCsv?.url,
        deleteImport: {
          canDelete: submission.canDelete,
          attachmentId: submission.attachments[0]?.id,
          submissionStatus,
          importType: submission.importType,
        },
      };
    })
    .sort((a, b) => b.submissionDate.localeCompare(a.submissionDate));

export const renderSubmissionStatusCell = ({
  value,
}: {
  value: $PropertyType<CamelCasedImportsItem, 'status'>,
}) => {
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
    case IMPORT_STATUS.Pending:
    case IMPORT_STATUS.Running:
    case IMPORT_STATUS.Deleting:
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
      properties.props.label =
        value === IMPORT_STATUS.Deleting
          ? i18n.t('Delete in progress')
          : i18n.t('In progress');
      break;
    case IMPORT_STATUS.Completed:
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
    case IMPORT_STATUS.Errored:
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

export const renderExportCsvColumn = ({ value }: { value: string }) =>
  value ? (
    <a href={value} download={value}>
      <KitmanIcon
        name={KITMAN_ICON_NAMES.FileDownload}
        sx={styles.exportIcon}
      />
    </a>
  ) : (
    '-'
  );

export const renderDeleteImportCell = ({
  value,
}: {
  value: {
    canDelete: boolean,
    attachmentId: ?number,
    importType: $Values<typeof IMPORT_TYPES>,
    submissionStatus: ImportStatus,
  },
}) => (
  <DeleteImport
    canDelete={value.canDelete}
    attachmentId={value.attachmentId}
    importType={value.importType}
    submissionStatus={value.submissionStatus}
  />
);

export const getColumns = (importType: $Values<typeof IMPORT_TYPES>) => [
  {
    field: 'submissionDate',
    headerName: i18n.t('Submission date'),
    flex: 1,
    valueFormatter: ({ value }: { value: string }) => {
      return moment(value).format(dateFormat);
    },
  },
  {
    field: 'submittedBy',
    headerName: i18n.t('Submitted by'),
    flex: 1,
  },
  {
    field: 'submissionStatus',
    headerName: i18n.t('Submission status'),
    flex: 2,
    renderCell: renderSubmissionStatusCell,
  },
  {
    field: 'exportSuccessCsv',
    headerName: i18n.t('Submitted file'),
    flex: 1,
    renderCell: renderExportCsvColumn,
  },
  {
    field: 'exportErrorCsv',
    headerName: i18n.t('Errors file'),
    flex: 1,
    renderCell: renderExportCsvColumn,
  },
  ...(window.getFlag('cap-training-variable-importer-delete-imported-file') &&
  IMPORT_TYPES_WITH_DELETE.includes(importType)
    ? [
        {
          field: 'deleteImport',
          flex: 1,
          type: 'actions',
          renderCell: renderDeleteImportCell,
        },
      ]
    : []),
];
