// @flow
import { useState } from 'react';
import i18n from 'i18next';
import { Modal, TextButton } from '@kitman/components';
import {
  getPHIModalAccepted,
  SESSION_STORAGE_KEY,
} from '@kitman/modules/src/Medical/shared/utils/index';
import PHIAndPIICheck from '@kitman/modules/src/AppHeader/resources/PHIAndPIICheck';

const PHIModal = () => {
  const isAccepted = getPHIModalAccepted();
  const { isMedicalPage } = PHIAndPIICheck();
  const ipForGovernment = window.ipForGovernment;
  const [showModal, setShowModal] = useState<boolean>(
    isMedicalPage && ipForGovernment && !isAccepted
  );

  const handleOnContinue = () => {
    window.sessionStorage.setItem(SESSION_STORAGE_KEY, true);
    setShowModal(false);
  };

  return (
    <>
      {showModal && (
        <div>
          <Modal isOpen={showModal} onPressEscape={() => {}}>
            <Modal.Header>
              <Modal.Title>
                {i18n.t(
                  'Important Notice: Authorized Access to Protected Health Information (PHI)'
                )}
              </Modal.Title>
            </Modal.Header>
            <Modal.Content>
              <p>
                {i18n.t(
                  `You are about to enter a restricted area that contains Protected Health Information (PHI).`
                )}
              </p>
              <ul>
                <li>
                  {i18n.t(
                    `This system is for the use of authorized personnel only and is subject to monitoring.`
                  )}
                </li>
                <li>
                  {i18n.t(
                    `Any unauthorized access or disclosure of PHI is strictly prohibited and may result in disciplinary action, legal penalties, or both.`
                  )}
                </li>
                <li>
                  {i18n.t(
                    `Always follow the 'Minimum Necessary Rule,' accessing only the data necessary for your role and task.`
                  )}
                </li>
                <li>
                  {i18n.t(
                    `Log out or lock your session if you step away from your computer, even for a moment.`
                  )}
                </li>
              </ul>
              <p>
                {i18n.t(
                  `By clicking 'Continue,' you acknowledge that you have read, understood, and agreed to comply with these rules and all applicable laws, including the Health Insurance Portability and Accountability Act (HIPAA).`
                )}
              </p>
            </Modal.Content>
            <Modal.Footer>
              <TextButton
                text={i18n.t('Continue')}
                type="primary"
                kitmanDesignSystem
                onClick={handleOnContinue}
              />
            </Modal.Footer>
          </Modal>
        </div>
      )}
    </>
  );
};

export default PHIModal;
