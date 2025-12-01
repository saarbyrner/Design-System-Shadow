// @flow
import { withNamespaces } from 'react-i18next';
import { TextLink } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { OpenIssue } from '@kitman/modules/src/Medical/rosters/types';
import { getIssueTypePath } from '@kitman/modules/src/Medical/shared/utils';
import { style } from './style';

type Props = {
  athleteId: string,
  openIssue: OpenIssue,
  issueAvailability: string,
  canViewAvailabilities: boolean,
};

const Issue = ({
  athleteId,
  openIssue,
  issueAvailability,
  canViewAvailabilities,
  t,
}: I18nProps<Props>) => (
  <div key={openIssue.id} css={style.issue}>
    {canViewAvailabilities && (
      <div css={style.issueAvailabilityMarker}>
        <span
          css={style[`availabilityMarker__${issueAvailability}`]}
          data-testid={`availability-marker-${issueAvailability}`}
        >
          &nbsp;
        </span>
      </div>
    )}
    <div css={style.issueName}>
      <TextLink
        text={openIssue.name}
        href={`/medical/athletes/${athleteId}/${getIssueTypePath(
          openIssue.issue_type
        )}/${openIssue.id}`}
        kitmanDesignSystem
      />
    </div>
    <span css={style.issueStatus}>{t(openIssue.status)}</span>
  </div>
);

const IssueTranslated = withNamespaces()(Issue);
export default IssueTranslated;
