import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { render, screen, fireEvent } from '@testing-library/react';
import i18n from '@kitman/common/src/utils/i18n';
import {
  MOCK_PERMISSIONS,
  MOCK_NO_PERMISSIONS,
} from '@kitman/modules/src/LeagueOperations/__tests__/test_utils';
import {
  REDUCER_KEY as DISCIPLINE_SLICE,
  initialState,
} from '@kitman/modules/src/LeagueOperations/shared/redux/slices/disciplinaryIssueSlice';
import { REDUCER_KEY as LEAGUE_OPERATIONS_API } from '@kitman/modules/src/LeagueOperations/shared/redux/api/leagueOperations';

import DisciplineTabs from '../index';

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => state,
});

const defaultStore = storeFake({
  globalApi: {},
  [DISCIPLINE_SLICE]: initialState,
  [LEAGUE_OPERATIONS_API]: {},
  'LeagueOperations.registration.slice.grids': {
    bulkActions: {
      selectedAthleteIds: [],
      originalSelectedLabelIds: [],
      selectedLabelIds: [],
    },
  },
});

const renderWithProviders = ({ disciplinePermissions, currentUserType }) => {
  render(
    <Provider store={defaultStore}>
      <I18nextProvider i18n={i18n}>
        <DisciplineTabs
          disciplinePermissions={disciplinePermissions}
          currentUserType={currentUserType}
        />
      </I18nextProvider>
    </Provider>
  );
};

describe('<DisciplineTabs />', () => {
  describe('User has all permissions', () => {
    const disciplinePermissions = MOCK_PERMISSIONS.discipline;
    const currentUserType = 'association_admin';
    it('renders correctly with all tabs', () => {
      renderWithProviders({ disciplinePermissions, currentUserType });
      expect(screen.getAllByRole('tab')).toHaveLength(2);
    });
    it('switches tabs correctly', () => {
      renderWithProviders({ disciplinePermissions, currentUserType });

      // Initial state - 'players' tab should be selected
      expect(screen.getByText('Players')).toHaveAttribute(
        'aria-selected',
        'true'
      );
      expect(screen.getByText('Staff')).toHaveAttribute(
        'aria-selected',
        'false'
      );

      // Clicking the 'staff' tab
      fireEvent.click(screen.getByText('Staff'));
      expect(screen.getByText('Players')).toHaveAttribute(
        'aria-selected',
        'false'
      );
      expect(screen.getByText('Staff')).toHaveAttribute(
        'aria-selected',
        'true'
      );

      // Clicking the 'players' tab
      fireEvent.click(screen.getByText('Players'));
      expect(screen.getByText('Players')).toHaveAttribute(
        'aria-selected',
        'true'
      );
      expect(screen.getByText('Staff')).toHaveAttribute(
        'aria-selected',
        'false'
      );
    });
  });

  describe('User has no permissions', () => {
    const disciplinePermissions = MOCK_NO_PERMISSIONS.discipline;
    const currentUserType = 'association_admin';
    it('does not render tabs', () => {
      renderWithProviders({ disciplinePermissions, currentUserType });
      expect(screen.queryByRole('tab')).not.toBeInTheDocument();
    });
  });

  describe('User can only view "players" tab', () => {
    const disciplinePermissions = {
      ...MOCK_PERMISSIONS.discipline,
      canViewDisciplineStaff: false,
    };
    const currentUserType = 'association_admin';
    it('does only renders the "players" tab', () => {
      renderWithProviders({ disciplinePermissions, currentUserType });
      expect(screen.getByRole('tab')).toBeInTheDocument();
      expect(screen.getByText('Players')).toBeInTheDocument();
      expect(screen.queryByText('Staff')).not.toBeInTheDocument();
    });
  });

  describe('User can only view "staff" tab', () => {
    const disciplinePermissions = {
      ...MOCK_PERMISSIONS.discipline,
      canViewDisciplineAthlete: false,
    };
    const currentUserType = 'association_admin';
    it('does only renders the "staff" tab', () => {
      renderWithProviders({ disciplinePermissions, currentUserType });
      expect(screen.getByRole('tab')).toBeInTheDocument();
      expect(screen.getByText('Staff')).toBeInTheDocument();
      expect(screen.queryByText('Players')).not.toBeInTheDocument();
    });
  });
});
