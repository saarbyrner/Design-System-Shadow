import { render, screen } from '@testing-library/react';
import * as reduxHooks from 'react-redux';
import * as commonHooks from '@kitman/common/src/hooks';
import * as PermissionsContext from '@kitman/common/src/contexts/PermissionsContext';
import useLocationSearch from '@kitman/common/src/hooks/useLocationSearch';
import {
  MOCK_REGISTRATION_ORGANISATION,
  MOCK_CURRENT_USER,
} from '@kitman/modules/src/LeagueOperations/__tests__/test_utils';
import { data as MOCK_ORG } from '@kitman/services/src/mocks/handlers/getOrganisation';
import { data as MOCK_ACTIVE_SQUAD } from '@kitman/services/src/mocks/handlers/getActiveSquad';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { MODES } from '@kitman/modules/src/HumanInput/shared/constants';
import {
  useGetOrganisationQuery,
  useGetActiveSquadQuery,
  useGetCurrentUserQuery,
} from '@kitman/common/src/redux/global/services/globalApi';
import {
  getOrganisation,
  getActiveSquad,
} from '@kitman/common/src/redux/global/selectors';
import OrganisationHeader from '..';

jest.mock('@kitman/common/src/hooks/useLocationSearch');
jest.mock('@kitman/common/src/hooks', () => ({
  ...jest.requireActual('@kitman/common/src/hooks'),
  useLocationHash: jest.fn(),
}));
jest.mock('@kitman/common/src/contexts/PermissionsContext');

jest.mock('@kitman/common/src/redux/global/services/globalApi', () => ({
  ...jest.requireActual('@kitman/common/src/redux/global/services/globalApi'),
  useGetOrganisationQuery: jest.fn(),
  useGetCurrentUserQuery: jest.fn(),
  useGetActiveSquadQuery: jest.fn(),
}));
jest.mock('@kitman/common/src/redux/global/selectors', () => ({
  ...jest.requireActual('@kitman/common/src/redux/global/selectors'),
  getOrganisation: jest.fn(),
  getActiveSquad: jest.fn(),
}));
const basePermissions = {
  permissions: {
    registration: {
      payment: {
        canExportPayment: false,
      },
    },
    homegrown: {
      canViewHomegrownTags: true,
      canManageHomegrown: true,
    },
  },
};

const defaultProps = {
  isLoading: false,
  organisation: MOCK_REGISTRATION_ORGANISATION,
  t: i18nextTranslateStub(),
};

const renderComponent = () => render(<OrganisationHeader {...defaultProps} />);

describe('<OrganisationHeader />', () => {
  beforeEach(() => {
    useGetOrganisationQuery.mockReturnValue({
      data: MOCK_ORG,
      isLoading: false,
    });
    useGetActiveSquadQuery.mockReturnValue({
      data: MOCK_ACTIVE_SQUAD,
      isLoading: false,
    });
    useGetCurrentUserQuery.mockReturnValue({ MOCK_CURRENT_USER });

    getOrganisation.mockReturnValue(() => MOCK_ORG);
    getActiveSquad.mockReturnValue(() => MOCK_ACTIVE_SQUAD);

    jest.spyOn(reduxHooks, 'useDispatch').mockReturnValue(jest.fn());
    jest.spyOn(reduxHooks, 'useSelector').mockReturnValue(MODES.VIEW);

    PermissionsContext.usePermissions.mockReturnValue(basePermissions);
    useLocationSearch.mockReturnValue(new URLSearchParams({ id: '115' }));

    Object.defineProperty(window, 'location', {
      value: new URL('http://localhost/registration/organisations?id=115'),
      writable: true,
    });
  });

  it('renders the organisation name and logo', () => {
    renderComponent();

    expect(
      screen.getByText(MOCK_REGISTRATION_ORGANISATION.name)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: MOCK_REGISTRATION_ORGANISATION.name })
    ).toBeInTheDocument();
  });

  it('renders static organisation item', () => {
    renderComponent();
    expect(screen.getByRole('img', { name: 'KL Galaxy' })).toBeInTheDocument();
  });

  it('renders the back button when URL params exist', () => {
    renderComponent();
    expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();
  });

  describe('Export button visibility', () => {
    it('shows Export button when hash is #players and flag/permissions allow', () => {
      commonHooks.useLocationHash.mockReturnValue('#players');

      renderComponent();
      expect(
        screen.getByRole('button', { name: 'Export' })
      ).toBeInTheDocument();
    });

    it('does not show Export button if hash is not #players', () => {
      commonHooks.useLocationHash.mockReturnValue('#overview');

      renderComponent();
      expect(
        screen.queryByRole('button', { name: 'Export' })
      ).not.toBeInTheDocument();
    });

    it('does not show Export button if permission is missing', () => {
      PermissionsContext.usePermissions.mockReturnValue({
        permissions: {
          registration: {
            payment: {
              canExportPayment: false,
            },
          },
          homegrown: {
            canViewHomegrownTags: true,
            canManageHomegrown: false,
          },
        },
      });

      commonHooks.useLocationHash.mockReturnValue('#players');

      renderComponent();
      expect(
        screen.queryByRole('button', { name: 'Export' })
      ).not.toBeInTheDocument();
    });
    it('show Export button if canExportPayment permission', () => {
      PermissionsContext.usePermissions.mockReturnValue({
        permissions: {
          registration: {
            payment: {
              canExportPayment: true,
            },
          },
          homegrown: {
            canViewHomegrownTags: false,
            canManageHomegrown: false,
          },
        },
      });

      commonHooks.useLocationHash.mockReturnValue('#players');

      renderComponent();
      expect(
        screen.queryByRole('button', { name: 'Export' })
      ).toBeInTheDocument();
    });
  });
});
