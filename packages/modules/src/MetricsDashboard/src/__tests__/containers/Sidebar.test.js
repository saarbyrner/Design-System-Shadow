import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import Sidebar from '../../containers/Sidebar';

jest.mock('react-i18next', () => ({
  withNamespaces: () => (Comp) => (props) => <Comp t={(k) => k} {...props} />,
}));

jest.mock('../../containers/AthleteInfo', () => ({
  __esModule: true,
  default: ({ athlete }) => (
    <span data-testid="athlete-item">{athlete.fullname || athlete.id}</span>
  ),
}));

const buildStore = (state) => ({
  getState: () => state,
  subscribe: () => () => {},
  dispatch: () => {},
});

const makeState = () => ({
  athletes: {
    currentlyVisible: {
      screened: [
        { id: 1, fullname: 'A1' },
        { id: 2, fullname: 'A2' },
      ],
      not_screened: [{ id: 3, fullname: 'A3' }],
    },
    groupOrderingByType: { last_screening: ['screened', 'not_screened'] },
    groupBy: 'last_screening',
  },
  groupingLabels: {
    unavailable: 'Unavailable',
    available: 'Available',
    injured: 'Available (Injured)',
    returning: 'Available (Returning from injury)',
    screened: 'Screened Today',
    not_screened: 'Not Screened Today',
  },
});

describe('DashboardSidebar container', () => {
  it('renders', () => {
    const store = buildStore(makeState());
    const { container } = render(
      <Provider store={store}>
        <Sidebar />
      </Provider>
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('maps state currentlyVisible to groupedAthletes prop (renders athlete groups)', () => {
    const state = makeState();
    const store = buildStore(state);
    const { container } = render(
      <Provider store={store}>
        <Sidebar />
      </Provider>
    );
    const renderedAthletes = container.querySelectorAll(
      '[data-testid="athlete-item"]'
    );
    const total = Object.values(state.athletes.currentlyVisible).reduce(
      (acc, arr) => acc + arr.length,
      0
    );
    expect(renderedAthletes.length).toBe(total);
  });
});
