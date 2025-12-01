// @flow
import { useDispatch } from 'react-redux';
import { onTogglePanel } from '@kitman/modules/src/LeagueFixtures/src/redux/slices/AssignStaffSlice';

import type { Event } from '@kitman/common/src/types/Event';

const useAssignStaffPanel = () => {
  const dispatch = useDispatch();

  const handleOnToggle = (game: ?Event) => {
    dispatch(
      onTogglePanel({
        isOpen: !!game,
        ...(game ? { game } : {}),
      })
    );
  };

  return {
    handleOnToggle,
  };
};

export default useAssignStaffPanel;
