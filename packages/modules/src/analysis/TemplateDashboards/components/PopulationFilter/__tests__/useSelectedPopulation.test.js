/* eslint-disable camelcase */
import { renderHook } from '@testing-library/react-hooks';
import { useGetStaffUsersQuery } from '@kitman/modules/src/analysis/TemplateDashboards/redux/services/templateDashboards';
import { data as staffUsers } from '@kitman/services/src/mocks/handlers/medical/getStaffUsers';
import useSelectedPopulation from '../useSelectedPopulation';
import { getWrapper } from '../../../testUtils';
import * as utilFuncs from '../../../utils';

jest.mock(
  '@kitman/modules/src/analysis/TemplateDashboards/redux/services/templateDashboards',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/analysis/TemplateDashboards/redux/services/templateDashboards'
    ),
    useGetStaffUsersQuery: jest.fn(),
  })
);

const getMockPopulation = ({
  position_groups = [],
  positions = [],
  athletes = [],
  squads = [],
  context_squads = [],
  time_period = 'today',
  users = [],
}) => {
  return {
    population: {
      applies_to_squad: false,
      all_squads: false,
      position_groups,
      positions,
      athletes,
      squads,
      context_squads,
      users,
    },
    timescope: {
      time_period,
    },
  };
};

describe('TemplateDashboards|useSelectedPopulation', () => {
  const mockWrapperDataWithoutContextSquads = {
    templateDashboardsFilter: {
      isPanelOpen: false,
      editable: {
        ...getMockPopulation({
          squads: [8],
          athletes: [1, 2],
          positions: [1],
          position_groups: [25],
        }),
      },
      active: {
        ...getMockPopulation({
          squads: [8],
          athletes: [1, 2],
          positions: [1],
          position_groups: [25],
        }),
      },
    },
  };

  const mockWrapperDataWithContextSquads = {
    templateDashboardsFilter: {
      isPanelOpen: false,
      editable: {
        ...getMockPopulation({ context_squads: [8] }),
      },
      active: {
        ...getMockPopulation({ context_squads: [8] }),
      },
    },
  };

  const mockWrapperDataWithStaff = {
    templateDashboardsFilter: {
      isPanelOpen: false,
      editable: {
        ...getMockPopulation({ users: [1571, 1239] }),
      },
      active: {
        ...getMockPopulation({ users: [1571, 1239] }),
      },
    },
  };

  beforeEach(() => {
    useGetStaffUsersQuery.mockReturnValue({
      data: staffUsers,
      isSuccess: true,
    });
  });

  it('returns athletes from positions, position_groups, athletes and squads', async () => {
    const { result, waitForNextUpdate } = renderHook(
      () => useSelectedPopulation(),
      {
        wrapper: getWrapper(mockWrapperDataWithoutContextSquads),
      }
    );
    await waitForNextUpdate();

    expect(result.current).toHaveProperty('athletes');
    expect(result.current.athletes.length).toBeGreaterThan(0);
  });

  it('returns athletes names from positions, position_groups, athletes and squads', async () => {
    const { result, waitForNextUpdate } = renderHook(
      () => useSelectedPopulation({ labelOnly: true }),
      {
        wrapper: getWrapper(mockWrapperDataWithoutContextSquads),
      }
    );
    await waitForNextUpdate();

    expect(result.current).toHaveProperty('athletes');
    expect(result.current.athletes).toEqual(
      'International Squad, Forward, Athlete One, Athlete Two'
    );
  });

  it('returns squads given context_squads', async () => {
    const { result, waitForNextUpdate } = renderHook(
      () => useSelectedPopulation(),
      {
        wrapper: getWrapper(mockWrapperDataWithContextSquads),
      }
    );
    await waitForNextUpdate();

    expect(result.current).toHaveProperty('squads');
    expect(result.current.squads.length).toBeGreaterThan(0);
  });

  it('returns squads names given context_squads', async () => {
    const { result, waitForNextUpdate } = renderHook(
      () => useSelectedPopulation({ labelOnly: true }),
      {
        wrapper: getWrapper(mockWrapperDataWithContextSquads),
      }
    );
    await waitForNextUpdate();

    expect(result.current).toHaveProperty('squads');
    expect(result.current.squads).toEqual('International Squad');
  });

  describe('staff development', () => {
    beforeEach(() => {
      window.featureFlags = { 'rep-show-staff-development': true };
      jest.spyOn(utilFuncs, 'isStaffDevelopment').mockReturnValue(() => true);
    });

    it('returns staff given users', async () => {
      const { result, waitForNextUpdate } = renderHook(
        () => useSelectedPopulation({ labelOnly: true }),
        {
          wrapper: getWrapper(mockWrapperDataWithStaff),
        }
      );
      await waitForNextUpdate();

      expect(result.current).toHaveProperty('users');
      expect(result.current.users).toEqual('Stephen Smith, Rod Murphy');
    });
  });
});
