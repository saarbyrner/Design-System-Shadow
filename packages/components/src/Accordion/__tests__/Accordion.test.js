import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Accordion from '..';

describe('<Accordion /> component', () => {
  const props = {
    title: 'Accordion title',
    content: 'Accordion content',
  };

  it('displays the title and hides the content initially', () => {
    render(<Accordion {...props} />);
    expect(screen.getByText('Accordion title')).toBeVisible();
    expect(screen.getByText('Accordion content')).not.toBeVisible();
    expect(
      screen.queryByTestId('accordion-inline-wrapper')
    ).not.toBeInTheDocument();
  });

  it('shows the content when props.isOpen is true', () => {
    render(<Accordion {...props} isOpen />);
    expect(screen.getByText('Accordion content')).toBeVisible();
  });

  it('shows the content and calls the callback function when props.onChange is passed and the accordion button is clicked', async () => {
    const changeFunction = jest.fn();
    render(<Accordion {...props} onChange={changeFunction} />);

    const accordionButton = screen.getByRole('button');
    await userEvent.click(accordionButton);

    expect(screen.getByText('Accordion content')).toBeVisible();
    expect(accordionButton.querySelector('.icon-down')).toHaveStyle({
      transform: 'rotate(180deg)',
    });
    expect(changeFunction).toHaveBeenCalledTimes(1);
  });

  it('uses `icon` prop as the icon class', async () => {
    const icon = 'icon';
    const user = userEvent.setup();
    render(<Accordion {...props} icon={icon} />);

    const accordionButton = screen.getByRole('button');
    await user.click(accordionButton);

    expect(accordionButton.querySelector(`.${icon}`)).toBeInTheDocument();
    expect(accordionButton.querySelector('.icon-down')).not.toBeInTheDocument();
  });

  it('changes direction of arrow when rightArrowIcon is true', async () => {
    const changeFunction = jest.fn();
    render(<Accordion {...props} onChange={changeFunction} isRightArrowIcon />);

    const accordionButton = screen.getByRole('button');
    await userEvent.click(accordionButton);

    expect(screen.getByText('Accordion content')).toBeVisible();
    expect(accordionButton.querySelector('.icon-down')).toHaveStyle({
      transform: 'rotate(360deg)',
    });
    expect(changeFunction).toHaveBeenCalledTimes(1);
  });

  it('sets the correct styles when the icon align is left', () => {
    render(<Accordion {...props} iconAlign="left" />);

    expect(screen.getByText('Accordion title')).toHaveStyle({
      order: 2,
    });
    expect(screen.getByRole('button').querySelector('.icon-down')).toHaveStyle({
      order: 1,
      margin: '0 5px 0 0',
    });
  });

  it('sets the correct styles when the icon align is right', () => {
    render(<Accordion {...props} iconAlign="right" />);

    expect(screen.getByText('Accordion title')).toHaveStyle({
      order: 1,
    });
    expect(screen.getByRole('button').querySelector('.icon-down')).toHaveStyle({
      order: 2,
      margin: '0 0 0 22px',
    });
  });

  it('sets the correct styles when the titleColour is set', () => {
    render(<Accordion {...props} titleColour="#f1f2f3" />);
    expect(screen.getByRole('button')).toHaveStyle({
      color: '#f1f2f3',
    });
  });

  it('renders action prop', () => {
    render(<Accordion {...props} action={<p>action button</p>} />);
    expect(screen.getByText('action button')).toBeInTheDocument();
  });

  it('should render wrapper div when inline type is true', () => {
    render(
      <Accordion
        {...props}
        type="inlineActions"
        action={<p>action button</p>}
      />
    );
    expect(screen.getByTestId('accordion-inline-wrapper')).toBeInTheDocument();
  });
});
