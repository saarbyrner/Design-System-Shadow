import { render, screen, act } from '@testing-library/react';
import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';
import { useLeagueOperations } from '@kitman/common/src/hooks';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import LastUpdatedDmrTimer from '../index';

jest.mock('@kitman/common/src/contexts/PreferenceContext/preferenceContext');
jest.mock('@kitman/common/src/hooks');

describe('LastUpdatedDmrTimer', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(global, 'setInterval');
    jest.spyOn(global, 'clearInterval');
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  const setup = (overrides = {}) => {
    const preferences = overrides.preferences || {
      schedule_page_refresh_interval_seconds: 45,
    };
    const isLeagueStaffUser = overrides.isLeagueStaffUser ?? true;
    const lastUpdatedAt = overrides.lastUpdatedAt ?? Date.now();

    usePreferences.mockReturnValue({ preferences });
    useLeagueOperations.mockReturnValue({ isLeagueStaffUser });

    render(
      <LastUpdatedDmrTimer
        lastUpdatedAt={lastUpdatedAt}
        t={i18nextTranslateStub()}
      />
    );
  };

  it('does not render if auto-refresh is disabled (not league staff)', () => {
    setup({ isLeagueStaffUser: false });

    expect(screen.queryByText(/Last update:/i)).not.toBeInTheDocument();
  });

  it('does not render if auto-refresh is disabled (no interval)', () => {
    setup({ preferences: { schedule_page_refresh_interval_seconds: 0 } });

    expect(screen.queryByText(/Last update:/i)).not.toBeInTheDocument();
  });

  it('renders and updates time every second when enabled', () => {
    const now = Date.now();
    setup({ lastUpdatedAt: now });

    expect(screen.getByText('Last refresh: 0 seconds ago')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(screen.getByText('Last refresh: 1 second ago')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(59 * 1000);
    });

    expect(
      screen.getByText('Last refresh: 60 seconds ago')
    ).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(screen.getByText('Last refresh: 1 minute ago')).toBeInTheDocument();
  });

  it('clears interval on unmount', () => {
    const now = Date.now();
    const preferences = {
      schedule_page_refresh_interval_seconds: 60,
    };
    const isLeagueStaffUser = true;

    usePreferences.mockReturnValue({ preferences });
    useLeagueOperations.mockReturnValue({ isLeagueStaffUser });

    const { unmount } = render(
      <LastUpdatedDmrTimer lastUpdatedAt={now} t={i18nextTranslateStub()} />
    );

    unmount();

    expect(clearInterval).toHaveBeenCalled();
  });

  it('shows "0 seconds ago" if lastUpdatedAt is null', () => {
    setup({ lastUpdatedAt: null });

    expect(screen.queryByText('Last refresh:')).not.toBeInTheDocument();
  });
});
