import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ActiveUsersTranslated as ActiveUsers } from '../ActiveUsers';

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const mockUsers = [
  {
    id: 1,
    firstname: 'Denny',
    lastname: 'Claughton',
    username: 'dclaughton0',
  },
  {
    id: 2,
    firstname: 'Bridgette',
    lastname: 'Kield',
    username: 'bkield1',
  },
  {
    id: 3,
    firstname: 'Amargo',
    lastname: 'Solon',
    username: 'asolon2',
  },
  {
    id: 4,
    firstname: 'Johny',
    lastname: 'Hurne',
    username: 'jhurne3',
  },
  {
    id: 5,
    firstname: 'Cesare',
    lastname: 'Burde',
    username: 'cburde4',
  },
];

const store = storeFake({
  userReducer: {
    users: mockUsers,
    inactiveUsers: [],
    searchText: '',
  },
});

describe('Staff User: <ActiveUsers /> Component', () => {
  it('renders correctly', () => {
    render(
      <Provider store={store}>
        <ActiveUsers />
      </Provider>
    );

    const table = document.querySelector('table');

    const tableHeaders = table?.querySelectorAll('thead tr th');

    expect(tableHeaders[0]).toHaveTextContent('Staff name');
    expect(tableHeaders[1]).toHaveTextContent('Username');
    expect(tableHeaders[2]).toHaveTextContent('Role');
    expect(tableHeaders[3]).toHaveTextContent('Email');
    expect(tableHeaders[4]).toHaveTextContent('Creation Date');

    const tableRows = table?.querySelectorAll('tbody tr');

    tableRows.forEach((row, rowIndex) => {
      const columns = row.querySelectorAll('td');
      expect(columns[0]).toHaveTextContent(
        `${mockUsers[rowIndex].firstname} ${mockUsers[rowIndex].lastname}`
      );
    });
  });
});
