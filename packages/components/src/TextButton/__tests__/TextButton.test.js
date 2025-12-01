import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TextButton from '../index';

describe('<TextButton />', () => {
  const props = {
    isDisabled: undefined,
    size: undefined,
    iconBefore: undefined,
    iconAfter: undefined,
    type: 'primary',
    text: 'Button text',
    onClick: jest.fn(),
    isSubmit: false,
  };

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Renders the component', () => {
    render(<TextButton {...props} />);
    expect(
      screen.getByRole('button', { name: 'Button text' })
    ).toBeInTheDocument();
  });

  it('renders the correct id', () => {
    const { container } = render(<TextButton {...props} id="buttonId" />);
    expect(container.querySelector('#buttonId')).toBeInTheDocument();
  });

  it('Adds the correct class for a primary button', () => {
    const { container } = render(<TextButton {...props} type="primary" />);
    expect(
      container.getElementsByClassName('textButton--primary')
    ).toHaveLength(1);
  });

  it('Adds the correct class for a secondary button', () => {
    const { container } = render(<TextButton {...props} type="secondary" />);
    expect(
      container.getElementsByClassName('textButton--secondary')
    ).toHaveLength(1);
  });

  it('Adds the correct class for a warning button', () => {
    const { container } = render(<TextButton {...props} type="warning" />);
    expect(
      container.getElementsByClassName('textButton--warning')
    ).toHaveLength(1);
  });

  it('Adds the correct class for a small button', () => {
    const { container } = render(<TextButton {...props} type="small" />);
    expect(container.getElementsByClassName('textButton--small')).toHaveLength(
      1
    );
  });

  it('Calls the click function when clicked', async () => {
    render(<TextButton {...props} />);

    await userEvent.click(screen.getByText('Button text'));
    expect(props.onClick).toHaveBeenCalled();
  });

  it('Disables button if isDisabled is true', async () => {
    render(<TextButton {...props} isDisabled />);
    expect(screen.getByRole('button', { name: 'Button text' })).toBeDisabled();

    await userEvent.click(screen.getByText('Button text'));
    expect(props.onClick).not.toHaveBeenCalled();
  });

  it('adds an icon before', () => {
    const { container } = render(
      <TextButton {...props} iconBefore="icon-edit" />
    );
    expect(
      container.querySelector('span.textButton__icon--before.icon-edit')
    ).toBeInTheDocument();
  });

  it('adds an icon after', () => {
    const { container } = render(
      <TextButton {...props} iconAfter="icon-edit" />
    );
    expect(
      container.querySelector('span.textButton__icon--after.icon-edit')
    ).toBeInTheDocument();
  });

  it('has a type button', () => {
    render(<TextButton {...props} />);
    expect(screen.getByRole('button', { name: 'Button text' })).toHaveAttribute(
      'type',
      'button'
    );
  });

  describe('when isSubmit is true', () => {
    it('has a type submit', () => {
      render(<TextButton {...props} isSubmit />);
      expect(
        screen.getByRole('button', { name: 'Button text' })
      ).toHaveAttribute('type', 'submit');
    });
  });

  it('adds the correct class when shouldFitContainer is true', () => {
    const { container } = render(<TextButton {...props} shouldFitContainer />);
    expect(
      container.getElementsByClassName('textButton--fitContainer')
    ).toHaveLength(1);
  });

  it('Renders a loading state when isLoading is true', () => {
    render(<TextButton {...props} isLoading />);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('sets the tabIndex', () => {
    render(<TextButton {...props} tabIndex="-1" />);
    expect(screen.getByRole('button')).toHaveAttribute('tabIndex', '-1');
  });
});
