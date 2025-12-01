// @flow
import React, { Suspense, useRef, useState } from 'react';
import { withNamespaces } from 'react-i18next';

import {
  AppStatus,
  Modal,
  TextButton,
  DelayedLoadingFeedback,
} from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { isScannerIntegrationAllowed } from './utils';

const DynamsoftSDK = React.lazy(() => import('./dwt/DynamsoftSDK'));

export type ErrorObject = {
  code: number,
  message: string,
};

type Props = {
  isOpen: boolean,
  onSave: (file: File, pageCount: number) => void,
  onCancel: () => void,
  hideFilenameInput?: boolean,
};

const DocumentScanner = (props: I18nProps<Props>) => {
  const DWTControllerRef = useRef(null);
  const [bufferCount, setBufferCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState<?string>(null);

  const onClickAdd = () => {
    DWTControllerRef.current?.saveOrUploadImage();
  };

  const onError = (error: ErrorObject) => {
    // https://www.dynamsoft.com/web-twain/docs/info/api/appendix.html#error-list
    if (error.code === -2339 || error.code === -1119 || error.code === -1200) {
      setErrorMessage(
        props.t(
          'PDF files that contain text cannot be attached to the scanning flow. They must only contain images.'
        )
      );
    } else if (
      error.code === -1111 ||
      (error.code > -1200 && error.code <= -1035)
    ) {
      // Deal with as a general file loading error
      setErrorMessage(
        props.t('File cannot be attached: (ErrorCode: {{code}})', {
          code: error.code,
        })
      );
    } else {
      setErrorMessage(`${error.message}}: (ErrorCode: ${error.code})`);
    }
  };

  return (
    <div className="DocumentScanner">
      <Modal
        isOpen={props.isOpen}
        onPressEscape={props.onCancel}
        close={props.onCancel}
        width="x-large"
        overlapSidePanel
        additionalStyle={{
          maxHeight: '90vh !important',
        }}
      >
        <Modal.Header>
          <Modal.Title>{props.t('Scan')}</Modal.Title>
        </Modal.Header>
        <Modal.Content
          additionalStyle={{
            padding: 0,
          }}
        >
          {isScannerIntegrationAllowed() && (
            <Suspense fallback={<DelayedLoadingFeedback />}>
              <DynamsoftSDK
                {...props}
                onSave={(file: File) => {
                  props.onSave(file, bufferCount);
                }}
                onError={onError}
                DWTControllerRef={DWTControllerRef}
                onBufferChange={(count) => setBufferCount(count)}
              />
            </Suspense>
          )}
        </Modal.Content>
        <Modal.Footer>
          <TextButton
            text={props.t('Cancel')}
            onClick={props.onCancel}
            kitmanDesignSystem
          />
          <TextButton
            text={props.t('Add')}
            onClick={onClickAdd}
            type="primary"
            isDisabled={bufferCount === 0}
            kitmanDesignSystem
          />
        </Modal.Footer>
      </Modal>
      {errorMessage && (
        <AppStatus
          status="error"
          message={errorMessage}
          close={() => setErrorMessage(null)}
          hideButtonText={props.t('OK')}
        />
      )}
    </div>
  );
};

export const DocumentScannerTranslated = withNamespaces()(DocumentScanner);
export default DocumentScanner;
