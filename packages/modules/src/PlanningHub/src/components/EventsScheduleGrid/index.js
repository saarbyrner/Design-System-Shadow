// @flow
import { useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import type { ComponentType } from 'react';

import { AppStatus } from '@kitman/components';
import { type I18nProps } from '@kitman/common/src/types/i18n';
import { DataGrid } from '@kitman/playbook/components';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';
import type { EventFilters as EventFiltersType } from '@kitman/modules/src/PlanningHub/types';
import type { Event } from '@kitman/common/src/types/Event';
import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';

import { useSeamlessInfiniteScroll } from '@kitman/common/src/hooks/useSeamlessInfiniteScroll';
import useGridConfig from './hooks/useGridConfig';

type Props = {
  eventFilters: EventFiltersType,
  reload?: boolean,
  onClickEditEvent?: (event: Event) => void,
  setLastUpdatedAt?: (timestamp: number | null) => void,
};

const EventsScheduleGrid = ({
  eventFilters,
  t,
  reload,
  onClickEditEvent,
  setLastUpdatedAt,
}: I18nProps<Props>) => {
  const locationAssign = useLocationAssign();
  const { preferences } = usePreferences();

  const handleOnRowClick = (event: Event) => {
    locationAssign(`/planning_hub/events/${event.id}`);
  };

  const {
    columns,
    rows,
    dataGridCustomStyle,
    muiDataGridProps,
    isError,
    isFetching,
    nextId,
    refetchFixtures,
    getNextFixtures,
    lastUpdatedAt,
  } = useGridConfig({
    filters: eventFilters,
    configSettings: {
      useMatchDayGrid: true,
      canManageLeagueGames: !!preferences?.manage_league_game,
      eventRefreshInterval: preferences?.schedule_page_refresh_interval_seconds,
    },
    onClickEditEvent,
  });

  useEffect(() => {
    if (reload) {
      refetchFixtures();
    }
  }, [refetchFixtures, reload]);

  useEffect(() => {
    setLastUpdatedAt?.(lastUpdatedAt);
  }, [setLastUpdatedAt, lastUpdatedAt]);

  const { watchRef } = useSeamlessInfiniteScroll({
    enabled: !!nextId,
    onEndReached: () => {
      getNextFixtures();
    },
  });

  return (
    <div style={{ width: '100%' }}>
      <DataGrid
        {...muiDataGridProps}
        columns={columns}
        rows={rows}
        loading={isFetching}
        noRowsMessage={t('No events scheduled')}
        sx={dataGridCustomStyle}
        onRowClick={handleOnRowClick}
      />
      {isError && <AppStatus status="error" />}
      <div ref={watchRef} />
    </div>
  );
};

export const EventsScheduleGridTranslated: ComponentType<Props> =
  withNamespaces()(EventsScheduleGrid);
export default EventsScheduleGrid;
