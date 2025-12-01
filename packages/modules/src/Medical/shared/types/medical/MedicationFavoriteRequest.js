// @flow
import type { DrugType } from '@kitman/modules/src/Medical/shared/types/medical';

export type MedicationFavoriteRequest = {
  drug_type: 'FdbDispensableDrug' | DrugType,
  drug_id: number,
  tapered: boolean,
  directions: ?string,
  dose: ?string,
  dose_units: ?string,
  frequency: ?string,
  route: ?string,
  duration: ?string,
};
