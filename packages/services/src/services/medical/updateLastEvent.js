// @flow
import $ from 'jquery';

const updateLastEvent = (
  issueEndpoint: string,
  injuryStatusId: number
): Promise<void> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'POST',
      url: issueEndpoint,
      contentType: 'application/json',
      headers: { 'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content') },
      data: JSON.stringify({
        injury_status_id: injuryStatusId,
        scope_to_org: true,
      }),
    })
      .done((response) => {
        resolve(response);
      })
      .fail(reject);
  });
};

export default updateLastEvent;
