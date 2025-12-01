// @flow
import { useState, useEffect, useMemo, Fragment } from 'react';

import { AppStatus } from '@kitman/components';
import { type Import } from '@kitman/modules/src/PlanningEvent/types';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import { getHumanReadableEventType } from '@kitman/common/src/utils/events';
import { type Event } from '@kitman/common/src/types/Event';
import { getImportTypeAndVendor } from '@kitman/common/src/utils/TrackingData/src/data/planningHub/getPlanningHubEventData';
import {
  getEventImports,
  type EventImport,
} from '@kitman/services/src/services/planning_hub/events/id/imports/get';
import { deleteEventImport } from '@kitman/services/src/services/planning_hub/events/id/imports/clear_data_by_source/delete';
import { deleteEventImports } from '@kitman/services/src/services/planning_hub/events/id/imports/clear_data/delete';
import i18n from '@kitman/common/src/utils/i18n';
import {
  DataGrid,
  Stack,
  Typography,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Box,
} from '@kitman/playbook/components';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import { IMPORT_TYPES } from '@kitman/modules/src/shared/MassUpload/New/utils/consts';
import useImportConfig from '@kitman/modules/src/shared/MassUpload/New/utils/useImportConfig';
import { useGetPermissionsQuery } from '@kitman/common/src/redux/global/services/globalApi';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';
import { getFormType } from '@kitman/modules/src/shared/MassUpload/utils/eventTracking';
import ConfirmationModal from '@kitman/playbook/components/ConfirmationModal';
import Alert from '@mui/material/Alert';

import { type Row, type SourceType, type SourceToDelete } from './types';
import { getRowsFrom, getColumnsFrom } from './utils';

type Props = {
  event: Event,
  canEditEvent: boolean,
  onImportData: () => void,
};

export const hasProgressUpdated = (
  previousImportList: ?Array<Import>,
  importData: EventImport
) => {
  if (!previousImportList) return false;

  const importIndex = previousImportList.findIndex(
    (previousImport) => previousImport.id === importData.id
  );

  if (importIndex === -1) return false;

  return (
    previousImportList[importIndex].progressUpdated ||
    previousImportList[importIndex].progress !== importData.progress
  );
};

export const MUIimportTable = (props: Props) => {
  const { trackEvent } = useEventTracking();
  const locationAssign = useLocationAssign();

  const { data: permissions, isLoading, isError } = useGetPermissionsQuery();
  const [isDeleting, setIsDeleting] = useState(false);

  const importConfig = useImportConfig({
    importType: IMPORT_TYPES.EventData,
    permissions,
  });

  const [importList, setImportList] = useState<
    Array<EventImport> | typeof undefined
  >();
  const [hasRequestFailed, setHasRequestFailed] = useState(false);

  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

  const [sourceToDelete, setSourceToDelete] = useState<SourceToDelete | null>(
    null
  );
  const [areAllSourcesSetToDelete, setAreAllSourcesSetToDelete] =
    useState<boolean>(false);
  const deleteImportedData = async (
    sourceId: string,
    sourceType: SourceType
  ) => {
    try {
      await deleteEventImport(props.event.id, sourceId);
    } catch {
      setHasRequestFailed(true);
      setSourceToDelete(null);
      setIsDeleting(false);
      return;
    }
    setImportList((prev) =>
      prev?.filter(({ source }) => source.sourceIdentifier !== sourceId)
    );
    setSourceToDelete(null);
    setIsDeleting(false);
    trackEvent(
      `Calendar — ${getHumanReadableEventType(
        props.event
      )} details — Imported data — Delete an import`,
      getImportTypeAndVendor({
        fileData: {
          source: sourceId,
          file: null,
        },
        type: sourceType === 'CSV' ? 'FILE' : 'INTEGRATION',
      })
    );
  };

  const rows: Array<Row> = useMemo(
    () => getRowsFrom(importList ?? []),
    [importList]
  );
  const allColumns = useMemo(
    () =>
      getColumnsFrom({
        rows,
        canDelete: props.canEditEvent,
        deleteImport: setSourceToDelete,
      }),
    [rows, setSourceToDelete]
  );

  useEffect(() => {
    const effect = () => {
      let previousImportList = null;
      // Request the import list every 3 seconds until the imports are all
      // complete.
      const getImports = async () => {
        let imports: Array<EventImport>;

        try {
          // $FlowIgnore[incompatible-call] imports will not be a promise
          imports = await getEventImports(props.event.id);
        } catch {
          setHasRequestFailed(true);
          return;
        }
        if (!imports) return;

        setImportList(
          imports.map((imp) => ({
            ...imp,
            progressUpdated: hasProgressUpdated(previousImportList, imp),
          }))
        );

        if (
          imports.length > 0 &&
          imports.filter(({ progress }) => progress < 100).length > 0
        ) {
          setTimeout(getImports, 3000);
        }

        previousImportList = imports;
      };

      getImports();
    };

    effect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (hasRequestFailed || isError) return <AppStatus status="error" isEmbed />;

  if (isLoading || !importList || isDeleting) {
    return <AppStatus message={i18n.t('Loading...')} status="loading" />;
  }

  const renderDeleteConfirmation = () => {
    return (
      <ConfirmationModal
        isModalOpen={Boolean(sourceToDelete || areAllSourcesSetToDelete)}
        isDeleteAction
        onConfirm={async () => {
          setIsDeleting(true);
          if (sourceToDelete) {
            deleteImportedData(sourceToDelete.id, sourceToDelete.type);
            return;
          }
          try {
            await deleteEventImports(props.event.id);
          } catch {
            setHasRequestFailed(true);
            setAreAllSourcesSetToDelete(false);
            setIsDeleting(false);
            return;
          }
          setImportList([]);
          setAreAllSourcesSetToDelete(false);
          setIsDeleting(false);
        }}
        onCancel={() => {
          setSourceToDelete(null);
          setAreAllSourcesSetToDelete(false);
          setMenuAnchorEl(null);
        }}
        isLoading={isDeleting}
        translatedText={{
          title: i18n.t('Delete all imported data with this {{eventType}}', {
            eventType: sourceToDelete
              ? i18n.t('source')
              : getHumanReadableEventType(props.event).toLowerCase(),
          }),
          actions: {
            cancelButton: 'Cancel',
            ctaButton: 'Delete',
          },
        }}
        dialogContent={
          <Alert severity="warning">
            {i18n.t(
              'Are you sure you want to delete all imported data associated with this {{eventType}}? Action cannot be undone.',
              {
                eventType: sourceToDelete
                  ? i18n.t('source')
                  : getHumanReadableEventType(props.event).toLowerCase(),
              }
            )}
          </Alert>
        }
        actions={{
          cancelButton: i18n.t('Cancel'),
          ctaButton: i18n.t('Delete'),
        }}
        maxWidth="sm"
      />
    );
  };

  return (
    <>
      <Stack
        direction="row"
        justifyContent="space-between"
        sx={{
          backgroundColor: 'background.default',
          padding: '1rem 1.5rem .5rem',
        }}
      >
        <Typography
          variant="h5"
          component="h1"
          sx={{
            color: 'text.secondary',
            fontWeight: 600,
          }}
        >
          {i18n.t('Imported data')}
        </Typography>

        {props.canEditEvent && (
          <Stack direction="row">
            <Button
              sx={{ height: '2rem' }}
              onClick={() => {
                if (importConfig?.enabled) {
                  locationAssign(
                    `/mass_upload/${IMPORT_TYPES.EventData}?event_id=${
                      props.event.id
                    }&event_type=${getHumanReadableEventType(
                      props.event
                    )}&event_time=${props.event.start_date}`
                  );
                } else props.onImportData();
                trackEvent(
                  `Forms — ${getFormType(
                    IMPORT_TYPES.EventData
                  )} — Import a CSV file (start file import)`
                );
              }}
            >
              {i18n.t('Import data')}
            </Button>

            {Boolean(importList?.length) && (
              <>
                <IconButton
                  sx={{ height: '2rem' }}
                  onClick={(e) => setMenuAnchorEl(e.currentTarget)}
                >
                  <KitmanIcon name={KITMAN_ICON_NAMES.MoreVert} />
                </IconButton>
                <Menu
                  anchorEl={menuAnchorEl}
                  open={Boolean(menuAnchorEl)}
                  onClose={() => setMenuAnchorEl(null)}
                  MenuListProps={{ dense: true }}
                >
                  <MenuItem
                    key="delete-all"
                    selected={false}
                    onClick={() => {
                      setAreAllSourcesSetToDelete(true);
                    }}
                  >
                    {i18n.t('Delete all')}
                  </MenuItem>
                </Menu>
              </>
            )}
          </Stack>
        )}
      </Stack>

      {importList?.length ? (
        Object.entries(allColumns ?? {}).map(([sourceName, columns]) => (
          <Fragment key={sourceName}>
            <DataGrid
              sx={{ border: 'none' }}
              columns={columns}
              rows={rows.filter(
                ({ sourceNameAndImportTypeAndName: { sourceName: source } }) =>
                  source === sourceName
              )}
              disableColumnReorder={false}
              disableColumnResize={false}
              hideFooter
            />
          </Fragment>
        ))
      ) : (
        <Stack
          alignItems="center"
          justifyContent="center"
          sx={{ height: '64vh', fontSize: '1rem' }}
        >
          <Box>{i18n.t('No imported data')}</Box>
        </Stack>
      )}

      {(sourceToDelete || areAllSourcesSetToDelete) &&
        renderDeleteConfirmation()}
    </>
  );
};
