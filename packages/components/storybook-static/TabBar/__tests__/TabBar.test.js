import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import TabBar from '..';

describe('<TabBar />', () => {
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
    t: i18nextTranslateStub(),
  };

  it('renders the component', () => {
    render(<TabBar {...props} />);
    expect(screen.getAllByRole('tablist')[0]).toBeInTheDocument();
  });

  it('renders the first tab by default', () => {
    render(<TabBar {...props} />);
    expect(
      screen.getAllByRole('tablist')[0].querySelectorAll('.rc-tabs-tab')[0]
    ).toHaveClass('rc-tabs-tab-active');
  });

  it('renders a tab with index equal to `initialTab` at the first render when provided', () => {
    render(<TabBar {...props} initialTab="1" />);
    expect(
      screen.getAllByRole('tablist')[0].querySelectorAll('.rc-tabs-tab')[1]
    ).toHaveClass('rc-tabs-tab-active');
  });

  it('renders a tab with index equal to `activeTabIndex`', () => {
    render(<TabBar {...props} activeTabIndex="1" />);
    expect(
      screen.getAllByRole('tablist')[0].querySelectorAll('.rc-tabs-tab')[1]
    ).toHaveClass('rc-tabs-tab-active');
  });

  it('renders tabpanes correctly', () => {
    render(<TabBar {...props} />);
    expect(
      screen.getAllByRole('tablist')[1].querySelectorAll('.rc-tabs-tab')
    ).toHaveLength(2);
  });

  it('calls `onClickTab` when clicking a tab', async () => {
    const user = userEvent.setup();
    render(<TabBar {...props} />);

    await user.click(
      screen.getAllByRole('tablist')[1].querySelectorAll('.rc-tabs-tab')[1]
    );
    expect(props.onClickTab).toHaveBeenCalledTimes(1);
  });
});
