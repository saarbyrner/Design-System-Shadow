import { render, screen } from '@testing-library/react';
import ResizeObserverPolyfill from 'resize-observer-polyfill';
import ReactDataGrid from '..';

describe('<ReactDataGrid />', () => {
  const { ResizeObserver } = window;
  beforeEach(() => {
    delete window.ResizeObserver;
    window.ResizeObserver = ResizeObserverPolyfill;
    window.HTMLElement.prototype.getBoundingClientRect = jest.fn(() => {
      return {
        width: 1000,
        height: 1000,
      };
    });
  });

  afterEach(() => {
    window.ResizeObserver = ResizeObserver;
    jest.resetAllMocks();
  });

  const props = {
    tableHeaderData: [
      {
        key: 'athlete',
        name: 'Athlete',
      },
      {
        key: 'nationality',
        name: 'Nationality',
      },
      {
        key: 'position',
        name: 'Position',
      },
      {
        key: 'availability',
        name: 'Availability',
      },
    ],
    tableBodyData: [
      {
        athlete: 'John Bishop',
        nationality: 'English',
        name: 'CM',
        availability: 'available',
      },
      {
        athlete: 'Michael B',
        nationality: 'Irish',
        name: 'CB',
        availability: 'doubt',
      },
      {
        athlete: 'Petr Cech',
        nationality: 'Czech',
        name: 'GK',
        availability: 'Available',
        sub_rows: [
          {
            athlete: 'Petr Cech Junior',
            nationality: 'Czech',
            name: 'GK',
            availability: 'Available',
          },
        ],
      },
    ],
  };

  it('renders react data grid', () => {
    render(<ReactDataGrid {...props} />);
    expect(screen.getByRole('grid')).toBeInTheDocument();
    expect(screen.getAllByRole('columnheader').length).toBe(4);
    expect(screen.getAllByRole('row').length).toBe(4);
  });

  it('When the rows are expandable', () => {
    render(<ReactDataGrid {...props} expandableSubRows />);
    expect(screen.getByRole('grid')).toBeInTheDocument();
    expect(screen.getAllByRole('columnheader').length).toBe(5);
    expect(screen.getAllByRole('row').length).toBe(4);
  });

  it('When there is a custom rowHeight and columnHeight', async () => {
    render(<ReactDataGrid {...props} rowHeight={123} headerRowHeight={432} />);
    expect(screen.getByRole('grid')).toBeInTheDocument();

    expect(screen.getByRole('grid')).toHaveStyle(
      '--rdg-header-row-height: 432px;'
    );
    expect(screen.getAllByRole('row')[1]).toHaveStyle(
      '--rdg-row-height: 123px;'
    );
  });
});
