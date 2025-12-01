// @flow
import { useState, useEffect, type ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { Box, Grid2 as Grid } from '@kitman/playbook/components';
import { MODE_KEY } from '@kitman/components/src/PdfViewer/src/consts';
import { add } from '@kitman/modules/src/Toasts/toastsSlice';
import { clearAnyExistingElectronicFileToast } from '@kitman/modules/src/ElectronicFiles/shared/utils';
import { useUpdateViewedMutation } from '@kitman/modules/src/ElectronicFiles/shared/services/electronicFiles';
import { PdfViewerTranslated as PdfViewer } from '@kitman/components/src/PdfViewer';
import { DocumentSplitterTranslated as DocumentSplitter } from '@kitman/components/src/DocumentSplitter';
import splitDocument from '@kitman/modules/src/ElectronicFiles/shared/services/api/splitDocument';
import {
  DOCUMENT_SPLITTER_USAGE,
  splitDocumentSuccessToast,
  splitDocumentErrorToast,
} from '@kitman/components/src/DocumentSplitter/src/shared/consts';

// Types
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { DocumentSplitterStep } from '@kitman/components/src/DocumentSplitter/src/shared/types';
import type {
  ElectronicFile,
  AllocationAttribute,
} from '@kitman/modules/src/ElectronicFiles/shared/types';

type Props = {
  electronicFile: ElectronicFile,
};

const InboundContent = ({ electronicFile, t }: I18nProps<Props>) => {
  const dispatch = useDispatch();
  const [updateViewed] = useUpdateViewedMutation();

  const [totalPages, setTotalPages] = useState<number>(0);
  const [documentSplitterStep, setDocumentSplitterStep] =
    useState<DocumentSplitterStep>('documentDetails');
  const [isDocumentSplitSuccess, setIsDocumentSplitSuccess] =
    useState<boolean>(false);
  const [isPdfLoadError, setIsPdfLoadError] = useState<?Error>(null);

  useEffect(() => {
    // if inbound and not read or archived, mark as read
    if (!electronicFile.viewed && !electronicFile.archived) {
      updateViewed({
        viewed: true,
        inboundElectronicFileIds: [electronicFile.id],
      });
    }
  }, [electronicFile, updateViewed]);

  return (
    <Grid container spacing={2} mb={2}>
      <Grid
        xs={12}
        md={documentSplitterStep === 'documentDetails' ? true : 'auto'}
      >
        <Box pt={1}>
          {electronicFile.attachment?.url ? (
            <PdfViewer
              fileUrl={electronicFile.attachment?.url}
              forceShowPreview={documentSplitterStep === 'allocations'}
              mode={
                documentSplitterStep === 'documentDetails'
                  ? MODE_KEY.full
                  : MODE_KEY.thumbnail
              }
              height={900}
              onPdfLoadSuccessCallback={(numPages: number) => {
                setTotalPages(numPages);
                setIsPdfLoadError(null);
              }}
              onPdfFetchErrorCallback={(error: ?Error) => {
                setTotalPages(0);
                setIsPdfLoadError(error);
              }}
              onPdfLoadErrorCallback={(error: ?Error) => {
                setTotalPages(0);
                setIsPdfLoadError(error);
              }}
            />
          ) : (
            t('Failed to load PDF file.')
          )}
        </Box>
      </Grid>
      <Grid xs={12} md={documentSplitterStep === 'documentDetails' ? 4 : true}>
        {!electronicFile.archived &&
          electronicFile.attachment?.url &&
          !isPdfLoadError &&
          totalPages !== 0 && (
            <DocumentSplitter
              usage={DOCUMENT_SPLITTER_USAGE.electronicFiles}
              isOpen={!isDocumentSplitSuccess}
              totalPages={totalPages}
              onStepChangedCallback={(step: DocumentSplitterStep) => {
                setDocumentSplitterStep(step);
              }}
              processAllocationsCallback={(
                documentSplit: Array<AllocationAttribute>
              ) => {
                setIsDocumentSplitSuccess(false);
                return splitDocument({
                  id: electronicFile.id,
                  splitConfig: documentSplit,
                });
              }}
              onSaveSuccessCallback={() => {
                setIsDocumentSplitSuccess(true);
                setDocumentSplitterStep('documentDetails');
                clearAnyExistingElectronicFileToast(dispatch);
                dispatch(add(splitDocumentSuccessToast()));
              }}
              onSaveErrorCallback={(message) => {
                setIsDocumentSplitSuccess(false);
                clearAnyExistingElectronicFileToast(dispatch);
                dispatch(add(splitDocumentErrorToast(message)));
              }}
            />
          )}
      </Grid>
    </Grid>
  );
};

export const InboundContentTranslated: ComponentType<Props> =
  withNamespaces()(InboundContent);
export default InboundContent;
