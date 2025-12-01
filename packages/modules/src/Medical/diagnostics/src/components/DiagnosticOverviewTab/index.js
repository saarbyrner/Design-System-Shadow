// @flow
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import uuid from 'uuid';

import { AppStatus, LineLoader } from '@kitman/components';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import type { Diagnostic } from '@kitman/services/src/services/medical/__tests__/getDiagnostics.test';
import { useOrganisation } from '@kitman/common/src/contexts/OrganisationContext';
import useMedicalNotes from '@kitman/modules/src/Medical/shared/hooks/useMedicalNotes';
import { useDiagnostic } from '@kitman/modules/src/Medical/shared/contexts/DiagnosticContext';
import { useDiagnosticResults } from '@kitman/modules/src/Medical/shared/contexts/DiagnosticResultsContext';

import AddDiagnosticAttachmentSidePanel from '@kitman/modules/src/Medical/shared/containers/AddDiagnosticAttachmentSidePanel';
import AddDiagnosticLinkSidePanel from '@kitman/modules/src/Medical/shared/containers/AddDiagnosticLinkSidePanel';
import AddMedicalNoteSidePanel from '@kitman/modules/src/Medical/shared/containers/AddMedicalNoteSidePanel';
import AddDiagnosticSidePanel from '@kitman/modules/src/Medical/shared/containers/AddDiagnosticSidePanel';
import { MedicalNoteCardTranslated as MedicalNoteCard } from '@kitman/modules/src/Medical/shared/components/MedicalNotesTab/components/MedicalNoteCard';
import {
  openAddDiagnosticAttachmentSidePanel,
  openAddDiagnosticLinkSidePanel,
} from '@kitman/modules/src/Medical/shared/redux/actions';
import type { RequestStatus } from '@kitman/modules/src/Medical/shared/types';
import { DiagnosticDetailsTranslated as DiagnosticDetails } from '@kitman/modules/src/Medical/diagnostics/src/components/DiagnosticDetails';
import { AttachmentsTranslated as Attachments } from '@kitman/modules/src/Medical/diagnostics/src/components/Attachments';
import { LinkedIssueTranslated as LinkedIssue } from '@kitman/modules/src/Medical/diagnostics/src/components/LinkedIssue';
import { AskOnEntryQuestionsTranslated as AskOnEntryQuestions } from '@kitman/modules/src/Medical/diagnostics/src/components/AskOnEntryQuestions';
import { RadiologyReportTranslated as RadiologyReport } from '@kitman/modules/src/Medical/diagnostics/src/components/Results/RadiologyReport';
import { LabReportTranslated as LabReport } from '@kitman/modules/src/Medical/diagnostics/src/components/Results/LabReport';
import DeleteAttachmentModalContainer from '@kitman/modules/src/Medical/diagnostics/src/components/DeleteAttachment/DeleteAttachmentContainer';
import style from './styles';

type Props = { hiddenFilters?: ?Array<string> };

const DiagnosticOverviewTab = (props: Props) => {
  const { permissions } = usePermissions();
  const { organisation } = useOrganisation();
  const { diagnostic, updateDiagnostic } = useDiagnostic();
  const { resultBlocks } = useDiagnosticResults();

  const resultsResponse = resultBlocks?.results ? resultBlocks?.results : [];

  const [deleteAttachmentModalOpen, setDeleteAttachmentModalOpen] =
    useState<boolean>(false);

  const [attachmentTitle, setAttachmentTitle] = useState<string>('');
  const [attachmentIdToDelete, setAttachmentIdToDelete] = useState<number>(-1);
  const { medicalNotes, fetchMedicalNotes, resetMedicalNotes } =
    useMedicalNotes({
      withPagination: false,
    });
  const isRedoxOrg =
    // eslint-disable-next-line dot-notation
    window.featureFlags['redox'] && window.featureFlags['redox-iteration-1'];
  const dispatch = useDispatch();

  const [requestStatus, setRequestStatus] = useState<RequestStatus>(null);
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
        setRequestStatus('SUCCESS');
      })
      .catch(() => {
        setRequestStatus('FAILURE');
      });
  }, []);

  const buildNotes = () => {
    if (!permissions.medical.notes.canView) return;
    resetMedicalNotes();
    fetchMedicalNotes(filters, true)
      .then(() => {
        setRequestStatus('SUCCESS');
      })
      .catch(() => {
        setRequestStatus('FAILURE');
      });
  };

  const onSave = (updatedDiagnostic: Diagnostic) => {
    // Diagnostic that returns from attachment and link endpoints is missing required data
    // link endpoint sends back a different data structure
    const isAttachmentId = typeof updatedDiagnostic === 'number';

    if (!isAttachmentId) {
      const enrichedUpdatedDiagnostic = updatedDiagnostic.diagnostic
        ? {
            ...diagnostic,
            ...updatedDiagnostic.diagnostic,
          }
        : {
            ...diagnostic,
            ...updatedDiagnostic,
          };
      updateDiagnostic?.(enrichedUpdatedDiagnostic);
      return;
    }

    const attachmentsToUpdate = diagnostic.attachments.filter(
      ({ id }) => id !== updatedDiagnostic
    );
    const diagnosticWithUpdatedAttachments = {
      ...diagnostic,
      attachments: attachmentsToUpdate,
    };

    updateDiagnostic?.(diagnosticWithUpdatedAttachments);
  };

  if (requestStatus === 'FAILURE') {
    return <AppStatus status="error" />;
  }

  const canEditEntity = () => {
    return medicalNotes[0]?.organisation_id === organisation.id;
  };

  return (
    <div css={style.diagnosticOverviewTab} data-testid="diagnosticOverviewTab">
      {requestStatus === 'PENDING' && (
        <div css={style.sectionLoader}>
          <LineLoader />
        </div>
      )}
      <div css={style.mainContent}>
        <DiagnosticDetails hiddenFilters={props.hiddenFilters} />

        {isRedoxOrg &&
          resultsResponse.length > 0 &&
          resultsResponse.map((resultBlock) => {
            if (
              resultBlock.type === 'report' &&
              resultBlock.results.length > 0
            ) {
              return (
                <div key={uuid()}>
                  <RadiologyReport
                    key={resultBlock.result_group_id}
                    setRequestStatus={setRequestStatus}
                    resultBlocks={resultBlock}
                    diagnosticId={diagnostic.id}
                  />
                </div>
              );
            }

            if (resultBlock.type === 'lab' && resultBlock.results.length > 0) {
              return (
                <div key={uuid()}>
                  <LabReport
                    key={resultBlock.result_group_id}
                    setRequestStatus={setRequestStatus}
                    resultBlocks={resultBlock}
                    diagnosticId={diagnostic.id}
                  />
                </div>
              );
            }
            return null;
          })}
        {medicalNotes[0]?.annotationable?.athlete?.id &&
          permissions.medical.notes.canView && (
            <MedicalNoteCard
              athleteId={medicalNotes[0].annotationable.athlete.id}
              key={medicalNotes[0].id}
              withAvatar
              note={medicalNotes[0]}
              isLoading={requestStatus === 'PENDING'}
              hasActions={canEditEntity()}
              onReloadData={buildNotes}
            />
          )}
      </div>
      <div id="Diagnostics|sideBar">
        <LinkedIssue />
        {diagnostic?.diagnostic_type_answers?.length ? (
          <AskOnEntryQuestions />
        ) : null}
        <Attachments
          onOpenDeleteAttachmentModal={(title, attachmentId) => {
            setAttachmentIdToDelete(attachmentId);
            setAttachmentTitle(title);
            setDeleteAttachmentModalOpen(true);
          }}
          onOpenAddDiagnosticAttachmentSidePanel={(diagnosticId, athleteId) => {
            dispatch(
              openAddDiagnosticAttachmentSidePanel({ diagnosticId, athleteId })
            );
          }}
          onOpenAddDiagnosticLinkSidePanel={(diagnosticId, athleteId) => {
            dispatch(
              openAddDiagnosticLinkSidePanel({ diagnosticId, athleteId })
            );
          }}
        />
      </div>
      <AddDiagnosticSidePanel
        athleteId={diagnostic.athlete.id}
        diagnosticToUpdate={diagnostic}
      />
      <AddDiagnosticAttachmentSidePanel
        diagnosticId={diagnostic.id}
        athleteId={diagnostic.athlete.id}
        onSaveAttachment={onSave}
      />
      <AddDiagnosticLinkSidePanel
        diagnosticId={diagnostic.id}
        athleteId={diagnostic.athlete.id}
        onSaveLink={onSave}
      />
      <AddMedicalNoteSidePanel
        athleteId={diagnostic.athlete.id}
        onSaveNote={buildNotes}
      />

      <DeleteAttachmentModalContainer
        isOpen={deleteAttachmentModalOpen}
        attachmentTitle={attachmentTitle}
        attachmentId={attachmentIdToDelete}
        diagnosticId={diagnostic.id}
        onClose={() => setDeleteAttachmentModalOpen(false)}
        onPressEscape={() => setDeleteAttachmentModalOpen(false)}
        onReloadData={onSave}
      />
    </div>
  );
};

export default DiagnosticOverviewTab;
