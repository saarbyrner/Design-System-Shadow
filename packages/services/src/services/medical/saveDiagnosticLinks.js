// @flow
import $ from 'jquery';
// this type will exist in the <AddDiagnosticLinkSidePane /> once that PR is created
// import type { QueuedLink } from '@kitman/modules/src/Medical/shared/components/AddDiagnosticLinkSidePanel/hooks/useDiagnosticLinkForm';

// will delete this type once above PR is created
type QueuedLink = {
  title: string,
  uri: string,
  id?: number,
};
const saveDiagnosticLinks = (
  athleteId: number,
  diagnosticId: number,
  links: Array<QueuedLink>
): Promise<any> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'POST',
      // $FlowFixMe diagnosticId cannot be null here as validation will have caught it
      url: `/athletes/${athleteId}/diagnostics/${diagnosticId}/attach_links`,
      contentType: 'application/json',
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
        Accept: 'application/json',
      },
      data: JSON.stringify({
        diagnostic: {
          attached_links: links,
        },
      }),
    })
      .done((response) => resolve(response))
      .fail(reject);
  });
};

export default saveDiagnosticLinks;
