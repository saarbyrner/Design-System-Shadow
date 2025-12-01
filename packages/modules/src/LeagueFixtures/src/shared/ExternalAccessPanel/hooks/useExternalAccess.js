// @flow
import { useDispatch } from 'react-redux';
import { onTogglePanel } from '@kitman/modules/src/LeagueFixtures/src/redux/slices/ExternalAccessSlice';
import i18n from '@kitman/common/src/utils/i18n';
import { Button } from '@kitman/playbook/components';
import type { Game } from '@kitman/common/src/types/Event';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import leagueOperationsEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/leagueOperations';
import { getScoutAccessTrackingData } from '@kitman/common/src/utils/TrackingData/src/data/leagueOperations/getScoutAccessManagementData';

const useExternalAccess = (game?: Game) => {
  const dispatch = useDispatch();
  const { trackEvent } = useEventTracking();

  const handleOnToggle = (val: boolean) => {
    dispatch(
      onTogglePanel({
        isOpen: val,
        ...(val && game?.id ? { gameId: game.id } : {}),
      })
    );
  };

  const menuItem = {
    description: i18n.t('Request Access'),
    onClick: () => {
      handleOnToggle(true);
      trackEvent(
        leagueOperationsEventNames.requestAccessClicked,
        getScoutAccessTrackingData({
          product: 'league-ops',
          productArea: 'schedule',
          feature: 'scout-access-management',
          isRequestedOnBehalfOf: true,
        })
      );
    },
  };

  const buttonTrigger = (
    <Button onClick={() => {}}>{i18n.t('Request Access')}</Button>
  );

  return {
    handleOnToggle,
    buttonTrigger,
    menuItem,
  };
};

export default useExternalAccess;
