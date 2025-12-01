import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PercentageAlarmForm from '../../components/AlarmForm/PercentageAlarmForm';

const baseProps = (override = {}) => {
  const defaults = {
    position: 0,
    condition: 'greater_than',
    calculation: 'last',
    percentageAlarmDefinition: {
      calculation: 'mean',
      period_length: 'last_x_days',
      period_scope: 30,
      percentage: '95.2',
    },
    setCondition: jest.fn(),
    setAlarmCalculation: jest.fn(),
    setAlarmPercentage: jest.fn(),
    setAlarmPeriodScope: jest.fn(),
    setAlarmPeriodLength: jest.fn(),
    t: (k) => k,
  };
  return {
    ...defaults,
    ...override,
    percentageAlarmDefinition:
      override.percentageAlarmDefinition || defaults.percentageAlarmDefinition,
  };
};

describe('<PercentageAlarmForm />', () => {
  it('renders', () => {
    const { container } = render(<PercentageAlarmForm {...baseProps()} />);
    expect(
      container.querySelector('.alarmForm__content--percentage')
    ).toBeInTheDocument();
  });

  it('calls setCondition when a condition is selected', async () => {
    const user = userEvent.setup();
    const setCondition = jest.fn();
    render(
      <PercentageAlarmForm {...baseProps()} setCondition={setCondition} />
    );
    const dropdowns = document.querySelectorAll('.customDropdown');
    const conditionDropdown = dropdowns[0];
    const firstOption = conditionDropdown.querySelector(
      '.customDropdown__menu .customDropdown__item .customDropdown__textwrap'
    );
    await user.click(firstOption);

    expect(setCondition).toHaveBeenCalledTimes(1);
    expect(setCondition.mock.calls[0][0]).toBe('less_than');
    expect(setCondition.mock.calls[0][1]).toBe(0);
  });

  it('calls setAlarmCalculation when a calculation is selected', async () => {
    const user = userEvent.setup();
    const setAlarmCalculation = jest.fn();
    render(
      <PercentageAlarmForm
        {...baseProps()}
        setAlarmCalculation={setAlarmCalculation}
      />
    );
    const dropdowns = document.querySelectorAll('.customDropdown');
    const calculationDropdown = Array.from(dropdowns).find((d) =>
      d.querySelector('label')?.textContent?.includes('Calculation')
    );
    const firstOption = calculationDropdown.querySelector(
      '.customDropdown__menu .customDropdown__item .customDropdown__textwrap'
    );
    await user.click(firstOption); // 'Sum'

    expect(setAlarmCalculation).toHaveBeenCalledTimes(1);
    expect(setAlarmCalculation.mock.calls[0][0]).toBe('sum');
    expect(setAlarmCalculation.mock.calls[0][1]).toBe(0);
  });

  it('calls setAlarmPercentage when user changes the value', () => {
    const setAlarmPercentage = jest.fn();
    render(
      <PercentageAlarmForm
        {...baseProps({
          percentageAlarmDefinition: {
            calculation: 'mean',
            period_length: 'last_x_days',
            period_scope: 30,
            percentage: '',
          },
        })}
        setAlarmPercentage={setAlarmPercentage}
      />
    );
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '4' } });
    fireEvent.change(input, { target: { value: '4' } });
    const calls = setAlarmPercentage.mock.calls.filter((c) => c[0].length);
    expect(calls.length).toBeGreaterThanOrEqual(2);
    calls.slice(0, 2).forEach((c) => expect(c[0]).toBe('4'));
    calls.slice(0, 2).forEach((c) => expect(c[1]).toBe(0));
  });

  it('renders 0 when percentage value is zero', () => {
    const props = baseProps({
      percentageAlarmDefinition: {
        calculation: 'mean',
        period_length: 'last_x_days',
        period_scope: 30,
        percentage: 0,
      },
    });
    render(<PercentageAlarmForm {...props} />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('0');
  });
});
