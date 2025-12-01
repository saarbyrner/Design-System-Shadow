// @flow
import { type Element } from 'react';

import {
  UserAvatar,
  TextLink,
  Checkbox,
  ToggleSwitch,
  Select,
} from '@kitman/components';
import getAthleteIssues from '@kitman/services/src/services/medical/getAthleteIssues';
import { getIssueTitle } from '@kitman/modules/src/Medical/shared/utils';
import { fitContentMenuCustomStyles } from '@kitman/components/src/Select';
import getAthleteAvailabilityStyles from '@kitman/common/src/utils/getAthleteAvailabilityStyles';
import {
  type EventActivityGlobalState,
  eventActivityGlobalStates,
} from '@kitman/modules/src/PlanningEvent/src/types/common';
import {
  type GetAthleteEventsSortingOptions,
  type GetAthleteEventsFilters,
  getAthleteEventsSortingOptions,
  updateEventAttributes,
} from '@kitman/services/src/services/planning';
import { type ParticipationLevel } from '@kitman/services/src/services/getParticipationLevels';
import { type PlanningDispatch } from '@kitman/modules/src/PlanningEvent/src/hooks/usePlanningReducer';
import {
  type EventActivityV2,
  type EventActivityAthleteV2,
} from '@kitman/common/src/types/Event';
import { type Translation } from '@kitman/common/src/types/i18n';
import { type GridApiCommon, type GridColDef } from '@mui/x-data-grid-pro';
import { type HeaderData } from '@kitman/components/src/ReactDataGrid';
import { type ColumnRowData } from '@kitman/modules/src/Medical/shared/types';
import { getAthleteEvents as getAthleteEventsPaginated } from '@kitman/services/src/services/planning/getAthleteEvents';
import { type SetState } from '@kitman/common/src/types/react';
import { type RequestStatus } from '@kitman/common/src/types';

import type { Row } from './index';
import style, {
  athleteFormatterClassName,
  participationFormatterClassName,
} from './style';

export type SelectionHeader = {
  ...HeaderData,
  id?: number,
  athletes?: Array<EventActivityAthleteV2>,
};

export type SelectionHeadersSummary = {
  [string]: EventActivityGlobalState,
};
export type CombinedParticipationLevels = {
  id: number | string,
  asyncOptions?: boolean,
  label: string,
  name: string,
  level_id?: number,
  participation_level_reason: ?{
    id: number,
    label: string,
  },
  value: number | string,
};

export type JerseyNumberOption = { label: number | string, value: ?number };
export const getJerseyNumberOptions = (
  maxNumber: number
): Array<JerseyNumberOption> => {
  const options: Array<JerseyNumberOption> = Array.from<JerseyNumberOption>(
    { length: maxNumber + 1 },
    (_, index) => ({
      label: index,
      value: index,
    })
  );

  options.unshift(
    {
      label: '--',
      value: null,
    },
    {
      label: '00',
      value: -1,
    }
  );

  return options;
};

export const getSortingOptionLabel = (
  option: GetAthleteEventsSortingOptions,
  t: Translation
): string => {
  const optionLabel = {
    [getAthleteEventsSortingOptions.Position]: t('position'),
    [getAthleteEventsSortingOptions.ParticipationLevel]: `${t(
      'participation level'
    )} ↓`,
    [getAthleteEventsSortingOptions.ParticipationLevelInverted]: `${t(
      'participation level'
    )} ↑`,
    [getAthleteEventsSortingOptions.PrimarySquad]: t('primary squad'),
    [getAthleteEventsSortingOptions.AvailabilityStatus]: t(
      'availability status'
    ),
  }[option];

  return `${t('Group by')} ${optionLabel}`;
};

export const getActivityDrillKey = (drillName: string, index: number): string =>
  `${drillName.toLowerCase().split(' ').join('_')}_${index}`;

const loadedSubMenuData = {};

export const updateSelectionHeaders = (
  updatedHeaders: Array<EventActivityGlobalState>,
  eventSessionActivities: Array<EventActivityV2>,
  setSelectionHeadersSummaryState: Function
) => {
  const summaryRow = {};
  // When the user updates on single toggle the BE sends the response for that
  // rows summary alone however if a user does a bulk update it send each rows
  // summary state
  if (updatedHeaders.length > 1) {
    // updating every summary state
    const activitiesStates = updatedHeaders.reduce((states, state) => {
      /* eslint-disable-next-line no-param-reassign */
      states[state.eventActivityId] = state;
      return states;
    }, {});

    eventSessionActivities.forEach(
      ({ event_activity_drill: eventActivityDrill, id }, index) => {
        const key = eventActivityDrill
          ? getActivityDrillKey(eventActivityDrill.name, index)
          : `na_${index}`;
        summaryRow[key] = activitiesStates[id];
      }
    );
    setSelectionHeadersSummaryState([summaryRow]);
  } else {
    // updating individual summary state
    const eventActivityChangedIndex = eventSessionActivities.findIndex(
      ({ id }) => id === updatedHeaders[0].eventActivityId
    );
    let headerKey = `na_${eventActivityChangedIndex}`;
    const drill =
      eventSessionActivities[eventActivityChangedIndex]?.event_activity_drill;

    if (drill) {
      headerKey = getActivityDrillKey(drill?.name, eventActivityChangedIndex);
    }
    setSelectionHeadersSummaryState((prev) => {
      if (prev && !prev.length) {
        return [
          {
            [headerKey]: updatedHeaders[0],
          },
        ];
      }
      if (prev) {
        const newState = prev.slice();
        newState[0][headerKey] = updatedHeaders[0];
        return newState;
      }
      return [];
    });
  }
};

export const athleteFormatter = ({ row }: { row: ColumnRowData }) => {
  const athleteData = row.athlete;
  if (athleteData == null) {
    return '-';
  }
  return (
    <div
      data-testid="athleteFormatter"
      className={athleteFormatterClassName}
      css={style.athleteCell}
    >
      <div css={style.imageContainer}>
        <UserAvatar
          url={athleteData.avatar_url}
          firstname={athleteData.firstname}
          lastname={athleteData.lastname}
          displayInitialsAsFallback={false}
          size="EXTRA_SMALL"
          availability={athleteData.availability ?? null}
          statusDotMargin={-1}
        />
      </div>
      <div css={style.detailsContainer}>
        <TextLink
          text={athleteData.fullname}
          href={`/medical/athletes/${athleteData.id}`}
        />

        <span css={style.position}>
          {typeof athleteData.position === 'object'
            ? athleteData.position.name
            : athleteData.position}
        </span>
      </div>
    </div>
  );
};

export const BULK_ACTIVITY_TOGGLERS_COLUMN_KEY = 'bulk activity togglers';

export const bulkEventAttendanceSummaryFormatterMUI = ({
  colDef: { id: columnId },
  bulkUpdateEventActivityAttendance,
  headerKey,
  label,
  selectionHeadersSummaryState,
  disableActions,
}: {
  colDef: GridColDef,
  bulkUpdateEventActivityAttendance: (
    colId: number,
    newChecked: boolean
  ) => void,
  headerKey: string,
  label: ?string,
  selectionHeadersSummaryState: Array<{ [string]: Object }>,
  disableActions: boolean,
}) => {
  const { state, count, totalCount } =
    (selectionHeadersSummaryState.length &&
      selectionHeadersSummaryState[0][headerKey]) ||
    {};

  return (
    <div css={style.bulkActivityTogglerVerticalFormatter}>
      <div css={style.bulkActivityTogglerAndLabelVerticalMui}>
        <Checkbox.New
          id="checkBox_id"
          checked={state === eventActivityGlobalStates.AllIn}
          indeterminate={state === eventActivityGlobalStates.Indeterminate}
          onClick={() => {
            const newChecked = state !== eventActivityGlobalStates.AllIn;
            bulkUpdateEventActivityAttendance(columnId, newChecked);
          }}
          disabled={disableActions}
        />
        {label && <div>{label}</div>}
      </div>
      <div>
        {count} / {totalCount}
      </div>
    </div>
  );
};

export const bulkEventAttendanceSummaryFormatter = ({
  bulkUpdateEventActivityAttendance,
  column,
  headerKey,
  label,
  row,
  disableActions,
}: {
  bulkUpdateEventActivityAttendance: (
    colId: number,
    newChecked: boolean
  ) => void,
  column: any,
  headerKey: string,
  label: ?string,
  row: Row,
  disableActions: boolean,
}): void | Element<any> => {
  const cellData = row[headerKey];

  if (!cellData) return <></>;

  return (
    <div css={style.bulkActivityTogglerVerticalFormatter}>
      <div css={style.bulkActivityTogglerAndLabelVertical}>
        <Checkbox.New
          id="checkBox_id"
          checked={cellData.state === eventActivityGlobalStates.AllIn}
          indeterminate={
            cellData.state === eventActivityGlobalStates.Indeterminate
          }
          onClick={() => {
            const newChecked =
              cellData.state !== eventActivityGlobalStates.AllIn;
            bulkUpdateEventActivityAttendance(column.id, newChecked);
          }}
          disabled={disableActions}
        />
        {label && <div>{label}</div>}
      </div>
      <div>
        {cellData.count} / {cellData.totalCount}
      </div>
    </div>
  );
};

export const bulkActivityTogglerFormatter = (
  row: Row,
  onRowChange: (Row) => void,
  allEventActivityIds: Array<number>,
  disableActions: boolean,
  apiRef?: GridApiCommon,
  updateActivityAttendance?: (
    newEventActivityIds: Array<number>,
    athleteId: number,
    value: boolean
  ) => void,
  updateGroupCalculations?: (
    rowId: number,
    athleteId: number,
    newValue: boolean
  ) => void
) => (
  <div css={style.bulkActivityTogglerFormatter}>
    <Checkbox.New
      id="checkBox_id"
      checked={
        allEventActivityIds?.every((id) =>
          row.event_activity_ids?.includes(id)
        ) && row.include_in_group_calculations
      }
      indeterminate={
        allEventActivityIds.some((id) =>
          row.event_activity_ids?.includes(id)
        ) || row.include_in_group_calculations
      }
      onClick={() => {
        if (window.getFlag('planning-area-mui-data-grid')) {
          const {
            athlete: { id: athleteId },
          } = row;
          const newValue = !(
            allEventActivityIds.length === row.event_activity_ids?.length &&
            row.include_in_group_calculations
          );

          apiRef?.current.updateRows([
            {
              id: row.id,
              event_activity_ids: newValue ? allEventActivityIds : [],
            },
          ]);
          if (updateActivityAttendance && updateGroupCalculations) {
            // todo: switch to MUI and this wont be optional
            updateGroupCalculations(row.id, athleteId, newValue);
            updateActivityAttendance(allEventActivityIds, athleteId, newValue);
          }
        } else {
          onRowChange({ ...row });
        }
      }}
      disabled={disableActions}
    />
  </div>
);

export const ACTIVITY_TOGGLERS_COLUMN_KEY_PREFIX = 'activity togglers';

type ActivityTogglerFormatterParam = {
  row: Row,
  column: SelectionHeader,
  colDef: GridColDef,
  apiRef: GridApiCommon,
  updateActivityAttendance: (
    allEventsIds: Array<number>,
    athleteId: number,
    value: boolean
  ) => {},
  onRowChange: (Row) => void,
  t: Translation,
  disableActions: boolean,
};

type ActivityHeaderSummary = {
  row: Row,
  column: SelectionHeader,
};

export const activityTogglerFormatter = ({
  row,
  column,
  onRowChange,
  colDef,
  apiRef,
  updateActivityAttendance,
  t,
  disableActions,
}: ActivityTogglerFormatterParam) => {
  const isIn = window.getFlag('planning-area-mui-data-grid')
    ? !!row.event_activity_ids?.find((activity) => activity === colDef.id)
    : row.event_activity_ids?.includes(column.id);
  return (
    <div css={style.activityTogglerWrapper}>
      <ToggleSwitch
        kitmanDesignSystem
        isSwitchedOn={isIn}
        toggle={() => {
          if (window.getFlag('planning-area-mui-data-grid')) {
            const rowActivities = row.event_activity_ids?.slice() ?? [];
            const updateIndex = rowActivities.findIndex(
              (rowId) => rowId === colDef.id
            );
            let value = false;
            if (updateIndex === -1) {
              rowActivities.push(colDef.id);
              value = true;
            } else {
              rowActivities.splice(updateIndex, 1);
            }
            apiRef.current.updateRows([
              {
                id: row.id,
                event_activity_ids: rowActivities,
              },
            ]);
            updateActivityAttendance([colDef.id], row.athlete.id, value);
          } else {
            onRowChange({ ...row });
          }
        }}
        isDisabled={disableActions}
      />
      <span css={style.activityTogglerLabel}>{isIn ? t('In') : t('Out')}</span>
    </div>
  );
};

export const GROUP_CALCULATIONS_TOGGLERS_COLUMN_KEY = 'group calculations';

type GroupCalculationTogglerFormatterParam = {
  row: Row,
  apiRef: GridApiCommon,
  onRowChange: (Row) => void,
  t: Translation,
  disableActions: boolean,
  updateGroupCalculations: (
    rowId: number,
    athleteId: number,
    newValue: boolean
  ) => void,
};

export const groupCalculationsTogglerFormatter = ({
  row,
  apiRef,
  onRowChange,
  t,
  disableActions,
  updateGroupCalculations,
}: GroupCalculationTogglerFormatterParam) => {
  const isIn = row.include_in_group_calculations;
  return (
    <div css={style.groupCalculationsTogglerWrapper}>
      <ToggleSwitch
        kitmanDesignSystem
        isSwitchedOn={isIn}
        toggle={() => {
          if (window.getFlag('planning-area-mui-data-grid')) {
            const {
              id: rowId,
              athlete: { id: athleteId },
            } = row;
            const newValue = !isIn;

            apiRef?.current.updateRows([
              {
                id: row.id,
                include_in_group_calculations: newValue,
              },
            ]);

            updateGroupCalculations(rowId, athleteId, newValue);
          } else {
            onRowChange({ ...row });
          }
        }}
        isDisabled={disableActions}
      />
      <span css={style.groupCalculationsTogglerLabel}>
        {isIn ? t('In') : t('Out')}
      </span>
    </div>
  );
};

export const statusFormatter = (row: Row, t: Translation) => {
  const availability = row.athlete.availability;
  if (!availability) {
    return (
      <div css={style.statusWrapper}>
        <span css={style.status}>{t('No status')}</span>
      </div>
    );
  }
  const { color, backgroundColor } = getAthleteAvailabilityStyles(availability);
  return (
    <div css={style.statusWrapper}>
      <span css={style.status} style={{ backgroundColor }}>
        {availability}
      </span>
      <span
        css={[
          style.statusIcon,
          window.getFlag('planning-area-mui-data-grid') && style.statusIconMui,
        ]}
        style={{ backgroundColor: color }}
      />
    </div>
  );
};

const mapIssuesToSelect = (
  issues,
  parentSelectId,
  participationLevel,
  participationLevelReason
) => [
  ...issues.open_issues?.map(
    ({
      id,
      issue,
      full_pathology: fullPathology,
      issue_occurrence_title: title,
      issue_type: type,
      occurrence_date: occurrenceDate,
    }) => ({
      name: participationLevel.name,
      value: issue && `${id}_${participationLevel.id}`,
      label: getIssueTitle(
        {
          full_pathology: fullPathology,
          issue_occurrence_title: title,
          occurrence_date: occurrenceDate,
        },
        false
      ),
      issue_type: type,
      issue_id: id,
      id: parentSelectId,
      participationLevel,
      participation_level_reason: participationLevelReason,
    })
  ),
  ...issues.closed_issues?.map(
    ({
      id,
      issue,
      full_pathology: fullPathology,
      issue_occurrence_title: title,
      issue_type: type,
      occurrence_date: occurrenceDate,
    }) => ({
      name: participationLevel.name,
      value: issue && `${id}_${participationLevel.id}`,
      label: getIssueTitle(
        {
          full_pathology: fullPathology,
          issue_occurrence_title: title,
          occurrence_date: occurrenceDate,
        },
        false
      ),
      issue_type: type,
      issue_id: id,
      id: parentSelectId,
      participationLevel,
      participation_level_reason: participationLevelReason,
    })
  ),
];

export const PARTICIPATION_SELECTORS_COLUMN_KEY = 'participation';

export const participationFormatter = (
  {
    row,
    onRowChange,
  }: {
    row: Row,
    onRowChange: (Row) => void,
  },
  participationLevelsCombinedWithReasons: Array<CombinedParticipationLevels>,
  apiRef: GridApiCommon, // todo: better type
  disableActions: boolean,
  updateActivityParticipation: Function
) => {
  const combinedSelectVals = participationLevelsCombinedWithReasons.map(
    (selectOption) => {
      const asyncCall = selectOption.asyncOptions
        ? {
            loadAsyncOptions: {
              fetchOptions: () => {
                if (loadedSubMenuData[row.athlete.id]) {
                  return loadedSubMenuData[row.athlete.id];
                }

                const athleteIssues = getAthleteIssues({
                  athleteId: row.athlete.id,
                  grouped: true,
                  includeIssue: true,
                });
                loadedSubMenuData[row.athlete.id] = athleteIssues;
                return athleteIssues;
              },
              mapping: {
                callback: (issues) =>
                  mapIssuesToSelect(
                    issues,
                    selectOption.id,
                    selectOption,
                    selectOption.participation_level_reason
                  ),
              },
            },
          }
        : {};

      return {
        ...selectOption,
        ...asyncCall,
      };
    }
  );
  let label = row.participation_level.name;
  let currentValue =
    typeof row.participation_level.id === 'number'
      ? row.participation_level.id
      : row.participation_level.participation_level_id;

  // todo: refactor (currently we mix the participation_level.id with the
  // participation_level_reason.id i.e 3652_1) when we load data from BE we
  // need to create the combination when selected it is already generated)
  const parentIdValue =
    typeof row.participation_level.id === 'number'
      ? `${row.participation_level.id}_${
          row.participation_level_reason?.id || ''
        }`
      : row.participation_level.id;
  let parentId = null;
  if (row.participation_level_reason && row.related_issue) {
    label = row.related_issue.full_pathology;
    parentId = parentIdValue;

    currentValue = `${row.related_issue.id}_${parentId}`;
  } else if (row.participation_level_reason) {
    label = null;
    parentId = parentIdValue;
    currentValue = parentIdValue;
  }

  return (
    <div
      className={participationFormatterClassName}
      data-testid="participationFormatter"
    >
      <Select
        value={[
          {
            value: currentValue,
            label,
            parentId,
          },
        ]}
        options={combinedSelectVals}
        onChange={(value) => {
          const participationLevel = value[0]?.participationLevel || value[0];
          if (window.getFlag('planning-area-mui-data-grid')) {
            const {
              participation_level: {
                canonical_participation_level:
                  previousParticipationCanonicalLevel,
              },
            } = row;

            let newRow = { ...row };
            newRow = {
              ...newRow,
              participation_level:
                participationLevel || row.participation_level,
              participation_level_reason: value[0]?.participation_level_reason,
              related_issue: value[0]?.issue_id
                ? {
                    id: value[0].issue_id,
                    issue_type: value[0].issue_type,
                    full_pathology: value[0].label,
                  }
                : null,
            };

            apiRef.current.updateRows([
              {
                id: row.id,
                ...newRow,
              },
            ]);
            return updateActivityParticipation(
              newRow,
              previousParticipationCanonicalLevel
            );
          }
          return onRowChange({
            ...row,
            participation_level: participationLevel || row.participation_level,
            participation_level_reason: value[0]?.participation_level_reason,
            related_issue: value[0]?.issue_id
              ? {
                  id: value[0].issue_id,
                  issue_type: value[0].issue_type,
                  full_pathology: value[0].label,
                }
              : null,
          });
        }}
        customSelectStyles={{
          input: (styles) => ({
            ...styles,
            display: 'inline-flex',
          }),
          ...fitContentMenuCustomStyles,
        }}
        isDisabled={disableActions}
        tabIndex="-1"
        returnParentInValueFromSubMenu
        hideCounter
        appendToBody
        multiSelectSubMenu
        groupBy="submenu"
        asyncSubmenu
      />
    </div>
  );
};

export const getSelectionHeaders = ({
  activities,
  allEventActivityIds,
  disableActions,
  bulkUpdateEventActivityAttendance,
  bulkUpdateEventParticipationLevel,
  participationLevels,
  apiRef,
  updateActivityAttendance,
  updateActivityParticipation,
  updateGroupCalculations,
  participationLevelsWithReasons,
  selectionHeadersSummaryState,
  t,
}: {
  activities: Array<EventActivityV2>,
  allEventActivityIds: Array<number>,
  disableActions: boolean,
  bulkUpdateEventActivityAttendance: Function,
  bulkUpdateEventParticipationLevel: Function,
  participationLevels: Array<ParticipationLevel>,
  apiRef: GridApiCommon,
  updateActivityAttendance: Function,
  updateActivityParticipation: Function,
  updateGroupCalculations: (
    rowId: number,
    athleteId: number,
    newValue: boolean
  ) => void,
  participationLevelsWithReasons: Array<CombinedParticipationLevels>,
  selectionHeadersSummaryState: Array<SelectionHeadersSummary>,
  t: Translation,
}): Array<SelectionHeader> => {
  const planningSelectionsHeader = window.getFlag('planning-area-mui-data-grid')
    ? [
        {
          key: BULK_ACTIVITY_TOGGLERS_COLUMN_KEY,
          name: '',
          renderCell: ({
            row,
            onRowChange,
          }: {
            row: Row,
            onRowChange: Function,
          }) =>
            bulkActivityTogglerFormatter(
              row,
              onRowChange,
              allEventActivityIds,
              disableActions,
              apiRef,
              updateActivityAttendance,
              updateGroupCalculations
            ),
          frozen: true,
          sortable: false, // todo: not yet available with BE
          width: 45,
          minWidth: 45,
          maxWidth: 45,
        },
        {
          key: 'athlete',
          name: '',
          field: 'athlete',
          headerName: t('Athlete'),
          frozen: true,
          resizable: true,
          width: 200,
          renderCell: athleteFormatter,
          sortable: false, // todo: not yet available with BE
        },
        {
          key: 'status',
          name: '',
          field: 'status',
          headerName: t('Status'),
          resizable: true,
          renderCell: ({ row }: { row: Row }) => statusFormatter(row, t),
          summaryFormatter: () => t('Status'),
          width: 130,
          sortable: false, // todo: not yet available with BE
        },
        {
          key: PARTICIPATION_SELECTORS_COLUMN_KEY,
          name: '',
          field: PARTICIPATION_SELECTORS_COLUMN_KEY,
          headerName: t('Participation'),
          width: 160,
          minWidth: 160,
          resizable: true,
          sortable: false, // todo: not yet available with BE
          renderCell: (props) =>
            participationFormatter(
              { ...props },
              participationLevelsWithReasons,
              apiRef,
              disableActions,
              updateActivityParticipation
            ),
          renderHeader: () => (
            <div
              className={participationFormatterClassName}
              data-testid="participationFormatterHeader"
            >
              <Select
                customSelectStyles={fitContentMenuCustomStyles}
                options={participationLevels.map(({ name, id }) => ({
                  label: name,
                  value: id,
                }))}
                placeholder={t('Participation')}
                onChange={(value) => {
                  bulkUpdateEventParticipationLevel(value);
                }}
                appendToBody
                isDisabled={disableActions}
              />
            </div>
          ),
        },
        {
          key: GROUP_CALCULATIONS_TOGGLERS_COLUMN_KEY,
          field: GROUP_CALCULATIONS_TOGGLERS_COLUMN_KEY,
          name: '',
          headerName: t('Group calcs'),
          frozen: true,
          resizable: true,
          width: 200,
          renderCell: (arg: GroupCalculationTogglerFormatterParam) =>
            groupCalculationsTogglerFormatter({
              ...arg,
              apiRef,
              t,
              disableActions,
              updateGroupCalculations,
            }),
          sortable: false, // todo: not yet available with BE
        },
      ]
    : [
        {
          key: BULK_ACTIVITY_TOGGLERS_COLUMN_KEY,
          name: '',
          formatter: ({
            row,
            onRowChange,
          }: {
            row: Row,
            onRowChange: Function,
          }) =>
            bulkActivityTogglerFormatter(
              row,
              onRowChange,
              allEventActivityIds,
              disableActions
            ),
          frozen: true,
          width: 45,
          minWidth: 45,
          maxWidth: 45,
        },
        {
          key: 'athlete',
          name: '',
          frozen: true,
          resizable: true,
          width: 200,
          summaryFormatter: () => t('Athlete/Position'),
          formatter: athleteFormatter,
        },
        {
          key: 'status',
          name: '',
          resizable: true,
          summaryFormatter: () => t('Status'),
          formatter: ({ row }: { row: Row }) => statusFormatter(row, t),
          width: 130,
        },
        {
          key: PARTICIPATION_SELECTORS_COLUMN_KEY,
          name: '',
          width: 200,
          resizable: true,
          summaryFormatter: () => (
            <Select
              customSelectStyles={fitContentMenuCustomStyles}
              options={participationLevels.map((pl) => ({
                label: pl.name,
                value: pl.id,
              }))}
              placeholder={t('Participation')}
              onChange={(value) => {
                bulkUpdateEventParticipationLevel(value);
              }}
              appendToBody
              isDisabled={disableActions}
            />
          ),
          formatter: (props) =>
            participationFormatter(
              { ...props },
              participationLevelsWithReasons,
              apiRef,
              disableActions
            ),
        },
        {
          key: GROUP_CALCULATIONS_TOGGLERS_COLUMN_KEY,
          name: '',
          summaryFormatter: () => t('Group calcs'),
          resizable: true,
          minWidth: 100,
          maxWidth: 150,
          width: 100,
          formatter: (arg: GroupCalculationTogglerFormatterParam) =>
            groupCalculationsTogglerFormatter({ ...arg, t, disableActions }),
        },
      ];

  const headers = planningSelectionsHeader.concat(
    activities.map((activity, index) => {
      let key = `${ACTIVITY_TOGGLERS_COLUMN_KEY_PREFIX}na_${index}`;
      let headerKey = `na_${index}`;
      let name = `N/A`;
      const drill = activity?.event_activity_drill;
      if (drill) {
        const nameInSnakeCase = drill?.name.toLowerCase().split(' ').join('_');
        key = `${ACTIVITY_TOGGLERS_COLUMN_KEY_PREFIX}${nameInSnakeCase}_${index}`;
        headerKey = `${nameInSnakeCase}_${index}`;
        name = drill?.name || t('No drill name used');
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
              !!row.event_activity_ids.find((id) => id === colDef.id),
            renderHeader: (arg) =>
              bulkEventAttendanceSummaryFormatterMUI({
                ...arg,
                bulkUpdateEventActivityAttendance,
                headerKey,
                label: activity.order_label ?? +index + 1,
                selectionHeadersSummaryState,
                disableActions,
              }),
            type: 'boolean',
            id: activity.id,
            athletes: activity.athletes,
            flex: 1,
            minWidth: 90,
            resizable: true,
            sortable: false, // todo: not yet available
          }
        : {
            key,
            name,
            summaryFormatter: (arg: ActivityHeaderSummary) =>
              bulkEventAttendanceSummaryFormatter({
                ...arg,
                bulkUpdateEventActivityAttendance,
                headerKey,
                label: activity.order_label ?? `${index + 1}`,
                t,
                disableActions,
              }),
            formatter: (arg: ActivityTogglerFormatterParam) =>
              activityTogglerFormatter({ ...arg, t, disableActions }),
            id: activity.id,
            athletes: activity.athletes,
            minWidth: 90,
            resizable: true,
          };
    })
  );

  if (!activities.length) {
    return headers.concat({
      key: 'EMPTY_STATE',
      name: '',
      summaryFormatter: () =>
        t(
          'Drill-by-drill participation will appear here. Add drills in the Planning section.'
        ),
      id: -1,
    });
  }

  return headers;
};

export const handleSingularUpdateEventParticipationLevel = async ({
  eventId,
  row,
  previousParticipationCanonicalLevel,
  allEventActivityIds,
  dispatch,
  fetchEventActivityStates,
}: {
  eventId: number,
  row: Row,
  previousParticipationCanonicalLevel: string,
  allEventActivityIds: Array<number>,
  dispatch: PlanningDispatch,
  fetchEventActivityStates: Function,
}) => {
  await updateEventAttributes({
    eventId,
    attributes: {
      related_issue_id: row.related_issue?.id || null,
      related_issue_type: row.related_issue?.issue_type || null,
      participation_level:
        row.participation_level?.participation_level_id ||
        row.participation_level?.id,
      participation_level_reason: row.participation_level_reason?.id || null,
    },
    athleteId: row.athlete.id,
    filters: {
      athlete_name: '',
      availabilities: [],
      participation_levels: [],
      positions: [],
      squads: [],
    },
    tab: 'athletes_tab',
  });

  const currentParticipationCanonicalLevel =
    row.participation_level.canonical_participation_level;
  let newGroupCalc = row.include_in_group_calculations;
  let newActivityIds = row.event_activity_ids || [];

  // if moving from 'none' to any other level turn each activity attendance on
  // or if moving from any level to 'none' turn each activity attendance/group calculation off
  const participationLevelChangingToNone =
    previousParticipationCanonicalLevel !== 'none' &&
    currentParticipationCanonicalLevel === 'none';

  const participationLevelChangingFromNone =
    previousParticipationCanonicalLevel === 'none' &&
    currentParticipationCanonicalLevel !== 'none';

  if (participationLevelChangingFromNone) {
    newActivityIds = allEventActivityIds.slice();
  }
  if (participationLevelChangingToNone) {
    newActivityIds = [];
    newGroupCalc = true;
  }

  if (participationLevelChangingToNone) {
    newActivityIds = [];
    newGroupCalc = false;
  }

  dispatch({
    type: 'SET_ATHLETES_PARTICIPATION',
    athleteId: row.athlete.id,
    includeInGroupCalc: newGroupCalc,
    newActivityIds,
    newRow: row,
  });
  fetchEventActivityStates();
};

export const handleBulkUpdateEventParticipationLevel = async ({
  selectedParticipationLevel,
  eventId,
  setRequestStatusTableAction,
  dispatch,
  fetchEventActivityStates,
  filters,
  sortBy,
}: {
  selectedParticipationLevel: number,
  eventId: number,
  setRequestStatusTableAction: SetState<RequestStatus>,
  dispatch: PlanningDispatch,
  allEventActivityIds: Array<number>,
  allParticipationLevels: Array<ParticipationLevel>,
  fetchEventActivityStates: () => void,
  filters: GetAthleteEventsFilters,
  sortBy: GetAthleteEventsSortingOptions,
}) => {
  setRequestStatusTableAction('PENDING');
  try {
    await updateEventAttributes({
      eventId,
      attributes: {
        participation_level: selectedParticipationLevel,
        related_issue: null,
        participation_level_reason: null,
      },
      filters,
      tab: 'athletes_tab',
      disableGrid: true,
    });

    // $FlowIgnore[incompatible-call] athleteEvents is not a Promise
    const { athlete_events: athleteEvents } = await getAthleteEventsPaginated({
      eventId,
      nextId: null,
      includeEventActivityIds: true,
      filters,
      sortBy,
    });

    dispatch({
      type: 'SET_ATHLETE_EVENTS',
      athletes: athleteEvents,
    });
    fetchEventActivityStates();
    setRequestStatusTableAction('SUCCESS');
  } catch (error) {
    setRequestStatusTableAction('FAILURE');
  }
};
