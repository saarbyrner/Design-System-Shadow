// @flow
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { AppStatus, LineLoader } from '@kitman/components';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';

import type { AthleteData } from '@kitman/services/src/services/getAthleteData';
import useMedicalNotes from '@kitman/modules/src/Medical/shared/hooks/useMedicalNotes';
import { useProcedure } from '@kitman/modules/src/Medical/shared/contexts/ProcedureContext';
import { ProcedureDetailsTranslated as ProcedureDetails } from '@kitman/modules/src/Medical/procedures/src/components/ProcedureOverviewTab/components/ProcedureDetails';
import { MedicalNoteCardTranslated as MedicalNoteCard } from '@kitman/modules/src/Medical/shared/components/MedicalNotesTab/components/MedicalNoteCard';
import { ReasonTranslated as Reason } from '@kitman/modules/src/Medical/procedures/src/components/ProcedureOverviewTab/components/ProcedureDetails/components/Reason';
import { AttachmentsTranslated as Attachments } from '@kitman/modules/src/Medical/procedures/src/components/ProcedureOverviewTab/components/ProcedureDetails/components/Attachments';

import type { RequestStatus } from '@kitman/modules/src/Medical/shared/types';
import { openAddProcedureAttachmentSidePanel } from '@kitman/modules/src/Medical/shared/redux/actions';
import DeleteAttachmentModalContainer from '@kitman/modules/src/Medical/procedures/src/components/ProcedureOverviewTab/components/ProcedureDetails/components/DeleteAttachment/DeleteAttachmentContainer';
import style from '@kitman/modules/src/Medical/procedures/src/components/ProcedureOverviewTab/styles';

const ProcedureOverviewTab = ({
  athleteData,
}: {
  athleteData: AthleteData,
}) => {
  const { permissions } = usePermissions();
  const { procedure, updateProcedure } = useProcedure();
  const { medicalNotes, fetchMedicalNotes, resetMedicalNotes } =
    useMedicalNotes({
      withPagination: false,
    });

  const [requestStatus, setRequestStatus] = useState<RequestStatus>(null);

  const [deleteAttachmentModalOpen, setDeleteAttachmentModalOpen] =
    useState<boolean>(false);

  const [attachmentTitle, setAttachmentTitle] = useState<string>('');
  const [attachmentIdToDelete, setAttachmentIdToDelete] = useState<number>(-1);

  const dispatch = useDispatch();

  const filters = {
    content: '',
    author: [],
    squads: [],
    organisation_annotation_type: ['OrganisationAnnotationTypes::Procedure'],
    organisation_annotation_type_ids: [],
    athlete_id: procedure?.athlete?.id || null,
    procedure_id: procedure?.id,
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

  const onDeleteAttachment = (removedAttachmentId: number) => {
    const isAttachmentId = typeof removedAttachmentId === 'number';

    if (!isAttachmentId) return;

    const attachmentsToUpdate = procedure?.attachments.filter(
      ({ id }) => id !== removedAttachmentId
    );

    const procedureWithUpdatedAttachments = {
      ...procedure,
      attachments: attachmentsToUpdate,
    };

    updateProcedure?.(procedureWithUpdatedAttachments);
  };

  if (requestStatus === 'FAILURE') {
    return <AppStatus status="error" />;
  }

  return (
    <div
      css={style.ProcedureOverviewTab}
      data-testid="ProcedureOverviewTab|Main"
    >
      {requestStatus === 'PENDING' && (
        <div css={style.sectionLoader}>
          <LineLoader />
        </div>
      )}
      <div
        data-testid="ProcedureOverviewTab|ProcedureDetails"
        css={style.mainContent}
      >
        <ProcedureDetails />
        {medicalNotes[0]?.annotationable?.athlete?.id &&
          permissions.medical.notes.canView && (
            <MedicalNoteCard
              athleteId={medicalNotes[0].annotationable.athlete.id}
              key={medicalNotes[0].id}
              withAvatar
              note={medicalNotes[0]}
              isLoading={requestStatus === 'PENDING'}
              hasActions
              onReloadData={buildNotes}
              athleteData={athleteData}
            />
          )}
      </div>

      <section data-testid="ProcedureOverviewTab|Sidebar" css={style.sidebar}>
        <Reason />
        <Attachments
          onOpenAddProcedureAttachmentSidePanel={(procedureId, athleteId) => {
            dispatch(
              openAddProcedureAttachmentSidePanel({ procedureId, athleteId })
            );
          }}
          onOpenDeleteAttachmentModal={(title, attachmentId) => {
            setAttachmentIdToDelete(attachmentId);
            setAttachmentTitle(title);
            setDeleteAttachmentModalOpen(true);
          }}
        />
        <DeleteAttachmentModalContainer
          isOpen={deleteAttachmentModalOpen}
          attachmentTitle={attachmentTitle}
          attachmentId={attachmentIdToDelete}
          procedureId={procedure.id}
          onClose={() => setDeleteAttachmentModalOpen(false)}
          onPressEscape={() => setDeleteAttachmentModalOpen(false)}
          onReloadData={onDeleteAttachment}
        />
      </section>
    </div>
  );
};

export default ProcedureOverviewTab;
