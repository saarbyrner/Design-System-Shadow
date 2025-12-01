// @flow
import i18n from '@kitman/common/src/utils/i18n';
import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { MODES } from '@kitman/modules/src/HumanInput/shared/constants';
import {
  type HumanInputForm,
  type Mode,
  type HumanInputFormAnswer,
} from '@kitman/modules/src/HumanInput/types/forms';

import { onBuildValidationState } from '@kitman/modules/src/HumanInput/shared/redux/slices/formValidationSlice';
import {
  onBuildFormMenu,
  onSetActiveMenu,
} from '@kitman/modules/src/HumanInput/shared/redux/slices/formMenuSlice';

import {
  onBuildFormState,
  onSetFormStructure,
  onSetFormAnswersSet,
  onSetMode,
  onUpdateShowMenuIcons,
} from '@kitman/modules/src/HumanInput/shared/redux/slices/formStateSlice';
import {
  fetchAttachments,
  getInitialRepeatableGroupElementAttachments,
} from '@kitman/modules/src/HumanInput/shared/utils/attachments';
import {
  onUpdate,
  onBuildOriginalQueue,
} from '@kitman/modules/src/HumanInput/shared/redux/slices/formAttachmentSlice';

type Args = {
  root: HumanInputForm,
  mode?: Mode,
};

type ReturnType = {
  onInitialiseForm: (Args) => void,
};

const useFormSetup = (): ReturnType => {
  const dispatch = useDispatch();

  const buildAttachmentsState = async (
    formAnswers: Array<HumanInputFormAnswer>
  ) => {
    const attachmentsFiles = await fetchAttachments(formAnswers);

    attachmentsFiles.forEach((attachmentFile) => {
      if (Array.isArray(attachmentFile.attachment)) {
        const repeatableGroupElementAttachments =
          getInitialRepeatableGroupElementAttachments(
            attachmentFile.elementId,
            attachmentFile
          );

        dispatch(onBuildOriginalQueue(repeatableGroupElementAttachments));
        dispatch(onUpdate(repeatableGroupElementAttachments));
      } else {
        const attachment = {
          [attachmentFile.elementId]: {
            file: attachmentFile.attachment,
            state: 'SUCCESS',
            message: `${i18n.t('File accepted')} • ${i18n.t('Success')}`,
          },
        };

        dispatch(onBuildOriginalQueue(attachment));
        dispatch(onUpdate(attachment));
      }
    });
  };

  useEffect(() => {
    dispatch(
      onSetActiveMenu({
        menuGroupIndex: 0,
        menuItemIndex: 0,
      })
    );
  }, []);

  const onInitialiseForm = useCallback(
    ({ root, mode = MODES.VIEW }: Args) => {
      dispatch(
        onSetFormStructure({
          structure: root,
        })
      );
      dispatch(onSetMode({ mode }));

      const elements = root?.form_template_version.form_elements;
      const formAnswers = root?.form_answers || [];

      if (formAnswers.length) {
        buildAttachmentsState(formAnswers);
      }

      dispatch(
        onBuildFormState({
          elements,
        })
      );
      dispatch(
        onSetFormAnswersSet({
          formAnswers,
        })
      );
      dispatch(
        onBuildValidationState({
          elements,
        })
      );
      dispatch(
        onBuildFormMenu({
          elements,
        })
      );
      dispatch(onUpdateShowMenuIcons({ showMenuIcons: false }));
    },
    [dispatch]
  );

  return {
    onInitialiseForm,
  };
};

export default useFormSetup;
