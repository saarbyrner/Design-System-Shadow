// @flow
import { useEffect, useState, useRef } from 'react';
import { withNamespaces } from 'react-i18next';
import _isEqual from 'lodash/isEqual';

import {
  AppStatus,
  ReactDataGrid,
  SearchBar,
  TextButton,
  Select,
  Checkbox,
  TooltipMenu,
  ActivityDrillPanelTranslated as ActivityDrillPanel,
} from '@kitman/components';
import {
  transformFilesForUpload,
  type AttachedFile,
} from '@kitman/common/src/utils/fileHelper';
import { errors } from '@kitman/common/src/variables';
import { fitContentMenuCustomStyles } from '@kitman/components/src/Select';
import { defaultMapToOptions } from '@kitman/components/src/Select/utils';
import {
  searchDrills,
  searchPrinciples,
  getActivityTypes,
  getStaffOnly,
  bulkUpdateEventActivityDrill,
  updateEventActivityDrill,
  archiveLibraryDrill,
} from '@kitman/services/src/services/planning';
import {
  useDebouncedCallback,
  useBrowserTabTitle,
} from '@kitman/common/src/hooks';
import {
  startFileUpload,
  finishFileUpload,
} from '@kitman/modules/src/PlanningEvent/src/services/fileUpload';
import { type I18nProps } from '@kitman/common/src/types/i18n';
import { type RequestStatus } from '@kitman/modules/src/PlanningEvent/types';
import {
  type EventsUser,
  type EventActivityDrillV2,
} from '@kitman/common/src/types/Event';
import type { Principle } from '@kitman/common/src/types/Principles';
import type { Squad } from '@kitman/services/src/services/getSquads';
import type {
  EventActivityFilterParams,
  ActivityType,
  EventActivityDrillsType,
} from '@kitman/services/src/services/planning';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';

import EditModal from '../EditModal';

import style from './style';
import getTableHeaderData from './utils';
import type { Row } from './utils';

export default withNamespaces()((props: I18nProps<{}>) => {
  useBrowserTabTitle(props.t('Coaching library'));
  const { trackEvent } = useEventTracking();

  const isMounted = useRef<boolean>(false);
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('LOADING');
  const { preferences } = usePreferences();

  const [filters, setFilters] = useState<EventActivityFilterParams>({
    search_expression: '',
    event_activity_type_ids: [],
    user_ids: [],
    principle_ids: [],
    squad_ids: [],
    archived: false,
  });
  const [drills, setDrills] = useState<Array<Row>>([]);
  const [nextId, setNextId] = useState<number | null>(null);
  const [types, setTypes] = useState<Array<ActivityType>>([]);
  const [staff, setStaff] = useState<Array<EventsUser>>([]);
  const [principles, setPrinciples] = useState<Array<Principle>>([]);
  const [squads, setSquads] = useState<Array<Squad>>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isActivityDrillPanelOpen, setIsActivityDrillPanelOpen] =
    useState<boolean>(false);
  const [typeId, setTypeId] = useState<?number>();
  const [
    activityNameInputInvalidityReason,
    setActivityNameInputInvalidityReason,
  ] = useState<string>('');
  const areAllDrillsSelected =
    drills.length > 0 && drills.every(({ selected }) => selected);
  const areSomeDrillsSelected = drills.some(({ selected }) => selected);

  const [viewedDrill, setViewedDrill] = useState<{
    initial: ?Row,
    current: ?Row,
  }>({
    initial: null,
    current: null,
  });
  useEffect(() => {
    if (viewedDrill.current === null) {
      setIsActivityDrillPanelOpen(false);
      setActivityNameInputInvalidityReason('');
    }
  }, [viewedDrill.current]);
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

  const onEdit = async () => {
    if (!(typeId && isMounted.current)) return;

    const editedDrills = await bulkUpdateEventActivityDrill({
      ids: drills.filter(({ selected }) => selected).map(({ id }) => id),
      event_activity_type_id: typeId,
    });
    setDrills((prev) =>
      prev.map((drill) => {
        const editedDrill = editedDrills.find(
          ({ name }) => drill.name === name
        );
        const newDrill = editedDrill ?? drill;
        return {
          ...newDrill,
          selected: !!editedDrill,
          squads:
            types.find(({ id }) => id === newDrill.event_activity_type?.id)
              ?.squads ?? [],
        };
      })
    );
    setIsEditModalOpen(false);
    setTypeId(null);
  };

  const onArchive = async (id: number): Promise<typeof undefined> => {
    try {
      await archiveLibraryDrill(id);
    } catch {
      if (!isMounted.current) return;
      setRequestStatus('FAILURE');
    }
    trackEvent(`Planning — Coaching library — Archive drill`);
    if (!isMounted.current) return;
    setDrills((prev) => prev.filter((drill) => drill.id !== id));
  };

  const onBulkArchive = () => {
    drills
      .filter(({ selected }) => selected)
      .map(({ id }) => id)
      .forEach(onArchive);
  };

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

  const onComposeActivityDrill = async ({
    drill,
    diagram,
    attachments,
  }: {
    drill: EventActivityDrillV2,
    diagram: ?AttachedFile,
    attachments: ?Array<AttachedFile>,
  }): Promise<Error | null> => {
    if (!isMounted.current) return null;

    setActivityNameInputInvalidityReason('');
    setRequestStatus('LOADING');
    const newDiagram = diagram && {
      original_filename: diagram.filename,
      filetype: diagram.fileType,
      filesize: diagram.fileSize,
      name: diagram.fileTitle,
    };
    const newAttachments = transformFilesForUpload(
      attachments ?? ([]: Array<AttachedFile>)
    );
    const newDrill: EventActivityDrillV2 = {
      ...drill,
      event_activity_type_id:
        drill.event_activity_type_id ||
        drill.event_activity_type?.id ||
        ActivityDrillPanel.INITIAL_DRILL_ATTRIBUTES.event_activity_type_id,
      event_activity_drill_label_ids: drill.event_activity_drill_labels.map(
        ({ id }) => id
      ),
      diagram: newDiagram || drill.diagram,
      attachments: [...(drill.attachments || []), ...newAttachments],
    };

    const updateDrill = async (
      newDrillDetails: EventActivityDrillV2
    ): Promise<?{
      updatedDrillDetails?: EventActivityDrillV2,
      error?: Error,
    }> => {
      let updatedDrillDetails: EventActivityDrillV2;
      try {
        updatedDrillDetails = await updateEventActivityDrill(newDrillDetails);
      } catch (e) {
        if (!isMounted.current) return null;

        const { status, data } = e.response;

        if (
          status === errors.NAME_HAS_BEEN_TAKEN_ERROR.code &&
          data.name[0] === errors.NAME_HAS_BEEN_TAKEN_ERROR.message
        ) {
          setRequestStatus('SUCCESS');
          setActivityNameInputInvalidityReason(
            errors.NAME_HAS_BEEN_TAKEN_ERROR.message
          );
          return { error: e };
        }

        setRequestStatus('FAILURE');
        setActivityNameInputInvalidityReason('');
        return null;
      }

      if (!isMounted.current) return null;

      setDrills((prev) => {
        const newDrills = [...prev];
        const indexOfDrillToChange = newDrills.findIndex(
          ({ id }) => id === newDrillDetails.id
        );
        newDrills[indexOfDrillToChange] = {
          ...updatedDrillDetails,
          selected: false,
        };
        return newDrills;
      });
      return { updatedDrillDetails };
    };

    const uploadFile = async ({
      file,
      attachmentId,
      presignedPost,
    }: {
      file: AttachedFile,
      attachmentId: number,
      presignedPost: Object,
    }) => {
      try {
        await startFileUpload(file.file, attachmentId, presignedPost);
      } catch {
        if (!isMounted.current) return null;
        setRequestStatus('FAILURE');
        return null;
      }

      try {
        await finishFileUpload(attachmentId);
      } catch {
        if (!isMounted.current) return null;
        setRequestStatus('FAILURE');
      }
      return null;
    };

    if (!isMounted.current) return null;

    let updatedDrill: ?EventActivityDrillV2;

    if (
      !_isEqual(
        drill,
        drills.find(({ id }) => id === drill.id)
      ) ||
      diagram ||
      attachments
    ) {
      const result = await updateDrill(newDrill);
      if (result?.error) return result.error;
      updatedDrill = result?.updatedDrillDetails;
    }

    if (updatedDrill && diagram) {
      await uploadFile({
        file: diagram,
        attachmentId:
          typeof updatedDrill?.diagram?.id === 'number'
            ? updatedDrill.diagram.id
            : -1,
        presignedPost: updatedDrill.diagram?.presigned_post,
      });
    }

    if (!isMounted.current) return null;

    const attachmentsToUpload = updatedDrill?.attachments?.filter(
      (attachment) => !attachment?.confirmed
    );

    await Promise.all(
      attachmentsToUpload?.map((attachment, i) => {
        if (!attachment || !attachments) {
          return null;
        }
        return uploadFile({
          file: attachments[i],
          attachmentId: attachment?.id ?? -1,
          presignedPost: attachment?.presigned_post,
        });
      }) || []
    );

    if (!isMounted.current) return null;

    setViewedDrill({ initial: null, current: null });
    setRequestStatus('SUCCESS');

    trackEvent(`Planning — Coaching library — Drill detail — Update`);
    return null;
  };

  const getContent = () => {
    switch (requestStatus) {
      case 'LOADING':
        return <div css={style.loadingText}>{`${props.t('Loading')} ...`}</div>;
      case 'FAILURE':
        return <AppStatus status="error" />;
      default:
        return (
          <div css={style.gridWrapper}>
            <div css={style.gridWrapperTop}>
              <h2>{props.t('Drills')}</h2>
              <div css={style.gridTopButtons}>
                <TextButton
                  name="edit-button"
                  text={props.t('Edit')}
                  onClick={() => {
                    setIsEditModalOpen(true);
                  }}
                  isDisabled={!areSomeDrillsSelected}
                  type="secondary"
                  kitmanDesignSystem
                />
                <TextButton
                  name="archive-button"
                  text={props.t('Archive')}
                  onClick={onBulkArchive}
                  isDisabled={!areSomeDrillsSelected}
                  type="secondary"
                  kitmanDesignSystem
                />
              </div>
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
            <div css={style.bulkCheckboxWrapper}>
              <Checkbox.New
                id="bulk-checkbox"
                checked={areAllDrillsSelected && nextId === null}
                indeterminate={areSomeDrillsSelected}
                onClick={() => {
                  setDrills((prev) =>
                    prev.map((drill) => ({
                      ...drill,
                      selected: !areAllDrillsSelected,
                    }))
                  );
                }}
              />
            </div>
            <ReactDataGrid
              tableHeaderData={getTableHeaderData({
                t: props.t,
                numberOfSquads: squads.length,
                setViewedDrill: (row) => {
                  setViewedDrill({ initial: row, current: row });
                  setIsActivityDrillPanelOpen(true);
                },
                onArchive,
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
        );
    }
  };

  return (
    <>
      <div css={style.wrapper}>
        <div css={style.wrapperTop}>
          <h1>{props.t('Coaching library')}</h1>
          <div css={style.tooltipMenu} data-testid="wrapper-top-tooltip-menu">
            <TooltipMenu
              placement="bottom-end"
              menuItems={[
                {
                  description: props.t('View drill archive'),
                  href: '#archive',
                },
              ]}
              tooltipTriggerElement={
                <TextButton
                  kitmanDesignSystem
                  iconBefore="icon-menu"
                  type="secondary"
                />
              }
              kitmanDesignSystem
            />
          </div>
        </div>
        {getContent()}
      </div>
      <EditModal
        isOpen={isEditModalOpen}
        drillsNumber={drills.filter(({ selected }) => selected).length}
        types={types}
        typeId={typeId}
        setTypeId={setTypeId}
        onEdit={onEdit}
        onCancel={() => {
          setIsEditModalOpen(false);
          setTypeId(null);
        }}
      />
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
        isOpen={isActivityDrillPanelOpen}
        onClose={() => {
          if (!isMounted.current) return;

          setViewedDrill({ initial: null, current: null });
          setActivityNameInputInvalidityReason('');
        }}
        setLibraryDrillToUpdate={onComposeActivityDrill}
        setSelectedDrill={setDrillFromActivityDrillPanel}
      />
    </>
  );
});
