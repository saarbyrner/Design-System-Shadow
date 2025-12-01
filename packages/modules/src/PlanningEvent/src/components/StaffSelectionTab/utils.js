// @flow
import i18next from 'i18next';
import {
  UserAvatar,
  TextLink,
  Checkbox,
  ToggleSwitch,
} from '@kitman/components';
import type { EventActivityV2 } from '@kitman/common/src/types/Event';
import type { HeaderData } from '@kitman/components/src/ReactDataGrid';
import type { GridApiCommon, GridColDef } from '@mui/x-data-grid-pro';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { Row } from './index';
import athleteStyles from '../AthletesSelectionTab/style';
import style, { userFormatterClassName } from './style';

export type SelectionHeader = {
  ...HeaderData,
  id?: number,
};

export const userFormatter = ({ row, isGame }: any) => {
  if (row == null) {
    return '-';
  }
  return (
    <div
      data-testid="userFormatter"
      className={userFormatterClassName}
      css={style.userCell}
    >
      <div css={style.imageContainer}>
        <UserAvatar
          url={row.avatar_url}
          firstname={row.firstname}
          lastname={row.lastname}
          displayInitialsAsFallback={false}
          size="EXTRA_SMALL"
          availability={row.availability}
          statusDotMargin={-1}
        />
      </div>
      <div css={style.detailsContainer}>
        {isGame ? (
          <span css={athleteStyles.athleteFullName}>{row.fullname}</span>
        ) : (
          <TextLink text={row.fullname} href={`/medical/users/${row.id}`} />
        )}
        <span css={style.position}>
          {typeof row.position === 'object' ? row.position.name : row.position}
        </span>
      </div>
    </div>
  );
};

export const BULK_ACTIVITY_TOGGLERS_COLUMN_KEY = 'bulk activity togglers';

export const bulkActivityTogglerFormatter = ({
  row,
  onRowChange,
  updateActivityAttendance,
  apiRef,
}: {
  row: Row,
  onRowChange: (Row) => void,
  updateActivityAttendance: (activityId: number) => Promise<void>,
  apiRef: GridApiCommon,
}) => (
  <div css={style.bulkActivityTogglerFormatter}>
    <Checkbox.New
      id={`${row.id} ${row.fullname}`}
      checked={
        row.activities &&
        row.activities?.length > 0 &&
        row.activities?.every(({ value }) => value)
      }
      indeterminate={row.activities?.some(({ value }) => value)}
      disabled={!row.activities?.length}
      onClick={() => {
        if (window.getFlag('planning-area-mui-data-grid')) {
          const newToggleValue = !row.activities?.every(
            (activity) => activity.value
          );
          const previousValuesDictionary = {};
          const newAct = row.activities?.map((act) => {
            previousValuesDictionary[act.id] = act.value;
            return { ...act, value: newToggleValue };
          });
          apiRef.current.updateRows([
            {
              id: row.id,
              activities: newAct,
            },
          ]);

          row.activities?.forEach(({ id }) => {
            // check BE call is needed (i.e value has changed)
            if (previousValuesDictionary[id] !== newToggleValue) {
              updateActivityAttendance(id);
            }
          });
        } else {
          onRowChange({ ...row });
        }
      }}
    />
  </div>
);

export const ACTIVITY_TOGGLERS_COLUMN_KEY_PREFIX = 'activity togglers';

type ActivityTogglerFormatterParam = {
  row: Row,
  column: SelectionHeader,
  onRowChange: (Row) => void,
  colDef: GridColDef,
  apiRef: GridApiCommon,
  updateActivityAttendance: (activityId: number) => Promise<void>,
};
export const activityTogglerFormatter = ({
  row,
  column,
  onRowChange,
  colDef,
  apiRef,
  updateActivityAttendance,
  t,
}: I18nProps<ActivityTogglerFormatterParam>) => {
  const isIn = window.getFlag('planning-area-mui-data-grid')
    ? row.activities?.find((activity) => activity.id === colDef.id)?.value
    : row.activities?.find((activity) => activity.id === column.id)?.value;

  return (
    <div css={style.activityTogglerWrapper}>
      <ToggleSwitch
        kitmanDesignSystem
        isSwitchedOn={isIn}
        toggle={() => {
          if (window.getFlag('planning-area-mui-data-grid')) {
            const rowActivities = row.activities?.slice();
            const updateIndex = rowActivities?.findIndex(
              ({ id: rowId }) => rowId === colDef.id
            );
            if (rowActivities && (updateIndex || updateIndex === 0)) {
              rowActivities[updateIndex].value =
                !rowActivities[updateIndex]?.value;
              apiRef.current.updateRows([
                {
                  id: row.id,
                  activities: rowActivities,
                },
              ]);
              updateActivityAttendance(colDef.id);
            }
          } else {
            onRowChange({ ...row });
          }
        }}
      />
      <span css={style.activityTogglerLabel}>{isIn ? t('In') : t('Out')}</span>
    </div>
  );
};

export const gameStaffColumnHeaders: { [key: string]: GridColDef } = {
  staff: {
    field: 'user',
    headerName: i18next.t('Staff'),
    frozen: true,
    resizable: true,
    width: 400,
    renderCell: (params) => {
      return params.row.staff;
    },
  },

  role: {
    field: 'role',
    headerName: i18next.t('Role'),
    frozen: true,
    resizable: true,
    width: 200,
    renderCell: (params) => {
      return params.row.role;
    },
  },
};

export const getSelectionHeaders = ({
  activities,
  apiRef,
  updateActivityAttendance,
  t,
}: I18nProps<{
  activities: Array<EventActivityV2>,
  apiRef: GridApiCommon,
  updateActivityAttendance: (activityId: number) => Promise<void>,
}>): Array<SelectionHeader> => {
  // todo: KEY and NAME not needed for MUI but adding to keep flow happy for now
  const planningSelectionsHeader = window.getFlag('planning-area-mui-data-grid')
    ? [
        {
          key: BULK_ACTIVITY_TOGGLERS_COLUMN_KEY,
          name: '',
          field: BULK_ACTIVITY_TOGGLERS_COLUMN_KEY,
          headerName: '',
          renderCell: (arg) =>
            bulkActivityTogglerFormatter({
              ...arg,
              updateActivityAttendance,
              apiRef,
            }),
          frozen: true,
          width: 45,
          minWidth: 45,
          maxWidth: 45,
        },
        {
          key: 'user',
          name: 'Staff',
          field: 'user',
          headerName: 'Staff/Role',
          frozen: true,
          resizable: true,
          width: 200,
          renderCell: userFormatter,
        },
      ]
    : [
        {
          key: BULK_ACTIVITY_TOGGLERS_COLUMN_KEY,
          name: '',
          formatter: bulkActivityTogglerFormatter,
          frozen: true,
          width: 45,
          minWidth: 45,
          maxWidth: 45,
        },
        {
          key: 'user',
          name: 'Staff',
          frozen: true,
          resizable: true,
          width: 200,
          formatter: userFormatter,
        },
      ];

  const headers = planningSelectionsHeader.concat(
    activities.map((activity, index) => {
      let key = `${ACTIVITY_TOGGLERS_COLUMN_KEY_PREFIX} ${index}`;
      let name = `N/A`;
      const drill = activity?.event_activity_drill;
      if (drill) {
        const drillName = drill?.name.toLowerCase();
        key = `${ACTIVITY_TOGGLERS_COLUMN_KEY_PREFIX} ${drillName} ${index}`;
        name = drill?.name || '';
      }

      return window.getFlag('planning-area-mui-data-grid')
        ? {
            key,
            name,
            field: key,
            headerName: name,
            renderCell: (arg: ActivityTogglerFormatterParam) =>
              activityTogglerFormatter({
                ...arg,
                apiRef,
                t,
                updateActivityAttendance,
              }),
            valueGetter: ({ colDef, row }) =>
              !!row.activities?.find(({ id }) => id === colDef.id)?.value,
            type: 'boolean',
            id: activity.id,
            users: activity.users,
            flex: 1,
            minWidth: 90,
            resizable: true,
          }
        : {
            key,
            name,
            formatter: (arg: ActivityTogglerFormatterParam) =>
              activityTogglerFormatter({ ...arg, t }),
            id: activity.id,
            users: activity.users,
            minWidth: 90,
            resizable: true,
          };
    })
  );

  if (!activities.length) {
    return headers.concat({
      key: 'EMPTY_STATE',
      name: t(
        'Drill-by-drill participation will appear here. Add drills in the Planning section.'
      ),
      id: -1,
    });
  }

  return headers;
};

export type ReorderEventsParams = {
  events: Array<Row>,
  oldIndex: number,
  newIndex: number,
};

export const reorderEvents = ({
  events,
  oldIndex,
  newIndex,
}: ReorderEventsParams) => {
  const reorderedEvents = [...events];
  const [movedEvent] = reorderedEvents.splice(oldIndex, 1);
  reorderedEvents.splice(newIndex, 0, movedEvent);

  reorderedEvents.forEach((event, index) => {
    // eslint-disable-next-line no-param-reassign
    event.order = index;
  });
  return reorderedEvents;
};
