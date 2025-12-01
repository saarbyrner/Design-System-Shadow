import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithStore } from '@kitman/modules/src/analysis/Dashboard/utils/testUitils';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import colors from '@kitman/common/src/variables/colors';
import FormattingPanel from '../index';

describe('<FormattingPanel />', () => {
  const defaultProps = {
    appliedFormat: [
      { type: null, condition: null, value: null, color: colors.red_100_20 },
    ],
    panelName: 'Panel Name',
    ruleUnit: 'mins',
    onAddFormattingRule: jest.fn(),
    onClickSave: jest.fn(),
    onRemoveFormattingRule: jest.fn(),
    onUpdateRuleType: jest.fn(),
    onUpdateRuleCondition: jest.fn(),
    onUpdateRuleValue: jest.fn(),
    onUpdateRuleColor: jest.fn(),
    togglePanel: jest.fn(),
    hasSuggestedThreshold: false,
    isSuggestedThresholdLoading: false,
    hasSuggestedThresholdErrored: false,
    suggestedThreshold: 5,
    isOpen: true,
    t: i18nextTranslateStub(),
  };

  it('renders correctly', () => {
    renderWithStore(<FormattingPanel {...defaultProps} />);

    expect(screen.getByText('Conditional formatting')).toBeInTheDocument();
  });

  it('renders the correct title for charts', () => {
    renderWithStore(<FormattingPanel {...defaultProps} widgetType="xy" />);

    expect(screen.getByText('Formatting rules')).toBeInTheDocument();
  });

  it('displays the selected panel name', () => {
    renderWithStore(<FormattingPanel {...defaultProps} />);

    expect(screen.getByText('Panel Name')).toBeInTheDocument();
  });

  describe('Add Rule', () => {
    it('calls the correct function when Add Rule is clicked', async () => {
      const user = userEvent.setup();
      const mockOnAddFormattingRule = jest.fn();

      renderWithStore(
        <FormattingPanel
          {...defaultProps}
          onAddFormattingRule={mockOnAddFormattingRule}
        />
      );

      const addRuleButton = screen.getByRole('button', { name: 'Add rule' });

      expect(addRuleButton).toBeInTheDocument();
      expect(screen.getByText('Save')).toBeInTheDocument();

      await user.click(addRuleButton);

      expect(mockOnAddFormattingRule).toHaveBeenCalledTimes(1);
    });

    it('disables the Add Rule button when there are 10 rules already', () => {
      const tenRules = Array(10).fill(defaultProps.appliedFormat);

      renderWithStore(
        <FormattingPanel {...defaultProps} appliedFormat={tenRules} />
      );

      const addRuleButton = screen.getByRole('button', { name: 'Add rule' });

      expect(addRuleButton).toBeDisabled();
    });
  });

  it('has a save button which is disabled when nothing is selected', () => {
    renderWithStore(<FormattingPanel {...defaultProps} />);

    const saveButton = screen.getByRole('button', { name: 'Save' });
    expect(saveButton).toBeDisabled();
  });

  it('has a save button which is enabled when format is properly selected for tables', () => {
    renderWithStore(
      <FormattingPanel
        {...defaultProps}
        widgetType="COMPARISON"
        appliedFormat={[
          {
            type: 'numeric',
            condition: 'greater_than',
            value: 2345,
            color: colors.red_100_20,
          },
        ]}
      />
    );

    const saveButton = screen.getByRole('button', { name: 'Save' });
    expect(saveButton).toBeEnabled();
  });

  it('has a save button which is enabled when format is properly selected for charts', () => {
    renderWithStore(
      <FormattingPanel
        {...defaultProps}
        widgetType="xy"
        appliedFormat={[
          {
            type: 'numeric',
            condition: 'greater_than',
            value: 2345,
            color: colors.red_100_20,
          },
        ]}
      />
    );

    const saveButton = screen.getByRole('button', { name: 'Save' });
    expect(saveButton).toBeEnabled();
  });

  it('has a save button which is enabled when format is properly selected for charts and condition is "between"', () => {
    renderWithStore(
      <FormattingPanel
        {...defaultProps}
        widgetType="xy"
        appliedFormat={[
          {
            type: 'between',
            condition: 'greater_than',
            value: null,
            to: 100,
            from: 50,
            color: colors.red_100_20,
          },
        ]}
      />
    );

    const saveButton = screen.getByRole('button', { name: 'Save' });
    expect(saveButton).toBeEnabled();
  });

  it('triggers the correct function when save is clicked', async () => {
    const user = userEvent.setup();
    const mockOnClickSave = jest.fn();

    renderWithStore(
      <FormattingPanel
        {...defaultProps}
        widgetType="COMPARISON"
        onClickSave={mockOnClickSave}
        appliedFormat={[
          {
            type: 'numeric',
            condition: 'greater_than',
            value: 2345,
            color: colors.red_100_20,
          },
        ]}
      />
    );

    const saveButton = screen.getByRole('button', { name: 'Save' });
    await user.click(saveButton);

    expect(mockOnClickSave).toHaveBeenCalledTimes(1);
  });

  it('hides suggested threshold when prop is false', () => {
    renderWithStore(<FormattingPanel {...defaultProps} />);

    expect(screen.queryByText('Suggested Threshold')).not.toBeInTheDocument();
  });

  it('shows suggested threshold when prop is true and renders correct value', () => {
    renderWithStore(
      <FormattingPanel
        {...defaultProps}
        hasSuggestedThreshold
        suggestedThreshold={5.1234}
      />
    );

    expect(screen.getByText('Suggested Threshold: 5.12 %')).toBeInTheDocument();
  });

  it('shows suggested threshold loading state', () => {
    renderWithStore(
      <FormattingPanel
        {...defaultProps}
        hasSuggestedThreshold
        suggestedThreshold={5}
        isSuggestedThresholdLoading
      />
    );

    expect(screen.getByText('Suggested Threshold: ... %')).toBeInTheDocument();
  });

  it('displays no formatting rules message when appliedFormat is empty', () => {
    renderWithStore(<FormattingPanel {...defaultProps} appliedFormat={[]} />);

    expect(screen.getByText('No formatting rules added')).toBeInTheDocument();
  });
});
