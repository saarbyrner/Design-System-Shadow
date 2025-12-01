// @flow
import { withNamespaces } from 'react-i18next';
import moment from 'moment';
import { DataGrid } from '@kitman/components';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import {
  getIssueTitle,
  getIssueTypePath,
} from '@kitman/modules/src/Medical/shared/utils';
import { tableColumns, commonIssueTableCells, rowActions } from '../../utils';
import styles from './styles';
import type { ClosedIssueTableProps } from './types';

const ClosedIssuesTable = (props: ClosedIssueTableProps) => {
  const rows = props.issues.map((issue) => {
    const {
      id: issueId,
      occurrence_date: issueCreationDate,
      issue_type: issueType,
      occurrence_type: occurrenceType,
      resolved_date: issueEndDate,
    } = issue;
    const issueTitle = getIssueTitle(issue, false);

    const getResolutionCellContent = () => {
      let label = props.t('Resolved');
      if (!issue.player_left_club && !issue.resolved_date) {
        label = props.t('Unresolved by prior Club');
        return label;
      }
      if (issue.player_left_club) {
        label = props.t('Left club');
      }

      const date = issue.player_left_club
        ? issue.org_last_transfer_record?.left_at
        : issueEndDate;

      const dateFormatted = date
        ? ` ${DateFormatter.formatStandard({
            date: moment(date),
            displayLongDate: true,
          })}`
        : '';

      return `${label}${dateFormatted}`;
    };

    const closedIssuesCells = [
      ...commonIssueTableCells(
        issueId,
        issueCreationDate,
        issueType,
        props.athleteId,
        issueTitle,
        { getIssueTypePath, styles },
        occurrenceType
      ),
      {
        id: `endDate_${issueId}`,
        content: getResolutionCellContent(),
      },
    ];

    return {
      id: issueId,
      cells: closedIssuesCells,
    };
  });

  return (
    <div css={styles.table}>
      <h3 css={styles.tableTitle}>{props.t('Prior injury/illness')}</h3>
      <DataGrid
        columns={[
          ...tableColumns,
          {
            id: 'status',
            content: props.t('Date of resolution'),
            isHeader: true,
          },
        ]}
        rows={rows}
        rowActions={rowActions(props)}
        isLoading={props.isLoading}
        isFullyLoaded={props.isFullyLoaded}
        fetchMoreData={props.fetchMoreIssues}
        isTableEmpty={props.issues.length === 0}
        emptyTableText={props.t('No prior injury/ illness added')}
        scrollOnBody
        maxHeight="500px"
      />
    </div>
  );
};

export const ClosedIssuesTableTranslated = withNamespaces()(ClosedIssuesTable);
export default ClosedIssuesTable;
