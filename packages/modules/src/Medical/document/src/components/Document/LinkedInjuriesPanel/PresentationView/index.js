// @flow
import { type ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { TextLink } from '@kitman/components';
import { Typography } from '@kitman/playbook/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import moment from 'moment-timezone';
import { formatStandard } from '@kitman/common/src/utils/dateFormatter';
import {
  getIssueTypePath,
  getIssueTitle,
} from '@kitman/modules/src/Medical/shared/utils';
import type { LegalDocument } from '@kitman/modules/src/Medical/shared/types/medical';
import type {
  IssueOccurrenceFDetail,
  ChronicIssue,
} from '@kitman/modules/src/Medical/shared/types';
import style from '@kitman/modules/src/Medical/document/src/components/Document/styles';

type Props = {
  issues: Array<IssueOccurrenceFDetail | ChronicIssue>,
  document: LegalDocument,
  isChronic?: boolean,
};

const PresentationView = (props: I18nProps<Props>) => {
  const hasIssues = props.issues?.length > 0;
  const athleteId = props.document.athlete
    ? props.document.athlete.id
    : props.document.entity.athlete.id;

  const renderIssueDate = (issue) => {
    if (issue.occurrence_date) {
      return issue.occurrence_date;
    }

    return formatStandard({
      // $FlowIgnore[prop-missing] occurrence_date for v2 document, reported_date otherwise
      date: moment(issue.reported_date),
      showTime: false,
    });
  };

  return (
    <>
      {hasIssues ? (
        props.issues.map((issue) => {
          const issueType = issue.issue_type || null;

          return (
            <div css={style.row} key={issue.id}>
              <Typography
                variant="body2"
                sx={{
                  // Setting default width to align issues
                  width: '100px',
                  paddingRight: '15px',
                }}
              >
                {renderIssueDate(issue)}
              </Typography>
              <TextLink
                text={getIssueTitle(
                  {
                    // $FlowIgnore[prop-missing] pathology may be present in chronic
                    full_pathology: issue.full_pathology || issue.pathology,
                    issue_occurrence_title:
                      // $FlowIgnore[prop-missing] Title may be present in chronic
                      issue.issue_occurrence_title || issue.title,
                    occurrence_date:
                      // $FlowIgnore[incompatible-call]
                      issue.occurrence_date || issue.reported_date || '',
                  },
                  false,
                  // $FlowIgnore[prop-missing] Title may be present in chronic
                  issue.title
                )}
                href={`/medical/athletes/${athleteId}/${
                  props.isChronic
                    ? 'chronic_issues'
                    : // $FlowIgnore[incompatible-call] chronic issue may not contain issue_type in response
                      getIssueTypePath(issueType)
                }/${issue.id}`}
              />
            </div>
          );
        })
      ) : (
        <Typography variant="body2">
          {props.isChronic
            ? props.t('No chronic condition linked.')
            : props.t('No injury/illness linked.')}
        </Typography>
      )}
    </>
  );
};

export const PresentationViewTranslated: ComponentType<Props> =
  withNamespaces()(PresentationView);
export default PresentationView;
