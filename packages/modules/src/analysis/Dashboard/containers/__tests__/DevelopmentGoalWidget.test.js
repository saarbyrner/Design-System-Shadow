import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import { useGetTerminologiesQuery } from '../../redux/services/dashboard';
import { DevelopmentGoalWidgetTranslated as DevelopmentGoalWidgetComponent } from '../../components/DevelopmentGoalWidget';
import DevelopmentGoalWidgetContainer from '../DevelopmentGoalWidget';

jest.mock('../../redux/services/dashboard', () => ({
  useGetTerminologiesQuery: jest.fn(),
}));

jest.mock('../../components/DevelopmentGoalWidget', () => ({
  DevelopmentGoalWidgetTranslated: jest.fn(() => (
    <div>Mock Development Goal Widget</div>
  )),
}));

const mockDispatch = jest.fn();

const defaultStore = {
  staticData: {
    canViewDevelopmentGoals: true,
    canCreateDevelopmentGoals: true,
    canEditDevelopmentGoals: true,
    canDeleteDevelopmentGoals: true,
    canManageDashboard: true,
  },
  dashboard: { appliedSquadAthletes: { athletes: [1, 2] } },
  dashboardApi: {},
  coachingPrinciples: {
    isEnabled: true,
  },
};

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: mockDispatch,
  getState: () => state,
});

const renderComponent = (storeState = defaultStore, props = {}) => {
  const store = storeFake(storeState);

  return render(
    <I18nextProvider i18n={i18n}>
      <Provider store={store}>
        <DevelopmentGoalWidgetContainer
          developmentGoals={[]}
          nextPage={null}
          hasError={false}
          {...props}
        />
      </Provider>
    </I18nextProvider>
  );
};

describe('DevelopmentGoalWidget Container', () => {
  beforeEach(() => {
    useGetTerminologiesQuery.mockReturnValue({
      data: [
        {
          key: 'development_goal',
          customName: 'Development Goal',
        },
      ],
    });
  });

  afterEach(() => {
    mockDispatch.mockClear();
    DevelopmentGoalWidgetComponent.mockClear();
  });

  it('dispatches the correct action when onClickAddDevelopmentGoal is called', () => {
    renderComponent();

    const expectedAction = {
      type: 'OPEN_DEVELOPMENT_GOAL_FORM',
      payload: {
        developmentGoal: null,
        pivotedAthletes: [1, 2],
      },
    };

    const componentProps = DevelopmentGoalWidgetComponent.mock.calls[0][0];
    componentProps.onClickAddDevelopmentGoal();

    expect(mockDispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('dispatches the correct action when onDeleteDevelopmentGoalSuccess is called', () => {
    renderComponent();

    const expectedAction = {
      type: 'ON_DELETE_DEVELOPMENT_GOAL_SUCCESS',
      payload: {
        developmentGoalId: 1,
      },
    };

    const componentProps = DevelopmentGoalWidgetComponent.mock.calls[0][0];
    componentProps.onDeleteDevelopmentGoalSuccess(1);

    expect(mockDispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('dispatches the correct action when onClickEditDevelopmentGoal is called', () => {
    renderComponent();

    const expectedAction = {
      type: 'OPEN_DEVELOPMENT_GOAL_FORM',
      payload: {
        developmentGoal: { id: 1 },
        pivotedAthletes: [1, 2],
      },
    };

    const componentProps = DevelopmentGoalWidgetComponent.mock.calls[0][0];
    componentProps.onClickEditDevelopmentGoal({ id: 1 });

    expect(mockDispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('dispatches the correct action when onCloseDevelopmentGoalSuccess is called', () => {
    renderComponent();

    const expectedAction = {
      type: 'EDIT_DEVELOPMENT_GOAL_SUCCESS',
      payload: {
        developmentGoal: { id: 1 },
      },
    };

    const componentProps = DevelopmentGoalWidgetComponent.mock.calls[0][0];
    componentProps.onCloseDevelopmentGoalSuccess({ id: 1 });

    expect(mockDispatch).toHaveBeenCalledWith(expectedAction);
  });
});
