import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import colors from '@kitman/common/src/variables/colors';
import FormattingRule from '../components/FormattingRule';

describe('<FormattingRule />', () => {
  const mockProps = {
    t: i18nextTranslateStub(),
    ruleUnit: undefined,
    index: 0,
    format: {
      type: null,
      condition: null,
      value: undefined,
      color: colors.red_100_20,
    },
    widgetType: 'COMPARISON',
    onRemoveFormattingRule: jest.fn(),
    onUpdateRuleType: jest.fn(),
    onUpdateRuleCondition: jest.fn(),
    onUpdateRuleValue: jest.fn(),
    onUpdateRuleColor: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<FormattingRule {...mockProps} />);

    expect(screen.getByText(`Rule ${mockProps.index + 1}`)).toBeInTheDocument();

    expect(screen.getByLabelText('Rule type')).toBeInTheDocument();
    expect(screen.getByLabelText('Condition')).toBeInTheDocument();

    expect(screen.getByLabelText('units')).toBeInTheDocument();
    expect(
      screen.getByTestId('FormattingRule|ColorPicker')
    ).toBeInTheDocument();

    expect(screen.getAllByRole('button')).toHaveLength(4); // 2 dropdown buttons + 1 remove button + 1 add rule button
  });

  it('contains a rule type dropdown with the correct items', async () => {
    const user = userEvent.setup();

    render(<FormattingRule {...mockProps} />);

    const ruleTypeSelect = screen.getByLabelText('Rule type');

    expect(ruleTypeSelect).toBeInTheDocument();

    await user.click(ruleTypeSelect);

    expect(screen.getByText('Numeric')).toBeVisible();
  });

  it('contains "Text" as a rule type when FF table-widget-availability-data-type is enabled', async () => {
    window.setFlag('table-widget-availability-data-type', true);
    const user = userEvent.setup();

    render(<FormattingRule {...mockProps} />);

    const ruleTypeSelect = screen.getByLabelText('Rule type');

    expect(ruleTypeSelect).toBeInTheDocument();

    await user.click(ruleTypeSelect);

    expect(screen.getByText('Numeric')).toBeVisible();
    expect(screen.getByText('Text')).toBeVisible();
  });

  it('contains a condition dropdown with the correct items for type numeric', async () => {
    const user = userEvent.setup();

    render(<FormattingRule {...mockProps} format={{ type: 'numeric' }} />);

    const conditionSelector = screen.getByLabelText('Condition');

    expect(conditionSelector).toBeInTheDocument();

    await user.click(conditionSelector);

    expect(screen.getByText('Equal to')).toBeVisible();
    expect(screen.getByText('Greater than')).toBeVisible();
    expect(screen.getByText('Less than')).toBeVisible();
  });

  it('contains a condition dropdown with the correct items for type string', async () => {
    const user = userEvent.setup();

    render(<FormattingRule {...mockProps} format={{ type: 'string' }} />);

    const conditionSelector = screen.getByLabelText('Condition');

    expect(conditionSelector).toBeInTheDocument();

    await user.click(conditionSelector);

    expect(screen.getByText('Equal to')).toBeVisible();
    expect(screen.getByText('Not equal to')).toBeVisible();
  });

  it('contains an TextField component for type number when rule type is numeric', () => {
    render(<FormattingRule {...mockProps} format={{ type: 'numeric' }} />);

    expect(screen.getByLabelText('units')).toBeInTheDocument();
    expect(
      screen.getByTestId('FormattingRule|TextInput|Number')
    ).toBeInTheDocument();
  });

  it('contains an TextField component when rule type is text', () => {
    render(<FormattingRule {...mockProps} format={{ type: 'string' }} />);

    expect(screen.getByLabelText('units')).toBeInTheDocument();
    expect(screen.getByTestId('FormattingRule|TextInput')).toBeInTheDocument();
  });

  it('overrides TextField label when ruleUnit is provided', () => {
    render(<FormattingRule {...mockProps} ruleUnit="mins" />);

    expect(screen.getByLabelText('mins')).toBeInTheDocument();
  });

  it('contains From and To selectors when condition is "between"', () => {
    render(<FormattingRule {...mockProps} format={{ condition: 'between' }} />);

    expect(screen.getByLabelText('From')).toBeInTheDocument();
    expect(screen.getByLabelText('To')).toBeInTheDocument();
  });

  it('contains a ColorPicker component', () => {
    render(<FormattingRule {...mockProps} />);

    expect(
      screen.getByTestId('FormattingRule|ColorPicker')
    ).toBeInTheDocument();
  });

  it('calls the correct function when the bin icon is clicked on a rule', async () => {
    const user = userEvent.setup();
    render(<FormattingRule {...mockProps} />);

    const removeButton = screen.getByTestId('DeleteOutlineIcon');
    await user.click(removeButton);
    expect(removeButton).toBeInTheDocument();

    expect(mockProps.onRemoveFormattingRule).toHaveBeenCalledTimes(1);
    expect(mockProps.onRemoveFormattingRule).toHaveBeenCalledWith(0);
  });

  it('contains the textDisplay selector when props.showTextDisplay is true', () => {
    render(<FormattingRule {...mockProps} showTextDisplay />);
    expect(screen.getByLabelText('Text display')).toBeInTheDocument();
  });

  it('hides the textDisplay selector when props.showTextDisplay is false', () => {
    render(<FormattingRule {...mockProps} showTextDisplay={false} />);
    expect(screen.queryByLabelText('Text display')).not.toBeInTheDocument();
  });

  it('hides the textDisplay selector when props.showTextDisplay is undefined', () => {
    render(<FormattingRule {...mockProps} />);
    expect(screen.queryByLabelText('Text display')).not.toBeInTheDocument();
  });

  it('auto-selects the only condition when switching to reference_line (xy widget)', async () => {
    const user = userEvent.setup();
    const onUpdateRuleType = jest.fn();
    const onUpdateRuleCondition = jest.fn();

    render(
      <FormattingRule
        {...mockProps}
        widgetType="xy"
        onUpdateRuleType={onUpdateRuleType}
        onUpdateRuleCondition={onUpdateRuleCondition}
      />
    );

    const ruleTypeSelect = screen.getByLabelText('Rule type');
    await user.click(ruleTypeSelect);

    const refLineOption = screen.getByText('Reference Line');
    await user.click(refLineOption);

    expect(onUpdateRuleType).toHaveBeenCalledWith('reference_line', 0);

    expect(onUpdateRuleCondition).toHaveBeenCalledWith('equal_to', 0);
  });
});
