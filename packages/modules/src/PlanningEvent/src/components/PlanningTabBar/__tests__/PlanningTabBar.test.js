import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PlanningTabBar } from '../index';

describe('<PlanningTabBar/>', () => {
  const props = {
    tabPanes: [
      {
        title: 'Appearance',
        content: <div>appearance tab content</div>,
      },
      {
        title: 'Workload',
        content: <div>workload tab content</div>,
      },
    ],
    onClickTab: jest.fn(),
    activeTabKey: '0',
    setActiveTabKey: jest.fn(),
    hasUnsavedChanges: false,
    selectedTab: '0',
    setSelectedTab: jest.fn(),
    setShowPrompt: jest.fn(),
    isPromptConfirmed: false,
    setIsPromptConfirmed: jest.fn(),
  };

  it('renders the component', () => {
    render(<PlanningTabBar {...props} />);
    expect(screen.getAllByRole('tablist')[0]).toBeInTheDocument();
  });

  it('renders the first tab by default', () => {
    render(<PlanningTabBar {...props} />);
    expect(
      screen.getAllByRole('tablist')[0].querySelectorAll('.rc-tabs-tab')[0]
    ).toHaveClass('rc-tabs-tab');
  });

  it('renders props.initialTab tab at the first render when provided', async () => {
    render(<PlanningTabBar {...props} initialTab="1" />);
    expect(
      screen.getAllByRole('tablist')[0].querySelectorAll('.rc-tabs-tab')[1]
    ).toHaveClass('rc-tabs-tab');
  });

  it('renders the correct tabpanes', () => {
    render(<PlanningTabBar {...props} />);
    expect(
      screen.getAllByRole('tablist')[1].querySelectorAll('.rc-tabs-tab')
    ).toHaveLength(2);
  });

  it('calls onClickTab when clicking a tab', async () => {
    render(<PlanningTabBar {...props} />);

    await userEvent.click(
      screen.getAllByRole('tablist')[1].querySelectorAll('.rc-tabs-tab')[1]
    );
    expect(props.onClickTab).toHaveBeenCalledTimes(1);
  });
});
