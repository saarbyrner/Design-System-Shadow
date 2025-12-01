import { render } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { ThemeProvider } from '@kitman/playbook/providers';
import RichTextEditor from '..';

describe('<RichTextEditorAlt />', () => {
  const defaultProps = {
    label: 'Note Text',
    value:
      '<p>Does <strong>this</strong> feature <em>have the potential</em> to <u>impact</u> the <s>security</s> of our customers data or our systems? Some questions you should ask yourself:</p>\n' +
      '<ul>\n' +
      '<li><p>Adds a new flow by which data is accessed eg new ports opened up, new apis etc</p></li>\n' +
      '</ul>\n' +
      '<ol>\n' +
      '<li><p>Changes authorisation rules which control data eg changes how the rules by which data is accessed</p></li>\n' +
      '</ol>',
    onChange: jest.fn(),
    t: i18nextTranslateStub(),
  };

  const renderRTE = (props) =>
    render(
      <ThemeProvider>
        <RichTextEditor {...defaultProps} {...props} />
      </ThemeProvider>
    );

  const rerenderRTE = (rerender, props) =>
    rerender(
      <ThemeProvider>
        <RichTextEditor {...defaultProps} {...props} />
      </ThemeProvider>
    );

  it('renders', () => {
    const { getByText } = renderRTE();
    expect(getByText('Note Text')).toBeInTheDocument();
  });

  it('renders optional text correctly', () => {
    const { getByText } = renderRTE({ optionalText: 'optional text' });
    expect(getByText('optional text')).toBeInTheDocument();
  });

  it('renders the value correctly', () => {
    const { container } = renderRTE();
    expect(
      container.querySelector('div[contenteditable="true"]').innerHTML
    ).toEqual(defaultProps.value.replace(/(\r\n|\n|\r)/gm, ''));
  });

  it('renders the correct number of control buttons', () => {
    const { container } = renderRTE();

    const toolbar = container.querySelector('div[class$="toolbar"]');

    expect(toolbar).toBeInTheDocument();

    expect(toolbar.querySelectorAll('button').length).toEqual(6);
  });

  it('renders the heading buttons when showHeadingButtons = on', () => {
    const { container } = renderRTE({ showHeadingButtons: true });

    const toolbar = container.querySelector('div[class$="toolbar"]');

    expect(toolbar).toBeInTheDocument();

    expect(toolbar.querySelectorAll('button').length).toEqual(8);
  });

  it('shows the character counter with correct count', () => {
    const { container } = renderRTE({
      charLimit: 55,
      value: 'This is some dummy text.',
    });

    expect(
      container.querySelectorAll('div[class$="charLimitIndicator"]').length
    ).toEqual(1);

    expect(
      document.querySelector('div[class$="charLimitIndicator"]')?.textContent
    ).toEqual('31 characters left');
  });

  it('applies the size correctly', () => {
    // small
    const { container, rerender } = renderRTE({
      size: 'small',
    });
    const editorSmall = container.querySelector('div[class$="editor"]');
    expect(editorSmall).toBeInTheDocument();
    const styleSmall = window.getComputedStyle(editorSmall);
    expect(styleSmall['font-size']).toEqual('14px');

    // medium
    rerenderRTE(rerender, {
      size: 'medium',
    });
    const editorMedium = container.querySelector('div[class$="editor"]');
    expect(editorMedium).toBeInTheDocument();
    const styleMedium = window.getComputedStyle(editorMedium);
    expect(styleMedium['font-size']).toEqual('16px');

    // large
    rerenderRTE(rerender, {
      size: 'large',
    });
    const editorLarge = container.querySelector('div[class$="editor"]');
    expect(editorLarge).toBeInTheDocument();
    const styleLarge = window.getComputedStyle(editorLarge);
    expect(styleLarge['font-size']).toEqual('18px');
  });

  it('disables the editor and buttons when disabled is true', () => {
    const { container } = renderRTE({ disabled: true });

    expect(
      container
        .querySelector('.remirror-editor-wrapper > div')
        ?.getAttribute('aria-readonly')
    ).toEqual('true');

    const toolbar = container.querySelector('div[class$="toolbar"]');

    expect(toolbar.querySelectorAll('button').length).toEqual(6);

    toolbar.querySelectorAll('button').forEach((editorButton) => {
      expect(editorButton.disabled).toBe(true);
    });
  });

  it('shows the error state when error is true', () => {
    const { container } = renderRTE({ error: true });

    const editor = container.querySelector('div[class$="editor"]');

    expect(editor).toBeInTheDocument();

    const style = window.getComputedStyle(editor);

    expect(style.color).toEqual('rgb(177, 27, 39)');
  });

  it('shows the error feedback', () => {
    const { container } = renderRTE({
      error: true,
      errorText: 'error feedback',
    });

    expect(
      container.querySelectorAll('div[class$="errorText"]').length
    ).toEqual(1);

    expect(
      document.querySelector('div[class$="errorText"]')?.textContent
    ).toEqual('error feedback');
  });
});
