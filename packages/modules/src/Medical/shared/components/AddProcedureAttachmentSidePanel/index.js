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
import {
  checkInvalidFileTitles,
  transformFilesForUpload,
} from '@kitman/common/src/utils/fileHelper';
import fileSizeLabel from '@kitman/common/src/utils/fileSizeLabel';
import { saveProcedureAttachment, uploadFile } from '@kitman/services';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import useProcedureAttachmentForm from './hooks/useProcedureAttachmentForm';
import type { RequestStatus } from '../../types';
import style from './styles';

type Props = {
  isOpen: boolean,
  onClose: Function,
  procedureId: number,
  onSaveAttachment: Function,
  athleteId: number,
  initialDataRequestStatus: RequestStatus,
  onFileUploadStart: Function,
  onFileUploadSuccess: Function,
};

const AddProcedureAttachmentSidePanel = (props: I18nProps<Props>) => {
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('PENDING');
  const [toggleDisableSave, setToggleDisableSave] = useState(true);

  const { formState, dispatch } = useProcedureAttachmentForm();
  useEffect(() => {
    if (props.athleteId) {
      dispatch({ type: 'SET_ATHLETE_ID', athleteId: props.athleteId });
    }

    if (!props.isOpen) {
      dispatch({ type: 'CLEAR_FORM' });
    }
  }, [props.athleteId, props.isOpen]);

  useEffect(() => {
    if (props.procedureId) {
      dispatch({ type: 'SET_PROCEDURE_ID', procedureId: props.procedureId });
    }
  }, [props.procedureId]);

  const checkDisabled = (queuedAttachments) =>
    queuedAttachments.length > 0
      ? setToggleDisableSave(false)
      : setToggleDisableSave(true);

  // We send an array of attachments up through props.onSaveAttachment so that updateProcedure() can run cleanly
  const uploadFiles = (unConfirmedFiles) => {
    // We need to return an array of promises for each file
    const promiseArray = [];

    unConfirmedFiles.forEach((unConfirmedFile, unconfirmedFileIndex) => {
      const unUploadedFile =
        formState.queuedAttachments[unconfirmedFileIndex].file;

      const fileName = unUploadedFile.name;
      const fileSize = fileSizeLabel(unUploadedFile.size, true);
      const fileId = unConfirmedFile.id;

      props.onFileUploadStart(fileName, fileSize, fileId);

      promiseArray.push(
        uploadFile(
          unUploadedFile,
          unConfirmedFile.id,
          unConfirmedFile.presigned_post
        )
      );
    });

    Promise.all(promiseArray)
      .then((confirmedUploads) => {
        props.onSaveAttachment(
          confirmedUploads.map((file) => {
            props.onFileUploadSuccess(file.attachment.id);
            return file.attachment;
          })
        );
      })
      .catch(() => setRequestStatus('FAILURE'));
  };

  const onSave = () => {
    const transformedFiles = transformFilesForUpload(
      formState.queuedAttachments
    );

    const requiredFields = [
      formState.procedureId,
      formState.athleteId,
      transformedFiles,
    ];

    const allRequiredFieldsAreValid = requiredFields.every((item) => item);

    // If the validation fails, abort
    if (
      !allRequiredFieldsAreValid ||
      checkInvalidFileTitles(formState.queuedAttachments)
    ) {
      return;
    }

    saveProcedureAttachment(
      // $FlowFixMe athleteId cannot be null here as validation will have caught it
      formState.athleteId,
      // $FlowFixMe procedureId cannot be null here as validation will have caught it
      formState.procedureId,
      transformedFiles
    )
      .then((response) => {
        const unConfirmedFiles = response?.filter((file) => !file.confirmed);
        if (unConfirmedFiles.length > 0) {
          uploadFiles(unConfirmedFiles);
        }
        setRequestStatus(null);
        props.onClose();
      })
      .catch(() => setRequestStatus('FAILURE'));
  };
  return (
    <div data-testid="AddProcedureAttachmentSidePanel">
      <SlidingPanelResponsive
        isOpen={props.isOpen}
        kitmanDesignSystem
        title={props.t('Add attachment to procedure')}
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

export const AddProcedureAttachmentSidePanelTranslated: ComponentType<Props> =
  withNamespaces()(AddProcedureAttachmentSidePanel);
export default AddProcedureAttachmentSidePanel;
