// @flow
import { useRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import {
  Button,
  Drawer,
  Grid,
  InputLabel,
  Stack,
  TextField,
} from '@kitman/playbook/components';
import { drawerMixin } from '@kitman/modules/src/UserMovement/shared/mixins';
import { useTheme } from '@kitman/playbook/hooks';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import {
  getIsHomegrownPanelOpen,
  getHomegrownSubmission,
} from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/homegrownSelectors';
import {
  onToggleHomegrownPanel,
  onHomegrownSubmissionChange,
  onResetSubmission,
} from '@kitman/modules/src/LeagueOperations/shared/redux/slices/homegrownSlice';
import {
  useCreateHomegrownSubmissionMutation,
  useConfirmHomegrownFileUploadMutation,
  useUpdateHomegrownSubmissionMutation,
  useArchiveHomegrownSubmissionMutation,
} from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGlobalApi';
import { useGetCurrentUserQuery } from '@kitman/common/src/redux/global/services/globalApi';
import ManageSectionLayout from '@kitman/modules/src/LeagueOperations/shared/layouts/ManageSectionLayout';
import type { AttachedFile } from '@kitman/common/src/utils/fileHelper';
import { FileUploader } from '@kitman/components/';
import { colors } from '@kitman/common/src/variables';
import { uploadFileToS3 } from '@kitman/services/src/services/documents/generic/redux/services/apis/uploadFileToS3';
import sendHomegrownSubmissionNotification from '@kitman/modules/src/LeagueOperations/shared/services/homegrown/sendHomegrownSubmissionNotification';
import { dispatchToastMessage } from '@kitman/modules/src/AthleteReviews/src/shared/utils';
import { toastStatusEnumLike } from '@kitman/components/src/Toast/enum-likes';

type Props = {};

const HomegrownPanel = (props: I18nProps<Props>) => {
  const { t } = props;
  const dispatch = useDispatch();
  const isOpen = useSelector(getIsHomegrownPanelOpen);
  const theme = useTheme();
  const { data: currentUser } = useGetCurrentUserQuery();

  const homegrownSubmission = useSelector(getHomegrownSubmission);
  const isEditing = Boolean(homegrownSubmission?.id);

  const [createHomegrownSubmission] = useCreateHomegrownSubmissionMutation();
  const [confirmHomegrownFileUpload] = useConfirmHomegrownFileUploadMutation();
  const [updateHomegrownSubmission] = useUpdateHomegrownSubmissionMutation();
  const [archiveHomegrownSubmission] = useArchiveHomegrownSubmissionMutation();
  // Track whether a new file has been added to the submission.
  // If a file's value is null, it does not need to be uploaded to S3.
  const homegrownFilePondRef = useRef(null);
  const [homegrownFile, setHomegrownFile] = useState<AttachedFile | null>(null);
  const certificationFilePondRef = useRef(null);
  const [certificationFile, setCertificationFile] =
    useState<AttachedFile | null>(null);

  const submissionReady = !!(
    homegrownSubmission?.title &&
    homegrownSubmission?.title.length &&
    homegrownSubmission?.certified_by &&
    homegrownSubmission?.certified_by.length &&
    homegrownSubmission?.certified_document
  );

  const onHomegrownChange = (key: string, value) => {
    dispatch(onHomegrownSubmissionChange({ [key]: value }));
  };

  const handleOnClose = () => {
    dispatch(onToggleHomegrownPanel({ isOpen: false }));
  };

  const parseDocumentForSubmission = (document, newFile, title) => {
    if (!newFile) return null;
    const { filename, fileSize, fileType } = document.file;

    return {
      title,
      attachment: {
        original_filename: filename,
        filesize: fileSize,
        filetype: fileType,
      },
    };
  };

  // For any new attachments we have upload them to S3 and then confirm the files.
  const uploadAttachments = async (attachments) => {
    await Promise.all(
      // eslint-disable-next-line camelcase
      attachments.map(async ({ file, id, presigned_post }) => {
        await uploadFileToS3(file, id, presigned_post);
        await confirmHomegrownFileUpload(id);
      })
    );
  };

  const handleSubmissionResponse = async ({
    data,
    successMessage,
    errorMessage,
  }) => {
    const hasAttachments =
      data?.homegrown_document?.attachment ||
      (data?.certified_document?.attachment &&
        (homegrownFile?.file || certificationFile?.file));

    // If there are no files to upload.
    if (!hasAttachments) {
      handleOnClose();
      dispatchToastMessage({
        dispatch,
        message: successMessage,
        status: toastStatusEnumLike.Success,
      });
      return;
    }

    const attachments = [];

    if (homegrownFile?.file) {
      attachments.push({
        ...data.homegrown_document.attachment,
        file: homegrownFile.file,
      });
    }

    if (certificationFile?.file) {
      attachments.push({
        ...data.certified_document.attachment,
        file: certificationFile.file,
      });
    }
    const submissionId = data.id;

    try {
      await uploadAttachments(attachments);
      // Send email notification
      try {
        await sendHomegrownSubmissionNotification(submissionId);
      } catch {
        dispatchToastMessage({
          dispatch,
          message: t('Error sending notification'),
          status: toastStatusEnumLike.Error,
        });
      }
      handleOnClose();
      dispatchToastMessage({
        dispatch,
        message: successMessage,
        status: toastStatusEnumLike.Success,
      });
    } catch {
      //  delete the submission if there is an error uploading the files
      await archiveHomegrownSubmission(submissionId);
      dispatchToastMessage({
        dispatch,
        message: errorMessage,
        status: toastStatusEnumLike.Error,
      });
    }
  };

  // Format the document for submission, ensuring it has the correct structure.
  const formatDocument = (document, title) => {
    if (!document) return null;
    const { file } = document;
    return {
      title,
      attachment: {
        original_filename: file.filename,
        filesize: file.fileSize,
        filetype: file.fileType,
      },
    };
  };

  const onSubmit = async () => {
    const certifiedDoc = parseDocumentForSubmission(
      homegrownSubmission.certified_document,
      Boolean(certificationFile?.file),
      'Approval.pdf'
    );

    const homegrownDoc = parseDocumentForSubmission(
      homegrownSubmission.homegrown_document,
      Boolean(homegrownFile?.file),
      'Homegrown.pdf'
    );

    const HasHomegrownDoc =
      (homegrownDoc && { homegrown_document: homegrownDoc }) || {};

    const submission = {
      title: homegrownSubmission.title,
      certified_by: homegrownSubmission.certified_by,
      certified_document: certifiedDoc,
      ...HasHomegrownDoc,
    };

    if (isEditing) {
      // Invalidation handled by the document confirmation call if a new file is uploaded.
      const skipInvalidation = certifiedDoc || homegrownDoc;
      const { data } = await updateHomegrownSubmission({
        id: homegrownSubmission.id,
        submission: {
          title: homegrownSubmission.title,
          certified_by: homegrownSubmission.certified_by,
          certified_document:
            certifiedDoc ||
            formatDocument(
              homegrownSubmission.certified_document,
              'Approval.pdf'
            ),
          homegrown_document:
            homegrownDoc ||
            formatDocument(
              homegrownSubmission.homegrown_document,
              'Homegrown.pdf'
            ),
          submitted_by: currentUser.id,
        },
        skipInvalidation,
      });

      await handleSubmissionResponse({
        data,
        successMessage: t('Homegrown submission successfully submitted'),
        errorMessage: t('There has been an issue uploading your submission'),
      });
    } else {
      const { data } = await createHomegrownSubmission({
        ...submission,
        submitted_by: currentUser.id,
      });

      await handleSubmissionResponse({
        data,
        successMessage: t('Homegrown submission successfully submitted'),
        errorMessage: t('There has been an issue uploading your submission'),
      });
    }
  };

  useEffect(() => {
    if (!isOpen) {
      dispatch(onResetSubmission());
    }
  }, [isOpen]);

  const renderContent = () => {
    if (!isOpen) return null;

    return (
      <ManageSectionLayout>
        <ManageSectionLayout.Title
          title={t('Submit homegrown file')}
          onClose={handleOnClose}
        />
        <ManageSectionLayout.Content>
          <Grid
            container
            spacing={2}
            sx={{ paddingLeft: '1rem', paddingTop: '0.5rem' }}
          >
            <Grid item xs={12}>
              <TextField
                label={t('Title')}
                value={homegrownSubmission.title}
                fullWidth
                onChange={(event) => {
                  onHomegrownChange('title', event.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={t('Certified by')}
                value={homegrownSubmission.certified_by}
                fullWidth
                onChange={(event) => {
                  onHomegrownChange('certified_by', event.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <InputLabel sx={{ color: colors.grey_200 }}>
                {t('Upload homegrown document (Optional)')}
              </InputLabel>
              <FileUploader
                filePondRef={homegrownFilePondRef}
                attachmentItem={homegrownSubmission.homegrown_document}
                setFile={setHomegrownFile}
                disabled={false}
                onUpdateAttachment={(file) => {
                  onHomegrownChange('homegrown_document', file);
                }}
                onDeleteAttachment={() => {
                  onHomegrownChange('homegrown_document', null);
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <InputLabel sx={{ color: colors.grey_200 }}>
                {t('Upload the club certification form')}
              </InputLabel>
              <FileUploader
                filePondRef={certificationFilePondRef}
                attachmentItem={homegrownSubmission.certified_document}
                setFile={setCertificationFile}
                disabled={false}
                onUpdateAttachment={(file) => {
                  onHomegrownChange('certified_document', file);
                }}
                onDeleteAttachment={() => {
                  onHomegrownChange('certified_document', null);
                }}
              />
            </Grid>
          </Grid>
        </ManageSectionLayout.Content>
        <ManageSectionLayout.Actions>
          <Stack
            direction="row"
            gap={2}
            justifyContent="space-between"
            width="100%"
          >
            <Button onClick={handleOnClose} color="secondary">
              {t('Cancel')}
            </Button>
            <Button disabled={!submissionReady} onClick={onSubmit}>
              {t('Submit')}
            </Button>
          </Stack>
        </ManageSectionLayout.Actions>
      </ManageSectionLayout>
    );
  };

  return (
    <Drawer
      open={isOpen}
      anchor="right"
      onClose={handleOnClose}
      sx={drawerMixin({ theme, isOpen })}
    >
      {renderContent()}
    </Drawer>
  );
};
export default HomegrownPanel;

export const HomegrownPanelTranslated = withNamespaces()(HomegrownPanel);
