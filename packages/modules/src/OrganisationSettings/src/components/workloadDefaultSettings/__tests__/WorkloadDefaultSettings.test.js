import { render, screen, within, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import WorkloadDefaultSettings from '../index';

describe('Organisation Settings <WorkloadDefaultSettings /> component', () => {
  let baseProps;

  beforeEach(() => {
    baseProps = {
      workloadType: 'GAME',
      rpeCollection: {
        kioskApp: false,
        athleteApp: false,
      },
      participationLevels: [
        {
          id: 1,
          name: 'Full Game',
          canonical_participation_level: 'full',
          default: true,
          include_in_group_calculations: false,
        },
        {
          id: 2,
          name: 'Came on as sub',
          canonical_participation_level: 'partial',
          default: true,
          include_in_group_calculations: false,
        },
        {
          id: 3,
          name: 'Not a default participation level',
          canonical_participation_level: 'full',
          default: false,
          include_in_group_calculations: false,
        },
        { id: 4, name: 'Modified', include_in_group_calculations: false },
      ],
      onParticipationLevelNameChange: jest.fn(),
      onIncludeInGroupCalculationChange: jest.fn(),
      onChangeRpeCollection: jest.fn(),
      t: i18nextTranslateStub(),
    };
  });

  it('renders the correct widget title when the workload type is GAME', () => {
    render(<WorkloadDefaultSettings {...baseProps} workloadType="GAME" />);

    expect(screen.getByText('Game defaults')).toBeInTheDocument();
  });

  it('renders the correct widget title when the workload type is TRAINING_SESSION', () => {
    render(
      <WorkloadDefaultSettings {...baseProps} workloadType="TRAINING_SESSION" />
    );
    expect(screen.getByText('Session defaults')).toBeInTheDocument();
  });

  it('renders the RPE Collection Channels checkboxes', () => {
    render(<WorkloadDefaultSettings {...baseProps} />);

    expect(screen.getByLabelText('Kiosk app')).toBeInTheDocument();
    expect(screen.getByLabelText('Athlete app')).toBeInTheDocument();
  });

  it('calls the correct callback when the Kiosk app checkbox is clicked', async () => {
    const user = userEvent.setup();

    render(<WorkloadDefaultSettings {...baseProps} />);

    const kioskAppCheckbox = screen.getByLabelText('Kiosk app');

    await user.click(kioskAppCheckbox);

    expect(baseProps.onChangeRpeCollection).toHaveBeenCalledWith(
      'GAME',
      'KIOSK_APP',
      true
    );
  });

  it('calls the correct callback when the Athlete app checkbox is clicked', async () => {
    const user = userEvent.setup();

    render(<WorkloadDefaultSettings {...baseProps} />);

    const athleteAppCheckbox = screen.getByLabelText('Athlete app');

    await user.click(athleteAppCheckbox);

    expect(baseProps.onChangeRpeCollection).toHaveBeenCalledWith(
      'GAME',
      'ATHLETE_APP',
      true
    );
  });

  it('renders a list of all participation levels correctly with the correct headings', () => {
    render(<WorkloadDefaultSettings {...baseProps} />);

    const table = screen.getByRole('table');
    const rows = within(table).getAllByRole('row');

    expect(
      screen.getByRole('columnheader', { name: 'Participation level' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Participation' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', {
        name: 'Include in group calculations',
      })
    ).toBeInTheDocument();

    expect(rows).toHaveLength(5); // 1 header + 4 data rows
    expect(within(rows[1]).getByText('Full Game')).toBeInTheDocument();
    expect(within(rows[1]).getByText('Full')).toBeInTheDocument();
    expect(within(rows[2]).getByText('Came on as sub')).toBeInTheDocument();
    expect(within(rows[2]).getByText('Partial')).toBeInTheDocument();
  });

  it('renames the participation level when clicking the rename button and confirming', async () => {
    const user = userEvent.setup();

    render(<WorkloadDefaultSettings {...baseProps} />);

    const firstRow = screen.getAllByRole('row')[1];
    const renameButton = within(firstRow).getAllByRole('button')[0];

    await user.click(renameButton);

    const modal = await screen.findByRole('dialog');
    expect(
      within(modal).getByRole('heading', { name: 'Rename Participation' })
    ).toBeInTheDocument();

    const nameInput = within(modal).getByLabelText('Participation Name');
    expect(nameInput).toHaveValue('Full Game');

    fireEvent.change(nameInput, { target: { value: 'New value' } });

    const confirmButton = within(modal).getByRole('button', {
      name: 'Confirm',
    });
    await user.click(confirmButton);

    expect(baseProps.onParticipationLevelNameChange).toHaveBeenCalledWith(
      'GAME',
      1,
      'New value'
    );
  });

  it('calls the correct prop when toggling the include in group calculations switch', async () => {
    const user = userEvent.setup();

    render(<WorkloadDefaultSettings {...baseProps} />);
    const firstRow = screen.getAllByRole('row')[1];
    const toggleSwitch = within(firstRow).getByRole('switch');

    await user.click(toggleSwitch);

    expect(baseProps.onIncludeInGroupCalculationChange).toHaveBeenCalledWith(
      'GAME',
      1
    );
  });
});
