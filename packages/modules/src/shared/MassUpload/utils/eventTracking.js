// @flow
import { IMPORT_TYPES } from '@kitman/modules/src/shared/MassUpload/New/utils/consts';

export const getFormType = (importType: $Values<typeof IMPORT_TYPES>): string =>
  ({
    [IMPORT_TYPES.GrowthAndMaturation]: 'Growth and maturation',
    [IMPORT_TYPES.Baselines]: 'Khamis-Roche baselines',
    [IMPORT_TYPES.LeagueBenchmarking]: 'League benchmarking',
    [IMPORT_TYPES.TrainingVariablesAnswer]: 'Training variables importer',
    [IMPORT_TYPES.EventData]: 'Event data importer',
    [IMPORT_TYPES.LeagueGame]: 'League game importer',
    [IMPORT_TYPES.KitMatrix]: 'League kits import',
  }[importType]);
