import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

import {
  useGetOrganisationQuery,
  useGetPermissionsQuery,
} from '@kitman/common/src/redux/global/services/globalApi';

import {
  useFetchVersionQuery,
  useFetchPredicateOptionsQuery,
  useSaveVersionMutation,
  useDeleteConditionMutation,
} from '@kitman/modules/src/ConditionalFields/shared/services/conditionalFields';
import { data as MOCK_VERSION } from '@kitman/modules/src/ConditionalFields/shared/services/mocks/data/mock_version';
import { data as MOCK_PREDICATE_OPTIONS } from '@kitman/modules/src/ConditionalFields/shared/services/mocks/data/mock_predicate_options_list';
import {
  defaultOrganisationContext,
  MOCK_ACTIVE_CONDITION,
} from '@kitman/modules/src/ConditionalFields/shared/utils/test_utils.mock';

import VersionBuildViewTab from '..';

jest.mock('@kitman/common/src/redux/global/services/globalApi');
jest.mock(
  '@kitman/modules/src/ConditionalFields/shared/services/conditionalFields'
);

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
  },
  conditionalFieldsApi: {
    useFetchVersionQuery: jest.fn(),
    useFetchPredicateOptionsQuery: jest.fn(),
    useUpdateOwnerRulesetMutation: jest.fn(),
    useSaveVersionMutation: jest.fn(),
    useDeleteConditionMutation: jest.fn(),
  },
  conditionBuildViewSlice: {
    activeCondition: MOCK_ACTIVE_CONDITION,
    allConditions: [MOCK_ACTIVE_CONDITION],
    requestStatus: 'SUCCESS',
    flattenedNames: [],
  },
});

describe('<VersionBuildView />', () => {
  const props = {
    version: { ...MOCK_VERSION, published_at: null },
    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    useGetOrganisationQuery.mockReturnValue({
      data: {
        id: defaultOrganisationContext.organisation.id,
      },
      isError: false,
      isLoading: false,
      isSuccess: true,
    });
    useGetPermissionsQuery.mockReturnValue({
      data: {
        injurySurveillance: {
          canAdmin: true,
        },
      },
      isSuccess: true,
    });
    useFetchVersionQuery.mockReturnValue({
      data: { ...MOCK_VERSION, published_at: null },
      isError: false,
      isLoading: false,
      isSuccess: true,
    });
    useFetchPredicateOptionsQuery.mockReturnValue({
      data: MOCK_PREDICATE_OPTIONS,
      isError: false,
      isSuccess: true,
    });
    useSaveVersionMutation.mockReturnValue([{}, {}]);
    useDeleteConditionMutation.mockReturnValue([{}, {}]);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('[requestStatus]', () => {
    it('[FAILURE] renders error app status', () => {
      render(
        <Provider
          store={storeFake({
            global: {
              useGlobal: jest.fn(),
              useGetOrganisationQuery: jest.fn(),
              useGetPermissionsQuery: jest.fn(),
            },
            conditionalFieldsApi: {
              useFetchVersionQuery: jest.fn(),
              useFetchPredicateOptionsQuery: jest.fn(),
              useUpdateOwnerRulesetMutation: jest.fn(),
              useSaveVersionMutation: jest.fn(),
            },
            conditionBuildViewSlice: {
              activeCondition: MOCK_ACTIVE_CONDITION,
              allConditions: [MOCK_ACTIVE_CONDITION],
              requestStatus: 'FAILURE',
            },
          })}
        >
          <VersionBuildViewTab {...props} />
        </Provider>
      );

      expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Go back and try again' })
      ).toBeInTheDocument();
    });
    it('[PENDING] renders loading spinner', () => {
      render(
        <Provider
          store={storeFake({
            global: {
              useGlobal: jest.fn(),
              useGetOrganisationQuery: jest.fn(),
              useGetPermissionsQuery: jest.fn(),
            },
            conditionalFieldsApi: {
              useFetchVersionQuery: jest.fn(),
              useFetchPredicateOptionsQuery: jest.fn(),
              useUpdateOwnerRulesetMutation: jest.fn(),
              useSaveVersionMutation: jest.fn(),
            },
            conditionBuildViewSlice: {
              activeCondition: MOCK_ACTIVE_CONDITION,
              allConditions: [MOCK_ACTIVE_CONDITION],
              requestStatus: 'PENDING',
            },
          })}
        >
          <VersionBuildViewTab {...props} />
        </Provider>
      );

      expect(screen.getByTestId('LoadingSpinner')).toBeInTheDocument();
    });
    it('[SUCCESS] renders the correct content', () => {
      render(
        <Provider store={defaultStore}>
          <VersionBuildViewTab {...props} />
        </Provider>
      );

      // left content
      expect(
        screen.getAllByRole('heading', { level: 3 }).at(0)
      ).toHaveTextContent(/Rules/i);
      expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();

      MOCK_VERSION.conditions.forEach((condition) => {
        expect(screen.queryByText(condition.name)).toBeInTheDocument();
      });

      // right content
      expect(screen.getByText(MOCK_ACTIVE_CONDITION.name)).toBeInTheDocument();
    });
  });
});
