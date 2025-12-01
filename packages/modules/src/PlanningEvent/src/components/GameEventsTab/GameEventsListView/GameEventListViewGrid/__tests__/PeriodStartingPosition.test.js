import { render, screen } from '@testing-library/react';
import PeriodStartingPositionCell from '../PeriodStartingPosition';

describe('PeriodStartingPositionCell', () => {
  let component;
  const defaultProps = {
    gameActivities: [
      {
        id: 2,
        kind: 'formation_position_view_change',
        athlete_id: 2,
        user_id: null,
        minute: 0,
        additional_minute: null,
        absolute_minute: 0,
        relation_type: 'Planning::Private::Models::FormationPositionView',
        relation: {
          id: 25,
          position: {
            id: 86,
            name: 'Center Back',
            order: 4,
            abbreviation: 'CB',
          },
        },
        game_period_id: 1,
        game_activity_id: null,
      },
    ],
    period: {
      absolute_duration_start: 0,
      absolute_duration_end: 45,
      duration: 45,
      id: 1,
    },
  };

  const componentRender = (props = defaultProps) =>
    render(<PeriodStartingPositionCell {...props} />);

  describe('Initial render with formation_position_view_change', () => {
    beforeEach(async () => {
      component = await componentRender();
    });

    it('should render the Starting Position cell with a value of CB when formation_position_view_change Game Activity is present', () => {
      expect(
        component.getByTestId('PeriodStartingPosition|StartingPosition')
      ).toBeInTheDocument();
      expect(screen.getByText('CB')).toBeInTheDocument();
    });
  });

  describe('Initial render without formation_position_view_change', () => {
    const emptyStartingPositionProps = {
      ...defaultProps,
      gameActivities: [],
    };
    beforeEach(async () => {
      component = await componentRender(emptyStartingPositionProps);
    });

    it('should render the Starting Position cell with a value of SUB when formation_position_view_change Game Activity is not present', () => {
      expect(
        component.getByTestId('PeriodStartingPosition|StartingPosition')
      ).toBeInTheDocument();
      expect(screen.getByText('SUB')).toBeInTheDocument();
    });
  });
});
