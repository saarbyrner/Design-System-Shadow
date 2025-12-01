import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TextTag from '..';

describe('<TextTag /> component', () => {
  const props = {
    content: 'TextTag content',
  };

  it('sets the correct styles by default', () => {
    render(<TextTag {...props} />);
    expect(screen.getByTestId('TextTag')).toHaveStyle({
      color: '#1f2d44',
      backgroundColor: '#f1f2f3',
    });
  });

  it('sets the correct width on the content by default to display the ellipsis', () => {
    render(<TextTag {...props} />);
    expect(screen.getByText('TextTag content')).toHaveStyle({
      width: 280,
    });
  });

  it('calls the correct callback when is closeable and clicking the close button', async () => {
    const closeFunction = jest.fn();
    render(<TextTag {...props} closeable onClose={closeFunction} />);

    const closeButton = screen.getByRole('button');
    // shows the close icon
    expect(closeButton.querySelector('.icon-close')).toBeTruthy();
    // click close button
    await userEvent.click(closeButton);
    expect(closeFunction).toHaveBeenCalledTimes(1);
  });

  it('sets the correct styles when the backgroundColor is set', () => {
    render(<TextTag {...props} backgroundColor="#b11b27" />);
    expect(screen.getByTestId('TextTag')).toHaveStyle({
      backgroundColor: '#b11b27',
    });
  });

  it('sets the correct styles when the textColor is set', () => {
    render(<TextTag {...props} textColor="#f1f2f3" />);
    expect(screen.getByTestId('TextTag')).toHaveStyle({
      color: '#f1f2f3',
    });
  });

  it('calls the correct callback when is clickable and clicking on the content', async () => {
    const clickFunction = jest.fn();
    render(<TextTag {...props} clickable onTagClick={clickFunction} />);

    // click content button
    await userEvent.click(screen.getByRole('button'));
    expect(clickFunction).toHaveBeenCalledTimes(1);
  });

  it('sets the correct width on the content when the displayEllipsisWidth is set', () => {
    render(<TextTag {...props} displayEllipsisWidth={100} />);
    expect(screen.getByText('TextTag content')).toHaveStyle({
      width: 100,
    });
  });

  it('sets the correct styles when is disabled', () => {
    render(
      <TextTag
        {...props}
        clickable
        closeable
        isDisabled
        onTagClick={() => jest.fn()}
        onClose={() => jest.fn()}
      />
    );

    const [contentButton, closeButton] = screen.getAllByRole('button');
    expect(contentButton).toHaveStyle({
      color: '#afb7c4',
      cursor: 'not-allowed',
    });
    expect(closeButton).toHaveStyle({
      color: '#afb7c4',
      cursor: 'not-allowed',
      backgroundColor: 'transparent',
    });
  });
});
