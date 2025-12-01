// @flow
import { useSelector, useDispatch } from 'react-redux';
import {
  selectData,
  updateValidation,
  SEND_TO_KEY,
} from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/sendDrawerSlice';
import { add } from '@kitman/modules/src/Toasts/toastsSlice';
import { clearAnyExistingElectronicFileToast } from '@kitman/modules/src/ElectronicFiles/shared/utils';
import { useSendElectronicFileMutation } from '@kitman/modules/src/ElectronicFiles/shared/services/electronicFiles';
import {
  sendSuccessToast,
  sendErrorToast,
} from '@kitman/modules/src/ElectronicFiles/shared/consts';

type SendElectronicFileReturnType = Promise<{
  success: boolean,
}>;

export type ReturnType = {
  isLoading: boolean,
  send: (attachmentIds: Array<number>) => SendElectronicFileReturnType,
};

const useSendElectronicFile = (): ReturnType => {
  const dispatch = useDispatch();
  const data = useSelector(selectData);

  const [sendElectronicFile, { isLoading }] = useSendElectronicFileMutation();

  const handleErrors = (errors) => {
    const errorKeys = Object.keys(errors.error?.attributes);
    if (errorKeys.includes('attachment_ids_errors')) {
      const attachmentErrorKeys = Object.keys(
        errors.error.attributes.attachment_ids_errors
      );
      if (attachmentErrorKeys.includes('files_size')) {
        dispatch(
          updateValidation({
            files: errors.error.attributes.attachment_ids_errors.files_size,
          })
        );
      }
    }
    if (errorKeys.includes('contacts_attributes')) {
      const contactsErrorKeys = Object.keys(
        errors.error.attributes.contacts_attributes?.[0]
      );
      if (contactsErrorKeys.includes('fax_number')) {
        dispatch(
          updateValidation({
            faxNumber:
              errors.error.attributes.contacts_attributes?.[0].fax_number,
          })
        );
      }
    }
  };

  const onSendError = (errors) => {
    handleErrors(errors);
    clearAnyExistingElectronicFileToast(dispatch);
    dispatch(add(sendErrorToast()));
    return {
      success: false,
    };
  };

  const onSendSuccess = () => {
    clearAnyExistingElectronicFileToast(dispatch);
    dispatch(add(sendSuccessToast()));
    return {
      success: true,
    };
  };

  const send = async (attachmentIds: Array<number>) => {
    const electronicFile = {
      subject: data.subject,
      message: data.message,
      include_cover_page: data.includeCoverPage,
      contacts_attributes: [
        data.sendTo === SEND_TO_KEY.savedContact
          ? data.savedContact
          : data.newContact,
      ],
      attachment_ids: attachmentIds,
      medical_document_ids: data.attachedFiles.map((file) => file.id),
    };

    return sendElectronicFile(electronicFile)
      .unwrap()
      .then(onSendSuccess)
      .catch(onSendError);
  };

  return {
    isLoading,
    send,
  };
};

export default useSendElectronicFile;
