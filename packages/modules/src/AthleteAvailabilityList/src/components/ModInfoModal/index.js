// @flow
import { withNamespaces } from 'react-i18next';
import {
  DatePicker,
  FormValidator,
  LegacyModal as Modal,
  Textarea,
  TextButton,
} from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import AppStatus from '../../containers/AppStatus';

import type { Athlete, ModInfoData } from '../../../types';

type Props = {
  isOpen: boolean,
  athleteId: $PropertyType<Athlete, 'id'>,
  closeModal: Function,
  modInfoData: ModInfoData,
  updateModInfoText: Function,
  updateModInfoRtp: Function,
  saveModInfo: Function,
};

const ModInfoModal = (props: I18nProps<Props>) => (
  <Modal
    isOpen={props.isOpen}
    close={() => props.closeModal(null, props.isOpen)}
    width={600}
    title={props.t('Change Modification/Info')}
  >
    <div className="athleteAvailabilityModInfoModal">
      <FormValidator
        successAction={() => {
          if (props.athleteId) {
            props.saveModInfo(props.athleteId, props.modInfoData);
          }
        }}
        inputNamesToIgnore={['availabilitylist_add_note_date']}
      >
        <div className="athleteAvailabilityModInfoModal__row js-validationSection">
          <span className="athleteAvailabilityModInfoModal__infoText">
            {props.t('(Maximum 1023 characters)')}
          </span>
          <Textarea
            label={props.t('Modifications/Info')}
            value={props.modInfoData.info}
            onChange={(text) => props.updateModInfoText(text)}
            name="athleteAvailabilityModInfoModal_textarea"
            minLimit={0}
            maxLimit={1023}
            t={props.t}
          />
          <span className="formValidator__errorMsg">
            {props.t('Maximum character length exceeded')}
          </span>
        </div>
        <div className="athleteAvailabilityModInfoModal__row athleteAvailabilityModInfoModal__row--rtp">
          <DatePicker
            label={props.t('RTP Date')}
            name="availabilitylist_add_note_date"
            value={props.modInfoData.rtp || ''}
            onDateChange={(rtp) => {
              const dateValue = rtp || '';
              props.updateModInfoRtp(dateValue);
            }}
            clearBtn
            orientation="vertical auto"
          />
        </div>
        <div className="km-datagrid-modalFooter athleteAvailabilityModInfoModal__footer">
          <div className="athleteAvailabilityModInfoModal__footerBtnContainer">
            <TextButton
              onClick={() => props.closeModal(null, props.isOpen)}
              type="secondary"
              text={props.t('Cancel')}
            />
            <TextButton
              onClick={() => {}}
              type="primary"
              text={props.t('Save')}
            />
          </div>
        </div>
      </FormValidator>
    </div>
    <AppStatus />
  </Modal>
);

export const ModInfoModalTranslated = withNamespaces()(ModInfoModal);
export default ModInfoModal;
