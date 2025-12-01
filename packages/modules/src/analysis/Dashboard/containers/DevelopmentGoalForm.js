import { useSelector, useDispatch } from 'react-redux';

import _flattenDeep from 'lodash/flattenDeep';
import { getPrincipleNameWithItems } from '@kitman/common/src/utils/planningEvent';
import { DevelopmentGoalFormTranslated as DevelopmentGoalForm } from '../components/DevelopmentGoalForm';
import {
  closeDevelopmentGoalForm,
  saveDevelopmentGoal,
} from '../redux/actions/developmentGoalForm';
import {
  useGetDevelopmentGoalTypesQuery,
  useGetPrinciplesQuery,
  useGetTerminologiesQuery,
  useGetSquadAthletesQuery,
} from '../redux/services/dashboard';

export default () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.developmentGoalForm.isOpen);
  const status = useSelector((state) => state.developmentGoalForm.status);
  const initialFormData = useSelector(
    (state) => state.developmentGoalForm.initialFormData
  );
  const areCoachingPrinciplesEnabled = useSelector(
    (state) => state.coachingPrinciples.isEnabled
  );

  const { data: squadAthletes = { position_groups: [] } } =
    useGetSquadAthletesQuery();

  const athletes = squadAthletes.position_groups.map((positionGroup) => ({
    value: positionGroup.id,
    label: positionGroup.name,
    options: _flattenDeep(
      positionGroup.positions.map((position) =>
        position.athletes.map((athlete) => ({
          value: athlete.id,
          label: athlete.fullname,
        }))
      )
    ),
  }));
  const developmentGoalTypes =
    useGetDevelopmentGoalTypesQuery(null, { skip: !isOpen }).data?.map(
      ({ id, name }) => ({
        label: name,
        value: id,
      })
    ) || [];

  const { data: principlesQueryData = [] } = useGetPrinciplesQuery(false, {
    skip: !isOpen,
  });

  // Ideally, this fetch should be performed when the drawer is opened
  // This is not a nice hack, but the payload is so small that is would have minimal effect
  // on the page load
  const principles = areCoachingPrinciplesEnabled
    ? principlesQueryData.map((principle) => ({
        label: getPrincipleNameWithItems(principle),
        value: principle.id,
      }))
    : [];

  const developmentGoalTerminology = useGetTerminologiesQuery().data?.find(
    (terminology) => terminology.key === 'development_goal'
  )?.customName;

  return (
    <DevelopmentGoalForm
      isOpen={isOpen}
      developmentGoalTypes={developmentGoalTypes}
      principles={principles}
      athletes={athletes}
      onClickCloseSidePanel={() => {
        dispatch(closeDevelopmentGoalForm());
      }}
      onValidationSuccess={(form) => dispatch(saveDevelopmentGoal(form))}
      requestStatus={status}
      initialFormData={initialFormData}
      developmentGoalTerminology={developmentGoalTerminology}
      areCoachingPrinciplesEnabled={areCoachingPrinciplesEnabled}
    />
  );
};
