import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import MultiSelectDropdown from '../index';

describe('MultiSelectDropdown Component', () => {
  const mockOnItemSelect = jest.fn();
  const mockOnApply = jest.fn();
  const mockOnSelectAll = jest.fn();

  const baseProps = {
    onItemSelect: mockOnItemSelect,
    onApply: mockOnApply,
    onSelectAll: mockOnSelectAll,
    t: (x) => x,
    listItems: [],
    label: 'Label',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { container } = render(<MultiSelectDropdown {...baseProps} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders emptyText when the list of items is empty', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <MultiSelectDropdown {...baseProps} emptyText="The list is empty" />
    );
    const dropdown = container.querySelector('.dropdownWrapper__header');
    expect(dropdown).toBeInTheDocument();
    await user.click(dropdown);
    expect(screen.getByText('The list is empty')).toBeInTheDocument();
  });

  it('does not render select all if hasSelectAll but no items', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <MultiSelectDropdown {...baseProps} hasSelectAll />
    );
    const dropdown = container.querySelector('.dropdownWrapper__header');
    expect(dropdown).toBeInTheDocument();
    await user.click(dropdown);
    expect(
      container.querySelector('.multiSelectDropdown__selectAll')
    ).toBeNull();
  });

  describe('when items are passed', () => {
    const items = [
      { id: '1', name: 'One', isGroupOption: true },
      { id: '2', name: 'Two', description: 'Item 2' },
      { id: '3', name: 'Three' },
    ];

    const props = {
      ...baseProps,
      listItems: items,
    };

    it('renders correctly', async () => {
      const user = userEvent.setup();
      const { container } = render(<MultiSelectDropdown {...props} />);
      const dropdown = container.querySelector('.dropdownWrapper__header');
      expect(dropdown).toBeInTheDocument();
      await user.click(dropdown);
      expect(
        container.querySelectorAll('.multiSelectDropdown__item')
      ).toHaveLength(3);
    });

    it('renders the select all list item when passed hasSelectAll', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <MultiSelectDropdown {...props} hasSelectAll />
      );
      const dropdown = container.querySelector('.dropdownWrapper__header');
      expect(dropdown).toBeInTheDocument();
      await user.click(dropdown);
      expect(
        container.querySelectorAll('.multiSelectDropdown__selectAll')
      ).toHaveLength(1);
    });

    it('sets the selectAllType correctly when no items are selected', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <MultiSelectDropdown {...props} hasSelectAll selectedItems={[]} />
      );
      const dropdown = container.querySelector('.dropdownWrapper__header');
      expect(dropdown).toBeInTheDocument();
      await user.click(dropdown);
      expect(screen.getByText('Select All')).toBeInTheDocument();
    });

    it('sets the selectAllType correctly when some items are selected', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <MultiSelectDropdown {...props} hasSelectAll selectedItems={['1']} />
      );
      const dropdown = container.querySelector('.dropdownWrapper__header');
      expect(dropdown).toBeInTheDocument();
      await user.click(dropdown);
      expect(screen.getByText('Select All')).toBeInTheDocument();
    });

    it('sets the selectAllType correctly when all items are selected', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <MultiSelectDropdown
          {...props}
          hasSelectAll
          selectedItems={['1', '2', '3']}
        />
      );
      const dropdown = container.querySelector('.dropdownWrapper__header');
      expect(dropdown).toBeInTheDocument();
      await user.click(dropdown);
      expect(screen.getByText('Select All')).toBeInTheDocument();
    });

    it('sets the selectAllType correctly when all items are selected by select all', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <MultiSelectDropdown {...props} hasSelectAll />
      );
      const dropdown = container.querySelector('.dropdownWrapper__header');
      expect(dropdown).toBeInTheDocument();
      await user.click(dropdown);
      await user.click(screen.getByText('Select All'));
      expect(mockOnSelectAll).toHaveBeenCalledWith(items);
    });

    it('sends the correct filtered items down to the onSelectAll callback when clicked', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <MultiSelectDropdown
          {...props}
          hasSelectAll
          hasSearch
          onSelectAll={mockOnSelectAll}
        />
      );
      const dropdown = container.querySelector('.dropdownWrapper__header');
      expect(dropdown).toBeInTheDocument();
      await user.click(dropdown);
      const input = screen.getByRole('textbox');
      await fireEvent.change(input, { target: { value: 'On' } });
      await user.click(screen.getByText('Select All'));

      expect(mockOnSelectAll).toHaveBeenCalledWith([
        { id: '1', name: 'One', isGroupOption: true },
      ]);
    });

    it('renders a checkbox for each passed list item', async () => {
      const user = userEvent.setup();
      const { container } = render(<MultiSelectDropdown {...props} />);
      const dropdown = container.querySelector('.dropdownWrapper__header');
      expect(dropdown).toBeInTheDocument();
      await user.click(dropdown);
      expect(screen.getAllByRole('listitem')).toHaveLength(3);
    });

    it('shows the matching items when there are search results', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <MultiSelectDropdown {...props} hasSearch />
      );
      const dropdown = container.querySelector('.dropdownWrapper__header');
      expect(dropdown).toBeInTheDocument();
      await user.click(dropdown);
      const input = screen.getByRole('textbox');
      await fireEvent.change(input, { target: { value: 'On' } });
      expect(screen.getAllByRole('listitem')).toHaveLength(2);
      expect(screen.getByText('One')).toBeInTheDocument();
    });

    it('shows the matching items when mixed case is used', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <MultiSelectDropdown {...props} hasSearch />
      );
      const dropdown = container.querySelector('.dropdownWrapper__header');
      expect(dropdown).toBeInTheDocument();
      await user.click(dropdown);
      const input = screen.getByRole('textbox');
      await fireEvent.change(input, { target: { value: 'Three' } });
      expect(screen.getAllByRole('listitem')).toHaveLength(2);
      expect(screen.getByText('Three')).toBeInTheDocument();
    });

    it('shows the matching items when there are search results for an item description', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <MultiSelectDropdown {...props} hasSearch />
      );
      const dropdown = container.querySelector('.dropdownWrapper__header');
      expect(dropdown).toBeInTheDocument();
      await user.click(dropdown);
      const input = screen.getByRole('textbox');
      await fireEvent.change(input, { target: { value: 'Item 2' } });
      expect(screen.getAllByRole('listitem')).toHaveLength(2);
      expect(screen.getByText('Two')).toBeInTheDocument();
    });

    it('has the correct class when isGroupOption is true', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <MultiSelectDropdown {...props} hasSearch />
      );
      const dropdown = container.querySelector('.dropdownWrapper__header');
      expect(dropdown).toBeInTheDocument();
      await user.click(dropdown);
      const input = screen.getByRole('textbox');
      await fireEvent.change(input, { target: { value: 'One' } });
      const itemsEls = container.querySelectorAll(
        '.multiSelectDropdown__item--bold'
      );
      expect(itemsEls).toHaveLength(1);
    });

    it('shows a no results message when no search results', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <MultiSelectDropdown {...props} hasSearch />
      );
      const dropdown = container.querySelector('.dropdownWrapper__header');
      expect(dropdown).toBeInTheDocument();
      await user.click(dropdown);
      const input = screen.getByRole('textbox');
      await fireEvent.change(input, { target: { value: 'Hello' } });
      expect(screen.getByText(/Nothing found for/i)).toBeInTheDocument();
    });

    it('sets the title correctly when no items are selected onApply', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <MultiSelectDropdown {...props} hasApply selectedItems={[]} />
      );
      const dropdown = container.querySelector('.dropdownWrapper__header');
      expect(dropdown).toBeInTheDocument();
      await user.click(dropdown);
      await user.click(screen.getByRole('button', { name: /apply/i }));
      expect(mockOnApply).toHaveBeenCalled();
    });

    it('sets the title correctly when one item is selected onApply', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <MultiSelectDropdown {...props} hasApply selectedItems={['1']} />
      );
      const dropdown = container.querySelector('.dropdownWrapper__header');
      expect(dropdown).toBeInTheDocument();
      await user.click(dropdown);
      await user.click(screen.getByRole('button', { name: /apply/i }));
      expect(mockOnApply).toHaveBeenCalled();
    });

    it('sets the title correctly when multiple items are selected onApply', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <MultiSelectDropdown
          {...props}
          hasApply
          selectedItems={['1', '2', '3']}
        />
      );
      const dropdown = container.querySelector('.dropdownWrapper__header');
      expect(dropdown).toBeInTheDocument();
      await user.click(dropdown);
      await user.click(screen.getByRole('button', { name: /apply/i }));
      expect(mockOnApply).toHaveBeenCalled();
    });

    it('renders an invalid state when invalid is true', async () => {
      const user = userEvent.setup();
      const { container } = render(<MultiSelectDropdown {...props} invalid />);
      const dropdown = container.querySelector('.dropdownWrapper__header');
      expect(dropdown).toBeInTheDocument();
      await user.click(dropdown);
      expect(
        container.querySelector('.dropdownWrapper--invalid')
      ).toBeInTheDocument();
    });

    it('disables disabled items', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <MultiSelectDropdown {...props} disabledItems={['1', '3']} />
      );
      const dropdown = container.querySelector('.dropdownWrapper__header');
      expect(dropdown).toBeInTheDocument();
      await user.click(dropdown);
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes[0]).toHaveAttribute('aria-disabled', 'true');
      expect(checkboxes[1]).toHaveAttribute('aria-disabled', 'false');
      expect(checkboxes[2]).toHaveAttribute('aria-disabled', 'true');
    });

    it('renders dropdownTitle if dropdownTitle exists', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <MultiSelectDropdown {...props} dropdownTitle="custom title" />
      );
      const dropdown = container.querySelector('.dropdownWrapper__header');
      expect(dropdown).toBeInTheDocument();
      await user.click(dropdown);
      expect(screen.getByText('custom title')).toBeInTheDocument();
    });
  });

  it('calls onItemSelect when selecting an item', async () => {
    const items = [
      { id: 1, name: 'item 1' },
      { id: 2, name: 'item 2' },
    ];
    const user = userEvent.setup();
    const { container } = render(
      <MultiSelectDropdown
        {...baseProps}
        selectedItems={[1]}
        listItems={items}
      />
    );
    const dropdown = container.querySelector('.dropdownWrapper__header');
    expect(dropdown).toBeInTheDocument();
    await user.click(dropdown);
    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[1], { target: { checked: true } });
    expect(mockOnItemSelect).toHaveBeenCalled();
  });

  it('calls onItemSelect when unselecting an item', async () => {
    const items = [
      { id: 1, name: 'item 1' },
      { id: 2, name: 'item 2' },
    ];
    const user = userEvent.setup();
    const { container } = render(
      <MultiSelectDropdown
        {...baseProps}
        selectedItems={[1]}
        listItems={items}
      />
    );
    const dropdown = container.querySelector('.dropdownWrapper__header');
    expect(dropdown).toBeInTheDocument();
    await user.click(dropdown);
    const firstCheckbox = screen.getAllByRole('checkbox')[0];
    await user.click(firstCheckbox);
    expect(firstCheckbox).toBeChecked();
  });
});
