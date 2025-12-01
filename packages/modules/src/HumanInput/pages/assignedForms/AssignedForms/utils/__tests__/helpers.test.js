import i18n from '@kitman/common/src/utils/i18n';
import { setI18n } from 'react-i18next';
import { getCompletedColumns } from '../helpers';

setI18n(i18n);

describe('getCompletedColumns', () => {
  it('should include the pdf column when showLatestPDF is true', () => {
    const columns = getCompletedColumns({
      showLatestPDF: true,
    });
    const pdfColumn = columns.find((column) => column.field === 'latestPDF');
    expect(pdfColumn).toBeDefined();
    expect(pdfColumn.headerName).toBe('Latest PDF');
  });

  it('should not include the pdf column when showLatestPDF is false', () => {
    const columns = getCompletedColumns({
      showLatestPDF: false,
    });
    const pdfColumn = columns.find((column) => column.field === 'latestPDF');
    expect(pdfColumn).toBeUndefined();
  });
});
