import { render, act } from '@testing-library/react';
import PeriodGoalAssistsCell from '../PeriodGoalAssists';

describe('PeriodGoalAssistsCell', () => {
  let component;
  const props = {
    gameActivities: [
      {
        id: 1,
        kind: 'assist',
        athlete_id: 2,
        minute: 16,
        additional_minute: null,
        absolute_minute: 16,
        relation_type: null,
        relation: null,
        game_period_id: 1,
        game_activity_id: 2,
      },
    ],
    periodId: 1,
  };

  const componentRender = (testGameActivities) => {
    let renderedComponent;
    act(() => {
      renderedComponent = render(
        <PeriodGoalAssistsCell
          gameActivities={testGameActivities}
          periodId={props.periodId}
        />
      );
    });
    return renderedComponent;
  };

  describe('Initial render', () => {
    beforeEach(async () => {
      component = await componentRender(props.gameActivities, props.periodId);
    });

    it('should render the Assist cell with 1 assist displayed', () => {
      expect(
        component.getByTestId('PeriodGoalAssists|AssistsList')
      ).toBeInTheDocument();
      expect(
        component.getByTestId('PeriodGoalAssists|AssistsList')
      ).toHaveTextContent('1 (16’)');
    });
  });

  describe('Shows the correct listing of assists', () => {
    // player has 3 assists within the period
    const gameActivities3Assists = [
      {
        id: 1,
        kind: 'assist',
        athlete_id: 2,
        minute: 16,
        additional_minute: null,
        absolute_minute: 16,
        relation_type: null,
        relation: null,
        game_period_id: 1,
        game_activity_id: 2,
      },
      {
        id: 1,
        kind: 'assist',
        athlete_id: 2,
        minute: 34,
        additional_minute: null,
        absolute_minute: 34,
        relation_type: null,
        relation: null,
        game_period_id: 1,
        game_activity_id: 2,
      },
      {
        id: 1,
        kind: 'assist',
        athlete_id: 2,
        minute: 39,
        additional_minute: null,
        absolute_minute: 39,
        relation_type: null,
        relation: null,
        game_period_id: 1,
        game_activity_id: 2,
      },
    ];

    beforeEach(() => {
      component = componentRender(gameActivities3Assists, props.periodId);
    });

    it('if a player has 3 assists within the period', () => {
      expect(
        component.getByTestId('PeriodGoalAssists|AssistsList')
      ).toBeInTheDocument();
      expect(
        component.getByTestId('PeriodGoalAssists|AssistsList')
      ).toHaveTextContent('3 (16’, 34’, 39’)');
    });
  });

  describe('Shows an empty cell when there are no Assists', () => {
    // player has 0 assists within the period
    const gameActivities = [];

    beforeEach(() => {
      component = componentRender(gameActivities, props.periodId);
    });

    it('if a player has 3 assists within the period', () => {
      expect(
        component.getByTestId('PeriodGoalAssists|AssistsList')
      ).toBeInTheDocument();
      expect(
        component.getByTestId('PeriodGoalAssists|AssistsList')
      ).toHaveTextContent('');
    });
  });
});
