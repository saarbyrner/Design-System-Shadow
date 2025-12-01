import { screen, render } from '@testing-library/react';
import { Provider } from 'react-redux';

import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { useGetOrganisationQuery } from '@kitman/common/src/redux/global/services/globalApi';

import {
  useFetchPredicateOptionsQuery,
  useSaveConditionMutation,
} from '@kitman/modules/src/ConditionalFields/shared/services/conditionalFields';
import {
  MOCK_BLANK_ACTIVE_CONDITION,
  MOCK_ACTIVE_CONDITION,
  defaultOrganisationContext,
} from '@kitman/modules/src/ConditionalFields/shared/utils/test_utils.mock';
import { data as MOCK_PREDICATE_OPTIONS } from '@kitman/modules/src/ConditionalFields/shared/services/mocks/data/mock_predicate_options_list';

import OperandCard from '..';

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
    useGetOrganisationQuery: jest.fn(),
  },
  conditionBuildViewSlice: {
    activeCondition: MOCK_BLANK_ACTIVE_CONDITION,
    allConditions: [MOCK_BLANK_ACTIVE_CONDITION],
  },
  conditionalFieldsApi: {
    useFetchPredicateOptionsQuery: jest.fn(),
    useSaveConditionMutation: jest.fn(),
  },
});

const defaultProps = {
  index: 0,
  t: i18nextTranslateStub(),
};

const renderWithProviders = (store = defaultStore, props = defaultProps) => {
  render(
    <Provider store={store}>
      <OperandCard {...props} />
    </Provider>
  );
};
describe('<PredicateBuild/>', () => {
  beforeEach(() => {
    useSaveConditionMutation.mockReturnValue([{}, {}]);
    useGetOrganisationQuery.mockReturnValue({
      data: {
        id: defaultOrganisationContext.organisation.id,
      },
      isError: false,
      isSuccess: true,
    });
    useFetchPredicateOptionsQuery.mockReturnValue({
      data: MOCK_PREDICATE_OPTIONS,
      isError: false,
      isSuccess: true,
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders expected form fields', () => {
    renderWithProviders();

    // account for If before the form fields
    expect(screen.queryByText('If')).toBeInTheDocument();
    // Removed labels now placeholders
    expect(screen.queryByText('Input')).toBeInTheDocument();
    // accounting for Operator Select
    expect(screen.queryByText('Operator')).toBeInTheDocument();
    // Accounting for Trigger Select
    expect(screen.queryByText('Trigger')).toBeInTheDocument();
  });

  describe('[COMPUTED]', () => {
    it('renders expected data from activeCondition', () => {
      renderWithProviders(
        storeFake({
          global: {
            useGetOrganisationQuery: jest.fn(),
          },
          conditionBuildViewSlice: {
            activeCondition: MOCK_ACTIVE_CONDITION,
            allConditions: [MOCK_ACTIVE_CONDITION],
          },
          conditionalFieldsApi: {
            useFetchPredicateOptionsQuery: jest.fn(),
            useSaveConditionMutation: jest.fn(),
          },
        })
      );

      // Input Select
      expect(
        screen.getByText('Organisation Coding System')
      ).toBeInTheDocument();
      // Operator Select
      expect(screen.getByText('Is')).toBeInTheDocument();
      // Trigger Select
      expect(screen.getByText('OSICS-10')).toBeInTheDocument();
    });
  });
});
