// @flow
import { useMemo } from 'react';
import { renderToString } from 'react-dom/server';
import { FilePond } from 'react-filepond';
import { useTheme } from '@mui/material/styles';
import { useDispatch } from 'react-redux';

import {
  Box,
  Typography,
  Autocomplete,
  TextField,
} from '@kitman/playbook/components';
import { FilesDockTranslated as FilesDock } from '@kitman/playbook/components/FilesDock';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import { add as addToast } from '@kitman/modules/src/Toasts/toastsSlice';
import i18n from '@kitman/common/src/utils/i18n';
import { type SetState } from '@kitman/common/src/types/react';

import { type UploadQueue } from '@kitman/modules/src/shared/MassUpload/types';
import { useGetPermissionsQuery } from '@kitman/common/src/redux/global/services/globalApi';
import { IMPORT_TYPES } from '@kitman/modules/src/shared/MassUpload/New/utils/consts';

import {
  type VendorOption,
  type AttachedFileOrFilePondLike,
} from '../../types';

type Props = {
  setAttachedFile: SetState<AttachedFileOrFilePondLike>,
  onAttachFile: (
    file: [AttachedFileOrFilePondLike]
  ) => Array<AttachedFileOrFilePondLike>,
  queueState: UploadQueue,
  onRemoveFile: () => void,
  vendorOptions: Array<VendorOption>,
  setSelectedVendor: SetState<VendorOption>,
  selectedVendor: VendorOption,
  selectedIntegration: { id: number | string, name: string },
  importType: $Values<typeof IMPORT_TYPES>,
};

const DormantState = ({
  setAttachedFile,
  onAttachFile,
  queueState,
  onRemoveFile,
  vendorOptions,
  setSelectedVendor,
  selectedVendor,
  selectedIntegration,
  importType,
}: Props) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { data: permissions } = useGetPermissionsQuery();

  const canImport =
    // Permission is only required for importer using mass_upload endpoint
    permissions?.settings.canCreateImports ||
    importType === IMPORT_TYPES.EventData;

  const getIdleLabel = () =>
    canImport
      ? renderToString(
          <>
            <KitmanIcon name={KITMAN_ICON_NAMES.UploadFile} />
            <Typography fontFamily={theme.typography.fontFamily}>
              <span className="filepond--label-action">
                {i18n.t('Click to upload')}
              </span>
              {i18n.t(' or drag and drop')}
            </Typography>
            <Typography fontFamily={theme.typography.fontFamily}>
              {i18n.t('.CSV file only')}
            </Typography>
          </>
        )
      : renderToString(
          <>
            <KitmanIcon name={KITMAN_ICON_NAMES.NotAllowed} />
            <Typography fontFamily={theme.typography.fontFamily}>
              {i18n.t('You do not have permission to import data files')}
            </Typography>
          </>
        );

  const sortedVendorOptions = useMemo(
    () => vendorOptions.sort((a, b) => a.label.localeCompare(b.label)),
    [vendorOptions]
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '50%',
        margin: 'auto',
        '.filepond--drop-label label': {
          // Overwriting disabled styling
          opacity: '1 !important',
        },
      }}
    >
      <FilePond
        allowDrop
        allowReplace
        dropOnPage
        instantUpload={false}
        dropValidation={false}
        allowImagePreview={false}
        removeFilesWithErrors
        acceptedFileTypes={['text/csv']}
        labelIdle={getIdleLabel()}
        disabled={!canImport}
        onaddfile={(error, file) => {
          if (error) {
            dispatch(
              addToast({
                status: 'ERROR',
                title: i18n.t('Invalid file format'),
                description: i18n.t('Please retry with a .CSV file'),
              })
            );
          } else {
            setAttachedFile(file);
            onAttachFile([file]);
          }
        }}
      />
      {queueState.attachment && (
        <FilesDock
          filesToUpload={[
            {
              file: queueState.attachment,
              status: 'queued',
            },
          ]}
          hideTitle
          handleRemoveFile={onRemoveFile}
        />
      )}
      {selectedIntegration.name === 'CSV' && (
        <Autocomplete
          disablePortal
          options={sortedVendorOptions}
          sx={{ width: '100%', marginTop: '40px' }}
          value={selectedVendor}
          onChange={(e, value) => {
            setSelectedVendor(value);
          }}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={(params) => (
            <TextField {...params} label={i18n.t('Select vendor')} />
          )}
        />
      )}
    </Box>
  );
};

export default DormantState;
