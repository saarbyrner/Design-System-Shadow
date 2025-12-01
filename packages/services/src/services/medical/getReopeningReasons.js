// @flow
import $ from 'jquery';

export type ReopeningReason = {
  id: number,
  name: string,
};

export type ReopeningReasonsResponse = Array<ReopeningReason>;

const getReopeningReasons = (): Promise<ReopeningReasonsResponse> => {
  // Intentional comment. BE not yet available, so I'm mocking the service above
  // No test yet, as this will more than likely change

  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: '/ui/medical/issue_reopening_reasons',
    })
      .done(resolve)
      .fail(reject);
  });
};

export default getReopeningReasons;
