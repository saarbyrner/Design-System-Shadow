import { setI18n } from 'react-i18next';
import { Provider } from 'react-redux';

import i18n from '@kitman/common/src/utils/i18n';
import userEvent from '@testing-library/user-event';
import { REDUCER_KEY as REGISTRATIONS_GRID_SLICE } from '@kitman/modules/src/LeagueOperations/shared/redux/slices/registrationGridSlice';
import {
  useLazyFetchOrganisationLabelCategoriesGroupsQuery,
  useLazyFetchAssociationLabelCategoriesGroupsQuery,
} from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGridApi';
import { useLocationHash } from '@kitman/common/src/hooks';
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { getOrganisation } from '@kitman/common/src/redux/global/selectors';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import useLocationSearch from '@kitman/common/src/hooks/useLocationSearch';
import HomegrownTotal from '..';

jest.mock('@kitman/common/src/redux/global/selectors', () => ({
  ...jest.requireActual('@kitman/common/src/redux/global/selectors'),
  getOrganisation: jest.fn(),
}));
jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGridApi',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGridApi'
    ),
    useLazyFetchOrganisationLabelCategoriesGroupsQuery: jest.fn(),
    useLazyFetchAssociationLabelCategoriesGroupsQuery: jest.fn(),
  })
);
jest.mock('@kitman/common/src/contexts/PermissionsContext');
jest.mock('@kitman/common/src/hooks/useLocationSearch');
jest.mock('@kitman/common/src/hooks', () => ({
  ...jest.requireActual('@kitman/common/src/hooks'),
  useLocationHash: jest.fn(),
}));

setI18n(i18n);
const getUser = () => userEvent.setup();
const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => state,
});

const mockHomegrownData = {
  id: 1,
  name: 'Homegrown 45',
  max_number: 45,
  created_by: {
    id: 160906,
    fullname: 'Service User',
  },
  label_categories: [
    {
      id: 1,
      name: 'Homegrown (U15)',
      max_number: 20,
      labels_count: 0,
    },
    {
      id: 2,
      name: 'Homegrown (U17)',
      max_number: 20,
      labels_count: 0,
    },
    {
      id: 3,
      name: 'Homegrown (U19)',
      max_number: 15,
      labels_count: 0,
    },
  ],
};

const defaultStore = storeFake({
  globalApi: {
    useGetOrganisationQuery: jest.fn(),
    useGetPermissionsQuery: jest.fn(),
  },
  [REGISTRATIONS_GRID_SLICE]: {},
});

const renderWithPermissions = ({ canViewHomegrownTags }) => {
  usePermissions.mockReturnValue({
    permissions: {
      homegrown: { canViewHomegrownTags },
    },
  });

  return render(
    <Provider store={defaultStore}>
      <HomegrownTotal />
    </Provider>
  );
};

describe('HomegrownTotal', () => {
  beforeEach(() => {
    useLocationHash.mockReturnValue('#players');
    useLocationSearch.mockReturnValue(new URLSearchParams());
    useLazyFetchOrganisationLabelCategoriesGroupsQuery.mockReturnValue([
      jest.fn().mockReturnValue({
        data: mockHomegrownData,
        isError: false,
        isLoading: false,
        isFetching: false,
        isSuccess: true,
      }),
    ]);
    useLazyFetchAssociationLabelCategoriesGroupsQuery.mockReturnValue([
      jest.fn().mockReturnValue({}),
    ]);
    getOrganisation.mockReturnValue(() => ({
      id: '1',
      name: 'Test Organisation',
      country: 'Test Country',
      label_categories_groups: [
        {
          id: 1,
          name: 'Home45',
        },
      ],
    }));
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing if user does not have permission', () => {
    renderWithPermissions({ canViewHomegrownTags: false });
    expect(screen.queryByText('Homegrown totals')).not.toBeInTheDocument();
  });

  it('renders nothing if location hash is staff', () => {
    useLocationHash.mockReturnValue('#staff');
    renderWithPermissions({ canViewHomegrownTags: true });
    expect(screen.queryByText('Homegrown totals')).not.toBeInTheDocument();
  });

  it('renders button if user has permission', () => {
    renderWithPermissions({ canViewHomegrownTags: true });
    expect(screen.getByText('Homegrown totals')).toBeInTheDocument();
  });

  it('opens panel when button is clicked, and renders the panel content', async () => {
    const user = getUser();
    renderWithPermissions({ canViewHomegrownTags: true });

    await user.click(screen.getByText('Homegrown totals'));
    expect(screen.getByTestId('homegrown-total-panel')).toBeInTheDocument();
    expect(screen.getByText('Homegrown rules')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Homegrown totals' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Homegrown rules' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('row', { name: 'Age 45 list' })
    ).toBeInTheDocument();
  });

  it('opens panel when button is clicked, and renders no data', async () => {
    const user = getUser();

    useLazyFetchOrganisationLabelCategoriesGroupsQuery.mockReturnValue([
      jest.fn().mockReturnValue({
        data: [],
        isError: false,
        isLoading: false,
        isFetching: false,
        isSuccess: true,
      }),
    ]);
    renderWithPermissions({ canViewHomegrownTags: true });

    await user.click(screen.getByText('Homegrown totals'));
    expect(screen.getByTestId('homegrown-total-panel')).toBeInTheDocument();
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('closes panel when panel onClose is triggered', async () => {
    const user = getUser();

    renderWithPermissions({ canViewHomegrownTags: true });

    await user.click(screen.getByText('Homegrown totals'));
    const closeButton = screen.getByText('Close');
    await user.click(closeButton);
    // wait for the panel to be removed from the DOM
    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('homegrown-total-panel')
    );
    expect(
      screen.queryByTestId('homegrown-total-panel')
    ).not.toBeInTheDocument();
  });

  it('opens panel when button is clicked, and filter post formation row', async () => {
    const user = getUser();
    const mockPostFormationData = {
      id: 8,
      name: 'Homegrown Post-formation',
      max_number: 20,
      created_by: {
        id: 160906,
        fullname: 'Service User',
      },
      label_categories: [
        {
          id: 16,
          name: 'Mock-formation',
          max_number: 20,
          labels_count: 0,
        },
        {
          id: 16,
          name: 'Post-formation',
          max_number: 20,
          labels_count: 0,
        },
      ],
    };

    useLazyFetchOrganisationLabelCategoriesGroupsQuery.mockReturnValue([
      jest.fn().mockReturnValue({
        data: mockPostFormationData,
        isError: false,
        isLoading: false,
        isFetching: false,
        isSuccess: true,
      }),
    ]);
    renderWithPermissions({ canViewHomegrownTags: true });

    await user.click(screen.getByText('Homegrown totals'));
    expect(screen.getByTestId('homegrown-total-panel')).toBeInTheDocument();
    expect(
      screen.getByRole('row', {
        name: 'Mock-formation 0 (max 20)',
      })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('row', {
        name: 'Post-formation 0 (max 20)',
      })
    ).not.toBeInTheDocument();
  });

  it('renders post formation row without error icon if max number is null', async () => {
    const user = getUser();
    const mockPostFormationData = {
      id: 8,
      name: 'Homegrown Post-formation',
      max_number: null,
      created_by: {
        id: 160906,
        fullname: 'Service User',
      },
      label_categories: [
        {
          id: 16,
          name: 'Post-formation',
          max_number: 20,
          labels_count: 20,
        },
      ],
    };

    useLazyFetchOrganisationLabelCategoriesGroupsQuery.mockReturnValue([
      jest.fn().mockReturnValue({
        data: mockPostFormationData,
        isError: false,
        isLoading: false,
        isFetching: false,
        isSuccess: true,
      }),
    ]);
    renderWithPermissions({ canViewHomegrownTags: true });

    await user.click(screen.getByText('Homegrown totals'));
    expect(screen.getByTestId('homegrown-total-panel')).toBeInTheDocument();

    expect(screen.queryByTestId('ErrorIcon')).not.toBeInTheDocument();
  });
});
