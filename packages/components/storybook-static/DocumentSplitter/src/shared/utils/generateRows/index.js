// @flow

// Types
import type { Data as DocumentDetailsData } from '@kitman/components/src/DocumentSplitter/src/sections/DocumentDetails/types';
import type { Data as SplitOptionsData } from '@kitman/components/src/DocumentSplitter/src/sections/SplitOptions/types';
import type { DetailsGridRowData } from '@kitman/components/src/DocumentSplitter/src/shared/types';
import { SPLIT_DOCUMENT_MODES } from '@kitman/components/src/DocumentSplitter/src/shared/consts';

const generateRows = (
  documentDetailsData: DocumentDetailsData,
  splitOptions: SplitOptionsData,
  totalPages: number
): Array<DetailsGridRowData> => {
  const mode = splitOptions.splitDocument;
  const requiredNumberOfSections = splitOptions.numberOfSections || 1;
  const splitEvery = splitOptions.splitEvery || 1;
  const splitFrom = splitOptions.splitFrom || 1;
  let pageSplits = [];

  const allPagesRange = `1-${totalPages}`;
  const emptyPageRange = '';

  if (mode === SPLIT_DOCUMENT_MODES.noSplitting) {
    const numberOfPlayers = documentDetailsData.players.length || 1;
    pageSplits = Array(numberOfPlayers).fill(emptyPageRange);
  } else if (
    mode === SPLIT_DOCUMENT_MODES.intoSections &&
    requiredNumberOfSections > totalPages
  ) {
    // Then we don't know how to divide pages
    pageSplits = Array(totalPages).fill(emptyPageRange);
  } else if (mode === SPLIT_DOCUMENT_MODES.intoSections) {
    // Divide the pages evenly into x sections
    const divisibleTotal = totalPages + 1 - splitFrom;
    const numberOfSplits = Math.min(requiredNumberOfSections, divisibleTotal);
    const division = Math.floor(divisibleTotal / numberOfSplits) || 1;

    for (let i = 0; i < numberOfSplits; i += 1) {
      const start = i * division + splitFrom;
      const end = Math.min(start - 1 + division, totalPages);

      pageSplits.push(start < end ? `${start}-${end}` : `${end}`);
      if (end === totalPages) {
        break;
      }
    }
  } else if (mode === SPLIT_DOCUMENT_MODES.everyX) {
    pageSplits = [];
    for (let i = (splitFrom || 1) - 1; i < totalPages; i += splitEvery) {
      const start = i + 1;
      const end = Math.min(i + splitEvery, totalPages);

      pageSplits.push(start < end ? `${start}-${end}` : `${end}`);
      if (end === totalPages) {
        break;
      }
    }
  }

  if (pageSplits.length < 1) {
    pageSplits.push(allPagesRange);
  }

  return Array.from({ length: pageSplits.length }, (_, rowIndex) => ({
    id: rowIndex + 1,
    pages: pageSplits[rowIndex],
    player:
      documentDetailsData.players[
        Math.min(documentDetailsData.players.length - 1, rowIndex)
      ],
    categories: documentDetailsData.documentCategories,
    fileName: documentDetailsData.fileName,
    // NOTE: validation would have ensured a date is present
    dateOfDocument: documentDetailsData.documentDate || '',
    associatedIssues: [],
    hasConstraintsError: documentDetailsData.hasConstraintsError || false,
  }));
};

export default generateRows;
