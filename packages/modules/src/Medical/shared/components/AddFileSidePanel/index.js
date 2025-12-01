// @flow

import { useState } from 'react';
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import {
  FileUploadArea,
  SlidingPanelResponsive,
  TextButton,
} from '@kitman/components';
import type { AttachedFile } from '@kitman/common/src/utils/fileHelper';
import { checkInvalidFileTitles } from '@kitman/common/src/utils/fileHelper';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import style from '../AddDiagnosticLinkSidePanel/styles';

type Props = {
  isOpen: boolean,
  panelTitle: string,
  onSave: (files: AttachedFile[]) => void,
  onClose: () => void,
};

const AddFileSidePanel = (props: I18nProps<Props>) => {
  const [localIssueFiles, setLocalIssueFiles] = useState<AttachedFile[]>([]);

  const onSave = (localFileIssues) => {
    if (checkInvalidFileTitles(localFileIssues)) return;
    props.onSave(localIssueFiles);
  };
  return (
    <div css={style.sidePanel}>
      <SlidingPanelResponsive
        isOpen={props.isOpen}
        title={props.panelTitle}
        onClose={props.onClose}
        width={659}
      >
        <div css={style.content}>
          {/* TODO: Implement current/existing file listing when backend API is hooked up. */}
          <FileUploadArea
            showActionButton={false}
            areaTitle={props.t('Attach file(s)')}
            testIdPrefix="AddFileSidePanel"
            isFileError={false}
            updateFiles={setLocalIssueFiles}
            attachedFiles={localIssueFiles}
          />
        </div>
        <div css={style.actions}>
          <TextButton
            onClick={onSave}
            testId="links-save-button"
            text={props.t('Save')}
            type="primary"
            kitmanDesignSystem
          />
        </div>
      </SlidingPanelResponsive>
    </div>
  );
};

export const AddFileSidePanelTranslated: ComponentType<Props> =
  withNamespaces()(AddFileSidePanel);
export default AddFileSidePanel;
