import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ExpandingPanel from '..';

describe('<ExpandingPanel />', () => {
  const props = {
    width: 465,
    onClose: jest.fn(),
  };

  it('hides the panel initially', () => {
    render(<ExpandingPanel {...props} />);
    expect(screen.getByTestId('ExpandingPanel')).not.toBeVisible();
  });

  it('displays the panel when is open', () => {
    render(<ExpandingPanel {...props} isOpen />);
    expect(screen.getByTestId('ExpandingPanel')).toBeVisible();
  });

  it('renders a title if one is passed', () => {
    render(<ExpandingPanel {...props} isOpen title="Test title" />);
    expect(screen.getByText('Test title')).toBeInTheDocument();
  });

  it('calls the onClose callback when button is pressed', async () => {
    render(<ExpandingPanel {...props} isOpen />);

    const closeButton = screen.getByRole('button');
    await userEvent.click(closeButton);
    expect(props.onClose).toHaveBeenCalledTimes(1);
  });

  it('renders correctly when children is passed', () => {
    const Child = () => <h3>Hello this is a test</h3>;

    render(
      <ExpandingPanel isOpen>
        <Child />
      </ExpandingPanel>
    );
    expect(screen.getByText('Hello this is a test')).toBeInTheDocument();
  });
});
