import * as redux from 'react-redux';
import { Provider } from 'react-redux';
import { render, screen, fireEvent } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import Filters from '../Filters';

const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
const mockDispatchFn = jest.fn();
useDispatchSpy.mockReturnValue(mockDispatchFn);

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const store = storeFake({
  userReducer: {
    searchText: '',
  },
});

const mockProps = {
  t: i18nextTranslateStub(),
};

describe('Staff User: <Filters /> Component', () => {
  it('renders search input and calls setSearchText when updated', () => {
    render(
      <Provider store={store}>
        <Filters {...mockProps} />
      </Provider>
    );

    const searchInput = screen.getByPlaceholderText('Search');

    expect(searchInput).toBeInTheDocument();

    const newValue = 'NEW_TEST';

    fireEvent.change(searchInput, { target: { value: newValue } });

    expect(mockDispatchFn).toHaveBeenCalledTimes(1);
    expect(mockDispatchFn).toHaveBeenCalledWith({
      payload: 'NEW_TEST',
      type: 'SET_SEARCH',
    });
  });
});
