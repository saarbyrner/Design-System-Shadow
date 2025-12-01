import { screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import userEvent from '@testing-library/user-event';
import Period from '../Period';

describe('Period', () => {
  const mockEventPeriods = [
    {
      id: 1,
      duration: 30,
      absolute_duration_start: 0,
      absolute_duration_end: 30,
    },
    {
      id: 2,
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

  const mockGameActivities = [
    { id: 1, kind: 'yellow_card', absolute_minute: 25 },
    { id: 2, kind: 'red_card', absolute_minute: 50 },
  ];

  const defaultProps = {
    selectedPeriod: mockEventPeriods[0],
    eventPeriod: mockEventPeriods[0],
    periodIndex: 0,
    numOfPeriods: 3,
    totalGameTime: 90,
    isSinglePeriod: false,
    isCustomPeriods: false,
    periodActivities: mockGameActivities,
    isPeriodDeletable: false,
    setSelectedPeriod: jest.fn(),
    onDeletePeriod: jest.fn(),
    setSelectedEvent: jest.fn(),
    t: i18nextTranslateStub(),
  };

  const defaultStore = {
    planningEvent: {
      gameActivities: { apiGameActivities: [], localGameActivities: [] },
    },
  };

  const renderComponent = ({ props = defaultProps, store = defaultStore }) =>
    // Used a Redux provider because `PeriodTimelineEvent` child component rely on Redux state.
    renderWithRedux(<Period {...props} />, {
      useGlobalStore: false,
      preloadedState: store,
    });

  describe('First period render', () => {
    it('renders the initial start time of 0 minutes', () => {
      renderComponent({});
      expect(screen.getByText('0`')).toBeInTheDocument();
    });

    it('renders the period title', () => {
      renderComponent({});
      expect(screen.getByText('Period 1')).toBeInTheDocument();
    });

    it('renders the dot on the period to signify it is the current selected one', () => {
      renderComponent({});
      expect(screen.getByTestId('current-dot-period')).toBeInTheDocument();
    });

    it('opens up a delete modal and removes it when the bin icon is clicked and then cancel', async () => {
      const user = userEvent.setup();
      const component = renderComponent({
        props: {
          ...defaultProps,
          isPeriodDeletable: true,
        },
      });
      await user.click(component.container.querySelector('button'));
      expect(screen.getByText('Delete Period 1')).toBeInTheDocument();
      await user.click(screen.getByText('Cancel'));
      expect(screen.queryByText('Delete Period 1')).not.toBeInTheDocument();
      expect(defaultProps.onDeletePeriod).not.toHaveBeenCalled();
    });

    it('sends off a delete request when the bin icon is clicked and delete is clicked in the modal', async () => {
      const user = userEvent.setup();
      const component = renderComponent({
        props: {
          ...defaultProps,
          isPeriodDeletable: true,
        },
      });
      await user.click(component.container.querySelector('button'));
      expect(screen.getByText('Delete Period 1')).toBeInTheDocument();
      await user.click(screen.getByText('Confirm'));
      expect(defaultProps.onDeletePeriod).toHaveBeenCalledWith(
        mockEventPeriods[0],
        false
      );
    });

    it('renders off the respective game activities and fires setSelectedEvent when selected', async () => {
      const user = userEvent.setup();
      renderComponent({});
      expect(screen.getByText('25`')).toBeInTheDocument();
      expect(screen.queryByText('50`')).not.toBeInTheDocument();
      await user.click(screen.getByRole('img'));
      expect(defaultProps.setSelectedEvent).toHaveBeenCalledWith(
        mockGameActivities[0]
      );
    });
  });

  describe('Middle period render', () => {
    const middlePeriodProps = {
      ...defaultProps,
      selectedPeriod: mockEventPeriods[1],
      eventPeriod: mockEventPeriods[1],
      periodIndex: 1,
    };

    it('renders the period title', () => {
      renderComponent({ props: middlePeriodProps });
      expect(screen.getByText('Period 2')).toBeInTheDocument();
    });

    it('renders off the respective game activities and fires setSelectedEvent when selected', async () => {
      const user = userEvent.setup();
      renderComponent({ props: middlePeriodProps });
      expect(screen.getByText('50`')).toBeInTheDocument();
      expect(screen.queryByText('25`')).not.toBeInTheDocument();
      await user.click(screen.getByRole('img'));
      expect(defaultProps.setSelectedEvent).toHaveBeenCalledWith(
        mockGameActivities[1]
      );
    });
  });

  describe('Last period render', () => {
    const lastPeriodProps = {
      ...defaultProps,
      selectedPeriod: mockEventPeriods[2],
      periodIndex: 2,
    };

    it('renders the final end time of 90 minutes', () => {
      renderComponent({ props: lastPeriodProps });
      expect(screen.getByText('90`')).toBeInTheDocument();
    });

    it('renders the period title', () => {
      renderComponent({ props: lastPeriodProps });
      expect(screen.getByText('Period 3')).toBeInTheDocument();
    });

    it('fires off a call to set the current period when the last one is clicked', async () => {
      const user = userEvent.setup();
      renderComponent({ props: lastPeriodProps });
      await user.click(screen.getByTestId('period-3-line'));
      expect(defaultProps.setSelectedPeriod).toHaveBeenCalledWith(
        mockEventPeriods[0]
      );
    });
  });

  describe('single period render', () => {
    const singlePeriodProps = { ...defaultProps, isSinglePeriod: true };

    it('renders the correct period title', () => {
      renderComponent({ props: singlePeriodProps });
      expect(screen.getByText('Period 1 of 3')).toBeInTheDocument();
    });

    it('renders the correct time ranges', () => {
      renderComponent({ props: singlePeriodProps });
      expect(screen.getByText('0`')).toBeInTheDocument();
      expect(screen.getByText('30`')).toBeInTheDocument();
    });
  });

  describe('render based on local id', () => {
    const localIdPeriodProps = {
      ...defaultProps,
      selectedPeriod: { localId: 2 },
      eventPeriod: { localId: 2 },
      periodIndex: 1,
      numOfPeriods: 2,
    };

    it('renders the period', () => {
      renderComponent({ props: localIdPeriodProps });
      expect(screen.getByText('Period 2')).toBeInTheDocument();
    });
  });
});
