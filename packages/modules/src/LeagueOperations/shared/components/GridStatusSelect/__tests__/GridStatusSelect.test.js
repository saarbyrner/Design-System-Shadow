import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import mockOptions from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/mock_registration_statuses';
import { REDUCER_KEY as LOPS_REDUCER_KEY } from '@kitman/modules/src/LeagueOperations/shared/redux/api/leagueOperations';
import { useFetchRegistrationStatusOptionsQuery } from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGlobalApi';
import useRegistrationStatus from '@kitman/modules/src/LeagueOperations/shared/hooks/useRegistrationStatus';
import GridStatusSelect from '../index';

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGlobalApi',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGlobalApi'
    ),
    useFetchRegistrationStatusOptionsQuery: jest.fn(),
  })
);
jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/hooks/useRegistrationStatus'
);

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

const mockQueries = (args) => {
  useFetchRegistrationStatusOptionsQuery.mockReturnValue({
    data: mockOptions,
    ...args,
  });
};

const props = {
  value: '',
  onUpdate: jest.fn(),
  t: i18nextTranslateStub(),
};

describe('<GridStatusSelect/>', () => {
  const mockRegistrationStatuses = { value: 'pending', label: 'Pending' };

  beforeEach(() => {
    useRegistrationStatus.mockReturnValue({
      registrationFilterStatuses: [mockRegistrationStatuses],
      isSuccessRegistrationFilterStatuses: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders', async () => {
    mockQueries();
    renderWithProviders(
      storeFake(defaultStore),
      <GridStatusSelect {...props} />
    );
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('correctly calls the onUpdate', async () => {
    mockQueries();
    renderWithProviders(
      storeFake(defaultStore),
      <GridStatusSelect {...props} />
    );
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    await userEvent.click(screen.getByRole('option', { name: 'Incomplete' }));
    expect(props.onUpdate).toHaveBeenCalledWith({
      label: 'Incomplete',
      value: 'incomplete',
    });
  });

  test.each(['isError', 'isFetching', 'isLoading'])(
    'is disabled when %s',
    (status) => {
      mockQueries({
        [status]: true,
      });

      renderWithProviders(
        storeFake(defaultStore),
        <GridStatusSelect {...props} />
      );
      expect(screen.getByRole('combobox')).toBeDisabled();
    }
  );

  it('correctly calls the onUpdate, when useRegistrationStatus has data', async () => {
    useRegistrationStatus.mockReturnValue({
      registrationFilterStatuses: [mockRegistrationStatuses],
      isSuccessRegistrationFilterStatuses: true,
    });

    mockQueries();
    renderWithProviders(
      storeFake(defaultStore),
      <GridStatusSelect {...props} />
    );
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    await userEvent.click(screen.getByRole('option', { name: 'Pending' }));
    expect(props.onUpdate).toHaveBeenCalledWith(mockRegistrationStatuses);
  });

  test.each([
    'isLoadingRegistrationFilterStatusesData',
    'isErrorRegistrationFilterStatusesData',
  ])('is disabled when %s', (status) => {
    window.featureFlags['league-ops-update-registration-status'] = true;
    useRegistrationStatus.mockReturnValue({
      isLoadingRegistrationFilterStatusesData: true,
      isErrorRegistrationFilterStatusesData: true,
    });
    mockQueries({
      [status]: true,
    });

    renderWithProviders(
      storeFake(defaultStore),
      <GridStatusSelect {...props} />
    );
    expect(screen.getByRole('combobox')).toBeDisabled();
  });
});
