import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { eventTypes } from '@kitman/common/src/consts/gameEventConsts';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import PeriodTimelineEvent from '../PeriodTimelineEvent';

describe('PeriodTimelineEvent', () => {
  const mockYellow = { id: 1, kind: eventTypes.yellow, absolute_minute: 25 };
  const mockGoal = { id: 1, kind: eventTypes.goal, absolute_minute: 50 };

  const mockSavedGoal = {
    id: 1,
    kind: eventTypes.goal,
    absolute_minute: 2,
    athlete_id: 1,
  };
  const mockLinkedOwnGoal = {
    id: 2,
    kind: eventTypes.own_goal,
    minute: 2,
    absolute_minute: 2,
    game_activity_id: 1,
    athlete_id: 1,
  };
  const mockLinkedDeletedOwnGoal = {
    ...mockLinkedOwnGoal,
    delete: true,
  };
  const mockNestedOwnGoal = {
    kind: eventTypes.own_goal,
    minute: 25,
    absolute_minute: 2510,
    athlete_id: 2,
  };
  const mockUnsavedGoal = {
    kind: eventTypes.goal,
    absolute_minute: 25,
    athlete_id: 2,
    game_activities: [mockNestedOwnGoal],
  };

  const mockGameActivities = [mockYellow];

  const defaultProps = {
    timelineActivities: mockGameActivities,
    customClass: 'test',
    minute: 0,
    timelinePoint: 'start',
    setSelectedEvent: jest.fn(),
  };

  const defaultStore = {
    planningEvent: {
      gameActivities: { apiGameActivities: [], localGameActivities: [] },
    },
  };

  const getStoreWithCustomState = (customStoreState) => ({
    planningEvent: {
      gameActivities: {
        ...defaultStore.planningEvent.gameActivities,
        ...customStoreState,
      },
    },
  });

  const renderComponent = ({ props = defaultProps, store = defaultStore }) =>
    renderWithRedux(<PeriodTimelineEvent {...props} />, {
      useGlobalStore: false,
      preloadedState: store,
    });

  describe('render of a start timeline event', () => {
    it('renders the appropriate yellow card minute and image', () => {
      renderComponent({ props: { ...defaultProps, minute: 25 } });

      expect(screen.getByText('25`')).toBeInTheDocument();
      expect(screen.getByRole('img')).toHaveAttribute(
        'src',
        '/img/pitch-view/yellowCard.png'
      );
    });

    it('renders the appropriate own goal minute and image', () => {
      window.setFlag('league-ops-game-events-own-goal', true);
      renderComponent({
        props: {
          ...defaultProps,
          minute: 2,
          timelineActivities: [mockSavedGoal],
        },
        store: getStoreWithCustomState({
          localGameActivities: [mockSavedGoal, mockLinkedOwnGoal],
        }),
      });

      expect(screen.getByText('2`')).toBeInTheDocument();

      // The own goal image should be rendered instead of the regular goal
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('src', '/img/pitch-view/ownGoal.png');
      expect(img).toHaveAttribute('alt', eventTypes.own_goal);
    });

    it('renders the appropiate goal minute and image if the own goal feature flag is disabled', () => {
      window.setFlag('league-ops-game-events-own-goal', false);
      renderComponent({
        props: {
          ...defaultProps,
          minute: 2,
          timelineActivities: [mockSavedGoal],
        },
        store: getStoreWithCustomState({
          localGameActivities: [mockSavedGoal, mockLinkedOwnGoal],
        }),
      });

      expect(screen.getByText('2`')).toBeInTheDocument();

      // The own goal image should be rendered instead of the regular goal
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('src', '/img/pitch-view/goal.png');
      expect(img).toHaveAttribute('alt', eventTypes.goal);
    });

    it('renders the appropriate goal minute and image if the linked own goal is marked for deletion', () => {
      window.setFlag('league-ops-game-events-own-goal', true);
      renderComponent({
        props: {
          ...defaultProps,
          minute: 2,
          timelineActivities: [mockSavedGoal],
        },
        store: getStoreWithCustomState({
          localGameActivities: [mockSavedGoal, mockLinkedDeletedOwnGoal],
        }),
      });

      expect(screen.getByText('2`')).toBeInTheDocument();

      // The goal image should be rendered instead of the own goal
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('src', '/img/pitch-view/goal.png');
      expect(img).toHaveAttribute('alt', eventTypes.goal);
    });
  });

  describe('render of a end timeline event', () => {
    beforeEach(() => {
      renderComponent({
        props: {
          ...defaultProps,
          timelinePoint: 'end',
          minute: 50,
          timelineActivities: [mockGoal],
        },
      });
    });

    it('renders and clicking calls setSelectedEvent', async () => {
      await userEvent.click(screen.getByRole('img'));
      expect(defaultProps.setSelectedEvent).toHaveBeenCalledWith(mockGoal);
    });
  });

  describe('render of a middle timeline event', () => {
    beforeEach(() => {
      renderComponent({
        props: {
          ...defaultProps,
          timelinePoint: 'middle',
          minute: 25,
          timelineActivities: [mockYellow, mockYellow],
        },
      });
    });

    it('renders the multiple icon display indicator', () => {
      expect(screen.getByText('+2')).toBeInTheDocument();
      expect(screen.getByText('25`')).toBeInTheDocument();
    });

    it('renders the multiple event images when the +2 is hovered over', async () => {
      await userEvent.hover(screen.getByText('+2'));
      expect(screen.getAllByRole('img').length).toEqual(2);
      fireEvent.mouseLeave(screen.getByTestId('multiple-events-container'));
      expect(screen.queryAllByRole('img').length).toEqual(0);
    });

    it('renders the multiple event images when the +2 is focused', () => {
      fireEvent.focus(screen.getByText('+2'));
      expect(screen.getAllByRole('img').length).toEqual(2);
      fireEvent.blur(screen.getByTestId('multiple-events-container'));
      expect(screen.queryAllByRole('img').length).toEqual(0);
    });

    it('clicking one of the multiple event images calls setSelectedEvent', async () => {
      await userEvent.hover(screen.getByText('+2'));
      await userEvent.click(screen.getAllByRole('img')[0]);
      expect(defaultProps.setSelectedEvent).toHaveBeenCalledWith(mockYellow);
    });
  });

  describe('render of a middle timeline event with multiple own goals', () => {
    beforeEach(() => {
      window.setFlag('league-ops-game-events-own-goal', true);
      renderComponent({
        props: {
          ...defaultProps,
          timelinePoint: 'middle',
          minute: 25,
          timelineActivities: [mockSavedGoal, mockUnsavedGoal],
        },
        store: getStoreWithCustomState({
          localGameActivities: [
            mockSavedGoal,
            mockLinkedOwnGoal,
            mockUnsavedGoal,
          ],
        }),
      });
    });
    it('renders the multiple own goal images when the +2 is focused', async () => {
      fireEvent.focus(screen.getByText('+2'));

      const images = screen.getAllByRole('img');
      expect(images.length).toEqual(2);
      expect(images[0]).toHaveAttribute('src', '/img/pitch-view/ownGoal.png');
      expect(images[0]).toHaveAttribute('alt', eventTypes.own_goal);
      expect(images[1]).toHaveAttribute('src', '/img/pitch-view/ownGoal.png');
      expect(images[1]).toHaveAttribute('alt', eventTypes.own_goal);

      fireEvent.blur(screen.getByTestId('multiple-events-container'));
      expect(screen.queryAllByRole('img').length).toEqual(0);
    });
    it('clicking one of the multiple own goal images calls setSelectedEvent', async () => {
      await userEvent.hover(screen.getByText('+2'));
      await userEvent.click(screen.getAllByRole('img')[0]);
      expect(defaultProps.setSelectedEvent).toHaveBeenCalledWith(mockSavedGoal);
    });
  });
});
