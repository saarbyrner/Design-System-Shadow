import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import i18n from '@kitman/common/src/utils/i18n';
import {
  useGetDevelopmentGoalTypesQuery,
  useGetPrinciplesQuery,
  useGetTerminologiesQuery,
  useGetSquadAthletesQuery,
} from '@kitman/modules/src/analysis/Dashboard/redux/services/dashboard';
import DevelopmentGoalFormContainer from '../DevelopmentGoalForm';

jest.mock(
  '@kitman/modules/src/analysis/Dashboard/redux/services/dashboard',
  () => ({
    useGetDevelopmentGoalTypesQuery: jest.fn(),
    useGetPrinciplesQuery: jest.fn(),
    useGetTerminologiesQuery: jest.fn(),
    useGetSquadAthletesQuery: jest.fn(),
  })
);

jest.mock('../../components/DevelopmentGoalForm', () => ({
  DevelopmentGoalFormTranslated: jest.fn(({ isOpen, initialFormData }) => (
    <div data-testid="development-goal-form">
      <div data-testid="is-open">{isOpen ? 'open' : 'closed'}</div>
      <div data-testid="initial-form-data">
        {JSON.stringify(initialFormData)}
      </div>
    </div>
  )),
}));

const mockDispatch = jest.fn();

const defaultState = {
  developmentGoalForm: {
    isOpen: true,
    status: null,
    initialFormData: {
      id: null,
      athlete_id: null,
      description: '',
      development_goal_type_ids: [],
      principle_ids: [],
      start_time: null,
      close_time: null,
      copy_to_athlete_ids: [],
    },
  },
  coachingPrinciples: {
    isEnabled: true,
  },
  dashboardApi: {
    queries: {},
    mutations: {},
    provided: {},
    subscriptions: {},
    config: {
      online: true,
      focused: true,
      middlewareRegistered: true,
      refetchOnFocus: false,
      refetchOnReconnect: false,
      refetchOnMountOrArgChange: false,
      keepUnusedDataFor: 60,
      reducerPath: 'dashboardApi',
    },
  },
};

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: mockDispatch,
  getState: () => state,
});

const renderComponent = (state = defaultState) =>
  render(
    <I18nextProvider i18n={i18n}>
      <Provider store={storeFake(state)}>
        <DevelopmentGoalFormContainer />
      </Provider>
    </I18nextProvider>
  );

describe('<DevelopmentGoalFormContainer />', () => {
  const mockValue = {
    data: [],
    isLoading: false,
    isFetching: false,
    isSuccess: true,
  };
  beforeEach(() => {
    useGetSquadAthletesQuery.mockReturnValue({
      ...mockValue,
      data: { position_groups: [] },
    });

    useGetDevelopmentGoalTypesQuery.mockReturnValue(mockValue);
    useGetPrinciplesQuery.mockReturnValue(mockValue);
    useGetTerminologiesQuery.mockReturnValue(mockValue);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('sets props correctly', () => {
    renderComponent();

    expect(screen.getByTestId('development-goal-form')).toBeInTheDocument();
    expect(screen.getByTestId('is-open')).toHaveTextContent('open');
    expect(screen.getByTestId('initial-form-data')).toHaveTextContent(
      JSON.stringify(defaultState.developmentGoalForm.initialFormData)
    );
  });

  it('dispatches the correct action when onClickCloseSidePanel is called', () => {
    renderComponent();

    const { DevelopmentGoalFormTranslated } = jest.requireMock(
      '../../components/DevelopmentGoalForm'
    );
    const mockComponentCall = DevelopmentGoalFormTranslated.mock.calls[0][0];

    mockComponentCall.onClickCloseSidePanel();
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'CLOSE_DEVELOPMENT_GOAL_FORM',
    });
  });
});
