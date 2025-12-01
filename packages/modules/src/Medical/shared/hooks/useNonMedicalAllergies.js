// @flow
import { useEffect, useState } from 'react';
import { getNonMedicalAllergies } from '@kitman/services';
import type { RequestStatus } from '@kitman/common/src/types';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';

export type NonMedicalAllergy = {
  value: number,
  label: string,
  type: string,
};
const useNonMedicalAllergies = () => {
  const { permissions } = usePermissions();

  const [nonMedicalAllergies, setNonMedicalAllergies] = useState<
    Array<NonMedicalAllergy>
  >([]);
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('PENDING');

  useEffect(() => {
    if (permissions.medical.allergies.canViewNewAllergy) {
      getNonMedicalAllergies()
        .then((fetchedNonMedicalAllergies) => {
          setNonMedicalAllergies(
            fetchedNonMedicalAllergies
              .map((allergy) => {
                return {
                  value: allergy.id,
                  label: allergy.name,
                  type: allergy.allergen_type,
                };
              })
              .sort((a, b) => a.label.localeCompare(b.label))
          );
          setRequestStatus('SUCCESS');
        })
        .catch(() => setRequestStatus('FAILURE'));
    }
  }, []);

  return { nonMedicalAllergies, requestStatus };
};

export default useNonMedicalAllergies;
