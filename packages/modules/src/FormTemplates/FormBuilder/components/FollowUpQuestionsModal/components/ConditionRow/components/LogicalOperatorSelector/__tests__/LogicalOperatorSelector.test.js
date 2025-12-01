import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import selectEvent from 'react-select-event';
import { INPUT_ELEMENTS } from '@kitman/modules/src/HumanInput/shared/constants';
import { LogicalOperatorSelectorTranslated as LogicalOperatorSelector } from '../index';

describe('ConditionTypeSelector', () => {
  const mockOnChange = jest.fn();

  const defaultProps = {
    value: 'and',
    onChange: mockOnChange,
    elementType: INPUT_ELEMENTS.MultipleChoice,
  };

  it('renders the Select component with the correct value', () => {
    render(<LogicalOperatorSelector {...defaultProps} />);

    const select = screen.getByRole('button');

    expect(select).toBeInTheDocument();
    expect(select).toHaveTextContent('AND');
  });

  it('displays the correct options (AND and OR)', () => {
    render(<LogicalOperatorSelector {...defaultProps} />);

    selectEvent.openMenu(screen.getByRole('button'));

    expect(screen.getAllByText('AND')).toHaveLength(2);
    expect(screen.getByText('OR')).toBeInTheDocument();
  });

  it('calls onChange when selecting an option', async () => {
    const user = userEvent.setup();

    render(<LogicalOperatorSelector {...defaultProps} />);

    selectEvent.openMenu(screen.getByRole('button'));
    await user.click(screen.getByText('OR'));

    expect(mockOnChange).toHaveBeenCalled();
  });
});
