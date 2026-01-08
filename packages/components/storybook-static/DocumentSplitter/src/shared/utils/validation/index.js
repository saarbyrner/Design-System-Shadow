/* eslint-disable no-param-reassign */
// @flow
import moment from 'moment';
import i18n from '@kitman/common/src/utils/i18n';
import { isPositiveIntNumber } from '@kitman/common/src/utils/inputValidation';
import {
  PAGE_RANGE_REGEX,
  GREEDY_NUMBER_REGEX,
  GRID_ROW_FIELD_KEYS,
  SPLIT_DOCUMENT_MODES,
} from '@kitman/components/src/DocumentSplitter/src/shared/consts';

// Types
import type {
  DetailsGridRowData,
  ValidationResults,
} from '@kitman/components/src/DocumentSplitter/src/shared/types';
import type {
  Validation as DocumentDetailsValidation,
  Data as DocumentDetailsData,
} from '@kitman/components/src/DocumentSplitter/src/sections/DocumentDetails/types';
import type {
  Validation as SplitOptionsValidation,
  Data as SplitOptionsData,
} from '@kitman/components/src/DocumentSplitter/src/sections/SplitOptions/types';

export const getValidationMessageInPriority = (
  validationResults: ValidationResults
): string => {
  if (validationResults[GRID_ROW_FIELD_KEYS.pages]) {
    return i18n.t('Error: A valid page range is required');
  }
  if (validationResults[GRID_ROW_FIELD_KEYS.player]) {
    return i18n.t('Error: A player must be selected');
  }
  if (validationResults[GRID_ROW_FIELD_KEYS.categories]) {
    return i18n.t('Error: A category selection is required');
  }
  if (validationResults[GRID_ROW_FIELD_KEYS.fileName]) {
    return i18n.t('Error: A file name is required');
  }
  if (validationResults[GRID_ROW_FIELD_KEYS.dateOfDocument]) {
    return i18n.t('Error: A document date is required');
  }
  if (validationResults[GRID_ROW_FIELD_KEYS.hasConstraintsError]) {
    return i18n.t('Error: Date does not match player movement records ');
  }

  return i18n.t('Error! Complete required fields');
};

export const validateDocumentDetails = (
  data: DocumentDetailsData,
  allowValidation: boolean
): DocumentDetailsValidation => {
  const errors = {};
  if (
    !allowValidation ||
    window.featureFlags['medical-mass-scanning-skip-validation']
  ) {
    return {
      errors,
      hasErrors: false,
    };
  }
  const defaultError = [i18n.t('Required')];
  if (!data.fileName?.trim()) {
    errors.fileName = defaultError;
  }
  if (!data.documentDate) {
    errors.documentDate = [i18n.t('Date is required')];
  } else {
    const convertedDate = moment(data.documentDate);
    if (!convertedDate.isValid() || convertedDate.year() < 1970) {
      errors.documentDate = [i18n.t('Valid date is required')];
    }
    if (convertedDate.endOf('day').isAfter(moment().endOf('day'))) {
      errors.documentDate = [i18n.t('Date cannot be in the future')];
    }
  }

  if (!data.documentCategories || data.documentCategories.length < 1) {
    errors.documentCategories = defaultError;
  }
  if (!data.players || data.players.length < 1) {
    errors.players = defaultError;
  }
  return {
    errors,
    hasErrors: Object.keys(errors).length > 0,
  };
};

export const validateSplitOptions = (
  data: SplitOptionsData,
  totalPages: number,
  allowValidation: boolean
): SplitOptionsValidation => {
  const errors = {};
  if (!allowValidation) {
    return {
      errors,
      hasErrors: false,
    };
  }
  const defaultError = [i18n.t('Required')];
  const incorrectSplit = [
    i18n.t('Range value must be less than or equal to total pages'),
  ];

  if (
    data.splitDocument === SPLIT_DOCUMENT_MODES.intoSections ||
    data.splitDocument === SPLIT_DOCUMENT_MODES.everyX
  ) {
    const splitFromIsValidNumber = isPositiveIntNumber(data.splitFrom, true);
    if (!splitFromIsValidNumber) {
      errors.splitFrom = defaultError;
    } else if (Number(data.splitFrom) > totalPages) {
      errors.splitFrom = incorrectSplit;
    }
  }
  if (data.splitDocument === SPLIT_DOCUMENT_MODES.everyX) {
    const splitEveryIsValidNumber = isPositiveIntNumber(data.splitEvery, true);
    if (!splitEveryIsValidNumber) {
      errors.splitEvery = defaultError;
    } else if (Number(data.splitEvery) > totalPages) {
      errors.splitEvery = incorrectSplit;
    }
  } else if (data.splitDocument === SPLIT_DOCUMENT_MODES.intoSections) {
    if (!isPositiveIntNumber(data.numberOfSections, true)) {
      errors.numberOfSections = defaultError;
    }
  }

  return {
    errors,
    hasErrors: Object.keys(errors).length > 0,
  };
};

export const validateRows = (
  dataRows: Array<DetailsGridRowData>,
  totalPages: number
): ValidationResults => {
  // NOTE: Using boolean false to mean failed validation

  const isPageWithinThreshold = (pageValue: string) => {
    const pageNum = parseInt(pageValue, 10);
    return pageNum > 0 && pageNum <= totalPages;
  };

  const validationResults = dataRows.reduce((results, row) => {
    // Per row check all properties are valid
    // If a property is not valid create key for the property in validation results ( if not already present )
    // Add the rowId to the value object for that key
    const addValidationEntry = (invalidProperty: string) => {
      if (!results[invalidProperty]) {
        results[invalidProperty] = { [row.id.toString()]: false };
      } else {
        results[invalidProperty][row.id.toString()] = false;
      }
    };

    const validPages =
      PAGE_RANGE_REGEX.test(row.pages) &&
      row.pages.match(GREEDY_NUMBER_REGEX)?.every(isPageWithinThreshold);

    if (!validPages) {
      addValidationEntry(GRID_ROW_FIELD_KEYS.pages);
    }

    if (!row.player) {
      addValidationEntry(GRID_ROW_FIELD_KEYS.player);
    }

    if (!row.categories || row.categories.length < 1) {
      addValidationEntry(GRID_ROW_FIELD_KEYS.categories);
    }

    if (!row.dateOfDocument) {
      addValidationEntry(GRID_ROW_FIELD_KEYS.dateOfDocument);
    } else {
      const convertedDate = moment(row.dateOfDocument);
      if (!convertedDate.isValid() || convertedDate.year() < 1970) {
        addValidationEntry(GRID_ROW_FIELD_KEYS.dateOfDocument);
      }
    }

    if (row.hasConstraintsError) {
      addValidationEntry(GRID_ROW_FIELD_KEYS.dateOfDocument);
    }

    if (!row.fileName?.trim()) {
      addValidationEntry(GRID_ROW_FIELD_KEYS.fileName);
    }

    return results;
  }, {});

  return validationResults;
};
