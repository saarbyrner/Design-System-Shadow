/* eslint-disable max-statements */
// @flow

import { useState, useEffect, type ComponentType } from 'react';
import moment from 'moment-timezone';
import { convertPixelsToREM } from '@kitman/common/src/utils/css';
import type { I18nProps, Translation } from '@kitman/common/src/types/i18n';
import { withNamespaces } from 'react-i18next';
import { Box } from '@kitman/playbook/components';
import { CoachesReportRefactorOverviewGridTranslated as CoachesReportRefactorOverviewGrid } from '@kitman/modules/src/Medical/shared/components/CoachesReportRefactorTab/components/CoachesReportRefactorOverviewGrid';
import type { PermissionsType } from '@kitman/common/src/contexts/PermissionsContext/types';
import type { BulkNoteAnnotationForm } from '@kitman/modules/src/Medical/shared/types';
import { cellNotBeingEditedValue } from './utils/utils';
import Header from './components/Header';

import type {
  CoachesReportPayload,
  CoachesNotePayload,
  CoachesNoteInlinePayload,
  FiltersType,
  MedicalNotePayload,
} from './types';

import useDataReady from './utils/useDataReady';

type Props = {
  t: Translation,
  grid: Object,
  lastCoachesReportNoteData: CoachesNoteInlinePayload,
  isLastCoachesReportNoteSuccess: boolean,
  filters: FiltersType,
  isLoading: boolean,
  rehydrateGrid: () => void,
  fetchNextGridRows: () => void,
  updateCoachesNotePayLoad: (payload: CoachesNotePayload) => void,
  updateCoachesNoteInlinePayLoad: (payload: CoachesNoteInlinePayload) => void,
  updatePayload: (newPayload: CoachesReportPayload) => void,
  isCoachesNotesError: boolean,
  isLastCoachesReportNoteError: boolean,
  isCoachesNotesSuccess: boolean,
  isCoachesNotesFetching: boolean,
  permissions: PermissionsType,
  addMedicalNote: (payload: MedicalNotePayload) => void,
  addBulkMedicalNotes: (payload: BulkNoteAnnotationForm) => void,
  isBulkMedicalNotesSaveError: boolean,
};

const CoachesReportTabRefactor = ({
  t,
  grid,
  filters,
  isLoading,
  rehydrateGrid,
  updatePayload,
  fetchNextGridRows,
  updateCoachesNotePayLoad,
  updateCoachesNoteInlinePayLoad,
  permissions,
  isCoachesNotesError,
  isCoachesNotesSuccess,
  isCoachesNotesFetching,
  lastCoachesReportNoteData,
  isLastCoachesReportNoteSuccess,
  isLastCoachesReportNoteError,
  addMedicalNote,
  addBulkMedicalNotes,
  isBulkMedicalNotesSaveError,
}: I18nProps<Props>) => {
  const [rowSelectionModel, setRowSelectionModel] = useState<Array<number>>([]);
  const [editingCellId, setEditingCellId] = useState<number>(
    cellNotBeingEditedValue
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [dataGridCurrentDate, setDataGridCurrentDate] = useState<string>(
    moment().toISOString()
  );
  const dataIsReady = useDataReady(grid, isLoading);
  const canCreateNotes = permissions?.medical?.notes?.canCreate;
  const canViewInjuries = permissions?.medical?.issues?.canView;
  const canExport = permissions?.medical?.issues?.canExport;
  const canViewAvailabilityStatus = permissions?.medical?.availability?.canView;

  // Side effects after report generated
  useEffect(() => {
    if (isCoachesNotesSuccess) {
      setRowSelectionModel([]);
    }
  }, [isCoachesNotesSuccess]);

  return (
    <Box>
      <Header
        t={t}
        filters={filters}
        rowSelectionModel={rowSelectionModel}
        canCreateNotes={canCreateNotes}
        canExport={canExport}
        updateCoachesNotePayLoad={updateCoachesNotePayLoad}
        dataGridCurrentDate={dataGridCurrentDate}
        setDataGridCurrentDate={setDataGridCurrentDate}
        updatePayload={updatePayload}
        rehydrateGrid={rehydrateGrid}
        isCoachesNotesFetching={isCoachesNotesFetching}
        isCoachesNotesError={isCoachesNotesError}
        isBulkMedicalNotesSaveError={isBulkMedicalNotesSaveError}
        setRowSelectionModel={setRowSelectionModel}
        setModalOpen={setModalOpen}
        isLoading={isLoading}
        setEditingCellId={setEditingCellId}
      />
      <Box
        sx={{
          width: '100%',
          height: `calc(100vh - ${convertPixelsToREM(360)})`,
        }}
      >
        <CoachesReportRefactorOverviewGrid
          addMedicalNote={addMedicalNote}
          addBulkMedicalNotes={addBulkMedicalNotes}
          isBulkMedicalNotesSaveError={isBulkMedicalNotesSaveError}
          filters={filters}
          rehydrateGrid={rehydrateGrid}
          updatePayload={updatePayload}
          fetchNextGridRows={fetchNextGridRows}
          updateCoachesNoteInlinePayLoad={updateCoachesNoteInlinePayLoad}
          lastCoachesReportNoteData={lastCoachesReportNoteData}
          isLastCoachesReportNoteSuccess={isLastCoachesReportNoteSuccess}
          isLastCoachesReportNoteError={isLastCoachesReportNoteError}
          isCoachesNotesError={isCoachesNotesError}
          dataGridCurrentDate={dataGridCurrentDate.toString()}
          grid={grid}
          isLoading={!dataIsReady}
          canCreateNotes={canCreateNotes}
          canViewInjuries={canViewInjuries}
          canViewAvailabilityStatus={canViewAvailabilityStatus}
          setRowSelectionModel={setRowSelectionModel}
          rowSelectionModel={rowSelectionModel}
          setModalIsOpen={setModalOpen}
          isModalOpen={modalOpen}
          editingCellId={editingCellId}
          setEditingCellId={setEditingCellId}
        />
      </Box>
    </Box>
  );
};

export const CoachesReportTabRefactorTranslated: ComponentType<Props> =
  withNamespaces()(CoachesReportTabRefactor);
export default CoachesReportTabRefactor;
