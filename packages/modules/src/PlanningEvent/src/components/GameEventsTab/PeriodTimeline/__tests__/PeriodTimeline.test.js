import { screen } from '@testing-library/react';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import userEvent from '@testing-library/user-event';
import { eventTypes } from '@kitman/common/src/consts/gameEventConsts';
import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';

import PeriodTimeline from '../PeriodTimeline';

jest.mock('@kitman/common/src/contexts/PreferenceContext/preferenceContext');

describe('PeriodTimeline', () => {
  const mockEventPeriods = [
    {
      id: 2,
      duration: 30,
      absolute_duration_start: 0,
      absolute_duration_end: 30,
    },
    {
      id: 3,
      duration: 30,
      absolute_duration_start: 30,
      absolute_duration_end: 60,
    },
    {
      id: 5,
      duration: 30,
      absolute_duration_start: 60,
      absolute_duration_end: 90,
    },
  ];
  const mockLocalEventPeriods = [
    { localId: 2 },
    { localId: 3 },
    { localId: 5 },
  ];

  const mockGameActivities = [
    { id: 1, kind: eventTypes.yellow, absolute_minute: 25 },
    { id: 2, kind: eventTypes.red, absolute_minute: 50 },
  ];

  const defaultStore = {
    planningEvent: {
      eventPeriods: { localEventPeriods: mockEventPeriods },
      gameActivities: { localGameActivities: mockGameActivities },
    },
  };

  const defaultProps = {
    isImportedGame: false,
    selectedPeriod: mockEventPeriods[0],
    totalGameTime: 90,
    isCustomPeriods: false,
    t: i18nextTranslateStub(),
    onDeletePeriod: jest.fn(),
    setSelectedPeriod: jest.fn(),
    setSelectedEvent: jest.fn(),
  };

  const componentRender = ({
    props = defaultProps,
    mockStore = defaultStore,
    matchDayFlow = false,
  }) => {
    usePreferences.mockReturnValue({
      preferences: {
        league_game_team: matchDayFlow,
      },
    });

    return renderWithRedux(<PeriodTimeline {...props} />, {
      preloadedState: mockStore,
    });
  };

  describe('initial desktop render', () => {
    beforeEach(() => {
      window.innerWidth = 1400;
    });

    it('renders the component', () => {
      componentRender({});
      expect(screen.getByTestId('PeriodTimeline')).toBeInTheDocument();
    });

    it('renders all the period content', () => {
      componentRender({});
      expect(screen.getByText('Period 1')).toBeInTheDocument();
      expect(screen.getByText('Period 2')).toBeInTheDocument();
      expect(screen.getByText('Period 3')).toBeInTheDocument();
    });

    it('renders the start and finish period times', () => {
      componentRender({});
      expect(screen.getByText('0`')).toBeInTheDocument();
      expect(screen.getByText('90`')).toBeInTheDocument();
    });

    it('calls off set selected period when a period is clicked', async () => {
      const user = userEvent.setup();
      componentRender({});
      await user.click(screen.getByTestId('period-2-line'));
      expect(defaultProps.setSelectedPeriod).toHaveBeenCalledWith(
        mockEventPeriods[1]
      );
    });

    it('clicking a timeline event sets calls setSelectedEvent', async () => {
      const user = userEvent.setup();
      componentRender({});
      await user.click(screen.getAllByRole('img')[0]);
      expect(defaultProps.setSelectedEvent).toHaveBeenCalledWith({
        ...mockGameActivities[0],
        activityIndex: 0,
      });

      await user.click(screen.getAllByRole('img')[1]);
      expect(defaultProps.setSelectedEvent).toHaveBeenCalledWith({
        ...mockGameActivities[1],
        activityIndex: 1,
      });
    });

    it('allows period 1 to be deleted when there are multiple periods', async () => {
      const user = userEvent.setup();
      const component = componentRender({});
      await user.click(component.container.querySelector('button'));
      await user.click(screen.getByText('Confirm'));

      expect(defaultProps.onDeletePeriod).toHaveBeenCalledWith(
        mockEventPeriods[0],
        false
      );
    });

    it('does not allow period 1 to be deleted when it is the only period', () => {
      const component = componentRender({
        mockStore: {
          planningEvent: {
            ...defaultStore.planningEvent,
            eventPeriods: { localEventPeriods: [mockEventPeriods[0]] },
          },
        },
      });

      expect(
        component.container.querySelector('button')
      ).not.toBeInTheDocument();
    });

    it('does not allow period 1 to be deleted when it is the match day flow', () => {
      const component = componentRender({
        props: { ...defaultProps, isImportedGame: true },
        matchDayFlow: true,
      });
      // Would be 3 buttons, but period 1 delete button is hidden
      expect(component.container.querySelectorAll('button').length).toEqual(2);
    });
  });

  describe('initial mobile render', () => {
    beforeEach(() => {
      window.innerWidth = 500;
    });
    afterEach(() => {
      window.innerWidth = 1400;
    });

    it('renders the single period view', () => {
      componentRender({
        props: {
          ...defaultProps,
          selectedPeriod: mockEventPeriods[1],
        },
      });
      expect(screen.getByText('Period 2 of 3')).toBeInTheDocument();
      expect(screen.getByText('30`')).toBeInTheDocument();
      expect(screen.getByText('60`')).toBeInTheDocument();
    });

    it('clicking on the left chevron calls the previous period to be shown', async () => {
      const user = userEvent.setup();
      componentRender({
        props: {
          ...defaultProps,
          selectedPeriod: mockEventPeriods[1],
        },
      });
      await user.click(screen.getByTestId('icon-back-chevron'));
      expect(defaultProps.setSelectedPeriod).toHaveBeenCalledWith(
        mockEventPeriods[0]
      );
    });

    it('clicking on the right chevron calls the next period to be shown', async () => {
      const user = userEvent.setup();
      componentRender({
        props: {
          ...defaultProps,
          selectedPeriod: mockEventPeriods[1],
        },
      });
      await user.click(screen.getByTestId('icon-next-chevron'));
      expect(defaultProps.setSelectedPeriod).toHaveBeenCalledWith(
        mockEventPeriods[2]
      );
    });
  });

  describe('Local Id Render', () => {
    it('renders the appropriate periods', () => {
      componentRender({
        props: {
          ...defaultProps,
          selectedPeriod: { id: 2 },
        },
        mockStore: {
          planningEvent: {
            ...defaultStore.planningEvent,
            eventPeriods: { localEventPeriods: mockLocalEventPeriods },
          },
        },
      });
      expect(screen.getByText('Period 1')).toBeInTheDocument();
      expect(screen.getByText('Period 2')).toBeInTheDocument();
      expect(screen.getByText('Period 3')).toBeInTheDocument();
    });
  });

  describe('end of game activity time line render', () => {
    it('renders the end of game timeline activity', () => {
      componentRender({
        props: {
          ...defaultProps,
          selectedPeriod: mockEventPeriods[2],
        },
        mockStore: {
          planningEvent: {
            ...defaultStore.planningEvent,
            gameActivities: {
              localGameActivities: [
                ...mockGameActivities,
                { id: 2, kind: eventTypes.goal, absolute_minute: 90 },
              ],
            },
          },
        },
      });

      expect(screen.getAllByRole('img').length).toEqual(3);
      expect(screen.getAllByRole('img')[2]).toHaveAttribute(
        'src',
        '/img/pitch-view/goal.png'
      );
    });
  });
});
