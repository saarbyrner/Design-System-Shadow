import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

import AlarmForm from '../../components/AlarmForm';

jest.mock(
  '@kitman/modules/src/MetricsDashboard/src/containers/AppliesToSearch',
  () => () => <div data-testid="applies-to-search" />
);

const baseProps = () => ({
  alarm_id: 'fake_alarm_id',
  alarm_type: 'numeric',
  percentage_alarm_definition: {},
  position: 0,
  unit: 'kg',
  value: '3',
  type: 'number',
  condition: 'greater_than',
  alarmValue: '3',
  t: i18nextTranslateStub(),
  summary: 'last',
  show_on_mobile: false,
  setAlarmType: jest.fn(),
  setCondition: jest.fn(),
  setValue: jest.fn(),
  setTimeValue: jest.fn(),
  updateShowAlarmOnMobile: jest.fn(),
});

describe('<AlarmForm/>', () => {
  it('renders', () => {
    render(<AlarmForm {...baseProps()} />);
    expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent(
      'Alarm 1'
    );
  });

  it('displays the alarm number heading', () => {
    render(<AlarmForm {...baseProps()} />);
    expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent(
      'Alarm 1'
    );
  });

  it('displays numeric condition fields for numeric type', () => {
    render(<AlarmForm {...baseProps()} />);
    expect(screen.getByText('Condition')).toBeInTheDocument();
    expect(screen.getByText('kg')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: '' })).toHaveValue('3');
  });

  it('displays boolean fields when type is boolean', () => {
    const { container } = render(
      <AlarmForm
        {...{ ...baseProps(), type: 'boolean', value: null, condition: null }}
      />
    );
    expect(screen.getByText('Alarm when Status is')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
    expect(container.querySelectorAll('input[type="radio"]')).toHaveLength(2);
  });

  it('displays scale numeric style fields (no unit)', () => {
    render(
      <AlarmForm
        {...{
          ...baseProps(),
          type: 'scale',
          unit: '1-10',
          value: null,
          condition: null,
        }}
      />
    );
    expect(screen.getByText('Condition')).toBeInTheDocument();
    expect(screen.queryByText('kg')).not.toBeInTheDocument();
  });

  describe('sleep type', () => {
    it('renders sleep duration inputs', () => {
      render(
        <AlarmForm
          {...{
            ...baseProps(),
            type: 'sleep_duration',
            unit: '',
            value: null,
            condition: null,
          }}
        />
      );
      expect(screen.getByText('Condition')).toBeInTheDocument();
    });

    it('renders numeric inputs when summary is z_score', () => {
      render(
        <AlarmForm
          {...{
            ...baseProps(),
            type: 'sleep_duration',
            summary: 'z_score',
            value: '3',
            condition: 'greater_than',
          }}
        />
      );
      expect(screen.getByText('Condition')).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: '' })).toHaveValue('3');
    });

    it('renders numeric inputs when summary is z_score_rolling', () => {
      render(
        <AlarmForm
          {...{
            ...baseProps(),
            type: 'sleep_duration',
            summary: 'z_score_rolling',
            value: '3',
            condition: 'greater_than',
          }}
        />
      );
      expect(screen.getByText('Condition')).toBeInTheDocument();
    });
  });

  it('hides unit when summary is ewma_acute_to_chronic_ratio', () => {
    render(
      <AlarmForm
        {...{ ...baseProps(), summary: 'ewma_acute_to_chronic_ratio' }}
      />
    );
    expect(screen.queryByText('kg')).not.toBeInTheDocument();
  });

  it('sets condition select value based on props (greater_than / less_than / equals)', () => {
    const { container, rerender } = render(
      <AlarmForm {...{ ...baseProps(), condition: 'greater_than' }} />
    );
    expect(
      container.querySelector(
        '.alarmForm__selector--condition .customDropdown__value'
      )
    ).toHaveTextContent('Greater than');

    rerender(<AlarmForm {...{ ...baseProps(), condition: 'less_than' }} />);
    expect(
      container.querySelector(
        '.alarmForm__selector--condition .customDropdown__value'
      )
    ).toHaveTextContent('Less than');

    rerender(<AlarmForm {...{ ...baseProps(), condition: 'equals' }} />);
    expect(
      container.querySelector(
        '.alarmForm__selector--condition .customDropdown__value'
      )
    ).toHaveTextContent('Equal to');
  });

  it('numeric input shows descriptor and value', () => {
    render(<AlarmForm {...baseProps()} />);
    expect(screen.getByText('kg')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: '' })).toHaveValue('3');
  });

  it('invokes setCondition when selecting a condition', async () => {
    const user = userEvent.setup();
    const props = { ...baseProps(), condition: null };
    render(<AlarmForm {...props} />);
    const option = screen.getByText(/Greater than/i);
    await user.click(option);
    expect(props.setCondition).toHaveBeenCalled();
  });

  it('does not render unit descriptor when unit absent', () => {
    render(
      <AlarmForm {...{ ...baseProps(), unit: '', condition: null, type: '' }} />
    );
    expect(screen.queryByText('kg')).not.toBeInTheDocument();
  });

  it('renders numeric form layout without unit when summary is count', () => {
    render(<AlarmForm {...{ ...baseProps(), summary: 'count' }} />);
    expect(screen.getByText('Condition')).toBeInTheDocument();
    expect(screen.queryByText('kg')).not.toBeInTheDocument();
  });

  it('renders show on Coach checkbox', () => {
    render(<AlarmForm {...baseProps()} />);
    expect(
      screen.getByRole('checkbox', { name: 'Show on Coach App' })
    ).toBeInTheDocument();
  });

  it('calls updateShowAlarmOnMobile when checkbox toggled', async () => {
    const user = userEvent.setup();
    const props = baseProps();
    render(<AlarmForm {...props} />);
    const checkbox = screen.getByRole('checkbox', {
      name: 'Show on Coach App',
    });
    await user.click(checkbox);
    expect(props.updateShowAlarmOnMobile).toHaveBeenCalledWith(0, true);
  });

  it('renders alarm type selector for non-boolean types', () => {
    render(<AlarmForm {...baseProps()} />);
    expect(screen.getByText('Alarm Type')).toBeInTheDocument();
  });

  it('does not render type selector when status type is boolean', () => {
    render(
      <AlarmForm
        {...{ ...baseProps(), type: 'boolean', value: null, condition: null }}
      />
    );
    expect(screen.queryByText('Alarm Type')).not.toBeInTheDocument();
  });

  it('invokes setAlarmType when changing alarm type', async () => {
    const user = userEvent.setup();
    const props = baseProps();
    render(<AlarmForm {...props} />);
    await user.click(screen.getByText('Percentage'));
    expect(props.setAlarmType).toHaveBeenCalledWith('percentage', 0);
  });

  it('renders percentage alarm content when alarm_type is percentage', () => {
    render(
      <AlarmForm
        {...{
          ...baseProps(),
          alarm_type: 'percentage',
          percentage_alarm_definition: {
            percentage: 10,
            calculation: 'mean',
            period_scope: 'acute',
            period_length: 7,
          },
        }}
      />
    );
    expect(screen.getByText('Calculation')).toBeInTheDocument();
    expect(screen.getByText('%')).toBeInTheDocument();
  });
});
