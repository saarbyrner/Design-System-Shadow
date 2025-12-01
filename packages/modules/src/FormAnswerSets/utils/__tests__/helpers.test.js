import i18n from '@kitman/common/src/utils/i18n';
import { setI18n } from 'react-i18next';
import { getCompletedColumns } from '../helpers';

setI18n(i18n);

describe('getCompletedColumns', () => {
  const commonProps = {
    openModal: jest.fn(),
    isDeleteLoading: false,
    canDeleteForms: false,
  };

  it('should include the pdf column when showLatestPDF is true', () => {
    const columns = getCompletedColumns({
      ...commonProps,
      showLatestPDF: true,
    });
    const pdfColumn = columns.find((column) => column.field === 'latestPDF');
    expect(pdfColumn).toBeDefined();
    expect(pdfColumn.headerName).toBe('Latest PDF');
  });

  it('should not include the pdf column when showLatestPDF is false', () => {
    const columns = getCompletedColumns({
      ...commonProps,
      showLatestPDF: false,
    });
    const pdfColumn = columns.find((column) => column.field === 'latestPDF');
    expect(pdfColumn).toBeUndefined();
  });

  it('should include the action column when canDeleteForms is true', () => {
    const columns = getCompletedColumns({
      ...commonProps,
      canDeleteForms: true,
    });
    const actionColumn = columns.find((column) => column.field === 'actions');
    expect(actionColumn).toBeDefined();
    expect(actionColumn.field).toBe('actions');
  });

  it('should not include the action column when canDeleteForms is false', () => {
    const columns = getCompletedColumns({
      ...commonProps,
      canDeleteForms: false,
    });
    const actionColumn = columns.find((column) => column.field === 'actions');
    expect(actionColumn).toBeUndefined();
  });
});
