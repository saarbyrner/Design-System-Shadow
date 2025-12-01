/* eslint-disable jest/no-conditional-expect */
import { screen, fireEvent } from '@testing-library/react';
import * as redux from 'react-redux';

import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import useCSVExport from '@kitman/common/src/hooks/useCSVExport';
import {
  useGetGrowthMaturationDataQuery,
  useGetAllSquadAthletesQuery,
} from '@kitman/modules/src/analysis/TemplateDashboards/redux/services/templateDashboards';
import useFilterValues from '@kitman/modules/src/analysis/TemplateDashboards/hooks/useFilterValues';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import * as utilFuncs from '@kitman/modules/src/analysis/TemplateDashboards/utils';

import Table from '../index';
import { getGrowthAndMaturationColumns } from '../utils';

jest.mock(
  '@kitman/modules/src/analysis/TemplateDashboards/redux/services/templateDashboards',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/analysis/TemplateDashboards/redux/services/templateDashboards'
    ),
    useGetGrowthMaturationDataQuery: jest.fn(),
    useGetAllSquadAthletesQuery: jest.fn(),
  })
);
jest.mock(
  '@kitman/modules/src/analysis/TemplateDashboards/hooks/useFilterValues'
);
jest.mock('@kitman/common/src/hooks/useCSVExport');
jest.mock('@kitman/common/src/hooks/useEventTracking');

const props = {
  t: i18nextTranslateStub(),
};

describe('TemplateDashboards|<Table/>', () => {
  beforeEach(() => {
    useGetAllSquadAthletesQuery.mockReturnValue({
      data: { squads: [] },
    });
    useFilterValues.mockReturnValue({
      population: {
        applies_to_squad: false,
        all_squads: false,
        position_groups: [],
        positions: [],
        athletes: [1],
        squads: [],
        context_squads: [],
      },
    });
    useEventTracking.mockReturnValue({ trackEvent: jest.fn() });
    useGetGrowthMaturationDataQuery.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });
  });

  afterAll(() => {
    window.featureFlags = {};
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls useGetAllSquadAthletesQuery with refreshCache: true when not Growth and Maturation report', () => {
    jest.spyOn(utilFuncs, 'isGrowthAndMaturationReport').mockReturnValue(false);

    renderWithRedux(<Table {...props} />);

    expect(useGetAllSquadAthletesQuery).toHaveBeenCalledWith({
      refreshCache: true,
    });
  });

  it('does not pass refreshCache as a param to useGetAllSquadAthletesQuery', () => {
    jest.spyOn(utilFuncs, 'isGrowthAndMaturationReport').mockReturnValue(true);
    renderWithRedux(<Table {...props} />);

    expect(useGetAllSquadAthletesQuery).toHaveBeenCalledWith({});
  });

  describe('when isLoading is true', () => {
    it('return the DelayedLoadingFeedback', () => {
      useGetGrowthMaturationDataQuery.mockReturnValue({
        data: null,
        isLoading: true,
      });
      const { getByTestId } = renderWithRedux(<Table {...props} />);
      const loading = getByTestId('DelayedLoadingFeedback');
      expect(loading).toBeVisible();
    });
  });

  describe('when growth and maturation data is returned', () => {
    beforeEach(() => {
      useGetGrowthMaturationDataQuery.mockReturnValue({
        data: [],
        isLoading: false,
      });
    });

    describe('when mirwald-calculation FF is on', () => {
      it('renders the all column labels', () => {
        window.featureFlags = { 'mirwald-calculation': true };

        renderWithRedux(<Table {...props} />);
        getGrowthAndMaturationColumns().forEach((column) => {
          if (column.label === 'Est. adult height') {
            // accommodates the five labels for "Est. adult height"
            const heightLabels = screen.getAllByText(column.label);

            expect(heightLabels[0]).toBeVisible();
            expect(heightLabels[1]).toBeVisible();
            expect(heightLabels[2]).toBeVisible();
          } else {
            const columnLabel = screen.getByText(column.label);

            expect(columnLabel).toBeVisible();
          }
        });
      });
    });

    describe('when mirwald-calculation FF is off', () => {
      it('renders the core column labels when mirwald-calculation FF is off', () => {
        window.featureFlags = { 'mirwald-calculation': false };
        renderWithRedux(<Table {...props} />);
        getGrowthAndMaturationColumns().forEach((column) => {
          if (column.label === 'Status') {
            // only 1 status - khamis-roche
            const statusLabels = screen.getByText(column.label);

            expect(statusLabels).toBeVisible();
          } else if (column.label === 'Est. adult height') {
            // accommodates the five labels for "Est. adult height"
            const heightLabels = screen.getAllByText(column.label);

            expect(heightLabels[0]).toBeVisible();
            expect(heightLabels[1]).toBeVisible();
            expect(heightLabels[2]).toBeVisible();
          } else {
            const columnLabel = screen.getByText(column.label);

            expect(columnLabel).toBeVisible();
          }
        });
      });

      it('does not render the mirwald columns', () => {
        window.featureFlags = { 'mirwald-calculation': false };
        renderWithRedux(<Table {...props} />);

        expect(screen.queryByText('Milward')).not.toBeInTheDocument();
        expect(screen.queryByText('Maturity offset')).not.toBeInTheDocument();
        expect(
          screen.queryByText('Predicted date of PHV')
        ).not.toBeInTheDocument();
        expect(
          screen.queryByText('Predicted age of PHV')
        ).not.toBeInTheDocument();
      });
    });

    describe('when growth-and-maturation-pl-configuration FF is on', () => {
      it('renders correctly', () => {
        window.featureFlags = {
          'growth-and-maturation-pl-configuration': true,
        };

        renderWithRedux(<Table {...props} />);
        getGrowthAndMaturationColumns().forEach((column) => {
          if (column.label === 'Status') {
            // accommodates the two labels for "Status"
            const statusLabels = screen.getAllByText(column.label);

            expect(statusLabels[0]).toBeVisible();
          } else if (column.label === 'Est. adult height') {
            // accommodates the five labels for "Est. adult height"
            const heightLabels = screen.getAllByText(column.label);

            expect(heightLabels[0]).toBeVisible();
            expect(heightLabels[1]).toBeVisible();
            expect(heightLabels[2]).toBeVisible();
            expect(heightLabels[3]).toBeVisible();
            expect(heightLabels[4]).toBeVisible();
          } else {
            const columnLabel = screen.getByText(column.label);

            expect(columnLabel).toBeVisible();
          }
        });
      });
    });

    describe('when growth-and-maturation-pl-configuration FF is off', () => {
      it('renders correctly', () => {
        window.featureFlags = {
          'growth-and-maturation-pl-configuration': false,
        };
        renderWithRedux(<Table {...props} />);
        getGrowthAndMaturationColumns().forEach((column) => {
          if (column.label === 'Status') {
            // only 1 status - khamis-roche
            const statusLabels = screen.getByText(column.label);

            expect(statusLabels).toBeVisible();
          } else if (column.label === 'Est. adult height') {
            // accommodates the five labels for "Est. adult height"
            const heightLabels = screen.getAllByText(column.label);

            expect(heightLabels[0]).toBeVisible();
            expect(heightLabels[1]).toBeVisible();
            expect(heightLabels[2]).toBeVisible();
          } else {
            const columnLabel = screen.getByText(column.label);

            expect(columnLabel).toBeVisible();
          }
        });
        expect(screen.queryByText('Milward')).not.toBeInTheDocument();
        expect(screen.queryByText('Maturity Offset')).not.toBeInTheDocument();
        expect(
          screen.queryByText('Predicted Date of PHV')
        ).not.toBeInTheDocument();
        expect(
          screen.queryByText('Predicted Age of PHV')
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('when exporting to CSV', () => {
    beforeEach(() => {
      useGetGrowthMaturationDataQuery.mockReturnValue({
        data: [],
        isLoading: false,
      });

      useCSVExport.mockImplementation(() => jest.fn());
    });

    it('displays and triggers export to CSV', () => {
      const mockDispatch = jest.fn();
      jest.spyOn(redux, 'useDispatch').mockImplementation(() => mockDispatch);
      const { getByTestId, getByText } = renderWithRedux(<Table {...props} />);

      expect(mockDispatch).toHaveBeenCalledWith({
        payload: { data: [] },
        type: 'templateDashboardsFilter/setSortedData',
      });

      const tableIcon = getByTestId('table-icon');

      fireEvent.click(tableIcon);

      const exportCSV = getByText('Export CSV');
      expect(exportCSV).toBeVisible();
      expect(useCSVExport).toHaveBeenCalled();
    });
  });
});
