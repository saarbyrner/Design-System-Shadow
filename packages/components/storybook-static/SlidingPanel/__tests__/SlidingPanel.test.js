import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SlidingPanel from '../index';

describe('SlidingPanel Component', () => {
  describe('with default props', () => {
    it('renders the correct default state', () => {
      const { container } = render(<SlidingPanel />);
      expect(
        container.getElementsByClassName('slidingPanel__right')
      ).toHaveLength(1);
      expect(
        container.getElementsByClassName('slidingPanel__right--closed')
      ).toHaveLength(1);
    });
  });

  it('renders a title if one is passed', () => {
    render(<SlidingPanel title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('has the correct class if passed align={"left"}', () => {
    const { container } = render(<SlidingPanel align="left" />);
    expect(
      container.getElementsByClassName('slidingPanel__right')
    ).toHaveLength(0);
    expect(container.getElementsByClassName('slidingPanel__left')).toHaveLength(
      1
    );
  });

  it('has the correct class if left aligned and closed', () => {
    const { container } = render(<SlidingPanel align="left" isOpen={false} />);
    expect(container.getElementsByClassName('slidingPanel__left')).toHaveLength(
      1
    );
    expect(
      container.getElementsByClassName('slidingPanel__left--closed')
    ).toHaveLength(1);
  });

  it('renders correctly if passed children props', () => {
    render(
      <SlidingPanel align="right" isOpen>
        <h3 className="childComponent">Hello this is a test</h3>
      </SlidingPanel>
    );
    expect(
      screen.getByRole('heading', { level: 3, name: 'Hello this is a test' })
    ).toBeInTheDocument();
  });

  it('the SlidingPanel closes it by utilizing useClickToClose prop', async () => {
    const togglePanel = jest.fn();
    render(
      <div>
        <div data-testid="outside-element" />
        <SlidingPanel
          align="right"
          isOpen
          togglePanel={togglePanel}
          useClickToClose
        >
          <h3 className="childComponent">Hello this is a test</h3>
        </SlidingPanel>
      </div>
    );

    await userEvent.click(screen.getByTestId('outside-element'));

    expect(togglePanel).toHaveBeenCalledTimes(1);
  });

  it('the SlidingPanel will not close on clickOutside by default', async () => {
    const togglePanel = jest.fn();
    render(
      <div>
        <div data-testid="outside-element" />
        <SlidingPanel align="right" isOpen togglePanel={togglePanel}>
          <h3 className="childComponent">Hello this is a test</h3>
        </SlidingPanel>
      </div>
    );

    await userEvent.click(screen.getByTestId('outside-element'));

    expect(togglePanel).not.toHaveBeenCalled();
  });
});
