import * as reduxHooks from 'react-redux';
import { Provider } from 'react-redux';
import { render, screen, fireEvent } from '@testing-library/react';
import i18n from '@kitman/common/src/utils/i18n';
import { I18nextProvider } from 'react-i18next';
import {
  getSelectedRow,
  getApprovalState,
} from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationGridSelectors';
import AssociationTabs from '../index';

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const defaultStore = storeFake({
  globalApi: {
    useGetOrganisationQuery: jest.fn(),
    useGetPermissionsQuery: jest.fn(),
    useGetPreferencesQuery: jest.fn(),
    useGetCurrentUserQuery: jest.fn(),
    useGetActiveSquadQuery: jest.fn(),
  },
});

const renderWithProviders = ({ registrationPermissions, currentUserType }) => {
  render(
    <Provider store={defaultStore}>
      <I18nextProvider i18n={i18n}>
        <AssociationTabs
          registrationPermissions={registrationPermissions}
          currentUserType={currentUserType}
        />
      </I18nextProvider>
    </Provider>
  );
};

describe('AssociationTabs Component', () => {
  beforeEach(() => {
    jest.spyOn(reduxHooks, 'useSelector').mockImplementation((selector) => {
      if (selector === getSelectedRow) {
        return { id: null };
      }
      if (selector === getApprovalState) {
        return { status: undefined, reasonId: undefined, annotation: '' };
      }
      return null;
    });
  });

  it('renders correctly with all tabs', () => {
    const registrationPermissions = {
      organisation: { canView: true },
      athlete: { canView: true },
      staff: { canView: true },
    };
    const currentUserType = 'association_admin';

    renderWithProviders({ registrationPermissions, currentUserType });
    expect(screen.getAllByRole('tab')).toHaveLength(3);
  });

  it('renders only permitted tabs', () => {
    const registrationPermissions = {
      organisation: { canView: false },
      athlete: { canView: true },
      staff: { canView: false },
    };
    const currentUserType = 'athlete';
    renderWithProviders({ registrationPermissions, currentUserType });
    // eslint-disable-next-line jest-dom/prefer-in-document
    expect(screen.getAllByRole('tab')).toHaveLength(1);
  });

  it('switches tabs correctly', () => {
    const registrationPermissions = {
      organisation: { canView: true },
      athlete: { canView: true },
      staff: { canView: true },
    };
    const currentUserType = 'association_admin';

    renderWithProviders({ registrationPermissions, currentUserType });

    fireEvent.click(screen.getAllByRole('tab')[0]);
    expect(screen.getByRole('tabpanel', { name: 'Clubs' })).toBeInTheDocument();
    fireEvent.click(screen.getAllByRole('tab')[1]);
    expect(
      screen.queryByRole('tabpanel', { name: 'Clubs' })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('tabpanel', { name: 'Players' })
    ).toBeInTheDocument();
  });
});
