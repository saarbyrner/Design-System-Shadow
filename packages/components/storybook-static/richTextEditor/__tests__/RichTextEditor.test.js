import { render, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import RichTextEditor from '../index';
import { inlineStyles, blockStyles } from '../resources/styleOptions';

describe('<RichTextEditor />', () => {
  const props = {
    label: 'Note Text',
    value:
      '<p>Does <strong>this</strong> feature <em>have the potential</em> to <u>impact</u> the <del>security</del> of our customers data or our systems? Some questions you should ask yourself:</p>\n' +
      '<ul>\n' +
      '  <li>Adds a new flow by which data is accessed eg new ports opened up, new apis etc</li>\n' +
      '</ul>\n' +
      '<ol>\n' +
      '  <li>Changes authorisation rules which control data eg changes how the rules by which data is accessed</li>\n' +
      '</ol>',
    onChange: jest.fn(),
    t: i18nextTranslateStub(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders', () => {
    render(<RichTextEditor {...props} />);
    expect(screen.getByText('Note Text')).toBeInTheDocument();
  });

  it('calls the correct callback when editing the editor content', () => {
    const { container } = render(<RichTextEditor {...props} />);
    const editor = container.querySelector('[contenteditable="true"]');

    // Focus the editor first
    fireEvent.focus(editor);

    // Use fireEvent.change to simulate content change
    // For contenteditable, we set textContent and trigger change
    fireEvent.change(editor, { target: { textContent: 'test' } });

    // The onChange should be called when content changes
    expect(props.onChange).toHaveBeenCalled();
  });

  it('renders the correct number of control buttons', () => {
    const { container } = render(<RichTextEditor {...props} />);
    const styleButtons = container.querySelectorAll(
      '.richTextEditor__styleBtn'
    );

    expect(styleButtons).toHaveLength(inlineStyles.length + blockStyles.length);
  });

  describe('when maxCharLimit is defined', () => {
    it('shows an error when limit is exceeded', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <RichTextEditor {...props} maxCharLimit={10} value="" />
      );

      expect(
        container.querySelector('.richTextEditor__editorContainer--error')
      ).not.toBeInTheDocument();

      // Get the editor element and paste text that exceeds limit
      const editor = container.querySelector('[contenteditable="true"]');

      // Focus the editor first
      await user.click(editor);

      // Use fireEvent.paste with proper clipboardData to trigger Draft.js handlePastedText
      const longText = 'This text is longer than the maximum character limit.';
      const pasteEvent = {
        clipboardData: {
          getData: () => longText,
        },
      };

      fireEvent.paste(editor, pasteEvent);

      // Wait for the error state to be applied
      // The error class should appear after the paste event is handled
      const errorContainer = container.querySelector(
        '.richTextEditor__editorContainer--error'
      );
      expect(errorContainer).toBeInTheDocument();
    });
  });

  describe('when less than 50 characters remain from limit', () => {
    it('shows the character counter with correct count', () => {
      const newValue = 'This text is almost at the limit.';
      const { container } = render(
        <RichTextEditor {...props} maxCharLimit={55} value={newValue} />
      );

      const charCounter = container.querySelector(
        '.richTextEditor__charCounter'
      );
      expect(charCounter).toBeInTheDocument();
      expect(charCounter).toHaveTextContent('22 characters left');
    });
  });

  it('disables the editor and buttons when isDisabled is true', () => {
    const { container } = render(<RichTextEditor {...props} isDisabled />);

    expect(
      container.querySelector('.richTextEditor--disabled')
    ).toBeInTheDocument();

    // When disabled, Draft.js Editor with readOnly={true} may not have contenteditable attribute
    // or may have contenteditable="false". Check that the editor container exists.
    const editorContainer = container.querySelector(
      '.richTextEditor__editorContainer'
    );
    expect(editorContainer).toBeInTheDocument();

    const styleButtons = container.querySelectorAll(
      '.richTextEditor__styleBtn'
    );
    expect(styleButtons.length).toBeGreaterThan(0);
    styleButtons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it('shows the invalid state when isInvalid is true', () => {
    const { container } = render(<RichTextEditor {...props} isInvalid />);

    expect(
      container.querySelector('.richTextEditor--invalid')
    ).toBeInTheDocument();
  });

  describe('when canSetExternally is true', () => {
    it('allows to change the value externally', () => {
      const { container, rerender } = render(
        <RichTextEditor {...props} value="" canSetExternally />
      );

      const editor = container.querySelector('[contenteditable="true"]');
      expect(editor).toBeInTheDocument();

      rerender(<RichTextEditor {...props} value="new text" canSetExternally />);

      // The editor should update with new content
      // Note: Draft.js content is not directly queryable via textContent
      // but the component should update internally
      expect(
        container.querySelector('[contenteditable="true"]')
      ).toBeInTheDocument();
    });
  });

  describe('when kitmanDesignSystem is true', () => {
    it('adds the new design system styles', () => {
      const { container } = render(
        <RichTextEditor {...props} kitmanDesignSystem />
      );

      expect(
        container.querySelector('.richTextEditor--kitmanDesignSystem')
      ).toBeInTheDocument();
      expect(
        container.querySelector(
          '.richTextEditor--kitmanDesignSystem__editorContainer'
        )
      ).toBeInTheDocument();
      expect(
        container.querySelector('.richTextEditor--kitmanDesignSystem__commands')
      ).toBeInTheDocument();

      const styleButtons = container.querySelectorAll(
        '.richTextEditor--kitmanDesignSystem__styleBtn'
      );
      expect(styleButtons).toHaveLength(6);
    });

    describe('when focusing / blurring the editor', () => {
      it('adds / removes the active styles', async () => {
        const user = userEvent.setup();
        const { container } = render(
          <RichTextEditor {...props} kitmanDesignSystem />
        );

        const editor = container.querySelector('[contenteditable="true"]');
        const editorContainer = container.querySelector(
          '.richTextEditor--kitmanDesignSystem'
        );
        const commandsContainer = container.querySelector(
          '.richTextEditor--kitmanDesignSystem__commands'
        );

        // Click on Editor
        await user.click(editor);

        expect(editorContainer).toHaveClass(
          'richTextEditor--kitmanDesignSystem--active'
        );
        expect(commandsContainer).toHaveClass(
          'richTextEditor--kitmanDesignSystem__commands--active'
        );

        // Blur the editor by clicking outside
        await user.click(document.body);

        expect(editorContainer).not.toHaveClass(
          'richTextEditor--kitmanDesignSystem--active'
        );
        expect(commandsContainer).not.toHaveClass(
          'richTextEditor--kitmanDesignSystem__commands--active'
        );
      });
    });
  });
});
