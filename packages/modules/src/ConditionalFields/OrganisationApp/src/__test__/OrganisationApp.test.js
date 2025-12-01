import { screen, render } from '@testing-library/react';
import { Provider } from 'react-redux';

import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import {
  useGetOrganisationQuery,
  useGetPermissionsQuery,
} from '@kitman/common/src/redux/global/services/globalApi';
import useGlobal from '@kitman/common/src/redux/global/hooks/useGlobal';
import {
  useFetchRulesetsQuery,
  useUpdateOwnerRulesetsMutation,
} from '@kitman/modules/src/ConditionalFields/shared/services/conditionalFields';
import { data as mockData } from '@kitman/modules/src/ConditionalFields/shared/services/mocks/data/mock_rulesets_list';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';

import { defaultOrganisationContext } from '../../../shared/utils/test_utils.mock';
import OrganisationApp from '../..';

jest.mock('@kitman/common/src/redux/global/hooks/useGlobal');
jest.mock('@kitman/common/src/redux/global/services/globalApi');
jest.mock(
  '@kitman/modules/src/ConditionalFields/shared/services/conditionalFields'
);
jest.mock('@kitman/components/src/DelayedLoadingFeedback');
jest.mock('@kitman/common/src/hooks/useEventTracking');

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const defaultStore = storeFake({
  global: {
    useGlobal: jest.fn(),
    useGetOrganisationQuery: jest.fn(),
    useGetPermissionsQuery: jest.fn(),
    useGetCurrentUserQuery: jest.fn(),
    useGetSportQuery: jest.fn(),
  },
  toastsSlice: {
    value: [],
  },
  conditionalFields: {
    useFetchRulesetsQuery: jest.fn(),
    useUpdateOwnerRulesetsMutation: jest.fn(),
  },
});

const props = {
  organisationId: defaultOrganisationContext.organisation.id,
  t: i18nextTranslateStub(),
};

describe('<OrganisationAppApp/>', () => {
  beforeEach(() => {
    i18nextTranslateStub();
    window.featureFlags['conditional-fields-creation-in-ip'] = true;
    useGlobal.mockReturnValue({
      isLoading: false,
      hasFailed: false,
      isSuccess: true,
    });
    useGetOrganisationQuery.mockReturnValue({
      data: {
        id: defaultOrganisationContext.organisation.id,
      },
      isError: false,
      isSuccess: true,
    });
    useGetPermissionsQuery.mockReturnValue({
      data: {
        logicBuilder: {
          canAdmin: true,
        },
      },
      isSuccess: true,
    });
    useFetchRulesetsQuery.mockReturnValue({
      data: mockData,
      isFetching: false,
      isError: false,
    });
    useUpdateOwnerRulesetsMutation.mockReturnValue([
      jest.fn(),
      { isLoading: false, isError: false },
    ]);
    useEventTracking.mockReturnValue({ trackEvent: jest.fn() });
  });

  afterEach(() => {
    window.featureFlags['conditional-fields-creation-in-ip'] = false;
    jest.restoreAllMocks();
  });

  it('renders', () => {
    render(
      <Provider store={defaultStore}>
        <OrganisationApp {...props} />
      </Provider>
    );

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      /Logic Builder/i
    );
  });

  it('renders with old permission', () => {
    useGetPermissionsQuery.mockReturnValue({
      data: {
        injurySurveillance: {
          canAdmin: true,
        },
      },
      isSuccess: true,
    });

    render(
      <Provider store={defaultStore}>
        <OrganisationApp {...props} />
      </Provider>
    );

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      /Logic Builder/i
    );
  });

  it('does not render any tabs if useGlobal has failed', () => {
    useGlobal.mockReturnValue({
      isLoading: false,
      hasFailed: true,
      isSuccess: false,
    });

    render(
      <Provider store={defaultStore}>
        <OrganisationApp {...props} />
      </Provider>
    );

    expect(screen.queryByText(/Rulesets/i)).not.toBeInTheDocument();
    expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
  });

  describe('[FF/PERMISSIONS]', () => {
    describe('[conditional-fields-view-organisation]', () => {
      it('renders the Rulesets details tab when true', () => {
        render(
          <Provider store={defaultStore}>
            <OrganisationApp {...props} />
          </Provider>
        );
        expect(screen.getAllByRole('tab').at(0)).toHaveTextContent('Rulesets');
        expect(screen.getAllByRole('tab').at(1)).toHaveTextContent('Consent');
      });
    });
  });

  // currently we don't have permissions on this and will use FF to toggle access
  it('does not render any tabs if the user has no permissions/FF is off', () => {
    window.featureFlags['conditional-fields-creation-in-ip'] = false;

    render(
      <Provider store={defaultStore}>
        <OrganisationApp {...props} />
      </Provider>
    );

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      /Logic Builder/i
    );
    expect(screen.queryByText(/Rulesets/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Consent/i)).not.toBeInTheDocument();
  });
});
