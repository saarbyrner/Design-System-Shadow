// @flow
import { useState } from 'react';
import { Modal, TextButton } from '@kitman/components';
import { css } from '@emotion/react';
import type { ScrollStatus } from '@kitman/components/src/Modal/KitmanDesignSystem';
import { getIsLocalStorageAvailable } from '@kitman/common/src/utils';
import type { DisclaimerContentType } from '../utils/index';

type DisclaimerPopupModalProps = {
  disclaimer: DisclaimerContentType,
  onPrimaryAction?: Function,
  primaryActionDisabledByDefault?: boolean,
  localStorageKey?: string,
};

const DisclaimerPopupModal = (props: DisclaimerPopupModalProps) => {
  const [showModal, setShowModal] = useState<boolean>(true);
  const [isPrimaryActionDisabled, setIsPrimaryActionDisabled] =
    useState<boolean>(true);

  const handleOnClick = () => {
    if (props.onPrimaryAction) {
      props.onPrimaryAction();
    }
    if (getIsLocalStorageAvailable() && props.localStorageKey) {
      window.localStorage.setItem(props.localStorageKey, true);
    }
    setShowModal(false);
  };

  const renderFooter = () => (
    <TextButton
      text={props.disclaimer.footerButtonText}
      type="primary"
      onClick={handleOnClick}
      isDisabled={
        props.primaryActionDisabledByDefault ? isPrimaryActionDisabled : false
      }
      kitmanDesignSystem
    />
  );

  const handleIsPrimaryActionDisabled = (scrollStatus: ScrollStatus) => {
    if (
      (!scrollStatus.canScrollUp && !scrollStatus.canScrollDown) ||
      (scrollStatus.canScrollUp && !scrollStatus.canScrollDown)
    ) {
      setIsPrimaryActionDisabled(false);
    } else {
      setIsPrimaryActionDisabled(true);
    }
  };

  return (
    <>
      {showModal && (
        <div>
          <Modal
            isOpen={showModal}
            onPressEscape={() => {}}
            width="large"
            additionalStyle={css`
              min-height: 530px !important;
            `}
          >
            <Modal.Header>
              {props.disclaimer?.title ? (
                <Modal.Title>{props.disclaimer.title}</Modal.Title>
              ) : null}
            </Modal.Header>
            <Modal.Content
              {...(props.primaryActionDisabledByDefault && {
                onScroll: handleIsPrimaryActionDisabled,
              })}
            >
              {props.disclaimer.content}
            </Modal.Content>
            <Modal.Footer>{renderFooter()}</Modal.Footer>
          </Modal>
        </div>
      )}
    </>
  );
};

export default DisclaimerPopupModal;
