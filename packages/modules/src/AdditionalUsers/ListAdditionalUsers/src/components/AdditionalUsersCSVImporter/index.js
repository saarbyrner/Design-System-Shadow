// @flow
import { useDispatch } from 'react-redux';
import { add } from '@kitman/modules/src/Toasts/toastsSlice';
import { MassUploadModalTranslated as MassUploadModal } from '@kitman/modules/src/shared/MassUpload/components/MassUploadModal';
import useOfficialUploadGrid from '@kitman/modules/src/shared/MassUpload/hooks/useOfficialUploadGrid';
import useScoutUploadGrid from '@kitman/modules/src/shared/MassUpload/hooks/useScoutUploadGrid';
import useMatchMonitorUploadGrid from '@kitman/modules/src/shared/MassUpload/hooks/useMatchMonitorUploadGrid';
import uploadAttachment from '@kitman/services/src/services/uploadAttachment';
import type { AttachedFile } from '@kitman/common/src/utils/fileHelper';
import massUpload from '@kitman/modules/src/shared/MassUpload/services/massUpload';
import {
  EXPECTED_HEADERS,
  GRID_CONFIG,
  BUTTONS,
} from '@kitman/modules/src/shared/MassUpload/utils';
import type { CsvUploadAdditionalUserTypes } from '@kitman/modules/src/AdditionalUsers/shared/types';
import { IMPORT_TYPES } from '@kitman/common/src/consts/imports';

type Props = {
  userType: CsvUploadAdditionalUserTypes,
};

const USE_GRID: { [key: any]: Function } = {
  official: useOfficialUploadGrid,
  scout: useScoutUploadGrid,
  match_monitor: useMatchMonitorUploadGrid,
};

const AdditionalUsersCSVImporter = ({ userType }: Props) => {
  const dispatch = useDispatch();

  const onProcessCSV = (formAttachment: AttachedFile): any => {
    const file = formAttachment.file;
    uploadAttachment(file, formAttachment.filename)
      .then((response) => {
        massUpload(
          response.attachment_id,
          IMPORT_TYPES.AdditionalUserImport,
          userType
        ).catch(() => {
          dispatch(
            add({
              status: 'ERROR',
              title: 'Import failed',
              description: formAttachment.filename,
            })
          );
        });
      })
      .catch(() => {
        dispatch(
          add({
            status: 'ERROR',
            title: 'Import failed',
            description: formAttachment.filename,
          })
        );
      });
  };

  return (
    <MassUploadModal
      hideButton
      useGrid={USE_GRID[userType]}
      onProcessCSV={(file) => onProcessCSV(file)}
      expectedHeaders={EXPECTED_HEADERS[userType]}
      config={GRID_CONFIG}
      title={BUTTONS[userType]}
    />
  );
};

export default AdditionalUsersCSVImporter;
