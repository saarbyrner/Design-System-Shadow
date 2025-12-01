// @flow
import $ from 'jquery';
import type { ExportsItem } from '@kitman/common/src/types/Exports';

type IssueFilter = {
  issue_id: number,
  issue_type: string,
};

const athleteMedicalExport = ({
  athleteId,
  name,
  startDate,
  endDate,
  issues,
  entityFilters,
  noteTypes,
  unrelatedEntities,
  isPrinterFriendly,
  skipNotification,
}: {
  athleteId: number,
  name: string,
  startDate?: string,
  endDate?: string,
  issues?: Array<IssueFilter>,
  entityFilters?: Array<string>,
  noteTypes?: Array<string>,
  unrelatedEntities?: boolean,
  isPrinterFriendly?: boolean,
  skipNotification?: boolean,
}): Promise<ExportsItem> => {
  const requestData: any = {
    athlete_id: athleteId,
    name,
  };

  if (startDate) {
    requestData.start_date = startDate;
  }

  if (endDate) {
    requestData.end_date = endDate;
  }

  if (issues) {
    requestData.issues = issues;
  }

  if (entityFilters) {
    requestData.entities_to_include = entityFilters;
  }

  if (noteTypes) {
    requestData.note_types = noteTypes;
  }

  if (unrelatedEntities) {
    requestData.include_entities_not_related_to_any_issue = unrelatedEntities;
  }

  if (isPrinterFriendly) {
    requestData.printer_friendly = isPrinterFriendly;
  }

  if (skipNotification) {
    requestData.skip_notification = skipNotification;
  }
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'POST',
      url: '/export_jobs/athlete_medical_export',
      contentType: 'application/json',
      data: JSON.stringify(requestData),
    })
      .done(resolve)
      .fail(reject);
  });
};

export default athleteMedicalExport;
