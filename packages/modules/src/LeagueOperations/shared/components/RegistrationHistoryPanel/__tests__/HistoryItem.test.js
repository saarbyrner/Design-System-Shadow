import { screen, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { getActiveSquad } from '@kitman/common/src/redux/global/selectors';
import { data as MOCK_ACTIVE_SQUAD } from '@kitman/services/src/mocks/handlers/getActiveSquad';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import i18n from '@kitman/common/src/utils/i18n';
import PermissionsContext from '@kitman/common/src/contexts/PermissionsContext';
import HistoryItem from '../components/HistoryItem';

jest.mock('@kitman/common/src/redux/global/selectors', () => ({
  ...jest.requireActual('@kitman/common/src/redux/global/selectors'),
  getActiveSquad: jest.fn(),
}));

const props = {
  entry: {
    id: 1,
    status: 'approved',
    registration_system_status: {
      id: 1,
      name: 'Approved',
      type: 'approved',
    },
    created_at: '2024-07-15T11:03:49Z',
    current_status: false,
    annotations: [],
  },
};

const annotation = {
  content: 'Grand bai',
  annotation_date: '2024-07-15T11:03:49Z',
};

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => state,
});

const defaultStore = storeFake({
  globalApi: {},
});

const canManageUnapprovePermissionProps = {
  permissions: { registration: { status: { canManageUnapprove: true } } },
  permissionsRequestStatus: 'SUCCESS',
};

const canNotManageUnapprovePermissionProps = {
  permissions: { registration: { status: { canManageUnapprove: false } } },
  permissionsRequestStatus: 'SUCCESS',
};

describe('<HistoryItem/>', () => {
  const i18nT = i18nextTranslateStub(i18n);
  beforeEach(() => {
    window.featureFlags['league-ops-update-registration-status'] = false;
    getActiveSquad.mockReturnValue(() => MOCK_ACTIVE_SQUAD);
  });

  it('does render', () => {
    render(
      <Provider store={storeFake(defaultStore)}>
        <PermissionsContext.Provider value={canManageUnapprovePermissionProps}>
          <HistoryItem {...props} t={i18nT} />{' '}
        </PermissionsContext.Provider>
      </Provider>
    );
    expect(screen.getByText('Approved')).toBeInTheDocument();
    expect(screen.getByText('Jul 15, 2024 - 11:03am')).toBeInTheDocument();
    expect(screen.getByText('MLS Next')).toBeInTheDocument();
  });
  it('renders the annotations', () => {
    render(
      <Provider store={storeFake(defaultStore)}>
        <PermissionsContext.Provider value={canManageUnapprovePermissionProps}>
          <HistoryItem
            entry={{ ...props.entry, annotations: [annotation] }}
            t={i18nT}
          />
        </PermissionsContext.Provider>
      </Provider>
    );

    expect(screen.getByText('Approved')).toBeInTheDocument();
    expect(screen.getByText('Grand bai')).toBeInTheDocument();
    expect(screen.getByText('Notes:')).toBeInTheDocument();
    expect(screen.queryByText('Reason:')).not.toBeInTheDocument();
  });

  it('should not render the annotations and reason when the status is unapproved and registration-manage-unapprove-status permission is not granted', () => {
    render(
      <Provider store={storeFake(defaultStore)}>
        <PermissionsContext.Provider
          value={canNotManageUnapprovePermissionProps}
        >
          <HistoryItem
            entry={{
              ...props.entry,
              status: 'unapproved',
              annotations: [annotation],
            }}
            t={i18nT}
          />
        </PermissionsContext.Provider>
      </Provider>
    );

    expect(screen.queryByText('Grand bai')).not.toBeInTheDocument();
    expect(screen.queryByText('Notes:')).not.toBeInTheDocument();
    expect(screen.queryByText('Reason:')).not.toBeInTheDocument();
  });

  it('should render the annotations and reason when the status is not unapproved and registration-manage-unapprove-status permission is not granted', () => {
    render(
      <Provider store={storeFake(defaultStore)}>
        <PermissionsContext.Provider
          value={canNotManageUnapprovePermissionProps}
        >
          <HistoryItem
            entry={{
              ...props.entry,
              registration_status_reason: {
                id: 1,
                name: 'Bad Behavior',
              },
              annotations: [annotation],
            }}
            t={i18nT}
          />
        </PermissionsContext.Provider>
      </Provider>
    );

    expect(screen.queryByText('Grand bai')).toBeInTheDocument();
    expect(screen.queryByText('Notes:')).toBeInTheDocument();
    expect(screen.queryByText('Reason:')).toBeInTheDocument();
  });

  it('should render the reason when it is present and registration.status.canEdit permission is granted', () => {
    render(
      <Provider store={storeFake(defaultStore)}>
        <PermissionsContext.Provider value={canManageUnapprovePermissionProps}>
          <HistoryItem
            entry={{
              ...props.entry,
              registration_status_reason: {
                id: 1,
                name: 'Bad Behavior',
              },
            }}
            t={i18nT}
          />
        </PermissionsContext.Provider>
      </Provider>
    );
    expect(screen.getByText('Reason:')).toBeInTheDocument();
    expect(screen.getByText('Bad Behavior')).toBeInTheDocument();
  });

  it('renders the registration system status when the feature flag is enabled', () => {
    window.featureFlags['league-ops-update-registration-status'] = true;
    render(
      <Provider store={storeFake(defaultStore)}>
        <PermissionsContext.Provider value={canManageUnapprovePermissionProps}>
          <HistoryItem
            {...props}
            entry={{
              ...props.entry,
              registration_system_status: {
                id: 1,
                name: 'Reapproved',
                type: 'approved',
              },
            }}
          />{' '}
        </PermissionsContext.Provider>
      </Provider>
    );
    expect(screen.getByText('Reapproved')).toBeInTheDocument();
    expect(screen.getByText('KLS')).toBeInTheDocument();
  });
});
