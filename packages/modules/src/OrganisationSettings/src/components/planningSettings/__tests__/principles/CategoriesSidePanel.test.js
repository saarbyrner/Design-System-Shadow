import { render, screen, within, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import CategoriesSidePanel from '../../principles/CategoriesSidePanel';
import { mockCategories } from '../../utils/mocks';

describe('<CategoriesSidePanel />', () => {
  let user;
  let baseProps;

  beforeEach(() => {
    user = userEvent.setup();
    baseProps = {
      isOpen: true,
      categories: mockCategories,
      isValidationCheckAllowed: false,
      isSavingAllowed: false,
      onClose: jest.fn(),
      onSave: jest.fn(),
      onAdd: jest.fn(),
      onEdit: jest.fn(),
      onDelete: jest.fn(),
      t: i18nextTranslateStub(),
    };
  });

  it('renders the title and the list of categories correctly', () => {
    render(<CategoriesSidePanel {...baseProps} />);

    // Check for the panel title
    expect(screen.getByText('Category')).toBeInTheDocument();

    // Check that the category inputs are rendered with the correct values
    expect(
      screen.getByDisplayValue('Recovery and Regeneration')
    ).toBeInTheDocument();
    expect(
      screen.getByDisplayValue('Blocking + 1 v 1 Situations')
    ).toBeInTheDocument();
  });

  it('renders the add categories button', () => {
    render(<CategoriesSidePanel {...baseProps} />);
    expect(
      screen.getByRole('button', { name: 'Add categories' })
    ).toBeInTheDocument();
  });

  it('calls the onAdd callback when the add button is clicked', async () => {
    render(<CategoriesSidePanel {...baseProps} />);
    const addButton = screen.getByRole('button', { name: 'Add categories' });
    await user.click(addButton);
    expect(baseProps.onAdd).toHaveBeenCalledTimes(1);
  });

  it('calls the onClose callback when the cancel button is clicked', async () => {
    render(<CategoriesSidePanel {...baseProps} />);
    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    await user.click(cancelButton);
    expect(baseProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls the onSave callback when the save button is clicked', async () => {
    render(<CategoriesSidePanel {...baseProps} isSavingAllowed />);
    const saveButton = screen.getByRole('button', { name: 'Save' });

    await user.click(saveButton);

    expect(baseProps.onSave).toHaveBeenCalledTimes(1);
  });

  it('disables the save button when isSavingAllowed is false', () => {
    render(<CategoriesSidePanel {...baseProps} isSavingAllowed={false} />);
    const saveButton = screen.getByRole('button', { name: 'Save' });
    expect(saveButton).toBeDisabled();
  });

  it('enables the save button when isSavingAllowed is true', () => {
    render(<CategoriesSidePanel {...baseProps} isSavingAllowed />);
    const saveButton = screen.getByRole('button', { name: 'Save' });
    expect(saveButton).toBeEnabled();
  });

  it('calls the onEdit callback when a category name is changed', async () => {
    render(<CategoriesSidePanel {...baseProps} />);
    const firstCategoryInput = screen.getByDisplayValue(
      'Recovery and Regeneration'
    );

    await fireEvent.change(firstCategoryInput, {
      target: { value: 'New Category Name' },
    });
    // The component calls onEdit with the category ID and the new value
    expect(baseProps.onEdit).toHaveBeenCalledWith(1, 'New Category Name');
  });

  it('calls the onDelete callback when a delete button is clicked', async () => {
    render(<CategoriesSidePanel {...baseProps} />);
    // Find the list item for the first category to scope the search for the delete button
    const firstCategoryItem = screen
      .getByDisplayValue('Recovery and Regeneration')
      .closest('li');

    // Find the delete button within that list item
    const deleteButton = within(firstCategoryItem).getByRole('button');
    await user.click(deleteButton);

    expect(baseProps.onDelete).toHaveBeenCalledTimes(1);
    expect(baseProps.onDelete).toHaveBeenCalledWith(1); // The ID of the first category
  });
});
