// @flow
import { useState, useEffect } from 'react';

import { getArchiveMedicalNoteReasons } from '@kitman/services';
import useIsMountedCheck from '@kitman/common/src/hooks/useIsMountedCheck';
import type { ToastDispatch } from '@kitman/components/src/types';
import type { ToastAction } from '@kitman/components/src/Toast/KitmanDesignSystem/hooks/useToasts';
import type { Issue } from '@kitman/modules/src/Medical/shared/types';

import { ArchiveIssueModalTranslated as ArchiveIssueModal } from '..';

type Props = {
  isOpen: boolean,
  setShowArchiveModal: Function,
  selectedRow: Issue,
  setSelectedRow: Function,
  athleteId: number,
  getIssues: Function,
  toastAction: ToastDispatch<ToastAction>,
};

const ArchiveIssueModalContainer = (props: Props) => {
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
    <ArchiveIssueModal {...props} archiveModalOptions={archiveModalOptions} />
  );
};

export default ArchiveIssueModalContainer;
