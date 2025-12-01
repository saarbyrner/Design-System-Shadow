// @flow
import { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';
import { withNamespaces } from 'react-i18next';
import {
  IconButton,
  TextButton,
  TooltipMenu,
  RichTextEditor,
  FileUploadArea,
} from '@kitman/components';
import type { AttachedFile } from '@kitman/common/src/utils/fileHelper';
import { checkInvalidFileTitles } from '@kitman/common/src/utils/fileHelper';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { isAnnotationInvalid } from '../../../../shared/utils';
import type { IssueAttachments } from '../../../types';

type Props = {
  setAllowCreateIssue: Function,
  attachment: IssueAttachments,
  onRemove: Function,
  onUpdateContent: Function,
  onAddAttachment: Function,
  onSelectFiles: Function,
  uploadQueuedAttachments: boolean,
  areAnnotationsInvalid: boolean,
};

const style = {
  row: css`
    display: flex;
    justify-content: space-between;
    margin-top: 16px;

    .iconButton {
      color: ${colors.grey_200};
    }

    .kitmanReactSelect {
      width: 297px;
    }

    .richTextEditor--kitmanDesignSystem {
      width: 100%;
    }
  `,
  titleRow: css`
    align-items: center;
    margin-bottom: 4px;

    .iconButton {
      height: 24px;
      min-width: 24px;
      padding: 0;
    }
  `,
  title: css`
    color: ${colors.grey_200};
    font-size: 16px;
    font-weight: 600;
    line-height: 22px;
  `,
  bottomRow: css`
    border-bottom: 1px solid ${colors.neutral_300};
    padding-bottom: 24px;
  `,
  addAttachmentRow: css`
    display: block;
  `,
  attachmentsHeader: css`
    align-items: center;
    display: flex;
    justify-content: space-between;
    margin-bottom: 2px;

    h3 {
      margin-bottom: 0;
    }

    .textButton__icon::before {
      font-size: 20px;
    }
  `,
};

const NoteAttachment = (props: I18nProps<Props>) => {
  const [shownFileAttachmentSections, setShownFileAttachmentSections] =
    useState<Array<'FILE'>>([]);
  const [showAddAttachmentButton, setShowAddAttachmentButton] = useState(true);
  const [queuedAttachments, setQueuedAttachments] = useState<
    Array<AttachedFile>
  >([]);

  // queuedAttachments to Store before triggering createIssue in <PanelActions/>
  const onUploadQueuedAttachments = (files) => {
    props.onAddAttachment(files);
    props.setAllowCreateIssue(true);
  };

  const onSelectFiles = (files) => {
    setQueuedAttachments(files);
    props.onSelectFiles(files);
  };

  useEffect(() => {
    if (
      !props.uploadQueuedAttachments ||
      checkInvalidFileTitles(queuedAttachments)
    )
      return;
    onUploadQueuedAttachments(queuedAttachments);
  }, [props.uploadQueuedAttachments]);

  return (
    <div className="noteAttachment">
      <div css={[style.row, style.titleRow]}>
        <h3 className="kitmanHeading--L3">{props.t('Note')}</h3>
        <IconButton
          icon="icon-bin"
          isTransparent
          onClick={() => props.onRemove()}
        />
      </div>
      <div css={style.row}>
        <RichTextEditor
          label={null}
          onChange={(content) => props.onUpdateContent(content)}
          value={props.attachment.attachmentContent.content}
          isInvalid={
            props.areAnnotationsInvalid && isAnnotationInvalid(props.attachment)
          }
          kitmanDesignSystem
        />
      </div>
      {shownFileAttachmentSections.includes('FILE') && (
        <>
          <div
            css={css`
              padding: 10px 0px 10px 0px;
              position: relative;
            `}
          >
            <FileUploadArea
              areaTitle={props.t('Add attachment(s)')}
              showActionButton
              testIdPrefix="NoteAttachments"
              isFileError={false}
              actionIcon="icon-bin"
              labelIdleText={props.t('Drop here or browse')}
              onClickActionButton={() => {
                setShownFileAttachmentSections(
                  (prevShownFileAttachmentSection) =>
                    prevShownFileAttachmentSection.filter(
                      (section) => section !== 'FILE'
                    )
                );
                setShowAddAttachmentButton(true);
              }}
              attachedFiles={queuedAttachments}
              updateFiles={onSelectFiles}
            />
          </div>
        </>
      )}
      {showAddAttachmentButton && (
        <div css={style.row}>
          <TooltipMenu
            tooltipTriggerElement={
              <TextButton
                text={props.t('Add attachment')}
                type="secondary"
                iconAfter="icon-chevron-down"
                kitmanDesignSystem
              />
            }
            menuItems={[
              {
                description: props.t('File'),
                onClick: () => {
                  setShownFileAttachmentSections(
                    (prevShownFileAttachmentSection) => [
                      ...prevShownFileAttachmentSection,
                      'FILE',
                    ]
                  );
                  setShowAddAttachmentButton(false);
                },
              },
            ]}
            placement="bottom-start"
            appendToParent
            kitmanDesignSystem
          />
        </div>
      )}
    </div>
  );
};

export const NoteAttachmentTranslated = withNamespaces()(NoteAttachment);
export default NoteAttachment;
