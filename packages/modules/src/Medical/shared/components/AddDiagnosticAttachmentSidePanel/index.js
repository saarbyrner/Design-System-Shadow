// @flow
import { useState, useEffect } from 'react';
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import {
  AppStatus,
  FileUploadArea,
  SlidingPanelResponsive,
  TextButton,
} from '@kitman/components';
import { checkInvalidFileTitles } from '@kitman/common/src/utils/fileHelper';
import fileSizeLabel from '@kitman/common/src/utils/fileSizeLabel';
import {
  saveDiagnosticAttachment,
  saveAttachmentLegacy as saveAttachment,
} from '@kitman/services';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import useDiagnosticAttachmentForm from './hooks/useDiagnosticAttachmentForm';
import type { RequestStatus } from '../../types';
import style from './styles';

type Props = {
  isOpen: boolean,
  onClose: Function,
  diagnosticId: number,
  onSaveAttachment: Function,
  athleteId: number,
  initialDataRequestStatus: RequestStatus,
  onFileUploadStart: Function,
  onFileUploadSuccess: Function,
  onFileUploadFailure: Function,
};

const AddDiagnosticAttachmentSidePanel = (props: I18nProps<Props>) => {
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('PENDING');
  const [toggleDisableSave, setToggleDisableSave] = useState(true);

  const { formState, dispatch } = useDiagnosticAttachmentForm();
  useEffect(() => {
    if (props.athleteId) {
      dispatch({ type: 'SET_ATHLETE_ID', athleteId: props.athleteId });
    }

    if (!props.isOpen) {
      dispatch({ type: 'CLEAR_FORM' });
    }
  }, [props.athleteId, props.isOpen]);

  useEffect(() => {
    if (props.diagnosticId) {
      dispatch({ type: 'SET_DIAGNOSTIC_ID', diagnosticId: props.diagnosticId });
    }
  }, [props.diagnosticId]);

  const checkDisabled = (queuedAttachments) =>
    queuedAttachments.length > 0
      ? setToggleDisableSave(false)
      : setToggleDisableSave(true);

  const uploadAttachmentsAndSave = (queuedAttachments) => {
    setRequestStatus('PENDING');
    const performUpload = (attachment) => {
      return new Promise((resolve, reject) => {
        const file = attachment.file;
        const fileName = file.name;
        const fileSize = fileSizeLabel(attachment.fileSize, true);
        const fileId = attachment.id;
        props.onFileUploadStart(fileName, fileSize, fileId);
        saveAttachment(file, attachment.fileTitle)
          .then((response) => {
            resolve(response.attachment_id);
            props.onFileUploadSuccess(fileId);
          })
          .catch(() => {
            reject();
            props.onFileUploadFailure(fileId);
          });
      });
    };

    Promise.all(queuedAttachments.map(performUpload)).then((attachmentIds) => {
      saveDiagnosticAttachment(
        // $FlowFixMe athleteId cannot be null here as validation will have caught it
        formState.athleteId,
        // $FlowFixMe diagnosticId cannot be null here as validation will have caught it
        formState.diagnosticId,
        attachmentIds
      )
        .then((fetchedUpdatedDiagnostic) => {
          setRequestStatus('SUCCESS');
          props.onSaveAttachment(fetchedUpdatedDiagnostic);
          props.onClose();
        })
        .catch(() => setRequestStatus('FAILURE'));
    });
  };
  const onSave = () => {
    const requiredFields = [formState.diagnosticId, formState.athleteId];

    const allRequiredFieldsAreValid = requiredFields.every((item) => item);

    // If the validation fails, abort
    if (
      !allRequiredFieldsAreValid ||
      checkInvalidFileTitles(formState.queuedAttachments)
    ) {
      return;
    }
    uploadAttachmentsAndSave(formState.queuedAttachments);
  };
  return (
    <div css={style.sidePanel} data-testid="AddDiagnosticAttachmentSidePanel">
      <SlidingPanelResponsive
        isOpen={props.isOpen}
        title={props.t('Add attachment to diagnostic')}
        onClose={() => props.onClose()}
        width={659}
      >
        <div css={style.content}>
          <FileUploadArea
            showActionButton={false}
            testIdPrefix="AddDiagnosticAttachmentSidePanel"
            isFileError={false}
            updateFiles={(queuedAttachments) => {
              checkDisabled(queuedAttachments);
              dispatch({
                type: 'UPDATE_QUEUED_ATTACHMENTS',
                queuedAttachments,
              });
            }}
            attachedFiles={formState.queuedAttachments}
            removeFiles={props.isOpen}
          />
        </div>
        <div css={style.actions}>
          <TextButton
            isDisabled={toggleDisableSave}
            onClick={onSave}
            text={props.t('Save')}
            type="primary"
            kitmanDesignSystem
          />
        </div>
        {(requestStatus === 'FAILURE' ||
          props.initialDataRequestStatus === 'FAILURE') && (
          <AppStatus status="error" />
        )}
      </SlidingPanelResponsive>
    </div>
  );
};

export const AddDiagnosticAttachmentSidePanelTranslated: ComponentType<Props> =
  withNamespaces()(AddDiagnosticAttachmentSidePanel);
export default AddDiagnosticAttachmentSidePanel;
