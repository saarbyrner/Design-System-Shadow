// @flow
import useBenchmarkingUploadGrid from '@kitman/modules/src/Benchmarking/LeagueBenchmarkingApp/hooks/useBenchmarkingUploadGrid';
import useTrainingVariablesImportUploadGrid from '@kitman/modules/src/TrainingVariablesImporter/hooks/useTrainingVariablesImporterUploadGrid/useTrainingVariablesImporterUploadGrid';
import useGrowthAndMaturationUploadGrid from '@kitman/modules/src/GrowthAndMaturation/src/hooks/useGrowthAndMaturationUploadGrid';
import useBaselinesUploadGrid from '@kitman/modules/src/GrowthAndMaturation/src/hooks/useBaselinesUploadGrid';
import useFixturesUploadGrid from '@kitman/modules/src/LeagueFixtures/src/mass-upload/useFixturesUploadGrid';
import useKitMatrixUploadGrid from '@kitman/modules/src/KitMatrix/src/hooks/useKitMatrixUploadGrid';
import { useGetTrainingVariablesQuery } from '@kitman/common/src/redux/global/services/globalApi';
import { OptionalExpectedHeaders } from '@kitman/modules/src/TrainingVariablesImporter/consts';
import { type PermissionsType } from '@kitman/common/src/contexts/PermissionsContext/types';
import { useEventDataImporterUploadGrid } from '@kitman/modules/src/PlanningEvent/src/components/ImportedDataTab/utils/useEventDataImporterUploadGrid';
import i18n from '@kitman/common/src/utils/i18n';

import importEventData from '../../services/importEventData';
import { type ImportConfig } from '../types';
import getExpectedHeaders from './getExpectedHeaders';
import { IMPORT_TYPES } from './consts';
import { getOptionalExpectedHeaders } from '.';

const useImportConfig = ({
  importType,
  permissions,
  eventId,
}: {
  importType: $Values<typeof IMPORT_TYPES>,
  permissions: PermissionsType,
  eventId?: ?string,
}): ImportConfig | null => {
  const {
    data: { training_variables: trainingVariables } = {
      training_variables: [],
    },
  } = useGetTrainingVariablesQuery(undefined, {
    skip: importType !== IMPORT_TYPES.TrainingVariablesAnswer,
  });

  // TODO: replace getExpectedHeaders calls with columns mapped to their ID (to
  // be exported) which are located in the files containing the corresponding
  // hooks assigned to `grid` property of object returned from this function.
  // It should allow to get rid of expectedHeaders property completely, but we
  // still will need optionalExpectedHeaders though.
  switch (importType) {
    case IMPORT_TYPES.LeagueBenchmarking:
      return {
        grid: useBenchmarkingUploadGrid,
        expectedHeaders: getExpectedHeaders(importType),
        redirectUrl: '/benchmark/league_benchmarking',
        enabled:
          window.getFlag('benchmark-testing') &&
          window.getFlag('performance-optimisation-imports') &&
          permissions?.analysis.benchmarkingTestingImportArea.canView,
      };
    case IMPORT_TYPES.TrainingVariablesAnswer:
      return {
        grid: useTrainingVariablesImportUploadGrid,
        expectedHeaders: getExpectedHeaders(importType),
        optionalExpectedHeaders: [
          ...getOptionalExpectedHeaders(trainingVariables),
          OptionalExpectedHeaders.MicroCycle,
        ],
        redirectUrl: '/data_importer',
        enabled: window.getFlag('training-variables-importer'),
      };
    case IMPORT_TYPES.GrowthAndMaturation:
      return {
        grid: useGrowthAndMaturationUploadGrid,
        expectedHeaders: getExpectedHeaders(importType),
        redirectUrl: '/growth_and_maturation/assessments',
        enabled:
          window.getFlag('growth-and-maturation-area') &&
          window.getFlag('performance-optimisation-imports') &&
          permissions?.analysis.growthAndMaturationImportArea.canView,
      };
    case IMPORT_TYPES.Baselines:
      return {
        grid: useBaselinesUploadGrid,
        expectedHeaders: getExpectedHeaders(importType),
        redirectUrl: '/growth_and_maturation/assessments/baselines',
        enabled:
          window.getFlag('growth-and-maturation-area') &&
          window.getFlag('performance-optimisation-imports'),
      };
    case IMPORT_TYPES.EventData:
      return {
        // $FlowIgnore all params are required by this hook
        grid: useEventDataImporterUploadGrid,
        expectedHeaders: [],
        allowAdditionalHeaders: true,
        // $FlowIgnore[incompatible-type] eventId will always be present for this importer
        redirectUrl: `/planning_hub/events/${eventId}?include_rrule_instance=true#imported_data`,
        customSteps: [
          {
            title: i18n.t('Select import type'),
            caption: i18n.t('CSV or device'),
          },
          {
            title: i18n.t('Import data'),
            caption: i18n.t('Select period or file'),
          },
          {
            title: i18n.t('Preview import'),
            caption: i18n.t('Review any errors'),
          },
        ],
        enabled:
          window.getFlag('pac-calendar-events-imported-data-tab-in-mui') &&
          (permissions?.workloads.games.canEdit ||
            permissions?.workloads.trainingSessions.canEdit ||
            permissions?.workloads.canManageWorkload),
        canImportWithErrors: true,
        customImportService: importEventData,
      };
    case IMPORT_TYPES.LeagueGame:
      return {
        grid: useFixturesUploadGrid,
        expectedHeaders: getExpectedHeaders(importType),
        redirectUrl: '/league-fixtures?action=league-game-success-toast',
        enabled: window.getFlag('league-game-mass-game-upload'),
      };
    case IMPORT_TYPES.KitMatrix:
      return {
        grid: useKitMatrixUploadGrid,
        expectedHeaders: getExpectedHeaders(importType),
        redirectUrl:
          '/settings/kit-matrix/?action=kit-management-success-toast',
        enabled:
          window.getFlag('league-ops-kit-management-v2') &&
          permissions?.settings?.canCreateImports,
      };
    default:
      return null;
  }
};

export default useImportConfig;
