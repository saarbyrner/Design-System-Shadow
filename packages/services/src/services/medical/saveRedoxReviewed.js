// @flow
import $ from 'jquery';

const saveRedoxReviewed = (
  resultGroupId: string,
  diagnosticId: number,
  reviewed: boolean
): Promise<any> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'POST',
      url: `/medical/diagnostics/${diagnosticId}/redox-results/reviewed`,
      contentType: 'application/json',
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
        Accept: 'application/json',
      },
      data: JSON.stringify({
        result_group_id: resultGroupId,
        reviewed,
      }),
    })
      .done((response) => resolve(response))
      .fail(reject);
  });
};

export default saveRedoxReviewed;
