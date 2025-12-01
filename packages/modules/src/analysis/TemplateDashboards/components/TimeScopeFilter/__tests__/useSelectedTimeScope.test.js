import { renderHook } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react';
import useSelectedTimeScope from '../useSelectedTimeScope';
import { getWrapper } from '../../../testUtils';

describe('TemplateDashboards|useSelectedTimeScope', () => {
  const getMockWrapperData = (timescope) => ({
    templateDashboardsFilter: {
      isPanelOpen: false,
      editable: {
        population: {
          applies_to_squad: false,
          all_squads: false,
          position_groups: [25],
          positions: [1],
          athletes: [1, 2],
          squads: [8],
          context_squads: [],
        },
        timescope,
      },
      active: {
        population: {
          applies_to_squad: false,
          all_squads: false,
          position_groups: [],
          positions: [],
          athletes: [],
          squads: [],
          context_squads: [],
        },
        timescope,
      },
    },
  });

  it('returns today label', async () => {
    const { result } = renderHook(
      () => useSelectedTimeScope({ labelOnly: true }),
      {
        wrapper: getWrapper(
          getMockWrapperData({
            time_period: 'today',
          })
        ),
      }
    );

    await waitFor(() => {
      const date = result.current.date;
      expect(date).toEqual('Today');
    });
  });

  it('returns yesterday label', async () => {
    const { result } = renderHook(
      () => useSelectedTimeScope({ labelOnly: true }),
      {
        wrapper: getWrapper(
          getMockWrapperData({
            time_period: 'yesterday',
          })
        ),
      }
    );

    await waitFor(() => {
      const date = result.current.date;
      expect(date).toEqual('Yesterday');
    });
  });

  it('returns this week label', async () => {
    const { result } = renderHook(
      () => useSelectedTimeScope({ labelOnly: true }),
      {
        wrapper: getWrapper(
          getMockWrapperData({
            time_period: 'this_week',
          })
        ),
      }
    );

    await waitFor(() => {
      const date = result.current.date;
      expect(date).toEqual('This Week');
    });
  });

  it('returns last week label', async () => {
    const { result } = renderHook(
      () => useSelectedTimeScope({ labelOnly: true }),
      {
        wrapper: getWrapper(
          getMockWrapperData({
            time_period: 'last_week',
          })
        ),
      }
    );

    await waitFor(() => {
      const date = result.current.date;
      expect(date).toEqual('Last Week');
    });
  });

  it('returns this season label', async () => {
    const { result } = renderHook(
      () => useSelectedTimeScope({ labelOnly: true }),
      {
        wrapper: getWrapper(
          getMockWrapperData({
            time_period: 'this_season',
          })
        ),
      }
    );

    await waitFor(() => {
      const date = result.current.date;
      expect(date).toEqual('This Season');
    });
  });

  it('returns this pre season label', async () => {
    const { result } = renderHook(
      () => useSelectedTimeScope({ labelOnly: true }),
      {
        wrapper: getWrapper(
          getMockWrapperData({
            time_period: 'this_pre_season',
          })
        ),
      }
    );

    await waitFor(() => {
      const date = result.current.date;
      expect(date).toEqual('This Pre Season');
    });
  });

  it('returns this in season label', async () => {
    const { result } = renderHook(
      () => useSelectedTimeScope({ labelOnly: true }),
      {
        wrapper: getWrapper(
          getMockWrapperData({
            time_period: 'this_in_season',
          })
        ),
      }
    );

    await waitFor(() => {
      const date = result.current.date;
      expect(date).toEqual('This In Season');
    });
  });

  it('returns custom date label', async () => {
    const { result } = renderHook(
      () => useSelectedTimeScope({ labelOnly: true }),
      {
        wrapper: getWrapper(
          getMockWrapperData({
            time_period: 'custom_date_range',
            end_time: '2023-10-01T22:59:59Z',
            start_time: '2023-09-11T23:00:00Z',
          })
        ),
      }
    );

    await waitFor(() => {
      const date = result.current.date;
      expect(date).toEqual('11 Sep 2023 - 01 Oct 2023');
    });
  });

  it('returns last x days label', async () => {
    const { result } = renderHook(
      () => useSelectedTimeScope({ labelOnly: true }),
      {
        wrapper: getWrapper(
          getMockWrapperData({
            time_period: 'last_x_days',
            time_period_length: 23,
          })
        ),
      }
    );

    await waitFor(() => {
      const date = result.current.date;
      expect(date).toEqual('Last 23 Days');
    });
  });

  it('returns last x day label', async () => {
    const { result } = renderHook(
      () => useSelectedTimeScope({ labelOnly: true }),
      {
        wrapper: getWrapper(
          getMockWrapperData({
            time_period: 'last_x_days',
            time_period_length: 1,
          })
        ),
      }
    );

    await waitFor(() => {
      const date = result.current.date;
      expect(date).toEqual('Last 1 Day');
    });
  });
});
