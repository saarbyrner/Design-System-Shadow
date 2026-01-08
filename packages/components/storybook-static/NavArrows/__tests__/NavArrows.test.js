import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NavArrows from '..';

describe('<NavArrows />', () => {
  const props = {
    customClassname: 'customClassname',
    rightNavBtnClasses: 'rightNavBtnClasses',
    onLeftBtnClick: jest.fn(),
    onRightBtnClick: jest.fn(),
  };

  it('renders correctly', () => {
    render(<NavArrows {...props} />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('when a custom classname is added it renders the correct classnames', () => {
    render(<NavArrows {...props} />);

    expect(screen.getByRole('navigation')).toHaveClass('customClassname');
  });

  it('when the left button is clicked it calls the correct callback', async () => {
    render(<NavArrows {...props} />);

    await userEvent.click(
      screen.getByRole('navigation').querySelector('button.icon-next-left')
    );
    expect(props.onLeftBtnClick).toHaveBeenCalledTimes(1);
  });

  it('when the right button is clicked it calls the correct callback', async () => {
    render(<NavArrows {...props} />);

    await userEvent.click(
      screen.getByRole('navigation').querySelector('button.icon-next-right')
    );
    expect(props.onRightBtnClick).toHaveBeenCalledTimes(1);
  });
});
