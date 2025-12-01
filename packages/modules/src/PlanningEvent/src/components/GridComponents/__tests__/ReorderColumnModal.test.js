import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import ReorderColumnModal from '../ReorderColumnModal';

describe('ReorderColumnModal component', () => {
  const mockOnSave = jest.fn();
  const mockSetIsModalOpen = jest.fn();

  const props = {
    columnItems: [
      {
        id: 8849,
        name: 'Test 1',
      },
      {
        id: 830,
        name: 'Test 2',
      },
      {
        id: 6623,
        name: 'Test 3',
      },
    ],
    isOpen: true,
    onSave: mockOnSave,
    setIsModalOpen: mockSetIsModalOpen,
    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly when open', () => {
    render(<ReorderColumnModal {...props} />);

    expect(screen.getByText('Reorder')).toBeInTheDocument();
    expect(
      screen.getByTestId('reorderColumnModal__saveButton')
    ).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<ReorderColumnModal {...props} isOpen={false} />);

    expect(screen.queryByText('Reorder')).not.toBeInTheDocument();
  });

  it('displays the items list with the correct names', () => {
    render(<ReorderColumnModal {...props} />);

    expect(screen.getByText('Test 1')).toBeInTheDocument();
    expect(screen.getByText('Test 2')).toBeInTheDocument();
    expect(screen.getByText('Test 3')).toBeInTheDocument();
  });

  it('displays reorder icons for each item', () => {
    render(<ReorderColumnModal {...props} />);

    // The reorder icons should be present (as span elements with the icon class)
    const reorderIcons = document.querySelectorAll('.icon-reorder-vertical');
    expect(reorderIcons).toHaveLength(3);
  });

  it('calls onSave with the original order when save is clicked without reordering', async () => {
    const user = userEvent.setup();
    render(<ReorderColumnModal {...props} />);

    // Click Save button
    const saveButton = screen.getByTestId('reorderColumnModal__saveButton');
    await user.click(saveButton);

    // Should call onSave with the original order
    expect(mockOnSave).toHaveBeenCalledWith([8849, 830, 6623]);
  });

  it('calls setIsModalOpen when save is clicked', async () => {
    const user = userEvent.setup();
    render(<ReorderColumnModal {...props} />);

    // Click Save button
    const saveButton = screen.getByTestId('reorderColumnModal__saveButton');
    await user.click(saveButton);

    // Should call setIsModalOpen with false
    expect(mockSetIsModalOpen).toHaveBeenCalledWith(false);
  });

  it('maintains the list structure for drag and drop functionality', () => {
    render(<ReorderColumnModal {...props} />);

    // The sortable list should be rendered with the correct structure
    const listContainer = document.querySelector('.reorderColumnModal__items');
    expect(listContainer).toBeInTheDocument();

    // Should have a ul element for the sortable list
    const listElement = listContainer.querySelector('ul');
    expect(listElement).toBeInTheDocument();

    // Should have list items for each column item
    const listItems = listElement.querySelectorAll('li');
    expect(listItems).toHaveLength(3);
  });

  it('renders items with the correct CSS classes for drag and drop', () => {
    render(<ReorderColumnModal {...props} />);

    // Each list item should have the reorderColumnModal__item class
    const listItems = document.querySelectorAll('.reorderColumnModal__item');
    expect(listItems).toHaveLength(3);

    // Each item should contain the reorder icon and text
    listItems.forEach((item, index) => {
      expect(item.querySelector('.icon-reorder-vertical')).toBeInTheDocument();
      expect(item).toHaveTextContent(props.columnItems[index].name);
    });
  });
});
