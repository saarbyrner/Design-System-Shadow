// @flow

import i18n from '@kitman/common/src/utils/i18n';
import { defaultMapToOptions } from '@kitman/components/src/Select/utils';
import { TextLink } from '@kitman/components';
import moment from 'moment';
import { formatStandard } from '@kitman/common/src/utils/dateFormatter';
import type { AthleteIssueStatuses } from '@kitman/modules/src/Medical/rosters/src/services/getAthleteIssueStatuses';
import type {
  IssueType,
  Issue,
} from '@kitman/modules/src/Medical/shared/types';
import type {
  ClosedIssueTableProps,
  OpenIssueTableProps,
} from '@kitman/modules/src/Medical/athletes/src/components/IssuesTab/types';

export const athleteIssueTypes = defaultMapToOptions([
  { id: 'injury', name: i18n.t('Injury') },
  { id: 'illness', name: i18n.t('Illness') },
]);

export const getAthleteIssueStatusesAsSelectOptions = (
  athleteIssueStatuses: AthleteIssueStatuses
): Array<{ value: string | number, label: string }> =>
  athleteIssueStatuses.map((issueStatus) => ({
    value: issueStatus.id,
    label: issueStatus.description,
  }));

export const setDefaultSquadForPastAthlete = (
  organisationId: number,
  athleteSquads: Array<{ id: number, name: string }>
): number => {
  if (athleteSquads.length > 0) {
    return athleteSquads[0].id;
  }
  return organisationId;
};

export const tableColumns = [
  { id: 'date', content: i18n.t('Date of Injury/ Illness'), isHeader: true },
  { id: 'type', content: i18n.t('Type'), isHeader: true },
  { id: 'title', content: i18n.t('Title'), isHeader: true },
];

export const commonIssueTableCells = (
  issueId: number,
  issueCreationDate: string,
  issueType: IssueType,
  athleteId: number | string,
  issueTitle: string,
  customValsAndfFuncions: {
    styles: Object,
    getIssueTypePath: Function,
  },
  occurrenceType?: string
) => [
  {
    id: `creationDate_${issueId}`,
    content: (
      <div css={customValsAndfFuncions.styles.cell}>{`${formatStandard({
        date: moment(issueCreationDate),
        showCompleteDate: false,
        displayLongDate: false,
      })}`}</div>
    ),
  },

  {
    id: `type_${issueId}`,
    content: (
      <div
        css={[
          customValsAndfFuncions.styles.cell,
          { textTransform: 'capitalize' },
        ]}
      >
        {occurrenceType || issueType}
      </div>
    ),
  },
  {
    id: `title_${issueId}`,
    content: (
      <div css={customValsAndfFuncions.styles.cell}>
        <TextLink
          text={issueTitle}
          href={`/medical/athletes/${athleteId}/${customValsAndfFuncions.getIssueTypePath(
            issueType
          )}/${issueId}`}
          kitmanDesignSystem
        />
      </div>
    ),
  },
];

export const rowActions = (
  props: ClosedIssueTableProps | OpenIssueTableProps
) =>
  window.featureFlags['archive-injury'] &&
  props.permissions.issues.canArchive &&
  !props.isAthleteOnTrial
    ? [
        {
          id: 'archive',
          text: props.t('Archive'),
          onCallAction: (issueId: number) => {
            const selectedIssue = props.issues.find(
              (issue: Issue) => issue.id === issueId
            );
            props.setSelectedRow(selectedIssue);
            props.setShowArchiveModal(true);
          },
        },
      ]
    : null;
