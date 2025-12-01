// @flow
import type { Node } from 'react';
import moment from 'moment';
import { formatStandard } from '@kitman/common/src/utils/dateFormatter';
import type { ChronicIssue } from '@kitman/services/src/services/medical/getAthleteChronicIssues';
import { TextLink } from '@kitman/components';
import type { Translation } from '@kitman/common/src/types/i18n';

const generateRows = (
  issues: Array<ChronicIssue>,
  athleteId: string,
  t: Translation,
  styles: { [key: string]: any },
  isPastAthlete: boolean,
  shouldRenderEndDate: boolean
): Array<{
  id: number | string,
  cells: Array<{
    id: string,
    content: Node | string,
  }>,
}> => {
  return issues.map((issue) => {
    const {
      id: issueId,
      resolved_date: issueResolvedDate,
      occurrence_date: occurrenceDate,
    } = issue;

    const cells = [
      {
        id: `title_${issueId}`,
        content: (
          <div css={styles.cell}>
            <TextLink
              text={issue.title || issue.pathology}
              href={`/medical/athletes/${athleteId}/chronic_issues/${issueId}`}
              kitmanDesignSystem
            />
          </div>
        ),
      },
      {
        id: `type_${issueId}`,
        content: <div css={styles.cell}>{t('Chronic condition')}</div>,
      },
    ];

    // Occurrence date in the first column or resolution date in the last column
    if (occurrenceDate) {
      // Type first then Title
      cells.reverse();

      cells.unshift({
        id: `occurrenceDate_${issueId}`,
        content: (
          <div>
            {formatStandard({
              date: moment(occurrenceDate),
              displayLongDate: true,
            })}
          </div>
        ),
      });
    } else if (shouldRenderEndDate) {
      cells.push({
        id: `endDate_${issueId}`,
        content: (
          <div>
            {isPastAthlete
              ? t('Left club: {{date}}', {
                  date: formatStandard({
                    date: moment(issueResolvedDate),
                    displayLongDate: true,
                  }),
                })
              : t('Resolved: {{date}}', {
                  date: formatStandard({
                    date: moment(issueResolvedDate),
                    displayLongDate: true,
                  }),
                })}
          </div>
        ),
      });
    }

    return {
      id: issueId,
      cells,
    };
  });
};

export default generateRows;
