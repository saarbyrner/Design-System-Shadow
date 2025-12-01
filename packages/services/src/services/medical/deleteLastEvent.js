// @flow
import $ from 'jquery';

const deleteLastEvent = (
  athleteId: number,
  occurrenceId: number,
  issueType: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const url = `/athletes/${athleteId}/${
      issueType === 'Injury' ? 'injuries' : 'illnesses'
    }/${occurrenceId}/delete_last_event`;
    $.ajax({
      method: 'POST',
      url,
      contentType: 'application/json',
      headers: { 'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content') },
      data: JSON.stringify({
        scope_to_org: true,
      }),
    })
      .done((response) => {
        resolve(response);
      })
      .fail(reject);
  });
};

export default deleteLastEvent;
