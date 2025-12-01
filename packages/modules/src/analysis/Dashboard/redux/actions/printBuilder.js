// @flow
import type {
  PrintPaperSize,
  PrintOrientation,
} from '@kitman/modules/src/analysis/shared/types';
import type { Action } from '../types/actions';

export const openPrintBuilder = (): Action => ({
  type: 'OPEN_PRINT_BUILDER',
});

export const closePrintBuilder = (): Action => ({
  type: 'CLOSE_PRINT_BUILDER',
});

export const updatePrintOrientation = (
  printOrientation: PrintOrientation
): Action => ({
  type: 'UPDATE_PRINT_ORIENTATION',
  payload: {
    printOrientation,
  },
});

export const updatePrintPaperSize = (
  printPaperSize: PrintPaperSize
): Action => ({
  type: 'UPDATE_PRINT_PAPER_SIZE',
  payload: {
    printPaperSize,
  },
});
