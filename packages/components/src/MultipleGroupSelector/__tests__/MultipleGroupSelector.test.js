import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MultipleGroupSelector from '..';

const testGroupItems = [
  {
    id: 'g1',
    name: 'Group A',
    subItems: [
      { id: 'Sub1', name: 'Sub Item 1 A' },
      { id: 'Sub2', name: 'Sub Item 2 A' },
    ],
  },
  {
    id: 'g2',
    name: 'Group B',
    subItems: [
      { id: 'Sub1', name: 'Sub Item 1 B' },
      { id: 'Sub2', name: 'Sub Item 2 B' },
      { id: 'Sub3', name: 'Sub Item 3 B' },
    ],
  },
];

const testSelection = {
  g2: ['Sub2', 'Sub3'],
};

const renderComponent = (props = {}) => {
  const onUpdatedSelection = jest.fn();
  const t = (x) => x;
  const utils = render(
    <MultipleGroupSelector
      t={t}
      groupItems={testGroupItems}
      activeSelections={testSelection}
      onUpdatedSelection={onUpdatedSelection}
      {...props}
    />
  );
  return { ...utils, onUpdatedSelection };
};

describe('<MultipleGroupSelector />', () => {
  it('renders group names and sub-items', async () => {
    const user = userEvent.setup();
    const { container } = renderComponent();
    const header = container.querySelector('.dropdownWrapper__header');
    expect(header).toBeInTheDocument();

    await user.click(header);

    expect(screen.getByText('Group A')).toBeInTheDocument();
    expect(screen.getByText('Group B')).toBeInTheDocument();

    expect(screen.getByLabelText('Sub Item 1 A')).toBeInTheDocument();
    expect(screen.getByLabelText('Sub Item 2 A')).toBeInTheDocument();
    expect(screen.getByLabelText('Sub Item 1 B')).toBeInTheDocument();
    expect(screen.getByLabelText('Sub Item 2 B')).toBeInTheDocument();
    expect(screen.getByLabelText('Sub Item 3 B')).toBeInTheDocument();
  });

  it('renders dropdown label if provided', () => {
    renderComponent({ label: 'My Dropdown' });
    expect(screen.getByText('My Dropdown')).toBeInTheDocument();
  });

  it('renders correct selected items as dropdown title', () => {
    renderComponent();
    expect(screen.getByText('Sub Item 2 B, Sub Item 3 B')).toBeInTheDocument();
  });

  describe('interaction tests', () => {
    it('calls onUpdatedSelection when toggling a sub-item checkbox', async () => {
      const user = userEvent.setup();
      const { container, onUpdatedSelection } = renderComponent({
        activeSelections: {
          g1: ['Sub1', 'Sub2'],
          g2: ['Sub2', 'Sub3'],
        },
      });
      const header = container.querySelector('.dropdownWrapper__header');
      expect(header).toBeInTheDocument();

      await user.click(header);

      const checkbox = screen.getByLabelText('Sub Item 1 A');
      expect(checkbox).toBeChecked();

      await user.click(checkbox);

      expect(onUpdatedSelection).toHaveBeenCalledWith({
        g1: ['Sub2'],
        g2: ['Sub2', 'Sub3'],
      });
    });

    it('calls onUpdatedSelection with new group when toggling an unchecked sub-item', async () => {
      const user = userEvent.setup();
      const { container, onUpdatedSelection } = renderComponent({
        activeSelections: {},
      });
      const header = container.querySelector('.dropdownWrapper__header');
      expect(header).toBeInTheDocument();
      await user.click(header);

      const checkbox = screen.getByLabelText('Sub Item 1 A');
      expect(checkbox).not.toBeChecked();

      await user.click(checkbox);

      expect(onUpdatedSelection).toHaveBeenCalledWith({
        g1: ['Sub1'],
      });
    });

    it('clears all sub-items when "Clear" is clicked', async () => {
      const user = userEvent.setup();
      const { container, onUpdatedSelection } = renderComponent({
        activeSelections: {
          g1: ['Sub1', 'Sub2'],
          g2: ['Sub2', 'Sub3'],
        },
      });
      const header = container.querySelector('.dropdownWrapper__header');
      expect(header).toBeInTheDocument();
      await user.click(header);

      const clearButtons = screen.getAllByText('Clear');
      await user.click(clearButtons[1]);

      expect(onUpdatedSelection).toHaveBeenCalledWith({
        g1: ['Sub1', 'Sub2'],
      });
    });
  });

  describe('when no selections are made', () => {
    it('calls onUpdatedSelection with empty object when clicking Clear', async () => {
      const user = userEvent.setup();
      const { container, onUpdatedSelection } = renderComponent({
        activeSelections: {},
      });
      const header = container.querySelector('.dropdownWrapper__header');
      expect(header).toBeInTheDocument();
      await user.click(header);

      const clearAllButtons = screen.getAllByText('Clear');
      await user.click(clearAllButtons[0]);

      expect(onUpdatedSelection).toHaveBeenCalledWith({});
    });
  });

  it('does not render dropdown button when showDropdownButton is false', () => {
    renderComponent({ showDropdownButton: false });
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
