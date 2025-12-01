// @flow
import { useRef, useState, useEffect } from 'react';

import * as React from 'react';
import { withNamespaces } from 'react-i18next';
import Editor, { createEditorStateWithText } from '@draft-js-plugins/editor';
// $FlowFixMe Draft JS issue with flow https://github.com/facebook/draft-js/issues/1974
import { EditorState, Modifier } from 'draft-js';
import createLinkifyPlugin from '@draft-js-plugins/linkify';
// $FlowFixMe Draft JS issue with flow https://github.com/facebook/draft-js/issues/1974
import type { EditorState as EditorStateType } from 'draft-js';
import type { ToastItem } from '@kitman/components/src/types';
import type { File as FilePondFile } from 'filepond';
import { FileStatus } from 'filepond';
import classNames from 'classnames';
import {
  FileUploadField,
  IconButton,
  Toast as ToastComponent,
} from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { ChatChannel } from '../types';

const linkifyPlugin = createLinkifyPlugin({
  target: '_blank',
});

const plugins = [linkifyPlugin];

type Props = {
  initialMessage?: string,
  canSendMessages: boolean,
  connectionIssue: boolean,
  currentChannel: ChatChannel,
  acceptedFileTypes: Array<string>,
  inProgressMedia: Array<string>,
  allowDropAttachments: boolean,
  // Callbacks
  onMessageSend: Function,
  onSendMedia: Function,
};

// unsubmittedFilenames={attachments.map(file => file.name)}

const ChatTextArea = (props: I18nProps<Props>) => {
  const [attachments, setAttachments] = useState([]); // Is array of ActualFileObject but filePond does not export type
  const [unsubmittedFilenames, setUnsubmittedFilenames] = useState<
    Array<string>
  >([]);
  const [toasts, setToasts] = useState([]);
  const [plainText, setPlainText] = React.useState(
    props.initialMessage ? props.initialMessage : ''
  );
  const [editorState, setEditorState] = React.useState(
    createEditorStateWithText(plainText)
  );

  // Use Effects
  useEffect(() => {
    setUnsubmittedFilenames(attachments.map((file) => file.name));
  }, [attachments]);

  // Use Refs
  const editorEl = useRef(null);
  const attachmentsRef = useRef(attachments);

  const updateAttachmentState = (updatedAttachments) => {
    // A ref is being use to avoid stale state
    attachmentsRef.current = updatedAttachments;
    setAttachments(updatedAttachments);
  };

  const onChangeEditor = (state: EditorStateType) => {
    const contentState = state.getCurrentContent();
    const text = contentState.getPlainText();
    if (text !== plainText) {
      setPlainText(text);
    }
    setEditorState(state);
  };

  const getMediaToasts = (filenames: Array<string>): Array<ToastItem> => {
    let toastId = toasts.length - 1;
    return filenames.map((filename: string) => {
      toastId += 1;
      return {
        text: filename,
        status: 'PROGRESS',
        id: toastId,
      };
    });
  };

  const addFileErrorToast = (error, file) => {
    const toast: ToastItem = {
      text: file ? `${file.filename}: ${error.main}` : error.main,
      subText: error.sub,
      status: 'ERROR',
      id: toasts.length,
    };

    setToasts([...toasts, toast]);
  };

  const onCloseToast = (id: number) => {
    const toastFiltered = toasts.filter((toast) => toast.id !== id);
    setToasts(toastFiltered);
  };

  const clearEditorContent = (state: EditorStateType) => {
    const blocks = state.getCurrentContent().getBlockMap().toList();
    const updatedSelection = state.getSelection().merge({
      anchorKey: blocks.first().get('key'),
      anchorOffset: 0,
      focusKey: blocks.last().get('key'),
      focusOffset: blocks.last().getLength(),
    });
    const newContentState = Modifier.removeRange(
      state.getCurrentContent(),
      updatedSelection,
      'forward'
    );
    return EditorState.push(state, newContentState, 'remove-range');
  };

  const isValidMessage = (messageText: string): boolean => {
    return messageText !== null && messageText.trim().length > 0;
  };

  const handleSendMessage = () => {
    if (props.canSendMessages) {
      if (isValidMessage(plainText)) {
        props.onMessageSend(plainText, 'ME');
      }
      setEditorState(clearEditorContent(editorState));
      if (attachmentsRef.current.length > 0) {
        props.onSendMedia(attachmentsRef.current);
      }
      updateAttachmentState([]); // We clear the attachments and the user can reattach if message sending fails
    }
  };

  const handleReturnKey = (e) => {
    if (e.nativeEvent.shiftKey) {
      return 'not-handled';
    }
    handleSendMessage();
    return 'handled';
  };

  const handleAttachmentsUpdated = (fileItems: Array<FilePondFile>) => {
    if (!fileItems || fileItems.length === 0) {
      updateAttachmentState([]); // clear attachments;
      return;
    }

    // For safety we want to filter away files with load errors not caught by our size / type requirements
    const nonErrorFileItems = fileItems.filter(
      (fileItem) => fileItem.status !== FileStatus.LOAD_ERROR // so don't include
    );
    if (nonErrorFileItems.length > 0) {
      const justFiles = nonErrorFileItems.map((fileItem) => fileItem.file);
      updateAttachmentState(justFiles);
    } else {
      updateAttachmentState([]); // clear attachments;
    }
  };

  const getTextAreaPlaceholder = (): string => {
    if (props.connectionIssue) {
      return props.t('Cannot send');
    }

    if (props.currentChannel) {
      return props.canSendMessages
        ? props.t('Message channel')
        : props.t('Read only');
    }

    return props.t('Please select a channel first');
  };

  return (
    <React.Fragment>
      <div className="input_holder">
        <div className="textarea">
          <Editor
            ref={editorEl}
            editorState={editorState}
            onChange={(state) => onChangeEditor(state)}
            plugins={plugins}
            spellCheck
            placeholder={getTextAreaPlaceholder()}
            stripPastedStyles
            handleReturn={handleReturnKey}
            readOnly={!props.canSendMessages}
          />
        </div>
        <FileUploadField
          maxFileSize="150MB"
          acceptedFileTypes={props.acceptedFileTypes}
          updateFiles={handleAttachmentsUpdated}
          removeFilesWithErrors
          onAddFileError={addFileErrorToast}
          unsubmittedFilenames={unsubmittedFilenames}
          removeUploadedFile={() => {}}
          allowDropOnPage={props.allowDropAttachments}
          allowDrop={props.allowDropAttachments}
          separateBrowseButton
        />
        <div className="toastHolder">
          <ToastComponent
            items={[...toasts, ...getMediaToasts(props.inProgressMedia)]}
            onClickClose={onCloseToast}
          />
        </div>
      </div>
      <div
        className={classNames('chatMessaging__sendButton', {
          'chatMessaging__sendButton--enabled':
            props.canSendMessages &&
            !props.connectionIssue &&
            (isValidMessage(plainText) || unsubmittedFilenames.length > 0),
        })}
      >
        <IconButton
          icon="icon-send"
          onClick={handleSendMessage}
          isDisabled={
            !props.canSendMessages ||
            props.connectionIssue ||
            !(isValidMessage(plainText) || unsubmittedFilenames.length > 0)
          }
        />
      </div>
      {props.connectionIssue && (
        <div className="chatMessaging__statusInfo">{props.t('Offline')}</div>
      )}
    </React.Fragment>
  );
};

export const ChatTextAreaTranslated = withNamespaces()(ChatTextArea);
export default ChatTextArea;
