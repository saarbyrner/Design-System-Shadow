// @flow
import $ from 'jquery';
import type {
  DiagnosticFilter,
  Diagnostic,
} from '@kitman/modules/src/Medical/shared/types';

export type DiagnosticType = {
  id: number,
  name: string,
};

export type RequestResponse = {
  diagnostics: Array<Diagnostic>,
  meta: {
    next_page: number,
    current_page: number,
    prev_page: number,
    total_count: number,
    total_pages: number,
  },
};

let activeDiagnosticRequest = null;
const getDiagnostics = (
  filters: DiagnosticFilter,
  nextPage: ?number,
  scopeToSquad: boolean = false
): Promise<Object> => {
  // Abort any previous ongoing AJAX request
  if (activeDiagnosticRequest) {
    activeDiagnosticRequest.abort();
  }

  // Start a new AJAX request
  activeDiagnosticRequest = $.ajax({
    method: 'POST',
    url: `/medical/diagnostics/search`,
    contentType: 'application/json',
    data: JSON.stringify({
      ...filters,
      location_ids: filters.diagnostic_location_ids,
      page: nextPage,
      scope_to_squad: scopeToSquad,
    }),
  });

  return new Promise((resolve, reject) => {
    activeDiagnosticRequest
      ?.done(resolve)
      .fail(reject)
      .always(() => {
        activeDiagnosticRequest = null;
      });
  });
};

export default getDiagnostics;
