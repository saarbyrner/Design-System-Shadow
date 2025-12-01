// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { ExportsItem } from '@kitman/common/src/types/Exports';
import type { SquadAthletesSelection } from '@kitman/components/src/types';

export type ExportableMedicalEntities =
  | 'diagnostics'
  | 'procedures'
  | 'files'
  | 'medications'
  | 'rehab_sessions'
  | 'forms';

export type ExportableNoteTypes =
  | 'OrganisationAnnotationTypes::Medical'
  | 'OrganisationAnnotationTypes::Nutrition'
  | 'OrganisationAnnotationTypes::Diagnostic'
  | 'OrganisationAnnotationTypes::Procedure'
  | 'OrganisationAnnotationTypes::RehabSession';

export type ExportFilters = {
  start_date: string,
  end_date: string,
  entities_to_include: Array<ExportableMedicalEntities>,
  include_entities_not_related_to_any_issue: boolean,
  note_types: Array<ExportableNoteTypes>,
};

export type ExportDetails = {
  athlete_id: number,
  name: string, // Name of export file
};

const exportBulkAthleteMedicalData = async (
  populations: Array<SquadAthletesSelection>,
  filters: ExportFilters,
  singleZipFile: boolean = false,
  includePastPlayers: boolean = false,
  isPrinterFriendly: boolean = false,
  skipNotification: boolean = false
): Promise<ExportsItem> => {
  const payload: {
    populations: Array<SquadAthletesSelection>,
    filters: ExportFilters,
    single_zip_file: boolean,
    include_past_players: boolean,
    is_printer_friendly?: boolean,
    skip_notification?: boolean,
  } = {
    populations,
    filters,
    single_zip_file: singleZipFile,
    include_past_players: includePastPlayers,
  };

  // Conditionally add properties to the payload
  if (isPrinterFriendly) {
    payload.is_printer_friendly = isPrinterFriendly;
  }
  if (skipNotification) {
    payload.skip_notification = skipNotification;
  }

  const response = await axios.post(
    '/export_jobs/bulk_athlete_medical_export',
    payload,
    { timeout: 0 }
  );

  return response.data;
};

export default exportBulkAthleteMedicalData;
