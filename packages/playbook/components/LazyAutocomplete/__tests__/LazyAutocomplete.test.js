import { VirtuosoMockContext } from 'react-virtuoso';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';

import { LazyAutocomplete } from '../index';

const ITEM_HEIGHT = 50;

// Proper mock for IntersectionObserver
let observerCallback = null;

beforeEach(() => {
  global.IntersectionObserver = jest.fn((cb) => {
    observerCallback = cb;
    return {
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    };
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

const mockData = [
  { id: 1, name: 'Option 1' },
  { id: 2, name: 'Option 2' },
];

const optionMapper = (item) => ({
  id: item.id,
  label: item.name,
});

const setup = (overrides = {}) => {
  const props = {
    load: jest.fn(),
    data: mockData,
    optionMapper,
    isLoading: false,
    loadingText: 'Loading...',
    label: 'Test Autocomplete',
    totalPages: 2,
    pageSize: 25,
    onChange: jest.fn(),
    ...overrides,
  };

  render(
    <VirtuosoMockContext.Provider
      value={{
        viewportHeight: mockData.length * ITEM_HEIGHT,
        itemHeight: ITEM_HEIGHT,
      }}
    >
      <LazyAutocomplete {...props} />
    </VirtuosoMockContext.Provider>
  );

  return props;
};

describe('<LazyAutocomplete />', () => {
  test('renders options and triggers load only once when last item is intersecting', async () => {
    const user = userEvent.setup();
    const { load } = setup();

    expect(load).toHaveBeenCalledTimes(1);
    expect(load).toHaveBeenCalledWith({
      page: 1,
      pageSize: 25,
      searchText: '',
    });

    const input = screen.getByLabelText('Test Autocomplete');
    await user.click(input);

    act(() => {
      observerCallback?.([
        {
          isIntersecting: true,
          target: screen.getByText('Option 2'),
        },
      ]);
    });

    expect(load).toHaveBeenNthCalledWith(2, {
      page: 2,
      pageSize: 25,
      searchText: '',
    });
  });

  test('does not load more if already on last page', async () => {
    const user = userEvent.setup();
    const { load } = setup({ totalPages: 1 });

    expect(load).toHaveBeenCalledTimes(1);

    const input = screen.getByLabelText('Test Autocomplete');
    await user.click(input);

    act(() => {
      observerCallback?.([
        {
          isIntersecting: true,
          target: screen.getByText('Option 2'),
        },
      ]);
    });

    expect(load).toHaveBeenCalledTimes(1);
  });
});
