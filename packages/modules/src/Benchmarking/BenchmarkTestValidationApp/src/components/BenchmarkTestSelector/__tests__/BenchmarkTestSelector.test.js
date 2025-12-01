import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import selectEvent from 'react-select-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { Provider } from 'react-redux';
import BenchmarkTestSelector from '..';

describe('<BenchmarkTestSelector />', () => {
  const storeFake = (state) => ({
    default: () => {},
    subscribe: () => {},
    dispatch: () => {},
    getState: () => ({ ...state }),
  });

  const mockStore = storeFake({
    benchmarkTestValidation: {
      selections: {
        club: { value: '', label: '' },
        season: { value: '', label: '' },
        window: { value: '', label: '' },
      },
    },
  });

  const defaultProps = {
    t: i18nextTranslateStub(),
    clubs: [{ label: 'Arsenal', value: 1 }],
    windows: [{ label: 'January', value: 2 }],
    seasons: [{ label: '2022/2023', value: 3 }],
    shouldDisable: true,
    fetchResults: jest.fn(),
  };

  it('should render correctly in default state', () => {
    render(
      <Provider store={mockStore}>
        <BenchmarkTestSelector {...defaultProps} />
      </Provider>
    );

    // 3 selects
    expect(screen.getAllByRole('textbox')).toHaveLength(3);
    expect(screen.getAllByRole('button')).toHaveLength(2);
    expect(screen.getByText('All fields required')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
  });

  it('should reset selections on click of Reset button', async () => {
    const { container } = render(
      <Provider store={mockStore}>
        <BenchmarkTestSelector {...defaultProps} />
      </Provider>
    );

    const selects = container.querySelectorAll('.kitmanReactSelect input');

    selectEvent.openMenu(selects[0]);
    expect(screen.getByText('Arsenal')).toBeInTheDocument();
    await selectEvent.select(selects[0], 'Arsenal');

    selectEvent.openMenu(selects[1]);
    expect(screen.getByText('2022/2023')).toBeInTheDocument();
    await selectEvent.select(selects[1], '2022/2023');

    selectEvent.openMenu(selects[2]);
    expect(screen.getByText('January')).toBeInTheDocument();
    await selectEvent.select(selects[2], 'January');

    fireEvent.click(screen.getByRole('button', { name: 'Reset' }));

    await waitFor(() => {
      expect(screen.queryByText('Arsenal')).not.toBeInTheDocument();
      expect(screen.queryByText('2022/2023')).not.toBeInTheDocument();
      expect(screen.queryByText('January')).not.toBeInTheDocument();
    });
  });

  it('should enable Next button if shouldDisable is false', async () => {
    render(
      <Provider store={mockStore}>
        <BenchmarkTestSelector {...defaultProps} shouldDisable={false} />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled();
    });
  });
});
