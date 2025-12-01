/* eslint-disable camelcase */
// @flow

import { Fragment, useRef, useState } from 'react';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { isEqual } from 'lodash';
import performanceMedicineEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/performanceMedicine';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import { determineMedicalLevelAndTab } from '@kitman/common/src/utils/TrackingData/src/data/medical/getMedicalEventData';
import { AppStatus } from '@kitman/components';
import { useTheme } from '@kitman/playbook/hooks';
import {
  onReset,
  onUpdateMovementForm,
  onSetDrawerStep,
} from '@kitman/modules/src/UserMovement/shared/redux/slices/userMovementDrawerSlice';
import {
  Alert,
  Box,
  Grid,
  Drawer,
  Button,
  FilesDock,
  FileUploads,
  Typography,
} from '@kitman/playbook/components';
import { add, remove } from '@kitman/modules/src/Toasts/toastsSlice';
import useCreateMovement from '@kitman/modules/src/UserMovement/shared/hooks/useCreateMovement';
import { isScannerIntegrationAllowed } from '@kitman/components/src/DocumentScanner/utils';
import { useGetOrganisationQuery } from '@kitman/common/src/redux/global/services/globalApi';

import {
  getDrawerState,
  getFormState,
  getStep,
  getIsNextDisabledFactory,
  getAthleteProfile,
} from '@kitman/modules/src/UserMovement/shared/redux/selectors/userMovementDrawerSelectors';
import { MovementSelectTranslated as MovementSelect } from '@kitman/modules/src/UserMovement/shared/components/UserMovementDrawer/components/MovementSelect';
import { OrganisationSelectTranslated as OrganisationSelect } from '@kitman/modules/src/UserMovement/shared/components/UserMovementDrawer/components/OrganisationSelect';
import { StartDateTranslated as StartDate } from '@kitman/modules/src/UserMovement/shared/components/UserMovementDrawer/components/StartDate';
import useManageFilesForUpload from '@kitman/common/src/hooks/useManageFilesForUpload';
import useManageUploads from '@kitman/common/src/hooks/useManageUploads';
import {
  imageFileTypes,
  pdfFileType,
} from '@kitman/common/src/utils/mediaHelper';

import { drawerMixin } from '@kitman/modules/src/UserMovement/shared/components/UserMovementDrawer/mixins';
import DrawerLayout from '@kitman/modules/src/UserMovement/shared/layouts/DrawerLayout';
import {
  getSteps,
  getTitle,
  getInstructions,
} from '@kitman/modules/src/UserMovement/shared/components/UserMovementDrawer/config';
import {
  EDIT,
  VIEW,
  MEDICAL_TRIAL_V2,
} from '@kitman/modules/src/UserMovement/shared/constants';

// Types
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { MovementFormState } from '@kitman/modules/src/UserMovement/shared/redux/slices/userMovementDrawerSlice';
import type { RequestStatus } from '@kitman/common/src/types';
import type {
  FileUploadsFile,
  FileValidation,
  FilePondError,
} from '@kitman/playbook/components/FileUploads';
import type { AttachedMedicalFile } from '@kitman/common/src/utils/fileHelper';

const USER_MOVEMENT_CREATION_ID = 'USER_MOVEMENT_CREATION_ID';

type Props = {
  isPastPlayer: boolean,
};

const UserMovementDrawer = (props: I18nProps<Props>) => {
  const { trackEvent } = useEventTracking();
  const dispatch = useDispatch();
  const theme = useTheme();

  const { data: currentOrganisation } = useGetOrganisationQuery();

  const {
    user_id,
    transfer_type,
    joined_at,
    join_organisation_ids,
    leave_organisation_ids,
  } = useSelector(getFormState);

  const profile = useSelector(getAthleteProfile);

  const { isOpen } = useSelector(getDrawerState);
  const activeStep = useSelector(getStep);

  const {
    isLoading,
    isFetching,
    hasFailed,
    organisationData,
    onCreateMovementRecord,
  } = useCreateMovement({ id: isOpen ? profile?.user_id : null });

  const [attachmentsValidationErrors, setAttachmentsValidationErrors] =
    useState<Array<FileValidation>>([]);
  const [uploadingFilesStatus, setUploadingFilesStatus] =
    useState<RequestStatus>(null);

  const filePondRef = useRef(null);
  const filesDockRef = useRef(null);
  const validationErrorsAreaRef = useRef(null);

  const {
    filesToUpload,
    getFilesToUploadDescriptors,
    updateFileStatus,
    clearAndResetManagedFiles,
    handleAddFile,
    handleRemoveFile,
  } = useManageFilesForUpload({ filePondRef, filesDockRef });
  const { uploadAndConfirmAttachments } = useManageUploads();

  const isPastAthleteMedicalTrial =
    window.getFlag('past-athletes-medical-trial') &&
    transfer_type === MEDICAL_TRIAL_V2 &&
    props.isPastPlayer;

  const isLoadingDataOrSubmitting =
    isLoading || isFetching || uploadingFilesStatus === 'PENDING';

  const isNextDisabled =
    useSelector(getIsNextDisabledFactory()) ||
    isLoadingDataOrSubmitting ||
    (isPastAthleteMedicalTrial && filesToUpload.length < 1);

  const getProfileItems = () => {
    return [
      { primary: props.t('DOB'), secondary: profile?.date_of_birth || '-' },
      { primary: props.t('Email'), secondary: profile?.email || '-' },
    ];
  };

  const handleUpdateForm = (partialForm: $Shape<MovementFormState>) => {
    dispatch(onUpdateMovementForm(partialForm));
  };

  const getSelectedOrganisationDetails = () => {
    return organisationData?.find((org) => org.id === join_organisation_ids[0]);
  };

  const mode = activeStep === 0 ? EDIT : VIEW;

  const warnOfUploadFailures = (failureCount: number) => {
    const error: FileValidation = {
      issue:
        failureCount === 1
          ? props.t('Failed to upload file')
          : props.t('Failed to upload {{count}} files', {
              count: failureCount,
            }),
      severity: 'error',
    };
    setAttachmentsValidationErrors([error]);
    validationErrorsAreaRef?.current?.scrollIntoView({
      behavior: 'smooth',
    });
  };

  const handleOnCreateMovementRecord = () => {
    onCreateMovementRecord({
      user_id,
      transfer_type,
      joined_at,
      join_organisation_ids,
      leave_organisation_ids,
      attachment_attributes:
        transfer_type === MEDICAL_TRIAL_V2
          ? getFilesToUploadDescriptors()[0] || undefined
          : undefined,
    })
      .unwrap()
      .then(async (response) => {
        if (response.message.athlete_access_grant?.attachments?.length) {
          setUploadingFilesStatus('PENDING');

          // Note: no try catch here as errors captured within uploadAndConfirmAttachments
          const results = await uploadAndConfirmAttachments(
            response.message.athlete_access_grant.attachments,
            // $FlowIgnore[incompatible-call]
            filesToUpload.map((managedFile) => managedFile.file),
            updateFileStatus
          );
          const rejectedCount = results.reduce((acc, result) => {
            if (result.status !== 'fulfilled') {
              return acc + 1;
            }
            return acc;
          }, 0);

          setUploadingFilesStatus(rejectedCount > 0 ? 'FAILURE' : 'SUCCESS');
          if (rejectedCount > 0) {
            warnOfUploadFailures(rejectedCount);
            return;
          }
        }
        const title = getTitle({ type: transfer_type });
        dispatch(
          add({
            status: 'SUCCESS',
            title: props.t('{{transfer_type}} successfully created', {
              transfer_type: title,
            }),
          })
        );
        if (props.isPastPlayer) {
          trackEvent(performanceMedicineEventNames.medicalTrialPastPlayer, {
            ...determineMedicalLevelAndTab(),
          });
        } else {
          trackEvent(performanceMedicineEventNames.medicalTrialActivePlayer, {
            ...determineMedicalLevelAndTab(),
          });
        }
        clearAndResetManagedFiles();
        dispatch(onReset());
      })
      .catch(() => {
        // Likely response object contains
        // "errors": "Organisation already has active access grant from {club} for this athlete"

        const title = getTitle({ type: transfer_type });
        dispatch(
          add({
            id: USER_MOVEMENT_CREATION_ID,
            status: 'ERROR',
            title: props.t('Error creating {{transfer_type}}', {
              transfer_type: title, // TODO: should review if this translation works
            }),
          })
        );
      })
      .then(() => {
        setTimeout(() => {
          dispatch(remove(USER_MOVEMENT_CREATION_ID));
        }, 2000);
      });
  };

  const onAddFileForUpload = (filePondFile) => {
    const {
      file,
      id,
      fileSize,
      fileTitle,
      fileType,
      filename,
      filenameWithoutExtension,
    } = filePondFile;
    // Extract just what is needed from filePond file for management via useManageFilesForUpload
    const attachedMedicalFile: AttachedMedicalFile = {
      file,
      fileSize,
      fileTitle,
      fileType,
      filename,
      filenameWithoutExtension,
      id,
      medical_attachment_category_ids: [],
    };
    handleAddFile(attachedMedicalFile);
  };

  const handleError = (error: FilePondError, file?: ?FileUploadsFile) => {
    const fileValidation: FileValidation = {
      fileId: file?.id,
      fileName: file?.filename,
      issue: `${error.main}.${error.sub ? ` ${error.sub}` : ''}`,
      severity: 'error',
    };

    setAttachmentsValidationErrors((prev) => [
      ...prev.filter((priorError) => !isEqual(priorError, fileValidation)),
      fileValidation,
    ]);
    validationErrorsAreaRef?.current?.scrollIntoView({
      behavior: 'smooth',
    });
  };

  const renderFormContent = () => {
    return (
      <Grid container spacing={2} px={2}>
        <Grid item xs={6} py={0}>
          <MovementSelect
            value={transfer_type}
            onUpdate={(value) => handleUpdateForm({ transfer_type: value })}
            mode={mode}
            isPastPlayer={props.isPastPlayer}
          />
        </Grid>
        <Grid item xs={6}>
          <StartDate value={joined_at && moment(joined_at)} mode={mode} />
        </Grid>
        <Grid item xs={12}>
          <OrganisationSelect
            type={transfer_type}
            options={organisationData}
            value={join_organisation_ids.length ? join_organisation_ids[0] : ''}
            selectedOrganisation={getSelectedOrganisationDetails()}
            currentOrganisation={
              isPastAthleteMedicalTrial
                ? currentOrganisation
                : profile?.organisations[0]
            }
            onUpdate={(value) =>
              handleUpdateForm({
                join_organisation_ids: value,
              })
            }
            mode={mode}
          />
        </Grid>
        {isPastAthleteMedicalTrial && (
          <Grid item xs={12}>
            {mode === EDIT && (
              <Typography
                id="file-attach-label"
                variant="body1"
                fontWeight={400}
                sx={{ color: 'text.primary', fontSize: '16px' }}
              >
                {props.t('Attach')}
              </Typography>
            )}
            {mode === EDIT && !filesToUpload.length && (
              <Box display="flex" justifyContent="center" my={1}>
                <Alert
                  variant="standard"
                  severity="info"
                  sx={{ width: '100%' }}
                >
                  {props.t('Past players sharing must have a waiver attached')}
                </Alert>
              </Box>
            )}
            {mode === EDIT && (
              <FileUploads
                filePondRef={filePondRef}
                acceptedFileTypes={[...imageFileTypes, pdfFileType]}
                acceptedFileTypesLabel={props.t('{{a}} or {{b}}', {
                  a: 'PDF',
                  b: 'PNG, JPG, GIF, TIFF',
                })}
                allowScanning={isScannerIntegrationAllowed()}
                onAddFile={onAddFileForUpload}
                onError={handleError}
                validationErrorsAreaRef={validationErrorsAreaRef}
                validationErrors={attachmentsValidationErrors}
                resetValidation={() => setAttachmentsValidationErrors([])}
                // For now only allow one file
                disabled={filesToUpload.length > 0 && isLoadingDataOrSubmitting}
              />
            )}
            <FilesDock
              hideTitle
              filesDockRef={filesDockRef}
              filesToUpload={filesToUpload}
              handleRemoveFile={handleRemoveFile}
              hideRemoveAction={isLoadingDataOrSubmitting || mode === VIEW}
            />
          </Grid>
        )}
      </Grid>
    );
  };

  const getActions = () => {
    const commomButtonProps = {
      disableRipple: true,
      size: 'small',
    };
    switch (activeStep) {
      default:
      case 0:
        return (
          <Button
            {...commomButtonProps}
            color="primary"
            onClick={() => dispatch(onSetDrawerStep({ step: 1 }))}
            disabled={isNextDisabled}
          >
            {props.t('Next')}
          </Button>
        );
      case 1:
        return (
          <Fragment>
            <Button
              {...commomButtonProps}
              color="secondary"
              onClick={() => dispatch(onSetDrawerStep({ step: 0 }))}
              disabled={isLoadingDataOrSubmitting}
            >
              {props.t('Previous')}
            </Button>
            <Button
              {...commomButtonProps}
              color="primary"
              onClick={handleOnCreateMovementRecord}
              disabled={isLoadingDataOrSubmitting}
            >
              {props.t('Share')}
            </Button>
          </Fragment>
        );
    }
  };

  const renderContent = () => {
    if (isLoading || isFetching) {
      return (
        <AppStatus
          status="loading"
          message={`${props.t('Loading')}...`}
          isEmbed
        />
      );
    }
    if (hasFailed) {
      return <AppStatus status="error" isEmbed />;
    }
    return (
      <>
        <DrawerLayout.Title
          title={getTitle({ type: transfer_type })}
          onClose={() => {
            // Don't allow close if submitting
            if (!isLoadingDataOrSubmitting) {
              clearAndResetManagedFiles();
              dispatch(onReset());
            }
          }}
        />
        <DrawerLayout.Steps
          steps={getSteps({ type: transfer_type })}
          activeStepIndex={activeStep}
        />
        <DrawerLayout.Instructions
          instructions={getInstructions({
            type: transfer_type,
            step: activeStep,
          })}
        />
        <DrawerLayout.Profile profile={profile} />
        <DrawerLayout.ProfileItems items={getProfileItems()} />
        <DrawerLayout.Form>{renderFormContent()}</DrawerLayout.Form>
        <DrawerLayout.Actions>{getActions()}</DrawerLayout.Actions>
      </>
    );
  };

  return (
    <Drawer open={isOpen} anchor="right" sx={drawerMixin({ theme, isOpen })}>
      <DrawerLayout>{renderContent()}</DrawerLayout>
    </Drawer>
  );
};

export const UserMovementDrawerTranslated =
  withNamespaces()(UserMovementDrawer);
export default UserMovementDrawer;
