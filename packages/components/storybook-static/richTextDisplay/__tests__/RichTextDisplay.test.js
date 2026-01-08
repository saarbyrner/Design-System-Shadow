import { render, screen } from '@testing-library/react';
import RichTextDisplay from '..';

describe('<RichTextDisplay />', () => {
  const props = {
    value: '<p>This is a note text..</p>',
    isAbbreviated: false,
  };

  const longText =
    'A really long note of several lines of text. ' +
    'This should create a few lines of text. ' +
    'This is getting pretty long now so going to stop.';

  const shortText = 'Note text';

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders the component', () => {
    render(<RichTextDisplay {...props} />);

    const textElement = screen.getByText('This is a note text..');

    expect(textElement).toBeInTheDocument();
    expect(textElement.parentNode).toHaveClass('richTextDisplay');
  });

  it('renders html elements passed via the value prop', () => {
    render(
      <RichTextDisplay
        {...props}
        value="<div>parent<span>sibling</span><span>sibling2<h1>child</h1></span></div>"
      />
    );

    const parentElement = screen.getByText('parent');

    expect(parentElement.querySelectorAll('span')).toHaveLength(2);
    expect(parentElement.querySelectorAll('span')[0]).toHaveTextContent(
      'sibling'
    );
    expect(parentElement.querySelectorAll('span')[1]).toHaveTextContent(
      'sibling2'
    );
    expect(
      parentElement.querySelectorAll('span')[1].querySelector('h1')
    ).toHaveTextContent('child');
    expect(parentElement).toBeInTheDocument();
  });

  it('renders the component without default styles when removeDefaultStyles passed', () => {
    render(<RichTextDisplay {...props} removeDefaultStyles />);

    const textElement = screen.getByText('This is a note text..');

    expect(textElement).toBeInTheDocument();
    expect(textElement.parentNode).not.toHaveClass('richTextDisplay');
  });

  it('does not abbreviate short text', async () => {
    jest
      .spyOn(HTMLElement.prototype, 'offsetHeight', 'get')
      .mockReturnValue(50); // Less than abbreviatedHeight

    render(
      <RichTextDisplay value={shortText} isAbbreviated abbreviatedHeight={60} />
    );
    const text = screen.getByText(shortText);
    expect(text).not.toHaveClass('richTextDisplay--abbreviated');
  });

  it('adds richTextDisplay--abbreviated class when text needs to be cut off', async () => {
    jest
      .spyOn(HTMLElement.prototype, 'offsetHeight', 'get')
      .mockReturnValue(70); // More than abbreviatedHeight

    render(
      <RichTextDisplay value={longText} isAbbreviated abbreviatedHeight={60} />
    );
    const text = screen.getByText(longText);
    expect(text).toHaveClass('richTextDisplay--abbreviated');
  });

  it('does not add richTextDisplay--abbreviated class when isAbbreviated false', async () => {
    jest
      .spyOn(HTMLElement.prototype, 'offsetHeight', 'get')
      .mockReturnValue(70); // More than abbreviatedHeight

    render(
      <RichTextDisplay
        value={longText}
        isAbbreviated={false}
        abbreviatedHeight={60}
      />
    );
    const text = screen.getByText(longText);
    expect(text).not.toHaveClass('richTextDisplay--abbreviated');
  });
});
