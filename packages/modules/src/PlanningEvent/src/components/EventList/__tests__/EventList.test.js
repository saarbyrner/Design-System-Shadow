import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { eventTypes } from '@kitman/common/src/consts/gameEventConsts';
import {
  yellowCardEventButton,
  redCardEventButton,
  goalEventButton,
  substitutionEventButton,
  positionSwapEventButton,
  formationChangeEventButton,
} from '@kitman/common/src/utils/gameEventTestUtils';
import EventList from '../EventList';

describe('EventList', () => {
  const defaultProps = {
    t: i18nextTranslateStub(),
    listType: 'PITCH',
    players: [],
    eventTypeFilter: null,
    setEventTypeFilter: jest.fn(),
    playerFilter: null,
    eventTypeFilterOptions: [],
    setPlayerFilter: jest.fn(),
    gameActivities: [],
    filteredActivities: [],
    pitchActivities: [],
    selectedEvent: null,
    setSelectedEvent: jest.fn(),
    activeEventSelection: '',
    playerFilterSelectOptions: [],
    handleCheckInvalidMinute: jest.fn(),
    handleEventDeletion: jest.fn(),
    handleEventValueChange: jest.fn(),
    handleEventButtonSelection: jest.fn(),
    getPlayerSelectOptions: jest.fn(),
    setActiveEventSelection: jest.fn(),
    createEventListFormationChange: jest.fn(),
    staff: [],
    isMidGamePlayerPositionChangeDisabled: false,
  };

  const renderComponent = (props = defaultProps) =>
    render(<EventList {...props} />);

  describe('Initial Pitch render', () => {
    it('renders all the event list image buttons', () => {
      renderComponent();
      expect(
        screen.getByRole('button', {
          name: goalEventButton,
        })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', {
          name: yellowCardEventButton,
        })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', {
          name: redCardEventButton,
        })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', {
          name: substitutionEventButton,
        })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', {
          name: positionSwapEventButton,
        })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', {
          name: formationChangeEventButton,
        })
      ).toBeInTheDocument();
    });

    it('clicking the sub event list button selects it', async () => {
      const user = userEvent.setup();
      renderComponent();
      await user.click(
        screen.getByRole('button', {
          name: substitutionEventButton,
        })
      );
      expect(defaultProps.handleEventButtonSelection).toHaveBeenCalledWith(
        eventTypes.sub
      );
      renderComponent({
        ...defaultProps,
        activeEventSelection: eventTypes.sub,
      });
      expect(
        screen.getAllByRole('button', {
          name: substitutionEventButton,
        })[1]
      ).toHaveClass('selectedButton');
    });

    it('clicking the goal event list button selects it', async () => {
      const user = userEvent.setup();
      renderComponent();
      await user.click(
        screen.getByRole('button', {
          name: goalEventButton,
        })
      );
      expect(defaultProps.handleEventButtonSelection).toHaveBeenCalledWith(
        eventTypes.goal
      );
      renderComponent({
        ...defaultProps,
        activeEventSelection: eventTypes.goal,
      });
      expect(
        screen.getAllByRole('button', {
          name: goalEventButton,
        })[1]
      ).toHaveClass('selectedButton');
    });

    it('clicking the position swap event list button selects it', async () => {
      const user = userEvent.setup();
      renderComponent();
      await user.click(
        screen.getByRole('button', {
          name: positionSwapEventButton,
        })
      );
      expect(defaultProps.handleEventButtonSelection).toHaveBeenCalledWith(
        eventTypes.switch
      );
      renderComponent({
        ...defaultProps,
        activeEventSelection: eventTypes.switch,
      });
      expect(
        screen.getAllByRole('button', {
          name: positionSwapEventButton,
        })[1]
      ).toHaveClass('selectedButton');
    });

    it('clicking the yellow card event list button selects it', async () => {
      const user = userEvent.setup();
      renderComponent();
      await user.click(
        screen.getByRole('button', {
          name: yellowCardEventButton,
        })
      );
      expect(defaultProps.handleEventButtonSelection).toHaveBeenCalledWith(
        eventTypes.yellow
      );
      renderComponent({
        ...defaultProps,
        activeEventSelection: eventTypes.yellow,
      });
      expect(
        screen.getAllByRole('button', {
          name: yellowCardEventButton,
        })[1]
      ).toHaveClass('selectedButton');
    });

    it('clicking the red card event list button selects it', async () => {
      const user = userEvent.setup();
      renderComponent();
      await user.click(
        screen.getByRole('button', {
          name: redCardEventButton,
        })
      );
      expect(defaultProps.handleEventButtonSelection).toHaveBeenCalledWith(
        eventTypes.red
      );
      renderComponent({
        ...defaultProps,
        activeEventSelection: eventTypes.red,
      });
      expect(
        screen.getAllByRole('button', {
          name: redCardEventButton,
        })[1]
      ).toHaveClass('selectedButton');
    });

    it('clicking the formation event list button selects it', async () => {
      const user = userEvent.setup();
      renderComponent();
      await user.click(
        screen.getByRole('button', {
          name: formationChangeEventButton,
        })
      );
      expect(defaultProps.createEventListFormationChange).toHaveBeenCalled();
    });

    it('renders the event list header and filters', () => {
      renderComponent();
      expect(screen.getByText('Event list')).toBeInTheDocument();
      expect(screen.getByText('Events')).toBeInTheDocument();
      expect(screen.getByText('Players')).toBeInTheDocument();
    });
  });

  describe('isMidGamePlayerPositionChangeDisabled render', () => {
    it('doesnt allow the user to select subs/position swaps/formation changes', async () => {
      const user = userEvent.setup();
      renderComponent({
        ...defaultProps,
        isMidGamePlayerPositionChangeDisabled: true,
      });
      await user.click(
        screen.getByRole('button', {
          name: substitutionEventButton,
        })
      );
      expect(defaultProps.handleEventButtonSelection).not.toHaveBeenCalled();
      await user.click(
        screen.getByRole('button', {
          name: positionSwapEventButton,
        })
      );
      expect(defaultProps.handleEventButtonSelection).not.toHaveBeenCalled();
      await user.click(
        screen.getByRole('button', {
          name: formationChangeEventButton,
        })
      );
      expect(
        defaultProps.createEventListFormationChange
      ).not.toHaveBeenCalled();
    });
  });

  describe('Initial Match report render', () => {
    beforeEach(() => {
      renderComponent({ ...defaultProps, listType: 'MATCH' });
    });

    it('Only renders the goal, sub, yellow and red card buttons', () => {
      expect(
        screen.getByRole('button', {
          name: goalEventButton,
        })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', {
          name: yellowCardEventButton,
        })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', {
          name: redCardEventButton,
        })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', {
          name: substitutionEventButton,
        })
      ).toBeInTheDocument();
      expect(
        screen.queryByRole('button', {
          name: positionSwapEventButton,
        })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', {
          name: formationChangeEventButton,
        })
      ).not.toBeInTheDocument();
    });
  });
});
