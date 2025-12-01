import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import selectEvent from 'react-select-event';
import { INPUT_ELEMENTS } from '@kitman/modules/src/HumanInput/shared/constants';
import { ConditionTypeSelectorTranslated as ConditionTypeSelector } from '../index';

describe('ConditionTypeSelector', () => {
  const mockSetFollowUpQuestionsModal = jest.fn();

  const defaultProps = {
    condition: { type: '==' },
    index: 0,
    subIndex: 1,
    setFollowUpQuestionsModal: mockSetFollowUpQuestionsModal,
    elementType: INPUT_ELEMENTS.Number,
  };
  it('renders the component with correct props', () => {
    render(<ConditionTypeSelector {...defaultProps} />);

    expect(screen.getByLabelText('Answer')).toHaveValue('Equals to');
  });

  it('displays the correct options', () => {
    render(<ConditionTypeSelector {...defaultProps} />);

    // Open the dropdown
    selectEvent.openMenu(screen.getByLabelText('Answer'));

    expect(screen.getByText('Equals to')).toBeInTheDocument();
    expect(screen.getByText('Not equals')).toBeInTheDocument();
    expect(screen.getByText('Less than or equals')).toBeInTheDocument();
    expect(screen.getByText('Less than')).toBeInTheDocument();
    expect(screen.getByText('Greater than')).toBeInTheDocument();
    expect(screen.getByText('Greater than or equals')).toBeInTheDocument();
  });

  it('selects the correct default value', () => {
    render(<ConditionTypeSelector {...defaultProps} />);

    expect(screen.getByDisplayValue('Equals to')).toBeInTheDocument();
  });

  it('handles option change and calls setFollowUpQuestionsModal', async () => {
    const user = userEvent.setup();

    render(<ConditionTypeSelector {...defaultProps} />);

    selectEvent.openMenu(screen.getByLabelText('Answer'));

    // Select a new option
    await user.click(screen.getByText('Not equals'));

    expect(mockSetFollowUpQuestionsModal).toHaveBeenCalled();
  });
});
