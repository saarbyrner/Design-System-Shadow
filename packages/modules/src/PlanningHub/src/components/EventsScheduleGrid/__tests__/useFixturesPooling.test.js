import { render, screen } from '@testing-library/react';
import { useGetEventsUpdatesQuery } from '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/fixturesAPI';
import useIsTabActive from '@kitman/common/src/hooks/useIsTabActive';
import {
  useFixturesPooling,
  getPollingInterval,
  MIN_EVENTS_REFRESH_INTERVAL_SECONDS,
} from '../hooks/useFixturesPooling';

jest.mock(
  '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/fixturesAPI'
);
jest.mock('@kitman/common/src/hooks/useIsTabActive');

const mockEventDetails = [{ id: 1, name: 'Event A' }];

function TestComponent(props) {
  const { data } = useFixturesPooling(props);
  return (
    <div>
      {data.map((event) => (
        <div key={event.id}>{event.name}</div>
      ))}
    </div>
  );
}

describe('getPollingInterval', () => {
  it('returns 0 when interval is undefined', () => {
    expect(getPollingInterval(undefined)).toBe(0);
  });

  it('returns 0 when interval is null', () => {
    expect(getPollingInterval(null)).toBe(0);
  });

  it('returns the interval if it is >= MIN_EVENTS_REFRESH_INTERVAL_SECONDS', () => {
    expect(getPollingInterval(45)).toBe(45000);
  });

  it('returns MIN_EVENTS_REFRESH_INTERVAL_SECONDS and warns when interval is below minimum', () => {
    const consoleWarnSpy = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => {});
    expect(getPollingInterval(10)).toBe(
      MIN_EVENTS_REFRESH_INTERVAL_SECONDS * 1000
    );
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Provided interval (10s) is below the minimum')
    );
    consoleWarnSpy.mockRestore();
  });
});

describe('useFixturesPooling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches data when all conditions are met', () => {
    useIsTabActive.mockReturnValue(true);
    useGetEventsUpdatesQuery.mockReturnValue({
      data: mockEventDetails,
      isError: false,
    });

    render(<TestComponent eventIds={[1]} interval={45} skip={false} />);

    expect(useGetEventsUpdatesQuery).toHaveBeenCalledWith(
      { eventIds: [1] },
      {
        pollingInterval: 45000,
        skip: false,
      }
    );

    expect(screen.getByText('Event A')).toBeInTheDocument();
  });

  it('skips query when `skip` is true', () => {
    useIsTabActive.mockReturnValue(true);
    useGetEventsUpdatesQuery.mockReturnValue({ data: [], isError: false });

    render(<TestComponent eventIds={[1]} interval={45} skip />);

    expect(useGetEventsUpdatesQuery).toHaveBeenCalledWith(
      { eventIds: [1] },
      expect.objectContaining({ skip: true })
    );
  });

  it('skips query when tab is inactive', () => {
    useIsTabActive.mockReturnValue(false);
    useGetEventsUpdatesQuery.mockReturnValue({ data: [], isError: false });

    render(<TestComponent eventIds={[1]} interval={45} skip={false} />);

    expect(useGetEventsUpdatesQuery).toHaveBeenCalledWith(
      { eventIds: [1] },
      expect.objectContaining({ skip: true })
    );
  });

  it('skips query when no eventIds are present', () => {
    useIsTabActive.mockReturnValue(true);
    useGetEventsUpdatesQuery.mockReturnValue({ data: [], isError: false });

    render(<TestComponent eventIds={[]} interval={45} skip={false} />);

    expect(useGetEventsUpdatesQuery).toHaveBeenCalledWith(
      { eventIds: [] },
      expect.objectContaining({ skip: true })
    );
  });

  it('skips query when interval is 0 (invalid)', () => {
    useIsTabActive.mockReturnValue(true);
    useGetEventsUpdatesQuery.mockReturnValue({ data: [], isError: false });

    render(<TestComponent eventIds={[1]} interval={0} skip={false} />);

    expect(useGetEventsUpdatesQuery).toHaveBeenCalledWith(
      { eventIds: [1] },
      expect.objectContaining({ skip: true })
    );
  });

  it('sets errorOccurred to true and skips future queries', () => {
    useIsTabActive.mockReturnValue(true);

    // First render: simulate error
    useGetEventsUpdatesQuery.mockReturnValueOnce({
      data: [],
      isError: true,
    });

    // Second render: simulate recovery
    useGetEventsUpdatesQuery.mockReturnValue({
      data: mockEventDetails,
      isError: false,
    });

    render(<TestComponent eventIds={[1]} interval={45} skip={false} />);

    expect(useGetEventsUpdatesQuery).toHaveBeenLastCalledWith(
      { eventIds: [1] },
      expect.objectContaining({ skip: true })
    );
  });
});
