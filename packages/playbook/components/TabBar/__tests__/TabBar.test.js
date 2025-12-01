import { screen } from '@testing-library/react';
import { renderWithUserEventSetup } from '@kitman/common/src/utils/test_utils';
import TabBar from '@kitman/playbook/components/TabBar';

const mockOnChange = jest.fn();

const mockTabs = [
  {
    tabKey: 'tab1',
    tabHash: '#tab1',
    title: 'Tab 1',
    content: <>Tab 1 content</>,
  },
  {
    tabKey: 'tab2',
    tabHash: '#tab2',
    title: 'Tab 2',
    content: <>Tab 2 content</>,
  },
];

const defaultProps = {
  value: '#tab1',
  tabs: mockTabs,
  onChange: mockOnChange,
  customStyles: {},
};

const renderComponent = (props = defaultProps) =>
  renderWithUserEventSetup(<TabBar {...props} />);

describe('TabBar', () => {
  it('should render correctly', () => {
    renderComponent();

    mockTabs.forEach((mockTab) => {
      expect(
        screen.getByRole('tab', { name: mockTab.title })
      ).toBeInTheDocument();
    });

    expect(
      screen.getByText(`${mockTabs[0].title} content`)
    ).toBeInTheDocument();
  });

  it('should call onChange correctly', async () => {
    const { user } = renderComponent();

    await user.click(screen.getByRole('tab', { name: `${mockTabs[1].title}` }));

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(mockTabs[1].tabHash);
  });
});
