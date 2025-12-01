// @flow
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { useState, useEffect } from 'react';

import {
  Box,
  Dialog,
  Stack,
  IconButton,
  Typography,
} from '@kitman/playbook/components';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import { PdfViewerTranslated as PdfViewer } from '@kitman/components/src/PdfViewer';
import { DocumentScannerTranslated as DocumentScanner } from '@kitman/components/src/DocumentScanner';
import {
  MODE_KEY,
  thumbnailModeWidth,
} from '@kitman/components/src/PdfViewer/src/consts';
import { zIndices } from '@kitman/common/src/variables';
import { confirmFileUpload } from '@kitman/services/src/services/documents/generic/redux/services/apis/confirmFileUpload';
import splitDocument from '@kitman/services/src/services/medical/scanning/splitDocument';
import putFileToPresignedUrl from '@kitman/services/src/services/uploads/putFileToPresignedUrl';
import createJob from '@kitman/services/src/services/medical/scanning/createJob';
import { DocumentSplitterTranslated as DocumentSplitter } from '@kitman/components/src/DocumentSplitter';
import styles from '@kitman/modules/src/Medical/shared/components/MassScanningModal/styles';
import {
  headerHeight,
  documentDetailsWidth,
  thumbnailsContainerHeightAdjustment,
  uploadScanErrorToast,
  uploadScanProgressToast,
  TOAST_KEY,
  confirmFileURLPrefix,
} from '@kitman/modules/src/Medical/shared/components/MassScanningModal/consts';
import {
  DOCUMENT_SPLITTER_USAGE,
  splitDocumentSuccessToast,
  splitDocumentErrorToast,
} from '@kitman/components/src/DocumentSplitter/src/shared/consts';

// Types
import type { ToastDispatch } from '@kitman/components/src/types';
import type { ToastAction } from '@kitman/components/src/Toast/KitmanDesignSystem/hooks/useToasts';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { CreateJobResponse } from '@kitman/services/src/services/medical/scanning/createJob';
import type { AllocationAttribute } from '@kitman/modules/src/ElectronicFiles/shared/types';
import type { DocumentSplitterStep } from '@kitman/components/src/DocumentSplitter/src/shared/types';

type Props = {
  isOpen: boolean,
  onSavedSuccess: () => void,
  onClose: () => void,
  toastAction: ToastDispatch<ToastAction>, // Legacy way of doing toasts due to medical area store
  athleteId: ?number,
};

type ScanAndSplitStep = 'scan' | DocumentSplitterStep;

const MassScanningModal = ({
  t,
  isOpen,
  onClose,
  onSavedSuccess,
  toastAction,
  athleteId,
}: I18nProps<Props>) => {
  const [jobId, setJobId] = useState<?number>(null);
  const [currentStep, setCurrentStep] = useState<ScanAndSplitStep>('scan');
  const [fileUrl, setFileUrl] = useState<?string>(null);
  const [totalPages, setTotalPages] = useState<number>(0);

  useEffect(() => {
    setJobId(null);
    setCurrentStep('scan');
    setFileUrl(null);
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const showToast = (toast) => {
    // NOTE: The toast slice is not used in medical documents tab
    // There is a store with a toasts entry
    toastAction({
      type: 'CREATE_TOAST',
      toast,
    });
  };

  const removeToast = (id: string) => {
    // NOTE: The toast slice is not used in medical documents tab
    // There is a store with a toasts entry
    toastAction({
      type: 'REMOVE_TOAST_BY_ID',
      id,
    });
  };

  const uploadAndConfirmFile = async (file: File) => {
    try {
      showToast(uploadScanProgressToast());
      const job: CreateJobResponse = await createJob();
      setJobId(job.id);
      const attachmentId = job.source_attachment.id;
      await putFileToPresignedUrl(
        file,
        job.presigned_put_url,
        job.presigned_put_headers
      );

      // TODO: review with BE as confirmFileUpload return type is incorrect
      // as get an object with attachment prop not the attachment directly
      // $FlowIgnore[incompatible-call]
      const data = await confirmFileUpload(attachmentId, confirmFileURLPrefix);

      // $FlowIgnore[incompatible-call]
      setFileUrl(data.attachment.url);
      removeToast(TOAST_KEY.UPLOAD_SCAN_PROGRESS_TOAST);
    } catch (error) {
      removeToast(TOAST_KEY.UPLOAD_SCAN_PROGRESS_TOAST);
      // eslint-disable-next-line no-console
      console.log(error); // Keeping error log for now
      showToast(uploadScanErrorToast());
    }
  };

  const renderTitleStack = () => (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={1}
      p={1}
    >
      <Typography variant="h6" component="p" sx={{ color: 'text.primary' }}>
        {t('Scan')}
      </Typography>
      <IconButton onClick={onClose} disableRipple>
        <KitmanIcon name={KITMAN_ICON_NAMES.Close} />
      </IconButton>
    </Stack>
  );

  const renderDocumentSplitterSteps = () => (
    <Dialog
      fullWidth
      maxWidth="xl"
      open={isOpen}
      onClose={onClose}
      sx={{
        zIndex: zIndices.modal,
      }}
      PaperProps={{
        sx: styles.modalPaper,
      }}
    >
      {renderTitleStack()}

      <Box>
        <Stack
          direction="row"
          justifyContent="flex-start"
          alignItems="flex-start"
        >
          <Box
            sx={{
              width:
                currentStep === 'documentDetails'
                  ? `calc(100% - ${documentDetailsWidth}px - 10px)`
                  : thumbnailModeWidth,
              overflowY: 'auto',
              overflowX: 'hidden',
              position: 'absolute',
              top: `${headerHeight}px`,
              bottom: 0,
            }}
          >
            <PdfViewer
              forceShowPreview={currentStep === 'allocations'}
              thumbnailsContainerOffsetRight={documentDetailsWidth}
              thumbnailsContainerHeightAdjustment={
                thumbnailsContainerHeightAdjustment
              }
              isThumbnailsContainerPositionFixed={
                currentStep === 'documentDetails'
              }
              fileUrl={fileUrl || ''}
              mode={
                currentStep === 'documentDetails'
                  ? MODE_KEY.full
                  : MODE_KEY.thumbnail
              }
            />
          </Box>
          <Box
            sx={
              currentStep === 'documentDetails'
                ? {
                    ml: `calc(100% - ${documentDetailsWidth}px)`,
                    width: `${documentDetailsWidth}px`,
                  }
                : {
                    ml: `${thumbnailModeWidth}px`,
                    width: `calc(100% - ${thumbnailModeWidth}px)`,
                  }
            }
          >
            <DocumentSplitter
              usage={DOCUMENT_SPLITTER_USAGE.massScanning}
              isOpen={isOpen}
              totalPages={totalPages}
              athleteId={athleteId}
              onStepChangedCallback={(step: DocumentSplitterStep) => {
                setCurrentStep(step);
              }}
              onCloseCallback={onClose}
              onSaveSuccessCallback={() => {
                showToast(splitDocumentSuccessToast());
                onSavedSuccess();
              }}
              onSaveErrorCallback={(message) => {
                showToast(splitDocumentErrorToast(message));
              }}
              processAllocationsCallback={(
                documentSplit: Array<AllocationAttribute>
              ) => {
                if (jobId != null) {
                  return splitDocument({
                    jobId,
                    splitConfig: {
                      range_assignments: documentSplit,
                    },
                  });
                }
                return Promise.reject(new Error('JobId not set'));
              }}
            />
          </Box>
        </Stack>
      </Box>
    </Dialog>
  );

  const renderScanningStep = () => (
    <DocumentScanner
      isOpen={isOpen}
      onCancel={onClose}
      hideFilenameInput
      onSave={async (file: File, pageCount: number) => {
        setTotalPages(pageCount);
        await uploadAndConfirmFile(file);
        setCurrentStep('documentDetails');
      }}
    />
  );

  if (currentStep === 'scan') {
    return renderScanningStep();
  }

  return renderDocumentSplitterSteps();
};

export const MassScanningModalTranslated: ComponentType<Props> =
  withNamespaces()(MassScanningModal);
export default MassScanningModal;
