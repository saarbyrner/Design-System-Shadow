// @flow
import ajaxPromise from '@kitman/common/src/utils/ajaxPromise';

export type MedicalAlert = {
  id: number,
  name: string,
};

export type MedicalAlerts = Array<MedicalAlert>;

const getMedicalAlerts = (): Promise<MedicalAlerts> =>
  ajaxPromise({
    method: 'GET',
    url: '/ui/medical/medical_alerts',
  });

export default getMedicalAlerts;
