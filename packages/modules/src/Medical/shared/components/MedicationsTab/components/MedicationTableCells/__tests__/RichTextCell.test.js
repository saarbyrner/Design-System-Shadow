import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RichTextCell from '../RichTextCell';

describe('<RichTextCell />', () => {
  const shortText = 'Note text';
  const longText =
    'A really long note of several lines of text. ' +
    'This should create a few lines of text. ' +
    'This is getting pretty long now so going to stop.';

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('does not abbreviate short text', async () => {
    jest
      .spyOn(HTMLElement.prototype, 'offsetHeight', 'get')
      .mockReturnValue(50); // Less than abbreviatedHeight

    render(<RichTextCell value={shortText} abbreviatedHeight={60} />);
    const text = screen.getByText(shortText);
    expect(text).not.toHaveClass('richTextDisplay--abbreviated');
    const expandButton = screen.getByLabelText('expand');
    expect(expandButton).not.toBeVisible();
  });

  it('changes css class to expand long text when button is pressed', async () => {
    jest
      .spyOn(HTMLElement.prototype, 'offsetHeight', 'get')
      .mockReturnValue(70); // More than abbreviatedHeight

    render(<RichTextCell value={longText} abbreviatedHeight={60} />);
    const text = screen.getByText(longText);
    expect(text).toHaveClass('richTextDisplay--abbreviated');
    const expandButton = screen.getByLabelText('expand');
    await userEvent.click(expandButton);
    expect(text).not.toHaveClass('richTextDisplay--abbreviated');
  });
});
