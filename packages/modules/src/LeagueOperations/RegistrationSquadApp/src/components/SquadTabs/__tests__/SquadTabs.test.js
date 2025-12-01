import * as reduxHooks from 'react-redux';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import { render, screen, fireEvent } from '@testing-library/react';
import useGridActions from '@kitman/modules/src/LeagueOperations/shared/hooks/useGridActions';

import SquadTabs from '../index';

jest.mock('@kitman/modules/src/LeagueOperations/shared/hooks/useGridActions');

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

const renderWithProviders = ({
  registrationPermissions,
  squadId,
  currentUserType,
}) => {
  useGridActions.mockReturnValue({});
  render(
    <Provider store={defaultStore}>
      <I18nextProvider i18n={i18n}>
        <SquadTabs
          registrationPermissions={registrationPermissions}
          squadId={squadId}
          currentUserType={currentUserType}
        />
      </I18nextProvider>
    </Provider>
  );
};

describe('SquadTabs Component', () => {
  beforeEach(() => {
    jest.spyOn(reduxHooks, 'useSelector').mockImplementation(jest.fn());
  });

  it('renders correctly with all tabs', () => {
    const registrationPermissions = {
      organisation: { canView: true },
      athlete: { canView: true },
      staff: { canView: true },
    };
    const squadId = 123;
    const currentUserType = 'association_admin';

    renderWithProviders({ registrationPermissions, squadId, currentUserType });
    expect(screen.getAllByRole('tab')).toHaveLength(3);
  });

  it('renders only permitted tabs', () => {
    const registrationPermissions = {
      organisation: { canView: false },
      athlete: { canView: true },
      staff: { canView: false },
    };
    const squadId = 456;
    const currentUserType = 'athlete';
    renderWithProviders({ registrationPermissions, squadId, currentUserType });
    // eslint-disable-next-line jest-dom/prefer-in-document
    expect(screen.getAllByRole('tab')).toHaveLength(1);
  });

  it('switches tabs correctly', () => {
    const registrationPermissions = {
      organisation: { canView: true },
      athlete: { canView: true },
      staff: { canView: true },
    };
    const squadId = 789;
    const currentUserType = 'association_admin';

    renderWithProviders({ registrationPermissions, squadId, currentUserType });

    fireEvent.click(screen.getAllByRole('tab')[0]);

    expect(screen.getByText('Team details')).toBeInTheDocument();
    fireEvent.click(screen.getAllByRole('tab')[1]);
    expect(screen.queryByText('Team details')).not.toBeInTheDocument();
  });
});
