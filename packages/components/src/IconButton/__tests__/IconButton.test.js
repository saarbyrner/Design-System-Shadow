import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import IconButton from '..';

describe('<IconButton />', () => {
  const props = {
    icon: 'icon-edit',
    isDisabled: undefined,
    isSmall: false,
    onClick: jest.fn(),
    isTransparent: false,
    isBorderless: false,
    isLoading: false,
  };

  it('renders the component', () => {
    render(<IconButton {...props} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('has the icon class', () => {
    render(<IconButton {...props} />);
    expect(screen.getByRole('button')).toHaveClass('icon-edit');
  });

  it('displays text', () => {
    render(<IconButton {...props} text="Button name" />);
    expect(screen.getByRole('button')).toHaveClass('iconButton--hasText');
  });

  it('uses `testId` prop as `data-testid` attribute', () => {
    const testId = 'test-id';
    render(<IconButton {...props} testId={testId} />);
    expect(screen.getByTestId(testId)).toBeInTheDocument();
  });

  it('adds the class iconButton--small when isSmall is true', () => {
    render(<IconButton {...props} isSmall />);
    expect(screen.getByRole('button')).toHaveClass('iconButton--small');
  });

  it('adds the custom styles when customStyles is passed', () => {
    render(
      <IconButton {...props} customStyles={{ backgroundColor: 'pink' }} />
    );
    expect(screen.getByRole('button')).toHaveStyle({ backgroundColor: 'pink' });
  });

  it('adds the class iconButton--transparent when isTransparent is true', () => {
    render(<IconButton {...props} isTransparent />);
    expect(screen.getByRole('button')).toHaveClass('iconButton--transparent');
  });

  it('adds the class iconButton--borderless when isBorderless is true', () => {
    render(<IconButton {...props} isBorderless />);
    expect(screen.getByRole('button')).toHaveClass('iconButton--borderless');
  });

  it('adds the class iconButton--darkIcon when isDarkIcon is true', () => {
    render(<IconButton {...props} isDarkIcon />);
    expect(screen.getByRole('button')).toHaveClass('iconButton--darkIcon');
  });

  it('calls the click function when clicked', async () => {
    render(<IconButton {...props} />);

    await userEvent.click(screen.getByRole('button'));
    expect(props.onClick).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button')).toHaveAttribute(
      'aria-disabled',
      'false'
    );
  });

  it('disables button if isDisabled is true', async () => {
    render(<IconButton {...props} isDisabled />);

    await userEvent.click(screen.getByRole('button'));
    expect(props.onClick).toHaveBeenCalledTimes(0);
    expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true');
  });

  it('renders a loading state when isLoading is true', async () => {
    render(<IconButton {...props} isLoading />);

    expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
