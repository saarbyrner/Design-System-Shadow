// @flow
import { useState, useEffect } from 'react';

import { getArchiveMedicalNoteReasons } from '@kitman/services';

import useIsMountedCheck from '@kitman/common/src/hooks/useIsMountedCheck';

import type { ToastDispatch, Toast } from '@kitman/components/src/types';
import type { ToastAction } from '@kitman/components/src/Toast/KitmanDesignSystem/hooks/useToasts';
import type { MedicalFile } from '@kitman/modules/src/Medical/shared/types/medical';
import { ArchiveFileModalTranslated as ArchiveFileModal } from '..';

type Props = {
  isOpen: boolean,
  setShowArchiveModal: Function,
  selectedRow: MedicalFile,
  setSelectedRow: Function,
  getDocuments: Function,
  toastAction: ToastDispatch<ToastAction>,
  toasts: Array<Toast>,
};

const ArchiveFileModalContainer = (props: Props) => {
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

  return (
    <ArchiveFileModal {...props} archiveModalOptions={archiveModalOptions} />
  );
};

export default ArchiveFileModalContainer;
