import { IMPORT_TYPES } from '@kitman/modules/src/shared/MassUpload/New/utils/consts';

import { getFormType } from '../eventTracking';

describe('eventTracking', () => {
  describe('getFormType', () => {
    it.each([
      {
        importType: IMPORT_TYPES.GrowthAndMaturation,
        expected: 'Growth and maturation',
      },
      {
        importType: IMPORT_TYPES.Baselines,
        expected: 'Khamis-Roche baselines',
      },
      {
        importType: IMPORT_TYPES.LeagueBenchmarking,
        expected: 'League benchmarking',
      },
      {
        importType: IMPORT_TYPES.TrainingVariablesAnswer,
        expected: 'Training variables importer',
      },
      {
        importType: IMPORT_TYPES.LeagueGame,
        expected: 'League game importer',
      },
      {
        importType: IMPORT_TYPES.KitMatrix,
        expected: 'League kits import',
      },
    ])(
      'returns ‘$expected’ when `$importType` is passed',
      ({ importType, expected }) => {
        expect(getFormType(importType)).toBe(expected);
      }
    );
  });
});
