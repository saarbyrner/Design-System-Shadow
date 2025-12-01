// @flow
import { useState } from 'react';
import { getAthleteMedicalAlerts } from '@kitman/services';
import type { RequestResponse as AthleteMedicalAlertResponse } from '../types/medical/AthleteMedicalAlertData';
import type { MedicalAlertsFilter } from '../types';

const useAthleteMedicalAlerts = () => {
  const [athleteMedicalAlerts, setAthleteMedicalAlerts] = useState<
    Array<AthleteMedicalAlertResponse>
  >([]);
  const [nextMedicalAlertsPage, setNextPage] = useState(null);
  const fetchAthleteMedicalAlerts = ({
    filters,
    resetList,
  }: {
    filters: MedicalAlertsFilter,
    resetList: boolean,
  }): Promise<any> =>
    new Promise<void>((resolve: (value: any) => void, reject) => {
      let fetchPromise;

      if (nextMedicalAlertsPage !== null || resetList) {
        fetchPromise = getAthleteMedicalAlerts(filters, nextMedicalAlertsPage);
      } else {
        resolve();
        return;
      }

      fetchPromise
        .then((data) => {
          if (data === undefined) {
            resolve();
            return;
          }

          setNextPage(data.next_id);
          if (resetList) {
            setAthleteMedicalAlerts(data.medical_alerts || []);
          } else if (data.medical_alerts) {
            setAthleteMedicalAlerts((prevAlerts) =>
              resetList
                ? data.medical_alerts
                : [...prevAlerts, ...(data.medical_alerts || [])]
            );
          }
          resolve();
        })
        .catch(() => {
          reject();
        });
    });

  const resetAthleteMedicalAlerts = () => setAthleteMedicalAlerts([]);
  const resetMedicalAlertsNextPage = () => setNextPage(null);

  return {
    athleteMedicalAlerts,
    fetchAthleteMedicalAlerts,
    resetAthleteMedicalAlerts,
    resetMedicalAlertsNextPage,
    nextMedicalAlertsPage,
  };
};

export default useAthleteMedicalAlerts;
