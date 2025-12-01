import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HeaderTranslated as Header } from '../Header';

describe('<Header />', () => {
  const props = {
    pageTitle: 'My Test Title',
    buttonTitle: 'My Button',
    canCreate: false,
    onClickCreate: jest.fn(),
  };
  it('renders the page title', () => {
    render(<Header {...props} />);
    expect(screen.getByText(props.pageTitle)).toBeInTheDocument();
  });

  it('does not render the create button when canCreate prop is false', () => {
    render(<Header {...props} />);
    expect(screen.queryByText(props.buttonTitle)).not.toBeInTheDocument();
  });

  it('renders the button when canCreate prop is true', () => {
    render(<Header {...props} canCreate />);
    expect(screen.getByText(props.buttonTitle)).toBeInTheDocument();
  });

  it('calls the onClick function when button is pressed', async () => {
    render(<Header {...props} canCreate />);
    await userEvent.click(screen.getByText(props.buttonTitle));
    expect(props.onClickCreate).toHaveBeenCalled();
  });
});
