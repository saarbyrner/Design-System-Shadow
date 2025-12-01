import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import FormulaColumnInputPanel from '..';
import mockFormulaInputProps from '../../FormulaInputPanel/__tests__/mockData';

const defaultProps = {
  ...mockFormulaInputProps,
  isOpen: true,
  isEditMode: false,
  isStepValid: true,
  canGoPrevious: false,
  columnName: 'column name test',

  onSetColumnName: jest.fn(),
  onNext: jest.fn(),
  onPrevious: jest.fn(),
  onSubmit: jest.fn(),
  updateFormulaInput: jest.fn(),
};

const renderComponent = (props = defaultProps) =>
  render(<FormulaColumnInputPanel {...props} />);

describe('Analytical Dashboard ColumnFormulaPanel <FormulaColumnInputPanel />', () => {
  it('renders the FormulaColumnInputPanel', () => {
    renderComponent();

    expect(screen.getByText('Data type')).toBeInTheDocument();
    expect(screen.getByText('mockDataTypeSelection')).toBeInTheDocument();
    expect(screen.getByText('mockActiveSourceModule')).toBeInTheDocument();
    expect(
      screen.queryByText('Inherit population from table')
    ).toBeInTheDocument();

    expect(defaultProps.onNext).not.toHaveBeenCalled();
    expect(defaultProps.onPrevious).not.toHaveBeenCalled();
    expect(defaultProps.onSubmit).not.toHaveBeenCalled();
  });

  it('renders the FormulaInputPanel with active next button', async () => {
    const user = userEvent.setup();
    renderComponent();

    const nextButton = screen.getByRole('button', { name: 'Next' });
    expect(nextButton).toBeInTheDocument();
    expect(nextButton).toBeEnabled();

    const previousButton = screen.queryByRole('button', { name: 'Back' });
    expect(previousButton).not.toBeInTheDocument();

    const applyButton = screen.queryByRole('button', { name: 'Apply' });
    expect(applyButton).not.toBeInTheDocument();

    await user.click(nextButton);
    expect(defaultProps.onNext).toHaveBeenCalled();
  });

  it('renders the FormulaInputPanel with active previous button', async () => {
    const user = userEvent.setup();
    renderComponent({
      ...defaultProps,
      canGoPrevious: true,
      isFinalStep: true,
    });

    const nextButton = screen.queryByRole('button', { name: 'Next' });
    expect(nextButton).not.toBeInTheDocument();

    const previousButton = screen.getByRole('button', { name: 'Back' });
    expect(previousButton).toBeInTheDocument();
    expect(previousButton).toBeEnabled();

    const applyButton = screen.getByRole('button', { name: 'Apply' });
    expect(applyButton).toBeInTheDocument();
    expect(applyButton).toBeEnabled();

    await user.click(previousButton);
    expect(defaultProps.onPrevious).toHaveBeenCalled();
  });

  it('renders the column name input when is final step', async () => {
    const user = userEvent.setup();
    renderComponent({
      ...defaultProps,
      isFinalStep: true,
    });

    const textField = screen.getByLabelText('Column header title');
    await user.type(textField, 'X');

    expect(defaultProps.onSetColumnName).toHaveBeenCalledWith(
      'column name testX'
    );
  });
});
