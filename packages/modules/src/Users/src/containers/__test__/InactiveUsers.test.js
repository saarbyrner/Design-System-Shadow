import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { InactiveUsersTranslated as InactiveUsers } from '../InactiveUsers';

jest.mock('@kitman/common/src/contexts/PermissionsContext', () => ({
  ...jest.requireActual('@kitman/common/src/contexts/PermissionsContext'),
  usePermissions: jest.fn(),
}));

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const mockInactiveUsers = [
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
    inactiveUsers: mockInactiveUsers,
    users: [],
    searchText: '',
  },
});

describe('Staff User: <InactiveUsers /> Component', () => {
  beforeEach(() => {
    usePermissions.mockReturnValue({
      permissions: {
        medical: { privateNotes: { canAdmin: false } },
      },
      permissionsRequestStatus: 'SUCCESS',
    });
  });

  it('renders correctly', () => {
    render(
      <Provider store={store}>
        <InactiveUsers />
      </Provider>
    );

    const table = document.querySelector('table');

    const tableHeaders = table?.querySelectorAll('thead tr th');

    expect(tableHeaders[0]).toHaveTextContent('Staff name');
    expect(tableHeaders[1]).toHaveTextContent('Username');
    expect(tableHeaders[2]).toHaveTextContent('Email');
    expect(tableHeaders[3]).toHaveTextContent('Creation Date');
    expect(tableHeaders[4]).toHaveTextContent('Deactivation Date');

    const tableRows = table?.querySelectorAll('tbody tr');

    tableRows.forEach((row, rowIndex) => {
      const columns = row.querySelectorAll('td');
      expect(columns[0]).toHaveTextContent(
        `${mockInactiveUsers[rowIndex].firstname} ${mockInactiveUsers[rowIndex].lastname}`
      );
    });
  });

  describe('[feature-flag] confidential-notes is on', () => {
    beforeEach(() => {
      usePermissions.mockReturnValue({
        permissions: {
          medical: { privateNotes: { canAdmin: true } },
        },
        permissionsRequestStatus: 'SUCCESS',
      });
      window.featureFlags['confidential-notes'] = true;
    });
    afterEach(() => {
      usePermissions.mockReturnValue({
        permissions: {
          medical: { privateNotes: { canAdmin: false } },
        },
        permissionsRequestStatus: 'SUCCESS',
      });
      window.featureFlags['confidential-notes'] = false;
    });

    it('renders', () => {
      render(
        <Provider store={store}>
          <InactiveUsers />
        </Provider>
      );

      const table = document.querySelector('table');

      const tableHeaders = table?.querySelectorAll('thead tr th');

      expect(tableHeaders[5]).toHaveTextContent('Visibility Issues');
    });
  });
});
