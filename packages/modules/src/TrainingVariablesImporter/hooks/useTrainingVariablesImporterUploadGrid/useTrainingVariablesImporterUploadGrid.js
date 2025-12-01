// @flow
import { useMemo, useState } from 'react';

import i18n from '@kitman/common/src/utils/i18n';
import {
  buildRowData,
  mergeColumns,
} from '@kitman/modules/src/shared/MassUpload/utils';
import type {
  TrainingVariablesAnswerCSV,
  UseGrid,
} from '@kitman/modules/src/shared/MassUpload/New/types';

import { getTitle } from '../../utils';
import { columns } from './consts';
import { getValidators, getRuleset } from './utils';

export default ({
  parsedCsv,
}: {
  parsedCsv: Array<TrainingVariablesAnswerCSV>,
}): UseGrid => {
  const allColumns = mergeColumns(columns, parsedCsv);

  const [isMalformedData, setIsMalformedData] = useState(false);

  const rows = useMemo(
    () =>
      buildRowData(
        setIsMalformedData,
        parsedCsv,
        getValidators(),
        allColumns,
        true
      ),
    [parsedCsv]
  );

  return {
    grid: {
      rows,
      columns: allColumns,
      emptyTableText: i18n.t('No valid data was found in CSV.'),
      id: 'TrainingVariablesImporterUploadGrid',
    },
    isLoading: false,
    isError: isMalformedData,
    ruleset: getRuleset(),
    title: getTitle(),
  };
};
