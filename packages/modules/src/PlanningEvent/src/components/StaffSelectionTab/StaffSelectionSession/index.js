// @flow
/* eslint-disable camelcase */
import { withNamespaces } from 'react-i18next';
import { useState, useEffect, useCallback, useContext } from 'react';
import { useGridApiRef } from '@mui/x-data-grid-pro';
import { compact } from 'lodash';

import {
  type EventActivityV2,
  type Event,
} from '@kitman/common/src/types/Event';
import { ReactDataGrid, TextButton } from '@kitman/components';
import {
  getEventsUsers,
  updateEventActivity,
} from '@kitman/services/src/services/planning';
import { type RequestStatus } from '@kitman/modules/src/PlanningEvent/types';
import { DataGrid as MuiDataGrid } from '@kitman/playbook/components';
import { eventTypePermaIds } from '@kitman/services/src/services/planning/getEventLocations';
import { type I18nProps } from '@kitman/common/src/types/i18n';
import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';
import { PlanningEventContext } from '@kitman/modules/src/PlanningEvent/src/contexts/PlanningEventContext';

import { AddStaffSidePanelTranslated as AddStaffSidePanel } from '../../AddStaffSidePanel';
import {
  getSelectionHeaders,
  BULK_ACTIVITY_TOGGLERS_COLUMN_KEY,
  ACTIVITY_TOGGLERS_COLUMN_KEY_PREFIX,
  gameStaffColumnHeaders,
} from '../utils';
import type { SelectionHeader } from '../utils';
import style, { tableStyle } from '../style';
import type { Row, RowActivities } from '../index';

type Props = {
  requestStatus: RequestStatus,
  eventSessionActivities: Array<EventActivityV2>,
  event: Event,
  onUpdateEvent: Function,
};

const StaffSelectionSession = (props: I18nProps<Props>) => {
  const { preferences } = usePreferences();

  const apiRef = useGridApiRef();

  const [usersEvents, setUsersEvents] = useState<Array<Row>>([]);
  const [selectionHeaders, setSelectionHeaders] = useState([]);
  const [isAddStaffPanelOpen, setAddStaffPanelOpen] = useState<boolean>(false);
  const { dispatch: planningStateDispatch } = useContext(PlanningEventContext);

  const getSelectedActivities = useCallback(
    (userId: number): RowActivities =>
      props.eventSessionActivities.map((activity) => ({
        id: activity.id,
        value: activity.users.filter(({ id }) => id === userId).length === 1,
      })),
    [props.eventSessionActivities]
  );

  const getUsersEvents = useCallback(async () => {
    const getEventsUsersResponse = await getEventsUsers({
      eventId: props.event.id,
    });

    const eventsUserData = getEventsUsersResponse.map(
      ({ user, user_order }, index) => {
        return {
          ...user,
          id: user.id,
          user: user.fullname,
          activities: getSelectedActivities(user.id),
          order: user_order ?? index,
        };
      }
    );
    // Sort the staff by order
    const sortedEventsUserData = eventsUserData.sort(
      (userA, userB) => userA.order - userB.order
    );

    setUsersEvents(sortedEventsUserData);

    props.onUpdateEvent({
      ...props.event,
      event_users: getEventsUsersResponse,
    });

    planningStateDispatch({
      type: 'SET_STAFF_PARTICIPATION',
      staff: sortedEventsUserData ?? [],
    });
  }, [props.event, getSelectedActivities]);

  useEffect(() => {
    getUsersEvents();
  }, [props.eventSessionActivities]);

  const updateActivityAttendance = async (activityId) => {
    await updateEventActivity({
      eventId: props.event.id,
      activityId,
      attributes: {
        user_ids: [...apiRef.current.getRowModels().values()]
          .filter(
            ({ activities }) =>
              activities.find((activity) => activity.id === activityId)?.value
          )
          .map(({ id: rowId }) => rowId),
      },
    });
    planningStateDispatch({
      type: 'SET_STAFF_PARTICIPATION',
      staff:
        [...apiRef.current.getRowModels().values()].filter(
          ({ activities }) =>
            activities.find((activity) => activity.id === activityId)?.value
        ) ?? [],
    });
  };

  useEffect(() => {
    if (props.event.type === eventTypePermaIds.session.type) {
      setSelectionHeaders(
        getSelectionHeaders({
          activities: props.eventSessionActivities,
          apiRef,
          updateActivityAttendance,
          t: props.t,
        })
      );
    } else {
      setSelectionHeaders(
        compact([gameStaffColumnHeaders.staff, gameStaffColumnHeaders.role])
      );
    }
  }, [props.event.type, props.eventSessionActivities, props.t]);

  const onRowsChange = async (
    currentRows: Array<Row>,
    { indexes, column }: { indexes: Array<number>, column: SelectionHeader }
  ) => {
    const newRows = [...currentRows];
    const [rowIndex] = indexes;
    const row = newRows[rowIndex];

    let value = true;
    let eventActivityIds: Array<number> = [];
    switch (true) {
      case column.key === BULK_ACTIVITY_TOGGLERS_COLUMN_KEY: {
        value = !row.activities?.every((activity) => activity.value);
        row.activities = row.activities?.map((activity) => {
          eventActivityIds.push(activity.id);
          return {
            ...activity,
            value,
          };
        });
        break;
      }
      case column.key.startsWith(ACTIVITY_TOGGLERS_COLUMN_KEY_PREFIX): {
        const activityToToggle = row.activities?.find(
          (activity) => activity.id === column.id
        );
        if (activityToToggle) {
          activityToToggle.value = !activityToToggle.value;
          value = activityToToggle.value;
          eventActivityIds = [activityToToggle.id];
        }
        break;
      }
      // TODO: implement a default case.
      default:
    }

    eventActivityIds.forEach(async (id) => {
      await updateEventActivity({
        eventId: props.event.id,
        activityId: id,
        attributes: {
          user_ids: newRows
            .filter(
              ({ activities }) =>
                activities?.find((activity) => activity.id === id)?.value
            )
            .map(({ id: rowId }) => rowId),
        },
      });
      planningStateDispatch({
        type: 'SET_STAFF_PARTICIPATION',
        staff: newRows ?? [],
      });
    });
    setUsersEvents(newRows);
  };

  const renderSessionStaffGrids = () => (
    <div css={style.gridWrapper}>
      {window.getFlag('planning-area-mui-data-grid') && (
        <div style={{ height: 500, width: '100%' }}>
          <MuiDataGrid
            apiRef={apiRef}
            rows={usersEvents}
            noRowsMessage={props.t('No staff added')}
            columns={selectionHeaders}
            gridToolBar={['showQuickFilter']}
            leftPinnedColumns={[BULK_ACTIVITY_TOGGLERS_COLUMN_KEY, 'user']}
            pagination
          />
        </div>
      )}
      {!window.getFlag('planning-area-mui-data-grid') &&
        (usersEvents.length > 0 ? (
          <ReactDataGrid
            tableHeaderData={selectionHeaders}
            tableBodyData={usersEvents}
            onRowsChange={onRowsChange}
            selectableRows
            tableGrow
            tableStyling={tableStyle}
          />
        ) : (
          <div css={style.emptyTable}>{props.t('No staff added')}</div>
        ))}
    </div>
  );

  return (
    <div css={style.wrapper}>
      <div css={style.header}>
        <h2 css={style.heading}>{props.t('Staff')}</h2>
        <TextButton
          onClick={() => setAddStaffPanelOpen(true)}
          text={props.t('Add/remove staff')}
          type="primary"
          kitmanDesignSystem
        />
      </div>
      {props.requestStatus === 'SUCCESS' && renderSessionStaffGrids()}
      <AddStaffSidePanel
        title={props.t('Add/remove staff')}
        event={props.event}
        isOpen={isAddStaffPanelOpen}
        onClose={() => setAddStaffPanelOpen(false)}
        onSaveUsersSuccess={() => {
          getUsersEvents();
          setAddStaffPanelOpen(false);
        }}
        preferences={preferences}
      />
    </div>
  );
};

export const StaffSelectionSessionTranslated = withNamespaces()(
  StaffSelectionSession
);
export default StaffSelectionSession;
