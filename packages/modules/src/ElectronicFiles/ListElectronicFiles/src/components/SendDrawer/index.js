// @flow
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@kitman/playbook/hooks';
import { drawerMixin } from '@kitman/playbook/mixins/drawerMixins';
import type { NewContact } from '@kitman/modules/src/ElectronicFiles/shared/types';
import type { Option } from '@kitman/playbook/types';
import { useGetPermissionsQuery } from '@kitman/common/src/redux/global/services/globalApi';
import {
  selectOpen,
  selectData,
  selectValidation,
  updateData,
  updateValidation,
  reset,
} from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/sendDrawerSlice';
import {
  MENU_ITEM,
  updateSelectedMenuItem,
} from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/sidebarSlice';
import type {
  DrawerData,
  DataKey,
} from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/sendDrawerSlice';
import useManageFiles from '@kitman/modules/src/ElectronicFiles/ListElectronicFiles/src/hooks/useManageFiles';
import useProcessFiles from '@kitman/modules/src/ElectronicFiles/ListElectronicFiles/src/hooks/useProcessFiles';
import useSendElectronicFile from '@kitman/modules/src/ElectronicFiles/ListElectronicFiles/src/hooks/useSendElectronicFile';
import {
  Typography,
  Drawer,
  Divider,
  Button,
} from '@kitman/playbook/components';
import { SelectedFilesTranslated as SelectedFiles } from '@kitman/modules/src/ElectronicFiles/shared/components/SelectedFiles';
import {
  SendTo as SendToSection,
  Message as MessageSection,
  AttachFiles as AttachFilesSection,
  UploadFiles as UploadFilesSection,
} from '@kitman/modules/src/ElectronicFiles/ListElectronicFiles/src/components/SendDrawer/sections';
import DrawerLayout from '@kitman/playbook/layouts/Drawer';
import Errors from '@kitman/modules/src/ElectronicFiles/shared/components/Errors';
import {
  validateSendDrawerData,
  getValidationStatus,
  generateRouteUrl,
} from '@kitman/modules/src/ElectronicFiles/shared/utils';
import { maxNumberOfFiles } from '@kitman/modules/src/ElectronicFiles/shared/consts';
import type { DateRange } from '@kitman/common/src/types';
import type { PermissionsType } from '@kitman/common/src/contexts/PermissionsContext/types';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';

type Props = {};

const SendDrawer = ({ t }: I18nProps<Props>) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const locationAssign = useLocationAssign();

  const filePondRef = useRef(null);
  const selectedFilesRef = useRef(null);

  const open = useSelector(selectOpen);
  const data: DrawerData = useSelector(selectData);
  const validation = useSelector(selectValidation);

  const {
    data: permissions = {},
    isSuccess: hasPermissionsDataLoaded = false,
  }: { data: PermissionsType, isSuccess: boolean } = useGetPermissionsQuery(
    undefined,
    { skip: !open }
  );

  const {
    filesToUpload,
    filesReadyToUpload,
    uploadedFiles,
    errorFileIds,
    setUploadedFiles,
    setErrorFileIds,
    setFilesToUpload,
    setFilesReadyToUpload,
    handleAddFile,
    handleAttachSelectedFiles,
    handleRemoveUploadedFile,
    handleRemoveAttachedFile,
  } = useManageFiles({ filePondRef, selectedFilesRef, t });

  const { processFiles, isLoading: isProcessingFilesLoading } = useProcessFiles(
    {
      filesReadyToUpload,
      uploadedFiles,
      errorFileIds,
      setUploadedFiles,
      setErrorFileIds,
    }
  );

  const { send, isLoading: isSendElectronicFileLoading } =
    useSendElectronicFile();

  const handleClose = () => {
    setFilesToUpload([]);
    setFilesReadyToUpload([]);
    setUploadedFiles([]);
    setErrorFileIds([]);
    dispatch(reset());
  };

  const handleChange = (
    field: DataKey,
    value: string | number | Option | Array<Option> | ?DateRange | NewContact
  ) => {
    dispatch(updateData({ [`${field}`]: value }));
  };

  const onSend = async () => {
    const validatedData = validateSendDrawerData({ data, filesToUpload });
    dispatch(updateValidation(validateSendDrawerData({ data, filesToUpload })));

    const validationStatus = getValidationStatus(validatedData);

    // if validationStatus is false, return
    if (!validationStatus) {
      return;
    }

    const { success: isProcessFilesSuccess, attachmentIds } =
      await processFiles();

    if (isProcessFilesSuccess) {
      const { success: isSendElectronicFileSuccess } = await send(
        attachmentIds
      );

      if (isSendElectronicFileSuccess) {
        handleClose();
        // redirect user to sent
        dispatch(updateSelectedMenuItem(MENU_ITEM.sent));
        locationAssign(generateRouteUrl({ selectedMenuItem: MENU_ITEM.sent }));
      }
    }
  };

  const renderContent = () => {
    return (
      <>
        <DrawerLayout.Title title={t('Send eFile')} onClose={handleClose} />
        <Divider />
        <DrawerLayout.Content>
          <SendToSection
            sendTo={data.sendTo}
            handleChange={handleChange}
            newContact={data.newContact}
          />
          <Divider sx={{ mt: 2, mb: 1 }} />
          <MessageSection handleChange={handleChange} />
          <Divider />
          <Typography
            variant="subtitle1"
            mt={2}
            fontWeight={500}
            color={validation.errors?.files?.length ? 'error' : 'primary'}
          >
            {t('Attach file(s)')}
          </Typography>
          <Errors errors={validation.errors?.files} wrapInHelperText />
          <UploadFilesSection
            filePondRef={filePondRef}
            filesToUpload={filesToUpload}
            handleAddFile={handleAddFile}
            maxFiles={maxNumberOfFiles - data.attachedFiles.length}
          />
          {hasPermissionsDataLoaded &&
            permissions.medical.documents.canView && (
              <AttachFilesSection
                handleChange={handleChange}
                handleAttachSelectedFiles={handleAttachSelectedFiles}
                maxFiles={maxNumberOfFiles - filesToUpload.length}
              />
            )}
          <SelectedFiles
            selectedFilesRef={selectedFilesRef}
            filesToUpload={filesToUpload}
            attachedFiles={data.attachedFiles}
            uploadedFiles={uploadedFiles}
            errorFileIds={errorFileIds}
            isProcessing={isProcessingFilesLoading}
            handleRemoveUploadedFile={handleRemoveUploadedFile}
            handleRemoveAttachedFile={handleRemoveAttachedFile}
          />
        </DrawerLayout.Content>
        <Divider />
        <DrawerLayout.Actions>
          <Button color="secondary" onClick={() => dispatch(reset())}>
            {t('Cancel')}
          </Button>
          <Button
            onClick={onSend}
            disabled={
              isProcessingFilesLoading ||
              isSendElectronicFileLoading ||
              errorFileIds.length !== 0
            }
          >
            {t('Send')}
          </Button>
        </DrawerLayout.Actions>
      </>
    );
  };

  return (
    <Drawer
      open={open}
      anchor="right"
      // prevent user closing the drawer by mistake
      onClose={() => {}}
      sx={drawerMixin({ theme, isOpen: open, drawerWidth: 650 })}
    >
      {renderContent()}
    </Drawer>
  );
};

export const SendDrawerTranslated: ComponentType<Props> =
  withNamespaces()(SendDrawer);
export default SendDrawer;
