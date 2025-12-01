// @flow
import { useState, useEffect } from 'react';
import moment from 'moment';
import {
  getLoadMoreDailyStatusReportData,
  getCreateBulkDailyStatusReportNotesData,
  getCreateSingleDailyStatusReportNoteData,
} from '@kitman/common/src/utils/TrackingData/src/data/medical/geDailyStatusReportData';
import performanceMedicineEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/performanceMedicine';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import structuredClone from 'core-js/stable/structured-clone';
import i18n from '@kitman/common/src/utils/i18n';
import useIsMountedCheck from '@kitman/common/src/hooks/useIsMountedCheck';
import {
  useGetCoachesReportGridQuery,
  useGetMultipleCoachesNotesQuery,
  useGetLastCoachesReportNoteQuery,
  useSaveMedicalNoteMutation,
  useSaveBulkMedicalNotesMutation,
} from '@kitman/modules/src/Medical/shared/redux/services/medical';
import { useGetCurrentUserQuery } from '@kitman/common/src/redux/global/services/globalApi';
import { Paper } from '@kitman/playbook/components';
import { CoachesReportTabRefactorTranslated as CoachesReportRefactorTab } from '@kitman/modules/src/Medical/shared/components/CoachesReportRefactorTab';
import type { MedicalNotePayload } from '@kitman/modules/src/Medical/shared/components/CoachesReportRefactorTab/types';
import type { BulkNoteAnnotationForm } from '@kitman/modules/src/Medical/shared/types';
import type {
  CoachesReportPayload,
  CoachesNotePayload,
  CoachesNoteInlinePayload,
  GridData,
  ContainerProps as Props,
} from '../components/CoachesReportRefactorTab/types';
import {
  fetchFilters,
  persistLocalFilters,
} from '../components/CoachesReportRefactorTab/utils/utils';

const initialData: GridData = {
  columns: [],
  rows: [],
  next_id: null,
};

const initialGridPayload: CoachesReportPayload = {
  filters: {
    athlete_name: '',
    positions: [],
    squads: [],
    availabilities: [],
    report_date: moment().toISOString(),
    issues: [],
  },
  next_id: null,
};

const initialCoachesNotePayLoad: CoachesNotePayload = {
  athleteIds: [-1],
  includeCopiedFrom: true,
  organisationAnnotationTypes: ['OrganisationAnnotationTypes::DailyStatusNote'],
  annotationDate: moment().toISOString(),
};

const initialCoachesNoteInlinePayLoad: CoachesNoteInlinePayload = {
  athleteId: -1,
  includeCopiedFrom: true,
  organisationAnnotationTypes: ['organisation_annotation_types::Coaches'],
  beforeDate: moment().toISOString(),
};

const CoachesReportRefactorTabContainer = ({ permissions }: Props) => {
  const { trackEvent } = useEventTracking();
  const checkIsMounted = useIsMountedCheck();
  const [gridPayload, setGridPayload] =
    useState<CoachesReportPayload>(initialGridPayload);
  const [shouldRefetchCoachesReportData, setShouldRefetchCoachesReportData] =
    useState(false);
  const [coachesNotePayLoad, setCoachesNotePayLoad] = useState(
    initialCoachesNotePayLoad
  );
  const [coachesNoteInlinePayLoad, setCoachesNoteInlinePayLoad] = useState(
    initialCoachesNoteInlinePayLoad
  );

  const {
    data: coachesReportData = initialData,
    isLoading: isCoachesReportDataLoading = false,
    refetch: refetchCoachesReportData = () => {},
    isFetching: isCoachesReportDataFetching = false,
  }: {
    data: GridData,
    isLoading: boolean,
    isFetching: boolean,
    isSuccess: boolean,
    isError: boolean,
    refetch: Function,
  } = useGetCoachesReportGridQuery(gridPayload, {});

  const [fullCoachesGridData, setFullCoachesGridData] =
    useState(coachesReportData);

  const {
    isLoading: isCoachesNotesLoading = false,
    isFetching: isCoachesNotesFetching = false,
    isSuccess: isCoachesNotesSuccess = false,
    isError: isCoachesNotesError = false,
  } = useGetMultipleCoachesNotesQuery(coachesNotePayLoad, {
    skip: coachesNotePayLoad.athleteIds[0] === -1,
  });

  const {
    data: lastCoachesReportNoteData = initialCoachesNoteInlinePayLoad,
    isSuccess: isLastCoachesReportNoteSuccess = false,
    isError: isLastCoachesReportNoteError = false,
  } = useGetLastCoachesReportNoteQuery(coachesNoteInlinePayLoad, {
    skip: coachesNoteInlinePayLoad.athleteId === -1,
  });

  const [
    saveMedicalNote,
    {
      isLoading: isSavingMedicalNote,
      isError: isMedicalNoteSaveError,
      isSuccess: isMedicalNoteSaveSuccess,
    },
  ] = useSaveMedicalNoteMutation();

  const [saveBulkMedicalNotes, { isError: isBulkMedicalNotesSaveError }] =
    useSaveBulkMedicalNotesMutation();

  const { data: currentUser } = useGetCurrentUserQuery();

  // Fetch initial/persisted filters
  useEffect(() => {
    if (!checkIsMounted()) return;
    fetchFilters(setGridPayload, gridPayload);
    trackEvent(performanceMedicineEventNames.loadDailyStatusReportTab); // Track tab loading
  }, []);

  // Filtering and infinite scrolling (grid fetching)
  useEffect(() => {
    if (!checkIsMounted() || !coachesReportData) return;

    const {
      rows: newRows,
      columns: newColumns,
      next_id: nextId,
    } = coachesReportData;

    setFullCoachesGridData((prev) => {
      if (newRows.length === 0) {
        // If the new response has empty rows, reset the grid data
        return {
          columns: newColumns.length ? newColumns : prev.columns,
          rows: [],
          next_id: nextId,
        };
      }

      // If there is no next_id (on filtering or a fresh request) reset the grid
      if (!gridPayload.next_id) {
        return {
          columns: newColumns.length ? newColumns : prev.columns,
          rows: newRows, // reset to the new set of rows
          next_id: nextId,
        };
      }

      // Append new unique rows on infinite scroll
      return {
        columns: newColumns.length ? newColumns : prev.columns,
        rows: [...prev.rows, ...newRows],
        next_id: nextId,
      };
    });
  }, [coachesReportData, checkIsMounted, gridPayload.filters]);

  const updateCoachesNotePayLoad = (payload: CoachesNotePayload): void => {
    setCoachesNotePayLoad((prevPayload) => ({ ...prevPayload, ...payload }));
  };

  // Reset grid and trigger data refetch after saving Daily status notes
  useEffect(() => {
    if (!isCoachesNotesSuccess) return;
    setGridPayload((prevPayload) => ({ ...prevPayload, next_id: null }));
    setShouldRefetchCoachesReportData(true);
  }, [isCoachesNotesSuccess]);

  // Refetch coaches report data when needed
  useEffect(() => {
    if (shouldRefetchCoachesReportData) {
      refetchCoachesReportData();
      setShouldRefetchCoachesReportData(false);
    }
  }, [shouldRefetchCoachesReportData, refetchCoachesReportData]);

  const updateCoachesNoteInlinePayLoad = (
    payload: CoachesNoteInlinePayload
  ): void => {
    setCoachesNoteInlinePayLoad((prevPayload) => ({
      ...prevPayload,
      ...payload,
    }));
  };

  // Grid fetching
  const fetchNextGridRows = () => {
    if (!checkIsMounted() || !fullCoachesGridData.next_id) return;

    setGridPayload((prev) => {
      trackEvent(
        performanceMedicineEventNames.loadMoreDailyStatusReportData,
        getLoadMoreDailyStatusReportData(fullCoachesGridData.next_id)
      );
      return { ...prev, next_id: fullCoachesGridData.next_id };
    });
  };

  // Grid payload (filters and next_id)
  const updatePayload = (newPayload: CoachesReportPayload) => {
    setGridPayload((prevPayload) => {
      persistLocalFilters(newPayload.filters || prevPayload.filters);
      return {
        ...prevPayload,
        ...newPayload,
      };
    });
  };

  return (
    <Paper
      variant="outlined"
      sx={{ width: '100%' }}
      square
      data-testid="CoachesReportRefactortab|Container"
    >
      <CoachesReportRefactorTab
        permissions={permissions}
        isLoading={isCoachesReportDataLoading || isCoachesReportDataFetching}
        filters={gridPayload.filters}
        grid={fullCoachesGridData}
        updatePayload={updatePayload}
        fetchNextGridRows={fetchNextGridRows}
        updateCoachesNotePayLoad={updateCoachesNotePayLoad}
        updateCoachesNoteInlinePayLoad={updateCoachesNoteInlinePayLoad}
        lastCoachesReportNoteData={lastCoachesReportNoteData}
        isLastCoachesReportNoteSuccess={isLastCoachesReportNoteSuccess}
        isLastCoachesReportNoteError={isLastCoachesReportNoteError}
        isCoachesNotesFetching={isCoachesNotesFetching}
        isCoachesNotesLoading={isCoachesNotesLoading}
        isCoachesNotesSuccess={isCoachesNotesSuccess}
        isCoachesNotesError={isCoachesNotesError}
        rehydrateGrid={refetchCoachesReportData}
        addMedicalNote={(payload: MedicalNotePayload) => {
          saveMedicalNote(payload);
          setFullCoachesGridData((prev) => ({
            ...prev,
            rows: structuredClone(prev.rows).map((row) => {
              if (row.id !== payload.athlete_id) return row;
              return {
                ...row,
                most_recent_coaches_note: {
                  annotation_date: payload.annotation_date,
                  content: payload.content,
                  created_at: payload.annotation_date,
                  updated_at: payload.annotation_date,
                  created_by: currentUser,
                },
              };
            }),
          }));
          trackEvent(
            performanceMedicineEventNames.createBulkDailyStatusReportNotes,
            getCreateSingleDailyStatusReportNoteData(payload.athlete_id)
          );
        }}
        addBulkMedicalNotes={(payload: BulkNoteAnnotationForm) => {
          saveBulkMedicalNotes(payload);
          const updatedRows = payload.annotationables.map(
            (row) => row.annotationable_id
          );

          setFullCoachesGridData((prev) => ({
            ...prev,
            rows: structuredClone(prev.rows).map((row) => ({
              ...row,
              // Only update note value for updated rows (bulk created notes)
              most_recent_coaches_note: updatedRows.includes(row.id)
                ? {
                    annotation_date: payload.annotation_date,
                    content: payload.content,
                    created_at: payload.annotation_date,
                    updated_at: payload.annotation_date,
                    created_by: currentUser,
                  }
                : row.most_recent_coaches_note,
            })),
          }));
          trackEvent(
            performanceMedicineEventNames.createBulkDailyStatusReportNotes,
            getCreateBulkDailyStatusReportNotesData(updatedRows)
          );
        }}
        isBulkMedicalNotesSaveError={isBulkMedicalNotesSaveError}
        isSavingMedicalNote={isSavingMedicalNote}
        isMedicalNoteSaveError={isMedicalNoteSaveError}
        isMedicalNoteSaveSuccess={isMedicalNoteSaveSuccess}
        t={i18n.t}
      />
    </Paper>
  );
};

export default CoachesReportRefactorTabContainer;
