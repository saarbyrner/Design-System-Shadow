// @flow
import { withNamespaces } from 'react-i18next';
import { Modal, TextButton } from '@kitman/components';
import { css } from '@emotion/react';
import type {
  ScreenAllergyToDrugDataResponse,
  ScreenDrugToDrugDataResponse,
} from '@kitman/modules/src/Medical/shared/types/medical';
import { uniqueId } from 'lodash';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import styles from './styles';

type Props = {
  openModal: boolean,
  setOpenModal: Function,
  screenAllergyErrors: ScreenAllergyToDrugDataResponse,
  screenDrugErrors: ScreenDrugToDrugDataResponse,
  dispenseOnSave: Function,
};

const ScreenAllergyToDrugModal = (props: I18nProps<Props>) => {
  return (
    <Modal
      isOpen={props.openModal}
      close={() => props.setOpenModal(false)}
      onPressEscape={() => props.setOpenModal(false)}
      overlapSidePanel
    >
      <Modal.Header>
        <Modal.Title>{props.t('Warning!')}</Modal.Title>
      </Modal.Header>
      <Modal.Content className="find-me">
        <>
          {props.screenDrugErrors?.length ? (
            <div>
              {props.screenDrugErrors.map((screenError, index) => (
                <div key={uniqueId}>
                  <div
                    css={[
                      styles.sectionLabel,
                      !index &&
                        css`
                          padding-top: 0px;
                        `,
                    ]}
                  >
                    {props.t('Interaction {{errorIndex}} (Drug):', {
                      errorIndex: index + 1,
                    })}
                  </div>
                  <div>
                    <span css={[styles.subSection]}>
                      {props.t('Overview:')}
                    </span>
                    <span>{screenError.ScreenMessage}</span>
                  </div>
                  <div>
                    <span css={[styles.subSection]}>
                      {props.t('Clinical Effect:')}
                    </span>
                    <span>{screenError.ClinicalEffectsNarrative}</span>
                  </div>
                  <div>
                    <span css={[styles.subSection]}>
                      {props.t('Severity:')}
                    </span>
                    <span>{screenError.SeverityDesc}</span>
                  </div>
                  {(props.screenDrugErrors?.length > 1 &&
                    props.screenAllergyErrors?.length) ||
                  (props.screenDrugErrors?.length > 1 &&
                    index !== props.screenDrugErrors.length - 1) ? (
                    <div css={[styles.divider]} />
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}
        </>
        {props.screenAllergyErrors.length ? (
          <>
            {props.screenAllergyErrors.map((screenError, index) => (
              <div key={uniqueId}>
                <div
                  css={[
                    styles.sectionLabel,
                    !index &&
                      !props.screenDrugErrors?.length &&
                      css`
                        padding-top: 0px;
                      `,
                  ]}
                >
                  {props.t('Interaction {{errorCount}} (Allergy):', {
                    errorCount: props.screenDrugErrors.length + index + 1,
                  })}
                </div>
                <span css={[styles.subSection]}>{props.t('Overview:')}</span>
                <span>{screenError.ScreenMessage}</span>
                {props.screenAllergyErrors.length &&
                index !== props.screenAllergyErrors.length - 1 ? (
                  <div css={[styles.divider]} />
                ) : null}
              </div>
            ))}
          </>
        ) : null}
      </Modal.Content>

      <Modal.Footer>
        <TextButton
          onClick={() => props.setOpenModal(false)}
          text={props.t('Cancel')}
          type="subtle"
          kitmanDesignSystem
        />
        <TextButton
          onClick={() => {
            props.dispenseOnSave();
            props.setOpenModal(false);
          }}
          text={props.t('Dispense Medication')}
          type="primaryDestruct"
          kitmanDesignSystem
        />
      </Modal.Footer>
    </Modal>
  );
};

export default ScreenAllergyToDrugModal;
export const ScreenAllergyToDrugModalTranslated = withNamespaces()(
  ScreenAllergyToDrugModal
);
