import { useDispatch, useSelector } from 'react-redux';
import { ErrorBoundary } from '@kitman/components';
import { DevelopmentGoalWidgetTranslated as DevelopmentGoalWidget } from '../components/DevelopmentGoalWidget';
import {
  openDevelopmentGoalForm,
  editDevelopmentGoalSuccess,
} from '../redux/actions/developmentGoalForm';
import {
  fetchNextDevelopmentGoals,
  onDeleteDevelopmentGoalSuccess,
} from '../redux/actions/developmentGoalWidget';
import { deleteWidget } from '../redux/actions/widgets';
import { useGetTerminologiesQuery } from '../redux/services/dashboard';

export default (props) => {
  const dispatch = useDispatch();
  const canViewDevelopmentGoals = useSelector(
    (state) => state.staticData.canViewDevelopmentGoals
  );
  const canCreateDevelopmentGoals = useSelector(
    (state) => state.staticData.canCreateDevelopmentGoals
  );
  const canEditDevelopmentGoals = useSelector(
    (state) => state.staticData.canEditDevelopmentGoals
  );
  const canDeleteDevelopmentGoals = useSelector(
    (state) => state.staticData.canDeleteDevelopmentGoals
  );
  const canManageDashboard = useSelector(
    (state) => state.staticData.canManageDashboard
  );
  const pivotedAthletes = useSelector(
    (state) => state.dashboard.appliedSquadAthletes.athletes
  );
  const developmentGoalTerminology = useGetTerminologiesQuery().data?.find(
    (terminology) => terminology.key === 'development_goal'
  )?.customName;

  const areCoachingPrinciplesEnabled = useSelector(
    (state) => state.coachingPrinciples.isEnabled
  );

  return (
    <ErrorBoundary>
      <DevelopmentGoalWidget
        fetchNextDevelopmentGoals={() =>
          dispatch(fetchNextDevelopmentGoals(props.widgetId, props.nextId))
        }
        onClickAddDevelopmentGoal={() =>
          dispatch(openDevelopmentGoalForm(null, pivotedAthletes))
        }
        onClickDeleteDevelopmentGoalWidget={() =>
          dispatch(deleteWidget(props.widgetId))
        }
        onClickEditDevelopmentGoal={(developmentGoal) =>
          dispatch(openDevelopmentGoalForm(developmentGoal, pivotedAthletes))
        }
        onDeleteDevelopmentGoalSuccess={(developmentGoalId) =>
          dispatch(onDeleteDevelopmentGoalSuccess(developmentGoalId))
        }
        onCloseDevelopmentGoalSuccess={(developmentGoal) =>
          dispatch(editDevelopmentGoalSuccess(developmentGoal))
        }
        canViewDevelopmentGoals={canViewDevelopmentGoals}
        canEditDevelopmentGoals={canEditDevelopmentGoals}
        canDeleteDevelopmentGoals={canDeleteDevelopmentGoals}
        canCreateDevelopmentGoals={canCreateDevelopmentGoals}
        canManageDashboard={canManageDashboard}
        developmentGoalTerminology={developmentGoalTerminology}
        areCoachingPrinciplesEnabled={areCoachingPrinciplesEnabled}
        {...props}
      />
    </ErrorBoundary>
  );
};
