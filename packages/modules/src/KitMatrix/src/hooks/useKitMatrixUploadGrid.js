// @flow
import { useMemo, useState } from 'react';

import i18n from '@kitman/common/src/utils/i18n';
import { buildRowData } from '@kitman/modules/src/shared/MassUpload/utils';

import type {
  KitMatrixCSV,
  UseGrid,
  GridConfig,
  Column,
} from '@kitman/modules/src/shared/MassUpload/New/types';

import { createListValidator } from '@kitman/modules/src/LeagueFixtures/src/mass-upload/common/utils';
import { getPlayerTypesOptions } from '@kitman/modules/src/KitMatrix/shared/utils';
import KitMatrixRuleset from '../components/MassUpload/KitMatrixRuleset';
import massUploadKitManagementColumns from '../components/MassUpload/massUploadKitManagementColumns';
import { useKitManagementUploadColumnValues } from './useKitManagementUploadColumnValues';

const gridId = 'KitMatrixUploadGrid';

// validator to check if the string is a valid hex color
const createHexColorValidator =
  ({ isRequired = true }: { isRequired?: boolean }) =>
  (value: string) => {
    // allow empty value if not required
    if (!value && !isRequired) {
      return null;
    }

    // disallow empty value if required
    if (!value && isRequired) {
      return i18n.t('Field is required.');
    }

    // verify input is a string before further processing
    if (typeof value !== 'string') {
      return i18n.t('Invalid hex color. Must be a string.');
    }

    // regex to check if the string is a valid hex color
    const hexColorRegex = /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/;
    if (!hexColorRegex.test(value)) {
      return i18n.t('Invalid hex color. Must be a valid hex color.');
    }

    return null;
  };

// validator to check if the string is a valid string, starts with https:// and is not empty
const createURLStringValidator = ({
  isRequired = true,
}: {
  isRequired?: boolean,
}) => {
  return (value: string) => {
    if (!value && !isRequired) {
      return null;
    }
    if (!value && isRequired) {
      return i18n.t('Field is required.');
    }
    if (!value.startsWith('https://')) {
      return i18n.t('Invalid URL. Must start with https://');
    }
    return null;
  };
};

// validator to check if the string is a valid string and not empty
const createStringValidator = ({
  isRequired = true,
}: {
  isRequired?: boolean,
}) => {
  return (value: string) => {
    if (!value && !isRequired) {
      return null;
    }
    if (!value && isRequired) {
      return i18n.t('Field is required.');
    }
    return null;
  };
};

const useKitMatrixUploadGrid = ({
  parsedCsv,
}: {
  parsedCsv: Array<KitMatrixCSV>,
}): UseGrid => {
  const [isMalformedData, setIsMalformedData] = useState(false);

  const columns: Array<Column> = useMemo(
    () => massUploadKitManagementColumns,
    []
  );
  // TODO: update this hook to return colors, season, type, clubs
  const { colors, seasons, associations } =
    useKitManagementUploadColumnValues();
  const playerTypesOptions = getPlayerTypesOptions().map(
    (option) => option.label
  );

  // this is a list of validators against the csv data, each validator is a function that returns a string or null or an error message
  const validation = {
    Type: createListValidator(playerTypesOptions, { isRequired: true }),
    Club: createListValidator(associations, { isRequired: true }),
    Season: createListValidator(seasons, { isRequired: true }),
    'Kit name': createStringValidator({ isRequired: true }),
    'Kit Color': createHexColorValidator({ isRequired: true }),
    'Jersey Color': createListValidator(colors, { isRequired: true }),
    'Jersey URL': createURLStringValidator({ isRequired: true }),
    'Shorts Color': createListValidator(colors, { isRequired: true }),
    'Shorts URL': createURLStringValidator({ isRequired: true }),
    'Socks Color': createListValidator(colors, { isRequired: true }),
    'Socks URL': createURLStringValidator({ isRequired: true }),
  };

  // builds the rows data for the grid
  const rows = useMemo(
    () =>
      buildRowData(setIsMalformedData, parsedCsv, validation, columns, true),
    [parsedCsv]
  );

  const getEmptyTableText = () => i18n.t('No valid data was found in csv.');

  const grid: GridConfig = {
    rows,
    columns,
    emptyTableText: getEmptyTableText(),
    id: gridId,
  };

  return {
    grid,
    isLoading: false,
    isError: isMalformedData,
    ruleset: <KitMatrixRuleset />,
  };
};

export default useKitMatrixUploadGrid;
