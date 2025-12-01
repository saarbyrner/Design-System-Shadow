import { screen } from '@testing-library/react';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import GuardiansTable from '@kitman/modules/src/AthleteProfile/src/components/AthleteGuardians/GuardiansTable';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

import { useFetchGuardiansQuery } from '@kitman/services/src/services/humanInput/humanInput';

jest.mock('@kitman/services/src/services/humanInput/humanInput', () => ({
  ...jest.requireActual('@kitman/services/src/services/humanInput/humanInput'),
  useFetchGuardiansQuery: jest.fn(),
}));

jest.mock(
  '@kitman/modules/src/AthleteProfile/src/components/AthleteGuardians/GuardiansTable/utils',
  () => ({
    formatCellDate: jest.fn((date) => date),
  })
);

describe('<GuardiansTable />', () => {
  let baseProps;

  beforeEach(() => {
    baseProps = {
      t: i18nextTranslateStub(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the guardians table headers', () => {
    useFetchGuardiansQuery.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    });
    renderWithRedux(<GuardiansTable {...baseProps} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Added')).toBeInTheDocument();
  });

  it('renders an empty message when no guardians are present', () => {
    useFetchGuardiansQuery.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    });
    renderWithRedux(<GuardiansTable {...baseProps} />);
    expect(screen.getByText('No guardians added')).toBeInTheDocument();
  });

  it('renders the guardians list when guardians are present', () => {
    const guardiansData = [
      { id: 1, name: 'Guardian One' },
      { id: 2, name: 'Guardian Two' },
    ];
    useFetchGuardiansQuery.mockReturnValue({
      data: guardiansData,
      isLoading: false,
      isError: false,
    });
    renderWithRedux(<GuardiansTable {...baseProps} />);
    expect(screen.getByText('Guardian One')).toBeInTheDocument();
    expect(screen.getByText('Guardian Two')).toBeInTheDocument();
  });

  it('Render name, email, and created_at columns', () => {
    const guardiansData = [
      {
        id: 1,
        name: 'Guardian One',
        email: 'guardian.one@gmail.com',
        created_at: '2023-01-01',
      },
    ];
    useFetchGuardiansQuery.mockReturnValue({
      data: guardiansData,
      isLoading: false,
      isError: false,
    });
    renderWithRedux(<GuardiansTable {...baseProps} />);
    expect(screen.getByText('Guardian One')).toBeInTheDocument();
    expect(screen.getByText('guardian.one@gmail.com')).toBeInTheDocument();
    expect(screen.getByText('2023-01-01')).toBeInTheDocument();
  });

  it('shows loading state when data is being fetched', () => {
    useFetchGuardiansQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });
    renderWithRedux(<GuardiansTable {...baseProps} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows error state when there is an error fetching data', () => {
    useFetchGuardiansQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    });

    renderWithRedux(<GuardiansTable {...baseProps} />);

    const alert = screen.getByRole('alert');

    expect(alert).toHaveTextContent(
      'Error connecting to the database. Please try again'
    );
  });

  it('renders action menu for each guardian', () => {
    const guardiansData = [
      { id: 1, name: 'Guardian One' },
      { id: 2, name: 'Guardian Two' },
    ];
    useFetchGuardiansQuery.mockReturnValue({
      data: guardiansData,
      isLoading: false,
      isError: false,
    });

    renderWithRedux(<GuardiansTable {...baseProps} />);

    const actionButtons = screen.getAllByRole('menuitem', { name: /more/i });

    expect(actionButtons).toHaveLength(2);
  });
});
