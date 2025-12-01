// @flow
import { useRef, useEffect, useState } from 'react';
import uuid from 'uuid';
import { withNamespaces } from 'react-i18next';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileRename from 'filepond-plugin-file-rename';
import classNames from 'classnames';
import { convertBlobToFile } from '@kitman/common/src/utils/fileHelper';
import { IconButton, InputTextField, TextButton } from '@kitman/components';
import fileSizeLabel from '@kitman/common/src/utils/fileSizeLabel';
import { DocumentScannerTranslated as DocumentScanner } from '@kitman/components/src/DocumentScanner';
import type { Attachment } from '@kitman/common/src/types/Annotation';
import type { AttachedFile } from '@kitman/common/src/utils/fileHelper';
import { type I18nProps } from '@kitman/common/src/types/i18n';

import style from './style';

const cancelledRenameFakeFileName = uuid.v4();

export type Props = {
  updateFiles: Function,
  attachedFiles?: Array<AttachedFile>,
  removeUploadedFile?: Function,
  files?: Array<Attachment>, // These are attachments as per Notes system not FilePond instance files
  unsubmittedFilenames?: Array<string>, // Clearing this array will remove the files from the file staging area
  allowDropOnPage?: boolean,
  separateBrowseButton?: boolean,
  separateBrowseButtonDisabled?: boolean,
  uploadTextButton?: boolean,
  uploadTextButtonDisabled?: boolean,
  uploadTextButtonLabel?: string,
  acceptedFileTypes?: Array<string>,
  maxFileSize?: string,
  dropValidation?: boolean,
  removeFilesWithErrors?: boolean,
  label?: string,
  onAddFileError?: Function,
  removeFiles?: boolean,
  allowMultiple?: boolean,
  maxFiles?: number,
  labelIdleText?: string,
  allowImagePreview?: boolean,
  allowUploadedImagePreview?: boolean,
  allowOpenUploadedFile?: boolean,
  allowDrop?: boolean,
  documentScanner?: boolean,
  disabled?: boolean,
  kitmanDesignSystem?: boolean,
  isDeletableFileNameShownUnderPreview?: boolean,
};

registerPlugin(
  FilePondPluginFileValidateSize,
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview,
  FilePondPluginFileRename
);

const FileUploadField = (props: I18nProps<Props>) => {
  const [showDocumentScanner, setShowDocumentScanner] = useState(false);
  const [localRenamedFiles, setLocalRenamedFiles] = useState([]);
  const FilePondInstance = useRef(null);
  const previewedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  const renameFilesFeatureFlag = window.featureFlags['naming-uploaded-files'];
  const titleFilesFeatureFlag = window.featureFlags['files-titles'];
  const shouldTitleUnuploadedFiles =
    titleFilesFeatureFlag &&
    props.attachedFiles &&
    props.attachedFiles.length > 0;

  useEffect(() => {
    if (
      props.removeFiles &&
      FilePondInstance !== null &&
      FilePondInstance.current !== null
    ) {
      try {
        // $FlowFixMe it does not know removeFiles is function on FilePondInstance
        FilePondInstance.current.removeFiles();
      } catch (err) {
        // No need to handle error.
      }
    }
  }, [props.removeFiles]);

  useEffect(() => {
    if (props.unsubmittedFilenames && props.unsubmittedFilenames.length === 0) {
      if (FilePondInstance !== null && FilePondInstance.current !== null) {
        // When Running tests a silent error is thown here when calling instance functions
        // Wrapping in try catch to silence and allow tests to pass
        try {
          // $FlowFixMe it does not know removeFiles is function on FilePondInstance
          FilePondInstance.current.removeFiles();
        } catch (err) {
          // No need to handle error.
        }
      }
    }
  }, [FilePondInstance, props.unsubmittedFilenames]);

  useEffect(() => {
    // use effect that handles when the renamed files are added/deleted so that the edited title field
    // persists value if another file is deleted.
    if (props.updateFiles)
      props.updateFiles(
        convertBlobToFile(localRenamedFiles, props.attachedFiles)
      );
  }, [localRenamedFiles]);

  const updateFileTitle = (
    index: number,
    title: string,
    files: AttachedFile[] = []
  ) => {
    const currentFiles = [...files];
    const fileToUpdate = currentFiles[index];
    currentFiles[index] = Object.create(
      { ...fileToUpdate, fileTitle: title },
      // Object.create with Object.getOwnPropertyDescriptors are used because
      // AttachedFile may has getters which cannot be destructured.
      Object.getOwnPropertyDescriptors(fileToUpdate)
    );
    props.updateFiles(currentFiles);
  };

  const renderFiles = (removeFiles: Function) => {
    if (props.files && props.allowUploadedImagePreview) {
      return props.files.map((file) => {
        const isFilePreviewed = previewedFileTypes.some(
          // $FlowFixMe file properties must exist at this point
          (fileType) => fileType === file.filetype
        );
        return isFilePreviewed ? (
          <>
            <div
              className="fileUploadField__uploadedFile--preview"
              key={file.id}
            >
              <div className="fileUploadField__imagePreview">
                {/* $FlowFixMe file properties must exist at this point */}
                <img alt={file.filename} src={file.url} />
                {!props.isDeletableFileNameShownUnderPreview && (
                  <i
                    className="icon-close fileUploadField__removeIcon"
                    onClick={() => removeFiles(file.id)}
                  />
                )}
              </div>
            </div>
            <button
              type="button"
              css={style.deletableFileNameUnderPreview}
              style={{
                display: props.isDeletableFileNameShownUnderPreview
                  ? 'flex'
                  : 'none',
              }}
              onClick={() => removeFiles(file.id)}
            >
              <i className="icon-bin" />
              <div className="fileUploadField__uploadedFileName">
                {/* $FlowFixMe file properties must exist at this point */}
                {props.allowOpenUploadedFile && file.url ? (
                  <a
                    className="fileUploadField__uploadedFileLink"
                    href={file.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {file.original_filename || file.filename}{' '}
                    <i className="icon-arrow-right" />
                  </a>
                ) : (
                  file.original_filename || file.filename
                )}
              </div>
            </button>
          </>
        ) : (
          <div className="fileUploadField__uploadedFile" key={file.id}>
            <i
              className="icon-bin fileUploadField__removeIcon"
              onClick={() => removeFiles(file.id)}
            />
            <div className="fileUploadField__uploadedFileData">
              <p className="fileUploadField__uploadedFileName">
                {/* $FlowFixMe file properties must exist at this point */}
                {props.allowOpenUploadedFile && file.url ? (
                  <a
                    className="fileUploadField__uploadedFileLink"
                    href={file.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {file.original_filename || file.filename}{' '}
                    <i className="icon-arrow-right" />
                  </a>
                ) : (
                  file.original_filename || file.filename
                )}
              </p>
              <p className="fileUploadField__uploadedFileSize">
                {fileSizeLabel(file.filesize, true)}
              </p>
            </div>
          </div>
        );
      });
    }
    return (
      props.files &&
      props.files.map((file) => (
        <div className="fileUploadField__uploadedFile" key={file.id}>
          <i
            className="icon-bin fileUploadField__removeIcon"
            onClick={() => removeFiles(file.id)}
          />
          <div className="fileUploadField__uploadedFileData">
            <p className="fileUploadField__uploadedFileName">
              {/* $FlowFixMe file properties must exist at this point */}
              {props.allowOpenUploadedFile && file.url ? (
                <a
                  className="fileUploadField__uploadedFileLink"
                  href={file.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {file.original_filename || file.filename}{' '}
                  <i className="icon-arrow-right" />
                </a>
              ) : (
                file.original_filename || file.filename
              )}
            </p>
            <p className="fileUploadField__uploadedFileSize">
              {fileSizeLabel(file.filesize, true)}
            </p>
          </div>
        </div>
      ))
    );
  };

  const renderFileTitleFields = () => (
    <div className="unuploaded_files_titles">
      <span className="unuploaded_files_titles_header">Title</span>
      <div className="unuploaded_files_titles_area">
        {props.attachedFiles?.map((file, index) => (
          <div key={`${file.filename}-${file.file.lastModified}-${file.id}`}>
            <InputTextField
              value={file.fileTitle ? file.fileTitle : ''}
              onChange={(e) =>
                updateFileTitle(index, e.target.value, props.attachedFiles)
              }
              invalid={file.fileTitle === ''}
              kitmanDesignSystem
            />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {props.label && (
        <div className="fileUploadField__label">
          <label htmlFor="fileUploadField">{props.label}</label>
        </div>
      )}
      {props.documentScanner && (
        <div
          css={{
            position: 'absolute',
            top: '-3px',
            right: 0,
          }}
        >
          <TextButton
            type="link"
            text={props.t('Scan document')}
            onClick={() => setShowDocumentScanner(true)}
            kitmanDesignSystem
          />
        </div>
      )}
      <div
        className={classNames('fileUploadField', {
          'fileUploadField--fileTitleFields':
            titleFilesFeatureFlag && props.attachedFiles,
          'fileUploadField--noDropLabel':
            props.separateBrowseButton === true ||
            props.uploadTextButton === true,
          'fileUploadField--kitmanDesignSystem': props.kitmanDesignSystem,
          'fileUploadField--hideUploadedItem': props.uploadTextButton === true,
        })}
      >
        {props.separateBrowseButton && (
          <div className="fileUploadField__browse">
            <IconButton
              icon="icon-attach-file"
              testId="browse-files-button"
              onClick={() => {
                // $FlowFixMe it does not know browse is function on FilePondInstance
                FilePondInstance.current.browse();
              }}
              isDisabled={
                props.separateBrowseButtonDisabled
                  ? props.separateBrowseButtonDisabled
                  : false
              }
            />
          </div>
        )}
        {props.uploadTextButton && (
          <div className="fileUploadField__browse">
            <TextButton
              // $FlowFixMe it does not know browse is function on FilePondInstance
              onClick={() => FilePondInstance.current.browse()}
              type="secondary"
              text={props.uploadTextButtonLabel || 'Upload'}
              kitmanDesignSystem
              isDisabled={
                props.uploadTextButtonDisabled
                  ? props.uploadTextButtonDisabled
                  : false
              }
            />
          </div>
        )}
        {!props.allowUploadedImagePreview ||
        (props.allowUploadedImagePreview && props.maxFiles !== 1) ||
        (props.allowUploadedImagePreview &&
          props.maxFiles === 1 &&
          props.files &&
          props.files.length === 0) ? (
          <FilePond
            // $FlowFixMe Ref on a component instead of an ElementType
            ref={FilePondInstance}
            allowMultiple={props.allowMultiple || true}
            allowImagePreview={props.allowImagePreview || false}
            disabled={props.disabled}
            maxFiles={props.maxFiles || null}
            instantUpload={false}
            oninit={() => props.updateFiles([])}
            onaddfile={(error, file) => {
              if (error) {
                if (props.onAddFileError) {
                  props.onAddFileError(error, file);
                }
                if (props.removeFilesWithErrors && file) {
                  // $FlowFixMe it does not know removeFiles is a function on FilePond
                  FilePondInstance.current.removeFile(file);
                }
              }
            }}
            onupdatefiles={(files) => {
              if (files.length === 0) {
                return;
              }
              if (renameFilesFeatureFlag) {
                const cancelledFiles = files.filter(
                  (file) => file.filename === cancelledRenameFakeFileName
                );
                cancelledFiles.forEach((file) => file.abortLoad());
                const uncancelledFiles = files.filter(
                  (file) => file.filename !== cancelledRenameFakeFileName
                );
                setLocalRenamedFiles(uncancelledFiles);
              } else {
                props.updateFiles(files);
              }
            }}
            iconRemove="<i class='icon-bin fileUploadField__removeIcon' />"
            maxFileSize={
              props.maxFileSize === undefined ? '500MB' : props.maxFileSize
            }
            dropValidation={
              props.dropValidation === undefined ? false : props.dropValidation
            }
            labelMaxFileSizeExceeded={props.t('File is too large')}
            acceptedFileTypes={
              props.acceptedFileTypes || [
                'application/pdf',
                'image/jpeg',
                'image/jpg',
                'image/png',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/vnd.ms-excel',
                'application/vnd.ms-powerpoint',
                'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                'text/plain',
                'application/rtf',
                'text/csv',
                'video/mp4',
                'application/mp4',
                'audio/mpeg',
                'application/dicom',
              ]
            }
            allowDrop={props.allowDrop === undefined ? true : props.allowDrop}
            dropOnElement={
              props.allowDropOnPage === undefined
                ? true
                : !props.allowDropOnPage
            }
            dropOnPage={
              props.allowDropOnPage === undefined
                ? false
                : props.allowDropOnPage
            }
            labelFileTypeNotAllowed={props.t('File type is not supported')}
            fileValidateTypeLabelExpectedTypes=""
            labelIdle={`<span class="filepond--label-action">${
              props.labelIdleText || props.t('Drag & Drop your files or browse')
            }</span>`}
            allowFileRename={renameFilesFeatureFlag}
            fileRenameFunction={(file) =>
              new Promise((resolve) => {
                let newFilename = window.prompt(
                  props.t('Enter new filename'),
                  file.name
                );
                if (newFilename && !newFilename.includes(file.extension))
                  newFilename += file.extension;
                if (newFilename === null) {
                  // $FlowFixMe it does not know removeFiles is a function on FilePond
                  FilePondInstance.current.removeFile(file);
                  resolve(cancelledRenameFakeFileName);
                }
                resolve(newFilename);
              })
            }
            styleButtonRemoveItemPosition={
              titleFilesFeatureFlag && props.attachedFiles ? 'right' : 'left'
            }
          />
        ) : null}
        {shouldTitleUnuploadedFiles && renderFileTitleFields()}
        {props.files && props.files.length > 0 && props.removeUploadedFile && (
          <div
            className={`fileUploadField__uploadedFileList${
              shouldTitleUnuploadedFiles ? ' unuploadedGap' : ''
            }`}
          >
            {renderFiles(props.removeUploadedFile)}
          </div>
        )}
      </div>
      <DocumentScanner
        isOpen={showDocumentScanner}
        onCancel={() => setShowDocumentScanner(false)}
        onSave={(file) => {
          FilePondInstance.current?.addFile(file);
          setShowDocumentScanner(false);
        }}
      />
    </>
  );
};

export const FileUploadFieldTranslated = withNamespaces()(FileUploadField);
export default FileUploadField;
