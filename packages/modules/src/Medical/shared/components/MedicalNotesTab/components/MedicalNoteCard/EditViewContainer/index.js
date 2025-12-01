// @flow
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import type { RequestStatus } from '@kitman/modules/src/Medical/shared/types';
import fileSizeLabel from '@kitman/common/src/utils/fileSizeLabel';
import { dateTransferFormat } from '@kitman/common/src/utils/dateFormatter';
import moment from 'moment';
import type { AthleteData } from '@kitman/services/src/services/getAthleteData';
import type { MedicalNote } from '@kitman/modules/src/Medical/shared/types/medical';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import performanceMedicineEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/performanceMedicine';
import { determineMedicalLevelAndTab } from '@kitman/common/src/utils/TrackingData/src/data/medical/getMedicalEventData';
import {
  addToast,
  updateToast,
  removeToast,
} from '@kitman/modules/src/Medical/shared/redux/actions';
import { useGetStaffUsersQuery } from '@kitman/modules/src/Medical/shared/redux/services/medical';
import useAthletesIssuesGrouped from '@kitman/modules/src/Medical/shared/hooks/useAthletesIssuesAsGroupedSelectOptions';
import { updateAnnotation, uploadFile } from '@kitman/services';
import { getIssueIds } from '@kitman/modules/src/Medical/shared/utils';
import type { AttachedFile } from '@kitman/common/src/utils/fileHelper';
import {
  checkInvalidFileTitles,
  transformFilesForUpload,
} from '@kitman/common/src/utils/fileHelper';
import type { Attachment } from '@kitman/services/src/services/updateAnnotation';
import type { CurrentUserData } from '@kitman/services/src/services/getCurrentUser';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { handleNoteVisibilityAllowList } from '../ConfidentialNotesVisibility/utils';
import useEditMedicalNoteForm from '../hooks/useEditMedicalNoteForm';
import { EditViewTranslated as EditView } from '../EditView';

type Visibility = 'DOCTORS' | 'PSYCH_TEAM' | 'DEFAULT';

type Props = {
  note: MedicalNote,
  athleteId: ?number,
  withAvatar?: boolean,
  isLoading?: boolean,
  onSetViewType: Function,
  viewType: string,
  onReloadData: Function,
  isPastAthlete: boolean,
  athleteData?: AthleteData,
  currentUser?: CurrentUserData,
};

const EditViewContainer = (props: Props) => {
  const dispatch = useDispatch();
  const { trackEvent } = useEventTracking();

  const { permissions } = usePermissions();

  const [requestStatus, setRequestStatus] = useState<RequestStatus>('SUCCESS');

  const [fileUploadQueue, setFileUploadQueue] = useState<Array<AttachedFile>>(
    []
  );

  const allowConfidentialNote =
    permissions.medical.privateNotes.canCreate &&
    window.featureFlags['confidential-notes'] &&
    !props.note?.annotationable_type !== 'Diagnostic';

  const getVisibility = (): Visibility => {
    if (props.note.restricted_to_doc) return 'DOCTORS';
    if (props.note.restricted_to_psych) return 'PSYCH_TEAM';
    return 'DEFAULT';
  };

  const athleteId =
    props.note.annotationable?.athlete?.id ??
    props.note.annotationable?.id ??
    null;

  const { formState, dispatch: formDispatch } = useEditMedicalNoteForm({
    annotationableType: props.note?.annotationable_type
      ? props.note?.annotationable_type
      : null,
    documentCategoryIds: props.note?.document_note_categories
      ? props.note.document_note_categories.map((category) => category.id)
      : [],
    athleteId,
    annotationableId: props.note.id,
    medicalNoteType: props.note.organisation_annotation_type.id,
    title: props.note.title,
    annotationDate: props.note.annotation_date,
    noteContent: props.note.content,
    visibility: getVisibility(),
    squadId: props.note.squad?.id ?? null,
    illnessIds: props.note.illness_occurrences.map((illness) => illness.id),
    injuryIds: props.note.injury_occurrences.map((injury) => injury.id),
    chronicIds: props.note.chronic_issues?.map((issue) => issue.id) || [],
    attachments: props.note.attachments,
    rehabSessionIds: props.note?.rehab_sessions
      ? props.note.rehab_sessions.map((session) => session.id)
      : null,
    authorId: props.note?.author?.id || null,
    noteVisibilityIds: handleNoteVisibilityAllowList(
      props.note,
      props.currentUser
    ),
  });

  const { athleteIssuesOptions = [], isLoading: isAthleteIssuesLoading } =
    useAthletesIssuesGrouped({
      athleteId,
      skipRequest: !athleteId || props.viewType === 'PRESENTATION',
    });

  const { data: staffUsers = [], isLoading: isStaffUsersLoading } =
    useGetStaffUsersQuery(null, { skip: props.viewType === 'PRESENTATION' });

  const sortedStaffUsers = staffUsers
    .map(({ id, fullname, firstname, lastname }) => ({
      value: id,
      label: fullname,
      firstname,
      lastname,
    }))
    .sort((a, b) => {
      const lowercaseA = a.label.toLowerCase();
      const lowercaseB = b.label.toLowerCase();
      return lowercaseA.localeCompare(lowercaseB);
    });

  const isFormValid = () => {
    const requiredFields = [formState.title, formState.content];
    return requiredFields.every((item) => item);
  };

  const handleFileUploadStart = (fileName, fileSize, fileId) => {
    dispatch(
      addToast({
        title: fileName,
        description: fileSize,
        status: 'LOADING',
        id: fileId,
      })
    );
  };

  const handleFileUploadFailure = (fileId) => {
    dispatch(updateToast(fileId, { status: 'ERROR' }));
    setTimeout(() => dispatch(removeToast(fileId)), 5000);
  };

  const handleFileUploadSuccess = (fileId) => {
    props.onReloadData();
    dispatch(updateToast(fileId, { status: 'SUCCESS' }));
    setTimeout(() => dispatch(removeToast(fileId)), 5000);
  };

  const uploadFiles = (uploadQueue) => {
    uploadQueue.forEach((queueItem, index) => {
      const unUploadedFile = fileUploadQueue[index].file;
      const fileName = unUploadedFile.name;
      const fileSize = fileSizeLabel(unUploadedFile.size, true);
      const fileId = queueItem.id;

      handleFileUploadStart(fileName, fileSize, fileId);

      uploadFile(
        fileUploadQueue[index].file,
        queueItem.id,
        queueItem.presigned_post
      )
        .then(() => handleFileUploadSuccess(fileId))
        .catch(() => handleFileUploadFailure(fileId));
    });
  };

  const handleOnSaveNote = () => {
    setRequestStatus('PENDING');
    if (
      !isFormValid() ||
      (fileUploadQueue.length > 0 && checkInvalidFileTitles(fileUploadQueue))
    ) {
      setRequestStatus('SUCCESS');
      return;
    }

    const mappedQueue = transformFilesForUpload(fileUploadQueue);

    const attachmentAttributes = [
      ...mappedQueue,
      ...props.note.attachments.map((attachment): Attachment => ({
        ...attachment,
        original_filename: attachment.filename,
      })),
    ];

    // $FlowFixMe id will never be null as we have a selected a note to get here...
    updateAnnotation(
      {
        ...formState,
        ...(allowConfidentialNote &&
          formState.note_visibility_ids?.filter((allowed) => allowed.value)
            .length && {
            allow_list: formState.note_visibility_ids?.map(
              (allowed) => allowed.value
            ),
          }),
        attachments_attributes: attachmentAttributes,
      },
      props.note.id
    )
      .then((response) => {
        const uploadQueue = response.attachments.filter(
          (file) => !file.confirmed
        );
        if (uploadQueue.length > 0) {
          uploadFiles(uploadQueue);
        }
        trackEvent(
          performanceMedicineEventNames.editedMedicalNote,
          determineMedicalLevelAndTab()
        );
        setRequestStatus('SUCCESS');
        props.onReloadData();
      })
      .catch(() => {
        setRequestStatus('FAILURE');
      });
  };

  const handleUpdateIssues = (ids) => {
    const illnessIds = getIssueIds('Illness', ids);
    const injuryIds = getIssueIds('Injury', ids);
    const chronicIds = getIssueIds('ChronicInjury', ids);
    formDispatch({ type: 'SET_ILLNESS_IDS', illnessIds });
    formDispatch({ type: 'SET_INJURY_IDS', injuryIds });
    formDispatch({ type: 'SET_CHRONIC_IDS', chronicIds });
  };

  return (
    <EditView
      {...props}
      requestStatus={requestStatus}
      athleteIssues={{
        options: athleteIssuesOptions,
        isLoading: isAthleteIssuesLoading,
      }}
      staffUsers={{
        data: sortedStaffUsers,
        isLoading: isStaffUsersLoading,
      }}
      formState={formState}
      fileUploadQueue={fileUploadQueue}
      onSetFileUploadQueue={setFileUploadQueue}
      onSaveNote={handleOnSaveNote}
      onUpdateIssues={handleUpdateIssues}
      onUpdateTitle={(title) => formDispatch({ type: 'SET_TITLE', title })}
      onUpdateDate={(val) =>
        formDispatch({
          type: 'SET_DATE',
          date: moment(val).format(dateTransferFormat),
        })
      }
      onUpdateContent={(content) =>
        formDispatch({ type: 'SET_CONTENT', content })
      }
      onUpdateVisibility={(id) => formDispatch({ type: 'SET_VISIBILITY', id })}
      onUpdateSquad={(id) => formDispatch({ type: 'SET_SQUAD', id })}
      onUpdateAuthor={(userId) =>
        formDispatch({ type: 'SET_AUTHOR_ID', userId })
      }
      onResetAttachments={() => formDispatch({ type: 'RESET_ATTACHMENTS' })}
      onNoteVisibilityChange={(noteVisibilityIds) =>
        formDispatch({
          type: 'SET_NOTE_VISIBILITY_IDS',
          noteVisibilityIds,
        })
      }
    />
  );
};

export default EditViewContainer;
