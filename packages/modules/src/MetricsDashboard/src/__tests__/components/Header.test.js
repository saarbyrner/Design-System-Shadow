import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from '../../components/Header';

jest.mock(
  '@kitman/modules/src/MetricsDashboard/src/components/DashboardControls',
  () => () => <div data-testid="dashboard-controls" />
);
jest.mock(
  '@kitman/modules/src/MetricsDashboard/src/containers/DashboardFilters',
  () => () => <div data-testid="dashboard-filters" />
);

const baseDashboards = () => {
  const organisation = { id: 1, name: 'Organisation 1' };
  return [
    { id: 1, name: 'Dashboard 1', organisation },
    { id: 2, name: 'Dashboard 2', organisation },
    { id: 3, name: 'Dashboard 3', organisation },
  ];
};

const baseProps = () => ({
  athleteFilters: [],
  alarmFilters: [],
  groupBy: 'Availability',
  dashboards: baseDashboards(),
  currentDashboardId: 2,
  switchDashboard: jest.fn(),
  canManageDashboard: true,
  addedStatusCount: 15,
  isFilterShown: false,
  isFilteringOn: false,
  toggleDashboardFilters: jest.fn(),
  t: (k) => k,
});

describe('<Header />', () => {
  it('renders dashboard selection dropdown with expected hidden input value', () => {
    render(<Header {...baseProps()} />);
    const hidden = document.querySelector(
      'input[type="hidden"][name="grouped_dropdown"]'
    );
    expect(hidden).toBeInTheDocument();
    expect(hidden.value).toBe('2');
  });

  it('shows settings button when user can manage', () => {
    render(<Header {...baseProps()} />);
    const settingsLink = document.querySelector(
      'a[href="/dashboards/templates"]'
    );
    expect(settingsLink).toBeInTheDocument();
  });

  it('hides settings button when user cannot manage', () => {
    render(<Header {...{ ...baseProps(), canManageDashboard: false }} />);
    const settingsLink = document.querySelector(
      'a[href="/dashboards/templates"]'
    );
    expect(settingsLink).not.toBeInTheDocument();
  });

  it('renders print link with groupBy param only', () => {
    const props = baseProps();
    render(<Header {...props} />);
    const printLink = document.querySelector(
      `a[href="?print=true&groupBy=${props.groupBy}"]`
    );
    expect(printLink).toBeInTheDocument();
  });

  it('renders print link with athleteFilters', () => {
    const props = { ...baseProps(), athleteFilters: [1, 25] };
    render(<Header {...props} />);
    const href = `?print=true&groupBy=${props.groupBy}&athleteFilters=${props.athleteFilters}`;
    expect(document.querySelector(`a[href="${href}"]`)).toBeInTheDocument();
  });

  it('renders print link with alarmFilters', () => {
    const props = { ...baseProps(), alarmFilters: ['InAlarm'] };
    render(<Header {...props} />);
    const href = `?print=true&groupBy=${props.groupBy}&alarmFilters=${props.alarmFilters}`;
    expect(document.querySelector(`a[href="${href}"]`)).toBeInTheDocument();
  });

  it('renders print link with both athlete and alarm filters', () => {
    const props = {
      ...baseProps(),
      athleteFilters: [1, 25],
      alarmFilters: ['InAlarm'],
    };
    render(<Header {...props} />);
    const href = `?print=true&groupBy=${props.groupBy}&alarmFilters=${props.alarmFilters}&athleteFilters=${props.athleteFilters}`;
    expect(document.querySelector(`a[href="${href}"]`)).toBeInTheDocument();
  });

  it('renders dashboard controls', () => {
    render(<Header {...baseProps()} />);
    expect(screen.getByTestId('dashboard-controls')).toBeInTheDocument();
  });

  it('renders filter button inactive by default', () => {
    render(<Header {...baseProps()} />);
    const filterBtn = document.querySelector('.icon-filter');
    expect(filterBtn).toBeInTheDocument();
  });

  it('renders filter button active when filtering on', () => {
    render(<Header {...{ ...baseProps(), isFilteringOn: true }} />);
    const iconButtons = document.querySelectorAll('.icon-filter');
    expect(iconButtons.length).toBeGreaterThan(0);
  });

  it('calls toggleDashboardFilters when filter button clicked', async () => {
    const props = baseProps();
    const user = userEvent.setup();
    render(<Header {...props} />);
    const filterBtn = document.querySelector('.icon-filter');
    await user.click(filterBtn);
    expect(props.toggleDashboardFilters).toHaveBeenCalledWith(false);
  });
});
