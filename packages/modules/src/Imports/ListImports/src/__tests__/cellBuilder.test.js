import { render, screen } from '@testing-library/react';
import { data } from '@kitman/services/src/mocks/handlers/searchImportsList';

import buildCellContent from '../components/cellBuilder';

describe('buildCellContent', () => {
  it('renders an TextCell name', () => {
    render(buildCellContent({ row_key: 'name' }, data[0]));
    expect(screen.getByText('myfile1.txt')).toBeInTheDocument();
  });

  it('renders a Link download_link', () => {
    render(buildCellContent({ row_key: 'download_link' }, data[0]));
    expect(screen.getByText('Link')).toBeInTheDocument();
  });

  it('renders a TextCell creator', () => {
    render(buildCellContent({ row_key: 'creator' }, data[0]));
    expect(screen.getByText('user')).toBeInTheDocument();
  });

  it('renders a TextCell created_at', () => {
    render(buildCellContent({ row_key: 'created_at' }, data[0]));
    expect(screen.getByText('Dec 17, 1995 12:00 AM')).toBeInTheDocument();
  });

  it('renders errors', () => {
    render(buildCellContent({ row_key: 'errors' }, data[0]));
    expect(screen.getByText('this errored on line 1')).toBeInTheDocument();
    expect(screen.getByText('this errored on line 2')).toBeInTheDocument();
    expect(screen.getByText('this errored on line 3')).toBeInTheDocument();
  });
});
