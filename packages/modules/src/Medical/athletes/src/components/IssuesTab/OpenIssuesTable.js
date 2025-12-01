// @flow
import { withNamespaces } from 'react-i18next';
import { DataGrid, TextTag } from '@kitman/components';
import { colors } from '@kitman/common/src/variables';

import type { IssueAvailability } from '@kitman/modules/src/Medical/shared/types';
import {
  getIssueTitle,
  getIssueTypePath,
} from '@kitman/modules/src/Medical/shared/utils';
import { tableColumns, commonIssueTableCells, rowActions } from '../../utils';
import styles from './styles';
import type { OpenIssueTableProps } from './types';

const getStatusColors = (status: IssueAvailability) => {
  if (status?.cause_unavailability) {
    return {
      statusTextColor: colors.red_200,
      statusBackgroundColor: colors.red_100_20,
    };
  }
  if (status?.restore_availability) {
    return {
      statusTextColor: colors.orange_200,
      statusBackgroundColor: colors.orange_100_20,
    };
  }
  return {
    statusTextColor: colors.grey_200,
    statusBackgroundColor: colors.neutral_300,
  };
};

const OpenIssuesTable = (props: OpenIssueTableProps) => {
  const rows = props.issues.map((issue) => {
    const {
      id: issueId,
      occurrence_date: issueCreationDate,
      issue_type: issueType,
      occurrence_type: occurrenceType,
      injury_status: issueStatus,
    } = issue;
    const issueTitle = getIssueTitle(
      issue,
      !issue.full_pathology && !issue.issue_occurrence_title
    );
    const { statusTextColor, statusBackgroundColor } =
      getStatusColors(issueStatus);

    const openIssuesTableCells = [
      ...commonIssueTableCells(
        issueId,
        issueCreationDate,
        issueType,
        props.athleteId,
        issueTitle,
        { styles, getIssueTypePath },
        occurrenceType
      ),
      {
        id: `status_${issueId}`,
        content: (
          <div css={styles.cell}>
            <TextTag
              content={issueStatus?.description || '[N/A]'}
              textColor={statusTextColor}
              backgroundColor={statusBackgroundColor}
            />
          </div>
        ),
      },
    ];

    return {
      id: issueId,
      cells: openIssuesTableCells,
    };
  });

  return (
    <div css={styles.table}>
      <h3 css={styles.tableTitle}>{props.t('Open injury/ illness')}</h3>
      <DataGrid
        columns={[
          ...tableColumns,
          { id: 'status', content: props.t('Status'), isHeader: true },
        ]}
        rows={rows}
        rowActions={rowActions(props)}
        isTableEmpty={props.issues.length === 0}
        emptyTableText={props.t('No open injury/ illness added')}
        scrollOnBody
      />
    </div>
  );
};

export const OpenIssuesTableTranslated = withNamespaces()(OpenIssuesTable);
export default OpenIssuesTable;
