// @flow
import { useSelector, useDispatch } from 'react-redux';
import { getMatchDayEmailMode } from '@kitman/modules/src/PlanningEvent/src/redux/selectors/matchDayEmailSelectors';
import { onReset } from '@kitman/modules/src/PlanningEvent/src/redux/slices/matchDayEmailSlice';
import type { MatchDayEmailPanelMode } from '@kitman/modules/src/PlanningEvent/src/redux/slices/matchDayEmailSlice';

type ReturnType = {
  handleOnCancel: () => void,
  mode: MatchDayEmailPanelMode,
};

const useMatchDayEmail = (): ReturnType => {
  const dispatch = useDispatch();

  const mode = useSelector(getMatchDayEmailMode);

  const handleOnCancel = () => {
    dispatch(onReset());
  };

  return {
    handleOnCancel,
    mode,
  };
};

export default useMatchDayEmail;
