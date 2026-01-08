import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SlidingPanel from '../index';

describe('SlidingPanel - Responsive Component', () => {
  const onClickActionButtonSpy = jest.fn();

  it('calls onClose when close button pressed', async () => {
    render(<SlidingPanel isOpen onClose={onClickActionButtonSpy} />);
    const closeButton = await screen.findByRole('button');
    await userEvent.click(closeButton);
    expect(onClickActionButtonSpy).toHaveBeenCalled();
  });

  it('renders a title if one is passed', () => {
    render(<SlidingPanel title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders correctly if passed children props', () => {
    render(
      <SlidingPanel isOpen>
        <h3 className="childComponent">Hello this is a test</h3>
      </SlidingPanel>
    );
    expect(
      screen.getByRole('heading', { level: 3, name: 'Hello this is a test' })
    ).toBeInTheDocument();
  });

  it('click outside the SlidingPanel closes it with useClickToClose prop', async () => {
    const onClose = jest.fn();
    render(
      <div>
        <div data-testid="outside-element" />
        <SlidingPanel align="right" isOpen onClose={onClose} useClickToClose>
          <h3 className="childComponent">Hello this is a test</h3>
        </SlidingPanel>
      </div>
    );

    await userEvent.click(screen.getByTestId('outside-element'));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('click outside the SlidingPanel should be ignored by default', async () => {
    const onClose = jest.fn();
    render(
      <div>
        <div data-testid="outside-element" />
        <SlidingPanel align="right" isOpen onClose={onClose}>
          <h3 className="childComponent">Hello this is a test</h3>
        </SlidingPanel>
      </div>
    );

    await userEvent.click(screen.getByTestId('outside-element'));

    expect(onClose).not.toHaveBeenCalled();
  });

  it('sets data-intercom-target with props.intercomTarget', async () => {
    render(<SlidingPanel intercomTarget="Product tour - Sliding panel" />);

    expect(screen.getByTestId('sliding-panel')).toHaveAttribute(
      'data-intercom-target',
      'Product tour - Sliding panel'
    );
  });
});
