import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useSelector } from 'react-redux';

import { render } from '@kitman/modules/src/analysis/TemplateDashboards/testUtils';
import * as utilFuncs from '@kitman/modules/src/analysis/TemplateDashboards/utils';
import useCSVExport from '@kitman/common/src/hooks/useCSVExport';
import * as tableUtils from '@kitman/modules/src/analysis/TemplateDashboards/components/Table/utils';
import { useGetAllSquadAthletesQuery } from '@kitman/modules/src/analysis/TemplateDashboards/redux/services/templateDashboards';
import { getSortedData } from '@kitman/modules/src/analysis/TemplateDashboards/redux/selectors/filters';

import useSelectedTimeScope from '../../TimeScopeFilter/useSelectedTimeScope';
import useSelectedPopulation from '../../PopulationFilter/useSelectedPopulation';
import FilterControls from '..';

jest.mock('../../TimeScopeFilter/useSelectedTimeScope');
jest.mock('../../PopulationFilter/useSelectedPopulation');
jest.mock('@kitman/common/src/hooks/useCSVExport');
jest.mock(
  '@kitman/modules/src/analysis/TemplateDashboards/redux/services/templateDashboards',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/analysis/TemplateDashboards/redux/services/templateDashboards'
    ),
    useGetAllSquadAthletesQuery: jest.fn(),
  })
);
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

const props = {
  onFilterIcon: jest.fn(),
};

describe('TemplateDashboards|FilterControls', () => {
  const allSquadsAthletes = {
    data: {
      squads: [
        {
          id: 3510,
          name: 'U16 (Test Kitman FC)',
          position_groups: [
            {
              id: 28,
              name: 'Goalkeeper',
              order: 1,
              positions: [
                {
                  id: 84,
                  name: 'Goalkeeper',
                  order: 1,
                  athletes: [
                    {
                      id: 97471,
                      firstname: 'Test',
                      lastname: 'Athlete1',
                      fullname: 'Athlete1, Test',
                      shortname: 'T Athlete1',
                      user_id: 162820,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  };
  const sortedData = [
    {
      athlete_id: 97471,
      bio_age: null,
      chrono_age: 13,
      date_of_birth_quarter: 4,
      discrepancy: null,
      g_and_m_decimal_age: 12.22,
      g_and_m_maturity_offset: -7.36034009,
      g_and_m_phv_age: 19.59,
      g_and_m_est_adult_height: null,
      g_and_m_percent_adult_height_att: null,
      g_and_m_percent_adult_height_z: null,
      g_and_m_phv_date: '2031-07-15T12:00:00Z',
      g_and_m_maturity_offset_status: 'late',
      g_and_m_est_adult_height_l_50: null,
      g_and_m_est_adult_height_u_50: null,
      g_and_m_est_adult_height_l_90: null,
      g_and_m_est_adult_height_u_90: null,
      g_and_m_khamis_roche_status: null,
      g_and_m_growth_rate: null,
      most_recent_measurement: '2024-03-06T12:00:00Z',
      position: 'Goalkeeper',
      season_dob_quartile: 2,
      g_and_m_bio_age: null,
      g_and_m_height_velocity: null,
      g_and_m_weight_velocity: null,
      g_and_m_seated_height_ratio: 45.86,
      g_and_m_av_seated_height: 72,
    },
  ];

  beforeEach(() => {
    useSelectedPopulation.mockReturnValue({
      athletes: 'Salah, Mane, Firmino',
      squads: 'Liverpool FC',
      users: 'Klopp',
    });
    useSelectedTimeScope.mockReturnValue({
      date: 'Yesterday',
    });
    useGetAllSquadAthletesQuery.mockReturnValue(allSquadsAthletes);
    useSelector.mockImplementation((selector) => {
      if (selector === getSortedData) {
        return sortedData;
      }
      return null;
    });
  });

  it('renders empty state on first load', () => {
    render(<FilterControls {...props} />);

    expect(screen.queryByText('Liverpool FC')).toBeInTheDocument();
    expect(screen.queryByText('Salah, Mane, Firmino')).toBeInTheDocument();
    expect(screen.queryByText('Yesterday')).toBeInTheDocument();
  });

  it('onFilterIcon to be called', async () => {
    const component = render(<FilterControls {...props} />);
    const user = userEvent.setup();

    await user.click(
      component.container.getElementsByClassName('icon-filter')[0]
    );

    expect(props.onFilterIcon).toHaveBeenCalledTimes(1);
  });

  it('renders the print icon for non G&M dashboards', () => {
    const component = render(<FilterControls {...props} />);

    const printIcon =
      component.container.getElementsByClassName('icon-print')[0];

    expect(printIcon).toBeVisible();
  });

  it('calls useGetAllSquadAthletesQuery with refreshCache: true when not Growth and Maturation report', () => {
    jest.spyOn(utilFuncs, 'isGrowthAndMaturationReport').mockReturnValue(false);

    render(<FilterControls {...props} />);

    expect(useGetAllSquadAthletesQuery).toHaveBeenCalledWith({
      refreshCache: true,
    });
  });

  describe('for Growth & Maturation Report', () => {
    beforeEach(() => {
      jest
        .spyOn(utilFuncs, 'isGrowthAndMaturationReport')
        .mockReturnValue(() => true);
    });

    it('renders the export csv icon for the G&M report', () => {
      const component = render(<FilterControls {...props} />);

      const csvIcon =
        component.container.getElementsByClassName('file-icon-csv')[0];

      expect(csvIcon).toBeVisible();
    });

    it('calls the correct function on clicking the export csv icon', async () => {
      jest.spyOn(tableUtils, 'formatCSVData');
      const component = render(<FilterControls {...props} />);
      const user = userEvent.setup();

      await user.click(
        component.container.getElementsByClassName('file-icon-csv')[0]
      );

      expect(useCSVExport).toHaveBeenCalledWith(
        'Growth-and-maturation-table',
        tableUtils.formatCSVData(allSquadsAthletes.data, sortedData)
      );
    });
    it('should not render the squad active label', () => {
      const { queryByText } = render(<FilterControls {...props} />);

      expect(queryByText('Liverpool FC')).not.toBeInTheDocument();
    });

    it('should not render the date active label', () => {
      const { queryByText } = render(<FilterControls {...props} />);
      expect(queryByText('Yesterday')).not.toBeInTheDocument();
    });

    it('does not pass refreshCache as a param to useGetAllSquadAthletesQuery', () => {
      render(<FilterControls {...props} />);

      expect(useGetAllSquadAthletesQuery).toHaveBeenCalledWith({});
    });
  });

  describe('for Staff Development', () => {
    beforeEach(() => {
      jest.spyOn(utilFuncs, 'isStaffDevelopment').mockReturnValue(() => true);
    });
    it('should not render the squad active label', () => {
      const { queryByText } = render(<FilterControls {...props} />);
      expect(queryByText('Liverpool FC')).not.toBeInTheDocument();
    });

    it('should not render the date active label', () => {
      const { queryByText } = render(<FilterControls {...props} />);
      expect(queryByText('Yesterday')).not.toBeInTheDocument();
    });

    it('should not render the athlete names', () => {
      const { queryByText } = render(<FilterControls {...props} />);
      expect(queryByText('Salah, Mane, Firmino')).not.toBeInTheDocument();
    });

    it('should render the staff names', () => {
      const { queryByText } = render(<FilterControls {...props} />);
      expect(queryByText('Klopp')).toBeInTheDocument();
    });
  });
});
