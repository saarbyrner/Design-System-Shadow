// @flow

import { withNamespaces } from 'react-i18next';
import classNames from 'classnames';
import type { ComponentType } from 'react';
import { useState, useRef, useEffect } from 'react';
import { fullWidthMenuCustomStyles } from '@kitman/components/src/Select';
import { InputTextField, TextButton, Select } from '@kitman/components';
import { css } from '@emotion/react';

import { acceptedFileFormats } from '@kitman/components/src/FileUploadArea';

import fileSizeLabel from '@kitman/common/src/utils/fileSizeLabel';

import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFileRename from 'filepond-plugin-file-rename';
import getEventAttachmentCategories from '@kitman/services/src/services/planning/getEventAttachmentCategories';
import type { OnUpdateEventDetails } from '@kitman/modules/src/PlanningEventSidePanel/src/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { EventFormData } from '../../types';
import style from '../../style';
import { AddLinksTranslated as AddLinks } from './AddLinks';

type Props = {
  event: EventFormData | Object,
  onUpdateEventDetails: OnUpdateEventDetails,
  acceptedFileTypeCode: 'default',
};

registerPlugin(
  FilePondPluginFileValidateSize,
  FilePondPluginFileValidateType,
  FilePondPluginFileRename
);

const AddAttachments = (props: I18nProps<Props>) => {
  const FilePondInstance = useRef(null);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [allCategories, setAllCategories] = useState([]);

  useEffect(() => {
    getEventAttachmentCategories().then((eventCategories) => {
      setCategoryOptions(
        eventCategories.map((eventCategory) => ({
          value: eventCategory.id,
          label: eventCategory.name,
        }))
      );
    });
  }, []);

  // process each file being added
  const addUnuploadedFile = (file) => {
    const newFile = new File([file.file], file.file.name, {
      type: file.file.type,
    });
    const addedFile = [
      ...(props.event.unUploadedFiles?.length
        ? props.event.unUploadedFiles
        : []),
      // return a simpler object, versus the blob object coming directly from FilePond
      {
        file: newFile,
        filename: newFile.name,
        filenameWithoutExtension: file.filenameWithoutExtension,
        fileTitle: newFile.name,

        fileSize: file.source.size,
        fileType: newFile.type,
        id: file.id,
      },
    ];
    props.onUpdateEventDetails({
      unUploadedFiles: addedFile,
    });
  };

  // change the title of one file
  const updateFileTitle = (index, title) => {
    if (props.event.unUploadedFiles) {
      const currentFiles = [...props.event.unUploadedFiles];
      currentFiles[index] = { ...currentFiles[index], fileTitle: title };
      props.onUpdateEventDetails({
        unUploadedFiles: currentFiles,
      });
    }
  };

  // change categories on one file
  const updateAttachmentCategories = (index, selectedCategories) => {
    if (props.event.unUploadedFiles) {
      const currentFiles = [...props.event.unUploadedFiles];
      currentFiles[index].event_attachment_category_ids = selectedCategories;
      props.onUpdateEventDetails({
        unUploadedFiles: currentFiles,
      });
    }
  };

  // change all files to have the same categories
  const updateAllCategories = (selectedCategories) => {
    if (props.event.unUploadedFiles) {
      const currentFiles = [...props.event.unUploadedFiles].map(
        (unUploadedFile) => ({
          ...unUploadedFile,
          event_attachment_category_ids: selectedCategories,
        })
      );

      props.onUpdateEventDetails({
        unUploadedFiles: currentFiles,
      });
    }

    if (props.event.unUploadedLinks) {
      const currentLinks = [...props.event.unUploadedLinks].map(
        (unUploadedLink) => ({
          ...unUploadedLink,
          event_attachment_category_ids: selectedCategories,
        })
      );

      props.onUpdateEventDetails({ unUploadedLinks: currentLinks });
    }
  };

  // each unuploaded file consists of:
  // Upload input, to show the original file name (disabled)
  // Title input, to change the file title that should be displayed
  // A category select, to select multiple categories
  const renderUnUploadedFiles = () => (
    <div
      className={classNames('fileUploadField', {
        'fileUploadField--unuploaded_files_titles': true,
      })}
    >
      <div
        className={classNames('fileUploadField', {
          'fileUploadField--unuploaded_files_area': true,
        })}
      >
        {props.event.unUploadedFiles &&
          props.event.unUploadedFiles.map((eventAttachment, index) => (
            <div
              key={`${eventAttachment.filename}-${eventAttachment.id}`}
              css={style.unUploadedFileArea}
            >
              <div css={style.unUploadedFileFields}>
                <div css={style.fileAlignment}>
                  <InputTextField
                    value={`${eventAttachment.filename} - ${fileSizeLabel(
                      eventAttachment.file.size
                    )}`}
                    label={props.t('Upload')}
                    disabled
                    kitmanDesignSystem
                  />
                  <TextButton
                    onClick={() => {
                      const currentFiles = props.event.unUploadedFiles?.filter(
                        ({ id }) => id !== eventAttachment.id
                      );
                      props.onUpdateEventDetails({
                        unUploadedFiles: currentFiles,
                      });
                      // $FlowFixMe it does not know removeFiles is a function on FilePond
                      FilePondInstance.current.removeFile(eventAttachment);
                    }}
                    iconBefore="icon-bin"
                    type="subtle"
                    kitmanDesignSystem
                  />
                </div>

                <InputTextField
                  value={eventAttachment.fileTitle || ''}
                  onChange={(e) => updateFileTitle(index, e.target.value)}
                  label={props.t('Title')}
                  invalid={eventAttachment.fileTitle === ''}
                  kitmanDesignSystem
                />
                <Select
                  label={props.t('Categories')}
                  options={categoryOptions}
                  value={eventAttachment.event_attachment_category_ids}
                  onChange={(selectedOptions) => {
                    setAllCategories([]);
                    updateAttachmentCategories(index, selectedOptions);
                  }}
                  isMulti
                  invalid={
                    !eventAttachment.event_attachment_category_ids?.length
                  }
                  customSelectStyles={fullWidthMenuCustomStyles}
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  );

  // select component to change categories on all files at once
  const renderSetAllCategories = () => {
    return (
      <div
        css={css`
          margin-bottom: 5px;
        `}
      >
        <Select
          isMulti
          label={props.t('Set categories for all uploads')}
          options={categoryOptions}
          value={allCategories}
          onChange={(selectedOptions) => {
            setAllCategories(selectedOptions);
            updateAllCategories(selectedOptions);
          }}
          customSelectStyles={fullWidthMenuCustomStyles}
        />
      </div>
    );
  };

  return (
    <>
      <div
        className={classNames('fileUploadField', {
          'fileUploadField--kitmanDesignSystem': true,
          'fileUploadField--hideUploadedItems': true,
          'fileUploadField--smallerUploadArea': true,
        })}
      >
        <FilePond
          // $FlowFixMe Ref on a component instead of an ElementType
          ref={FilePondInstance}
          allowMultiple
          allowImagePreview={false}
          instantUpload={false}
          oninit={() =>
            props.onUpdateEventDetails({
              unUploadedFiles: [],
            })
          }
          onaddfile={(error, file) => {
            if (error) {
              // $FlowFixMe it does not know removeFiles is a function on FilePond
              FilePondInstance.current.removeFile(file);
            } else {
              addUnuploadedFile(file);
            }
          }}
          maxFiles={10}
          maxFileSize="500MB"
          dropValidation={false}
          labelMaxFileSizeExceeded={props.t('File is too large')}
          allowDrop
          labelIdle={`<span class="filepond--label-action">${props.t(
            'Drag & Drop your files or browse'
          )}</span>`}
          fileValidateTypeLabelExpectedTypes=""
          acceptedFileTypes={acceptedFileFormats[props.acceptedFileTypeCode]}
          removeFilesWithErrors
        />
        {props.event.unUploadedFiles?.length ||
        props.event.unUploadedLinks?.length
          ? renderSetAllCategories()
          : null}
        {renderUnUploadedFiles()}
      </div>
      <AddLinks
        event={props.event}
        onUpdateEventDetails={props.onUpdateEventDetails}
        categoryOptions={categoryOptions}
        setAllCategoryOptions={setAllCategories}
      />
    </>
  );
};

export const AddAttachmentsTranslated: ComponentType<Props> =
  withNamespaces()(AddAttachments);
export default AddAttachments;
