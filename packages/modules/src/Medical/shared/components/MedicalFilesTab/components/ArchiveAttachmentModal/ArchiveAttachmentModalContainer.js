// @flow
import { useState, useEffect } from 'react';
import { getArchiveMedicalNoteReasons } from '@kitman/services';
import useIsMountedCheck from '@kitman/common/src/hooks/useIsMountedCheck';
import type { ToastDispatch, Toast } from '@kitman/components/src/types';
import type { ToastAction } from '@kitman/components/src/Toast/KitmanDesignSystem/hooks/useToasts';
import type { Attachment } from '@kitman/modules/src/Medical/shared/types';
import { ArchiveAttachmentModalTranslated as ArchiveAttachmentModal } from './ArchiveAttachmentModal';

type Props = {
  isOpen: boolean,
  onClose: Function,
  attachment: ?Attachment,
  onArchiveComplete: Function,
  toastAction: ToastDispatch<ToastAction>,
  toasts: Array<Toast>,
};

const ArchiveAttachmentModalContainer = (props: Props) => {
  const [archiveModalOptions, setArchiveModalOptions] = useState([]);
  const isMountedCheck = useIsMountedCheck();

  useEffect(() => {
    getArchiveMedicalNoteReasons().then((reasons) => {
      if (!isMountedCheck()) return;
      const modalOptions = reasons.map((option) => {
        return {
          label: option.name,
          value: option.id,
        };
      });
      setArchiveModalOptions(modalOptions);
    });
  }, []);
  if (props.attachment) {
    return (
      <ArchiveAttachmentModal
        {...props}
        attachment={props.attachment}
        archiveModalOptions={archiveModalOptions}
      />
    );
  }
  return <></>;
};

export default ArchiveAttachmentModalContainer;
