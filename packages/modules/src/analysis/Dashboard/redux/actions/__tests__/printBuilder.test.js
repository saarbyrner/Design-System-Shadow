import {
  openPrintBuilder,
  closePrintBuilder,
  updatePrintOrientation,
  updatePrintPaperSize,
} from '../printBuilder';

describe('Print Builder Actions', () => {
  it('has the correct action OPEN_PRINT_BUILDER', () => {
    const expectedAction = {
      type: 'OPEN_PRINT_BUILDER',
    };

    expect(openPrintBuilder()).toEqual(expectedAction);
  });

  it('has the correct action CLOSE_PRINT_BUILDER', () => {
    const expectedAction = {
      type: 'CLOSE_PRINT_BUILDER',
    };

    expect(closePrintBuilder()).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_PRINT_ORIENTATION', () => {
    const expectedAction = {
      type: 'UPDATE_PRINT_ORIENTATION',
      payload: {
        printOrientation: 'landscape',
      },
    };

    expect(updatePrintOrientation('landscape')).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_PRINT_PAPER_SIZE', () => {
    const expectedAction = {
      type: 'UPDATE_PRINT_PAPER_SIZE',
      payload: {
        printPaperSize: 'us_letter',
      },
    };

    expect(updatePrintPaperSize('us_letter')).toEqual(expectedAction);
  });
});
