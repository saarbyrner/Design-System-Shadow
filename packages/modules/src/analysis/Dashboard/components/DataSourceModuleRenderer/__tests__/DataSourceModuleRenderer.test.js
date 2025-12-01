import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';

import { DataSourceModuleRendererTranslated as DataSourceModuleRenderer } from '@kitman/modules/src/analysis/Dashboard/components/DataSourceModuleRenderer';
import {
  useGetMetricVariablesQuery,
  useGetAvailabilityTypeOptionsQuery,
  useGetParticipationTypeOptionsQuery,
  useGetActivitySourceOptionsQuery,
  useGetFormationsQuery,
  useGetMaturityEstimatesQuery,
} from '@kitman/modules/src/analysis/Dashboard/redux/services/dashboard';
import { useGetPositionsQuery } from '@kitman/modules/src/analysis/Dashboard/redux/services/medical';
import { useGetPreferencesQuery } from '@kitman/common/src/redux/global/services/globalApi';
import {
  DATA_SOURCE_TYPES,
  DATA_SOURCES,
} from '@kitman/modules/src/analysis/Dashboard/components/types';
import { storeFake } from '@kitman/common/src/utils/renderWithRedux';
import { data as mockGetMaturityEstimatesData } from '@kitman/services/src/mocks/handlers/analysis/getMaturityEstimates';

jest.mock('@kitman/modules/src/analysis/Dashboard/redux/services/dashboard');
jest.mock('@kitman/modules/src/analysis/Dashboard/redux/services/medical');
jest.mock('@kitman/common/src/redux/global/services/globalApi');

const onChangeCalculation = jest.fn();
const onChangeCalculationParams = jest.fn();
const addInputParams = jest.fn();
const onChangeName = jest.fn();

const props = {
  isOpen: true,
  hideColumnTitle: true,
  dataSource: 'metric',
  inputParams: {},
  calculation: '',
  calculationParams: {},

  onChangeCalculation,
  onChangeCalculationParams,
  addInputParams,
  onChangeName,
};

describe('DataSourceModuleRenderer', () => {
  describe('when source === metric', () => {
    beforeEach(() => {
      useGetMetricVariablesQuery.mockReturnValue({
        data: [
          {
            source_key: 'kitman:athlete|age_in_years',
            name: 'Age',
            source_name: 'Athlete details',
            type: 'number',
            localised_unit: 'years',
          },
        ],
        isLoading: false,
      });
    });

    it('renders the MetricModule', async () => {
      const user = userEvent.setup();
      render(<DataSourceModuleRenderer {...props} />);

      await user.click(screen.getByLabelText('Metric Source'));
      await user.click(screen.getByText('Age (years)'));

      expect(addInputParams).toHaveBeenCalledWith({
        type: DATA_SOURCE_TYPES.tableMetric,
        data: [
          { key_name: 'kitman:athlete|age_in_years', name: 'Age (years)' },
        ],
      });
      expect(onChangeName).toHaveBeenCalledWith('Age (years)');

      await user.click(screen.getByLabelText('Calculation'));
      expect(screen.getByText('Count (Absolute)')).toBeInTheDocument();
    });
  });

  describe('when source === availability', () => {
    beforeEach(() => {
      useGetAvailabilityTypeOptionsQuery.mockReturnValue({
        data: [
          {
            status: 'unavailable',
            label: 'Unavailable',
            children: [{ status: 'absent', label: 'Absent' }],
          },
        ],
        isFetching: false,
      });
    });

    it('renders the AvailabilityModule', async () => {
      const user = userEvent.setup();
      render(<DataSourceModuleRenderer {...props} dataSource="availability" />);

      await user.click(screen.getByLabelText('Availability Source'));
      await user.click(screen.getByText('Absent'));

      expect(addInputParams).toHaveBeenCalledWith({
        type: DATA_SOURCE_TYPES.availability,
        data: [{ status: 'absent' }],
      });
      expect(onChangeName).toHaveBeenCalledWith('Absent');
    });
  });

  describe('when source === activity', () => {
    beforeEach(() => {
      useGetPreferencesQuery.mockReturnValue({
        data: { enable_activity_type_category: false },
      });

      useGetActivitySourceOptionsQuery.mockReturnValue({
        data: [],
      });
    });

    it('renders the ActivityModule', async () => {
      const user = userEvent.setup();
      const defaultStore = storeFake({
        coachingPrinciples: {
          isEnabled: true,
        },
      });
      render(
        <Provider store={defaultStore}>
          <DataSourceModuleRenderer {...props} dataSource="activity" />
        </Provider>
      );

      await user.click(screen.getByLabelText('Activity Source'));
      await user.click(screen.getByText('Principles'));

      expect(addInputParams).toHaveBeenCalledWith({
        type: DATA_SOURCE_TYPES.principle,
        data: [{ ids: [] }],
      });
      expect(onChangeName).toHaveBeenCalledWith('Principles');
    });
  });

  describe('when source === participation', () => {
    beforeEach(() => {
      useGetParticipationTypeOptionsQuery.mockReturnValue({
        data: {
          games: [{ id: 123, name: 'Full' }],
          sessions: [{ id: 246, name: 'Partial' }],
        },
        isFetching: false,
      });
      window.setFlag('rep-game-involvement', true);
    });

    afterEach(() => {
      window.setFlag('rep-game-involvement', false);
    });

    it('renders the ParticipationModule', async () => {
      const user = userEvent.setup();
      render(
        <DataSourceModuleRenderer {...props} dataSource="participation" />
      );

      await user.click(screen.getByLabelText('Participation'));
      await user.click(screen.getByText('Participation Status'));

      expect(addInputParams).toHaveBeenCalledWith({
        type: DATA_SOURCE_TYPES.participationLevel,
        data: [
          {
            status: 'participation_status',
            ids: [],
          },
        ],
      });
      expect(onChangeName).toHaveBeenCalledWith('Participation Status');
    });

    it('calls onSetParticipationEvents when panelType === "column"', async () => {
      const user = userEvent.setup();
      render(
        <DataSourceModuleRenderer
          {...props}
          panelType="column"
          dataSource="participation"
        />
      );

      await user.click(screen.getByLabelText('Participation'));
      await user.click(screen.getByText('Game Involvement'));

      expect(addInputParams).toHaveBeenCalledWith({
        type: DATA_SOURCE_TYPES.participationLevel,
        data: [
          {
            event: 'game',
          },
        ],
      });
      expect(onChangeName).toHaveBeenCalledWith('Game Involvement');
    });

    it('calls onSetParticipationEvents when panelType === "row"', async () => {
      const user = userEvent.setup();
      render(
        <DataSourceModuleRenderer
          {...props}
          panelType="row"
          dataSource="participation"
        />
      );

      await user.click(screen.getByLabelText('Participation'));
      await user.click(screen.getByText('Game Involvement'));

      expect(addInputParams).toHaveBeenCalledWith({
        type: DATA_SOURCE_TYPES.participationLevel,
        data: [
          {
            event: 'game',
          },
        ],
      });
      expect(onChangeName).toHaveBeenCalledWith('Game Involvement');
    });
  });

  describe('when source === games', () => {
    beforeEach(() => {
      useGetPositionsQuery.mockReturnValue({});
      useGetFormationsQuery.mockReturnValue({});
    });

    it('renders the GameActivityModule', async () => {
      const user = userEvent.setup();
      render(<DataSourceModuleRenderer {...props} dataSource="games" />);

      await user.click(screen.getByLabelText('Game Event'));
      await user.click(screen.getByText('Goals'));

      expect(addInputParams).toHaveBeenCalledWith({
        type: DATA_SOURCE_TYPES.gameActivity,
        data: [
          {
            kinds: ['goal'],
            position_ids: [],
          },
        ],
      });
      expect(onChangeName).toHaveBeenCalledWith('Goals');
    });
  });

  describe('when source === growthAndMaturation', () => {
    beforeEach(() => {
      useGetMaturityEstimatesQuery.mockReturnValue({
        data: mockGetMaturityEstimatesData,
      });
    });

    it('renders the GrowthAndMaturationModule', async () => {
      const estimate = 'Weight velocity (kg/yr)';
      const user = userEvent.setup();
      render(
        <DataSourceModuleRenderer
          {...props}
          dataSource={DATA_SOURCES.growthAndMaturation}
        />
      );

      await user.click(screen.getByLabelText('Growth and maturation source'));

      expect(screen.getByText('Height velocity (%)')).toBeInTheDocument();

      await user.click(screen.getByText(estimate));

      expect(addInputParams).toHaveBeenCalledWith({
        type: DATA_SOURCE_TYPES.maturityEstimate,
        data: [18697],
      });
      expect(onChangeName).toHaveBeenCalledWith(estimate);
    });
  });
});
