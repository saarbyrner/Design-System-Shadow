import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import NoSearchResults from '../../containers/NoSearchResults';

jest.mock('@kitman/common/src/utils/i18n', () => ({ t: (k) => k }));

const buildStore = (state) => ({
  getState: () => state,
  subscribe: () => () => {},
  dispatch: () => {},
});

const baseState = {
  athletes: {
    currentlyVisible: [],
  },
};

describe('NoSearchResults', () => {
  it('renders', () => {
    render(
      <Provider store={buildStore(baseState)}>
        <NoSearchResults />
      </Provider>
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('is not visible when there are visible athletes', () => {
    render(
      <Provider store={buildStore(baseState)}>
        <NoSearchResults />
      </Provider>
    );
    const alert = screen.getByRole('alert');
    expect(alert.className.includes('noResultsMessage--isVisible')).toBe(false);
  });

  it('is visible when there are no visible athletes', () => {
    const state = { athletes: { currentlyVisible: null } };
    render(
      <Provider store={buildStore(state)}>
        <NoSearchResults />
      </Provider>
    );
    const alert = screen.getByRole('alert');
    expect(alert.className.includes('noResultsMessage--isVisible')).toBe(true);
    expect(screen.getByText('No results found.')).toBeInTheDocument();
  });
});
