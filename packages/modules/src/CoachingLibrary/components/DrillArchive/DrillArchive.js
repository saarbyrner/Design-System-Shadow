// @flow
import { useEffect, useState, useRef } from 'react';
import { withNamespaces } from 'react-i18next';
import _isEqual from 'lodash/isEqual';

import {
  useDebouncedCallback,
  useBrowserTabTitle,
} from '@kitman/common/src/hooks';
import useHistoryGo from '@kitman/common/src/hooks/useHistoryGo';
import { errors } from '@kitman/common/src/variables';
import { fitContentMenuCustomStyles } from '@kitman/components/src/Select';
import {
  ReactDataGrid,
  SearchBar,
  Select,
  Link,
  ActivityDrillPanelTranslated as ActivityDrillPanel,
} from '@kitman/components';
import { defaultMapToOptions } from '@kitman/components/src/Select/utils';
import {
  searchDrills,
  searchPrinciples,
  getActivityTypes,
  getStaffOnly,
  unarchiveLibraryDrill,
  type EventActivityFilterParams,
  type ActivityType,
  type EventActivityDrillsType,
} from '@kitman/services/src/services/planning';
import { type RequestStatus } from '@kitman/modules/src/PlanningEvent/types';
import {
  type EventsUser,
  type EventActivityDrillV2,
} from '@kitman/common/src/types/Event';
import { type Principle } from '@kitman/common/src/types/Principles';
import { type Squad } from '@kitman/services/src/services/getSquads';
import { type I18nProps } from '@kitman/common/src/types/i18n';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';

import style from './style';
import getTableHeaderData, { type Row } from './utils';

type Props = {
  onOpenArchive: () => void,
};

export default withNamespaces()((props: I18nProps<Props>) => {
  useBrowserTabTitle(props.t('Drill archive'));
  const { trackEvent } = useEventTracking();

  const historyGo = useHistoryGo();

  const isMounted = useRef<boolean>(false);
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('LOADING');
  const { preferences } = usePreferences();

  const [filters, setFilters] = useState<EventActivityFilterParams>({
    search_expression: '',
    event_activity_type_ids: [],
    user_ids: [],
    principle_ids: [],
    squad_ids: [],
    archived: true,
  });
  const [drills, setDrills] = useState<Array<Row>>([]);
  const [nextId, setNextId] = useState<number | null>(null);
  const [types, setTypes] = useState<Array<ActivityType>>([]);
  const [staff, setStaff] = useState<Array<EventsUser>>([]);
  const [principles, setPrinciples] = useState<Array<Principle>>([]);
  const [squads, setSquads] = useState<Array<Squad>>([]);

  const [viewedDrill, setViewedDrill] = useState<{
    initial: ?Row,
    current: ?Row,
  }>({
    initial: null,
    current: null,
  });
  const setDrillFromActivityDrillPanel = (
    stateUpdate: ?Row | ((?Row) => ?Row)
  ) => {
    if (!isMounted.current) return;

    if (typeof stateUpdate === 'object') {
      setViewedDrill({ initial: stateUpdate, current: stateUpdate });
    } else if (typeof stateUpdate === 'function') {
      setViewedDrill(({ current, initial }) => {
        const next = stateUpdate(current);
        return {
          current: next,
          initial: _isEqual(next, ActivityDrillPanel.INITIAL_DRILL_ATTRIBUTES)
            ? ActivityDrillPanel.INITIAL_DRILL_ATTRIBUTES
            : initial,
        };
      });
    }
  };

  const [
    activityNameInputInvalidityReason,
    setActivityNameInputInvalidityReason,
  ] = useState<string>('');

  const getAndSetDrills = async (id?: ?number) => {
    let fetchedDrills: EventActivityDrillsType;
    try {
      fetchedDrills = await searchDrills({ ...filters, nextId: id });
    } catch {
      if (!isMounted.current) return;
      setRequestStatus('FAILURE');
      return;
    }

    if (!isMounted.current) return;

    setNextId(fetchedDrills.next_id);
    const newDrills: Array<Row> = (
      fetchedDrills.event_activity_drills || []
    ).map((drill) => ({
      ...drill,
      selected: false,
    }));
    if (id) {
      setDrills((prev) => [...prev, ...newDrills]);
    } else {
      setDrills(newDrills);
    }
    setViewedDrill({ initial: null, current: null });
    setRequestStatus('SUCCESS');
  };

  const getAndSetTypesAndSquads = async () => {
    let fetchedTypes: Array<ActivityType>;
    try {
      fetchedTypes = await getActivityTypes();
    } catch {
      if (!isMounted.current) return;
      setRequestStatus('FAILURE');
      return;
    }

    if (!isMounted.current) return;

    setTypes(fetchedTypes);

    setSquads(
      fetchedTypes
        .flatMap(({ squads: s }) => s)
        // Remove duplicated squads.
        .filter(
          (squad, index, currentArray) =>
            index === currentArray.findIndex((s) => s?.id === squad?.id)
        )
    );
  };

  const getAndSetStaff = async () => {
    let fetchedStaff: Array<EventsUser>;
    try {
      fetchedStaff = await getStaffOnly();
    } catch {
      if (!isMounted.current) return;
      setRequestStatus('FAILURE');
      return;
    }

    if (!isMounted.current) return;
    setStaff(fetchedStaff);
  };

  const getAndSetPrinciples = async () => {
    let fetchedPrinciples: Array<Principle>;
    try {
      fetchedPrinciples = await searchPrinciples();
    } catch {
      if (!isMounted.current) return;
      setRequestStatus('FAILURE');
      return;
    }

    if (!isMounted.current) return;
    setPrinciples(fetchedPrinciples);
  };

  const onFiltersChange = useDebouncedCallback(async () => {
    const areFiltersOptionsLoaded: boolean = [
      drills,
      types,
      staff,
      principles,
      // Some filters may have no options, hence some() instead of every().
    ].some(({ length }) => length > 0);
    if (!areFiltersOptionsLoaded) {
      await getAndSetTypesAndSquads();
      await getAndSetStaff();
      await getAndSetPrinciples();
    }

    await getAndSetDrills();
  }, 500);

  useEffect(() => {
    isMounted.current = true;

    onFiltersChange();

    return () => {
      isMounted.current = false;
    };
  }, [types, staff, principles, filters]);

  useEffect(() => {
    if (drills.every((d) => d?.squads) || !isMounted.current) return;

    setDrills((prev) =>
      prev.map((drill) => ({
        ...drill,
        squads:
          /* eslint-disable-next-line max-nested-callbacks */
          types.find(({ id }) => id === drill.event_activity_type?.id)
            ?.squads ?? [],
      }))
    );
  }, [types, drills]);

  const isAtBottom = ({
    currentTarget: { scrollTop, scrollHeight, clientHeight },
  }: SyntheticUIEvent<HTMLDivElement>) => {
    const LAZY_LOADING_SCROLL_OFFSET = 10;
    const scrollPosition = scrollTop + LAZY_LOADING_SCROLL_OFFSET;
    const threshold = scrollHeight - clientHeight;
    return scrollPosition >= threshold;
  };

  const handleScroll = (event: SyntheticUIEvent<HTMLDivElement>) => {
    if (isAtBottom(event) && requestStatus !== 'LOADING' && nextId) {
      getAndSetDrills(nextId);
    }
  };

  const onUnarchive = async (id: number, name?: string) => {
    try {
      await unarchiveLibraryDrill(id, name);
    } catch (e) {
      if (!isMounted.current) return;

      const { status, data } = e.response;

      if (
        status === errors.NAME_HAS_BEEN_TAKEN_ERROR.code &&
        data.name[0] === errors.NAME_HAS_BEEN_TAKEN_ERROR.message
      ) {
        setActivityNameInputInvalidityReason(
          errors.NAME_HAS_BEEN_TAKEN_ERROR.message
        );
        return;
      }

      setViewedDrill({ initial: null, current: null });
      setRequestStatus('FAILURE');
      return;
    }
    trackEvent(
      `Planning — Coaching library — View drill archive — Restore drill — Restore`
    );

    if (!isMounted.current) return;

    setDrills((prev) => prev.filter((drill) => drill.id !== id));
    setViewedDrill({ initial: null, current: null });
    setRequestStatus('SUCCESS');
  };

  const onComposeActivityDrill = async ({
    drill,
  }: {
    drill: EventActivityDrillV2,
  }) => {
    if (drill.archived) {
      onUnarchive(drill.id, drill.name);
    }
  };

  return (
    <>
      <div css={style.wrapper}>
        <div css={style.wrapperTop}>
          <div css={style.wrapperTopLeftSide}>
            <Link css={style.backButton} href="#" onClick={() => historyGo(-1)}>
              <i className="icon-next-left" />
              {props.t('Back')}
            </Link>
            <h1>{props.t('Drill archive')}</h1>
          </div>
        </div>
        {requestStatus === 'LOADING' ? (
          <div css={style.loadingText}>{`${props.t('Loading')} ...`}</div>
        ) : (
          <div css={style.gridWrapper}>
            <div css={style.gridWrapperTop}>
              <h2>{props.t('Drills')}</h2>
            </div>
            <div css={style.filters}>
              <SearchBar
                icon="icon-search"
                placeholder={props.t('Search drill name')}
                value={filters.search_expression}
                onChange={(e) => {
                  // https://fb.me/react-event-pooling
                  // TODO: remove e.persist() if React version is 17+.
                  e.persist();
                  setFilters((prev) => ({
                    ...prev,
                    search_expression: e.target?.value,
                  }));
                }}
              />
              <Select
                customSelectStyles={fitContentMenuCustomStyles}
                placeholder={props.t('Activity type')}
                options={defaultMapToOptions(types)}
                value={filters.event_activity_type_ids}
                onChange={(ids) => {
                  setFilters((prev) => ({
                    ...prev,
                    event_activity_type_ids: ids,
                  }));
                }}
                onClear={() => {
                  setFilters((prev) => ({
                    ...prev,
                    event_activity_type_ids: [],
                  }));
                }}
                isSearchable
                isClearable
                isMulti
              />
              <Select
                customSelectStyles={fitContentMenuCustomStyles}
                placeholder={props.t('Creator')}
                options={staff.map(({ id, fullname }) => ({
                  value: id,
                  label: fullname,
                }))}
                value={filters.user_ids}
                onChange={(ids) =>
                  setFilters((prev) => ({
                    ...prev,
                    user_ids: ids,
                  }))
                }
                onClear={() => {
                  setFilters((prev) => ({
                    ...prev,
                    user_ids: [],
                  }));
                }}
                isSearchable
                isClearable
                isMulti
              />
              <Select
                customSelectStyles={fitContentMenuCustomStyles}
                placeholder={props.t('Principle')}
                options={defaultMapToOptions(principles)}
                value={filters.principle_ids}
                onChange={(ids) =>
                  setFilters((prev) => ({
                    ...prev,
                    principle_ids: ids,
                  }))
                }
                onClear={() => {
                  setFilters((prev) => ({
                    ...prev,
                    principle_ids: [],
                  }));
                }}
                isSearchable
                isClearable
                isMulti
              />
            </div>
            <ReactDataGrid
              tableHeaderData={getTableHeaderData({
                t: props.t,
                numberOfSquads: squads.length,
                setViewedDrill: (row) => {
                  setViewedDrill({ initial: row, current: row });
                },
                onRestore: (row) => {
                  setViewedDrill({ initial: row, current: row });
                },
              })}
              tableBodyData={drills}
              rowHeight={40}
              onScroll={handleScroll}
              onRowsChange={(_, { indexes: [indexOfDrillToChange] }) => {
                setDrills((prev) => {
                  const newDrills = [...prev];
                  const newDrill = { ...newDrills[indexOfDrillToChange] };
                  newDrill.selected = !newDrill.selected;
                  newDrills[indexOfDrillToChange] = newDrill;
                  return newDrills;
                });
              }}
            />
          </div>
        )}
      </div>
      <ActivityDrillPanel
        areCoachingPrinciplesEnabled={preferences?.coaching_principles}
        drill={
          viewedDrill.current || ActivityDrillPanel.INITIAL_DRILL_ATTRIBUTES
        }
        initialDrillState={
          viewedDrill.initial || ActivityDrillPanel.INITIAL_DRILL_ATTRIBUTES
        }
        drillPrinciples={defaultMapToOptions(principles)}
        eventActivityTypes={defaultMapToOptions(types)}
        activityNameInputInvalidityReason={activityNameInputInvalidityReason}
        canRestoreFromArchive
        isOpen={viewedDrill.current?.id}
        onClose={() => {
          setViewedDrill({ initial: null, current: null });
        }}
        onComposeActivityDrill={onComposeActivityDrill}
        setSelectedDrill={setDrillFromActivityDrillPanel}
      />
    </>
  );
});
