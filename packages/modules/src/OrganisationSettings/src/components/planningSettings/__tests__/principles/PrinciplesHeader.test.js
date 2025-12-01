import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import PrinciplesHeader from '../../principles/PrinciplesHeader';

describe('<PrinciplesHeader />', () => {
  let user;
  let baseProps;

  beforeEach(() => {
    user = userEvent.setup();
    baseProps = {
      isSavingAllowed: false,
      onCreatePrinciple: jest.fn(),
      onSavePrinciples: jest.fn(),
      onCancelEdit: jest.fn(),
      showCategoriesSidePanel: jest.fn(),
      onChangeView: jest.fn(),
      t: i18nextTranslateStub(),
    };
  });

  it('displays the correct title', () => {
    render(<PrinciplesHeader {...baseProps} />);
    expect(
      screen.getByRole('heading', { name: 'Principles' })
    ).toBeInTheDocument();
  });

  it('displays the "Manage categories" button and calls the correct callback when clicked', async () => {
    render(<PrinciplesHeader {...baseProps} view="PRESENTATION" />);
    const manageCategoriesButton = screen.getByRole('button', {
      name: 'Manage categories',
    });

    expect(manageCategoriesButton).toBeInTheDocument();

    await user.click(manageCategoriesButton);
    expect(baseProps.showCategoriesSidePanel).toHaveBeenCalledTimes(1);
  });

  describe('when view is PRESENTATION', () => {
    beforeEach(() => {
      render(<PrinciplesHeader {...baseProps} view="PRESENTATION" />);
    });

    it('displays the "Add principle" and "Edit values" buttons', () => {
      expect(
        screen.getByRole('button', { name: 'Add principle' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Edit values' })
      ).toBeInTheDocument();
    });

    it('calls onCreatePrinciple when the "Add principle" button is clicked', async () => {
      const addButton = screen.getByRole('button', { name: 'Add principle' });

      await user.click(addButton);

      expect(baseProps.onCreatePrinciple).toHaveBeenCalledTimes(1);
    });

    it('calls onChangeView with "EDIT" when the "Edit values" button is clicked', async () => {
      const editButton = screen.getByRole('button', { name: 'Edit values' });

      await user.click(editButton);

      expect(baseProps.onChangeView).toHaveBeenCalledWith('EDIT');
    });
  });

  describe('when view is EDIT', () => {
    beforeEach(() => {
      render(<PrinciplesHeader {...baseProps} view="EDIT" />);
    });

    it('displays the "Save" and "Cancel" buttons', () => {
      expect(screen.getByText('Save')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    it('disables the "Save" button when isSavingAllowed is false', () => {
      const saveButton = screen.getByText('Save').closest('button');

      expect(saveButton).toBeDisabled();
    });

    it('enables the "Save" button when isSavingAllowed is true', () => {
      // Re-render with the prop changed
      render(<PrinciplesHeader {...baseProps} view="EDIT" isSavingAllowed />);

      const saveButton = screen.getAllByText('Save')[1];

      expect(saveButton).toBeEnabled();
    });

    it('calls onSavePrinciples when the "Save" button is clicked', async () => {
      // Re-render with save enabled to allow click
      render(<PrinciplesHeader {...baseProps} view="EDIT" isSavingAllowed />);

      const saveButton = screen.getAllByText('Save')[1];

      await user.click(saveButton);

      expect(baseProps.onSavePrinciples).toHaveBeenCalledTimes(1);
    });

    it('calls onCancelEdit and onChangeView when the "Cancel" button is clicked', async () => {
      const cancelButton = screen.getByText('Cancel');

      await user.click(cancelButton);

      expect(baseProps.onCancelEdit).toHaveBeenCalledTimes(1);
      expect(baseProps.onChangeView).toHaveBeenCalledWith('PRESENTATION');
    });
  });
});
