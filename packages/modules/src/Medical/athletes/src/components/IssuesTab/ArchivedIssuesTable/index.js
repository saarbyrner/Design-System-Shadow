// @flow
import { withNamespaces } from 'react-i18next';
import moment from 'moment';
import { DataGrid } from '@kitman/components';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { Issue } from '@kitman/modules/src/Medical/shared/types';
import { getIssueTitle } from '@kitman/modules/src/Medical/shared/utils';
import archivedTableStyles from './styles';
import issueStyles from '../styles';

type Props = {
  issues: Array<Issue>,
};

const ArchivedIssuesTable = (props: I18nProps<Props>) => {
  const columns = [
    {
      id: 'title',
      content: props.t('Title'),
      isHeader: true,
    },
    {
      id: 'reason',
      content: props.t('Archive Reason'),
      isHeader: true,
    },
    {
      id: 'type',
      content: props.t('Type'),
      isHeader: true,
    },
    {
      id: 'date',
      content: props.t('Date of Injury/Illness'),
      isHeader: true,
    },
    {
      id: 'archivedDate',
      content: props.t('Date Injury/Illness Archived'),
      isHeader: true,
    },
    {
      id: 'user',
      content: props.t('Archived By'),
      isHeader: true,
    },
  ];

  const rows = props.issues.map((issue) => {
    const {
      id: issueId,
      occurrence_date: issueCreationDate,
      issue_type: issueType,
      archive_reason: archivedReason,
      archived_date: archivedDate,
      archived_by: archivedBy,
    } = issue;
    const issueTitle = getIssueTitle(
      issue,
      !issue.full_pathology && !issue.issue_occurrence_title
    );

    return {
      id: issueId,
      cells: [
        {
          id: `title_${issueId}`,
          content: <div css={issueStyles.cell}>{issueTitle}</div>,
        },
        {
          id: `archive_reason_${issueId}`,
          content: <div css={issueStyles.cell}>{archivedReason?.name}</div>,
        },
        {
          id: `type_${issueId}`,
          content: <div css={issueStyles.cell}>{issueType}</div>,
        },
        {
          id: `creationDate_${issueId}`,
          content: (
            <div css={issueStyles.cell}>{`${DateFormatter.formatStandard({
              date: moment(issueCreationDate),
              showCompleteDate: true,
              displayLongDate: true,
            })}`}</div>
          ),
        },
        {
          id: `archivedDate_${issueId}`,
          content: (
            <div css={issueStyles.cell}>{`${DateFormatter.formatStandard({
              date: moment(archivedDate),
              showCompleteDate: true,
              displayLongDate: true,
            })}`}</div>
          ),
        },
        {
          id: `type_${issueId}`,
          content: <div css={issueStyles.cell}>{archivedBy?.fullname}</div>,
        },
      ],
    };
  });

  return (
    <div css={archivedTableStyles.table}>
      <h3 css={issueStyles.tableTitle}>
        {props.t('Archived injuries/illnesses')}
      </h3>
      <DataGrid
        columns={columns}
        rows={rows}
        isTableEmpty={props.issues.length === 0}
        emptyTableText={props.t('No archived injuries/illnesses found')}
        scrollOnBody
      />
    </div>
  );
};

export const ArchivedIssuesTableTranslated =
  withNamespaces()(ArchivedIssuesTable);
export default ArchivedIssuesTable;
