// @flow
import { useEffect, useState } from 'react';
import { getMedicalAlerts } from '@kitman/services';
import type { RequestStatus } from '@kitman/common/src/types';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';

export type MedicalAlert = {
  value: number,
  label: string,
};

const useMedicalAlerts = () => {
  const [medicalAlerts, setMedicalAlerts] = useState<Array<MedicalAlert>>([]);
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('PENDING');
  const { permissions } = usePermissions();

  useEffect(() => {
    if (permissions.medical.alerts.canView) {
      getMedicalAlerts()
        .then((fetchedMedicalAlerts) => {
          setMedicalAlerts(
            fetchedMedicalAlerts.map((alert) => {
              return { value: alert.id, label: alert.name };
            })
          );
          setRequestStatus('SUCCESS');
        })
        .catch(() => setRequestStatus('FAILURE'));
    }
  }, []);

  return { medicalAlerts, requestStatus };
};

export default useMedicalAlerts;
