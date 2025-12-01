import { render, screen, fireEvent } from '@testing-library/react';
import Toast from '..';

describe('Toast component', () => {
  const props = {
    items: [
      {
        text: 'MRI Scan (zx123MRIscan_123.jpg)',
        subText: '100 Kb',
        status: 'SUCCESS',
        id: 12345,
      },
      {
        text: 'MRI Scan (zx123MRIscan_3333.pdf)',
        subText: '98 Kb',
        status: 'ERROR',
        id: 3333,
      },
    ],
    onClickClose: jest.fn(),
    t: (key) => key,
  };

  it('renders the component', () => {
    render(<Toast {...props} />);
    const alertWrapper = screen.getAllByRole('alert')[0];
    expect(alertWrapper).toBeInTheDocument();
    expect(alertWrapper.parentNode).toHaveClass('reactToast');
  });

  it('renders the correct number of items', () => {
    render(<Toast {...props} />);
    const alertWrapper = screen.getAllByRole('alert')[0];
    expect(
      alertWrapper.parentNode.querySelectorAll('.reactToast__item')
    ).toHaveLength(2);
  });

  it('calls onClickClose when the user clicks the close button', () => {
    render(<Toast {...props} />);
    const closeButton = screen.getAllByRole('button')[0];
    expect(closeButton).toBeInTheDocument();
    fireEvent.click(closeButton);
    expect(props.onClickClose).toHaveBeenCalled();
  });

  it('disables the close button when the item status is "PROGRESS"', () => {
    const newProps = { ...props };
    newProps.items = [
      {
        text: 'MRI Scan (zx123MRIscan_123.jpg)',
        subText: '100 Kb',
        status: 'PROGRESS',
        id: 12345,
      },
    ];
    render(<Toast {...newProps} />);
    const closeButton = screen.getAllByRole('button')[0];
    expect(closeButton).toHaveClass('reactToast__closeButton--disabled');
  });

  it('does not disable the close button when canCloseProgress is true', () => {
    render(<Toast {...props} canCloseProgress />);
    const closeButton = screen.getAllByRole('button')[0];
    expect(closeButton).not.toHaveClass('reactToast__closeButton--disabled');
  });
});
