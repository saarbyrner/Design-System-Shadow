// @flow
import type { AlarmSquadSearch, ModalStatus } from '@kitman/common/src/types';
import type { Alarm } from '@kitman/common/src/types/Alarm';
import type { AthleteGroupingLabels } from './__common';

export type State = {
  canManageDashboard: boolean,
  canViewAvailability: boolean,
  canManageAvailability: boolean,
  showDashboardFilters: boolean,
  canViewGraph: boolean,
  groupingLabels: {
    [AthleteGroupingLabels]: string,
  },
  alarmsEditorModal: {
    isVisible: boolean,
    statusId?: number,
  },
  alarmDefinitions: {
    [string]: Array<Alarm>,
  },
  alarmDefinitionsForStatus: {
    initialAlarms: Array<Alarm>,
    alarms: Array<Alarm>,
  },
  alarmSquadSearch: AlarmSquadSearch,
  alarmsModal: {
    isVisible: boolean,
    modalStatus: ModalStatus,
    changesMade: boolean,
  },
  confirmationMessage: {
    show: boolean,
    action: Function,
    message: string,
  },
  modal: {
    modalType: ?string,
    modalProps: Object,
  },
  indicationTypes: {
    stiffness: string,
    soreness: string,
    injury: string,
    pain: string,
  },
};
