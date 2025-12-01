// @flow
import { useState } from 'react';
import ConfirmationModal from '@kitman/playbook/components/ConfirmationModal';
import { useGetOrganisationQuery } from '@kitman/common/src/redux/global/services/globalApi';
import { getIsLocalStorageAvailable } from '@kitman/common/src/utils';
import { organisationAssociations } from '@kitman/common/src/variables';
import getTranslatedText from '@kitman/modules/src/Medical/shared/components/AmaConfirmationModal/translationHelper';

export const amaConfirmationKey = 'ama-procedures-copyright-confirmed';

const AmaConfirmationModal = () => {
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const { data: organisation } = useGetOrganisationQuery();

  const associationMatch = [organisationAssociations.nfl].includes(
    organisation?.association_name
  );

  if (
    !confirmationModalOpen &&
    associationMatch &&
    getIsLocalStorageAvailable() &&
    !window.localStorage?.getItem(amaConfirmationKey)
  ) {
    setConfirmationModalOpen(true);
  }

  return (
    <ConfirmationModal
      isModalOpen={confirmationModalOpen}
      isLoading={false}
      onConfirm={() => {
        if (getIsLocalStorageAvailable()) {
          window.localStorage?.setItem(amaConfirmationKey, 'confirmed');
        }
        setConfirmationModalOpen(false);
      }}
      dialogContent={getTranslatedText().content}
      translatedText={getTranslatedText()}
    />
  );
};

export default AmaConfirmationModal;
