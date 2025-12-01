// @flow
import moment from 'moment';
import { withNamespaces } from 'react-i18next';

import { colors } from '@kitman/common/src/variables';
import { TextLink } from '@kitman/components';
import { formatStandard } from '@kitman/common/src/utils/dateFormatter';
import { useIssue } from '@kitman/modules/src/Medical/shared/contexts/IssueContext';
import { getIssueTypePath } from '@kitman/modules/src/Medical/shared/utils';
import { occurrenceTypeEnumLike } from '@kitman/modules/src/Medical/issues/src/enumLikes';

import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { ViewType } from '@kitman/modules/src/Medical/issues/src/types';

type Props = {
  viewType: ViewType,
};

const style = {
  details: {
    color: colors.grey_200,
    display: 'flex',
    flexWrap: 'wrap',
    listStyle: 'none',
    padding: 0,
    marginBottom: 0,

    li: {
      lineHeight: '16px',
      marginRight: '20px',
      marginBottom: '20px',
    },
  },
  detailLabel: {
    fontWeight: 600,
  },
  detailValue: {
    textTransform: 'capitalize',
  },
};

const HeaderDetails = ({ viewType, t }: I18nProps<Props>) => {
  const { issue, issueType } = useIssue();

  const renderOccurrenceType = () => {
    if (!issue?.occurrence_type) {
      return null;
    }

    return (
      <li>
        <span css={style.detailLabel}>{t('Type')}: </span>
        <span css={style.detailValue}>{issue.occurrence_type}</span>
      </li>
    );
  };

  return (
    <div>
      {viewType === 'PRESENTATION' && (
        <ul css={style.details}>
          {issue?.occurrence_type && renderOccurrenceType()}
          {issue?.occurrence_type === occurrenceTypeEnumLike.continuation && (
            <li
              style={{
                gridColumn: '2 / 4',
              }}
            >
              <span css={style.detailLabel}>{t('Continuation of')}: </span>
              {issue.continuation_outside_system ? (
                <span>{t('No continuation injury record in EMR')}</span>
              ) : (
                <TextLink
                  text={`${
                    issue.continuation_issue?.issue_occurrence_title || ''
                  } (${issue.continuation_issue?.organisation_name || ''})`}
                  href={`/medical/athletes/${
                    issue.athlete_id
                  }/${getIssueTypePath(issueType)}/${
                    issue.continuation_issue?.id || ''
                  }`}
                  kitmanDesignSystem
                />
              )}
            </li>
          )}
          {issue?.squad?.name && (
            <li>
              <span css={style.detailLabel}>{t('Squad')}: </span>
              {issue.squad.name}
            </li>
          )}
        </ul>
      )}

      <ul css={style.details}>
        <li>
          <span css={style.detailLabel}>{t('Added on')}: </span>
          {issue?.created_at
            ? formatStandard({
                date: moment(issue?.created_at),
              })
            : '-'}
        </li>
        <li>
          <span css={style.detailLabel}>{t('Added by')}: </span>
          {issue?.created_by || '-'}
        </li>
      </ul>
    </div>
  );
};

export const HeaderDetailsTranslated = withNamespaces()(HeaderDetails);
export default HeaderDetails;
