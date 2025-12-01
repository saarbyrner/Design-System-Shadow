import { render, screen } from '@testing-library/react';
import WidgetCard from '..';

describe('Dashboard|<WidgetCard />', () => {
  it('renders widget card with children', () => {
    render(<WidgetCard>This is my widget</WidgetCard>);
    expect(screen.queryByText('This is my widget')).toBeVisible();
  });

  it('render icon icon-more', () => {
    const { container } = render(
      <WidgetCard>
        <WidgetCard.MenuIcon />
      </WidgetCard>
    );
    const iconElement = container.querySelector('.icon-more');
    expect(iconElement).toBeInTheDocument();
  });

  describe('when rep-dashboard-ui-upgrade FF is on', () => {
    beforeEach(() => {
      window.setFlag('rep-dashboard-ui-upgrade', true);
    });
    afterEach(() => {
      window.setFlag('rep-dashboard-ui-upgrade', false);
    });

    it('renders icon icon-hamburger-circled-dots', () => {
      const { container } = render(
        <WidgetCard>
          <WidgetCard.MenuIcon />
        </WidgetCard>
      );
      const iconElement = container.querySelector(
        '.icon-hamburger-circled-dots'
      );
      expect(iconElement).toBeInTheDocument();
    });
  });
});
