import { Provider } from 'react-redux';
import { render, fireEvent } from '@testing-library/react';
import NameFilter from '../../containers/NameFilter';

const buildStore = (state) => {
  const currentState = state;
  const dispatchedActions = [];
  return {
    getState: () => currentState,
    subscribe: () => () => {},
    dispatch: (action) => {
      dispatchedActions.push(action);
      return action;
    },
    dispatchedActions,
  };
};

const initialState = { athletes: { searchTerm: 'Dave' } };

describe('NameFilter', () => {
  it('renders', () => {
    const store = buildStore(initialState);
    const { container } = render(
      <Provider store={store}>
        <NameFilter />
      </Provider>
    );
    expect(container.querySelector('input')).toBeInTheDocument();
  });

  it('passes value, placeholder and tabIndex props to the input', () => {
    const store = buildStore(initialState);
    const { getByPlaceholderText } = render(
      <Provider store={store}>
        <NameFilter />
      </Provider>
    );
    const input = getByPlaceholderText('#sport_specific__Search_Athletes');
    expect(input).toHaveAttribute('tabindex', '1');
    expect(input).toHaveValue('Dave');
  });

  it('dispatches set filter on change', () => {
    const store = buildStore(initialState);
    const { getByPlaceholderText } = render(
      <Provider store={store}>
        <NameFilter />
      </Provider>
    );
    const input = getByPlaceholderText('#sport_specific__Search_Athletes');
    fireEvent.change(input, { target: { value: 'Jo' } });
    expect(
      store.dispatchedActions.some(
        (a) => a.type === 'SET_NAME_FILTER' && a.payload.value === 'Jo'
      )
    ).toBe(true);
  });

  it('dispatches clear filter on clear button click', () => {
    const store = buildStore(initialState);
    const { getByText } = render(
      <Provider store={store}>
        <NameFilter />
      </Provider>
    );
    fireEvent.click(getByText('Clear'));
    expect(
      store.dispatchedActions.some((a) => a.type === 'CLEAR_NAME_FILTER')
    ).toBe(true);
  });
});
