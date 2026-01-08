// @flow
import { useState, useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import { stateToHTML } from 'draft-js-export-html';
import { stateFromHTML } from 'draft-js-import-html';
import {
  Editor,
  EditorState,
  RichUtils,
  // $FlowFixMe Draft JS issue with flow https://github.com/facebook/draft-js/issues/1974
} from 'draft-js';
// $FlowFixMe
import type { EditorState as EditorStateType } from 'draft-js';
import classNames from 'classnames';

import type { I18nProps } from '@kitman/common/src/types/i18n';
import { inlineStyles, blockStyles } from './resources/styleOptions';
import type { StyleOption } from './types';

type Props = {
  label?: string,
  canSetExternally?: boolean,
  value: string,
  isDisabled?: boolean,
  maxCharLimit?: number,
  isInvalid?: boolean,
  kitmanDesignSystem?: boolean,
  onChange: Function,
  forwardedRef: any,
  optionalText?: ?string,
};

export const emptyHTMLeditorContent = '<p><br></p>';

const RichTextEditor = (props: I18nProps<Props>) => {
  const characterLimit = props.maxCharLimit || 65535;
  const [editorState, setEditorState] = useState(
    props.value !== ''
      ? EditorState.createWithContent(stateFromHTML(props.value))
      : EditorState.createEmpty()
  );
  const [isEditorValid, setIsEditorValid] = useState(true);
  const [isEditorActive, setIsEditorActive] = useState(false);

  /*
   * https://draftjs.org/docs/quickstart-api-basics#controlling-rich-text
   *
   * The editor state must be controlled by Draft JS as it contains a lot
   * more information than just the text. (Example: cursor, undo/redo history...)
   * This is why this component is uncontrolled (https://reactjs.org/docs/uncontrolled-components.html)
   *
   * The added props "canSetExternally" in combination with the prop "value" attempts to make this component controlled.
   * However, it creates bugs as the cursor moves to the start of the input on change. This is because we can't set the text content
   * from outside while keeping the cursor position which is managed within Draft JS.
   *
   * Instead of trying to transform this component to be controlled, we can use the prop `forwardedRef` to set the value
   * programmatically from outside as:
   *
   * forwardedRef.current?.update(
   *   EditorState.createWithContent(stateFromHTML('The new value'))
   * );
   */
  useEffect(() => {
    if (props.canSetExternally && props.value) {
      setEditorState(EditorState.createWithContent(stateFromHTML(props.value)));
    }
  }, [props.canSetExternally, props.value]);

  // get length of content being inputted either by pasting or typing
  const getLengthOfSelectedText = () => {
    const currentSelection = editorState.getSelection();

    let length = 0;

    if (!currentSelection.isCollapsed()) {
      const currentContent = editorState.getCurrentContent();
      const startKey = currentSelection.getStartKey();
      const endKey = currentSelection.getEndKey();
      const startBlock = currentContent.getBlockForKey(startKey);

      if (startKey === endKey) {
        length +=
          currentSelection.getEndOffset() - currentSelection.getStartOffset();
      } else {
        let currentKey = startKey;

        while (
          currentKey &&
          currentKey !== currentContent.getKeyAfter(endKey)
        ) {
          // eslint-disable-next-line max-depth
          if (currentKey === startKey) {
            length +=
              startBlock.getLength() - currentSelection.getStartOffset() + 1;
          } else if (currentKey === endKey) {
            length += currentSelection.getEndOffset();
          } else {
            length += currentContent.getBlockForKey(currentKey).getLength() + 1;
          }

          currentKey = currentContent.getKeyAfter(currentKey);
        }
      }
    }

    return length;
  };

  const handleKeyCommand = (
    command: string,
    newEditorState: EditorStateType
  ) => {
    const newState = RichUtils.handleKeyCommand(newEditorState, command);
    if (newState) {
      setEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  const onChangeEditor = (state: EditorStateType) => {
    const contentState = state.getCurrentContent();
    const currentContentLength = contentState.getPlainText('').length;
    if (currentContentLength < characterLimit) {
      setIsEditorValid(true);
    }

    const htmlState = stateToHTML(contentState);
    setEditorState(state);
    props.onChange(htmlState);
  };

  const onInlineStyleButtonClick = (
    state: EditorStateType,
    style: StyleOption,
    e: Object
  ) => {
    e.preventDefault();
    onChangeEditor(RichUtils.toggleInlineStyle(state, style.id));
  };

  const onBlockStyleButtonClick = (
    state: EditorStateType,
    style: StyleOption,
    e: Object
  ) => {
    e.preventDefault();
    onChangeEditor(RichUtils.toggleBlockType(state, style.id));
  };

  const baseClass = props.kitmanDesignSystem
    ? 'richTextEditor--kitmanDesignSystem'
    : 'richTextEditor';

  const getInlineStyleButtons = () => {
    return inlineStyles.map((style) => (
      <button
        type="button"
        key={style.id}
        className={classNames([`${baseClass}__styleBtn`], {
          [`${baseClass}__styleBtn--active`]: editorState
            .getCurrentInlineStyle()
            .has(style.id),
        })}
        onMouseDown={(e) => onInlineStyleButtonClick(editorState, style, e)}
        disabled={props.isDisabled}
      >
        <i className={style.icon} />
      </button>
    ));
  };

  const getBlockStyleButtons = () => {
    const currentBlockStyle = editorState
      .getCurrentContent()
      .getBlockForKey(editorState.getSelection().getStartKey())
      .getType();
    return blockStyles.map((style) => (
      <button
        type="button"
        key={style.id}
        className={classNames([`${baseClass}__styleBtn`], {
          [`${baseClass}__styleBtn--active`]: currentBlockStyle === style.id,
        })}
        onMouseDown={(e) => onBlockStyleButtonClick(editorState, style, e)}
        disabled={props.isDisabled}
      >
        <i className={style.icon} />
      </button>
    ));
  };

  // gets called before character is entered
  const handleBeforeInput = () => {
    const currentContent = editorState.getCurrentContent();
    const currentContentLength = currentContent.getPlainText('').length;
    const selectedTextLength = getLengthOfSelectedText();

    // check length of existing content length plus new addition
    if (currentContentLength - selectedTextLength > characterLimit - 1) {
      setIsEditorValid(false);
      return 'handled';
    }
    setIsEditorValid(true);
    return 'not-handled';
  };

  // gets called when pasting text or HTML
  const handlePastedText = (pastedText: string) => {
    const currentContent = editorState.getCurrentContent();
    const currentContentLength = currentContent.getPlainText('').length;
    const selectedTextLength = getLengthOfSelectedText();

    // check length of existing content length plus new addition
    if (
      currentContentLength + pastedText.length - selectedTextLength >
      characterLimit
    ) {
      setIsEditorValid(false);
      return 'handled';
    }
    setIsEditorValid(true);
    return 'not-handled';
  };

  const getRemainingChars = () => {
    const currentContent = editorState.getCurrentContent();
    const currentContentLength = currentContent.getPlainText('').length;
    return characterLimit - currentContentLength;
  };

  const renderRemainingCharacters = () => {
    const remainingChars = getRemainingChars();
    return (
      remainingChars <= 50 && (
        <div className="richTextEditor__charCounter">
          {remainingChars}{' '}
          {remainingChars === 1
            ? props.t('character left')
            : props.t('characters left')}
        </div>
      )
    );
  };

  const editorContainer = (
    <div
      className={classNames([`${baseClass}__editorContainer`], {
        [`${baseClass}__editorContainer--error`]: !isEditorValid,
      })}
    >
      <Editor
        ref={props.forwardedRef}
        editorState={editorState}
        onFocus={() => setIsEditorActive(true)}
        onBlur={() => setIsEditorActive(false)}
        onChange={(state) => onChangeEditor(state)}
        handleKeyCommand={handleKeyCommand}
        handleBeforeInput={handleBeforeInput}
        handlePastedText={handlePastedText}
        readOnly={props.isDisabled}
      />
    </div>
  );

  return (
    <div
      className={classNames(baseClass, {
        [`${baseClass}--active`]: isEditorActive,
        [`${baseClass}--disabled`]: props.isDisabled,
        [`${baseClass}--invalid`]: props.isInvalid,
      })}
    >
      {props.label && (
        <label>
          <div className="textareaLabel">{props.label}</div>
          {props.optionalText && (
            <span className="textareaOptional">{props.optionalText}</span>
          )}
        </label>
      )}
      {props.kitmanDesignSystem ? (
        <div
          className={`${baseClass}__textarea`}
          data-testid="RichTextEditor|editor"
        >
          {editorContainer}
          <div
            className={classNames([`${baseClass}__commands`], {
              [`${baseClass}__commands--active`]: isEditorActive,
            })}
          >
            {getInlineStyleButtons()}
            {getBlockStyleButtons()}
          </div>
        </div>
      ) : (
        <>
          <div className={`${baseClass}__commands`}>
            {getInlineStyleButtons()}
            {getBlockStyleButtons()}
          </div>
          {editorContainer}
        </>
      )}
      {renderRemainingCharacters()}
    </div>
  );
};

export const RichTextEditorTranslated = withNamespaces()(RichTextEditor);
export default RichTextEditor;
