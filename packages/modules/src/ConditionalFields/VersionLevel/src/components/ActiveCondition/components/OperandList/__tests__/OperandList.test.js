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

import OperandList from '..';

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
      <OperandList {...props} />
    </Provider>
  );
};
describe('<OperandList />', () => {
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
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      'Input'
    );
    expect(
      screen.getByRole('button', { name: '+ Additional input' })
    ).toBeInTheDocument();
    expect(screen.queryByText('Input relation')).toBeInTheDocument();

    expect(screen.getByRole('radiogroup')).toBeInTheDocument();

    // accounting for placeholder in Input Select
    expect(screen.queryAllByText('Input')).toHaveLength(2);
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
        screen.queryByText('Organisation Coding System')
      ).toBeInTheDocument();
      // Operator Select
      expect(screen.queryByText('Is')).toBeInTheDocument();
      // Trigger Select
      expect(screen.queryByText('OSICS-10')).toBeInTheDocument();
    });
    it('renders icon-bin when more than one operand', () => {
      const mockConditionWithMultiOperands = {
        ...MOCK_ACTIVE_CONDITION,
        predicate: {
          operator: 'and',
          operands: [
            {
              operator: 'eq',
              path: 'organisation_coding_system/id',
              value: '2',
            },
            {
              operator: null,
              path: '',
              value: '',
            },
          ],
        },
      };

      renderWithProviders(
        storeFake({
          global: {
            useGetOrganisationQuery: jest.fn(),
          },
          conditionBuildViewSlice: {
            activeCondition: mockConditionWithMultiOperands,
            allConditions: [MOCK_ACTIVE_CONDITION],
          },
          conditionalFieldsApi: {
            useFetchPredicateOptionsQuery: jest.fn(),
            useSaveConditionMutation: jest.fn(),
          },
        })
      );

      // icon-bin button has no text
      const iconBinList = screen.getAllByRole('button', { name: '' });

      // 2 icon-bins for each operand
      expect(iconBinList).toHaveLength(2);
      expect(iconBinList[0].children[0]).toHaveClass('icon-bin');
      expect(iconBinList[1].children[0]).toHaveClass('icon-bin');

      // for every operand card there is an if
      const ifList = screen.queryAllByText('If');
      expect(ifList).toHaveLength(
        mockConditionWithMultiOperands.predicate.operands.length
      );

      // render the operator in p tag for every operand except after last one
      const inputRelationList = screen.queryAllByText(
        mockConditionWithMultiOperands.predicate.operator
      );
      expect(inputRelationList).toHaveLength(
        mockConditionWithMultiOperands.predicate.operands.length - 1
      );
    });
  });
});
