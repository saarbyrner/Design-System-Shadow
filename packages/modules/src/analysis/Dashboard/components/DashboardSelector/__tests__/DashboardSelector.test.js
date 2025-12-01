// import { render, screen, fireEvent } from '@testing-library/react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';
import DashboardSelector from '..';

jest.mock('@kitman/common/src/hooks/useLocationAssign', () => jest.fn());

describe('<DashboardSelector /> component', () => {
  beforeEach(() => {
    window.featureFlags = {};
  });

  const mockLocationAssign = jest.fn();

  const defaultProps = {
    dashboardList: [
      {
        id: '12',
        name: 'Dashboard Name 12',
      },
      {
        id: '4',
        name: 'Dashboard Name',
      },
      {
        id: '1',
        name: 'Dashboard Name 1',
      },
      {
        id: '25',
        name: 'Dashboard Name 25',
      },
      {
        id: '5',
        name: 'Other Dashboard Name',
      },
    ],
    selectedDashboard: {
      id: '4',
      name: 'Selected Dashboard',
    },
  };

  const renderComponent = (props = defaultProps) =>
    render(<DashboardSelector {...props} />);

  describe('with FF [feature-flag: rep-analytical-dashboard-search-bar] off', () => {
    beforeEach(() => {
      window.featureFlags = { 'rep-analytical-dashboard-search-bar': false };
    });

    it('renders the dashboard title', () => {
      const { container } = renderComponent();

      const dashboardTitle = container.querySelector(
        '.analyticalDashboard__title'
      );
      const dashboardTitleText =
        within(dashboardTitle).getByText('Selected Dashboard');
      expect(dashboardTitle).toBeInTheDocument();
      expect(dashboardTitleText).toBeInTheDocument();
    });

    describe('when the user clicks the title', () => {
      it('renders a tooltip with a list of links to other dashboards', async () => {
        const { container } = renderComponent();
        const dashboardTitle = container.querySelector(
          '.analyticalDashboard__title'
        );

        // The tooltip is hidden first
        const toolTipMenuListItem = container.querySelector(
          '.tooltipMenu__listItem'
        );
        expect(toolTipMenuListItem).not.toBeInTheDocument();

        // Open the tooltip and get the links from the tooltip
        await userEvent.click(dashboardTitle);
        const dashboardLinks = await screen.findAllByText('Dashboard Name', {
          exact: false,
        });
        expect(dashboardLinks.length).toEqual(5);

        // First Menu Item
        const firstMenuItem = dashboardLinks.at(0);
        const firstMenuItemLink = screen
          .getByText('Dashboard Name')
          .closest('.tooltipMenu__item');

        expect(firstMenuItem).toHaveTextContent('Dashboard Name');
        expect(firstMenuItemLink).toHaveClass('tooltipMenu__item');
        expect(firstMenuItemLink).toHaveClass('tooltipMenu__item--active');
        expect(firstMenuItemLink).toHaveAttribute(
          'href',
          '/analysis/dashboard/4'
        );

        // Second Menu Item
        const secondMenuItem = dashboardLinks.at(1);
        const secondMenuItemLink = screen
          .getByText('Dashboard Name 1')
          .closest('.tooltipMenu__item');

        expect(secondMenuItem).toHaveTextContent('Dashboard Name 1');
        expect(secondMenuItemLink).toHaveClass('tooltipMenu__item');
        expect(secondMenuItemLink).not.toHaveClass('tooltipMenu__item--active');
        expect(secondMenuItemLink).toHaveAttribute(
          'href',
          '/analysis/dashboard/1'
        );

        // Third Menu Item
        const thirdMenuItem = dashboardLinks.at(2);
        const thirdMenuItemLink = screen
          .getByText('Dashboard Name 12')
          .closest('.tooltipMenu__item');

        expect(thirdMenuItem).toHaveTextContent('Dashboard Name 12');
        expect(thirdMenuItemLink).toHaveClass('tooltipMenu__item');
        expect(thirdMenuItemLink).not.toHaveClass('tooltipMenu__item--active');
        expect(thirdMenuItemLink).toHaveAttribute(
          'href',
          '/analysis/dashboard/12'
        );

        // Fourth Menu Item
        const fourthMenuItem = dashboardLinks.at(3);
        const fourthMenuItemLink = screen
          .getByText('Dashboard Name 25')
          .closest('.tooltipMenu__item');

        expect(fourthMenuItem).toHaveTextContent('Dashboard Name 25');
        expect(fourthMenuItemLink).toHaveClass('tooltipMenu__item');
        expect(fourthMenuItemLink).not.toHaveClass('tooltipMenu__item--active');
        expect(fourthMenuItemLink).toHaveAttribute(
          'href',
          '/analysis/dashboard/25'
        );

        // Fifth Menu Item
        const fifthMenuItem = dashboardLinks.at(4);
        const fifthMenuItemLink = screen
          .getByText('Other Dashboard Name')
          .closest('.tooltipMenu__item');

        expect(fifthMenuItem).toHaveTextContent('Other Dashboard Name');
        expect(fifthMenuItemLink).toHaveClass('tooltipMenu__item');
        expect(fifthMenuItemLink).not.toHaveClass('tooltipMenu__item--active');
        expect(fifthMenuItemLink).toHaveAttribute(
          'href',
          '/analysis/dashboard/5'
        );
      });
    });
  });

  describe('with FF [feature-flag: rep-analytical-dashboard-search-bar] on', () => {
    beforeEach(() => {
      window.featureFlags = { 'rep-analytical-dashboard-search-bar': true };
    });

    it('renders the dashboard title', () => {
      const { container } = renderComponent();

      const dashboardTitle = container.querySelector(
        '.analyticalDashboard__title'
      );
      const dashboardTitleText =
        within(dashboardTitle).getByText('Selected Dashboard');
      expect(dashboardTitle).toBeInTheDocument();
      expect(dashboardTitleText).toBeInTheDocument();
    });

    describe('when the user clicks the title', () => {
      it('renders a tooltip with a list of links to other dashboards', async () => {
        const { container } = renderComponent();
        const dashboardTitle = container.querySelector(
          '.analyticalDashboard__title'
        );

        // The tooltip is hidden first
        const toolTipMenuListItem = container.querySelector(
          '.kitmanReactSelect__menu'
        );
        expect(toolTipMenuListItem).not.toBeInTheDocument();

        // Open the tooltip and get the links from the tooltip
        await userEvent.click(dashboardTitle);
        const dashboardLinks = await screen.findAllByText('Dashboard Name', {
          exact: false,
        });
        expect(dashboardLinks.length).toEqual(6);

        // First Menu Item
        const firstMenuItem = dashboardLinks.at(1);
        expect(firstMenuItem).toHaveTextContent('Dashboard Name');
        expect(firstMenuItem).toHaveClass('kitmanReactSelect__option');

        // Second Menu Item
        const secondMenuItem = dashboardLinks.at(2);
        expect(secondMenuItem).toHaveTextContent('Dashboard Name 1');
        expect(secondMenuItem).toHaveClass('kitmanReactSelect__option');

        // Third Menu Item
        const thirdMenuItem = dashboardLinks.at(3);
        expect(thirdMenuItem).toHaveTextContent('Dashboard Name 12');
        expect(thirdMenuItem).toHaveClass('kitmanReactSelect__option');

        // Fourth Menu Item
        const fourthMenuItem = dashboardLinks.at(4);
        expect(fourthMenuItem).toHaveTextContent('Dashboard Name 25');
        expect(fourthMenuItem).toHaveClass('kitmanReactSelect__option');

        // Fifth Menu Item
        const fifthMenuItem = dashboardLinks.at(5);
        expect(fifthMenuItem).toHaveTextContent('Other Dashboard Name');
        expect(fifthMenuItem).toHaveClass('kitmanReactSelect__option');
      });

      it('renders a tooltip and the title does not have the default blue border (box shadow)', async () => {
        const { container } = renderComponent();
        const dashboardTitleControl = container.querySelector(
          '.kitmanReactSelect__control'
        );

        // Click on the Dashboard Title Control and check the CSS
        await userEvent.click(dashboardTitleControl);
        const dashboardTitleControlStyle = window.getComputedStyle(
          dashboardTitleControl
        );
        expect(dashboardTitleControlStyle.boxShadow).toBe('none');
      });
    });

    describe('when the user clicks a dropdown menu item', () => {
      beforeEach(() => {
        useLocationAssign.mockReturnValue(mockLocationAssign);
      });

      it('calls the useLocationAssign() function', async () => {
        const { container } = renderComponent();
        const dashboardTitle = container.querySelector(
          '.analyticalDashboard__title'
        );

        // Open the tooltip and get the links from the tooltip
        await userEvent.click(dashboardTitle);
        const dashboardLinks = await screen.findAllByText('Dashboard Name', {
          exact: false,
        });

        // First Menu Item
        const firstMenuItem = dashboardLinks.at(4);
        expect(firstMenuItem).toHaveTextContent('Dashboard Name');
        expect(firstMenuItem).toHaveClass('kitmanReactSelect__option');

        // Click on the menu item
        await userEvent.click(firstMenuItem);
        expect(mockLocationAssign).toHaveBeenCalledTimes(1);
        expect(mockLocationAssign).toHaveBeenCalledWith(
          '/analysis/dashboard/25'
        );
      });
    });
  });

  afterAll(() => {
    window.featureFlags = {};
  });
});
