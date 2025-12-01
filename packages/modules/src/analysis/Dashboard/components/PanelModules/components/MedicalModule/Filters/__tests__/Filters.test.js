import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18n from 'i18next';
import { getMockDataForExercise } from '@kitman/services/src/mocks/handlers/rehab/getExercises';
import {
  useGetInjuryBodyAreasQuery,
  useGetActivityGroupsQuery,
  useGetInjuryClassificationsQuery,
  useGetIllnessClassificationsQuery,
  useGetSidesQuery,
  useGetSidesV2Query,
  useGetPositionsQuery,
  useGetIllnessOnsetQuery,
  useGetInjuryOnsetQuery,
  useGetGradesQuery,
  useGetCompetitionsQuery,
  useGetIllnessBodyAreasQuery,
  useGetContactTypesQuery,
} from '@kitman/modules/src/analysis/Dashboard/redux/services/medical';

import {
  i18nextTranslateStub,
  renderWithProvider,
  storeFake,
} from '@kitman/common/src/utils/test_utils';
import {
  useLazyGetExercisesQuery,
  useGetExercisesByIdQuery,
} from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import Filters from '@kitman/modules/src/analysis/Dashboard/components/PanelModules/components/MedicalModule/Filters/index';
import { useOrganisation } from '@kitman/common/src/contexts/OrganisationContext';

jest.mock('@kitman/common/src/contexts/OrganisationContext');

jest.mock(
  '@kitman/modules/src/analysis/Dashboard/redux/services/medical',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/analysis/Dashboard/redux/services/medical'
    ),
    useGetInjuryBodyAreasQuery: jest.fn(),
    useGetActivityGroupsQuery: jest.fn(),
    useGetInjuryClassificationsQuery: jest.fn(),
    useGetIllnessClassificationsQuery: jest.fn(),
    useGetSidesQuery: jest.fn(),
    useGetSidesV2Query: jest.fn(),
    useGetPositionsQuery: jest.fn(),
    useGetIllnessOnsetQuery: jest.fn(),
    useGetInjuryOnsetQuery: jest.fn(),
    useGetGradesQuery: jest.fn(),
    useGetCompetitionsQuery: jest.fn(),
    useGetIllnessBodyAreasQuery: jest.fn(),
    useGetContactTypesQuery: jest.fn(),
  })
);

jest.mock(
  '@kitman/modules/src/Medical/shared/redux/services/medicalShared',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/Medical/shared/redux/services/medicalShared'
    ),
    useLazyGetExercisesQuery: jest.fn(),
    useGetExercisesByIdQuery: jest.fn(),
  })
);

const store = {
  medicalSharedApi: {
    useLazyGetExercisesQuery: jest.fn(),
    useGetExercisesByIdQuery: jest.fn(),
  },
};

const renderComponent = (props) => {
  renderWithProvider(<Filters {...props} />, storeFake(store));
};

describe('Filters', () => {
  beforeEach(() => {
    window.featureFlags = {
      'multi-coding-pipeline-table-widget': false,
      'rep-match-day-filter': true,
    };

    useLazyGetExercisesQuery.mockReturnValue([
      jest.fn().mockReturnValue({
        data: getMockDataForExercise(),
        isError: false,
        isLoading: false,
        isFetching: false,
      }),
    ]);
    useGetExercisesByIdQuery.mockReturnValue({
      data: [],
      isError: false,
      isLoading: false,
      isFetching: false,
    });

    const mockQueryResponse = {
      data: [],
      isError: false,
      isLoading: false,
      isFetching: false,
    };

    useGetInjuryBodyAreasQuery.mockReturnValue({
      data: [
        { id: 1, name: 'Ankle' },
        { id: 2, name: 'Head' },
      ],
      isError: false,
      isLoading: false,
      isFetching: false,
    });
    useOrganisation.mockReturnValue({
      organisation: {
        coding_system_id: 2,
        coding_system_key: 'osics_10',
        id: -1,
        logo_full_path: '',
        ip_for_government: false,
      },
    });
    useGetActivityGroupsQuery.mockReturnValue(mockQueryResponse);
    useGetInjuryClassificationsQuery.mockReturnValue(mockQueryResponse);
    useGetIllnessClassificationsQuery.mockReturnValue(mockQueryResponse);
    useGetSidesQuery.mockReturnValue(mockQueryResponse);
    useGetSidesV2Query.mockReturnValue(mockQueryResponse);
    useGetPositionsQuery.mockReturnValue(mockQueryResponse);
    useGetIllnessOnsetQuery.mockReturnValue(mockQueryResponse);
    useGetInjuryOnsetQuery.mockReturnValue(mockQueryResponse);
    useGetGradesQuery.mockReturnValue(mockQueryResponse);
    useGetCompetitionsQuery.mockReturnValue(mockQueryResponse);
    useGetIllnessBodyAreasQuery.mockReturnValue(mockQueryResponse);
    useGetContactTypesQuery.mockReturnValue(mockQueryResponse);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Rehab Exercise Filters', () => {
    const onChangeSubTypeMock = jest.fn();
    const i18nT = i18nextTranslateStub(i18n);

    const props = {
      t: i18nT,
      selectedType: 'RehabSessionExercise',
      subtypes: {},
      onChangeSubType: onChangeSubTypeMock,
      direction: 'row',
    };

    it('renders rehab options correctly', async () => {
      const user = userEvent.setup();
      renderComponent(props);
      await screen.findByText('Add filter');

      const addFilter = screen.getByText('Add filter');
      await user.click(addFilter);

      expect(screen.getByText('Exercises')).toBeInTheDocument();
      expect(screen.getByText('Body area')).toBeInTheDocument();
      expect(screen.getByText('Maintenance')).toBeInTheDocument();
    });

    it('renders the RehabExercisesFilter', async () => {
      const user = userEvent.setup();
      renderComponent(props);
      await screen.findByText('Add filter');

      const addFilter = screen.getByText('Add filter');
      await user.click(addFilter);

      const exerciseOption = screen.getByText('Exercises');
      await user.click(exerciseOption);

      const input = screen.getByRole('combobox', { name: 'Search Exercises' });
      expect(input).toBeEnabled();
      await user.click(input);
      const exercise = screen.getByRole('option', {
        name: '1/2 Kneeling Ankle Mobility',
      });
      expect(exercise).toBeInTheDocument();
      await user.click(exercise);
      expect(onChangeSubTypeMock).toHaveBeenCalledWith('exercise_ids', [80]);
    });

    it('renders the Body area select filter', async () => {
      const user = userEvent.setup();
      renderComponent(props);
      await screen.findByText('Add filter');

      const addFilter = screen.getByText('Add filter');
      await user.click(addFilter);

      const bodyAreaOption = screen.getByText('Body area');
      await user.click(bodyAreaOption);

      const ankleBodyPart = await screen.findByText('Ankle');

      await user.click(ankleBodyPart);
      expect(onChangeSubTypeMock).toHaveBeenCalledWith(
        'osics_10_body_area_ids',
        [1]
      );
    });

    it('renders the maintenance boolean filter', async () => {
      const user = userEvent.setup();
      renderComponent(props);
      await screen.findByText('Add filter');

      const addFilter = screen.getByText('Add filter');
      await user.click(addFilter);

      const maintenanceOption = screen.getByText('Maintenance');
      await user.click(maintenanceOption);

      const checkBox = screen.getByRole('checkbox', {
        name: 'Maintenance',
      });

      expect(checkBox).not.toBeChecked();

      await user.click(checkBox);
      expect(onChangeSubTypeMock).toHaveBeenCalledWith('maintenance', true);
    });
  });

  describe('Medical Injury Filters', () => {
    const onChangeSubTypeMock = jest.fn();
    const onChangeFilterSubTypeMock = jest.fn();
    const i18nT = i18nextTranslateStub(i18n);

    const defaultProps = {
      t: i18nT,
      selectedType: 'MedicalInjury',
      subtypes: {},
      filterSubTypes: {},
      onChangeSubType: onChangeSubTypeMock,
      onChangeFilterSubType: onChangeFilterSubTypeMock,
      direction: 'column',
    };

    it('shows "Add filter" select when no filters are selected', async () => {
      renderComponent(defaultProps);
      expect(await screen.findByText('Add filter')).toBeInTheDocument();
    });

    it('does not show filters section when no filters are selected', () => {
      renderComponent(defaultProps);
      expect(screen.queryByText('Filters')).not.toBeInTheDocument();
    });

    it('shows filters section when filters are selected', () => {
      const propsWithFilters = {
        ...defaultProps,
        subtypes: {
          side_ids: [1, 2],
        },
      };

      renderComponent(propsWithFilters);
      expect(screen.getByText('Filters')).toBeInTheDocument();
    });

    it('handles filter removal correctly', async () => {
      const user = userEvent.setup();
      const propsWithFilters = {
        ...defaultProps,
        subtypes: {
          side_ids: [1, 2],
        },
      };

      renderComponent(propsWithFilters);
      const sideFilterTitle = screen.getByText('Side');
      const removeButton =
        sideFilterTitle.parentElement.querySelector('button');
      await user.click(removeButton);

      expect(onChangeSubTypeMock).toHaveBeenCalledWith('side_ids', []);
    });

    it('uses correct side component based on coding system', () => {
      window.featureFlags = {
        'multi-coding-pipeline-table-widget': true,
      };

      const propsWithFilters = {
        ...defaultProps,
        subtypes: {
          side_ids: [1, 2],
        },
      };

      renderComponent(propsWithFilters);
      expect(screen.getByText('Side')).toBeInTheDocument();
    });

    it('handles match day filter when feature flag is enabled', () => {
      useOrganisation.mockReturnValue({
        organisation: {
          coding_system_id: 2,
          coding_system_key: 'osiics_15',
          id: -1,
          logo_full_path: '',
          ip_for_government: false,
        },
      });

      window.featureFlags['multi-coding-pipeline-table-widget'] = true;
      window.featureFlags['rep-match-day-filter'] = true;

      const propsWithFilters = {
        ...defaultProps,
        filterSubTypes: {
          match_days: [1, 2],
        },
      };

      renderComponent(propsWithFilters);
      expect(screen.getByText('Game Day +/-')).toBeInTheDocument();
    });

    it('does not show match day filter when feature flag is disabled', () => {
      window.featureFlags = {
        'rep-match-day-filter': false,
      };

      const propsWithFilters = {
        ...defaultProps,
        filterSubTypes: {
          match_days: [1, 2],
        },
      };

      renderComponent(propsWithFilters);
      expect(screen.queryByText('Game Day +/-')).not.toBeInTheDocument();
    });
  });
});
