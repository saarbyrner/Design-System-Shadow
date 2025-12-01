import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';

import { REDUCER_KEY as LOPS_REDUCER_KEY } from '@kitman/modules/src/LeagueOperations/shared/redux/api/leagueOperations';
import { useGetAllLabelsQuery } from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGlobalApi';
import GridLabelSelect from '../index';

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGlobalApi',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGlobalApi'
    ),
    useGetAllLabelsQuery: jest.fn(),
  })
);
jest.mock('@kitman/common/src/contexts/PermissionsContext');

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => state,
});

const defaultStore = storeFake({
  [LOPS_REDUCER_KEY]: {},
});

const renderWithProviders = (storeArg, children) => {
  render(<Provider store={storeArg}>{children}</Provider>);
};

const mockLabels = [
  { id: 1, name: 'Label 1' },
  { id: 2, name: 'Label 2' },
];

const mockQueries = (args) => {
  useGetAllLabelsQuery.mockReturnValue({
    data: mockLabels,
    ...args,
  });
};

const props = {
  value: '',
  onUpdate: jest.fn(),
};

describe('<GridLabelSelect/>', () => {
  beforeEach(() => {
    usePermissions.mockReturnValue({
      permissions: { homegrown: { canViewHomegrown: true } },
    });
    jest.clearAllMocks();
  });

  it('does not render', async () => {
    usePermissions.mockReturnValue({
      permissions: { homegrown: { canViewHomegrown: false } },
    });
    mockQueries();
    renderWithProviders(
      storeFake(defaultStore),
      <GridLabelSelect {...props} />
    );
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });

  it('renders', async () => {
    mockQueries();
    renderWithProviders(
      storeFake(defaultStore),
      <GridLabelSelect {...props} />
    );
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  test.each(['isError', 'isFetching', 'isLoading'])(
    'is disabled when %s',
    (status) => {
      mockQueries({
        [status]: true,
      });

      renderWithProviders(
        storeFake(defaultStore),
        <GridLabelSelect {...props} />
      );
      expect(screen.getByRole('combobox')).toBeDisabled();
    }
  );
});

describe('GridLabelSelect', () => {
  const labels = [{ id: 1, name: 'Label One' }];

  beforeEach(() => {
    usePermissions.mockReturnValue({
      permissions: { homegrown: { canViewHomegrown: true } },
    });
    useGetAllLabelsQuery.mockReturnValue({
      data: labels,
      isSuccess: true,
      isLoading: false,
      isError: false,
      isFetching: false,
    });
  });

  it('calls onUpdate with correct value when a label is selected', async () => {
    const user = userEvent.setup();
    const onUpdate = jest.fn();
    render(<GridLabelSelect value={null} onUpdate={onUpdate} />);

    await user.click(screen.getByRole('button', { name: 'Open' }));

    expect(
      screen.getByRole('option', { name: 'Label One' })
    ).toBeInTheDocument();

    await user.click(screen.getByRole('option', { name: 'Label One' }));

    expect(onUpdate).toHaveBeenCalledWith([1]);
  });
});
