import { render, screen } from '@testing-library/react';
import { MetricSelectorComponent as MetricSelector } from '../MetricSelector';

jest.mock('react-i18next', () => ({
  withNamespaces: () => (Comp) => (p) => <Comp t={(k) => k} {...p} />,
}));
jest.mock('@kitman/common/src/utils/formatAvailableVariables', () => ({
  formatAvailableVariablesForGroupedDropdown: (vars) =>
    vars.map((v) => ({ ...v, group: v.source_name })),
}));
jest.mock('@kitman/components', () => ({
  GroupedDropdown: ({ label, searchable, isDisabled, value, options }) => (
    <div>
      <div
        data-testid="grouped-dropdown"
        data-searchable={searchable}
        data-disabled={isDisabled}
        data-value={value}
      >
        {label}
      </div>
      <ul>
        {options.map((o) => {
          const formatted = `${o.name} (${o.localised_unit}) - ${o.group}`;
          return (
            <li key={o.source_key} className="groupedDropdown__textwrap">
              {formatted}
            </li>
          );
        })}
      </ul>
    </div>
  ),
}));

describe('MetricSelector', () => {
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

  const props = {
    availableVariables,
    isDisabled: false,
    value: 'kitman:ohs|ankle_angle_left',
    onChange: jest.fn(),
    t: (k) => k,
  };

  it('renders', () => {
    const { container } = render(<MetricSelector {...props} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders a GroupedDropdown and passes the correct props', () => {
    render(<MetricSelector {...props} />);
    const dd = screen.getByTestId('grouped-dropdown');
    expect(dd).toBeInTheDocument();
    expect(dd).toHaveAttribute('data-searchable', 'true');
    expect(dd).toHaveTextContent('Data Source');
    expect(dd).toHaveAttribute('data-disabled', 'false');
    expect(dd).toHaveAttribute('data-value', 'kitman:ohs|ankle_angle_left');
  });

  it('formats the variables names', () => {
    render(<MetricSelector {...props} />);
    const items = screen.getAllByRole('listitem');
    expect(
      items.some((li) =>
        /Ankle Angle Left \(degrees\) - Overhead Squat/.test(
          li.textContent || ''
        )
      )
    ).toBe(true);
  });

  describe('when isDisabled is true', () => {
    it('disables the GroupedDropdown', () => {
      const customProps = { ...props, isDisabled: true };
      render(<MetricSelector {...customProps} />);
      const dd = screen.getByTestId('grouped-dropdown');
      expect(dd).toHaveAttribute('data-disabled', 'true');
    });
  });
});
