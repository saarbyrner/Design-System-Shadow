import {
  screen,
  render,
  fireEvent,
  act,
  waitFor,
  within,
} from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import userEvent from '@testing-library/user-event';
import PopupBox from '../index';

describe('<PopupBox />', () => {
  const defaultProps = {
    t: i18nextTranslateStub(),
    title: 'Test title',
    onExpand: jest.fn(),
  };

  // Mocking root element on document for portal to be created
  beforeAll(() => {
    const mockElement = document.createElement('div');
    mockElement.setAttribute('id', 'root');
    document.body.appendChild(mockElement);
  });

  const renderComponent = () => render(<PopupBox {...defaultProps} />);

  it('should render as expected', () => {
    renderComponent();

    expect(screen.getByText('Test title')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should render content on click of header', async () => {
    renderComponent();

    await userEvent.click(screen.getByTestId('PopupBox|Header'));

    await waitFor(() => {
      expect(screen.getByTestId('PopupBox|Content')).toBeInTheDocument();
    });
  });

  it('should not render a button if expansion function isnt passed', () => {
    render(<PopupBox t={(t) => t} title="Test title" />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('should call expansion function passed as props on click', async () => {
    renderComponent();

    act(() => {
      fireEvent.click(screen.getAllByRole('button')[0]);
    });

    await waitFor(() => {
      expect(defaultProps.onExpand).toHaveBeenCalled();
    });
  });

  it('should render children within content if provided', async () => {
    render(
      <PopupBox {...defaultProps}>
        <h1>Test child</h1>
      </PopupBox>
    );

    await userEvent.click(screen.getByTestId('PopupBox|Header'));

    await waitFor(() => {
      expect(screen.getByTestId('PopupBox|Content')).toBeInTheDocument();
      const content = screen.getByTestId('PopupBox|Content');

      expect(within(content).getByText('Test child')).toBeInTheDocument();
    });
  });

  it('should use containerRight styles for positioning if no alignLeft prop is passed', () => {
    renderComponent();

    const container = screen.getByTestId('PopupBox');
    expect(container).toHaveStyle({
      right: '65px',
    });
  });

  it('should use containerLeft styles for positioning if alignLeft prop is passed', () => {
    render(<PopupBox {...defaultProps} alignLeft />);

    const container = screen.getByTestId('PopupBox');
    expect(container).toHaveStyle({
      left: 0,
    });
  });
});
