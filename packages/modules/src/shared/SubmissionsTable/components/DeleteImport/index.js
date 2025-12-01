// @flow
import { useDispatch } from 'react-redux';

import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import { IconButton, Stack } from '@kitman/playbook/components';
import { onUpdateImportToDelete } from '@kitman/modules/src/shared/MassUpload/redux/massUploadSlice';
import i18n from '@kitman/common/src/utils/i18n';
import { IMPORT_TYPES } from '@kitman/modules/src/shared/MassUpload/New/utils/consts';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import { type ImportStatus } from '@kitman/common/src/types/Imports';
import { getTitleLabels } from '@kitman/modules/src/shared/MassUpload/New/utils';
import getDeleteImportData from '@kitman/common/src/utils/TrackingData/src/data/forms/deleteImport/getDeleteImportData';

type Props = {
  canDelete: boolean,
  importType: $Values<typeof IMPORT_TYPES>,
  submissionStatus: ImportStatus,
  attachmentId: ?number,
};

const DeleteImport = ({
  canDelete,
  attachmentId,
  importType,
  submissionStatus,
}: Props) => {
  const dispatch = useDispatch();

  const { trackEvent } = useEventTracking();

  const cleansedImportType = importType.substring(
    0,
    importType.lastIndexOf('_')
  );

  if (!canDelete) {
    return null;
  }

  return (
    <Stack
      width="100%"
      justifyContent="end"
      alignItems="flex-end"
      marginRight="20px"
    >
      <IconButton
        title={i18n.t('Delete import')}
        onClick={() => {
          trackEvent(
            `Forms - ${
              getTitleLabels()[cleansedImportType]
            } - CSV Importer - Delete Import Click`,
            getDeleteImportData(submissionStatus)
          );
          dispatch(
            onUpdateImportToDelete({
              id: attachmentId,
              showDeleteConfirmation: true,
              submissionStatus,
            })
          );
        }}
      >
        <KitmanIcon name={KITMAN_ICON_NAMES.DeleteOutline} />
      </IconButton>
    </Stack>
  );
};

export default DeleteImport;
