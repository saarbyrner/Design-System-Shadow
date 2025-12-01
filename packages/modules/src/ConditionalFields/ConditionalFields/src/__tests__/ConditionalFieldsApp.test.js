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

import ConditionalFields from '../../index';

jest.mock(
  '@kitman/modules/src/ConditionalFields/shared/services/conditionalFields'
);
jest.mock('@kitman/common/src/redux/global/hooks/useGlobal');
jest.mock('@kitman/common/src/redux/global/services/globalApi');
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
  t: i18nextTranslateStub(),
};

describe('<ConditionalFieldsApp />', () => {
  beforeAll(() => {
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
      'updateOwnerRulesets',
      { isError: false, isLoading: false, isSuccess: true },
    ]);
    useEventTracking.mockReturnValue({ trackEvent: jest.fn() });
  });

  afterAll(() => {
    window.featureFlags['conditional-fields-creation-in-ip'] = false;
  });

  describe('[ORGANISATION] routing', () => {
    it('renders the OrganisationApp when NOT organisation.association.admin', async () => {
      render(
        <Provider store={defaultStore}>
          <ConditionalFields {...props} />
        </Provider>
      );
      expect(screen.getByText(/Logic Builder/i)).toBeInTheDocument();
    });

    it('renders the OrganisationApp when NOT organisation.association.admin with older permission', async () => {
      window.setFlag('conditional-fields-creation-in-ip', true);
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
          <ConditionalFields {...props} />
        </Provider>
      );
      expect(screen.getByText(/Logic Builder/i)).toBeInTheDocument();
    });
  });
});
