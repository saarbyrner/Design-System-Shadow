/* eslint-disable camelcase */
// @flow
import { useRef, useLayoutEffect, useState, useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import { keyboardkeys } from '@kitman/common/src/variables';
import {
  getLastCoachesReportNote,
  getMultipleCoachesNotes,
} from '@kitman/services/src/services/medical';
import { saveMedicalNote, saveBulkMedicalNotes } from '@kitman/services';
import {
  DataGrid as KitmanDataGrid,
  TextLink,
  UserAvatar,
  EditableInput,
  RichTextDisplay,
} from '@kitman/components';
import {
  Box,
  Modal,
  Typography,
  Button,
  RichTextEditor,
  Chip,
  Tooltip,
  DataGrid as MuiDataGrid,
  Avatar,
  AvailabilityLabel,
} from '@kitman/playbook/components';
import { KitmanIcon, KITMAN_ICON_NAMES } from '@kitman/playbook/icons';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { Cells } from '@kitman/components/src/DataGrid';
import type {
  BulkNoteAnnotationForm,
  BulkNote,
  AnnotationForm,
} from '@kitman/modules/src/Medical/shared/types';
import { useGetAnnotationMedicalTypesQuery } from '@kitman/modules/src/Medical/shared/redux/services/medical';
import { OpenIssuesTranslated as OpenIssues } from '../../RosterOverviewTab/OpenIssues';
import { gridStyle as v1styles, v2styles, commonStyles } from '../styles';
import type {
  CoachesNote,
  SortModel,
  OverviewGridProps as Props,
} from '../types';

const gridBottomMarginToHideOverflowOnBody = '70px';
const cellNotBeingEditedValue = -1; // used to set editingcellsId state to a default value
const richTextEditorContentWrapperLength = 7; // RichTextEditor returns text wrapped in '<p></p>' (7 chars long)

const CommentsOverviewGrid = (props: I18nProps<Props>) => {
  const addEditFunc = props.addEditComment;
  const rosterContainerRef = useRef();
  const editorRef = useRef();
  const [height, setHeight] = useState();
  const [gridColumns, setGridColumns] = useState<Cells>([]);
  const [sortModel, setSortModel] = useState<SortModel>([]);
  const [recentlyCreatedNotes] = useState<Array<CoachesNote>>([]);
  const [noteContent, setNoteContent] = useState<string>('');
  const [editingCellId, setEditingCellId] = useState<number>(
    cellNotBeingEditedValue
  );
  const [richTextEditorIsInFocus, setRichTextEditorIsInFocus] =
    useState<boolean>(false);
  const availabilityInfoDisabledFlag =
    window.featureFlags['availability-info-disabled'];
  const {
    isLoading,
    isReadyForMoreData,
    coachesReportV2Enabled,
    setRowSelectionModel,
    setRequestStatus,
    rowSelectionModel,
    setModalIsOpen,
    isModalOpen,
  } = props;

  const {
    data: annotationTypes = [],
    error: annotationTypesError,
    isLoading: isAnnotationTypesLoading,
  } = useGetAnnotationMedicalTypesQuery(null, {
    skip: !coachesReportV2Enabled,
  });

  const coachesNoteAnnotationTypeId =
    coachesReportV2Enabled && !isAnnotationTypesLoading && !annotationTypesError
      ? annotationTypes?.find(
          ({ type }) => type === 'OrganisationAnnotationTypes::DailyStatusNote'
        )?.id
      : null;

  const handleClose = () => setModalIsOpen(false);

  useLayoutEffect(() => {
    if (rosterContainerRef.current) {
      const { y } = rosterContainerRef?.current?.getBoundingClientRect();
      setHeight(
        `calc((100vh - ${y}px) - ${gridBottomMarginToHideOverflowOnBody})`
      );
    }
  }, []);

  const handleCopyMultipleNotes = async () => {
    getMultipleCoachesNotes(
      rowSelectionModel,
      ['OrganisationAnnotationTypes::DailyStatusNote'],
      props.dataGridCurrentDate
    ).then(() => {
      props.rehydrateGrid();
    });
  };

  useEffect(() => {
    if (rowSelectionModel?.length > 0) {
      handleCopyMultipleNotes();
    }
  }, [props.isInMultiCopyNoteMode]);

  const getGridColumnsByPermission = () => {
    const columnConfig = [
      {
        id: 'athlete',
        displayName: props.t('Athlete'),
        isPermitted: true,
      },
      {
        id: 'open_injuries_illnesses',
        displayName: props.t('Open Injury/ Illness'),
        isPermitted: props.canViewInjuries === true,
      },
      {
        id: 'comment',
        displayName: props.t('Comment'),
        isPermitted: true,
      },
    ];

    return columnConfig
      .filter((col) => col.isPermitted)
      .map((column) => {
        return {
          id: column.id,
          row_key: column.id,
          content: (
            <div style={v1styles.headerCell}>
              <span style={v1styles[`headerCell__${column.id}`]}>
                {column.displayName}
              </span>
            </div>
          ),
          isHeader: true,
        };
      });
  };

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

  const CommentField = ({ rowData }) => {
    const comment = rowData?.availability_comment || '';
    const [commentValue, setCommentValue] = useState(comment);

    const handleAddEditReasonHeader = (value) => {
      setCommentValue(value);

      // update comment data
      return addEditFunc(rowData, value);
    };

    return (
      <div style={v1styles.commentContainer}>
        <EditableInput
          value={commentValue}
          onSubmit={(value) => handleAddEditReasonHeader(value)}
          isInvalid={false}
          allowOnlyNumbers={false}
          allowSavingEmpty
        />
      </div>
    );
  };

  useEffect(() => {
    setGridColumns(getGridColumnsByPermission());
  }, [props.grid]);

  const getCellContent = ({ row_key: rowKey }, rowData) => {
    if (!rowKey) {
      return {};
    }
    switch (rowKey) {
      case 'athlete':
        return (
          <div style={v1styles.athleteCell}>
            <div style={v1styles.imageContainer}>
              <UserAvatar
                url={rowData.athlete.avatar_url}
                firstname={rowData.athlete.fullname}
                displayInitialsAsFallback
                availability={
                  !availabilityInfoDisabledFlag &&
                  props.canViewMedicalAvailability
                    ? rowData.athlete.availability
                    : undefined
                }
                size="MEDIUM"
              />
            </div>
            <div style={v1styles.detailsContainer}>
              <TextLink
                text={rowData.athlete.fullname}
                href={`/medical/athletes/${rowData.id}`}
                kitmanDesignSystem
              />
              <span data-testid="positionRow" style={commonStyles.position}>
                {rowData.player_id
                  ? `${rowData.player_id} - ${rowData.athlete.position}`
                  : rowData.athlete.position}
              </span>
            </div>
          </div>
        );
      case 'open_injuries_illnesses':
        return (
          <OpenIssues
            athleteId={rowData.id}
            hasMore={rowData.open_injuries_illnesses.has_more}
            openIssues={rowData.open_injuries_illnesses.issues}
          />
        );
      case 'comment': {
        return <CommentField rowData={rowData} />;
      }

      default:
        return <span style={v1styles.defaultCell}>{rowData[rowKey]}</span>;
    }
  };

  // Called when checkbox in row selected
  const onRowSelection = (newRowSelectionModel) => {
    setRowSelectionModel(newRowSelectionModel);
  };

  const getGridRows = () => {
    const gridRows = props.grid.rows.map((row) => {
      const cells = gridColumns.map((column) => {
        const content = getCellContent(column, row);

        return {
          id: column.row_key,
          content,
          allowOverflow: false,
        };
      });

      return {
        id: row.id,
        cells,
        classnames: {
          athlete__row: true,
        },
      };
    });

    return gridRows;
  };

  const handleScroll = (event) => {
    // Prevent fetch data being called on wrong elements
    // Input emits onScroll when input text reaches end of input and text scrolls left within the input

    const isCorrectElement = event.target.className === 'dataGrid';
    if (isCorrectElement) {
      const target = event.target;
      const scrollHeight = target.scrollHeight;
      const scrollTop = target.scrollTop;
      const userPositionInContainer = scrollHeight - scrollTop;
      const userAtEndOfContainer =
        userPositionInContainer - 1 <= target.clientHeight;

      if (userAtEndOfContainer && isReadyForMoreData) {
        props.fetchMoreData();
      }
    }
  };

  const renderKitmanDataGrid = () => (
    <div
      id="rosterGridRef"
      // $FlowFixMe ref typing issue - return type valid when this block runs
      ref={rosterContainerRef}
      style={v1styles.grid}
      onScroll={handleScroll}
    >
      <KitmanDataGrid
        columns={getGridColumnsByPermission()}
        rows={getGridRows()}
        emptyTableText={props.t('There are no coach reports')}
        isTableEmpty={props.grid.rows.length === 0}
        isFullyLoaded={props.coachesReportGridLoaded}
        setIsFullyRendered={props.coachesReportGridLoaded}
        fetchMoreData={props.fetchMoreData}
        isLoading={isLoading}
        // A height is forced on this component as the scrollOnBody event is triggered regardless of what tab you are viewing
        maxHeight={height}
      />
    </div>
  );

  const openIssuesFormatter = ({ row }: any) => {
    return row.open_injuries_illnesses;
  };

  const athleteFormatter = ({ row }) => {
    return (
      <Box sx={v2styles.athleteCell} data-testid="coachesReport|AthleteCell">
        <Avatar
          src={row.athlete.avatar_url}
          variant="circle"
          sx={{
            height: '2rem',
            width: '2rem',
            marginRight: '1.25rem',
            '&:first-of-type': {
              marginRight: '0rem',
            },
          }}
        />

        <Box sx={v2styles.athleteDetailsContainer}>
          <TextLink
            text={row.athlete.fullname}
            href={`/medical/athletes/${row.id}`}
            kitmanDesignSystem
          />
          <Typography
            component="span"
            data-testid="positionRow"
            sx={commonStyles.position}
          >
            {row.player_id
              ? `${row.player_id} - ${row.athlete.position}`
              : row.athlete.position}
          </Typography>
        </Box>
      </Box>
    );
  };

  const handleOnCellClick = ({ row }) => {
    const { id } = row;
    if (editingCellId !== id && props.canCreateNotes) {
      setRichTextEditorIsInFocus(false);
      setEditingCellId(id);
    }
  };

  const coachesNoteData: AnnotationForm = {
    annotationable_type: 'Athlete',
    organisation_annotation_type_id: coachesNoteAnnotationTypeId,
    annotationable_id: editingCellId,
    athlete_id: editingCellId,
    title: props.t('Daily Status Note'),
    annotation_date: props.dataGridCurrentDate,
    content: noteContent,
    illness_occurrence_ids: [],
    injury_occurrence_ids: [],
    chronic_issue_ids: [],
    restricted_to_doc: false,
    restricted_to_psych: false,
    attachments_attributes: [],
    annotation_actions_attributes: [],
    scope_to_org: true,
  };

  const getBulkNotesPayload = () => {
    const bulkNotes: Array<BulkNote> = rowSelectionModel?.map((row) => {
      return { annotationable_type: 'Athlete', annotationable_id: row };
    });

    const bulkPayload: BulkNoteAnnotationForm = {
      // $FlowIgnore - ensures that coachesNoteAnnotationTypeId is a number on line 375
      organisation_annotation_type_id: coachesNoteAnnotationTypeId,
      annotationables: bulkNotes,
      title: props.t('Daily Status Note'),
      annotation_date: props.dataGridCurrentDate,
      content: noteContent,
      scope_to_org: true,
    };

    return bulkPayload;
  };

  const handleAddNote = (event) => {
    if (typeof coachesNoteAnnotationTypeId !== 'number') return;
    setRequestStatus('PENDING');
    // Prevent handleOnCellClick to be called - this sets the id of the row/cell being edited
    event?.stopPropagation();
    const textContentWithTags = noteContent;
    const isBulkSave = rowSelectionModel?.length > 1;
    const bulkPayload = getBulkNotesPayload();

    // Ensure text inputted in the modal
    // RichTextEditor returns text wrapped in '<p></p>' (7 chars long)
    if (textContentWithTags.length > 7) {
      // Persist to BE then save new note in state to prevent need for refetch
      if (isBulkSave) {
        saveBulkMedicalNotes(bulkPayload).then(() => {
          props.rehydrateGrid();
          setRequestStatus('SUCCESS');
        });
      } else {
        saveMedicalNote(coachesNoteData).then(() => {
          props.rehydrateGrid();
          setRequestStatus('SUCCESS');
        });
      }

      setNoteContent('');
      setRowSelectionModel([]);
      setEditingCellId(cellNotBeingEditedValue);
      setModalIsOpen(false);
    } else {
      setRequestStatus('SUCCESS');
    }
  };

  const handleCopyLastReport = (cellId: number) => {
    getLastCoachesReportNote(
      cellId,
      ['OrganisationAnnotationTypes::DailyStatusNote'],
      props.dataGridCurrentDate
    ).then((note) => {
      setRichTextEditorIsInFocus(true);
      if (editorRef.current) {
        editorRef.current.setContent(note);
        setNoteContent(note);
      }
    });
  };

  const renderRichTextEditor = (value: string) => {
    return (
      <Box
        sx={{
          position: 'relative',
          '.ProseMirror.remirror-editor': { overflowY: 'auto', cursor: 'text' },
          '.remirror-editor-wrapper': { paddingBottom: '2.5rem' },
        }}
      >
        {!isModalOpen && (
          <>
            <Box sx={v2styles.inlineRichtextEditorButtons}>
              <Button onClick={() => setEditingCellId(cellNotBeingEditedValue)}>
                {props.t('Cancel')}
              </Button>
              <Button
                onClick={handleAddNote}
                disabled={noteContent?.length <= 7}
              >
                {props.t('Save')}
              </Button>
            </Box>
            {!value &&
              noteContent?.length <= richTextEditorContentWrapperLength &&
              !richTextEditorIsInFocus &&
              props.canCreateNotes && (
                <Button
                  onClick={handleAddNote}
                  sx={v2styles.inlineCopyLastNoteButton}
                >
                  <Chip
                    sx={{
                      width: '100%',
                      height: '100%',
                    }}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ paddingRight: '0.4rem' }}>
                          <KitmanIcon
                            name={KITMAN_ICON_NAMES.FileCopyOutlined}
                          />
                        </Box>
                        <Typography variant="body2">
                          {props.t('Copy last note')}
                        </Typography>
                      </Box>
                    }
                    color="default"
                    size="medium"
                    variant="filled"
                    onClick={() => handleCopyLastReport(editingCellId)}
                  />
                </Button>
              )}
          </>
        )}
        <Box
          onFocus={() => setRichTextEditorIsInFocus(true)}
          onBlur={() => setRichTextEditorIsInFocus(false)}
        >
          <RichTextEditor
            value={value}
            forwardedRef={editorRef}
            sx={{ height: '12.5rem' }}
            onChange={(newNoteValue) => {
              if (noteContent !== newNoteValue) {
                setNoteContent(newNoteValue);
              }
            }}
          />
        </Box>
      </Box>
    );
  };

  // Finds a recently(since last fetch) created/edited note by rowId
  const findNoteById = (id: number) => {
    const matchingNote = recentlyCreatedNotes.find((note) => note.rowId === id);
    return matchingNote ? matchingNote.newNoteValue : null;
  };

  // Provides inner conent for note cells
  const renderNoteCell = (isEditing, noteCellContent) => {
    if (isEditing && rowSelectionModel?.length <= 1) {
      return renderRichTextEditor(noteCellContent);
    }

    if (noteCellContent.length > 1) {
      return <RichTextDisplay value={noteCellContent} isAbbreviated={false} />;
    }

    return (
      props.canCreateNotes && (
        <Box sx={{ paddingTop: '1.4rem' }}>
          <KitmanIcon name={KITMAN_ICON_NAMES.Add} />
        </Box>
      )
    );
  };

  // formatter function used to make note cells rendered with elements instead of data from payload
  const noteCellFormatter = ({ row }) => {
    const isEditing = editingCellId === row.id;
    const noteCellContent =
      findNoteById(row.id) || row.most_recent_coaches_note || '';
    return (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          outline: 'none',
        }}
        onClick={() => handleOnCellClick({ row })}
      >
        <Box
          onKeyDown={(event) => {
            // Scrollbar pressed - prevent grid scroll behaviour
            if (
              event.key === keyboardkeys.space ||
              event.key === keyboardkeys.upArrow ||
              event.key === keyboardkeys.downArrow ||
              event.key === keyboardkeys.leftArrow ||
              event.key === keyboardkeys.rightArrow
            ) {
              event.stopPropagation();
              return false;
            }
            // Esc pressed - close the richTextEditor
            if (event.key === keyboardkeys.esc) {
              setEditingCellId(cellNotBeingEditedValue);
            }
            return false;
          }}
        >
          {
            /* show tooltip when not in edit mode */
            editingCellId === cellNotBeingEditedValue &&
            props.canCreateNotes ? (
              <Tooltip
                title={
                  rowSelectionModel?.length > 1
                    ? props.t('Bulk note creation mode on')
                    : props.t('Add note')
                }
              >
                <Box>{renderNoteCell(isEditing, noteCellContent)}</Box>
              </Tooltip>
            ) : (
              renderNoteCell(isEditing, noteCellContent)
            )
          }
        </Box>
      </Box>
    );
  };

  const columns = [
    {
      field: 'athlete',
      valueGetter: (params) => params.row.athlete.fullname,
      headerName: props.t('Player'),
      renderCell: athleteFormatter,
      flex: 0.8,
      editable: false,
      sortable: true,
    },
    {
      field: 'availability_status',
      valueGetter: (params) => params.row.availability_status.availability,
      renderCell: ({ row }) => (
        <AvailabilityLabel status={row.availability_status} />
      ),
      headerName: props.t('Availability status'),
      flex: 0.8,
      editable: false,
      sortable: true,
    },
    {
      field: 'open_injuries_illnesses',
      dataField: 'open_injuries_illnesses',
      headerName: props.t('Open Injury/ Illness'),
      renderCell: openIssuesFormatter,
      flex: 1.2,
      editable: false,
      sortable: false,
    },
    {
      field: 'most_recent_coaches_note',
      dataField: 'most_recent_coaches_note',
      renderCell: noteCellFormatter,
      headerName: props.t('Note'),
      flex: 1.2,
      editable: false,
      sortable: true,
    },
    {
      field: 'updated_by',
      valueGetter: (params) => params.row?.updated_by,
      headerName: props.t('Updated by'),
      flex: 1,
      editable: false,
      sortable: true,
    },
  ];

  const renderModal = () => {
    return (
      <Modal
        open={isModalOpen !== undefined ? isModalOpen : false}
        onClose={handleClose}
      >
        <Box sx={v2styles.modalWrapper}>
          <Typography component="h2" id="modal-modal-title" variant="h6">
            {props.t('Note')}
          </Typography>
          {renderRichTextEditor(noteContent)}
          <Box sx={v2styles.buttonContainer}>
            <Button onClick={handleAddNote} variant="contained" color="primary">
              {props.t('Add')}
            </Button>
            <Button onClick={handleClose} variant="outlined">
              {props.t('Cancel')}
            </Button>
          </Box>
        </Box>
      </Modal>
    );
  };

  const renderMuiDataGrid = () => {
    return (
      <>
        <Box
          sx={[
            v2styles.dataGridWrapper,
            props.canCreateNotes && v2styles.hideCellBorder,
          ]}
        >
          <MuiDataGrid
            checkboxSelection
            columns={columns}
            rows={rows}
            rowCount={rows?.length}
            rowSelection
            infiniteLoading
            infiniteLoadingCall={() => {
              if (isReadyForMoreData) {
                props.fetchMoreData();
              }
            }}
            emptyTableText={props.t('No rows')}
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
        </Box>
        {renderModal()}
      </>
    );
  };

  if (coachesReportV2Enabled) {
    return renderMuiDataGrid();
  }

  return renderKitmanDataGrid();
};

export const CommentsOverviewGridTranslated =
  withNamespaces()(CommentsOverviewGrid);
export default CommentsOverviewGrid;
