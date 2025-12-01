// @flow
import { useMemo, useState, useEffect, type Node } from 'react';

import i18n from '@kitman/common/src/utils/i18n';
import { TextLink } from '@kitman/components';
import { colors } from '@kitman/common/src/variables';
import { getPositionGroups } from '@kitman/services';
import {
  isDateValid,
  parseBoolean,
  getDataTypeGuideline,
  buildRowData,
  getLabels,
} from '@kitman/modules/src/shared/MassUpload/utils';
import type {
  LeagueBenchmarkingCSV,
  UseGrid,
  GridConfig,
  Column,
  Validation,
  DataTypeGuidelines,
} from '@kitman/modules/src/shared/MassUpload/New/types';

import benchmarkHeaders from '../utils/benchmarkHeaders';

const styles = {
  instructionsContainer: {
    '.textButton__text': {
      color: colors.grey_200,
      fontWeight: 600,
      '&:hover': {
        textDecoration: 'underline',
      },
    },
  },
  boldLabel: {
    color: colors.grey_200,
    fontWeight: 600,
  },
};

export const emptyTableText = i18n.t('No valid data was found in csv.');

const gridId = 'BenchmarkingUploadGrid';

const acceptedDateFormats = [
  'YYYY-MM-DD',
  'YYYY/MM/DD',
  'DD-MM-YYYY',
  'DD/MM/YYYY',
];

const getUnitLabel = (unit: 'seconds' | 'minutes' | 'cm') =>
  i18n.t('Unit: {{unit}}', { unit });

type BenchmarkTestValidator = (value?: string) => null | string;
const getBenchmarkTestValidator = (
  min: number,
  max: number
): BenchmarkTestValidator =>
  ((value) => {
    if (!value) return null;
    const numericValue = Number.parseFloat(value);
    if (numericValue > max) {
      return i18n.t(
        'If filled, the entry must be a number lower than {{max}}',
        { max }
      );
    }
    if (numericValue < min) {
      return i18n.t(
        'If filled, the entry must be a number greater than {{min}}',
        { min }
      );
    }
    return null;
  }: BenchmarkTestValidator);

const getGuidelines = (positionExamples): DataTypeGuidelines => [
  {
    label: i18n.t('date_of_test'),
    acceptedValues: [getLabels().dateFormatGuide],
    isRequired: true,
  },
  {
    label: i18n.t('player_exempt'),
    caseInsensitive: true,
    acceptedValues: [
      i18n.t('Yes or No'),
      i18n.t('True or False'),
      i18n.t('Y or N'),
      i18n.t('0 or 1'),
    ],
    isRequired: true,
  },
  {
    label: i18n.t('player_position'),
    acceptedValues: positionExamples,
    isRequired: true,
  },
  {
    label: i18n.t('05m_sprint'),
    acceptedValues: [getUnitLabel('minutes')],
  },
  {
    label: i18n.t('10m_sprint'),
    acceptedValues: [getUnitLabel('minutes')],
  },
  {
    label: i18n.t('20m_sprint'),
    acceptedValues: [getUnitLabel('minutes')],
  },
  {
    label: i18n.t('30m_sprint'),
    acceptedValues: [getUnitLabel('minutes')],
  },
  {
    label: i18n.t('505_agility_right'),
    acceptedValues: [getUnitLabel('seconds')],
  },
  {
    label: i18n.t('505_agility_left'),
    acceptedValues: [getUnitLabel('seconds')],
  },
  {
    label: i18n.t('cmj_optojump'),
    acceptedValues: [getUnitLabel('cm')],
  },
  {
    label: i18n.t('cmj_vald'),
    acceptedValues: [getUnitLabel('cm')],
  },
  {
    label: i18n.t('cmj_flight_time'),
    acceptedValues: [getUnitLabel('seconds')],
  },
  {
    label: i18n.t('yo_yo_intermittent_recovery_test_level_1'),
    acceptedValues: [getUnitLabel('minutes')],
  },
  {
    label: i18n.t('yo_yo_intermittent_recovery_test_level_2'),
    acceptedValues: [getUnitLabel('minutes')],
  },
  {
    label: i18n.t('agility_arrow_head_left'),
    acceptedValues: [getUnitLabel('seconds')],
  },
  {
    label: i18n.t('agility_arrow_head_right'),
    acceptedValues: [getUnitLabel('seconds')],
  },
];

const useBenchmarkingUploadGrid = ({
  parsedCsv,
}: {
  parsedCsv: Array<LeagueBenchmarkingCSV>,
}): UseGrid => {
  const [isMalformedData, setIsMalformedData] = useState(false);

  const columns: Array<Column> = useMemo(() => benchmarkHeaders, []);

  const [validGroupNames, setValidGroupNames] = useState<Array<string>>([]);
  useEffect(() => {
    const getAndSetValidGroupNames = async () => {
      const groups = await getPositionGroups();
      setValidGroupNames(groups.map(({ name }) => name));
    };
    getAndSetValidGroupNames();
  }, []);

  const benchmarkTestValidator: BenchmarkTestValidator = (value?: string) =>
    !value || parseFloat(value) > 0
      ? null
      : i18n.t('If filled, the entry must be a number greater than 0');

  const validation: Validation = {
    date_of_test: (value) =>
      isDateValid({ date: value, acceptedFormats: acceptedDateFormats })
        ? null
        : i18n.t(
            'Date Of Test needs to be in one of the following formats: YYYY-MM-DD, YYYY/MM/DD, DD-MM-YYYY, DD/MM/YYYY'
          ),
    player_exempt: (value) =>
      parseBoolean(value) !== undefined
        ? null
        : i18n.t(
            'Player Exempt needs to be one of the following formats: true/false, yes/no, y/n, 1/0'
          ),
    player_position: (value) => {
      if (typeof value !== 'string' || value === '') {
        return i18n.t('Player Position is required');
      }
      if (
        !validGroupNames.some(
          (name) =>
            name.toLocaleLowerCase() === value.trim().toLocaleLowerCase()
        )
      ) {
        return i18n.t('Player Position is not valid');
      }
      return null;
    },
    '05m_sprint': getBenchmarkTestValidator(0.52, 1.53),
    '10m_sprint': getBenchmarkTestValidator(1.11, 2.53),
    '20m_sprint': getBenchmarkTestValidator(1.91, 4.5),
    '30m_sprint': getBenchmarkTestValidator(2.48, 6.42),
    '505_agility_right': getBenchmarkTestValidator(1.68, 3.58),
    '505_agility_left': getBenchmarkTestValidator(1.68, 3.63),
    cmj_optojump: getBenchmarkTestValidator(0, 79),
    cmj_vald: getBenchmarkTestValidator(0, 96.08),
    cmj_flight_time: benchmarkTestValidator,
    yo_yo_intermittent_recovery_test_level_1: getBenchmarkTestValidator(
      0,
      6340
    ),
    yo_yo_intermittent_recovery_test_level_2: getBenchmarkTestValidator(
      0,
      2400
    ),
    agility_arrow_head_left: getBenchmarkTestValidator(5.73, 11.81),
    agility_arrow_head_right: getBenchmarkTestValidator(5.77, 11.8),
  };

  const ruleset: Node = (
    <div css={styles.instructionsContainer}>
      <p>
        {i18n.t(
          'To avoid errors make sure you are importing the correct template file type for this submission. Download a CSV file template for'
        )}{' '}
        <TextLink
          text={i18n.t('league benchmarking test.')}
          kitmanDesignSystem
          type="textOnly"
          href="/benchmark/league_benchmarking?action=open-side-panel"
        />
      </p>
      <p>
        {i18n.t(
          'Once a file has been submitted it has to be validated by a representative from the Premier League before it is included in the league-wide benchmark data.'
        )}
      </p>

      <p css={styles.boldLabel}>{`${getLabels().generalFormatGuide}:`}</p>
      {getGuidelines(validGroupNames).map((guideline) =>
        getDataTypeGuideline(guideline)
      )}
    </div>
  );

  const rows = useMemo(
    () =>
      buildRowData(setIsMalformedData, parsedCsv, validation, columns, true),
    [parsedCsv, validGroupNames]
  );

  const grid: GridConfig = {
    rows,
    columns,
    emptyTableText,
    id: gridId,
  };

  return {
    grid,
    isLoading: false,
    isError: isMalformedData,
    ruleset,
  };
};

export default useBenchmarkingUploadGrid;
