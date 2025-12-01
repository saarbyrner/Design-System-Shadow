// @flow
import { useDispatch, useSelector } from 'react-redux';
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { AttachedFile } from '@kitman/common/src/utils/fileHelper';
import { Box, Typography } from '@kitman/playbook/components';
import {
  selectValidation,
  updateValidation,
} from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/sendDrawerSlice';
import { FilePondInstanceTranslated as FilePondInstance } from '@kitman/modules/src/ElectronicFiles/shared/components/FilePondInstance';
import type {
  FilePondError,
  FilePondWarning,
} from '@kitman/modules/src/ElectronicFiles/shared/types';
import {
  imageFileTypes,
  textFileTypes,
  docFileTypes,
  spreadsheetFileTypes,
  presentationFileTypes,
} from '@kitman/common/src/utils/mediaHelper';
import Errors from '@kitman/modules/src/ElectronicFiles/shared/components/Errors';
import { maxNumberOfFiles } from '@kitman/modules/src/ElectronicFiles/shared/consts';

type Props = {
  filePondRef: React$ElementRef<any>,
  handleAddFile: (file: AttachedFile) => void,
  maxFiles?: number,
};

const UploadFilesSection = ({
  filePondRef,
  handleAddFile,
  maxFiles,
  t,
}: I18nProps<Props>) => {
  const dispatch = useDispatch();
  const validation = useSelector(selectValidation);

  const isError = !!(
    validation.errors?.files?.length || validation.errors?.filesToUpload?.length
  );

  const handleWarning = (error: FilePondWarning) => {
    if (error.type === 'warning' && error.body === 'Max files') {
      dispatch(
        updateValidation({
          filesToUpload: [
            t(
              `The maximum number of files allowed ({{maxNumberOfFiles}}) has been reached. You have currently attached {{currentCount}} file(s). You can add {{selectedCount}} more file(s).`,
              {
                maxNumberOfFiles,
                currentCount: filePondRef?.current?.getFiles().length,
                selectedCount:
                  maxNumberOfFiles - filePondRef?.current?.getFiles().length,
              }
            ),
          ],
        })
      );
    }
  };

  const handleError = ({ main, sub }: FilePondError) => {
    dispatch(
      updateValidation({
        filesToUpload: [
          t(`Error: {{main}}. {{sub}}`, {
            main,
            sub,
          }),
        ],
      })
    );
  };

  return (
    <>
      <Typography
        color={isError ? 'error' : 'primary'}
        variant="subtitle2"
        fontWeight={500}
        mt={2}
        mb={1}
      >
        {t('From your computer')}
      </Typography>
      <Errors errors={validation.errors?.filesToUpload} wrapInHelperText />
      <Box
        sx={{
          ...((validation.errors?.files?.length ||
            validation.errors?.filesToUpload?.length) && {
            border: '1px solid',
            borderColor: 'error.main',
          }),
        }}
      >
        <FilePondInstance
          filePondRef={filePondRef}
          acceptedFileTypes={[
            ...imageFileTypes,
            ...textFileTypes,
            ...docFileTypes,
            ...spreadsheetFileTypes,
            ...presentationFileTypes,
          ]}
          maxFiles={maxFiles}
          onAddFile={handleAddFile}
          onWarning={handleWarning}
          onError={handleError}
        />
      </Box>
    </>
  );
};

export const UploadFilesSectionTranslated: ComponentType<Props> =
  withNamespaces()(UploadFilesSection);
export default UploadFilesSection;
