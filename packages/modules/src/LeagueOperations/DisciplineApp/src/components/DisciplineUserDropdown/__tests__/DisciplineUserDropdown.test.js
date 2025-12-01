import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { VirtuosoMockContext } from 'react-virtuoso';
import { Provider } from 'react-redux';
import { data as mockedDisciplineAthletes } from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/discipline_athletes.mock';
import { data as mockedDisciplineStaff } from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/discipline_staff.mock';
import { onSetUserToBeDisciplined } from '@kitman/modules/src/LeagueOperations/shared/redux/slices/disciplinaryIssueSlice';
import {
  useLazySearchDisciplineDropdownAthleteListQuery,
  useLazySearchDisciplineDropdownUserListQuery,
} from '@kitman/modules/src/LeagueOperations/shared/redux/api/disciplineApi';

import DisciplineUserDropdown from '..';

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/api/disciplineApi'
);

const props = {
  label: 'Test Discipline User',
  selectedUser: [],
  onChange: () => {},
};

const mockDispatch = jest.fn();

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: mockDispatch,
  getState: () => ({ ...state }),
});

const defaultStore = storeFake({});

describe('<DisciplineUserDropdown />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('User type is athlete', () => {
    const triggerUserQuery = jest.fn();
    const triggerAthleteQuery = jest.fn();

    beforeEach(() => {
      useLazySearchDisciplineDropdownUserListQuery.mockReturnValue([
        triggerUserQuery,
        {
          data: { data: mockedDisciplineStaff, meta: { total_pages: 0 } },
          isFetching: false,
        },
      ]);
      useLazySearchDisciplineDropdownAthleteListQuery.mockReturnValue([
        triggerAthleteQuery,
        {
          data: { data: mockedDisciplineAthletes, meta: { total_pages: 0 } },
          isFetching: false,
        },
      ]);

      const athleteProps = {
        ...props,
        userType: 'athlete',
      };
      render(
        <Provider store={defaultStore}>
          <VirtuosoMockContext.Provider
            value={{ viewportHeight: 2000, itemHeight: 50 }}
          >
            <DisciplineUserDropdown {...athleteProps} />
          </VirtuosoMockContext.Provider>
        </Provider>
      );
    });
    it('Fetches and displays athletes', async () => {
      const dropdown = screen.getByLabelText('Test Discipline User');
      await waitFor(() => expect(triggerAthleteQuery).toHaveBeenCalled());
      expect(triggerUserQuery).not.toHaveBeenCalled();
      fireEvent.mouseDown(dropdown);
      expect(await screen.findByText('Roy Keane')).toBeInTheDocument();
    });
    it('userToBeDisciplined is set when an athlete is selected', async () => {
      fireEvent.mouseDown(screen.getByLabelText('Test Discipline User'));
      fireEvent.click(await screen.findByText('Roy Keane'));
      expect(mockDispatch).toHaveBeenCalledWith(
        onSetUserToBeDisciplined({
          userToBeDisciplined: {
            user_id: 16,
            name: 'Roy Keane',
            squads: [],
            organisations: [],
          },
        })
      );
    });
  });
  describe('User type is staff', () => {
    const triggerUserQuery = jest.fn();
    const triggerAthleteQuery = jest.fn();

    beforeEach(() => {
      useLazySearchDisciplineDropdownUserListQuery.mockReturnValue([
        triggerUserQuery,
        {
          data: { data: mockedDisciplineStaff, meta: { total_pages: 0 } },
          isFetching: false,
        },
      ]);
      useLazySearchDisciplineDropdownAthleteListQuery.mockReturnValue([
        triggerAthleteQuery,
        {
          data: { data: mockedDisciplineAthletes, meta: { total_pages: 0 } },
          isFetching: false,
        },
      ]);

      const staffProps = {
        ...props,
        userType: 'staff',
      };
      render(
        <Provider store={defaultStore}>
          <VirtuosoMockContext.Provider
            value={{ viewportHeight: 2000, itemHeight: 50 }}
          >
            <DisciplineUserDropdown {...staffProps} />
          </VirtuosoMockContext.Provider>
        </Provider>
      );
    });
    it('Fetches and displays staff', async () => {
      const dropdown = screen.getByLabelText('Test Discipline User');
      await waitFor(() => expect(triggerUserQuery).toHaveBeenCalled());
      expect(triggerAthleteQuery).not.toHaveBeenCalled();
      fireEvent.mouseDown(dropdown);
      expect(await screen.findByText('Alex Ferguson')).toBeInTheDocument();
    });
    it('userToBeDisciplined is set when a staff member is selected', async () => {
      fireEvent.mouseDown(screen.getByLabelText('Test Discipline User'));
      fireEvent.click(await screen.findByText('Alex Ferguson'));
      expect(mockDispatch).toHaveBeenCalledWith(
        onSetUserToBeDisciplined({
          userToBeDisciplined: {
            user_id: 1,
            name: 'Alex Ferguson',
            squads: [],
            organisations: [],
          },
        })
      );
    });
  });
});
