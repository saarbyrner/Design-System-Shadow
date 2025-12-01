// @flow
import { useDispatch, useSelector } from 'react-redux';
import type { Node, ComponentType } from 'react';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { withNamespaces } from 'react-i18next';
import type {
  HumanInputFormElement,
  ValueTypes,
} from '@kitman/modules/src/HumanInput/types/forms';
import type { AttachedFile } from '@kitman/common/src/utils/fileHelper';
import type {
  QueuedItemType,
  FormAttachment,
} from '@kitman/modules/src/HumanInput/shared/redux/slices/formAttachmentSlice';
import uploadAttachment from '@kitman/services/src/services/uploadAttachment';
import {
  onUpdate,
  onDelete,
  onDeleteAttachmentFromRepeatableGroup,
} from '@kitman/modules/src/HumanInput/shared/redux/slices/formAttachmentSlice';
import {
  getAttachmentStatusObject,
  attachmentStatusesEnumLike,
} from '@kitman/modules/src/HumanInput/shared/utils/attachments';
import type {
  FilePondError,
  FilePondWarning,
} from '@kitman/modules/src/StaffProfile/shared/components/DocumentsTab/Components/DocumentSidePanel/components/FileUploader/types';
import { convertUrlToFile } from '@kitman/common/src/utils/fileHelper';
import { getQueueFactory } from '@kitman/modules/src/HumanInput/shared/redux/selectors/formAttachmentSelectors';
import { getOrganisationFactory } from '@kitman/modules/src/HumanInput/shared/redux/selectors/formStateSelectors';

type RenderArgs = {
  queuedAttachment: ?QueuedItemType,
  acceptedFilesTypes: Array<string>,
  onDeleteAttachment: () => void,
  onErrorAttachment: (error: FilePondError, attachedFile: AttachedFile) => void,
  onWarningAttachment: (warning: FilePondWarning, files: Array<File>) => void,
  onAddAttachment: (attachedFile: AttachedFile) => Promise<void>,
};

type Props = {
  element: HumanInputFormElement,
  children: (renderArgs: RenderArgs) => Node,
  onChange: (inputValue: ValueTypes) => void,
  repeatableGroupInfo: ?{ repeatable: boolean, groupNumber: number },
};

export const acceptedFileTypes = (element: HumanInputFormElement) =>
  element.config?.custom_params?.accepted_types || [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
  ];

const ManageAttachment = ({
  element,
  children,
  onChange,
  repeatableGroupInfo,
  t,
}: I18nProps<Props>): Node => {
  const dispatch = useDispatch();
  const acceptedFilesTypes = acceptedFileTypes(element);
  const queuedAttachment: QueuedItemType = useSelector(
    getQueueFactory(element.id)
  );
  const organisationId: number = useSelector(getOrganisationFactory());
  let queuedRepeatableGroupAttachment;

  if (repeatableGroupInfo?.repeatable && Array.isArray(queuedAttachment)) {
    queuedRepeatableGroupAttachment = [...queuedAttachment];

    queuedRepeatableGroupAttachment =
      queuedAttachment[repeatableGroupInfo?.groupNumber];
  }

  const onDeleteAttachment = () => {
    if (repeatableGroupInfo?.repeatable) {
      dispatch(
        onDeleteAttachmentFromRepeatableGroup({
          elementId: element.id,
          groupNumber: repeatableGroupInfo.groupNumber,
        })
      );
    } else {
      dispatch(
        onDelete({
          id: element.id,
        })
      );
    }
    onChange(null);
  };

  /**
   * Creates an attachment object from the given attached file.
   *
   * @param {AttachedFile} attachedFile - The file to be attached.
   */
  const createAttachment = (attachedFile: AttachedFile) => {
    const file = attachedFile.file;
    return {
      blobUrl: URL.createObjectURL(file),
      filename: file.name,
      fileType: file.type,
      fileSize: file.size,
      fileTitle: element.config.title || file.name,
      id: element.id,
    };
  };

  /**
   * Instantly uploads an attached file.
   *
   * @param {AttachedFile} attachedFile - The file to be uploaded.
   */
  const onAddAttachment = async (attachedFile: AttachedFile) => {
    if (attachedFile) {
      const attachment: $Shape<FormAttachment> = createAttachment(attachedFile);

      if (!acceptedFilesTypes.includes(attachment.fileType)) {
        dispatch(
          onUpdate({
            [element.id]: getAttachmentStatusObject(
              repeatableGroupInfo,
              queuedAttachment,
              attachmentStatusesEnumLike.UNSUPPORTED_FORMAT,
              attachment
            ),
          })
        );
      } else {
        dispatch(
          onUpdate({
            [element.id]: getAttachmentStatusObject(
              repeatableGroupInfo,
              queuedAttachment,
              attachmentStatusesEnumLike.IDLE,
              attachment
            ),
          })
        );

        onChange(' ');

        dispatch(
          onUpdate({
            [element.id]: getAttachmentStatusObject(
              repeatableGroupInfo,
              queuedAttachment,
              attachmentStatusesEnumLike.PENDING,
              attachment
            ),
          })
        );

        const { blobUrl, filename, fileType } = attachment;

        try {
          // Make POST call to Kitman API and upload it to S3 AWS
          const blobFile = await convertUrlToFile(blobUrl, filename, fileType);
          const { attachment_id: attachmentId } = await uploadAttachment(
            blobFile,
            filename,
            organisationId
          );

          dispatch(
            onUpdate({
              [element.id]: getAttachmentStatusObject(
                repeatableGroupInfo,
                queuedAttachment,
                attachmentStatusesEnumLike.SUCCESS,
                attachment
              ),
            })
          );

          // Once uploaded, an id is returned. This id is the created resource
          // The id is saved, along with other form data in redux (formStateSlice), as the value for attachment
          onChange(attachmentId);
        } catch {
          dispatch(
            onUpdate({
              [element.id]: getAttachmentStatusObject(
                repeatableGroupInfo,
                queuedAttachment,
                attachmentStatusesEnumLike.FAILURE,
                attachment
              ),
            })
          );
        }
      }
    }
  };

  const onErrorAttachment = (
    { main }: FilePondError,
    attachedFile: AttachedFile
  ) => {
    const attachment: $Shape<FormAttachment> = createAttachment(attachedFile);

    dispatch(
      onUpdate({
        [element.id]: getAttachmentStatusObject(
          repeatableGroupInfo,
          queuedAttachment,
          attachmentStatusesEnumLike.FAILURE,
          attachment,
          `${t('Error: {{main}}', {
            main,
          })} • ${t('Failed')}`
        ),
      })
    );
  };

  const onWarningAttachment = (
    warning: FilePondWarning,
    files: Array<File>
  ) => {
    if (warning.type === 'warning' && warning.body === 'Max files') {
      const message = t(
        `The maximum number of files is one. You selected {{selectedFilesCount}} files.`,
        {
          selectedFilesCount: files.length,
        }
      );

      dispatch(
        onUpdate({
          [element.id]: getAttachmentStatusObject(
            repeatableGroupInfo,
            queuedAttachment,
            attachmentStatusesEnumLike.FAILURE,
            null,
            message
          ),
        })
      );
    }
  };

  const renderArgs: RenderArgs = {
    queuedAttachment: repeatableGroupInfo?.repeatable
      ? queuedRepeatableGroupAttachment
      : queuedAttachment,
    onDeleteAttachment,
    onAddAttachment,
    onErrorAttachment,
    onWarningAttachment,
    acceptedFilesTypes,
  };

  return children(renderArgs);
};

export const ManageAttachmentTranslated: ComponentType<Props> =
  withNamespaces()(ManageAttachment);
export default ManageAttachment;
