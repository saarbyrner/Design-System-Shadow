// @flow
import { withNamespaces } from 'react-i18next';
import { useRef, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import saveAttachment from '@kitman/services/src/services/medical/saveAttachmentLegacy';
import { add } from '@kitman/modules/src/Toasts/toastsSlice';
import type { AttachedFile } from '@kitman/common/src/utils/fileHelper';
import isEqual from 'lodash/isEqual';
import { FileUploadField } from '@kitman/components';
import ToastDialog from '@kitman/components/src/Toast/KitmanDesignSystem/ToastDialog';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import massUpload from '@kitman/modules/src/shared/MassUpload/services/massUpload';
import useImports from '../../Medical/shared/hooks/useImports';
import type { UserTypes } from './types';

import { MassUploadModalTranslated as MassUploadModal } from './components/MassUploadModal';
import useAthleteUploadGrid from './hooks/useAthleteUploadGrid';
import useStaffUploadGrid from './hooks/useStaffUploadGrid';
import useOfficialUploadGrid from './hooks/useOfficialUploadGrid';
import useScoutUploadGrid from './hooks/useScoutUploadGrid';
import useStaffAssignmentUploadGrid from './hooks/useStaffAssignmentUploadGrid';
import useMatchMonitorUploadGrid from './hooks/useMatchMonitorUploadGrid';
import {
  ATHLETE,
  SCOUT,
  OFFICIAL,
  USER,
  EXPECTED_HEADERS,
  GRID_CONFIG,
  BUTTONS,
  OFFICIAL_ASSIGNMENT,
  MATCH_MONITOR,
  MATCH_MONITOR_ASSIGNMENT,
} from './utils';

type Props = {
  userType: UserTypes,
  reloadGrid?: () => void,
  onUploadSuccess?: () => void,
};
const style = {
  wrapper: {
    display: 'flex',
    gap: '10px',
  },
};

const GRID_HOOK: { [key: UserTypes]: Function } = {
  athlete: useAthleteUploadGrid,
  user: useStaffUploadGrid,
  official: useOfficialUploadGrid,
  scout: useScoutUploadGrid,
  official_assignment: useStaffAssignmentUploadGrid,
  match_monitor_assignment: useStaffAssignmentUploadGrid,
  match_monitor: useMatchMonitorUploadGrid,
};

const MassUpload = (props: I18nProps<Props>) => {
  const { permissions } = usePermissions();
  const [uploadedFile, setUploadedFile] = useState(null);
  const prevCountRef = useRef(null);
  const isImportEnabled = permissions.settings.canViewImports;

  const inputFile = useRef(null);
  const dispatch = useDispatch();
  const { toasts, closeToast, importReports } = useImports(isImportEnabled);

  const saveAndCreateAttachment = async (formAttachment: AttachedFile) => {
    const file = formAttachment.file;

    try {
      const response = await saveAttachment(file, formAttachment.filename);
      const massUploadResponse = await massUpload(
        response.attachment_id,
        `${props.userType}_import`
      );
      props.reloadGrid?.();
      return massUploadResponse;
    } catch (error) {
      dispatch(
        add({
          status: 'ERROR',
          title: `${formAttachment.filename} ${props.t('upload failed.')}`,
        })
      );
    }

    return Promise.reject(new Error('Failed to upload file'));
  };

  const onUploadAttachment = (formAttachment: AttachedFile): any => {
    importReports(() => saveAndCreateAttachment(formAttachment));
  };

  useEffect(() => {
    if (uploadedFile && !isEqual(prevCountRef.current, uploadedFile)) {
      prevCountRef.current = uploadedFile;
      onUploadAttachment(uploadedFile);
    }
  }, [uploadedFile]);

  const onUploadCSV = async (formAttachment: AttachedFile) => {
    if (formAttachment && !isEqual(prevCountRef.current, formAttachment)) {
      prevCountRef.current = formAttachment;
      try {
        const saveAttachmentResponse = await saveAttachment(
          formAttachment.file,
          formAttachment.filename
        );
        if (!saveAttachmentResponse.success) {
          return false;
        }
        const massUploadResponse = await massUpload(
          saveAttachmentResponse.attachment_id,
          `${props.userType}_import`
        );
        if (!massUploadResponse) {
          return false;
        }

        props.reloadGrid?.();
        props.onUploadSuccess?.();

        return true;
      } catch (error) {
        return false;
      }
    }
    return false;
  };

  const renderContent = () => {
    if (
      window.featureFlags['league-ops-mass-create-pre-validate'] &&
      [
        ATHLETE,
        USER,
        SCOUT,
        OFFICIAL,
        OFFICIAL_ASSIGNMENT,
        MATCH_MONITOR,
        MATCH_MONITOR_ASSIGNMENT,
      ].includes(props.userType)
    ) {
      return (
        <MassUploadModal
          userType={props.userType}
          useGrid={GRID_HOOK[props.userType]}
          onProcessCSV={(file) =>
            window.featureFlags['league-ops-mass-import']
              ? onUploadCSV(file)
              : setUploadedFile(file)
          }
          expectedHeaders={EXPECTED_HEADERS[props.userType]}
          config={GRID_CONFIG}
          buttonText={BUTTONS[props.userType]}
          title={BUTTONS[props.userType]}
        />
      );
    }
    return (
      <div ref={inputFile}>
        <FileUploadField
          updateFiles={(files) => {
            // Deprecate this fileupload field at some point.
            // Add the correct rules for officals assignment csv
            if (files[0]?.id !== uploadedFile?.id) setUploadedFile(files[0]);
          }}
          acceptedFileTypes={['text/csv']}
          uploadTextButton
          allowMultiple={false}
          uploadTextButtonLabel={BUTTONS[props.userType]}
          customIdleLabel={props.t(`Accepted file types: csv`)}
        />
        <ToastDialog toasts={toasts} onCloseToast={closeToast} />
      </div>
    );
  };

  return <div css={style.wrapper}>{renderContent()}</div>;
};

export const MassUploadTranslated = withNamespaces()(MassUpload);
export default MassUpload;
