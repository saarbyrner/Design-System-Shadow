/* eslint-disable camelcase */
// @flow
import { useRef } from 'react';
import { useSelector } from 'react-redux';
import { Modal } from '@kitman/playbook/components';

import {
  getModalState,
  getFormState,
} from '@kitman/modules/src/UserMovement/shared/redux/selectors/createMovementSelectors';
import { zIndices } from '@kitman/common/src/variables';

import MovementConfirmationModalLayout from '../../layouts/MovementConfirmationModalLayout';
import { MovementConfirmationDirectionTranslated as MovementConfirmationDirection } from '../MovementConfirmationDirection';
import { MovementProfileTranslated as MovementProfile } from '../MovementProfile';

import { ModalActionsTranslated as ModalActions } from '../ModalActions';

import { getConfirmationModalTitle } from '../../config';

const MovementConfirmationModal = () => {
  // https://mui.com/material-ui/guides/composition/#caveat-with-refs
  const modalRef = useRef<?HTMLDivElement>(null);

  const { isOpen } = useSelector(getModalState);
  const { transfer_type } = useSelector(getFormState);

  const renderContent = () => {
    return (
      <>
        <MovementConfirmationModalLayout.Title
          title={getConfirmationModalTitle({ type: transfer_type })}
        />
        <MovementConfirmationModalLayout.Profile>
          <MovementProfile exclude_org />
        </MovementConfirmationModalLayout.Profile>
        <MovementConfirmationModalLayout.Content>
          <MovementConfirmationDirection />
        </MovementConfirmationModalLayout.Content>
        <MovementConfirmationModalLayout.Actions>
          <ModalActions />
        </MovementConfirmationModalLayout.Actions>
      </>
    );
  };

  return (
    <Modal
      open={isOpen}
      anchor="right"
      sx={{
        flexShrink: 0,
        p: 0,
        margin: 'auto',
        zIndex: zIndices.modal,
      }}
      ref={(node) => {
        if (node) modalRef.current = node;
      }}
    >
      <div ref={modalRef}>
        <MovementConfirmationModalLayout>
          {renderContent()}
        </MovementConfirmationModalLayout>
      </div>
    </Modal>
  );
};

export default MovementConfirmationModal;
