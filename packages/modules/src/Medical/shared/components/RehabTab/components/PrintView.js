// @flow
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { Printable } from '@kitman/printing/src/renderers';
import { RehabSessions } from '@kitman/printing/src/templates';
import { useOrganisation } from '@kitman/common/src/contexts/OrganisationContext';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useIssue } from '../../../contexts/IssueContext';
import type { RehabSession } from '../types';

type Props = {
  rawSessions: RehabSession[],
  athleteName: string,
  zeroIndexedDate: boolean,
};

function PrintView(props: I18nProps<Props>) {
  const { issue, issueType } = useIssue();
  const { organisation } = useOrganisation();

  return (
    <Printable>
      <RehabSessions
        issue={issue}
        issueType={issueType}
        organisationLogo={organisation.logo_full_path}
        athleteName={props.athleteName}
        labels={{
          injury: props.t('Injury'),
          illness: props.t('Illness'),
          side: props.t('Side'),
          dateOfInjury: props.t('Date of injury'),
          dateOfIllness: props.t('Date of illness'),
          status: props.t('Status'),
          dayNumber: props.t('Day no.'),
          day: props.t('Day'),
        }}
        sessions={props.rawSessions}
        zeroIndexedDate={props.zeroIndexedDate}
      />
    </Printable>
  );
}

export const PrintViewTranslated: ComponentType<Props> =
  withNamespaces()(PrintView);
export default PrintView;
