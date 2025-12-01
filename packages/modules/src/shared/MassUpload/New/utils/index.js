// @flow
import i18n from '@kitman/common/src/utils/i18n';
import { type TrainingVariable } from '@kitman/services/src/services/getTrainingVariables';
import DefaultHeaderCell from '@kitman/modules/src/shared/MassUpload/New/components/DefaultHeaderCell';

import downloadCsvTemplate from './downloadCsvTemplate';

import { IMPORT_TYPES } from './consts';

export const getTitleLabels = (eventType?: string | null) => ({
  [IMPORT_TYPES.GrowthAndMaturation]: i18n.t('Growth and maturation'),
  [IMPORT_TYPES.Baselines]: i18n.t('Khamis-Roche baselines'),
  [IMPORT_TYPES.LeagueBenchmarking]: i18n.t('League benchmarking'),
  [IMPORT_TYPES.TrainingVariablesAnswer]: i18n.t('Data importer'),
  [IMPORT_TYPES.EventData]: eventType
    ? i18n.t('{{type}} importer', { type: eventType })
    : i18n.t('Event data importer'),
  [IMPORT_TYPES.LeagueGame]: i18n.t('League fixtures import'),
  [IMPORT_TYPES.KitMatrix]: i18n.t('League kits import'),
});

export const getErrorStateTemplateConfig = () => ({
  [IMPORT_TYPES.GrowthAndMaturation]: {
    title: i18n.t('Growth and maturation assessments.'),
    templateUrl: '/growth_and_maturation/assessments?action=open-side-panel',
  },
  [IMPORT_TYPES.Baselines]: {
    title: i18n.t('Khamis-Roche baselines.'),
    templateUrl:
      '/growth_and_maturation/assessments/baselines?action=open-side-panel',
  },
  [IMPORT_TYPES.LeagueBenchmarking]: {
    title: i18n.t('League benchmarking test.'),
    templateUrl: '/benchmark/league_benchmarking?action=open-side-panel',
  },
  [IMPORT_TYPES.TrainingVariablesAnswer]: {
    title: i18n.t('Data importer.'),
    templateUrl: '/data_importer?action=open-side-panel',
  },
  [IMPORT_TYPES.LeagueGame]: {
    title: i18n.t('League Fixtures.'),
    downloadTemplate: () =>
      downloadCsvTemplate(
        'League_Fixtures_Import_Template',
        IMPORT_TYPES.LeagueGame
      ),
  },
  [IMPORT_TYPES.KitMatrix]: {
    title: i18n.t('League kits import'),
    downloadTemplate: () =>
      downloadCsvTemplate(
        'League_Kits_Import_Template',
        IMPORT_TYPES.KitMatrix
      ),
  },
});

const getHeaderPermaIdWithoutPrefix = (id: string): string =>
  // `id` can have only one of the following prefixes.
  ['benchmarking', 'g_and_m', 'concussion']
    .map((prefix) => {
      const fullPrefix = `${prefix}_`;
      if (id.startsWith(fullPrefix)) return id.slice(fullPrefix.length);
      return '';
    })
    .filter(Boolean)
    // Because `id` can have only one of the prefixes, it’s guaranteed the
    // resulting array has only one element at this point.
    .reduce((_, value) => value, '');

// TODO(looshch): move to an appropriate place.
export const getOptionalExpectedHeaders = (
  trainingVariables: Array<TrainingVariable>
): Array<string> =>
  trainingVariables
    .flatMap(({ perma_id: id }) => [id, getHeaderPermaIdWithoutPrefix(id)])
    .filter(Boolean);

export const getIntegrationImageMapping = () => {
  const imgixBaseUrl = window.location.hostname.includes('staging')
    ? 'https://kitman-staging.imgix.net'
    : 'https://kitman.imgix.net';
  return {
    catapult: `${imgixBaseUrl}/integrations/catapult.png`,
    firstbeat: `${imgixBaseUrl}/integrations/firstbeat.png`,
    forcedecks: `${imgixBaseUrl}/integrations/forcedecks.png`,
    gymaware: `${imgixBaseUrl}/integrations/gymaware.png`,
    omegawave: `${imgixBaseUrl}/integrations/omegawave.svg`,
    statsports: `${imgixBaseUrl}/integrations/statsports.png`,
    vald: `${imgixBaseUrl}/integrations/vald.png`,
    kinexon: `${imgixBaseUrl}/integrations/kinexon.png`,
    kangatech: `${imgixBaseUrl}/integrations/kangatech.png`,
    push: `${imgixBaseUrl}/integrations/push.png`,
    champion: `${imgixBaseUrl}/integrations/champion.png`,
    oura: `${imgixBaseUrl}/integrations/oura.png`,
    playmaker: `${imgixBaseUrl}/integrations/playermaker.png`,
    statsbomb: `${imgixBaseUrl}/integrations/statsbomb.png`,
    wimu: `${imgixBaseUrl}/integrations/wimu.png`,
    vald_dynamo: `${imgixBaseUrl}/integrations/dynamo.png`,
    vald_smartspeed: `${imgixBaseUrl}/integrations/smartspeed.png`,
    hawkin_dynamics: `${imgixBaseUrl}/integrations/hawkin.png`,
    polar: `${imgixBaseUrl}/integrations/polar.png`,
    swift: `${imgixBaseUrl}/integrations/swift.png`,
  };
};

// Chunk array into groups of 3 for table display
// e.g. [1,2,3,4,5,6,7] => [[1,2,3],[4,5,6],[7]]
export const chunkArray = (arrayToChunk: Array<any>): Array<Array<any>> => {
  return Array.from(
    {
      length: Math.ceil(arrayToChunk.length / 3),
    },
    (v, i) => arrayToChunk.slice(i * 3, i * 3 + 3)
  );
};

export const mapHeaderKeysToColumnDef = (
  keys: Array<string>
): Array<{
  id: string,
  row_key: string,
  content: $ReadOnly<{
    props: {
      title: ?string,
    },
  }>,
}> =>
  keys.map((key) => ({
    id: key,
    row_key: key,
    content: <DefaultHeaderCell title={key} />,
  }));
