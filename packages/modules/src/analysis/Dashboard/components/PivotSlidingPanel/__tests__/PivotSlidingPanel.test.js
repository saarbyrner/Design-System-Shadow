import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithStore } from '@kitman/modules/src/analysis/Dashboard/utils/testUitils';
import * as useEventTrackingModule from '@kitman/common/src/hooks/useEventTracking';
import { emptySquadAthletes } from '../../utils';
import PivotSlidingPanel from '../index';

jest.mock('@kitman/common/src/hooks/useEventTracking');

describe('<PivotSlidingPanel />', () => {
  const squadAthletes = {
    position_groups: [
      {
        id: '1',
        name: 'Position Group',
        positions: [
          {
            id: '1',
            name: 'Position',
            athletes: [
              {
                id: '1',
                fullname: 'Athete',
              },
            ],
          },
        ],
      },
    ],
  };

  let props = {};
  let trackEventMock;

  beforeEach(() => {
    props = {
      squadAthletes,
      isOpen: true,
      onApply: jest.fn(),
      onReset: jest.fn(),
      t: (key) => key,
    };
    trackEventMock = jest.fn();
    useEventTrackingModule.default.mockReturnValue({
      trackEvent: trackEventMock,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('shows the athletes/dates buttons', () => {
    renderWithStore(<PivotSlidingPanel {...props} />);

    expect(
      screen.getByRole('button', { name: '#sport_specific__Athletes' })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Date' })).toBeInTheDocument();
  });

  it('switches between the dates dropdown and athletes selector when clicking between the athletes/dates button', async () => {
    const user = userEvent.setup();
    renderWithStore(<PivotSlidingPanel {...props} />);

    expect(screen.getAllByText('#sport_specific__Entire_Squad')).toHaveLength(
      2
    );
    expect(screen.getByText(/Loading positions/)).toBeInTheDocument();

    // Switch to Dates
    await user.click(screen.getByRole('button', { name: 'Date' }));
    expect(
      screen.getByTestId('GroupedDropdown|TriggerButton')
    ).toBeInTheDocument();
    expect(screen.queryByText(/Loading positions/)).not.toBeInTheDocument();

    // Switch back to Athletes
    await user.click(
      screen.getByRole('button', { name: '#sport_specific__Athletes' })
    );
    expect(screen.getAllByText('#sport_specific__Entire_Squad')).toHaveLength(
      2
    );
  });

  it('selects the correct timePeriod when one is clicked in the dates dropdown', async () => {
    const user = userEvent.setup();
    renderWithStore(<PivotSlidingPanel {...props} />);

    // Switch to Dates
    await user.click(screen.getByRole('button', { name: 'Date' }));

    const dropdown = screen.getByTestId('GroupedDropdown|TriggerButton');
    await user.click(dropdown);

    expect(dropdown).toHaveAttribute('aria-expanded', 'true');
  });

  it('renders the correct options for the dropdown', async () => {
    const user = userEvent.setup();
    renderWithStore(<PivotSlidingPanel {...props} />);

    // Switch to Dates
    await user.click(screen.getByRole('button', { name: 'Date' }));

    const dropdown = screen.getByTestId('GroupedDropdown|TriggerButton');
    await user.click(dropdown);

    expect(screen.getByText('Rolling Period')).toBeInTheDocument();
    expect(screen.getByText('Season')).toBeInTheDocument();
    expect(screen.getByText('Set Period')).toBeInTheDocument();
  });

  it('calls props.onApply with the selected timePeriod when Apply is clicked', async () => {
    const user = userEvent.setup();
    renderWithStore(<PivotSlidingPanel {...props} />);

    const applyButton = screen.getByRole('button', { name: 'Apply' });
    await user.click(applyButton);

    expect(props.onApply).toHaveBeenCalledWith({
      selectedSquadAthletes: emptySquadAthletes,
      timePeriod: '',
      dateRange: {},
      timePeriodLength: null,
    });
  });

  it('renders correctly', () => {
    renderWithStore(<PivotSlidingPanel {...props} />);

    expect(screen.getByText('Pivot Dashboard By')).toBeInTheDocument();
  });

  it('calls props.onReset() when Reset is clicked', async () => {
    const user = userEvent.setup();
    renderWithStore(<PivotSlidingPanel {...props} />);

    const resetButton = screen.getByRole('button', { name: 'Reset' });
    await user.click(resetButton);

    expect(props.onReset).toHaveBeenCalledTimes(1);
  });

  it('renders an athlete selector', () => {
    renderWithStore(<PivotSlidingPanel {...props} />);

    expect(screen.getAllByText('#sport_specific__Entire_Squad')).toHaveLength(
      2
    );
    expect(screen.getByText('#sport_specific__Squads')).toBeInTheDocument();
  });

  it('updates the squadAthletesSelection when clicking a checkbox', async () => {
    const user = userEvent.setup();
    renderWithStore(<PivotSlidingPanel {...props} />);

    const checkbox = screen.getAllByRole('checkbox')[0];
    await user.click(checkbox);

    const applyButton = screen.getByRole('button', { name: 'Apply' });
    await user.click(applyButton);

    expect(props.onApply).toHaveBeenCalled();
  });

  it('calls props.onApply with no selectedItems when Apply is clicked and nothing is selected', async () => {
    const user = userEvent.setup();
    renderWithStore(<PivotSlidingPanel {...props} />);

    const applyButton = screen.getByRole('button', { name: 'Apply' });
    await user.click(applyButton);

    expect(props.onApply).toHaveBeenCalledWith({
      selectedSquadAthletes: emptySquadAthletes,
      timePeriod: '',
      dateRange: {},
      timePeriodLength: null,
    });
  });

  it('calls trackEvent with "Pivot Analysis Dashboard" when pivot is applied', async () => {
    const user = userEvent.setup();
    renderWithStore(<PivotSlidingPanel {...props} />);

    const applyButton = screen.getByRole('button', { name: 'Apply' });
    await user.click(applyButton);

    expect(trackEventMock).toHaveBeenCalledWith('Pivot Analysis Dashboard');
  });
});
