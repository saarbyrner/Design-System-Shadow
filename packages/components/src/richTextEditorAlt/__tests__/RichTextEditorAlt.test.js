import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { colors } from '@kitman/common/src/variables';
import RichTextEditorAlt from '..';

describe('<RichTextEditorAlt />', () => {
  const i18nT = i18nextTranslateStub();
  const defaultProps = {
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
    t: i18nT,
  };

  const renderRTE = (props) =>
    render(<RichTextEditorAlt {...defaultProps} {...props} />);

  it('renders', () => {
    renderRTE();
    expect(screen.getByText('Note Text')).toBeInTheDocument();
  });

  it('renders the correct number of control buttons', () => {
    renderRTE();

    const wrapper = screen.getByTestId('RichTextEditorAlt|editor');

    const controlsContainer = wrapper.querySelector('div[class$="commands"]');

    expect(controlsContainer).toBeInTheDocument();

    expect(
      controlsContainer.querySelectorAll('button[class$="styleButton"]').length
    ).toEqual(6);
  });

  describe('when less than 50 characters remain from limit', () => {
    it('shows the character counter with correct count', () => {
      const newValue = 'This text is almost at the limit.';
      renderRTE({ maxCharLimit: 55, value: newValue });

      const wrapper = screen.getByTestId('RichTextEditorAlt|editor');

      expect(
        wrapper.querySelectorAll('div[class$="charCounter"]').length
      ).toEqual(1);

      expect(
        document.querySelector('div[class$="charCounter"]')?.textContent
      ).toEqual('22 characters left');
    });
  });

  it('disables the editor and buttons when isDisabled is true', () => {
    renderRTE({ isDisabled: true });

    const wrapper = screen.getByTestId('RichTextEditorAlt|editor');

    expect(
      wrapper
        .querySelector('.remirror-editor-wrapper > div')
        ?.getAttribute('aria-readonly')
    ).toEqual('true');

    wrapper
      .querySelectorAll('button[class$="styleButton"]')
      .forEach((editorButton) => {
        expect(editorButton.disabled).toBe(true);
      });
  });

  it('shows the invalid state when isInvalid is true', () => {
    renderRTE({ kitmanDesignSystem: true, isInvalid: true });

    const wrapper = screen.getByTestId('RichTextEditorAlt|editor');

    const textarea = wrapper.querySelector('div[class$="textarea"]');

    expect(textarea).toBeInTheDocument();

    const style = window.getComputedStyle(textarea);

    expect(style.borderColor).toEqual(colors.red_100);
  });

  describe('when kitmanDesignSystem is true', () => {
    beforeEach(() => {
      renderRTE({ kitmanDesignSystem: true });
    });

    it('adds the textarea wrapper', () => {
      const wrapper = screen.getByTestId('RichTextEditorAlt|editor');

      expect(wrapper.querySelectorAll('div[class$="textarea"]').length).toEqual(
        1
      );
    });
  });
});
