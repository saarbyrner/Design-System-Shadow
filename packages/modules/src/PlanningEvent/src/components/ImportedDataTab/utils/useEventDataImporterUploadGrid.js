// @flow
import { useMemo, useState, useEffect } from 'react';

import i18n from '@kitman/common/src/utils/i18n';
import {
  buildRowData,
  mergeColumns,
} from '@kitman/modules/src/shared/MassUpload/utils';
import type { UseGrid } from '@kitman/modules/src/shared/MassUpload/New/types';
import { type SetState } from '@kitman/common/src/types/react';
import { type ParseState } from '@kitman/modules/src/shared/MassUpload/types';
import parseFile from '@kitman/services/src/services/planningEvent/parseFile';
import { Typography } from '@kitman/playbook/components';

const getRuleset = () => (
  <Typography variant="body">
    {i18n.t(
      'To avoid errors make sure you are importing the correct template file type for this submission.'
    )}
  </Typography>
);

export const useEventDataImporterUploadGrid = ({
  parsedCsv,
  file,
  source,
  setParseState,
  setCustomErrors,
  activeStep,
  setHasFilePondProcessed,
}: {
  parsedCsv: Array<{ [string]: string }>,
  file: File,
  source: string,
  setParseState: (ParseState) => void,
  setCustomErrors: ({ errors: Array<string>, isSuccess: boolean }) => void,
  activeStep: number,
  setHasFilePondProcessed: SetState<boolean>,
  setHasFilePondErrored: SetState<boolean>,
}): UseGrid => {
  const allColumns = mergeColumns([], parsedCsv);

  const [isMalformedData, setIsMalformedData] = useState(false);
  const [backendValidations, setBackendValidations] = useState(null);

  const getValidators = () => {
    if (!parsedCsv[0]) return {};
    return {
      // First column of row is always the username, enforced by BE validations
      [Object.keys(parsedCsv[0])[0]]: (value: string) => {
        return backendValidations?.events?.[0]?.non_setup_athletes_identifiers.includes(
          value
        )
          ? i18n.t('Not found! Double click to edit')
          : null;
      },
    };
  };

  const rows = useMemo(() => {
    return buildRowData(
      setIsMalformedData,
      parsedCsv,
      getValidators(),
      allColumns,
      true
    );
  }, [parsedCsv, backendValidations]);

  useEffect(() => {
    const processFile = async () => {
      if (file) {
        const response = await parseFile({ file, source });
        if (!response.success) {
          setParseState('ERROR');
        } else {
          setHasFilePondProcessed(true);
        }
        setCustomErrors({
          errors: response.errors ?? [],
          isSuccess: response.success,
        });
        setBackendValidations(response);
      }
    };

    if (file && source && activeStep === 2) {
      processFile();
    }
  }, [file, source, activeStep]);

  return {
    grid: {
      rows,
      columns: allColumns,
      emptyTableText: i18n.t('No valid data was found in CSV.'),
      id: 'EventDataImporterUploadGrid',
    },
    isLoading: false,
    isError: isMalformedData,
    ruleset: getRuleset(),
  };
};
