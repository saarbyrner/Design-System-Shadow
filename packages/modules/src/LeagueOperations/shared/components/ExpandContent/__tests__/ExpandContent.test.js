import { render, screen } from '@testing-library/react';

import ResizeObserverPolyfill from 'resize-observer-polyfill';
import { Provider } from 'react-redux';
import { useFetchRegistrationGridsQuery } from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGridApi';
import MLS_NEXT_GRIDS from '@kitman/modules/src/LeagueOperations/technicalDebt/grids/mlsNext';

import { transformMultiRegistrationToRows } from '@kitman/modules/src/LeagueOperations/shared/components/Tabs/TabAthleteList/utils';

import ExpandContent from '..';

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGridApi',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGridApi'
    ),
    useFetchRegistrationGridsQuery: jest.fn(),
  })
);

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => state,
});

const defaultStore = storeFake({
  'LeagueOperations.registration.api.grids': {
    useFetchRegistrationGridsQuery: jest.fn(),
  },
});

const renderWithProviders = (storeArg, children) => {
  render(<Provider store={storeArg}>{children}</Provider>);
};

const mockRTKQueries = (data) => {
  useFetchRegistrationGridsQuery.mockReturnValue({
    data,
    isLoading: false,
    isFetching: false,
    isError: false,
  });
};

const mockMultiRegistration = [
  {
    id: 13618,
    user_id: 161192,
    status: 'pending_payment',
    division: {
      id: 1,
      name: 'KLS Next',
    },
  },
  {
    id: 13619,
    user_id: 161192,
    status: 'pending_payment',
    division: {
      id: 1,
      name: 'KLS Next Pro',
    },
  },
];

const props = {
  gridStartColumn: 'organisations',
  onTransformData: transformMultiRegistrationToRows,
  rows: mockMultiRegistration,
  gridParams: {
    key: 'registration',
    userType: 'association_admin',
  },
};

describe('<ExpandContent/>', () => {
  const { ResizeObserver } = window;
  beforeEach(() => {
    delete window.ResizeObserver;
    window.ResizeObserver = ResizeObserverPolyfill;
    window.HTMLElement.prototype.getBoundingClientRect = jest.fn(() => ({
      width: 1000,
      height: 600,
      left: 32,
    }));
    mockRTKQueries(MLS_NEXT_GRIDS.association_admin.organisation);
  });
  afterEach(() => {
    window.ResizeObserver = ResizeObserver;
    jest.resetAllMocks();
  });
  it('renders', () => {
    renderWithProviders(storeFake(defaultStore), <ExpandContent {...props} />);
    expect(screen.getAllByText('Kitman Labs')).toHaveLength(2);
  });
});
