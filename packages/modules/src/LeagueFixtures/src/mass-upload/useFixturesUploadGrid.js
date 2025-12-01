// @flow
import { useMemo, useState } from 'react';

import i18n from '@kitman/common/src/utils/i18n';
import { buildRowData } from '@kitman/modules/src/shared/MassUpload/utils';
import type {
  LeagueBenchmarkingCSV,
  UseGrid,
  GridConfig,
  Column,
  Validation,
} from '@kitman/modules/src/shared/MassUpload/New/types';

import { massUploadFixturesColumns } from './common/columns';
import { useFixturesUploadColumnValues } from './useFixturesUploadColumnValues';
import {
  createEmailValidator,
  createIntegerValidator,
  createListValidator,
  createBooleanValidator,
  createDateValidator,
} from './common/utils';
import FixturesRuleset from './components/FixturesRuleset';

export const emptyTableText = i18n.t('No valid data was found in csv.');

const gridId = 'FixturesUploadGrid';

const acceptedDateFormats = [
  {
    format: 'DD MMM YYYY HH:mm',
    example: '29 Sep 2025 10:30',
  },
];

const useFixturesUploadGrid = ({
  parsedCsv,
}: {
  parsedCsv: Array<LeagueBenchmarkingCSV>,
}): UseGrid => {
  const [isMalformedData, setIsMalformedData] = useState(false);

  const columns: Array<Column> = useMemo(() => massUploadFixturesColumns, []);

  const { clubs, competitions, timezones, tvChannels } =
    useFixturesUploadColumnValues();

  const dateFormatsList = acceptedDateFormats.map((item) => item.format);

  const validation: Validation = {
    'Match ID': createIntegerValidator({ isRequired: false }),
    'Date Time': createDateValidator({ acceptedDateFormats: dateFormatsList }),
    'Kick Time': createDateValidator({ acceptedDateFormats: dateFormatsList }),
    Competition: createListValidator(competitions, { isRequired: true }),
    Timezone: createListValidator(timezones, {
      customMessage: i18n.t('Invalid timezone'),
      isRequired: true,
    }),
    Duration: createIntegerValidator({ isRequired: true }),
    'Home Team': createListValidator(clubs, { isRequired: true }),
    'Away Team': createListValidator(clubs, { isRequired: true }),
    TV: createListValidator(tvChannels, {
      isMultiple: true,
      isRequired: false,
    }),
    'Match Director': createEmailValidator({ isRequired: false }),
    Referee: createEmailValidator({ isRequired: false }),
    AR1: createEmailValidator({ isRequired: false }),
    AR2: createEmailValidator({ isRequired: false }),
    '4th Official': createEmailValidator({ isRequired: false }),
    VAR: createEmailValidator({ isRequired: false }),
    AVAR: createEmailValidator({ isRequired: false }),
    'Notification Recipient': createEmailValidator({ isRequired: false }),
    'Hide from club': createBooleanValidator({ isRequired: false }),
  };

  const rows = useMemo(
    () =>
      buildRowData(setIsMalformedData, parsedCsv, validation, columns, true),
    [parsedCsv]
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
    ruleset: <FixturesRuleset acceptedDateFormats={acceptedDateFormats} />,
  };
};

export default useFixturesUploadGrid;
