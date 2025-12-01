import { render, screen, fireEvent } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import userEvent from '@testing-library/user-event';
import AddFormations from '../AddFormations';

describe('AddFormation', () => {
  const defaultProps = {
    event: { id: 1 },
    formationChanges: [
      {
        id: 1,
        kind: 'formation_change',
        absolute_minute: 10,
        relation: { id: 1 },
      },
      {
        id: 2,
        kind: 'formation_change',
        absolute_minute: 30,
        relation: { id: 2 },
      },
    ],
    formationChangeUpdates: [],
    formations: [
      { id: 1, number_of_players: 10, name: '2-3-3' },
      { id: 2, number_of_players: 11, name: '4-4-2' },
    ],
    isOpen: true,
    onClose: jest.fn(),
    onFormationChangesUpdate: jest.fn(),
    t: i18nextTranslateStub(),
    onUpdate: jest.fn(),
    periodDuration: {
      min: 45,
      max: 90,
    },
    pitchViewEnabled: false,
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  const renderComponent = (props = defaultProps) =>
    render(<AddFormations {...props} />);

  it('renders the list of formation changes', () => {
    renderComponent();
    expect(screen.getAllByText('Formation')[0]).toBeInTheDocument();
    expect(screen.getByText('2-3-3')).toBeInTheDocument();
    expect(screen.getByText('4-4-2')).toBeInTheDocument();
    expect(screen.getAllByRole('spinbutton')[0]).toHaveDisplayValue('10');
    expect(screen.getAllByRole('spinbutton')[1]).toHaveDisplayValue('30');
  });

  it('doesnt allow a minute outside the period duration', async () => {
    renderComponent({ ...defaultProps, formationChanges: [] });
    fireEvent.change(screen.getAllByRole('spinbutton')[0], {
      target: { value: '30' },
    });
    fireEvent.blur(screen.getAllByRole('spinbutton')[0]);
    expect(screen.getByTestId('invalid_minute_property')).toBeInTheDocument();
  });

  it('allows a minute inside the period duration', async () => {
    renderComponent({ ...defaultProps, formationChanges: [] });
    fireEvent.change(screen.getAllByRole('spinbutton')[0], {
      target: { value: '60' },
    });
    fireEvent.blur(screen.getAllByRole('spinbutton')[0]);
    expect(screen.getAllByRole('spinbutton')[0]).toHaveDisplayValue('60');
    expect(
      screen.queryByTestId('invalid_minute_property')
    ).not.toBeInTheDocument();
  });

  it('add an empty form when add formation button is clicked', async () => {
    renderComponent({ ...defaultProps, formationChanges: [] });
    await userEvent.click(screen.getByText('Add formation'));
    expect(screen.getAllByRole('textbox')[1]).toHaveDisplayValue('');
    expect(screen.getAllByRole('spinbutton')[1]).toHaveDisplayValue('45');
  });

  it('when pitch view is enabled and the period has not started, hides and only displays the relevant fields', () => {
    renderComponent({
      ...defaultProps,
      formationChanges: [],
      pitchViewEnabled: true,
    });
    expect(screen.getByRole('textbox')).toHaveDisplayValue('');
    expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument();
    expect(screen.queryByText('Add formation')).not.toBeInTheDocument();
  });

  describe('pitch view enabled and period is in progress', () => {
    const initialFormationChange = {
      id: 1,
      absolute_minute: 0,
      relation: { id: 2, number_of_players: 11, name: '4-4-2' },
      kind: 'formation_change',
    };
    beforeEach(() => {
      renderComponent({
        ...defaultProps,
        gameActivities: [initialFormationChange],
        formationChanges: [initialFormationChange],
        formationChangeUpdates: [initialFormationChange],
        hasPeriodStarted: true,
        pitchViewEnabled: true,
      });
    });

    it('allows the user to add a formation which is always 1 minute higher than the previous one', async () => {
      await userEvent.click(screen.getByText('Add formation'));
      expect(screen.getAllByRole('spinbutton')[1]).toHaveDisplayValue('1');
    });

    it('allows the user to add a formation and set the formation', async () => {
      await userEvent.click(screen.getByText('Add formation'));
      await userEvent.click(screen.getAllByText('Formation')[2]);
      await userEvent.click(screen.getAllByText('4-4-2')[1]);
      expect(screen.getAllByText('4-4-2').length).toEqual(2);
    });

    it('allows the user to add a formation and change the minute', async () => {
      await userEvent.click(screen.getByText('Add formation'));
      fireEvent.change(screen.getAllByRole('spinbutton')[1], {
        target: { value: '60' },
      });
      fireEvent.blur(screen.getAllByRole('spinbutton')[1]);
      expect(screen.getAllByRole('spinbutton')[1]).toHaveDisplayValue('60');
    });

    it('allows a user to add a formation and remove it', async () => {
      defaultProps.onUpdate.mockReset();
      await userEvent.click(screen.getByText('Add formation'));
      expect(defaultProps.onUpdate).toHaveBeenCalledTimes(1);
      await userEvent.click(screen.getAllByRole('button')[1]);
      expect(defaultProps.onUpdate).toHaveBeenCalledTimes(2);
      expect(defaultProps.onUpdate).toHaveBeenCalledWith(
        [
          {
            absolute_minute: 0,
            id: 1,
            minute: undefined,
            relation_id: 2,
            validation: {
              minute: { showError: false, valid: true },
              relation_id: { showError: true, valid: true },
            },
          },
        ],
        []
      );
    });
  });
});
