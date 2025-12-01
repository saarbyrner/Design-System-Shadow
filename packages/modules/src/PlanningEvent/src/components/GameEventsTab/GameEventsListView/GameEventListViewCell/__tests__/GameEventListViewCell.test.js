import $ from 'jquery';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { eventTypes } from '@kitman/common/src/consts/gameEventConsts';
import GameEventListViewCell from '../index';

describe('GameEventListViewCell', () => {
  const defaultProps = {
    event: { id: 1, squad: { owner_id: 1 } },
    athlete: { id: 1 },
    athletes: [
      { id: 1, firstname: 'Athlete', lastname: 'One', fullname: 'Athlete One' },
      { id: 2, firstname: 'Athlete', lastname: 'Two', fullname: 'Athlete Two' },
      {
        id: 3,
        firstname: 'Athlete',
        lastname: 'Three',
        fullname: 'Athlete Three',
      },
    ],
    positionGroups: [
      {
        id: 1,
        name: 'Position Group 1',
        positions: [
          { id: 1, name: 'Position 1', abbreviation: 'P1' },
          { id: 2, name: 'Position 2', abbreviation: 'P2' },
        ],
      },
    ],
    gameActivityKind: eventTypes.yellow,
    cellGameActivities: [
      {
        id: 1,
        kind: eventTypes.yellow,
        minute: 40,
        absolute_minute: 40,
        athlete_id: 1,
      },
      {
        id: 4,
        kind: eventTypes.yellow,
        minute: 62,
        absolute_minute: 62,
        athlete_id: 1,
      },
    ],
    hasPeriodStarted: true,
    gameActivities: [],
    formationCoordinates: { '1_5': { id: 1, position: { id: 2 } } },
    periodDuration: { min: 0, max: 45, duration: 45 },
    onGameActivitiesUpdate: jest.fn(),
    canEditEvent: true,
    dispatchMandatoryFieldsToast: jest.fn(),
    preventGameEvents: false,
    isCellDisabled: false,
    t: i18nextTranslateStub(),
  };

  const renderComponent = (props = defaultProps) =>
    render(<GameEventListViewCell {...props} />);

  describe('initial renders', () => {
    it('renders the list of gameActivities times in the tooltip trigger button', () => {
      renderComponent();
      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.getByText('40’, 62’')).toBeInTheDocument();
    });

    it('does not display the tooltip button when the user does not have the correct permission', () => {
      renderComponent({ ...defaultProps, canEditEvent: false });
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
      expect(screen.getByText('40’, 62’')).toBeInTheDocument();
    });

    it('renders the gameActivity form in the tooltip', async () => {
      const user = userEvent.setup();
      renderComponent();
      await user.click(screen.getByRole('button'));
      expect(screen.getByText('Yellow')).toBeInTheDocument();
      // First gameActivity
      expect(screen.getByText('1.')).toBeInTheDocument();
      expect(screen.getByDisplayValue('40')).toBeInTheDocument();
      // Second gameActivity
      expect(screen.getByText('2.')).toBeInTheDocument();
      expect(screen.getByDisplayValue('62')).toBeInTheDocument();
    });

    it("renders the text 'No Event' after removing all fields", async () => {
      const user = userEvent.setup();
      renderComponent({ ...defaultProps, cellGameActivities: [] });
      await user.click(screen.getByRole('button'));
      await user.click(
        screen.getByTestId('GameEventListViewCell|DeleteButton')
      );
      expect(screen.getByText('No Event')).toBeInTheDocument();
    });
  });

  describe('gameActivity form', () => {
    it('renders the correct default form when the list of activities is empty', async () => {
      const user = userEvent.setup();
      renderComponent({
        ...defaultProps,
        gameActivityKind: eventTypes.position_change,
        cellGameActivities: [],
      });
      await user.click(screen.getByRole('button'));
      expect(screen.getByDisplayValue('0')).toBeInTheDocument();
    });

    it('renders a gameActivity form that contains a position dropdown', async () => {
      const user = userEvent.setup();
      renderComponent({
        ...defaultProps,
        gameActivityKind: eventTypes.position_change,
        cellGameActivities: [
          {
            id: 1,
            kind: eventTypes.position_change,
            minute: 0,
            absolute_minute: 0,
            athlete_id: 1,
            relation: { id: 1 },
          },
          {
            id: 4,
            kind: eventTypes.position_change,
            minute: 62,
            absolute_minute: 62,
            athlete_id: 1,
            relation: { id: 'SUBSTITUTE' },
          },
        ],
      });
      await user.click(screen.getByRole('button'));
      expect(screen.getByText('P1, SUB (62’)')).toBeInTheDocument();

      // First Game Activity
      expect(screen.getByText('1.')).toBeInTheDocument();
      expect(screen.getByText('P1')).toBeInTheDocument();
      expect(screen.getByDisplayValue('0')).toBeInTheDocument();

      // Second Game Activity
      expect(screen.getByText('2.')).toBeInTheDocument();
      expect(screen.getByText('SUB')).toBeInTheDocument();
      expect(screen.getByDisplayValue('62')).toBeInTheDocument();
    });

    it('renders a gameActivity cell that contains 1 goal', async () => {
      renderComponent({
        ...defaultProps,
        gameActivityKind: eventTypes.goal,
        cellGameActivities: [
          {
            id: 1,
            kind: eventTypes.goal,
            athlete_id: 1,
            minute: 16,
            absolute_minute: 16,
            game_period_id: 1,
          },
        ],
      });
      expect(screen.getByText('16’')).toBeInTheDocument();
    });

    it('renders a gameActivity cell that contains 2 goals', async () => {
      renderComponent({
        ...defaultProps,
        gameActivityKind: eventTypes.goal,
        cellGameActivities: [
          {
            id: 1,
            kind: eventTypes.goal,
            athlete_id: 1,
            minute: 16,
            absolute_minute: 16,
            game_period_id: 1,
          },
          {
            id: 2,
            kind: eventTypes.goal,
            athlete_id: 1,
            minute: 25,
            absolute_minute: 25,
            game_period_id: 1,
          },
        ],
      });
      expect(screen.getByText('16’, 25’')).toBeInTheDocument();
    });

    it('validates position field on save', async () => {
      const user = userEvent.setup();
      renderComponent({
        ...defaultProps,
        gameActivityKind: eventTypes.position_change,
        cellGameActivities: [],
      });
      await user.click(screen.getByRole('button'));
      await user.click(screen.getByText('Save'));
      expect(
        screen.getByTestId('invalid-position-selection')
      ).toBeInTheDocument();
    });

    it('validates the minute field on blur', async () => {
      const user = userEvent.setup();
      renderComponent({
        ...defaultProps,
        period: {
          absolute_duration_start: 0,
          absolute_duration_end: 45,
          duration: 45,
          id: 1,
        },
        cellGameActivities: [],
      });
      await user.click(screen.getByRole('button'));
      await user.click(screen.getByRole('spinbutton'));
      fireEvent.change(screen.getByRole('spinbutton'), {
        target: { value: '55' },
      });
      fireEvent.blur(screen.getByRole('spinbutton'));
      expect(screen.getByTestId('invalid-minute-input')).toBeInTheDocument();
    });

    describe('when the save request is successful', () => {
      let saveGameActivitiesRequest;

      beforeEach(() => {
        const deferred = $.Deferred();
        saveGameActivitiesRequest = jest
          .spyOn($, 'ajax')
          .mockImplementation(() => deferred.resolve([]));
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('sends the correct request', async () => {
        const user = userEvent.setup();
        renderComponent({
          ...defaultProps,
          athletes: [
            {
              id: 1,
              firstname: 'Athlete',
              lastname: 'One',
              fullname: 'Athlete One',
            },
          ],
          gameActivityKind: eventTypes.position_change,
          cellGameActivities: [],
          gameActivities: [
            {
              id: 6,
              kind: eventTypes.formation_complete,
              minute: 0,
              absolute_minute: 0,
              game_period_id: 1,
            },
          ],
        });
        await user.click(screen.getByRole('button'));
        await user.click(screen.getByText('Position'));
        await user.click(screen.getAllByText('SUB')[1]);
        await user.click(screen.getByText('Save'));
        expect(saveGameActivitiesRequest.mock.calls[0][0].data).toEqual(
          JSON.stringify({
            game_activities: [
              {
                minute: 0,
                absolute_minute: 0,
                relation_id: null,
                athlete_id: 1,
                kind: eventTypes.position_change,
              },
            ],
          })
        );
      });

      it('sends the correct request when there is a period in props', async () => {
        const user = userEvent.setup();
        renderComponent({
          ...defaultProps,
          gameActivityKind: eventTypes.goal,
          cellGameActivities: [
            { kind: eventTypes.goal, absolute_minute: 0, athlete_id: 1 },
          ],
          period: {
            absolute_duration_start: 0,
            absolute_duration_end: 30,
            duration: 30,
            id: 1,
          },
          periodDuration: { min: 0, max: 30 },
        });
        await user.click(screen.getByRole('button'));
        fireEvent.change(screen.getByRole('spinbutton'), {
          target: { value: '20' },
        });
        await user.click(screen.getByText('Save'));
        expect(saveGameActivitiesRequest).toHaveBeenCalledWith({
          contentType: 'application/json',
          data: '{"game_activities":[{"athlete_id":1,"absolute_minute":"20","kind":"goal"}]}',
          method: 'POST',
          url: '/ui/planning_hub/events/1/game_periods/1/v2/game_activities/bulk_save',
        });
      });

      describe('[feature-flag: planning-game-events-field-view]', () => {
        beforeEach(() => {
          window.featureFlags = { 'planning-game-events-field-view': true };
        });

        afterEach(() => {
          window.featureFlags = { 'planning-game-events-field-view': false };
        });

        it('sends the correct request with ff on', async () => {
          const user = userEvent.setup();
          renderComponent({
            ...defaultProps,
            gameActivityKind: eventTypes.position_change,
            cellGameActivities: [],
            period: {
              absolute_duration_start: 0,
              absolute_duration_end: 30,
              duration: 30,
              id: 1,
            },
            periodDuration: { min: 0, max: 30 },
          });
          await user.click(screen.getByRole('button'));
          await user.click(screen.getByText('Position'));
          await user.click(screen.getByText('Sub'));
          fireEvent.change(screen.getByRole('spinbutton'), {
            target: { value: '20' },
          });
          await user.click(screen.getByText('Save'));
          expect(saveGameActivitiesRequest).toHaveBeenCalledWith({
            contentType: 'application/json',
            data: '{"game_activities":[{"absolute_minute":"20","relation_id":null,"athlete_id":1,"kind":"formation_position_view_change"},{"absolute_minute":"20","relation_id":null,"athlete_id":1,"kind":"position_change"}]}',
            method: 'POST',
            url: '/ui/planning_hub/events/1/game_periods/1/v2/game_activities/bulk_save',
          });
        });

        it('removes the position_change and formation_position_view_change with ff on', async () => {
          const user = userEvent.setup();
          renderComponent({
            ...defaultProps,
            gameActivityKind: eventTypes.position_change,
            cellGameActivities: [
              {
                id: 1,
                kind: eventTypes.position_change,
                athlete_id: 2,
                relation_id: 1,
                absolute_minute: 10,
              },
            ],
            gameActivities: [
              {
                id: 1,
                kind: eventTypes.position_change,
                athlete_id: 2,
                relation_id: 1,
                absolute_minute: 10,
              },
              {
                id: 2,
                game_activity_id: 1,
                kind: eventTypes.formation_position_view_change,
                athlete_id: 2,
                relation: { id: 1 },
                absolute_minute: 10,
              },
            ],
            period: {
              absolute_duration_start: 0,
              absolute_duration_end: 30,
              duration: 30,
              id: 1,
            },
          });
          await user.click(screen.getByRole('button'));
          await user.click(
            screen.getByTestId('GameEventListViewCell|DeleteButton')
          );
          await user.click(screen.getByText('Save'));
          expect(saveGameActivitiesRequest).toHaveBeenCalledWith({
            contentType: 'application/json',
            data: '{"game_activities":[{"id":1,"delete":true},{"id":2,"delete":true}]}',
            method: 'POST',
            url: '/ui/planning_hub/events/1/game_periods/1/v2/game_activities/bulk_save',
          });
        });

        it('removes the red card when a yellow is removed with ff on', async () => {
          const user = userEvent.setup();
          renderComponent({
            ...defaultProps,
            gameActivityKind: eventTypes.yellow,
            cellGameActivities: [
              {
                id: 1,
                kind: eventTypes.yellow,
                athlete_id: 2,
                absolute_minute: 1,
              },
              {
                id: 2,
                kind: eventTypes.yellow,
                athlete_id: 2,
                absolute_minute: 10,
              },
            ],
            gameActivities: [
              {
                id: 1,
                kind: eventTypes.yellow,
                athlete_id: 2,
                absolute_minute: 1,
              },
              {
                id: 2,
                kind: eventTypes.yellow,
                athlete_id: 2,
                absolute_minute: 10,
              },
              {
                id: 3,
                kind: eventTypes.red,
                athlete_id: 2,
                absolute_minute: 10,
              },
            ],
            period: {
              absolute_duration_start: 0,
              absolute_duration_end: 30,
              duration: 30,
              id: 1,
            },
          });
          await user.click(screen.getByRole('button'));
          await user.click(
            screen.getAllByTestId('GameEventListViewCell|DeleteButton')[0]
          );
          await user.click(screen.getByText('Save'));
          expect(saveGameActivitiesRequest).toHaveBeenCalledWith({
            contentType: 'application/json',
            data: '{"game_activities":[{"id":1,"delete":true},{"id":3,"delete":true},{"id":2,"athlete_id":2,"absolute_minute":10,"kind":"yellow_card"}]}',
            method: 'POST',
            url: '/ui/planning_hub/events/1/game_periods/1/v2/game_activities/bulk_save',
          });
        });

        it('removes the corresponding yellow card when a red is removed with ff on', async () => {
          const user = userEvent.setup();
          renderComponent({
            ...defaultProps,
            gameActivityKind: eventTypes.red,
            cellGameActivities: [
              {
                id: 3,
                kind: eventTypes.red,
                athlete_id: 2,
                absolute_minute: 10,
              },
            ],
            gameActivities: [
              {
                id: 1,
                kind: eventTypes.yellow,
                athlete_id: 2,
                absolute_minute: 1,
              },
              {
                id: 2,
                kind: eventTypes.yellow,
                athlete_id: 2,
                absolute_minute: 10,
              },
              {
                id: 3,
                kind: eventTypes.red,
                athlete_id: 2,
                absolute_minute: 10,
              },
            ],
            period: {
              absolute_duration_start: 0,
              absolute_duration_end: 30,
              duration: 30,
              id: 1,
            },
            periodDuration: { min: 0, max: 30 },
          });
          await user.click(screen.getByRole('button'));
          await user.click(
            screen.getByTestId('GameEventListViewCell|DeleteButton')
          );
          await user.click(screen.getByText('Save'));
          expect(saveGameActivitiesRequest).toHaveBeenCalledWith({
            contentType: 'application/json',
            data: '{"game_activities":[{"id":3,"delete":true},{"id":2,"delete":true}]}',
            method: 'POST',
            url: '/ui/planning_hub/events/1/game_periods/1/v2/game_activities/bulk_save',
          });
        });

        it('removes the substitution, position_change and formation_position_view_change with ff on', async () => {
          const user = userEvent.setup();
          renderComponent({
            ...defaultProps,
            gameActivityKind: eventTypes.sub,
            cellGameActivities: [
              {
                id: 1,
                kind: eventTypes.sub,
                athlete_id: 2,
                relation_id: 1,
                absolute_minute: '',
              },
            ],
            gameActivities: [
              {
                id: 2,
                kind: eventTypes.position_change,
                athlete_id: 2,
                relation: { id: 1 },
              },
              {
                id: 3,
                kind: eventTypes.formation_position_view_change,
                athlete_id: 2,
                relation: { id: 1 },
              },
              {
                id: 4,
                kind: eventTypes.position_change,
                athlete_id: 1,
                relation: null,
              },
              {
                id: 5,
                kind: eventTypes.formation_position_view_change,
                athlete_id: 1,
                relation: null,
              },
            ],
            period: {
              absolute_duration_start: 0,
              absolute_duration_end: 30,
              duration: 30,
              id: 1,
            },
          });
          await user.click(screen.getByRole('button'));
          await user.click(
            screen.getByTestId('GameEventListViewCell|DeleteButton')
          );
          await user.click(screen.getByText('Save'));
          expect(saveGameActivitiesRequest).toHaveBeenCalledWith({
            contentType: 'application/json',
            data: '{"game_activities":[{"id":1,"delete":true},{"id":2,"delete":true},{"id":3,"delete":true},{"id":4,"delete":true},{"id":5,"delete":true}]}',
            method: 'POST',
            url: '/ui/planning_hub/events/1/game_periods/1/v2/game_activities/bulk_save',
          });
        });

        it('removes the position_swap, position_change and formation_position_view_change with ff on', async () => {
          const user = userEvent.setup();
          renderComponent({
            ...defaultProps,
            gameActivityKind: eventTypes.sub,
            cellGameActivities: [
              {
                id: 1,
                kind: eventTypes.switch,
                athlete_id: 2,
                relation_id: 1,
                absolute_minute: 10,
              },
            ],
            gameActivities: [
              {
                id: 2,
                kind: eventTypes.position_change,
                athlete_id: 2,
                relation: { id: 1 },
              },
              {
                id: 3,
                kind: eventTypes.formation_position_view_change,
                athlete_id: 2,
                relation: { id: 1 },
              },
              {
                id: 4,
                kind: eventTypes.position_change,
                athlete_id: 1,
                relation: null,
              },
              {
                id: 5,
                kind: eventTypes.formation_position_view_change,
                athlete_id: 1,
                relation: null,
              },
            ],
            period: {
              absolute_duration_start: 0,
              absolute_duration_end: 30,
              duration: 30,
              id: 1,
            },
          });
          await user.click(screen.getByRole('button'));
          await user.click(
            screen.getByTestId('GameEventListViewCell|DeleteButton')
          );
          await user.click(screen.getByText('Save'));
          expect(saveGameActivitiesRequest).toHaveBeenCalledWith({
            contentType: 'application/json',
            data: '{"game_activities":[{"id":1,"delete":true},{"id":2,"delete":true},{"id":3,"delete":true},{"id":4,"delete":true},{"id":5,"delete":true}]}',
            method: 'POST',
            url: '/ui/planning_hub/events/1/game_periods/1/v2/game_activities/bulk_save',
          });
        });

        it('renders a gameActivity cell that contains 1 goal with ff on', async () => {
          renderComponent({
            ...defaultProps,
            gameActivityKind: eventTypes.goal,
            cellGameActivities: [
              {
                id: 1,
                kind: eventTypes.goal,
                athlete_id: 1,
                minute: 16,
                absolute_minute: 16,
                game_period_id: 1,
              },
            ],
          });
          expect(screen.getByText('1 (16’)')).toBeInTheDocument();
        });

        it('renders a gameActivity cell that contains 2 goals with ff on', async () => {
          renderComponent({
            ...defaultProps,
            gameActivityKind: eventTypes.goal,
            cellGameActivities: [
              {
                id: 1,
                kind: eventTypes.goal,
                athlete_id: 1,
                minute: 16,
                absolute_minute: 16,
                game_period_id: 1,
              },
              {
                id: 2,
                kind: eventTypes.goal,
                athlete_id: 1,
                minute: 23,
                absolute_minute: 23,
                game_period_id: 1,
              },
            ],
          });
          expect(screen.getByText('2 (16’, 23’)')).toBeInTheDocument();
        });

        describe('assists', () => {
          const playerGoal = {
            id: 1,
            kind: eventTypes.goal,
            athlete_id: 1,
            minute: 29,
            additional_minute: null,
            absolute_minute: 29,
            relation_type: null,
            relation: null,
            game_period_id: 4,
            game_activity_id: null,
          };

          it('renders a gameActivity form that contains an assist dropdown with ff on', async () => {
            const user = userEvent.setup();
            renderComponent({
              ...defaultProps,
              gameActivityKind: eventTypes.goal,
              cellGameActivities: [
                playerGoal,
                {
                  id: 2,
                  kind: eventTypes.goal,
                  athlete_id: 2,
                  minute: 34,
                  additional_minute: null,
                  absolute_minute: 34,
                  relation_type: null,
                  relation: null,
                  game_period_id: 4,
                },
              ],
            });
            await user.click(screen.getByRole('button'));

            // First Game Activity
            expect(screen.getByText('1.')).toBeInTheDocument();
            expect(screen.getByDisplayValue('29')).toBeInTheDocument();

            // Second Game Activity
            expect(screen.getByText('2.')).toBeInTheDocument();
            expect(screen.getByDisplayValue('34')).toBeInTheDocument();
          });

          it('allows the user to set a player in the assist field and save', async () => {
            const user = userEvent.setup();
            renderComponent({
              ...defaultProps,
              gameActivityKind: eventTypes.goal,
              cellGameActivities: [{ ...playerGoal, id: undefined }],
            });
            await user.click(screen.getByRole('button'));
            await user.click(screen.getAllByText('Assist')[1]);
            await user.click(screen.getByText('Athlete Two'));

            await user.click(screen.getByText('Save'));
            expect(saveGameActivitiesRequest).toHaveBeenCalledWith({
              contentType: 'application/json',
              data: JSON.stringify({
                game_activities: [
                  {
                    athlete_id: 1,
                    minute: 29,
                    absolute_minute: 29,
                    game_activity_id: null,
                    kind: eventTypes.goal,
                    game_activities: [
                      {
                        athlete_id: 2,
                        kind: eventTypes.assist,
                        absolute_minute: 29,
                        relation_id: null,
                        minute: 29,
                      },
                    ],
                  },
                ],
              }),
              method: 'POST',
              url: '/ui/planning_hub/events/1/game_activities/bulk_save',
            });
          });

          it('allows the user to see a previously saved assist', async () => {
            const user = userEvent.setup();
            renderComponent({
              ...defaultProps,
              gameActivityKind: eventTypes.goal,
              gameActivities: [
                playerGoal,
                {
                  id: 2,
                  kind: eventTypes.assist,
                  game_activity_id: 1,
                  athlete_id: 2,
                  absolute_minute: 29,
                  minute: 29,
                },
              ],
              cellGameActivities: [playerGoal],
            });
            await user.click(screen.getByRole('button'));
            expect(screen.getByText('Athlete Two')).toBeInTheDocument();
          });

          it('allows the user to change a previously saved assist', async () => {
            const user = userEvent.setup();
            renderComponent({
              ...defaultProps,
              gameActivityKind: eventTypes.goal,
              gameActivities: [
                playerGoal,
                {
                  id: 2,
                  kind: eventTypes.assist,
                  game_activity_id: 1,
                  athlete_id: 2,
                  absolute_minute: 29,
                  minute: 29,
                },
              ],
              cellGameActivities: [playerGoal],
            });
            await user.click(screen.getByRole('button'));
            expect(screen.getByText('Athlete Two')).toBeInTheDocument();
            await user.click(screen.getByText('Athlete Two'));
            await user.click(screen.getByText('Athlete Three'));

            expect(screen.getByText('Athlete Three')).toBeInTheDocument();
            expect(screen.queryByText('Athlete Two')).not.toBeInTheDocument();

            await user.click(screen.getByText('Save'));
            expect(saveGameActivitiesRequest).toHaveBeenCalledWith({
              contentType: 'application/json',
              data: JSON.stringify({
                game_activities: [
                  {
                    id: 1,
                    athlete_id: 1,
                    minute: 29,
                    absolute_minute: 29,
                    game_activity_id: null,
                    kind: 'goal',
                  },
                  {
                    id: 2,
                    athlete_id: 3,
                    minute: 29,
                    absolute_minute: 29,
                    game_activity_id: 1,
                    kind: 'assist',
                  },
                ],
              }),
              method: 'POST',
              url: '/ui/planning_hub/events/1/game_activities/bulk_save',
            });
          });
        });

        describe('own goals', () => {
          const ownerId = defaultProps.event.squad.owner_id;

          beforeEach(() => {
            window.setFlag('league-ops-game-events-own-goal', true);
          });

          it('allows the user to see a previously saved own goal with ff on', async () => {
            const user = userEvent.setup();
            const playerGoal = {
              id: 1,
              kind: eventTypes.goal,
              game_activity_id: 1,
              athlete_id: 1,
              absolute_minute: 29,
              minute: 29,
            };
            renderComponent({
              ...defaultProps,
              gameActivityKind: eventTypes.own_goal,
              cellGameActivities: [playerGoal],
              gameActivities: [
                {
                  ...playerGoal,
                  game_activities: [
                    {
                      id: 3,
                      game_activity_id: 1,
                      kind: eventTypes.own_goal,
                      athlete_id: 1,
                      absolute_minute: 29,
                      minute: 29,
                      relation_id: null,
                      organisation_id: ownerId,
                    },
                  ],
                },
              ],
            });
            expect(screen.getByText(/1 \(29.*\)/)).toBeInTheDocument();
            await user.click(screen.getByRole('button'));
            expect(screen.getByText('Own Goal')).toBeInTheDocument();
          });

          it('allows the user to add an own goal in an empty cell with ff on', async () => {
            const user = userEvent.setup();
            renderComponent({
              ...defaultProps,
              gameActivityKind: eventTypes.own_goal,
              cellGameActivities: [],
            });

            await user.click(screen.getByRole('button'));
            await user.click(screen.getByText('Save'));

            expect(saveGameActivitiesRequest).toHaveBeenCalledWith({
              contentType: 'application/json',
              data: JSON.stringify({
                game_activities: [
                  {
                    minute: 0,
                    absolute_minute: 0,
                    relation_id: null,
                    athlete_id: 1,
                    kind: eventTypes.goal,
                    game_activities: [
                      {
                        athlete_id: 1,
                        kind: eventTypes.own_goal,
                        organisation_id: ownerId,
                        minute: 0,
                        absolute_minute: 0,
                        relation_id: null,
                      },
                    ],
                  },
                ],
              }),
              method: 'POST',
              url: '/ui/planning_hub/events/1/game_activities/bulk_save',
            });
          });

          it('allows the user to add multiple own goals in an empty cell with ff on', async () => {
            const user = userEvent.setup();
            renderComponent({
              ...defaultProps,
              gameActivityKind: eventTypes.own_goal,
              cellGameActivities: [],
              period: {
                absolute_duration_start: 0,
                absolute_duration_end: 45,
                duration: 45,
                id: 1,
              },
            });

            // Add first own goal (default minute 0)
            await user.click(screen.getByRole('button'));

            // Add second own goal
            const buttons = screen.getAllByRole('button');
            const addButton = buttons.find((button) =>
              button.querySelector('.icon-add')
            );
            await user.click(addButton);
            const spinButtons = screen.getAllByRole('spinbutton');
            fireEvent.change(spinButtons[1], {
              target: { value: '15' },
            });

            // Add third own goal
            await user.click(addButton);
            const updatedSpinButtons = screen.getAllByRole('spinbutton');
            fireEvent.change(updatedSpinButtons[2], {
              target: { value: '30' },
            });

            await user.click(screen.getByText('Save'));

            expect(saveGameActivitiesRequest).toHaveBeenCalledWith({
              contentType: 'application/json',
              data: JSON.stringify({
                game_activities: [
                  {
                    absolute_minute: 0,
                    relation_id: null,
                    athlete_id: 1,
                    kind: eventTypes.goal,
                    game_activities: [
                      {
                        athlete_id: 1,
                        kind: eventTypes.own_goal,
                        organisation_id: ownerId,
                        minute: 0,
                        absolute_minute: 0,
                        relation_id: null,
                      },
                    ],
                  },
                  {
                    kind: eventTypes.goal,
                    game_activities: [
                      {
                        kind: eventTypes.own_goal,
                        organisation_id: ownerId,
                        minute: 15,
                        absolute_minute: '15',
                        athlete_id: 1,
                        relation_id: null,
                      },
                    ],
                    absolute_minute: '15',
                    athlete_id: 1,
                    relation_id: null,
                  },
                  {
                    kind: eventTypes.goal,
                    game_activities: [
                      {
                        kind: eventTypes.own_goal,
                        organisation_id: ownerId,
                        minute: 30,
                        absolute_minute: '30',
                        athlete_id: 1,
                        relation_id: null,
                      },
                    ],
                    absolute_minute: '30',
                    athlete_id: 1,
                    relation_id: null,
                  },
                ],
              }),
              method: 'POST',
              url: '/ui/planning_hub/events/1/game_periods/1/v2/game_activities/bulk_save',
            });
          });

          it('allows the user to add an own goal in a cell with an own goal with ff on', async () => {
            const user = userEvent.setup();
            renderComponent({
              ...defaultProps,
              gameActivityKind: eventTypes.own_goal,
              cellGameActivities: [
                {
                  id: 1,
                  kind: eventTypes.goal,
                  athlete_id: 1,
                  minute: 16,
                  absolute_minute: 16,
                  game_period_id: 1,
                },
                {
                  id: 2,
                  game_activity_id: 1,
                  kind: eventTypes.own_goal,
                  athlete_id: 1,
                  organisation_id: ownerId,
                  minute: 16,
                  absolute_minute: 16,
                  relation_id: null,
                },
              ],
              period: {
                absolute_duration_start: 0,
                absolute_duration_end: 45,
                duration: 45,
                id: 1,
              },
            });

            await user.click(screen.getByRole('button'));
            const buttons = screen.getAllByRole('button');
            const addButton = buttons.find((button) =>
              button.querySelector('.icon-add')
            );
            await user.click(addButton);

            // Change the minute of the new goal
            const spinButtons = screen.getAllByRole('spinbutton');
            fireEvent.change(spinButtons[1], {
              target: { value: '25' },
            });
            await user.click(screen.getByText('Save'));

            expect(saveGameActivitiesRequest).toHaveBeenCalledWith({
              contentType: 'application/json',
              data: JSON.stringify({
                game_activities: [
                  {
                    id: 1,
                    athlete_id: 1,
                    absolute_minute: 16,
                    kind: eventTypes.goal,
                  },
                  {
                    id: 2,
                    athlete_id: 1,
                    absolute_minute: 16,
                    game_activity_id: 1,
                    kind: eventTypes.own_goal,
                  },
                  {
                    kind: eventTypes.goal,
                    game_activities: [
                      {
                        kind: eventTypes.own_goal,
                        organisation_id: ownerId,
                        minute: 25,
                        absolute_minute: '25',
                        athlete_id: 1,
                        relation_id: null,
                      },
                    ],
                    absolute_minute: '25',
                    athlete_id: 1,
                    relation_id: null,
                  },
                ],
              }),
              method: 'POST',
              url: '/ui/planning_hub/events/1/game_periods/1/v2/game_activities/bulk_save',
            });
          });

          it('allows the user to delete an own goal from a cell with ff on', async () => {
            const user = userEvent.setup();
            const mockGameActivities = [
              {
                id: 1,
                kind: eventTypes.goal,
                athlete_id: 1,
                minute: 16,
                absolute_minute: 16,
                game_period_id: 1,
              },
              {
                id: 2,
                game_activity_id: 1,
                kind: eventTypes.own_goal,
                athlete_id: 1,
                organisation_id: ownerId,
                minute: 16,
                absolute_minute: 16,
                relation_id: null,
              },
            ];
            renderComponent({
              ...defaultProps,
              gameActivityKind: eventTypes.own_goal,
              cellGameActivities: mockGameActivities,
              // Provide full list so deletion logic can also find linked own goal
              gameActivities: mockGameActivities,
            });

            await user.click(screen.getByRole('button'));
            await user.click(
              screen.getByTestId('GameEventListViewCell|DeleteButton')
            );
            await user.click(screen.getByText('Save'));

            expect(saveGameActivitiesRequest).toHaveBeenCalledWith({
              contentType: 'application/json',
              data: JSON.stringify({
                game_activities: [
                  { id: 1, delete: true }, // parent goal deleted
                  { id: 2, delete: true }, // linked own goal deleted
                ],
              }),
              method: 'POST',
              url: '/ui/planning_hub/events/1/game_activities/bulk_save',
            });
          });

          it('allows the user to change the minute of an own goal with ff on', async () => {
            const user = userEvent.setup();
            renderComponent({
              ...defaultProps,
              gameActivityKind: eventTypes.own_goal,
              cellGameActivities: [
                {
                  id: 1,
                  kind: eventTypes.goal,
                  athlete_id: 1,
                  minute: 16,
                  absolute_minute: 16,
                  game_period_id: 1,
                },
                {
                  id: 2,
                  game_activity_id: 1,
                  kind: eventTypes.own_goal,
                  athlete_id: 1,
                  organisation_id: ownerId,
                  minute: 16,
                  absolute_minute: 16,
                  relation_id: null,
                },
              ],
              period: {
                absolute_duration_start: 0,
                absolute_duration_end: 45,
                duration: 45,
                id: 1,
              },
            });

            await user.click(screen.getByRole('button'));
            const spinButton = screen.getByRole('spinbutton');
            fireEvent.change(spinButton, {
              target: { value: '20' },
            });
            await user.click(screen.getByText('Save'));

            expect(saveGameActivitiesRequest).toHaveBeenCalledWith({
              contentType: 'application/json',
              data: JSON.stringify({
                game_activities: [
                  {
                    id: 1,
                    athlete_id: 1,
                    absolute_minute: '20',
                    kind: eventTypes.goal,
                  },
                  {
                    id: 2,
                    athlete_id: 1,
                    absolute_minute: '20',
                    game_activity_id: 1,
                    kind: eventTypes.own_goal,
                  },
                ],
              }),
              method: 'POST',
              url: '/ui/planning_hub/events/1/game_periods/1/v2/game_activities/bulk_save',
            });
          });
        });

        describe('subs/swaps', () => {
          const savedSubstitutionActivities = [
            {
              id: 1,
              kind: eventTypes.sub,
              athlete_id: 1,
              minute: 32,
              additional_minute: null,
              absolute_minute: 32,
              relation_type: 'Athlete',
              game_period_id: 4,
              game_activity_id: null,
              relation_id: 2,
              relation: defaultProps.athletes[2],
            },
            {
              id: 2,
              kind: eventTypes.formation_position_view_change,
              athlete_id: 1,
              minute: 32,
              additional_minute: null,
              absolute_minute: 32,
              relation_type: null,
              relation: null,
              game_period_id: 4,
              game_activity_id: 1,
            },
            {
              id: 3,
              kind: eventTypes.position_change,
              athlete_id: 1,
              user_id: null,
              minute: 32,
              additional_minute: null,
              absolute_minute: 32,
              relation_type: null,
              relation: null,
              game_period_id: 4,
              game_activity_id: 1,
            },
            {
              id: 4,
              kind: eventTypes.formation_position_view_change,
              athlete_id: 3,
              minute: 32,
              additional_minute: null,
              absolute_minute: 32,
              relation_type: null,
              relation: {
                id: 10,
                field_id: 1,
                formation_id: 2,
                position: {
                  id: 84,
                  name: 'Goalkeeper',
                  order: 1,
                  abbreviation: 'GK',
                },
              },
              game_period_id: 4,
              game_activity_id: 1,
            },
            {
              id: 5,
              kind: eventTypes.position_change,
              athlete_id: 3,
              user_id: null,
              minute: 32,
              additional_minute: null,
              absolute_minute: 32,
              relation_type: null,
              relation: {
                id: 84,
                name: 'Goalkeeper',
                order: 1,
              },
              game_period_id: 4,
              game_activity_id: 1,
            },
          ];

          const savedSwapActivities = [
            {
              id: 5,
              kind: eventTypes.switch,
              athlete_id: 1,
              minute: 12,
              additional_minute: null,
              absolute_minute: 12,
              relation_type: 'Athlete',
              game_period_id: 4,
              game_activity_id: null,
              relation: {
                id: 2,
                firstname: 'Athlete',
                lastname: 'Two',
                fullname: 'Athlete Two',
                shortname: 'A Two',
              },
            },
            {
              id: 6,
              kind: eventTypes.formation_position_view_change,
              athlete_id: 1,
              minute: 12,
              additional_minute: null,
              absolute_minute: 12,
              relation_type: 'Planning::Private::Models::FormationPositionView',
              relation: {
                id: 26,
                field_id: 1,
                formation_id: 3,
                position: {
                  id: 88,
                  name: 'Left Back',
                  order: 5,
                  abbreviation: 'LB',
                },
                x: 3,
                y: 5,
                order: 4,
              },
              game_period_id: 4,
              game_activity_id: 5,
            },
            {
              id: 7,
              kind: eventTypes.position_change,
              athlete_id: 1,
              user_id: null,
              minute: 12,
              additional_minute: null,
              absolute_minute: 12,
              relation_type: 'Position',
              relation: {
                id: 88,
                name: 'Left Back',
                order: 5,
              },
              game_period_id: 4,
              game_activity_id: 5,
            },
            {
              id: 8,
              kind: eventTypes.formation_position_view_change,
              athlete_id: 2,
              minute: 12,
              additional_minute: null,
              absolute_minute: 12,
              relation_type: 'Planning::Private::Models::FormationPositionView',
              relation: {
                id: 25,
                field_id: 1,
                formation_id: 3,
                position: {
                  id: 86,
                  name: 'Center Back',
                  order: 4,
                  abbreviation: 'CB',
                },
                x: 3,
                y: 5,
                order: 3,
              },
              game_period_id: 4,
              game_activity_id: 5,
            },
            {
              id: 9,
              kind: eventTypes.position_change,
              athlete_id: 2,
              user_id: null,
              minute: 12,
              additional_minute: null,
              absolute_minute: 12,
              relation_type: 'Position',
              relation: {
                id: 86,
                name: 'Center Back',
                order: 4,
              },
              game_period_id: 4,
              game_activity_id: 5,
            },
          ];

          it('renders the Positions/subs form that contains a Position Change dropdown with ff on', async () => {
            const user = userEvent.setup();
            renderComponent({
              ...defaultProps,
              gameActivityKind: eventTypes.sub,
              gameActivities: [
                {
                  id: 10,
                  kind: eventTypes.formation_complete,
                  minute: 0,
                  absolute_minute: 0,
                  game_period_id: 1,
                },
              ],
              period: {
                absolute_duration_start: 0,
                absolute_duration_end: 45,
                duration: 45,
                id: 1,
              },
              cellGameActivities: [
                {
                  id: 1,
                  kind: eventTypes.sub,
                  athlete_id: 1,
                  minute: 32,
                  additional_minute: null,
                  absolute_minute: 32,
                  relation_type: 'Athlete',
                  game_period_id: 4,
                  game_activity_id: null,
                  relation: {
                    id: 1,
                    firstname: 'Athlete',
                    lastname: 'Two',
                    fullname: 'Athlete Two',
                    shortname: 'A Two',
                  },
                },
              ],
            });
            await user.click(screen.getByRole('button'));

            // Popup Labels
            expect(screen.getByText('Positions/subs')).toBeInTheDocument();
            expect(screen.getByText('Changed at')).toBeInTheDocument();
            expect(screen.getByText('Position to')).toBeInTheDocument();

            // First Game Activity
            expect(screen.getByText('1.')).toBeInTheDocument();
            expect(screen.getByDisplayValue('32')).toBeInTheDocument();
          });

          it('renders the Positions/subs form with the correct athlete selected for a Substitution game activity in the dropdown with ff on', async () => {
            const user = userEvent.setup();
            renderComponent({
              ...defaultProps,
              gameActivityKind: eventTypes.sub,
              gameActivities: [
                {
                  id: 10,
                  kind: eventTypes.formation_complete,
                  minute: 0,
                  absolute_minute: 0,
                  game_period_id: 1,
                },
              ],
              period: {
                absolute_duration_start: 0,
                absolute_duration_end: 45,
                duration: 45,
                id: 1,
              },
              cellGameActivities: [
                {
                  id: 1,
                  kind: eventTypes.sub,
                  athlete_id: 1,
                  minute: 32,
                  additional_minute: null,
                  absolute_minute: 32,
                  relation_type: 'Athlete',
                  game_period_id: 4,
                  game_activity_id: null,
                  relation_id: 2,
                  relation: {
                    id: 2,
                    firstname: 'Athlete',
                    lastname: 'Two',
                    fullname: 'Athlete Two',
                    shortname: 'A Two',
                  },
                },
              ],
            });
            await user.click(screen.getByRole('button'));

            // Popup Labels
            expect(screen.getByText('Positions/subs')).toBeInTheDocument();
            expect(screen.getByText('Changed at')).toBeInTheDocument();
            expect(screen.getByText('Position to')).toBeInTheDocument();

            // First Game Activity
            expect(screen.getByText('1.')).toBeInTheDocument();
            expect(screen.getByDisplayValue('32')).toBeInTheDocument();
            expect(screen.getByText('SUB - Athlete Two')).toBeInTheDocument();
          });

          it('renders the Positions/subs form without the delete event button for a Substitution game activity that is not the most recent activity with ff on', async () => {
            const user = userEvent.setup();
            renderComponent({
              ...defaultProps,
              gameActivityKind: eventTypes.sub,
              gameActivities: [
                {
                  id: 10,
                  kind: eventTypes.formation_complete,
                  minute: 0,
                  absolute_minute: 0,
                  game_period_id: 1,
                },
                {
                  id: 1,
                  kind: eventTypes.sub,
                  athlete_id: 1,
                  minute: 32,
                  additional_minute: null,
                  absolute_minute: 32,
                  relation_type: 'Athlete',
                  game_period_id: 4,
                  game_activity_id: null,
                  relation_id: 2,
                  relation: {
                    id: 2,
                    firstname: 'Athlete',
                    lastname: 'Two',
                    fullname: 'Athlete Two',
                    shortname: 'A Two',
                  },
                },
                {
                  id: 2,
                  kind: eventTypes.sub,
                  athlete_id: 1,
                  minute: 41,
                  additional_minute: null,
                  absolute_minute: 41,
                  relation_type: 'Athlete',
                  game_period_id: 4,
                  game_activity_id: null,
                  relation_id: 3,
                  relation: {
                    id: 3,
                    firstname: 'Athlete',
                    lastname: 'Three',
                    fullname: 'Athlete Three',
                    shortname: 'A Three',
                  },
                },
              ],
              period: {
                absolute_duration_start: 0,
                absolute_duration_end: 45,
                duration: 45,
                id: 1,
              },
              cellGameActivities: [
                {
                  id: 1,
                  kind: eventTypes.sub,
                  athlete_id: 1,
                  minute: 32,
                  additional_minute: null,
                  absolute_minute: 32,
                  relation_type: 'Athlete',
                  game_period_id: 4,
                  game_activity_id: null,
                  relation_id: 2,
                  relation: {
                    id: 2,
                    firstname: 'Athlete',
                    lastname: 'Two',
                    fullname: 'Athlete Two',
                    shortname: 'A Two',
                  },
                },
                {
                  id: 2,
                  kind: eventTypes.sub,
                  athlete_id: 1,
                  minute: 41,
                  additional_minute: null,
                  absolute_minute: 41,
                  relation_type: 'Athlete',
                  game_period_id: 4,
                  game_activity_id: null,
                  relation_id: 3,
                  relation: {
                    id: 3,
                    firstname: 'Athlete',
                    lastname: 'Three',
                    fullname: 'Athlete Three',
                    shortname: 'A Three',
                  },
                },
              ],
            });
            await user.click(screen.getByRole('button'));

            // Popup Labels
            expect(screen.getByText('Positions/subs')).toBeInTheDocument();
            expect(screen.getByText('Changed at')).toBeInTheDocument();
            expect(screen.getByText('Position to')).toBeInTheDocument();

            // First Game Activity
            expect(screen.getByText('1.')).toBeInTheDocument();
            expect(screen.getByDisplayValue('32')).toBeInTheDocument();
            expect(screen.getByText('SUB - Athlete Two')).toBeInTheDocument();
            // Second Game Activity
            expect(screen.getByText('2.')).toBeInTheDocument();
            expect(screen.getByDisplayValue('41')).toBeInTheDocument();
            expect(screen.getByText('SUB - Athlete Three')).toBeInTheDocument();

            const deleteButtonsCount = screen.getAllByTestId(
              'GameEventListViewCell|DeleteButton'
            ).length;
            expect(deleteButtonsCount).toEqual(1);
          });

          it('renders a Substitution game activity with ff on', async () => {
            const user = userEvent.setup();
            renderComponent({
              ...defaultProps,
              gameActivityKind: eventTypes.sub,
              gameActivities: [
                {
                  id: 10,
                  kind: eventTypes.formation_complete,
                  minute: 0,
                  absolute_minute: 0,
                  game_period_id: 1,
                },
                ...savedSubstitutionActivities,
              ],
              period: {
                absolute_duration_start: 0,
                absolute_duration_end: 45,
                duration: 45,
                id: 1,
              },
              cellGameActivities: [savedSubstitutionActivities[0]],
            });
            await user.click(screen.getByRole('button'));

            // Substitution Game Activity
            expect(screen.getByText('SUB (32’)')).toBeInTheDocument();
          });

          it('allows the user to update an existing substitution to a different athlete', async () => {
            const user = userEvent.setup();
            renderComponent({
              ...defaultProps,
              gameActivityKind: eventTypes.sub,
              gameActivities: [
                {
                  id: 10,
                  kind: eventTypes.formation_complete,
                  minute: 0,
                  absolute_minute: 0,
                  game_period_id: 1,
                },
                ...savedSubstitutionActivities,
              ],
              period: {
                absolute_duration_start: 0,
                absolute_duration_end: 45,
                duration: 45,
                id: 1,
              },
              cellGameActivities: [savedSubstitutionActivities[0]],
            });
            await user.click(screen.getByRole('button'));

            expect(screen.getByDisplayValue('32')).toBeInTheDocument();
            expect(screen.getByText('GK - Athlete Three')).toBeInTheDocument();
            await user.click(screen.getByText('GK - Athlete Three'));

            await user.click(screen.getByText('SUB - Athlete Two'));

            expect(screen.getByText('SUB - Athlete Two')).toBeInTheDocument();

            await user.click(screen.getByText('Save'));
            expect(saveGameActivitiesRequest).toHaveBeenCalledWith({
              contentType: 'application/json',
              data: JSON.stringify({
                game_activities: [
                  {
                    id: 1,
                    athlete_id: 1,
                    absolute_minute: 32,
                    relation_id: 2,
                    game_activity_id: null,
                    kind: 'substitution',
                  },
                  {
                    id: 2,
                    athlete_id: 1,
                    absolute_minute: 32,
                    game_activity_id: 1,
                    kind: 'formation_position_view_change',
                    relation: { id: null },
                  },
                  {
                    id: 3,
                    athlete_id: 1,
                    absolute_minute: 32,
                    game_activity_id: 1,
                    kind: 'position_change',
                    relation: { id: null },
                  },
                  {
                    id: 4,
                    athlete_id: 2,
                    absolute_minute: 32,
                    relation_id: 10,
                    game_activity_id: 1,
                    kind: 'formation_position_view_change',
                  },
                  {
                    id: 5,
                    athlete_id: 2,
                    absolute_minute: 32,
                    relation_id: 84,
                    game_activity_id: 1,
                    kind: 'position_change',
                  },
                ],
              }),
              method: 'POST',
              url: '/ui/planning_hub/events/1/game_periods/1/v2/game_activities/bulk_save',
            });
          });

          it('renders a Position Swap game activity with ff on', async () => {
            const user = userEvent.setup();
            renderComponent({
              ...defaultProps,
              gameActivityKind: eventTypes.sub,
              gameActivities: [
                {
                  id: 10,
                  kind: eventTypes.formation_complete,
                  minute: 0,
                  absolute_minute: 0,
                  game_period_id: 1,
                },
                ...savedSwapActivities,
              ],
              period: {
                absolute_duration_start: 0,
                absolute_duration_end: 45,
                duration: 45,
                id: 1,
              },
              cellGameActivities: [savedSwapActivities[0]],
              formationCoordinates: {
                '3_8': {
                  id: 26,
                  position: {
                    id: 88,
                    abbreviation: 'LB',
                  },
                },
              },
            });
            await user.click(screen.getByRole('button'));

            // Substitution Game Activity
            expect(screen.getByText('LB (12’)')).toBeInTheDocument();
          });

          it('allows the user to update an existing position swap activity to a different athlete', async () => {
            const user = userEvent.setup();
            renderComponent({
              ...defaultProps,
              gameActivityKind: eventTypes.sub,
              gameActivities: [
                {
                  id: 10,
                  kind: eventTypes.formation_complete,
                  minute: 0,
                  absolute_minute: 0,
                  game_period_id: 1,
                },
                ...savedSwapActivities,
              ],
              period: {
                absolute_duration_start: 0,
                absolute_duration_end: 45,
                duration: 45,
                id: 1,
              },
              cellGameActivities: [savedSwapActivities[0]],
            });
            await user.click(screen.getByRole('button'));

            expect(screen.getByDisplayValue('12')).toBeInTheDocument();

            expect(screen.getByText('CB - Athlete Two')).toBeInTheDocument();
            await user.click(screen.getByText('CB - Athlete Two'));

            await user.click(screen.getByText('SUB - Athlete Three'));

            expect(screen.getByText('SUB - Athlete Three')).toBeInTheDocument();

            await user.click(screen.getByText('Save'));
            expect(saveGameActivitiesRequest).toHaveBeenCalledWith({
              contentType: 'application/json',
              data: JSON.stringify({
                game_activities: [
                  {
                    id: 5,
                    athlete_id: 1,
                    absolute_minute: 12,
                    relation_id: 3,
                    game_activity_id: null,
                    kind: 'substitution',
                  },
                  {
                    id: 6,
                    athlete_id: 1,
                    absolute_minute: 12,
                    relation_id: 26,
                    game_activity_id: 5,
                    kind: 'formation_position_view_change',
                    relation: { id: null },
                  },
                  {
                    id: 7,
                    athlete_id: 1,
                    absolute_minute: 12,
                    relation_id: 88,
                    game_activity_id: 5,
                    kind: 'position_change',
                    relation: { id: null },
                  },
                  {
                    id: 8,
                    athlete_id: 3,
                    absolute_minute: 12,
                    relation_id: 25,
                    game_activity_id: 5,
                    kind: 'formation_position_view_change',
                  },
                  {
                    id: 9,
                    athlete_id: 3,
                    absolute_minute: 12,
                    relation_id: 86,
                    game_activity_id: 5,
                    kind: 'position_change',
                  },
                ],
              }),
              method: 'POST',
              url: '/ui/planning_hub/events/1/game_periods/1/v2/game_activities/bulk_save',
            });
          });
        });
      });
    });

    describe('when the save request fails', () => {
      beforeEach(() => {
        const deferred = $.Deferred();
        deferred.reject();
        jest.spyOn($, 'ajax').mockImplementation(deferred);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('shows an error message', async () => {
        const user = userEvent.setup();
        renderComponent();
        await user.click(screen.getByRole('button'));
        await user.click(
          screen.getAllByTestId('GameEventListViewCell|DeleteButton')[1]
        );
        await user.click(screen.getByText('Save'));
        expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
      });

      it('shows an error message with a period also passed in', async () => {
        const user = userEvent.setup();
        renderComponent({
          ...defaultProps,
          gameActivityKind: eventTypes.red,
          cellGameActivities: [
            { kind: eventTypes.red, absolute_minute: 0, athlete_id: 1 },
          ],
          period: {
            absolute_duration_start: 0,
            absolute_duration_end: 30,
            duration: 30,
            id: 1,
          },
          periodDuration: { min: 0, max: 30 },
        });
        await user.click(screen.getByRole('button'));
        fireEvent.change(screen.getByRole('spinbutton'), {
          target: { value: '20' },
        });
        await user.click(screen.getByText('Save'));
        expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
      });
    });
  });

  describe('when prevent game edit is true', () => {
    it('should render the save button if preventGameEvents is false', async () => {
      const user = userEvent.setup();
      renderComponent({
        ...defaultProps,
        gameActivityKind: eventTypes.position_change,
        cellGameActivities: [
          {
            id: 1,
            kind: eventTypes.position_change,
            minute: 0,
            absolute_minute: 0,
            athlete_id: 1,
            relation: { id: 1 },
          },
          {
            id: 4,
            kind: eventTypes.position_change,
            minute: 62,
            absolute_minute: 62,
            athlete_id: 1,
            relation: { id: 'SUBSTITUTE' },
          },
        ],
      });

      const btn = screen.getAllByRole('button');
      await user.click(btn[0]);

      expect(screen.getByText('Save')).toBeInTheDocument();
    });

    it('should not render the save button if preventGameEvents is true', async () => {
      const user = userEvent.setup();
      renderComponent({
        ...defaultProps,
        gameActivityKind: eventTypes.position_change,
        cellGameActivities: [
          {
            id: 1,
            kind: eventTypes.position_change,
            minute: 0,
            absolute_minute: 0,
            athlete_id: 1,
            relation: { id: 1 },
          },
          {
            id: 4,
            kind: eventTypes.position_change,
            minute: 62,
            absolute_minute: 62,
            athlete_id: 1,
            relation: { id: 'SUBSTITUTE' },
          },
        ],
        preventGameEvents: true,
      });

      const btn = screen.getAllByRole('button');
      await user.click(btn[0]);

      expect(screen.queryByText('Save')).not.toBeInTheDocument();
    });
  });
});
