// @flow
import { type ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { AppStatus } from '@kitman/components';
import type { AthleteData } from '@kitman/services/src/services/getAthleteData';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import moment from 'moment-timezone';
import type { LegalDocument } from '@kitman/modules/src/Medical/shared/types/medical';
import {
  useGetDocumentNoteCategoriesQuery,
  useGetAthleteIssuesQuery,
  useGetAthleteDataQuery,
} from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import { ENTITY_TYPES } from '@kitman/modules/src/Medical/shared/types/medical/EntityAttachment';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import {
  updateMedicalDocument,
  updateAttachment,
  updateFormAnswersSetLinkedIssues,
} from '@kitman/services/src';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { DocumentDetailsPanelTranslated as DocumentDetailsPanel } from './DocumentDetailsPanel';
import { AssociatedNotesPanelTranslated as AssociatedNotesPanel } from './AssociatedNotesPanel';
import { LinkedInjuriesPanelTranslated as LinkedInjuriesPanel } from './LinkedInjuriesPanel';

import style from './styles';

type Props = {
  document: ?LegalDocument,
};

const DocumentTab = (
  // $FlowIssue[incompatible-use] Document presence is checked
  { t, document }: I18nProps<Props>
) => {
  const isV2Document = !document?.entity;
  const documentEntity = isV2Document ? document : document?.entity;

  const { permissions } = usePermissions();
  // document?.athlete.id
  const { data: athleteData }: { data: AthleteData } = useGetAthleteDataQuery(
    documentEntity?.athlete.id
  );
  const isATrialAthlete =
    athleteData?.constraints?.organisation_status === 'TRIAL_ATHLETE';
  const canEditDocument =
    window.featureFlags['medical-files-tab-enhancement'] &&
    permissions.medical.documents.canEdit &&
    !isATrialAthlete;

  const {
    data: documentNoteCategories = [],
    isLoading: isDocumentNoteCategoriesLoading,
  } = useGetDocumentNoteCategoriesQuery(null, { skip: !canEditDocument });

  const { data: athleteIssues, isLoading: isAthleteIssuesLoading } =
    useGetAthleteIssuesQuery(
      {
        athleteId: documentEntity?.athlete?.id,
        grouped: true,
      },
      { skip: !canEditDocument || !documentEntity?.athlete?.id }
    );

  if (!documentEntity) {
    return (
      <div css={style.parentContainer}>
        <AppStatus status="loading" message={t('Loading...')} isEmbed />
      </div>
    );
  }

  const isFormAnswersSet =
    documentEntity?.entity_type === ENTITY_TYPES.formAnswersSet;

  const canLinkIssue = canEditDocument && (isV2Document || isFormAnswersSet);

  const documentCreatedAt = DateFormatter.formatStandard({
    date: moment(document.created_at || document.attachment.created),
  });
  const createdByName =
    (document.created_by && document.created_by?.fullname) ||
    document.attachment?.created_by?.fullname;

  // V2 Documents only
  const createdByOrgName =
    isV2Document && document.created_by_organisation
      ? `(${document.created_by_organisation.name})`
      : '';
  const noteCreatedByDate =
    isV2Document &&
    document.annotation &&
    DateFormatter.formatStandard({
      date: moment(document.annotation?.annotation_date),
    });

  const issues = [
    ...(documentEntity.injury_occurrences || []),
    ...(documentEntity.illness_occurrences || []),
  ];

  const chronicIssues = [...(documentEntity.chronic_issues || [])];

  const updateDocument = isV2Document
    ? updateMedicalDocument
    : updateAttachment;

  const getConstructedDocumentDetailsString = (
    createdOnDate: ?string
  ): ?string => {
    if (createdByName) {
      if (createdOnDate) {
        return t(`Added on {{createdAt}} by {{createdByName}} {{org}}`, {
          createdAt: createdOnDate,
          createdByName,
          org: createdByOrgName,
        });
      }
      return t(`Added by {{createdByName}} {{org}}`, {
        createdByName,
        org: createdByOrgName,
      });
    }

    if (createdOnDate) {
      return t(`Added on {{createdAt}}`, { createdAt: createdOnDate });
    }
    return null;
  };

  return (
    <div css={style.parentContainer}>
      <div css={style.firstColumn}>
        <DocumentDetailsPanel
          document={document}
          isV2Document={isV2Document}
          canEdit={canEditDocument}
          documentNoteCategories={documentNoteCategories}
          isLoading={isDocumentNoteCategoriesLoading}
          updateDocument={updateDocument}
          constructedDetailsString={getConstructedDocumentDetailsString(
            documentCreatedAt
          )}
        />

        {isV2Document && (
          <AssociatedNotesPanel
            document={document}
            canEdit={canEditDocument}
            updateDocument={updateDocument}
            constructedDetailsString={getConstructedDocumentDetailsString(
              noteCreatedByDate || null
            )}
          />
        )}
      </div>
      <div css={style.smallerWidth}>
        <LinkedInjuriesPanel
          title={t('Associated injury / illness')}
          issues={issues}
          document={document}
          canEdit={canLinkIssue}
          athleteIssues={athleteIssues}
          isLoading={isAthleteIssuesLoading}
          updateDocument={
            isFormAnswersSet ? updateFormAnswersSetLinkedIssues : updateDocument
          }
        />

        {window.featureFlags['chronic-injury-illness'] && (
          <LinkedInjuriesPanel
            title={t('Linked chronic condition')}
            issues={chronicIssues}
            document={document}
            isChronic
            canEdit={canLinkIssue}
            athleteIssues={athleteIssues}
            isLoading={isAthleteIssuesLoading}
            updateDocument={
              isFormAnswersSet
                ? updateFormAnswersSetLinkedIssues
                : updateDocument
            }
          />
        )}
      </div>
    </div>
  );
};

export const DocumentsTabTranslated: ComponentType<Props> =
  withNamespaces()(DocumentTab);
export default DocumentTab;
