// @flow
// $FlowFixMe
import { forwardRef, useImperativeHandle, useState, useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import {
  BoldExtension,
  ItalicExtension,
  UnderlineExtension,
  StrikeExtension,
  OrderedListExtension,
  BulletListExtension,
  // $FlowFixMe
} from 'remirror/extensions';
// $FlowFixMe
import { CountExtension } from '@remirror/extension-count';

// $FlowFixMe
import {
  Remirror,
  useRemirror,
  EditorComponent,
  useRemirrorContext,
  // $FlowFixMe
} from '@remirror/react';
// $FlowFixMe
import { prosemirrorNodeToHtml } from 'remirror';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { getStyles, getStylesKDS } from './styles';
import Menu from './components/Menu';

type SubContent = {
  type: string,
  text: string,
};

type Content = {
  type: string,
  content: Array<SubContent>,
};

// Refer to remirror documentation for more details on the RichTextEditorAltDoc type
// https://www.remirror.io/docs/faq/#q-how-to-replace-the-content-in-the-editor
type RichTextEditorAltDoc = {
  type: 'doc',
  content: Array<Content>,
};

type RichTextEditorContent = RichTextEditorAltDoc | string;

export type RemirrorSetContent = (content: RichTextEditorContent) => any;

type Props = {
  forwardedRef: any,
  label?: string,
  optionalText?: ?string,
  value?: RichTextEditorContent,
  onChange: Function,
  isInvalid?: boolean,
  isDisabled?: boolean,
  maxCharLimit?: number,
  kitmanDesignSystem?: boolean,
};

const RichTextEditorAlt = (props: I18nProps<Props>) => {
  const emptyHTMLeditorContent = '<p></p>';
  const characterLimit = props.maxCharLimit || 65535;

  const [isEditorActive, setIsEditorActive] = useState<boolean>(false);
  const [isEditorValid, setIsEditorValid] = useState<boolean>(true);
  const [remainingChars, setRemainingChars] = useState<number>(characterLimit);

  const styles = props.kitmanDesignSystem
    ? getStylesKDS({
        isEditorActive,
        isEditorValid,
        isDisabled: props.isDisabled || false,
        isInvalid: props.isInvalid || false,
      })
    : getStyles({ isEditorValid, isDisabled: props.isDisabled || false });

  /*
   * the `forwardedRef` prop can be used to set the value
   * programmatically from outside as:
   *
   * forwardedRef.current?.setContent(
   *   'The new value'
   * );
   *
   * or
   *
   * forwardedRef.current?.setContent({
   *       type: 'doc',
   *       content: [
   *         {
   *           type: 'paragraph',
   *           content: [
   *             {
   *               type: 'text',
   *               text: 'my text here',
   *             },
   *           ],
   *         },
   *       ],
   *     });
   */
  const ImperativeHandle = forwardRef((_, ref) => {
    const remirrorContext = useRemirrorContext({
      autoUpdate: true,
    });

    const setContent: RemirrorSetContent = remirrorContext.setContent;

    useImperativeHandle(ref, () => ({ setContent }));

    return <></>;
  });

  const renderRemainingCharacters = () => {
    return (
      remainingChars <= 50 && (
        <div css={styles.charCounter}>
          {`${remainingChars} ${props.t(
            `character${remainingChars !== 1 ? 's' : ''} left`
          )}`}
        </div>
      )
    );
  };

  const { manager, state, setState } = useRemirror({
    extensions: () => [
      new BoldExtension(),
      new ItalicExtension(),
      new UnderlineExtension(),
      new StrikeExtension(),
      new OrderedListExtension(),
      new BulletListExtension(),
    ],
    content: props.value || emptyHTMLeditorContent,
    selection: 'start',
    stringHandler: 'html',
  });

  useEffect(() => {
    if (props.value && props.maxCharLimit) {
      const count = new CountExtension();
      const chars = props.maxCharLimit - count.getCharacterCount(state);
      setRemainingChars(chars);
      if (chars < 0) {
        setIsEditorValid(false);
      }
    }
  }, []);

  const handleEditorChange = (parameter) => {
    const html = prosemirrorNodeToHtml(parameter.state.doc);
    const count = new CountExtension();
    const currentContentCount = count.getCharacterCount(parameter.state);

    if (currentContentCount > characterLimit) {
      setIsEditorValid(false);
    } else {
      setRemainingChars(characterLimit - currentContentCount);
      setState(parameter.state);
      props.onChange(html);
    }
  };

  const handleOnBlur = (newState, event) => {
    if (
      event &&
      event.relatedTarget &&
      event.relatedTarget.closest('div').className.includes('commands') &&
      event.relatedTarget.tagName === 'BUTTON' &&
      event.relatedTarget.className.includes(`styleButton`)
    ) {
      event.preventDefault();
    } else {
      setIsEditorActive(false);
    }
  };

  const editorContainer = (
    <div css={styles.editorContainer}>
      <EditorComponent />
    </div>
  );

  return (
    <div css={styles.richTextEditor} data-testid="RichTextEditorAlt|editor">
      <div className="remirror-theme">
        <Remirror
          manager={manager}
          state={state}
          onChange={handleEditorChange}
          onFocus={() => setIsEditorActive(true)}
          onBlur={handleOnBlur}
          editable={!props.isDisabled}
        >
          <ImperativeHandle ref={props.forwardedRef} />
          {props.label && (
            <label css={styles.label}>
              <div css={styles.textareaLabel}>{props.label}</div>
              {props.optionalText && (
                <span css={styles.textareaOptional}>{props.optionalText}</span>
              )}
            </label>
          )}
          {props.kitmanDesignSystem ? (
            <div css={styles.textarea}>
              {editorContainer}
              <div
                className="richTextEditorAlt__commands"
                css={styles.commands}
              >
                <Menu
                  isDisabled={props.isDisabled}
                  kitmanDesignSystem={props.kitmanDesignSystem}
                />
              </div>
            </div>
          ) : (
            <>
              <div
                className="richTextEditorAlt__commands"
                css={styles.commands}
              >
                <Menu
                  isDisabled={props.isDisabled}
                  kitmanDesignSystem={props.kitmanDesignSystem}
                />
              </div>
              {editorContainer}
            </>
          )}
          {renderRemainingCharacters()}
        </Remirror>
      </div>
    </div>
  );
};

export const RichTextEditorAltTranslated = withNamespaces()(RichTextEditorAlt);
export default RichTextEditorAlt;
