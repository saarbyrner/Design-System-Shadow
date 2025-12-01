// @flow
import { withNamespaces } from 'react-i18next';
import {
  FormValidator,
  InputFile,
  LegacyModal as Modal,
  TextButton,
} from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { InputFileError } from '@kitman/components/src/types';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import AppStatus from '../../containers/AppStatus';

type Props = {
  isOpen: boolean,
  closeModal: Function,
  file: File,
  updateFile: Function,
  saveUploadInjury: Function,
  errors: InputFileError,
};

const InjuryUploadModal = (props: I18nProps<Props>) => {
  const { trackEvent } = useEventTracking();

  return (
    <Modal
      isOpen={props.isOpen}
      close={() => props.closeModal(props.isOpen)}
      title={props.t('Import Injuries')}
    >
      <div className="athleteAvailabilityInjuryUploadModal">
        <FormValidator successAction={() => {}}>
          <div className="athleteAvailabilityInjuryUploadModal__row">
            <label className="km-form-label" htmlFor="file">
              {props.t('Select file')}
            </label>
            <InputFile
              value={props.file}
              onChange={props.updateFile}
              name="file"
              errors={props.errors}
            />
          </div>
          <div className="km-datagrid-modalFooter athleteAvailabilityInjuryUploadModal__footer">
            <div className="athleteAvailabilityInjuryUploadModal__footerBtnContainer">
              <TextButton
                onClick={() => props.saveUploadInjury(props.file, trackEvent)}
                type="primary"
                text={props.t('Upload')}
                isDisabled={!props.file}
              />
            </div>
          </div>
        </FormValidator>
      </div>
      <AppStatus />
    </Modal>
  );
};

export const InjuryUploadModalTranslated = withNamespaces()(InjuryUploadModal);
export default InjuryUploadModal;
