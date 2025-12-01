// @flow
import { useState } from 'react';
import type {
  ExportAttachment,
  MedicalFile,
} from '../types/medical/MedicalFile';

const useAttachmentSelection = () => {
  const [allAttachmentsChecked, setAllAttachmentsChecked] = useState(false);
  const [exportAttachments, setExportAttachments] = useState<
    Array<ExportAttachment>
  >([]);

  const updateAllAttachments = (
    checked: boolean,
    documents: Array<MedicalFile>
  ) => {
    if (checked) {
      const updateAttachmentIds = documents?.map((item) => {
        return {
          id: item.attachment?.id,
          filetype: item.attachment?.filetype || '',
          filename: item.attachment?.filename || '',
        };
      });
      setExportAttachments(updateAttachmentIds);
    } else {
      setExportAttachments([]);
    }
    setAllAttachmentsChecked(checked);
  };

  const updateSingleAttachment = (
    attachmentId: number,
    checked: boolean,
    filetype: string,
    filename: string,
    documents: Array<MedicalFile>
  ) => {
    let updateAttachmentIds;
    if (checked) {
      updateAttachmentIds = [
        ...exportAttachments,
        { id: attachmentId, filetype, filename },
      ];
      if (updateAttachmentIds.length === documents.length)
        setAllAttachmentsChecked(true);
    } else {
      updateAttachmentIds = exportAttachments.filter(
        (item) => item.id !== attachmentId
      );
      setAllAttachmentsChecked(false);
    }
    setExportAttachments(updateAttachmentIds);
  };

  return {
    allAttachmentsChecked,
    exportAttachments,
    updateSingleAttachment,
    updateAllAttachments,
  };
};

export default useAttachmentSelection;
