import { render, screen, fireEvent } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import userEvent from '@testing-library/user-event';
import AddPeriodPanel from '../AddPeriodPanel';

describe('AddPeriodPanel', () => {
  const defaultProps = {
    formationChanges: [
      {
        id: 1,
        kind: 'formation_change',
        absolute_minute: 0,
        relation: { id: 1, name: '4-4-2' },
        game_period_id: 1,
      },
      {
        id: 2,
        kind: 'formation_change',
        absolute_minute: 45,
        relation: { id: 2, name: '4-3-3' },
        game_period_id: 2,
      },
    ],
    formations: [
      { id: 1, number_of_players: 10, name: '4-4-2' },
      { id: 2, number_of_players: 11, name: '2-2-3' },
    ],
    t: i18nextTranslateStub(),
    nextPeriodNumber: 3,
    lastPeriodDuration: 30,
    period: null,
    disableDurationEdit: false,
    periodDuration: { min: 0, max: 20 },
    gameDuration: 90,
    onAdd: jest.fn(),
    onUpdate: jest.fn(),
    pitchViewEnabled: false,
  };

  const renderComponent = (props = defaultProps) =>
    render(<AddPeriodPanel {...props} />);

  it('displays a initial form if period with correct defaults if period is null', () => {
    renderComponent();
    expect(screen.getByText('Add Period')).toBeInTheDocument();
    expect(screen.getByLabelText('Title')).toHaveDisplayValue('Period 3');
    expect(screen.getAllByRole('spinbutton')[0]).toHaveDisplayValue('30');
    expect(screen.getAllByRole('spinbutton')[1]).toHaveDisplayValue('');
  });

  it('displays a initial form if period with correct defaults if period is not null', () => {
    renderComponent({
      ...defaultProps,
      period: {
        id: 3,
        name: 'Period 1',
        duration: 45,
        additional_duration: 3,
        order: 1,
      },
    });
    expect(screen.getByLabelText('Title')).toHaveDisplayValue('Period 1');
    expect(screen.getAllByRole('spinbutton')[0]).toHaveDisplayValue('45');
    expect(screen.getAllByRole('spinbutton')[1]).toHaveDisplayValue('3');
  });

  it('duration is disabled if disableDurationEdit is set to true and in edit mode', () => {
    renderComponent({
      ...defaultProps,
      period: {
        id: 3,
        name: 'Period 1',
        duration: 45,
        additional_duration: null,
        order: 1,
      },
      disableDurationEdit: true,
    });
    expect(
      screen.getByTestId('disabled-duration-property')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('disabled_additional_time_property')
    ).toBeInTheDocument();
  });

  it('calls the correct method with the correct data when save is clicked for adding a new period', async () => {
    renderComponent();
    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'Test Period' },
    });
    fireEvent.change(screen.getAllByRole('spinbutton')[0], {
      target: { value: 60 },
    });
    fireEvent.change(screen.getAllByRole('spinbutton')[1], {
      target: { value: 10 },
    });
    await userEvent.click(screen.getByText('Save'));
    expect(defaultProps.onAdd).toHaveBeenCalledWith(
      {
        additional_duration: 10,
        duration: 60,
        id: 0,
        name: 'Test Period',
        order: 0,
      },
      [
        {
          absolute_minute: 0,
          id: 1,
          minute: undefined,
          relation_id: 1,
          validation: {
            minute: { showError: false, valid: true },
            relation_id: { showError: true, valid: true },
          },
        },
        {
          absolute_minute: 45,
          id: 2,
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

  it('calls the correct method with the correct data when save is clicked for updating a existing period', async () => {
    renderComponent({
      ...defaultProps,
      period: {
        id: 3,
        name: 'Period 1',
        duration: 45,
        additional_duration: null,
        order: 1,
      },
    });

    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'Test Period' },
    });
    fireEvent.change(screen.getAllByRole('spinbutton')[0], {
      target: { value: 50 },
    });
    fireEvent.change(screen.getAllByRole('spinbutton')[1], {
      target: { value: 5 },
    });

    await userEvent.click(screen.getByText('Save'));
    expect(defaultProps.onUpdate).toHaveBeenCalledWith(
      {
        additional_duration: 5,
        duration: 50,
        id: 3,
        name: 'Test Period',
        order: 1,
      },
      [
        {
          absolute_minute: 0,
          id: 1,
          minute: undefined,
          relation_id: 1,
          validation: {
            minute: { showError: false, valid: true },
            relation_id: { showError: true, valid: true },
          },
        },
        {
          absolute_minute: 45,
          id: 2,
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

  it('when pitchViewEnabled is true only renders the appropriate needed fields', () => {
    renderComponent({ ...defaultProps, pitchViewEnabled: true });
    expect(screen.getByLabelText('Title')).toHaveDisplayValue('Period 3');
    expect(screen.getAllByRole('spinbutton')[0]).toHaveDisplayValue('30');
    expect(screen.getByTestId('disabled_title_property')).toBeInTheDocument();
    expect(
      screen.getByTestId('disabled-duration-property')
    ).toBeInTheDocument();
    expect(screen.queryByText('Additional time')).not.toBeInTheDocument();
  });

  it('when pitchViewIsEnabled and formation is changed then it displays a warning message', async () => {
    renderComponent({ ...defaultProps, pitchViewEnabled: true });
    await userEvent.click(screen.getAllByRole('textbox')[1]);
    await userEvent.click(screen.getAllByText('2-2-3')[0]);
    expect(
      screen.getByText('Changing formation will remove athlete events!')
    ).toBeInTheDocument();
    await userEvent.click(screen.getByText('Dismiss'));
    expect(
      screen.queryByText('Changing formation will remove athlete events!')
    ).not.toBeInTheDocument();
  });
});
