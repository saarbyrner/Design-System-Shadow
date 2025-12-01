// @flow
import type { ComponentType } from 'react';
import { css } from '@emotion/react';
import { withNamespaces } from 'react-i18next';
import {
  DatePicker,
  LegacyModal as Modal,
  TextButton,
} from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import AppStatus from '../../containers/AppStatus';
import type { ModRTPData } from '../../../types';

const style = {
  wrapper: css`
    padding-bottom: 107px;
  `,

  datePickerWrapper: css`
    margin-top: 10px;
    max-width: 50%;
  `,
};

type Props = {
  isOpen: boolean,
  athleteId: number | null,
  modRTPData: ModRTPData,
  closeModal: Function,
  updateRTP: Function,
  saveRTP: Function,
};

const RPTModal = (props: I18nProps<Props>) => (
  <Modal
    isOpen={props.isOpen}
    close={() => props.closeModal(null, props.isOpen)}
    width={600}
    title={props.t('Update RTP date')}
  >
    <div css={style.wrapper}>
      <div css={style.datePickerWrapper}>
        <DatePicker
          label={props.t('RTP Date')}
          name="availabilitylist_add_note_date"
          value={props.modRTPData.rtp || ''}
          onDateChange={(rtp) => {
            const dateValue = rtp || '';
            props.updateRTP(dateValue);
          }}
          clearBtn
          orientation="vertical auto"
        />
      </div>
      <div className="km-datagrid-modalFooter">
        <TextButton
          onClick={() => props.closeModal(null, props.isOpen)}
          type="secondary"
          text={props.t('Cancel')}
        />
        <TextButton
          onClick={() => props.saveRTP(props.athleteId, props.modRTPData.rtp)}
          type="primary"
          text={props.t('Save')}
        />
      </div>
    </div>
    <AppStatus />
  </Modal>
);

export const RPTModalTranslated: ComponentType<Props> =
  withNamespaces()(RPTModal);
export default RPTModal;
