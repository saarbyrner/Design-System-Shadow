import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ActionTooltip from '..';

describe('<ActionTooltip />', () => {
  const props = {
    content: <p>Fake content</p>,
    actionSettings: {
      text: 'apply',
      onCallAction: jest.fn(),
    },
    triggerElement: <p>Show ActionTooltip</p>,
    onVisibleChange: jest.fn(),
  };

  it('Renders the component', () => {
    render(<ActionTooltip {...props} />);

    expect(screen.getByText('Show ActionTooltip')).toBeInTheDocument();
  });

  it('renders the trigger element, tooltip content and text of the action', async () => {
    render(<ActionTooltip {...props} />);

    expect(screen.getByText('Show ActionTooltip')).toBeInTheDocument();
    expect(screen.queryByText('Fake content')).not.toBeInTheDocument();
    expect(screen.queryByText('apply')).not.toBeInTheDocument();

    await userEvent.click(screen.getByText('Show ActionTooltip'));
    expect(screen.getByText('Fake content')).toBeInTheDocument();
    expect(screen.getByText('apply')).toBeInTheDocument();
  });

  it('calls onCallAction callback when button is clicked', async () => {
    render(<ActionTooltip {...props} />);

    await userEvent.click(screen.getByText('Show ActionTooltip'));
    await userEvent.click(screen.getByText('apply'));

    expect(props.actionSettings.onCallAction).toHaveBeenCalledTimes(1);
  });

  it('when onVisibleChange is defined it calls the correct callback', async () => {
    render(
      <ActionTooltip {...props} onVisibleChange={props.onVisibleChange} />
    );

    await userEvent.click(screen.getByText('Show ActionTooltip'));
    expect(props.onVisibleChange).toHaveBeenCalledTimes(1);
  });

  it('when props.triggerFullWidth is true it applies the correct style to the trigger button', () => {
    render(<ActionTooltip {...props} triggerFullWidth />);

    expect(screen.getByText('Show ActionTooltip').parentNode).toHaveClass(
      'actionTooltip__trigger--fullWidth'
    );
  });

  it('when scrollable is true it applies the correct styles to the content and footer', async () => {
    render(<ActionTooltip {...props} scrollable />);

    await userEvent.click(screen.getByText('Show ActionTooltip'));
    expect(screen.getByText('Fake content').parentNode.parentNode).toHaveClass(
      'actionTooltip__content--scrollable'
    );
    expect(screen.getByText('apply').parentNode.parentNode).toHaveClass(
      'actionTooltip__footer--scrollable'
    );
  });

  it('when props.kitmanDesignSystem is true it sets kitmanDesignSystem theme on the tooltip', async () => {
    render(<ActionTooltip {...props} kitmanDesignSystem />);

    await userEvent.click(screen.getByText('Show ActionTooltip'));
    expect(screen.getByRole('tooltip')).toHaveAttribute(
      'data-theme',
      'neutral-tooltip--kitmanDesignSystem'
    );
  });
});
