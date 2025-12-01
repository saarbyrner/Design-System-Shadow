import { screen } from '@testing-library/react';
import { renderWithStore } from '@kitman/modules/src/analysis/Dashboard/utils/testUitils';
import {
  REDUCER_KEY,
  initialState,
} from '@kitman/modules/src/analysis/Dashboard/redux/slices/chartBuilder';
import ResizeObserverPolyfill from 'resize-observer-polyfill';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import Value from '../Value';

describe('analysis dashboard | <Value />', () => {
  const props = {
    t: i18nextTranslateStub(),
    isEmpty: false,
    isLoading: false,
    value: null,
    unit: null,
    widgetId: 1,
  };

  const state = {
    [REDUCER_KEY]: {
      ...initialState,
      loaderLevelMap: {
        [props.widgetId]: 0,
      },
    },
  };

  const mockNumDenom = { numerator: 5, denominator: 10 };

  const { ResizeObserver } = window;

  beforeEach(() => {
    delete window.ResizeObserver;
    window.ResizeObserver = ResizeObserverPolyfill;
    window.HTMLElement.prototype.getBoundingClientRect = jest.fn(() => ({
      width: 1000,
      height: 600,
    }));
  });

  afterEach(() => {
    window.ResizeObserver = ResizeObserver;
    jest.resetAllMocks();
  });

  it('renders a value when supplied', () => {
    renderWithStore(<Value {...props} value={42} />, {}, state);

    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('renders a placeholder when value is null', () => {
    renderWithStore(<Value {...props} />, {}, state);

    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('renders a level one loading state by default when loading', () => {
    renderWithStore(
      <Value {...props} isLoading />,
      {},
      {
        [REDUCER_KEY]: {
          ...initialState,
          loaderLevelMap: {
            [props.widgetId]: 1,
          },
        },
      }
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(
      screen.queryByTestId('AnimatedCalculateLoader')
    ).not.toBeInTheDocument();
  });

  it('renders a level two loading state for longer loads', () => {
    renderWithStore(
      <Value {...props} isLoading />,
      {},
      {
        [REDUCER_KEY]: {
          ...initialState,
          loaderLevelMap: {
            [props.widgetId]: 2,
          },
        },
      }
    );

    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    expect(screen.getByTestId('AnimatedCalculateLoader')).toBeInTheDocument();
  });

  it('renders empty state when isEmpty is true', () => {
    renderWithStore(<Value {...props} isEmpty />, {}, state);

    expect(screen.getByText('Nothing to see yet')).toBeInTheDocument();
    expect(
      screen.getByText('A data type and time period is required')
    ).toBeInTheDocument();
  });

  it('renders a unit when supplied', () => {
    renderWithStore(<Value {...props} unit="mins" />, {}, state);

    expect(screen.getByText('mins')).toBeInTheDocument();
  });

  it('renders a proportion value', () => {
    renderWithStore(
      <Value {...props} value={mockNumDenom} calculation="proportion" />,
      {},
      state
    );

    expect(screen.getByText('5 / 10')).toBeInTheDocument();
  });

  it('renders a percentage value', () => {
    renderWithStore(
      <Value {...props} value={mockNumDenom} calculation="percentage" />,
      {},
      state
    );

    expect(screen.getByText('50%')).toBeInTheDocument();
  });
});
