import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SecondMetricSelector } from '../../TrainingEfficiencyIndex/SecondMetricSelector';

jest.mock('react-i18next', () => ({
  withNamespaces: () => (Comp) => (p) => <Comp t={(k) => k} {...p} />,
}));
jest.mock('@kitman/common/src/utils/formatAvailableVariables', () => ({
  formatAvailableVariables: (vars) =>
    vars.map((v) => ({ value: v.source_key, name: v.name })),
}));
jest.mock('@kitman/components', () => ({
  Dropdown: ({ label, items, value, onChange, id }) => (
    <label>
      {label}
      <select
        aria-label={label}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {items.map((i) => (
          <option key={i.value} value={i.value}>
            {i.name}
          </option>
        ))}
      </select>
    </label>
  ),
  RadioList: ({ id, options, change, value }) => (
    <div id={id}>
      {options.map((o) => (
        <label key={o.value}>
          <input
            type="radio"
            name="second_variable"
            value={o.value}
            checked={value === o.value}
            onChange={() => change(o.value)}
          />
          {o.name}
        </label>
      ))}
    </div>
  ),
}));

describe('SecondMetricSelector', () => {
  const availableVariables = [
    {
      localised_unit: '1-10',
      name: 'Abdominal',
      source_key: 'kitman:stiffness_indication|abdominal',
      source_name: 'Stiffness',
      type: 'scale',
    },
    {
      localised_unit: 'degrees',
      name: 'Ankle Angle Left',
      source_key: 'kitman:ohs|ankle_angle_left',
      source_name: 'Overhead Squat',
      type: 'number',
    },
    {
      localised_unit: 'degrees',
      name: 'Ankle Angle Right',
      source_key: 'kitman:ohs|ankle_angle_right',
      source_name: 'Right Y Balance',
      type: 'number',
    },
  ];

  const baseProps = () => ({
    availableVariables,
    onVariableChange: jest.fn(),
    onSettingsChange: jest.fn(),
    metricSourceKey: 'kitman:ohs|ankle_angle_left',
    settings: { second_variable: 'external' },
    t: (k) => k,
  });

  it('renders', () => {
    render(<SecondMetricSelector {...baseProps()} />);
    expect(screen.getByLabelText('Second Data Source')).toBeInTheDocument();
  });

  it('calls onVariableChange when metric is changed', async () => {
    const props = baseProps();
    render(<SecondMetricSelector {...props} />);
    const select = screen.getByLabelText('Second Data Source');
    const user = userEvent.setup();
    await user.selectOptions(select, 'kitman:stiffness_indication|abdominal');
    expect(props.onVariableChange).toHaveBeenCalledWith({
      localised_unit: '1-10',
      name: 'Abdominal',
      source_key: 'kitman:stiffness_indication|abdominal',
      source_name: 'Stiffness',
      type: 'scale',
    });
  });

  it('calls onSettingsChange when External/Internal flag changes', async () => {
    const props = baseProps();
    render(<SecondMetricSelector {...props} />);
    const internal = screen.getByLabelText('Internal load');
    const user = userEvent.setup();
    await user.click(internal);
    expect(props.onSettingsChange).toHaveBeenCalledWith({
      second_variable: 'internal',
    });
  });
});
