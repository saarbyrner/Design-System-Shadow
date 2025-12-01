// @flow

import React, { useState, useEffect, useCallback } from 'react';
import { withNamespaces } from 'react-i18next';
import { CustomPeriod, Modal, TextButton } from '@kitman/components';
import { css } from '@emotion/react';
import type { GamePeriod } from '@kitman/common/src/types/GameEvent';
import { updateAllCustomPeriodsNewDurationRanges } from '@kitman/common/src/utils/planningEvent/gamePeriodUtils';

import type { I18nProps } from '@kitman/common/src/types/i18n';
import styles from './styles';

export type CustomPeriodsModalType = {
  isOpen: boolean,
  onClose: Function,
  onConfirm: Function,
  eventPeriods: Array<GamePeriod>,
};

const CustomPeriodsModal = (props: I18nProps<CustomPeriodsModalType>) => {
  const [localNewCustomPeriods, setLocalNewCustomPeriods] = useState<
    Array<Object>
  >([]);
  const [invalidDurationInputs, setInvalidDurationInputs] = useState(false);

  useEffect(() => {
    setLocalNewCustomPeriods([
      ...props.eventPeriods,
      {
        localId:
          (props.eventPeriods[props.eventPeriods.length - 1]?.localId ||
            props.eventPeriods[props.eventPeriods.length - 1]?.id) + 1,
        duration: 0,
        name: `Period ${props.eventPeriods.length + 1}`,
      },
    ]);
  }, [props.eventPeriods]);

  const handleCustomPeriodConfirm = useCallback(() => {
    if (localNewCustomPeriods.find((period) => !period.duration)) {
      setInvalidDurationInputs(true);
      return;
    }
    if (invalidDurationInputs) setInvalidDurationInputs(false);

    props.onConfirm(localNewCustomPeriods);
  }, [
    props.onConfirm,
    localNewCustomPeriods,
    invalidDurationInputs,
    setInvalidDurationInputs,
  ]);

  const handleUpdatingCustomPeriodDuration = useCallback(
    (value: number, index: number) => {
      const customPeriods = [...localNewCustomPeriods];
      customPeriods[index] = {
        ...customPeriods[index],
        duration: value,
      };

      const { currentCustomPeriods } =
        updateAllCustomPeriodsNewDurationRanges(customPeriods);

      setLocalNewCustomPeriods(currentCustomPeriods);
    },
    [localNewCustomPeriods, setLocalNewCustomPeriods]
  );

  const renderCustomPeriodList = () => (
    <div css={styles.customPeriodListContainer}>
      {localNewCustomPeriods.map((period, index) => (
        <React.Fragment key={period.name}>
          <CustomPeriod
            labelText={period.name}
            period={period}
            onUpdateCustomPeriodDuration={handleUpdatingCustomPeriodDuration}
            descriptor={props.t('min')}
            periodIndex={index}
          />
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <Modal
      isOpen={props.isOpen}
      onPressEscape={props.onClose}
      outsideClickCloses
      close={props.onClose}
      width="x-large"
      overlapSidePanel
      additionalStyle={css`
        max-height: 90vh;
        width: auto;
        min-width: 500px;
      `}
    >
      <Modal.Header>
        <Modal.Title>{props.t('Custom Period Times')}</Modal.Title>
        {invalidDurationInputs && (
          <span css={styles.errorText}>
            {props.t('Each Period Must Have A Duration')}
          </span>
        )}
      </Modal.Header>
      <Modal.Content>{renderCustomPeriodList()}</Modal.Content>
      <Modal.Footer>
        <TextButton
          testId="cancel-button"
          text={props.t('Cancel')}
          onClick={props.onClose}
          kitmanDesignSystem
        />
        <TextButton
          testId="confirm-button"
          text={props.t('Confirm')}
          size="small"
          type="primary"
          onClick={handleCustomPeriodConfirm}
          kitmanDesignSystem
        />
      </Modal.Footer>
    </Modal>
  );
};

export const CustomPeriodsModalTranslated =
  withNamespaces()(CustomPeriodsModal);
export default CustomPeriodsModal;
