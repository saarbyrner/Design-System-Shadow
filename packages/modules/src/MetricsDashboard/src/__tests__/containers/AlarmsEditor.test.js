import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { statusesToIds, statusesToMap } from '@kitman/common/src/utils';
import {
  buildAlarms,
  buildStatuses,
} from '@kitman/common/src/utils/test_utils';
import AlarmsEditor from '../../containers/AlarmsEditor';

describe('<AlarmsEditor />', () => {
  const alarms = buildAlarms(1);
  const statuses = buildStatuses(4);
  const statusIds = statusesToIds(statuses);

  const defaultState = {
    modal: {
      modalProps: {
        statusId: statusIds[0],
      },
    },
    alarmDefinitionsForStatus: {
      alarms,
    },
    statuses: {
      ids: statusIds,
      byId: statusesToMap(statuses),
      available: [],
      reorderedIds: statusesToIds(statuses),
    },
    alarmsModal: {
      isVisible: false,
      modalStatus: null,
      changesMade: false,
    },
  };

  it('renders', () => {
    renderWithRedux(<AlarmsEditor />, {
      preloadedState: defaultState,
      useGlobalStore: false,
    });

    expect(document.querySelector('.ReactModalPortal')).toBeInTheDocument();
  });
});
