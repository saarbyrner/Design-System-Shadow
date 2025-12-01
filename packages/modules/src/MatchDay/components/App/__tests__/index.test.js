import { screen } from '@testing-library/react';
import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';
import { getStoreForTest } from '@kitman/modules/src/MatchDay/shared/utils';
import { useSearchKitMatricesQuery } from '@kitman/modules/src/KitMatrix/src/redux/rtk/searchKitMatricesApi';
import mockKitMatrices from '@kitman/services/src/services/kitMatrix/searchKitMatrices/mock';
import moment from 'moment-timezone';
import mock from '@kitman/modules/src/MatchDay/shared/mock';
import * as officialsApi from '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/officialsApi';
import App from '..';

jest.mock('@kitman/modules/src/KitMatrix/src/redux/rtk/searchKitMatricesApi');

describe('App', () => {
  const renderComponent = () => {
    return renderWithProviders(<App />, {
      store: getStoreForTest({
        customEvent: { dmn_notification_status: true },
      }),
    });
  };

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-09-10'));
  });

  beforeEach(() => {
    moment.tz.setDefault('Europe/Dublin');
    useSearchKitMatricesQuery.mockReturnValue({
      data: { kit_matrices: mockKitMatrices.kit_matrices },
      isFetching: false,
    });

    jest.spyOn(officialsApi, 'useGetGameOfficialsQuery').mockReturnValue({
      data: mock.gameOfficials,
      isFetching: false,
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    moment.tz.setDefault();
  });

  it('renders correctly', () => {
    renderComponent();

    // Match information
    expect(screen.getByText('Match #:')).toBeInTheDocument();
    expect(screen.getAllByText('--')[0]).toBeInTheDocument();

    expect(screen.getByText('Match Time:')).toBeInTheDocument();
    expect(screen.getByText('12:30 AM GMT')).toBeInTheDocument();

    expect(screen.getByText('Kick Time:')).toBeInTheDocument();
    expect(screen.getByText('12:00 AM GMT')).toBeInTheDocument();

    expect(screen.getByText('Date:')).toBeInTheDocument();
    expect(screen.getByText('09/10/2024')).toBeInTheDocument();

    expect(screen.getByText('Venue:')).toBeInTheDocument();
    expect(screen.getByText('Camp Nou')).toBeInTheDocument();

    expect(screen.getByText('TV:')).toBeInTheDocument();
    expect(screen.getAllByText('--')[1]).toBeInTheDocument();

    // Match officials
    expect(screen.getByText('Referee:')).toBeInTheDocument();
    expect(screen.getByText('Mark Evans')).toBeInTheDocument();

    expect(screen.getByText('AR1:')).toBeInTheDocument();
    expect(screen.getByText('Sophia Clarke')).toBeInTheDocument();

    expect(screen.getByText('AR2:')).toBeInTheDocument();
    expect(screen.getByText('David Brooks')).toBeInTheDocument();

    expect(screen.getByText('4th Official:')).toBeInTheDocument();
    expect(screen.getByText('Emily Harper')).toBeInTheDocument();

    expect(screen.getByText('VAR:')).toBeInTheDocument();
    expect(screen.getByText('Liam Turner')).toBeInTheDocument();

    expect(screen.getByText('AVAR:')).toBeInTheDocument();
    expect(screen.getByText('Olivia Wright')).toBeInTheDocument();

    // Kit selection
    expect(screen.getAllByText('KL Galaxy')).toHaveLength(2);
    expect(screen.getAllByText('KL Toronto')).toHaveLength(2);
    expect(screen.getByText('Officials')).toBeInTheDocument();
    expect(screen.getAllByText('No kit selected')).toHaveLength(5);
  });
});
