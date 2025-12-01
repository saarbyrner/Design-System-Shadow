// @flow
import { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { withNamespaces } from 'react-i18next';
import _uniqueId from 'lodash/uniqueId';
import { parse } from 'json2csv';

import { useGridApiRef } from '@kitman/playbook/hooks';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import {
  DataGridPremium,
  ToggleButtonGroup,
  ToggleButton,
  Box,
  IconButton,
  CircularProgress,
  TextField,
} from '@kitman/playbook/components';
import { gridStringOrNumberComparator } from '@kitman/playbook/utils';
import { type I18nProps } from '@kitman/common/src/types/i18n';
import { PARSE_STATE } from '@kitman/modules/src/shared/MassUpload/utils/consts';
import {
  TOGGLE_OPTIONS,
  IMPORT_TYPES,
  IMPORT_TYPES_WITH_EDITABLE_FEATURES,
} from '@kitman/modules/src/shared/MassUpload/New/utils/consts';
import ErrorState from '@kitman/modules/src/shared/MassUpload/New/components/ErrorState';
import DormantState from '@kitman/modules/src/shared/MassUpload/New/components/DormantState';
import useParseCSV from '@kitman/modules/src/shared/MassUpload/hooks/useParseCSV';
import useAppHeaderHeight from '@kitman/common/src/hooks/useAppHeaderHeight';
import { type SetState } from '@kitman/common/src/types/react';
import { GRID_CONFIG } from '@kitman/modules/src/shared/MassUpload/utils';
import {
  type UseGrid,
  type UseGridData,
  type ToggleOptions,
  type VendorOption,
  type AttachedFileOrFilePondLike,
} from '@kitman/modules/src/shared/MassUpload/New/types';
import { type SourceFormDataResponse } from '@kitman/modules/src/shared/MassUpload/services/getSourceFormData';
import colors from '@kitman/common/src/variables/colors';
import { type IntegrationEvents } from '@kitman/modules/src/shared/MassUpload/services/getIntegrationData';
import { ToastDialog } from '@kitman/components/src/Toast/KitmanDesignSystem';
import { type Toast, type ToastDispatch } from '@kitman/components/src/types';
import { type ToastAction } from '@kitman/components/src/Toast/KitmanDesignSystem/hooks/useToasts';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import pacEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/performanceAndCoaching';
import { getMassUploadImportType } from '@kitman/common/src/utils/TrackingData/src/data/shared/getSharedEventData';

import { getTitleLabels } from '../../utils';
import InstructionsDrawer from '../InstructionsDrawer';
import EventDataContainer from '../EventDataContainer';
import getStyles from './styles';

type Props = {
  useGrid: (data: UseGridData) => UseGrid,
  expectedHeaders: Array<string>,
  optionalExpectedHeaders: Array<string>,
  allowAdditionalHeaders: boolean,
  importType: $Values<typeof IMPORT_TYPES>,
  activeStep: number,
  setActiveStep: SetState<number>,
  attachedFile: AttachedFileOrFilePondLike,
  setAttachedFile: SetState<AttachedFileOrFilePondLike>,
  setHasErrors: SetState<boolean>,
  setHasPartialErrors: SetState<boolean>,
  uploadSteps: Array<{ title: string, caption: string }>,
  selectedIntegration: {
    id: number | string,
    name: string,
    sourceIdentifier: string,
  },
  setSelectedIntegration: SetState<{ id: number | string, name: string }>,
  selectedVendor: VendorOption,
  setSelectedVendor: SetState<VendorOption>,
  integrationData: SourceFormDataResponse,
  hasErrors: boolean,
  eventTime: Date,
  eventType: string,
  integrationEvents: IntegrationEvents,
  selectedApiImport: string | null,
  setSelectedApiImport: SetState<string | null>,
  toastDispatch: ToastDispatch<ToastAction>,
  toasts: Array<Toast>,
};

const getUniqueId = () => _uniqueId();

const Uploader = (props: I18nProps<Props>) => {
  const [hasFilePondErrored, setHasFilePondErrored] = useState<boolean>(false);
  const [hasFilePondProcessed, setHasFilePondProcessed] =
    useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(true);
  const [toggleValue, setToggleValue] = useState<ToggleOptions>(
    TOGGLE_OPTIONS.All
  );
  const [customErrors, setCustomErrors] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);

  const gridApiRef = useGridApiRef();
  const headerHeight = useAppHeaderHeight();
  const previousFileRef = useRef(null);
  const rowsThatHaveBeenDeletedRef = useRef(null);
  const { trackEvent } = useEventTracking();

  const getAreEditableFeaturesEnabled = () =>
    window.getFlag('pac-mass-upload-editing-features') &&
    IMPORT_TYPES_WITH_EDITABLE_FEATURES.includes(props.importType);

  const {
    onRemoveCSV,
    onHandleParseCSV: onAttachFile,
    queueState,
    parseResult,
    setParseState,
    parseState,
  } = useParseCSV({
    expectedHeaders: props.expectedHeaders,
    optionalExpectedHeaders: props.optionalExpectedHeaders,
    allowAdditionalHeaders: props.allowAdditionalHeaders,
    config: GRID_CONFIG,
    hasFilePondErrored,
    hasFilePondProcessed,
    allowReUpload: true,
    importType: props.importType,
    vendor: props.selectedVendor?.label,
    setCustomErrors,
  });

  const { grid, ruleset } = props.useGrid({
    parsedCsv: parseResult.data || [],
    file: props.attachedFile?.file,
    source: props.selectedVendor?.id,
    setParseState,
    setCustomErrors,
    activeStep: props.activeStep,
    setHasFilePondProcessed,
  });

  const clearUploadState = () => {
    onRemoveCSV();
    setHasFilePondProcessed(false);
    setHasFilePondErrored(false);
    props.setActiveStep(props.importType === IMPORT_TYPES.EventData ? 1 : 0);
    props.setAttachedFile(undefined);
  };

  const resetState = () => {
    setHasFilePondProcessed(false);
    setHasFilePondErrored(false);
    setParseState(PARSE_STATE.Dormant);
    props.setActiveStep(props.importType === IMPORT_TYPES.EventData ? 1 : 0);
    props.setHasErrors(false);
    props.setHasPartialErrors(false);
  };

  // Start processing of attached csv file
  useEffect(() => {
    if (
      props.activeStep === props.uploadSteps.length - 1 &&
      queueState.attachment &&
      // This logic for this importer is controlled in useEventDataImporterUploadGrid.js
      props.importType !== IMPORT_TYPES.EventData
    ) {
      setHasFilePondProcessed(true);
      setHasFilePondErrored(false);
    }
  }, [props.activeStep, queueState.attachment]);

  // Mapped columns and rows are required to format the current implementation of MassUpload,
  // with MUI implementation, while still supporting the legacy implementation. Wrapped in
  // useMemo for performance reasons, this data can be very large so only want to update
  // when the data changes.
  // TODO: Once MUI MassUpload has fully been rolled-out to all importers, the hooks can
  // be re-written to return data similar to below.
  const mappedColumns = useMemo(
    () =>
      grid.columns.map((column) => ({
        field: column.id,
        headerName: column.content?.props.title,
        cellClassName: (params) =>
          typeof params.row[params.field].props?.children === 'string'
            ? 'valid_cell'
            : 'invalid_cell',
        renderCell: (params) => {
          return <>{params.value}</>;
        },
        sortComparator: (a, b) =>
          gridStringOrNumberComparator(a.props.children, b.props.children),
        editable: true,
        renderEditCell: ({ id, field, value }) => {
          const valueBeforeEdit =
            typeof value.props?.children === 'string'
              ? value.props.children
              : value.props?.componentsProps?.valueForDataGrid;
          const cleansedValue =
            typeof value === 'string' ? value : valueBeforeEdit;

          return (
            <TextField
              hiddenLabel
              autoFocus
              InputProps={{ disableUnderline: true }}
              value={cleansedValue}
              onChange={(e) =>
                gridApiRef.current.setEditCellValue({
                  id,
                  field,
                  value: e.target.value,
                })
              }
            />
          );
        },
        valueFormatter: (cellValue) => {
          const formattedValue =
            typeof cellValue?.props?.children === 'string'
              ? cellValue.props.children
              : cellValue?.props?.componentsProps?.valueForDataGrid;
          return formattedValue ?? cellValue;
        },
      })),
    [grid.columns, gridApiRef.columns]
  );

  const mappedRows = useMemo(
    () =>
      grid.rows.map((row, index) => ({
        uniqueId: index,
        hasErrors: Boolean(row.classnames.is__error),
        ...row.cells.reduce(
          (obj, item) => Object.assign(obj, { [item.id]: item.content }),
          {}
        ),
      })),
    [grid.rows]
  );

  const rowsWithErrors = useMemo(
    () => mappedRows.filter((row) => row.hasErrors),
    [mappedRows]
  );
  const rowsWithoutErrors = useMemo(
    () => mappedRows.filter((row) => !row.hasErrors),
    [mappedRows]
  );

  const exportAndReAttachCsvFile = useCallback(
    (editedRow, deletedRows, action = 'edit') => {
      const getRowAsValues = (row) => {
        const { uniqueId, hasErrors, ...rest } = row;
        return Object.keys(rest).reduce((acc, key) => {
          const value = rest[key];
          if (typeof value !== 'object') {
            acc[key] = value;
          } else if (typeof value.props?.children === 'string') {
            acc[key] = value.props.children;
          } else {
            acc[key] = value.props?.componentsProps?.valueForDataGrid;
          }
          return acc;
        }, {});
      };

      const filteredOutDeletedRows =
        action === 'delete'
          ? mappedRows.filter((row) => {
              return !deletedRows?.some(
                (deletedRow) => deletedRow.uniqueId === row.uniqueId
              );
            })
          : mappedRows;

      const valueOnlyGridData = filteredOutDeletedRows.map((row) =>
        editedRow && row.uniqueId === editedRow.uniqueId
          ? getRowAsValues(editedRow)
          : getRowAsValues(row)
      );

      const parsedFile = new File(
        [valueOnlyGridData.length > 0 ? parse(valueOnlyGridData) : new Blob()],
        // $FlowIgnore[incompatible-use] attachment will exist
        queueState.attachment.filename,
        {
          type: 'text/csv',
        }
      );

      // Create an object that mimics the FilePond file object structure
      const filePondLikeObject = {
        ...parsedFile,
        file: parsedFile,
        fileSize: parsedFile.size,
        filename: parsedFile.name,
        id: getUniqueId(),
      };

      props.setAttachedFile(filePondLikeObject);
      onAttachFile([filePondLikeObject]);
      trackEvent(
        action === 'edit'
          ? pacEventNames.editedRowMassUpload
          : pacEventNames.deletedRowMassUpload,
        getMassUploadImportType(props.importType)
      );
      return editedRow;
    },
    [
      mappedRows,
      queueState.attachment,
      props.setAttachedFile,
      onAttachFile,
      trackEvent,
      props.importType,
    ]
  );

  const handleUndo = useCallback(() => {
    rowsThatHaveBeenDeletedRef.current = null;
    props.setAttachedFile(previousFileRef.current);
    onAttachFile([previousFileRef.current]);
    props.toastDispatch({
      type: 'RESET_TOASTS',
    });
    trackEvent(
      pacEventNames.undoRowDeletionMassUpload,
      getMassUploadImportType(props.importType)
    );
  }, [
    props.setAttachedFile,
    onAttachFile,
    props.toastDispatch,
    trackEvent,
    props.importType,
  ]);

  useEffect(() => {
    if (
      parseState === PARSE_STATE.FilePondError ||
      (((props.activeStep === 0 &&
        props.importType !== IMPORT_TYPES.EventData) ||
        (props.activeStep === 1 &&
          props.importType === IMPORT_TYPES.EventData)) &&
        parseState !== PARSE_STATE.Dormant)
    ) {
      resetState();
      return;
    }
    if (parseState === PARSE_STATE.Error) {
      props.setHasErrors(true);
      return;
    }
    if (parseState === PARSE_STATE.Complete) {
      props.setHasErrors(rowsWithErrors.length > 0);
      props.setHasPartialErrors(
        Boolean(customErrors?.isSuccess) &&
          rowsWithErrors.length < mappedRows.length &&
          mappedRows.length !== rowsThatHaveBeenDeletedRef.current?.length
      );
    }
  }, [parseState, onRemoveCSV, props.activeStep]);

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 25,
    page: 0,
  });

  const bulkActions = useMemo(
    () => [
      {
        key: 'delete',
        label: 'Delete',
        onAction: (rowsToDelete) => {
          previousFileRef.current = props.attachedFile;
          rowsThatHaveBeenDeletedRef.current = selectedRows;
          const mappedRowsToDelete = rowsToDelete.map((row) => ({
            uniqueId: row,
            action: 'delete',
          }));

          exportAndReAttachCsvFile(null, mappedRowsToDelete, 'delete');
          setSelectedRows([]);

          props.toastDispatch({
            type: 'CREATE_TOAST',
            toast: {
              id: _uniqueId(),
              status: 'SUCCESS',
              title: props.t(
                '{{rowsToBeDeletedCount}} row(s) deleted successfully',
                {
                  rowsToBeDeletedCount: rowsToDelete.length,
                }
              ),
              removalDelay: 'LongRemovalDelay',
              links: [
                {
                  id: 1,
                  text: 'Undo',
                  metadata: { action: 'undo' },
                  link: '',
                },
              ],
            },
          });
        },
      },
    ],
    [
      props.attachedFile,
      selectedRows,
      exportAndReAttachCsvFile,
      props.toastDispatch,
      props.t,
    ]
  );

  const renderDataGrid = (rows) => (
    <DataGridPremium
      sx={{
        '.invalid_cell': {
          background: colors.red_100_20,
          border: `1px solid ${colors.white}`,
          '&.MuiDataGrid-cell--editing:focus-within': {
            outline: `1px solid ${colors.red_100} !important`,
          },
        },
        '.MuiDataGrid-cell--withRenderer:focus': {
          outline: `1px solid ${colors.blue_100}`,
        },
        '.MuiDataGrid-cell--editing:focus-within': {
          outline: `1px solid ${colors.blue_100} !important`,
        },
        '.MuiDataGrid-scrollbar': {
          display: 'block', // Ensures scrollbar is full width of container
        },
        input: { background: colors.white },
      }}
      apiRef={gridApiRef}
      columns={mappedColumns}
      rows={rows}
      pagination
      disableColumnReorder={false}
      disableColumnResize={false}
      isCellEditable={getAreEditableFeaturesEnabled}
      processRowUpdate={exportAndReAttachCsvFile}
      getRowId={(row) => row.uniqueId}
      paginationModel={paginationModel}
      onPaginationModelChange={setPaginationModel}
      showFilterButton={false}
      showExportButton={false}
      showQuickFilter={false}
      checkboxSelection={getAreEditableFeaturesEnabled()}
      onRowSelectionModelChange={(newRowSelectionModel) => {
        setSelectedRows(newRowSelectionModel);
      }}
      rowSelectionModel={selectedRows}
      bulkActions={bulkActions}
      disableAggregation
      disableRowGrouping
      disableColumnFilter
    />
  );

  const renderDormantState = () => (
    <DormantState
      queueState={queueState}
      onAttachFile={onAttachFile}
      onRemoveFile={clearUploadState}
      setAttachedFile={props.setAttachedFile}
      vendorOptions={
        props.integrationData?.file_sources
          ? Object.entries(props.integrationData?.file_sources).map(
              ([key, value]) => ({ id: key, label: String(value) })
            )
          : []
      }
      setSelectedVendor={props.setSelectedVendor}
      selectedVendor={props.selectedVendor}
      selectedIntegration={props.selectedIntegration}
      importType={props.importType}
    />
  );

  const renderStatus = () => {
    switch (parseState) {
      case PARSE_STATE.Dormant:
        if (props.importType === IMPORT_TYPES.EventData) {
          return (
            <EventDataContainer
              activeStep={props.activeStep}
              selectedIntegration={props.selectedIntegration}
              setSelectedIntegration={props.setSelectedIntegration}
              selectedApiImport={props.selectedApiImport}
              setActiveStep={props.setActiveStep}
              setSelectedApiImport={props.setSelectedApiImport}
              setHasErrors={props.setHasErrors}
              integrationData={props.integrationData}
              integrationEvents={props.integrationEvents}
              eventTime={props.eventTime}
              eventType={props.eventType}
              hasErrors={props.hasErrors}
              headerHeight={headerHeight}
              parseState={parseState}
              renderDormantState={renderDormantState}
            />
          );
        }
        return renderDormantState();
      case PARSE_STATE.Error:
        return (
          <ErrorState
            expectedFields={props.expectedHeaders}
            optionalExpectedFields={props.optionalExpectedHeaders ?? []}
            providedFields={parseResult?.meta?.fields || []}
            importType={props.importType}
            onUploadAgain={resetState}
            customErrors={customErrors}
          />
        );
      case PARSE_STATE.Processing:
        return (
          <CircularProgress
            sx={{
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              margin: 'auto',
            }}
          />
        );
      case PARSE_STATE.Complete: {
        return (
          <>
            <ToggleButtonGroup
              value={toggleValue}
              exclusive
              onChange={(e, value) => {
                // Ensuring a toggle is always selected
                if (value !== null) {
                  setToggleValue(value);
                }
              }}
              sx={{
                display: 'flex',
                padding: '6px 10px',
                marginLeft: isDrawerOpen ? 'initial' : '55px',
              }}
            >
              <ToggleButton
                value={TOGGLE_OPTIONS.All}
              >{`All (${grid.rows.length})`}</ToggleButton>
              <ToggleButton
                value={TOGGLE_OPTIONS.Valid}
                disabled={rowsWithoutErrors.length === 0}
              >{`Valid (${rowsWithoutErrors.length})`}</ToggleButton>
              <ToggleButton
                value={TOGGLE_OPTIONS.Invalid}
                disabled={rowsWithErrors.length === 0}
              >{`Invalid (${rowsWithErrors.length})`}</ToggleButton>
            </ToggleButtonGroup>

            {toggleValue === TOGGLE_OPTIONS.All && renderDataGrid(mappedRows)}

            {toggleValue === TOGGLE_OPTIONS.Valid &&
              renderDataGrid(rowsWithoutErrors)}

            {toggleValue === TOGGLE_OPTIONS.Invalid &&
              renderDataGrid(rowsWithErrors)}
          </>
        );
      }
      default:
        return null;
    }
  };

  return (
    <Box sx={getStyles({ headerHeight, parseState }).uploaderContainer}>
      <ToastDialog
        toasts={props.toasts}
        onCloseToast={(id) => {
          props.toastDispatch({
            type: 'REMOVE_TOAST_BY_ID',
            id,
          });
        }}
        onClickToastLink={handleUndo}
      />

      {!isDrawerOpen && (
        <IconButton
          onClick={() => setIsDrawerOpen((prev) => !prev)}
          sx={{
            position: 'absolute',
            top: 0,
            margin: '4px 0px 0px 24px',
            paddingTop: isDrawerOpen ? 'initial' : '14px',
            paddingLeft: 0,
          }}
        >
          <KitmanIcon name={KITMAN_ICON_NAMES.KeyboardDoubleArrowRight} />
        </IconButton>
      )}

      <InstructionsDrawer
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        ruleset={ruleset}
        title={getTitleLabels(props.eventType)[props.importType]}
        importType={props.importType}
      />

      <Box
        sx={{
          // Enables push content behaviour of drawer
          marginLeft: isDrawerOpen ? '340px' : '0px',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        {renderStatus()}
      </Box>
    </Box>
  );
};

export const UploaderTranslated = withNamespaces()(Uploader);
export default Uploader;
