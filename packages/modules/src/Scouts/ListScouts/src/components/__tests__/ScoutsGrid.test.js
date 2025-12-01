import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import ScoutsGrid from '../ScoutsGrid';
import store from '../../../../shared/redux/store';

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

jest.mock('@kitman/common/src/hooks/useLocationAssign', () => ({
  __esModule: true,
  default: () => ({
    isScoutsListFetching: false,
    isScoutsListError: false,
    onHandleFilteredSearch: jest.fn(),
    grid: {
      columns: ['Column1', 'Column2'],
      rows: [
        { id: 1, name: 'Scout 1' },
        { id: 2, name: 'Scout 2' },
      ],
      id: 'scoutsGrid',
      emptyTableText: 'No data available',
    },
    filteredSearchParams: {
      search_expression: '',
      page: 1,
    },
    onUpdateFilter: jest.fn(),
    meta: {
      current_page: 1,
      next_page: 2,
    },
  }),
}));

describe('ScoutsGrid', () => {
  const defaultStore = storeFake({});

  it('renders the component with loading status', async () => {
    render(
      <Provider store={defaultStore}>
        <ScoutsGrid isActive />
      </Provider>
    );

    expect(screen.getByTestId('Loading')).toBeInTheDocument();
  });

  it('renders the component with data', async () => {
    render(
      <Provider store={store}>
        <ScoutsGrid isActive />
      </Provider>
    );

    await waitFor(() => {
      const scout = screen.getByText('Pierluigi Collina');

      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Username')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Creation Date')).toBeInTheDocument();
      expect(scout).toBeInTheDocument();
    });
  });
});
