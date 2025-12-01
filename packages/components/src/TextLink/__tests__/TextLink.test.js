import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useInRouterContext, MemoryRouter } from 'react-router-dom';
import TextLink from '..';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useInRouterContext: jest.fn(),
}));

describe('<TextLink /> component', () => {
  const props = {
    text: 'Link text',
    href: 'https://www.kitmanlabs.com/',
    target: '_blank',
  };

  beforeEach(() => {
    useInRouterContext.mockReturnValue(false);
  });

  it('displays the correct text', () => {
    render(<TextLink {...props} />);
    expect(screen.getByRole('link')).toHaveTextContent('Link text');
  });

  it('sets the correct href', () => {
    render(<TextLink {...props} />);
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      'https://www.kitmanlabs.com/'
    );
  });

  it('sets the correct target', () => {
    render(<TextLink {...props} />);
    expect(screen.getByRole('link')).toHaveAttribute('target', '_blank');
    expect(screen.getByRole('link')).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('sets the correct styles when props.isDisabled is true', () => {
    render(<TextLink {...props} isDisabled />);
    expect(screen.getByRole('link')).toHaveClass('textLink--disabled');
  });

  it('sets the correct styles when props.kitmanDesignSystem is true', () => {
    render(<TextLink {...props} kitmanDesignSystem />);
    expect(screen.getByRole('link')).toHaveClass(
      'textLink--kitmanDesignSystem'
    );
  });

  it('calls the callback when clicking and the props.onClick is defined', async () => {
    const clickFunction = jest.fn();
    render(<TextLink {...props} onClick={clickFunction} />);

    await userEvent.click(screen.getByRole('link'));
    expect(clickFunction).toHaveBeenCalledTimes(1);
  });

  test('applies id prop', () => {
    render(<TextLink {...props} id="test-link-id" />);
    expect(screen.getByRole('link')).toHaveAttribute('id', 'test-link-id');
  });

  test('prevents default event propagation on click', async () => {
    const user = userEvent.setup();
    const parentClickHandler = jest.fn();
    const textLinkClickHandler = jest.fn();

    render(
      <div onClick={parentClickHandler}>
        <TextLink {...props} onClick={textLinkClickHandler} />
      </div>
    );

    await user.click(screen.getByRole('link'));

    expect(textLinkClickHandler).toHaveBeenCalledTimes(1);
    expect(parentClickHandler).not.toHaveBeenCalled(); // This asserts that stopPropagation worked
  });

  test('sets target to _self by default', () => {
    const { target, ...restProps } = props;
    render(<TextLink {...restProps} />);
    expect(screen.getByRole('link')).toHaveAttribute('target', '_self');
    expect(screen.getByRole('link')).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('truncates text when maxTextLength is exceeded', () => {
    const longText = 'This is a very long text that should be truncated.';
    const maxLength = 10;
    render(<TextLink {...props} text={longText} maxTextLength={maxLength} />);

    const expectedText = `${longText.substring(0, maxLength)}...`;
    expect(screen.getByText(expectedText)).toBeInTheDocument();
    expect(screen.getByText(expectedText).tagName).toBe('SPAN');
  });

  test('does not truncate text when maxTextLength is not exceeded', () => {
    const shortText = 'Short text';
    const maxLength = 20;
    render(<TextLink {...props} text={shortText} maxTextLength={maxLength} />);

    expect(screen.getByText(shortText)).toBeInTheDocument();
    expect(screen.getByText(shortText).tagName).toBe('A');
  });

  test('renders text as an element', () => {
    const customTextElement = <span>Custom <strong>Text</strong></span>;
    render(<TextLink {...props} text={customTextElement} />);

    expect(screen.getByText('Custom')).toBeInTheDocument();
    expect(screen.getByText('Text')).toBeInTheDocument();
    expect(screen.getByText('Text').tagName).toBe('STRONG');
  });

  test('renders ReactRouterLink when in router context and not external/hash param', () => {
    useInRouterContext.mockReturnValue(true);
    const internalProps = {
      text: 'Internal Link',
      href: '/internal-path', // Use an internal path for ReactRouterLink
      target: '_self', // Default target for internal links
      isExternalLink: false,
      withHashParam: false,
    };
    render(
      <MemoryRouter>
        <TextLink {...internalProps} />
      </MemoryRouter>
    );
    const renderedLink = screen.getByText(internalProps.text);
    expect(renderedLink.tagName).toBe('A'); // ReactRouterLink renders an <a> tag
    expect(renderedLink).toHaveAttribute('href', internalProps.href); // ReactRouterLink uses href internally
    expect(renderedLink).not.toHaveAttribute('target'); // Should not have target if _self
    expect(renderedLink).not.toHaveAttribute('rel'); // Should not have rel if _self
  });

  test('renders plain <a> tag when withHashParam is true, even in router context', () => {
    useInRouterContext.mockReturnValue(true);
    render(<TextLink {...props} withHashParam />);
    expect(screen.getByRole('link').tagName).toBe('A');
    expect(screen.getByRole('link')).toHaveAttribute('href', props.href);
    expect(screen.getByRole('link')).toHaveAttribute('target', '_blank');
    expect(screen.getByRole('link')).toHaveAttribute('rel', 'noopener noreferrer');
    expect(screen.getByRole('link')).not.toHaveAttribute('to'); // Should not have 'to' attribute
  });

  test('renders plain <a> tag when isExternalLink is true, even in router context', () => {
    useInRouterContext.mockReturnValue(true);
    render(<TextLink {...props} isExternalLink />);
    expect(screen.getByRole('link').tagName).toBe('A');
    expect(screen.getByRole('link')).toHaveAttribute('href', props.href);
    expect(screen.getByRole('link')).toHaveAttribute('target', '_blank');
    expect(screen.getByRole('link')).toHaveAttribute('rel', 'noopener noreferrer');
    expect(screen.getByRole('link')).not.toHaveAttribute('to'); // Should not have 'to' attribute
  });
});
