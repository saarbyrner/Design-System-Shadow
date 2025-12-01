import { render, screen, within } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import userEvent from '@testing-library/user-event';

import ImportsGrid from '..';

import useImportsListGrid from '../../../hooks/useImportsListGrid';

jest.mock('../../../hooks/useImportsListGrid');

const mockHookValue = ({
  isError = false,
  isLoading = false,
  isFetching = false,
  grid = {
    rows: [],
    columns: [],
    id: '',
    emptyTableText: '',
  },
  filteredSearchParams = {
    name: '',
  },
} = {}) => ({
  isError,
  isLoading,
  isFetching,
  filteredSearchParams,
  onHandleFilteredSearch: jest.fn(),
  onUpdateFilter: jest.fn(),
  grid,
  filterConfig: {
    importTypeOptions: [],
    creatorOptions: [],
    statusOptions: [],
  },
});

describe('<ImportsGrid />', () => {
  const props = {
    t: i18nextTranslateStub(),
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('initial render', () => {
    describe('DESKTOP', () => {
      it('renders in desktop', async () => {
        useImportsListGrid.mockReturnValue(mockHookValue());
        render(<ImportsGrid {...props} />);

        const desktop = screen.getByTestId('Filters|DesktopFilters');
        const mobile = screen.getByTestId('Filters|MobileFilters');

        expect(
          screen.getByRole('heading', {
            level: 3,
            name: /Your Imports/i,
          })
        ).toBeInTheDocument();

        expect(within(desktop).getByText(/Import Type/i)).toBeVisible();
        expect(within(desktop).getByText(/Status/i)).toBeVisible();
        expect(within(desktop).getByText(/Creator/i)).toBeVisible();
        expect(within(mobile).getByText(/Import Type/i)).not.toBeVisible();
        expect(within(mobile).getByText(/Status/i)).not.toBeVisible();
        expect(within(mobile).getByText(/Creator/i)).not.toBeVisible();
        expect(screen.getByRole('table')).toBeInTheDocument();
      });
    });

    describe('MOBILE', () => {
      beforeEach(() => {
        window.innerWidth = 500;
      });
      it('renders in mobile', async () => {
        useImportsListGrid.mockReturnValue(mockHookValue());
        render(<ImportsGrid {...props} />);

        const mobile = screen.getByTestId('Filters|MobileFilters');

        expect(
          screen.getByRole('heading', {
            level: 3,
            name: /Your Imports/i,
          })
        ).toBeInTheDocument();

        expect(screen.getByRole('button', { name: 'Filters' })).toBeVisible();

        await userEvent.click(screen.getByRole('button', { name: 'Filters' }));

        expect(within(mobile).getByText(/Import Type/i)).toBeVisible();
        expect(within(mobile).getByText(/Status/i)).toBeVisible();
        expect(within(mobile).getByText(/Creator/i)).toBeVisible();
        expect(screen.getByRole('table')).toBeInTheDocument();
      });
    });
  });
});
