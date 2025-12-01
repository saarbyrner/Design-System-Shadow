// @flow
import moment from 'moment';
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { Link } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useDiagnostic } from '@kitman/modules/src/Medical/shared/contexts/DiagnosticContext';
import { getIssueTypePath } from '@kitman/modules/src/Medical/shared/utils';

import style from './styles';

type Props = {};

const LinkedIssue = (props: I18nProps<Props>) => {
  const { diagnostic } = useDiagnostic();

  return (
    <div>
      <section
        css={[style.linkedIssueSection, style.section]}
        data-testid="LinkedIssue|LinkedIssueSummary"
      >
        <header css={style.header}>
          <h2 className="kitmanHeading--L2">
            {props.t('Linked injury / illness')}
          </h2>
        </header>

        {diagnostic?.issue_occurrences?.length > 0 ? (
          <ul css={style.linkedIssueDetailsList}>
            {diagnostic.issue_occurrences.map((issue) => (
              <div key={issue.id} css={style.linkedIssueDetails}>
                <li>
                  {props.t('{{date}}', {
                    date:
                      moment(issue.occurrence_date).format('MMM DD YYYY') ||
                      '--',
                  })}
                </li>
                <Link
                  href={`/medical/athletes/${
                    diagnostic.athlete.id
                  }/${getIssueTypePath(issue.issue_type)}/${issue.id}`}
                >
                  <li css={style.pathology}>
                    {props.t('{{pathology}}', {
                      pathology: issue.full_pathology || '--',
                      interpolation: { escapeValue: false },
                    })}
                  </li>
                </Link>
              </div>
            ))}
          </ul>
        ) : (
          <div> No Linked Issues</div>
        )}
      </section>
    </div>
  );
};

export const LinkedIssueTranslated: ComponentType<Props> =
  withNamespaces()(LinkedIssue);
export default LinkedIssue;
