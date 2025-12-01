import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import AlarmForm from '../../components/AlarmForm';

// The component expects this container; keep it lightweight for isolation.
jest.mock(
  '@kitman/modules/src/MetricsDashboard/src/containers/AppliesToSearch',
  () => () => <div data-testid="applies-to-search" />
);

const baseProps = () => ({
  alarm_id: 'alarm_0',
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
  deleteAlarm: jest.fn(),
  setAlarmColour: jest.fn(),
  calculation: null,
  setAlarmCalculation: jest.fn(),
  setAlarmPercentage: jest.fn(),
  setAlarmPeriodScope: jest.fn(),
  setAlarmPeriodLength: jest.fn(),
  updateShowAlarmOnMobile: jest.fn(),
});

describe('<CurrentAlarmForm /> migration', () => {
  it('renders heading for first alarm', () => {
    render(<AlarmForm {...baseProps()} />);
    expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent(
      'Alarm 1'
    );
  });
});
