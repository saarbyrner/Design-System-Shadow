import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import selectEvent from 'react-select-event';
import { INPUT_ELEMENTS } from '@kitman/modules/src/HumanInput/shared/constants';
import { ConditionRowItemTranslated as ConditionRowItem } from '../index';

describe('ConditionRowItem', () => {
  const mockSetFollowUpQuestionsModal = jest.fn();
  const mockOnRemove = jest.fn();
  const mockOnOperatorChange = jest.fn();

  const defaultProps = {
    condition: { type: '==', value: 'test' },
    elementType: INPUT_ELEMENTS.Text,
    index: 0,
    setFollowUpQuestionsModal: mockSetFollowUpQuestionsModal,
  };

  it('renders the component with correct props', () => {
    render(<ConditionRowItem {...defaultProps} />);

    expect(screen.getByText('If')).toBeInTheDocument();
    expect(screen.getByLabelText('Answer')).toHaveValue('Equals to');
  });

  it('shows the operator selector when showOperatorSelector is true', () => {
    render(
      <ConditionRowItem
        {...defaultProps}
        showOperatorSelector
        logicalOperatorValue="or"
        onOperatorChange={mockOnOperatorChange}
      />
    );

    expect(screen.getByText('OR')).toBeInTheDocument();
  });

  it('does not show the operator selector when showOperatorSelector is false', () => {
    render(
      <ConditionRowItem
        {...defaultProps}
        showOperatorSelector={false}
        logicalOperatorValue="and"
        onOperatorChange={mockOnOperatorChange}
      />
    );

    expect(screen.queryByText('AND')).not.toBeInTheDocument();
  });

  it('calls onRemove when the delete button is clicked', async () => {
    const user = userEvent.setup();

    render(<ConditionRowItem {...defaultProps} onRemove={mockOnRemove} />);

    // Simulate the remove action
    await user.click(screen.getByLabelText('delete'));

    expect(mockOnRemove).toHaveBeenCalled();
  });

  it('calls onOperatorChange when the operator selector value changes', async () => {
    const user = userEvent.setup();

    render(
      <ConditionRowItem
        {...defaultProps}
        showOperatorSelector
        logicalOperatorValue="and"
        onOperatorChange={mockOnOperatorChange}
        elementType={INPUT_ELEMENTS.MultipleChoice}
      />
    );

    selectEvent.openMenu(screen.getByText('AND'));

    expect(
      screen.getByRole('option', {
        name: /or/i,
        hidden: true,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('option', {
        name: /and/i,
        hidden: true,
      })
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole('option', {
        name: /or/i,
        hidden: true,
      })
    );

    expect(mockOnOperatorChange).toHaveBeenCalled();
  });

  it('renders correct initial condition value', () => {
    render(<ConditionRowItem {...defaultProps} />);

    expect(screen.getByLabelText('Value')).toHaveValue('test');
  });
});
