// @flow
import { useState, useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import { isEqual } from 'lodash';
import moment from 'moment';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { Drawer } from '@kitman/playbook/components';
import { drawerMixin } from '@kitman/modules/src/UserMovement/shared/mixins';
import { useTheme } from '@kitman/playbook/hooks';
import { useSelector, useDispatch } from 'react-redux';
import {
  getIsPanelOpen,
  getGame,
} from '@kitman/modules/src/LeagueFixtures/src/redux/selectors/assignStaffSelectors';
import SidePanelSectionLayout from '@kitman/modules/src/LeagueFixtures/src/shared/layouts/SidePanelSectionLayout';
import { SelectOfficialTranslated as SelectOfficial } from '@kitman/modules/src/PlanningEventSidePanel/src/components/gameLayoutV2/SelectOfficial';
import { add } from '@kitman/modules/src/Toasts/toastsSlice';
import { toastStatusEnumLike } from '@kitman/components/src/Toast/enum-likes';
import { assignMatchMonitor } from '@kitman/services/src';
import type { FixtureReportTypes } from '@kitman/modules/src/shared/FixtureScheduleView/types';
import { fixtureReports } from '@kitman/modules/src/shared/FixtureScheduleView/helpers';
import {
  useGetGameOfficialsQuery,
  useSetGameOfficialsMutation,
} from '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/officialsApi';

import useAssignStaffPanel from './hooks/useAssignStaffPanel';
import { ActionsTranslated as Actions } from './components/Actions';
import { SelectMatchMonitorTranslated as SelectMatchMonitor } from './components/SelectMatchMonitor';

type AssignStaffSidePanelProps = {
  reportType: FixtureReportTypes,
  onSaveSuccess: () => void,
};

const AssignStaffPanel = (props: I18nProps<AssignStaffSidePanelProps>) => {
  const theme = useTheme();
  const isOpen = useSelector(getIsPanelOpen);
  const game = useSelector(getGame);

  const [staffInfoIds, setStaffInfoIds] = useState<Array<number>>([]);

  const dispatch = useDispatch();

  const { handleOnToggle } = useAssignStaffPanel();

  const { data: savedGameOfficialsData } = useGetGameOfficialsQuery(
    { eventId: game?.id, ignoreParseByRole: true },
    {
      skip: !(isOpen && props.reportType === fixtureReports.matchReport),
    }
  );
  const [setGameOfficials] = useSetGameOfficialsMutation();

  // handles the initial load when a new game is selected to prepopulate the dropdown
  useEffect(() => {
    if (
      props.reportType === fixtureReports.matchReport &&
      savedGameOfficialsData?.length
    ) {
      setStaffInfoIds(savedGameOfficialsData?.map((user) => user.official_id));
    } else if (
      props.reportType === fixtureReports.matchMonitorReport &&
      game?.match_monitors?.length
    ) {
      setStaffInfoIds(game?.match_monitors?.map((user) => user?.id));
    } else {
      setStaffInfoIds([]);
    }
  }, [game, savedGameOfficialsData]);

  const isSaveDisabled = () => {
    if (props.reportType === fixtureReports.matchMonitorReport) {
      return isEqual(
        game?.match_monitors?.map((user) => user?.id),
        staffInfoIds
      );
    }

    return isEqual(
      savedGameOfficialsData?.map((user) => user.official_id),
      staffInfoIds
    );
  };

  const getAssignStaffTypeTitle = () => {
    if (props.reportType === fixtureReports.matchMonitorReport) {
      return 'match monitor';
    }
    return 'match official';
  };

  const handleOnSuccessAssignment = () => {
    handleOnToggle(null); // close side panel
    dispatch(
      add({
        status: toastStatusEnumLike.Success,
        title: props.t('The {{staffUserType}} assignment was successful.', {
          staffUserType: getAssignStaffTypeTitle(),
        }),
      })
    );
    props.onSaveSuccess();
  };

  const handleOnFailedAssignment = () => {
    dispatch(
      add({
        status: toastStatusEnumLike.Error,
        title: props.t(
          'The {{staffUserType}} failed to save. Please try again.',
          { staffUserType: getAssignStaffTypeTitle() }
        ),
      })
    );
  };

  const handleOnOfficialAssignment = () => {
    setGameOfficials({
      eventId: game?.id,
      updates: staffInfoIds.map((id) => ({ official_id: id })),
    })
      .then(() => {
        handleOnSuccessAssignment();
      })
      .catch(() => {
        handleOnFailedAssignment();
      });
  };

  const handleOnMatchMonitorAssignment = () => {
    assignMatchMonitor({
      eventId: game?.id,
      matchMonitorIds: staffInfoIds,
    })
      .then(() => {
        handleOnSuccessAssignment();
      })
      .catch(() => {
        handleOnFailedAssignment();
      });
  };

  const handleOnSubmit = () => {
    if (props.reportType === fixtureReports.matchMonitorReport)
      return handleOnMatchMonitorAssignment();

    return handleOnOfficialAssignment();
  };

  const renderAssignStaffContent = () => {
    if (props.reportType === fixtureReports.matchMonitorReport)
      return (
        <SelectMatchMonitor
          monitorsIds={staffInfoIds}
          setAssignedMonitorIds={setStaffInfoIds}
        />
      );

    return (
      <SelectOfficial
        isOpen
        userIds={staffInfoIds}
        onUpdateUserIds={setStaffInfoIds}
        customStyle={{ padding: '20px' }}
        squad={game.squad}
      />
    );
  };

  const renderContent = () => {
    if (!isOpen) return null;

    const gameStartDate = game
      ? moment
          .tz(game?.start_date, game?.local_timezone)
          .format('MMM DD YYYY, hh:mm a')
      : '';
    const opponentName = game?.opponent_squad
      ? game.opponent_squad.owner_name
      : '';

    return (
      game && (
        <SidePanelSectionLayout>
          <SidePanelSectionLayout.Title
            title={props.t('Assign {{staffType}}', {
              staffType: getAssignStaffTypeTitle(),
            })}
            text={props.t(
              'Game: {{ownerName}} vs {{opponentName}} - {{gameStartDate}}',
              {
                ownerName: game.squad?.owner_name,
                opponentName,
                gameStartDate,
                interpolation: { escapeValue: false },
              }
            )}
            onClose={() => handleOnToggle(null)}
          />
          <SidePanelSectionLayout.Content>
            {renderAssignStaffContent()}
          </SidePanelSectionLayout.Content>
          <SidePanelSectionLayout.Actions>
            <Actions onSubmit={handleOnSubmit} isDisabled={isSaveDisabled()} />
          </SidePanelSectionLayout.Actions>
        </SidePanelSectionLayout>
      )
    );
  };

  return (
    <Drawer
      open={isOpen}
      anchor="right"
      onClose={() => {}}
      sx={drawerMixin({ theme, isOpen })}
    >
      {renderContent()}
    </Drawer>
  );
};

export default withNamespaces()(AssignStaffPanel);
