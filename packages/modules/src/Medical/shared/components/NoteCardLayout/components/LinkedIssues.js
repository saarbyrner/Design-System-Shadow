// @flow
import type { ComponentType } from 'react';
import { css } from '@emotion/react';
import { withNamespaces } from 'react-i18next';
import moment from 'moment';
import { colors } from '@kitman/common/src/variables';
import type {
  LinkedIssue,
  ChronicIssue,
} from '@kitman/modules/src/Medical/shared/types';

import { TextLink } from '@kitman/components';
import {
  getIssueTitle,
  getIssueTypePath,
} from '@kitman/modules/src/Medical/shared/utils';

// Types
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  issues: Array<LinkedIssue>,
  annotationableId: number,
  chronicIssues?: ChronicIssue[],
};

const styles = {
  section: css`
    margin-bottom: 16px;
  `,
  title: css`
    margin-bottom: 8px;
    text-transform: capitalize;
    color: ${colors.grey_100};
    font-size: 12px;
    font-weight: 600;
    line-height: 16px;
  `,
  list: css`
    list-style: none;
    padding: 0;
    margin: 0;
  `,
};

const LinkedIssues = (props: I18nProps<Props>) => {
  return (
    <div css={styles.section} data-testid="LinkedIssues|Root">
      <h4 css={styles.title}>{props.t('Linked injury/ illness')}</h4>
      <ul css={styles.list} data-testid="LinkedIssues|LinkedIssues">
        {props.issues.map((issue) => (
          <li key={`${issue.issue_type}_${issue.id}`}>
            {moment(issue.occurrence_date).format('MMM DD, YYYY')} -{' '}
            <TextLink
              text={getIssueTitle(issue, false)}
              href={`/medical/athletes/${
                props.annotationableId
              }/${getIssueTypePath(issue.issue_type)}/${issue.id}`}
              kitmanDesignSystem
              withHashParam
            />
          </li>
        ))}
        {props.chronicIssues?.map((issue) => (
          <li key={`chronic_${issue.id}`}>
            <TextLink
              text={issue.title || issue.full_pathology}
              href={`/medical/athletes/${props.annotationableId}/chronic_issues/${issue.id}`}
              kitmanDesignSystem
              withHashParam
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export const LinkedIssuesTranslated: ComponentType<Props> =
  withNamespaces()(LinkedIssues);
export default LinkedIssues;
