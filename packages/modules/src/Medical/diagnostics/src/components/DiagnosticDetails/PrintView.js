// @flow
import { useEffect } from 'react';
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';

import { Printable } from '@kitman/printing/src/renderers';
import { DiagnosticReport } from '@kitman/printing/src/templates';

import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { useOrganisation } from '@kitman/common/src/contexts/OrganisationContext';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useDiagnostic } from '@kitman/modules/src/Medical/shared/contexts/DiagnosticContext';
import { useDiagnosticResults } from '@kitman/modules/src/Medical/shared/contexts/DiagnosticResultsContext';
import useMedicalNotes from '@kitman/modules/src/Medical/shared/hooks/useMedicalNotes';

type Props = {
  setRequestStatus: Function,
};

function PrintView(props: I18nProps<Props>) {
  const { permissions } = usePermissions();
  const { organisation } = useOrganisation();
  const { diagnostic } = useDiagnostic();
  const { resultBlocks } = useDiagnosticResults();
  const { medicalNotes, fetchMedicalNotes } = useMedicalNotes({
    withPagination: false,
  });

  // filters will always be the same at Diagnostic Level no need for 'defaultFilters'
  const filters = {
    content: '',
    author: [],
    squads: [],
    organisation_annotation_type: ['OrganisationAnnotationTypes::Diagnostic'],
    organisation_annotation_type_ids: [],
    athlete_id: diagnostic?.athlete.id || null,
    diagnostic_id: diagnostic?.id,
    date_range: null,
    archived: false,
  };

  useEffect(() => {
    if (!permissions.medical.notes.canView) return;
    fetchMedicalNotes(filters, true)
      .then(() => {
        props.setRequestStatus('SUCCESS');
      })
      .catch(() => {
        props.setRequestStatus('FAILURE');
      });
  }, []);

  return (
    <Printable
      pageMargin={{
        top: 8,
        right: 10,
        dimension: 'mm',
      }}
    >
      <DiagnosticReport
        resultBlocks={resultBlocks}
        diagnostic={diagnostic}
        medicalNotes={medicalNotes}
        organisationLogo={organisation.logo_full_path}
        labels={{
          diagnosticDetails: {
            name: props.t('Name: '),
            dob: props.t('D.O.B.: '),
            nflId: props.t('NFL ID: '),
            gender: props.t('Gender: '),
            type: props.t('Type - Name: '),
            cpt: props.t('CPT: '),
            provider: props.t('Provider: '),
            reason: props.t('Reason: '),
            bodyArea: props.t('Body area: '),
            laterality: props.t('Laterality: '),
            company: props.t('Company: '),
            club: props.t('Club: '),
            orderDate: props.t('Order date: '),
            apptDate: props.t('Appt. date: '),
            resultsDate: props.t('Results date: '),
            accessionId: props.t('Accession ID: '),
            refId: props.t('REF ID: '),
            status: props.t('Status: '),
          },
          linkedIssues: {
            title: props.t('Linked injury / illness: '),
            noIssues: props.t('No Linked Issues'),
          },
          radiologyReport: {
            title: props.t('Results'),
            findings: props.t('Findings: '),
            reviewed: props.t('Reviewed'),
            notReviewed: props.t('Not reviewed'),
          },
          labReport: {
            title: props.t('Results'),
            status: props.t('Status'),
            reviewed: props.t('Reviewed'),
            notReviewed: props.t('Not reviewed'),
            testName: props.t('Test name'),
            result: props.t('Result'),
            flag: props.t('Flag'),
            unit: props.t('Unit'),
            referenceInterval: props.t('Reference Interval'),
            comment: props.t('Comment'),
          },
          annotations: {
            title: props.t('Annotations'),
            created: props.t('Created: '),
          },
          footer: {
            tagLine: props.t('Kitman Labs - Intelligence Platform'),
          },
        }}
      />
    </Printable>
  );
}

export const PrintViewTranslated: ComponentType<Props> =
  withNamespaces()(PrintView);
export default PrintView;
