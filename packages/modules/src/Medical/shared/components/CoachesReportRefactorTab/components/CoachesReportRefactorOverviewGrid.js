/* eslint-disable camelcase */
// @flow
import { useRef, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import type { Toast } from '@kitman/components/src/types';
import { withNamespaces } from 'react-i18next';
import { RichTextDisplay } from '@kitman/components';
import {
  Box,
  Button,
  Modal,
  Typography,
  DataGrid as MuiDataGrid,
} from '@kitman/playbook/components';
import { KitmanIcon, KITMAN_ICON_NAMES } from '@kitman/playbook/icons';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useGetAnnotationMedicalTypesQuery } from '@kitman/modules/src/Medical/shared/redux/services/medical';
import { v2styles } from '@kitman/modules/src/Medical/rosters/src/components/CoachesReportTab/styles';
import type { BulkNoteAnnotationForm } from '@kitman/modules/src/Medical/shared/types';
import { OpenIssuesTranslated as OpenIssues } from '@kitman/playbook/components/OpenIssues/index';
import {
  cellNotBeingEditedValue,
  richTextEditorContentWrapperLength,
} from '../utils/utils';
import type { CoachesNote, SortModel, OverviewGridProps } from '../types';
import getBulkNotesPayload, {
  getCoachesNoteData,
} from '../utils/useOverViewGrid';
import renderRichTextEditor from './RichTextEditorRenderer';
import { getColumns } from './Columns';

const NO_PREV_COACHES_NOTE_TOAST_ID = 'NO_PREV_COACHES_NOTE_TOAST_ID';

const CoachesReportRefactorOverviewGrid = (
  props: I18nProps<OverviewGridProps>
) => {
  const dispatch = useDispatch();
  const toastCounterRef = useRef(0);
  const [sortModel, setSortModel] = useState<SortModel>([]);
  const [recentlyCreatedNotes] = useState<Array<CoachesNote>>([]);
  const [noteContent, setNoteContent] = useState<string>('');
  const editorRef = useRef();
  const [richTextEditorIsInFocus, setRichTextEditorIsInFocus] =
    useState<boolean>(false);

  const {
    data: annotationTypes = [],
    error: annotationTypesError,
    isLoading: isAnnotationTypesLoading,
  } = useGetAnnotationMedicalTypesQuery(null, {});

  const coachesNoteAnnotationTypeId =
    !isAnnotationTypesLoading && !annotationTypesError
      ? annotationTypes?.find(
          ({ type }) => type === 'OrganisationAnnotationTypes::DailyStatusNote'
        )?.id
      : null;

  const {
    t,
    isLoading,
    updatePayload,
    setRowSelectionModel,
    rowSelectionModel,
    setModalIsOpen,
    isModalOpen,
    dataGridCurrentDate,
    canCreateNotes,
    canViewInjuries,
    canViewAvailabilityStatus,
    updateCoachesNoteInlinePayLoad,
    lastCoachesReportNoteData,
    isLastCoachesReportNoteSuccess,
    isLastCoachesReportNoteError,
    addMedicalNote,
    addBulkMedicalNotes,
    isBulkMedicalNotesSaveError,
    fetchNextGridRows,
    grid,
    editingCellId,
    setEditingCellId,
  } = props;

  const addToast = (toast: Toast) => {
    dispatch({ type: 'ADD_TOAST', payload: { toast } });
  };

  const handleClose = () => setModalIsOpen(false);

  const updateEditorContent = (content: string) => {
    setNoteContent(content);
    editorRef.current?.setContent(content);
  };

  const handleNoteRetrieved = (): void => {
    // Return if editor not available
    if (!editorRef.current) {
      return;
    }

    const content =
      isLastCoachesReportNoteSuccess && lastCoachesReportNoteData
        ? lastCoachesReportNoteData
        : '';

    if (!(isLastCoachesReportNoteSuccess && lastCoachesReportNoteData)) {
      toastCounterRef.current += 1;
      const toastId = `${NO_PREV_COACHES_NOTE_TOAST_ID}-${toastCounterRef.current}`;
      addToast({
        id: toastId,
        title: t('No previous note to copy'),
        status: 'INFO',
      });
    }

    updateEditorContent(content);
  };

  useEffect(() => {
    if (isBulkMedicalNotesSaveError) {
      addToast({
        id: 'BULK_SAVE_ERROR_TOAST',
        title: t('Error saving note'),
        status: 'ERROR',
      });
    }
  }, [isBulkMedicalNotesSaveError, addToast, t]);

  useEffect(() => {
    if (isLastCoachesReportNoteSuccess || isLastCoachesReportNoteError) {
      handleNoteRetrieved();
    }

    return () => {
      setRichTextEditorIsInFocus(false);
      updateEditorContent('');
    };
  }, [
    isLastCoachesReportNoteSuccess,
    lastCoachesReportNoteData,
    isLastCoachesReportNoteError,
  ]);

  const rows = props.grid.rows.map((row) => {
    const {
      id,
      athlete,
      availability_status,
      open_injuries_illnesses: { has_more: hasMore, issues },
      most_recent_coaches_note,
    } = row;
    return {
      id,
      athlete,
      availability_status,
      open_injuries_illnesses: (
        <OpenIssues
          athleteId={id}
          issueDate={dataGridCurrentDate}
          hasMore={hasMore}
          openIssues={issues.slice(-1)}
        />
      ),
      most_recent_coaches_note: most_recent_coaches_note?.content || '',
      updated_by:
        most_recent_coaches_note?.updated_by?.fullname ||
        most_recent_coaches_note?.created_by?.fullname,
    };
  });

  // Called when checkbox in row selected
  const onRowSelection = (newRowSelectionModel) => {
    setRowSelectionModel(newRowSelectionModel);
  };

  const resetCoachesReportPayloadNextId = (): void => {
    updatePayload({ next_id: null });
  };

  const handleAddNote = (event: SyntheticEvent<HTMLElement>): void => {
    event?.stopPropagation(); // Prevent handleOnCellClick to be called

    // Return if data is not valid
    if (
      typeof coachesNoteAnnotationTypeId !== 'number' ||
      noteContent.length <= richTextEditorContentWrapperLength ||
      isBulkMedicalNotesSaveError
    )
      return;

    const isBulkSave = rowSelectionModel?.length > 1;
    const bulkPayload: BulkNoteAnnotationForm = getBulkNotesPayload(
      noteContent,
      rowSelectionModel,
      recentlyCreatedNotes,
      coachesNoteAnnotationTypeId,
      dataGridCurrentDate
    );

    const coachesNoteData = getCoachesNoteData(
      coachesNoteAnnotationTypeId,
      editingCellId,
      dataGridCurrentDate,
      noteContent
    );

    if (isBulkSave) {
      addBulkMedicalNotes(bulkPayload);
    } else {
      addMedicalNote({
        ...coachesNoteData,
      });
    }

    setRowSelectionModel([]);
    setEditingCellId(cellNotBeingEditedValue);
    setModalIsOpen(false);
  };

  // Render functions
  const renderNoteCell = (
    isEditing: boolean,
    noteCellContent: string
  ): React$Element<any> | null => {
    if (isEditing && rowSelectionModel?.length <= 1) {
      return renderRichTextEditor({
        editingCellId,
        initValue: noteCellContent,
        noteContent,
        setNoteContent,
        setEditingCellId,
        isModalOpen,
        handleAddNote,
        editorRef,
        canCreateNotes,
        richTextEditorIsInFocus,
        setRichTextEditorIsInFocus,
        dataGridCurrentDate,
        updateCoachesNoteInlinePayLoad,
        resetCoachesReportPayloadNextId,
      });
    }

    if (noteCellContent.length > 1) {
      return <RichTextDisplay value={noteCellContent} isAbbreviated={false} />;
    }

    return canCreateNotes ? (
      <Box sx={{ paddingTop: '1.4rem' }}>
        <KitmanIcon name={KITMAN_ICON_NAMES.Add} />
      </Box>
    ) : null;
  };

  const renderModal = () => {
    return (
      <Modal
        open={isModalOpen !== undefined ? isModalOpen : false}
        onClose={handleClose}
      >
        <Box sx={v2styles.modalWrapper}>
          <Typography component="h2" id="modal-modal-title" variant="h6">
            {t('Note')}
          </Typography>
          {renderRichTextEditor({
            editingCellId,
            initValue: '',
            noteContent,
            setNoteContent,
            setEditingCellId,
            isModalOpen,
            handleAddNote,
            editorRef,
            canCreateNotes,
            richTextEditorIsInFocus,
            setRichTextEditorIsInFocus,
            dataGridCurrentDate,
            updateCoachesNoteInlinePayLoad,
            resetCoachesReportPayloadNextId,
          })}
          <Box sx={v2styles.buttonContainer}>
            <Button onClick={handleAddNote} variant="contained" color="primary">
              {t('Add')}
            </Button>
            <Button onClick={handleClose} variant="outlined">
              {t('Cancel')}
            </Button>
          </Box>
        </Box>
      </Modal>
    );
  };

  const columns = getColumns({
    setRichTextEditorIsInFocus,
    editingCellId,
    setEditingCellId,
    renderNoteCell,
    canViewInjuries,
    canViewAvailabilityStatus,
    rowSelectionModel,
  });

  return (
    <>
      <Box
        sx={[
          v2styles.dataGridWrapper,
          canCreateNotes && v2styles.hideCellBorder,
          { height: '100%' },
        ]}
      >
        <MuiDataGrid
          checkboxSelection
          columns={columns}
          rows={rows}
          rowCount={rows?.length}
          rowSelection
          emptyTableText={t('No rows')}
          loading={isLoading}
          onSortModelChange={(newModel) => setSortModel(newModel)}
          sortModel={sortModel}
          getRowHeight={() => 'auto'}
          onRowSelectionModelChange={(newRowSelectionModel) =>
            onRowSelection(newRowSelectionModel)
          }
          rowSelectionModel={rowSelectionModel}
          disableRowSelectionOnClick
        />
        {!!grid?.next_id && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              padding: '0.5rem',
            }}
          >
            <Button
              disabled={isLoading}
              onClick={fetchNextGridRows}
              variant="contained"
            >
              {t('Load more')}
            </Button>
          </Box>
        )}
      </Box>

      {renderModal()}
    </>
  );
};

export const CoachesReportRefactorOverviewGridTranslated = withNamespaces()(
  CoachesReportRefactorOverviewGrid
);
export default CoachesReportRefactorOverviewGrid;
