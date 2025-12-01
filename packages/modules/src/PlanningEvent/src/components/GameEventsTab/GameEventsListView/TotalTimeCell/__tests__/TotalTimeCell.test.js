import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { timeCellFormat } from '@kitman/common/src/consts/gameEventConsts';
import TotalTimeCell from '../index';

describe('TotalTimeCell', () => {
  const defaultProps = {
    type: timeCellFormat.period,
    athleteId: 1,
    positionGroups: [],
    t: i18nextTranslateStub(),
    periodDurations: [
      { min: 0, max: 45, id: 1 },
      { min: 45, max: 90, id: 2 },
      { min: 90, max: 105, id: 3 },
      { min: 105, max: 120, id: 4 },
    ],
    currentPeriod: { duration: 45 },
    gameActivities: [],
    isTimeEditable: false,
    manualPlayerPeriodTimeInfo: null,
    manualPlayerSummaryTimeInfo: null,
    handleUpdatingManualAthletePlayTimeInfo: jest.fn(),
  };

  const componentRender = (props = defaultProps) =>
    render(<TotalTimeCell {...props} />);

  describe('Default NonEditable Time Render', () => {
    it('shows the correct total of minutes from the positions, if a player was subbed off later in the match', async () => {
      const positions = [
        {
          id: 1,
          kind: 'position_change',
          absolute_minute: 0,
          relation: { id: 1, name: 'Att' },
          game_period_id: 1,
        },
        {
          id: 5,
          kind: 'position_change',
          absolute_minute: 30,
          relation: { id: 4, name: 'Mid' },
          game_period_id: 1,
        },
        {
          id: 2,
          kind: 'position_change',
          absolute_minute: 45,
          relation: { id: 2, name: 'Def' },
          game_period_id: 2,
        },
        {
          id: 3,
          kind: 'position_change',
          absolute_minute: 90,
          relation: { id: 1, name: 'Att' },
          game_period_id: 3,
        },
        {
          id: 4,
          kind: 'position_change',
          absolute_minute: 105,
          relation: { id: 'SUBSTITUTE', name: 'Sub' },
          game_period_id: 4,
        },
      ];
      const user = userEvent.setup();
      componentRender({ ...defaultProps, gameActivities: positions });
      expect(screen.getByText('105')).toBeInTheDocument();
      expect(screen.queryByTestId('TotalTime|Edit')).not.toBeInTheDocument();
      await user.hover(screen.getByText('105'));
      expect(screen.getAllByText('45')[0]).toBeInTheDocument(); // att
      expect(screen.getAllByText('15')[0]).toBeInTheDocument(); // mid
      expect(screen.getAllByText('45')[1]).toBeInTheDocument(); // def
      expect(screen.getAllByText('15')[1]).toBeInTheDocument(); // sub
    });

    it('shows the correct total of minutes from the positions, if a player was a sub at the start of the match', async () => {
      // sub for 40
      // mid for 5 in 1st period
      // def for 45 in 2nd period
      // att for 15 mins in 3rd period
      // didnt play in 4th period
      const positions = [
        {
          id: 1,
          kind: 'position_change',
          absolute_minute: 0,
          relation: { id: 'SUBSTITUTE', name: 'Sub' },
          game_period_id: 1,
        },
        {
          id: 5,
          kind: 'position_change',
          absolute_minute: 40,
          relation: { id: 4, name: 'Mid' },
          game_period_id: 1,
        },
        {
          id: 2,
          kind: 'position_change',
          absolute_minute: 45,
          relation: { id: 2, name: 'Def' },
          game_period_id: 2,
        },
        {
          id: 3,
          kind: 'position_change',
          absolute_minute: 90,
          relation: { id: 1, name: 'Att' },
          game_period_id: 3,
        },
      ];
      const user = userEvent.setup();
      componentRender({ ...defaultProps, gameActivities: positions });
      expect(screen.getByText('65')).toBeInTheDocument();
      await user.hover(screen.getByText('65'));
      expect(screen.getByText('40')).toBeInTheDocument(); // sub
      expect(screen.getByText('5')).toBeInTheDocument(); // mid
      expect(screen.getByText('45')).toBeInTheDocument(); // def
      expect(screen.getByText('15')).toBeInTheDocument(); // att
    });

    it('shows the correct total of minutes from the positions, if player has only 1 position', async () => {
      // only has game time for 1st period
      const positions = [
        {
          id: 1,
          kind: 'position_change',
          absolute_minute: 0,
          relation: { id: 1, name: 'Att' },
          game_period_id: 1,
        },
      ];
      const user = userEvent.setup();
      componentRender({ ...defaultProps, gameActivities: positions });
      expect(screen.getByText('45')).toBeInTheDocument();
      await user.hover(screen.getByText('45'));

      expect(screen.getAllByText('45').length).toEqual(2); // total and att
    });

    it('shows the correct total of minutes from the positions, if player has  2 positios', async () => {
      const positions = [
        {
          id: 1,
          kind: 'position_change',
          absolute_minute: 0,
          relation: { id: 1, name: 'Att' },
          game_period_id: 1,
        },
        {
          id: 2,
          kind: 'position_change',
          absolute_minute: 45,
          relation: { id: 2, name: 'Def' },
          game_period_id: 2,
        },
      ];
      const user = userEvent.setup();
      componentRender({ ...defaultProps, gameActivities: positions });
      expect(screen.getByText('90')).toBeInTheDocument();
      await user.hover(screen.getByText('90'));

      expect(screen.getAllByText('45').length).toEqual(2); // att and def
    });

    it('shows a zero, if only has a single sub position', async () => {
      // player was brought on at 40 mins, so missed 40 mins of 120 minute match
      const positions = [
        {
          id: 1,
          kind: 'position_change',
          absolute_minute: 0,
          relation: { id: 'SUBSTITUTE', name: 'Sub' },
          game_period_id: 1,
        },
      ];
      componentRender({ ...defaultProps, gameActivities: positions });
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('shows a zero, if only has a single sub position, even if minute was later in period', async () => {
      // player was brought on at 40 mins, so missed 40 mins of 120 minute match
      const positions = [
        {
          id: 1,
          kind: 'position_change',
          absolute_minute: 30,
          relation: { id: 'SUBSTITUTE', name: 'Sub' },
          game_period_id: 1,
        },
      ];
      componentRender({ ...defaultProps, gameActivities: positions });
      expect(screen.getByText('0')).toBeInTheDocument();
    });
  });

  describe('Editable Period Time Cell render', () => {
    const manualTimeInfoMock = {
      athlete_id: 1,
      minutes: 0,
      game_period_id: 1,
      position_id: 4,
    };

    const mockPosition = [
      {
        id: 1,
        kind: 'position_change',
        absolute_minute: 0,
        relation: { id: 1, name: 'Att' },
        game_period_id: 1,
      },
    ];

    it('allows the user to set a new manual time when editing on blur', async () => {
      const user = userEvent.setup();
      componentRender({
        ...defaultProps,
        gameActivities: mockPosition,
        manualPlayerPeriodTimeInfo: manualTimeInfoMock,
        isTimeEditable: true,
      });
      await user.click(screen.getByTestId('TotalTime|Sum Editable'));
      await user.type(screen.getByRole('spinbutton'), '34');
      await user.click(document.body);
      expect(
        defaultProps.handleUpdatingManualAthletePlayTimeInfo
      ).toHaveBeenCalledWith(34, 1);
    });

    it('allows the user to set a new manual time when editing on escape/enter press', async () => {
      const user = userEvent.setup();
      componentRender({
        ...defaultProps,
        gameActivities: mockPosition,
        manualPlayerPeriodTimeInfo: manualTimeInfoMock,
        isTimeEditable: true,
      });
      await user.click(screen.getByTestId('TotalTime|Sum Editable'));
      await user.type(screen.getByRole('spinbutton'), '34');
      await user.keyboard('[Enter]');
      expect(
        defaultProps.handleUpdatingManualAthletePlayTimeInfo
      ).toHaveBeenCalledWith(34, 1);

      await user.click(screen.getByTestId('TotalTime|Sum Editable'));
      await user.clear(screen.getByRole('spinbutton'));
      await user.type(screen.getByRole('spinbutton'), '24');
      await user.keyboard('[Escape]');
      expect(
        defaultProps.handleUpdatingManualAthletePlayTimeInfo
      ).toHaveBeenCalledWith(24, 1);
    });

    it('allows the user to not set a new invalid manual time when editing', async () => {
      const user = userEvent.setup();
      componentRender({
        ...defaultProps,
        gameActivities: mockPosition,
        manualPlayerPeriodTimeInfo: manualTimeInfoMock,
        isTimeEditable: true,
      });
      await user.click(screen.getByTestId('TotalTime|Sum Editable'));
      await user.type(screen.getByRole('spinbutton'), '50');
      await user.keyboard('[Escape]');
      expect(
        defaultProps.handleUpdatingManualAthletePlayTimeInfo
      ).not.toHaveBeenCalled();
      await user.click(screen.getByTestId('TotalTime|Sum Editable'));
      await user.type(screen.getByRole('spinbutton'), '0');
      await user.keyboard('[Escape]');
      expect(
        defaultProps.handleUpdatingManualAthletePlayTimeInfo
      ).not.toHaveBeenCalled();
    });

    it('allows the user to see the displayed manual time instead of the automatic time', async () => {
      const user = userEvent.setup();
      componentRender({
        ...defaultProps,
        gameActivities: mockPosition,
        manualPlayerPeriodTimeInfo: { ...manualTimeInfoMock, minutes: 25 },
        isTimeEditable: true,
      });
      expect(screen.getByText('25')).toBeInTheDocument();
      await user.hover(screen.getByText('25'));
      expect(screen.getAllByText('25').length).toEqual(2);
    });

    it('renders the auto time period summary for a sub with manual times', async () => {
      const user = userEvent.setup();
      componentRender({
        ...defaultProps,
        type: timeCellFormat.period,
        manualPlayerPeriodTimeInfo: { ...manualTimeInfoMock, minutes: 25 },
        isTimeEditable: true,
      });

      expect(screen.getByText('25')).toBeInTheDocument();
      await user.hover(screen.getByText('25'));
      expect(screen.getByText('SUB')).toBeInTheDocument();
      expect(screen.getAllByText('25').length).toEqual(2);
    });

    it('renders the auto time period summary for a sub with manual time that is the same as the duration of the period', async () => {
      componentRender({
        ...defaultProps,
        type: timeCellFormat.period,
        manualPlayerPeriodTimeInfo: { ...manualTimeInfoMock, minutes: 45 },
        isTimeEditable: true,
      });

      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('allows the user to set a sub manual time back to 0', async () => {
      const user = userEvent.setup();
      componentRender({
        ...defaultProps,
        type: timeCellFormat.period,
        gameActivities: [
          {
            id: 1,
            kind: 'position_change',
            absolute_minute: 0,
            relation: { id: 1, name: 'Other' },
            game_period_id: 1,
          },
        ],
        manualPlayerPeriodTimeInfo: {
          ...manualTimeInfoMock,
          minutes: 25,
          position_id: null,
        },
        isTimeEditable: true,
      });

      await user.click(screen.getByTestId('TotalTime|Sum Editable'));
      await user.clear(screen.getByRole('spinbutton'));
      await user.type(screen.getByRole('spinbutton'), '0');
      await user.keyboard('[Escape]');
      expect(
        defaultProps.handleUpdatingManualAthletePlayTimeInfo
      ).toHaveBeenCalledWith(0, 1);
    });
  });

  describe('Manual Summary Time Cell render', () => {
    const manualTimeInfoMock = [
      {
        athlete_id: 1,
        minutes: 30,
        game_period_id: 1,
      },
      {
        athlete_id: 1,
        minutes: 40,
        game_period_id: 2,
      },
    ];

    const mockPositions = [
      {
        id: 1,
        kind: 'position_change',
        absolute_minute: 0,
        relation: { id: 1, name: 'Att' },
        game_period_id: 1,
      },
      {
        id: 2,
        kind: 'position_change',
        absolute_minute: 45,
        relation: { id: 1, name: 'Att' },
        game_period_id: 2,
      },
    ];

    it('renders the appropriate manual time summary for both periods', async () => {
      const user = userEvent.setup();
      componentRender({
        ...defaultProps,
        type: timeCellFormat.summary,
        gameActivities: mockPositions,
        manualPlayerSummaryTimeInfo: manualTimeInfoMock,
      });

      expect(screen.getByText('70')).toBeInTheDocument();
      await user.hover(screen.getByText('70'));
      expect(screen.getAllByText('70').length).toEqual(2);
    });

    it('renders the appropriate mix of manual and auto time summary for both periods', async () => {
      const user = userEvent.setup();
      componentRender({
        ...defaultProps,
        type: timeCellFormat.summary,
        gameActivities: mockPositions,
        manualPlayerSummaryTimeInfo: [
          manualTimeInfoMock[0],
          { ...manualTimeInfoMock[1], minutes: 0 },
        ],
      });

      expect(screen.getByText('75')).toBeInTheDocument();
      await user.hover(screen.getByText('75'));
      expect(screen.getAllByText('75').length).toEqual(2);
    });

    it('renders the auto time summary for both periods', async () => {
      const user = userEvent.setup();
      componentRender({
        ...defaultProps,
        type: timeCellFormat.summary,
        gameActivities: mockPositions,
        manualPlayerSummaryTimeInfo: null,
      });

      expect(screen.getByText('90')).toBeInTheDocument();
      await user.hover(screen.getByText('90'));
      expect(screen.getAllByText('90').length).toEqual(2);
    });

    it('renders the auto time summary for a sub with manual times', async () => {
      const user = userEvent.setup();
      componentRender({
        ...defaultProps,
        type: timeCellFormat.summary,
        manualPlayerSummaryTimeInfo: manualTimeInfoMock,
      });

      expect(screen.getByText('70')).toBeInTheDocument();
      await user.hover(screen.getByText('70'));
      expect(screen.getByText('SUB')).toBeInTheDocument();
      expect(screen.getAllByText('70').length).toEqual(2);
    });

    it('renders the auto time summary for a player with manual times the same as the period durationss', async () => {
      componentRender({
        ...defaultProps,
        type: timeCellFormat.summary,
        manualPlayerSummaryTimeInfo: [
          { ...manualTimeInfoMock[0], minutes: 45 },
          { ...manualTimeInfoMock[0], minutes: 45 },
        ],
      });

      expect(screen.getByText('0')).toBeInTheDocument();
    });
  });
});
