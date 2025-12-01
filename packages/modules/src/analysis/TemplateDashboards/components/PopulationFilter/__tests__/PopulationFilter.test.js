import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { Provider } from 'react-redux';
import { screen } from '@testing-library/react';
import { data as MOCK_SQUAD_ATHLETES } from '@kitman/services/src/mocks/handlers/getSquadAthletes';
import { data as pastAthletesData } from '@kitman/services/src/mocks/handlers/analysis/getPastAthletes';
import { data as staffUsers } from '@kitman/services/src/mocks/handlers/medical/getStaffUsers';
import { useGetPermissionsQuery } from '@kitman/common/src/redux/global/services/globalApi';
import * as utilFuncs from '@kitman/modules/src/analysis/TemplateDashboards/utils';
import {
  useGetAllSquadAthletesQuery,
  useGetPastAthletesQuery,
  useGetStaffUsersQuery,
} from '@kitman/modules/src/analysis/TemplateDashboards/redux/services/templateDashboards';
import useFilter from '@kitman/modules/src/analysis/TemplateDashboards/hooks/useFilter';
import { render } from '../../../testUtils';
import PopulationFilter from '..';

const mockSetFilter = jest.fn();
const defaultFilters = {
  applies_to_squad: false,
  all_squads: false,
  position_groups: [],
  positions: [],
  athletes: [2],
  squads: [],
  context_squads: [],
  users: [],
};

jest.mock('@kitman/common/src/redux/global/services/globalApi', () => ({
  ...jest.requireActual('@kitman/common/src/redux/global/services/globalApi'),
  useGetPermissionsQuery: jest.fn(),
}));

jest.mock(
  '@kitman/modules/src/analysis/TemplateDashboards/redux/services/templateDashboards',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/analysis/TemplateDashboards/redux/services/templateDashboards'
    ),
    useGetStaffUsersQuery: jest.fn(),
    useGetAllSquadAthletesQuery: jest.fn(),
    useGetPastAthletesQuery: jest.fn(),
  })
);

jest.mock('../../../hooks/useFilter');

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const defaultStore = storeFake({
  globalApi: {
    useGetPermissionsQuery: jest.fn(),
  },
  templateDashboardsApi: {
    useGetStaffUsersQuery: jest.fn(),
    useGetAllSquadAthletesQuery: jest.fn(),
    useGetPastAthletesQuery: jest.fn(),
  },
});

const props = {
  t: i18nextTranslateStub(),
};

const renderWithProvider = () => {
  render(
    <Provider store={defaultStore}>
      <PopulationFilter {...props} />
    </Provider>
  );
};

describe('TemplateDashboards|FilterPanel', () => {
  beforeEach(() => {
    useFilter.mockReturnValue({
      filter: defaultFilters,
      setFilter: mockSetFilter,
    });

    useGetStaffUsersQuery.mockReturnValue({
      data: staffUsers,
      isSuccess: true,
    });

    useGetAllSquadAthletesQuery.mockReturnValue({
      data: MOCK_SQUAD_ATHLETES,
      isFetching: false,
    });

    useGetPastAthletesQuery.mockReturnValue({
      data: pastAthletesData,
      error: false,
      isLoading: false,
    });

    useGetPermissionsQuery.mockReturnValue({
      data: { analysis: { historicReporting: { canReport: false } } },
      isSuccess: true,
    });
  });

  it('renders population filter', () => {
    renderWithProvider();

    expect(screen.queryByText('Athletes')).toBeVisible();
    expect(screen.queryByText('Squad')).toBeVisible();
  });

  it('prefill population filter with mock hook values', async () => {
    renderWithProvider();

    expect(screen.getByText('Athlete Two')).toBeVisible();
  });

  describe('TemplateDashboards|FilterPanel for development journey', () => {
    beforeEach(() => {
      delete window.location;
      window.location = { pathname: '/development_journey' };
    });

    it('renders population filter', () => {
      renderWithProvider();

      expect(screen.queryByText('Athletes')).toBeVisible();
      expect(screen.queryByText('All Squads')).toBeVisible();
      expect(screen.queryByText('Squad')).toBeVisible();
    });

    it('calls useGetAllSquadAthletesQuery with refreshCache: true when not Growth and Maturation report', () => {
      jest
        .spyOn(utilFuncs, 'isGrowthAndMaturationReport')
        .mockReturnValue(false);

      renderWithProvider();

      expect(useGetAllSquadAthletesQuery).toHaveBeenCalledWith({
        refreshCache: true,
      });
    });

    describe('rep-historic-reporting-dev-journey (past athletes) FF', () => {
      beforeEach(() => {
        window.setFlag('rep-historic-reporting-dev-journey', true);
      });

      afterEach(() => {
        window.setFlag('rep-historic-reporting-dev-journey', false);
      });
      it('renders current or past athletes segmented control', () => {
        // Permission on
        useGetPermissionsQuery.mockReturnValue({
          data: { analysis: { historicReporting: { canReport: true } } },
          isSuccess: true,
        });

        renderWithProvider();

        // expect(await screen.findByText('Current Athletes')).toBeInTheDocument();
        expect(screen.getByText('Current Athletes')).toBeInTheDocument();
        expect(screen.getByText('Past Athletes')).toBeInTheDocument();
      });

      it('does not render current or past athletes segmented control without FF', () => {
        // Permission on
        useGetPermissionsQuery.mockReturnValue({
          data: { analysis: { historicReporting: { canReport: true } } },
          isSuccess: true,
        });
        window.setFlag('rep-historic-reporting-dev-journey', false);

        renderWithProvider();

        expect(screen.queryByText('Current Athletes')).not.toBeInTheDocument();
        expect(screen.queryByText('Past Athletes')).not.toBeInTheDocument();
      });

      it('does not render current or past athletes segmented control without permission', () => {
        renderWithProvider();

        expect(screen.queryByText('Current Athletes')).not.toBeInTheDocument();
        expect(screen.queryByText('Past Athletes')).not.toBeInTheDocument();
      });

      it('updates past athletes filter when clicking Past Athletes toggle', async () => {
        const user = userEvent.setup();
        // Permission on
        useGetPermissionsQuery.mockReturnValue({
          data: { analysis: { historicReporting: { canReport: true } } },
          isSuccess: true,
        });

        renderWithProvider();

        await user.click(
          screen.getByRole('button', { name: /past athletes/i })
        );

        expect(mockSetFilter).toHaveBeenCalledTimes(1);
        expect(mockSetFilter).toHaveBeenCalledWith({
          ...defaultFilters,
          past_athletes: true,
        });
      });

      it('updates current athletes filter when clicking Current Athletes toggle', async () => {
        const user = userEvent.setup();

        // Permission on
        useGetPermissionsQuery.mockReturnValue({
          data: { analysis: { historicReporting: { canReport: true } } },
          isSuccess: true,
        });

        renderWithProvider();

        await user.click(
          screen.getByRole('button', { name: /current athletes/i })
        );

        expect(mockSetFilter).toHaveBeenCalledTimes(1);
        expect(mockSetFilter).toHaveBeenCalledWith({
          ...defaultFilters,
          past_athletes: false,
        });
      });

      it('render past athletes select options when past_athletes filter equals true', async () => {
        useFilter.mockReturnValue({
          filter: { ...defaultFilters, past_athletes: true },
          setFilter: mockSetFilter,
        });
        useGetPermissionsQuery.mockReturnValue({
          data: { analysis: { historicReporting: { canReport: true } } },
          isSuccess: true,
        });
        const user = userEvent.setup();

        renderWithProvider();

        await user.click(screen.getByLabelText('Athletes'));

        expect(
          screen.getByText(pastAthletesData[0].fullname)
        ).toBeInTheDocument();
        expect(
          screen.getByText(pastAthletesData[1].fullname)
        ).toBeInTheDocument();
      });

      it('render current athletes select options when past_athletes filter equals false', async () => {
        useFilter.mockReturnValue({
          filter: { ...defaultFilters, past_athletes: false },
          setFilter: mockSetFilter,
        });

        const user = userEvent.setup();
        renderWithProvider();

        await user.click(screen.getByLabelText('Athletes'));

        expect(
          screen.queryByText(pastAthletesData[0].fullname)
        ).not.toBeInTheDocument();
        expect(
          screen.queryByText(pastAthletesData[1].fullname)
        ).not.toBeInTheDocument();

        expect(screen.getByText(/athlete two/i)).toBeInTheDocument();
      });
    });
  });

  describe('TemplateDashboards|FilterPanel for Growth & Maturation', () => {
    beforeEach(() => {
      jest
        .spyOn(utilFuncs, 'isGrowthAndMaturationReport')
        .mockReturnValue(() => true);
    });

    it('should not render the Squad filter', () => {
      renderWithProvider();

      expect(screen.queryByText('Athletes')).toBeInTheDocument();
      expect(screen.queryByText('Squad')).not.toBeInTheDocument();
    });

    it('does not pass refreshCache as a param to useGetAllSquadAthletesQuery', () => {
      renderWithProvider();

      expect(useGetAllSquadAthletesQuery).toHaveBeenCalledWith({});
    });
  });

  describe('TemplateDashboards|FilterPanel for Staff Development', () => {
    beforeEach(() => {
      delete window.location;
      window.location = { pathname: '/staff_development' };
    });

    it('should not render the Squad and Athletes filter', () => {
      renderWithProvider();

      expect(screen.queryByText('Athletes')).not.toBeInTheDocument();
      expect(screen.queryByText('Squad')).not.toBeInTheDocument();
    });

    it('should render Staff Member filter only', () => {
      renderWithProvider();

      expect(screen.queryByText('Staff Member')).toBeInTheDocument();
    });
  });

  describe('selectAll & clearAll functionality', () => {
    beforeEach(() => {
      delete window.location;
      window.location = { pathname: '/growth_and_maturation' };
    });

    describe('when clicking select all', () => {
      it('calls on setFilter with all athlete ids', async () => {
        renderWithProvider();

        // click on Athlete select field
        await userEvent.click(screen.getByLabelText('Athletes'));

        // click on squad
        await userEvent.click(screen.getByText('International Squad'));

        // click on select all
        await userEvent.click(screen.getByText('Select all'));

        expect(mockSetFilter).toHaveBeenCalledTimes(1);
        expect(mockSetFilter).toHaveBeenCalledWith({
          applies_to_squad: false,
          all_squads: false,
          position_groups: [],
          positions: [],
          athletes: [2, 1, 2],
          squads: [],
          context_squads: [],
          users: [],
          labels: [],
          segments: [],
        });
      });
    });

    describe('when clicking clear all', () => {
      it('calls on setFilter with an empty population object', async () => {
        renderWithProvider();

        // click on Athlete select field
        await userEvent.click(screen.getByLabelText('Athletes'));

        // click on squad
        await userEvent.click(screen.getByText('International Squad'));

        // click on clear all
        await userEvent.click(screen.getByText('Clear all'));

        expect(mockSetFilter).toHaveBeenCalledTimes(1);
        expect(mockSetFilter).toHaveBeenCalledWith({
          applies_to_squad: false,
          all_squads: false,
          position_groups: [],
          positions: [],
          athletes: [],
          squads: [],
          context_squads: [],
          users: [],
          labels: [],
          segments: [],
        });
      });
    });
  });
});
