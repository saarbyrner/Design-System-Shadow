// @flow
import { useEffect, useState } from 'react';
import { withNamespaces } from 'react-i18next';
import type { Event } from '@kitman/common/src/types/Event';
import type { StatusVariable } from '@kitman/common/src/types';
import type { Option } from '@kitman/components/src/Select';
import { AppStatus } from '@kitman/components';
import type { ParticipationLevel } from '@kitman/services/src/services/getParticipationLevels';
import {
  useIsMountedCheck,
  useDebouncedCallback,
} from '@kitman/common/src/hooks';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import performanceAndCoachingEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/performanceAndCoaching';

import type { I18nProps } from '@kitman/common/src/types/i18n';
import { AthletesTabHeaderTranslated as AthletesTabHeader } from './AthletesTabHeader';
import {
  AthleteFiltersTranslated as AthletesTabFilters,
  INITIAL_ATHLETE_FILTER,
} from '../AthleteFilters';
import { AddStatusSidePanelTranslated as AddStatusSidePanel } from '../GridComponents/AddStatusSidePanel';
import { ReorderColumnModalTranslated as ReorderColumnModal } from '../GridComponents/ReorderColumnModal';
import { AthletesTabGridTranslated as AthletesTabGrid } from './AthletesTabGrid';
import getEventAthletesGrid from '../../services/getEventAthletesGrid';
import saveGridReordering from '../../services/saveReordering';
import PlanningTab from '../PlanningTabLayout';

type Props = {
  event: Event,
  canEditEvent: boolean,
  canViewAvailabilities: boolean,
  statusVariables: Array<StatusVariable>,
  participationLevels: Array<ParticipationLevel>,
  participationLevelReasons: Array<Option>,
  saveColumn: Function,
  deleteColumn: Function,
  toastAction: Function,
};

const INITIAL_ATHLETE_GRID = {
  rows: [],
  columns: [],
  next_id: null,
};

const AthletesTab = (props: I18nProps<Props>) => {
  const checkIsMounted = useIsMountedCheck();
  const { trackEvent } = useEventTracking();

  const [athleteFilter, setAthleteFilter] = useState(INITIAL_ATHLETE_FILTER);
  const [athletesGrid, setAthletesGrid] = useState(INITIAL_ATHLETE_GRID);
  const [requestStatus, setRequestStatus] = useState('LOADING');
  const [isStatusSidePanelOpen, setIsStatusSidePanelOpen] = useState(false);
  const [isReorderColumnModalOpen, setIsReorderColumnModalOpen] =
    useState(false);

  const setFailedStatus = () => {
    if (!checkIsMounted()) return;
    setRequestStatus('FAILURE');
  };

  const getNextAthletes = (reset = false) => {
    if (!checkIsMounted()) return;

    setRequestStatus('LOADING');

    const nextId = reset ? null : athletesGrid.next_id;
    getEventAthletesGrid(props.event, nextId, athleteFilter).then(
      (data) => {
        if (!checkIsMounted()) return;

        const filteredColumns = [];

        if (
          !window.getFlag('planning-participation-reason') &&
          data?.columns?.length > 0 &&
          Array.isArray(data.columns)
        ) {
          filteredColumns.push(
            ...data.columns.filter(
              (column) =>
                column.row_key !== 'participation_level_reason' &&
                column.row_key !== 'related_issue' &&
                column.row_key !== 'related_issues' &&
                column.row_key !== 'free_note'
            )
          );
        }

        if (
          window.getFlag('planning-participation-reason') &&
          data?.columns?.length > 0 &&
          Array.isArray(data.columns)
        ) {
          filteredColumns.push(
            ...data.columns.filter(
              (column) =>
                column.row_key !== 'related_issue' &&
                column.row_key !== 'related_issues'
            )
          );
        }

        setAthletesGrid((prevAthletesGrid) => ({
          columns: [...filteredColumns],
          rows: reset ? data.rows : [...prevAthletesGrid.rows, ...data.rows],
          next_id: data.next_id,
        }));

        setRequestStatus('SUCCESS');
      },
      // () => setFailedStatus()
      () => true
    );
  };

  const resetGrid = () => getNextAthletes(true);

  const updateAthleteTabGridAttributes = (updatedRow, rowId) => {
    if (!checkIsMounted()) return;

    // when present athletes are filtered we want to make the row disappear
    // if the attribute by which its athlete is filtered by changes
    setAthletesGrid((prevAthletesGrid) => {
      let newRows;
      if (updatedRow) {
        newRows = prevAthletesGrid.rows.map((row) =>
          row.id === rowId ? updatedRow : row
        );
      } else {
        newRows = prevAthletesGrid.rows.filter((row) => row.id !== rowId);
      }
      return {
        ...prevAthletesGrid,
        rows: newRows,
      };
    });
  };

  useEffect(
    useDebouncedCallback(() => {
      if (!checkIsMounted()) return;
      setAthletesGrid({
        ...INITIAL_ATHLETE_GRID,
        columns: athletesGrid.columns,
      });
      resetGrid();
    }, 400),
    [athleteFilter, props.event]
  );

  return (
    <>
      <PlanningTab>
        <PlanningTab.TabHeader>
          <PlanningTab.TabTitle>{props.t('Participants')}</PlanningTab.TabTitle>
          <PlanningTab.TabActions>
            <AthletesTabHeader
              event={props.event}
              onSaveParticipantsSuccess={() => {
                if (!checkIsMounted()) return;
                setAthletesGrid({
                  ...INITIAL_ATHLETE_GRID,
                  columns: athletesGrid.columns,
                });
                getNextAthletes(true);
              }}
              onClickOpenReorderColumnModal={() => {
                if (!checkIsMounted()) return;
                setIsReorderColumnModalOpen(true);
              }}
              onClickAddStatus={() => {
                if (!checkIsMounted()) return;
                setIsStatusSidePanelOpen(true);
              }}
              canEditEvent={props.canEditEvent}
              toastAction={props.toastAction}
              refreshGrid={resetGrid}
            />
          </PlanningTab.TabActions>
        </PlanningTab.TabHeader>
        <PlanningTab.TabFilters>
          <AthletesTabFilters
            eventType={props.event.type}
            athleteFilter={athleteFilter}
            onFilterChange={(filter) => {
              if (!checkIsMounted()) return;
              setAthleteFilter(filter);
            }}
            canViewAvailabilities={props.canViewAvailabilities}
            participationLevels={props.participationLevels}
            showSquads
            showParticipationLevels
            showPositions
            showNoneParticipationLevels
          />
        </PlanningTab.TabFilters>
        <PlanningTab.TabContent>
          {athletesGrid && (
            <AthletesTabGrid
              event={props.event}
              athletesGrid={athletesGrid}
              fetchMoreData={getNextAthletes}
              isLoading={requestStatus === 'LOADING'}
              participationLevels={props.participationLevels.map(
                (participationLevel) => ({
                  value: participationLevel.id,
                  label: participationLevel.name,
                  canonical_participation_level:
                    participationLevel.canonical_participation_level,
                  include_in_group_calculations:
                    participationLevel.include_in_group_calculations,
                })
              )}
              participationLevelReasons={props.participationLevelReasons}
              onAttributesUpdate={(updatedRow, rowId) =>
                updateAthleteTabGridAttributes(updatedRow, rowId)
              }
              onAttributesBulkUpdate={(updatedAthletesGrid) => {
                if (!checkIsMounted()) return;
                if (!window.getFlag('planning-participation-reason')) {
                  const filteredColumns = updatedAthletesGrid.columns.filter(
                    (column) =>
                      column.row_key !== 'participation_level_reason' &&
                      column.row_key !== 'related_issue' &&
                      column.row_key !== 'related_issues' &&
                      column.row_key !== 'free_note'
                  );
                  const filteredUpdatedAthletesGrid = {
                    ...updatedAthletesGrid,
                    columns: filteredColumns,
                  };
                  setAthletesGrid(filteredUpdatedAthletesGrid);
                } else {
                  const filteredColumns = updatedAthletesGrid.columns.filter(
                    (column) =>
                      column.row_key !== 'related_issue' &&
                      column.row_key !== 'related_issues'
                  );
                  const filteredUpdatedAthletesGrid = {
                    ...updatedAthletesGrid,
                    columns: filteredColumns,
                  };
                  setAthletesGrid(filteredUpdatedAthletesGrid);
                }
              }}
              onClickDeleteColumn={(columnId) =>
                props.deleteColumn(
                  columnId,
                  'athletes_tab',
                  resetGrid,
                  setFailedStatus
                )
              }
              athleteFilter={athleteFilter}
              canEditEvent={props.canEditEvent}
              canViewAvailabilities={props.canViewAvailabilities}
            />
          )}
          <AddStatusSidePanel
            event={props.event}
            onSave={(item) => {
              props.saveColumn(
                item,
                'athletes_tab',
                resetGrid,
                setFailedStatus
              );
            }}
            onClose={() => {
              if (!checkIsMounted()) return;
              setIsStatusSidePanelOpen(false);
            }}
            statusVariables={props.statusVariables}
            isOpen={isStatusSidePanelOpen}
            columns={athletesGrid.columns}
            tab="#participants"
          />
          {isReorderColumnModalOpen && (
            <ReorderColumnModal
              columnItems={athletesGrid.columns.map((column) => {
                return { id: column.id ? column.id : null, name: column.name };
              })}
              isOpen={isReorderColumnModalOpen}
              onSave={(orderedItemIds) => {
                saveGridReordering(
                  props.event.id,
                  'default',
                  'athletes_tab',
                  orderedItemIds
                ).then(() => {
                  resetGrid();
                  trackEvent(
                    performanceAndCoachingEventNames.columnReorderedParticipantsTab
                  );
                }, setFailedStatus);
              }}
              setIsModalOpen={(isOpen) => {
                if (!checkIsMounted()) return;
                setIsReorderColumnModalOpen(isOpen);
              }}
            />
          )}
        </PlanningTab.TabContent>
      </PlanningTab>
      {requestStatus === 'FAILURE' && <AppStatus status="error" />}
    </>
  );
};

export const AthletesTabTranslated = withNamespaces()(AthletesTab);
export default AthletesTab;
