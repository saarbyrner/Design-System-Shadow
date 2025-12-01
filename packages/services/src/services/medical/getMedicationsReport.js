// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { DateRange } from '@kitman/common/src/types';
import type { SquadAthletesSelection } from '@kitman/components/src/types';
import type { Drug } from '@kitman/modules/src/Medical/shared/types/medical/StockManagement';
import type { AvailabilityStatus } from '@kitman/common/src/types/Athlete';

type MedicationsAthlete = {
  id: number,
  firstname: string,
  lastname: string,
  fullname: string,
  shortname: string,
  avatar_url: string,
  availability: AvailabilityStatus,
  position: string,
  nfl_id?: ?string,
};

type Issue = {
  full_pathology: string,
  id: number,
  issue_occurrence_title: ?string,
  issue_type: string,
  occurrence_date: string,
};

type StockLot = {
  id: number,
  dispensed_quantity: ?number,
  stock_lot: {
    id: number,
    drug_type: string,
    lot_number: string,
    expiration_date: string,
    quantity: number,
    dispensed_quantity: number,
  },
};

type ChronicIssue = {
  id: number,
  title: string,
  pathology: string,
  full_pathology: string,
  reported_date?: string,
  status: string,
};

type Prescriber = {
  firstname: string,
  fullname: string,
  id: number,
  lastname: string,
  sgid: string,
};

export type Medication = {
  archived: boolean,
  athlete: MedicationsAthlete,
  athlete_id: number,
  directions: ?string, // not required if tapered == true
  display_name: string,
  drug: Drug,
  tapered: boolean,
  dose: ?string, // not required if tapered == true
  end_date: string,
  external_prescriber_name: string,
  frequency: ?string, // not required if tapered == true
  drug_type: ?string,
  dose_units: ?string,
  id: number,
  occurrence_date: string,
  note: string,
  lot_number: string,
  pause_reason: string,
  paused: boolean,
  pharmacy: string,
  prescriber: Prescriber,
  prescriber_id: number,
  prescriber: {
    firstname?: string,
    fullname: string,
    id: number,
    lastname?: string,
    sgid?: string,
  },
  prescription_date: string,
  quantity: string,
  quantity_units: ?string,
  reason: string,
  refills: number,
  route: string,
  start_date: string,
  status: 'active' | 'paused' | 'inactive',
  source: string,
  type: 'DrFirst',
  chronic_issues: Array<ChronicIssue>,
  issues: Array<Issue>,
  medication_stock_lots: Array<StockLot>,
};

export type MedicationsReport = {
  medications: Medication[],
};

type Params = {
  population?: SquadAthletesSelection,
  date_range?: DateRange | null,
  archived: boolean,
  include_all_active: boolean,
};

export type ReportParams = {
  filters: Params,
};

const getMedicationsReport = async (
  params: ReportParams
): Promise<MedicationsReport> => {
  const { data } = await axios.post(
    `/medical/rosters/medications_report`,
    params,
    {
      timeout: 0, // leaving BE handle the timeout here
    }
  );

  return data;
};

export default getMedicationsReport;
