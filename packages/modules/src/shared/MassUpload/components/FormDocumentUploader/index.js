// @flow
import { withNamespaces } from 'react-i18next';
import { useState } from 'react';
import { FilePond } from 'react-filepond';
import classNames from 'classnames';
import type { Node } from 'react';
import { useDispatch } from 'react-redux';

import { add, remove } from '@kitman/modules/src/Toasts/toastsSlice';
import { constructIdleLabel } from '@kitman/modules/src/shared/MassUpload/utils';
import type { Attachment } from '@kitman/common/src/types/Annotation';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { type SetState } from '@kitman/common/src/types/react';
import styles from './styles';
import DocumentExampleModal from './components/DocumentExampleModal';

type Props = {
  title: string,
  description: string,
  content?: Node,
  exampleFile?: Attachment,
  files: Array<Attachment>,
  setFiles: Function,
  removeFile?: Function,
  contentBefore?: boolean,
  acceptedFileTypes?: ?Array<string>,
  customIdleLabel?: string,
  setHasFilePondErrored: SetState<boolean>,
  setHasFilePondProcessed: SetState<boolean>,
  customToast: { title: string, description: string },
};

const FormDocumentUploader = (props: I18nProps<Props>) => {
  const {
    t,
    title,
    description,
    content,
    exampleFile,
    files,
    setFiles,
    // $FlowIgnore
    removeFile,
    contentBefore,
    setHasFilePondErrored,
    setHasFilePondProcessed,
    customToast,
  } = props;
  const [openModal, setOpenModal] = useState<boolean>(false);
  const acceptedFileTypes = props.acceptedFileTypes || [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
  ];
  const dispatch = useDispatch();
  const ERROR_ID = 'ERROR';

  return (
    <div data-testid="RegistrationForm|FormDocumentUploader">
      {props.title && <div css={styles.title}>{title}</div>}

      {contentBefore && content}

      {props.description && <div css={styles.description}>{description}</div>}

      {!contentBefore && content}

      <>
        <div
          className={classNames('fileUploadField', {
            'fileUploadField--fileTitleFieldsTest': true,
            'fileUploadField--kitmanDesignSystem': true,
          })}
        >
          <FilePond
            files={files}
            onupdatefiles={setFiles}
            onremovefile={removeFile}
            maxFiles={1}
            name="files"
            labelIdle={constructIdleLabel(
              acceptedFileTypes,
              props.customIdleLabel
            )}
            allowImagePreview={false}
            iconRemove="<i class='icon-bin fileUploadField__removeIcon' />"
            acceptedFileTypes={acceptedFileTypes}
            onaddfile={(error, file) => {
              if (file && error) {
                setHasFilePondErrored(true);
                dispatch(
                  add({
                    id: ERROR_ID,
                    status: 'ERROR',
                    title: customToast
                      ? customToast.title
                      : props.t('Failed to upload {{fileName}}', {
                          fileName: file.filename,
                        }),
                    description: customToast
                      ? customToast.description
                      : t('Please upload a pdf, png, or jpeg.'),
                  })
                );
                setTimeout(() => {
                  dispatch(remove(ERROR_ID));
                }, 5000);
                removeFile(file);
              }
              setHasFilePondProcessed(true);
            }}
          />
        </div>
      </>
      {exampleFile && (
        <DocumentExampleModal
          {...props}
          openModal={openModal}
          setOpenModal={setOpenModal}
          exampleFile={exampleFile}
        />
      )}
    </div>
  );
};

export const FormDocumentUploaderTranslated =
  withNamespaces()(FormDocumentUploader);
export default FormDocumentUploader;
