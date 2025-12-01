// @flow
import $ from 'jquery';

type SessionIds = {
  id: number,
  section_ids: Array<number>,
};

type Issue = {
  issue_type: string,
  issue_id: number,
};

export type DeleteSession = {
  rehab_sessions: Array<SessionIds>,
  maintenance?: boolean,
  issues?: Array<Issue>,
};

const deleteSession = (deleteParams: DeleteSession): Promise<any> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'DELETE',
      contentType: 'application/json',
      url: `/ui/medical/rehab/session_exercises/bulk_destroy`,
      data: JSON.stringify(deleteParams),
    })
      .done((response) => {
        resolve(response);
      })
      .fail(reject);
  });
};

export default deleteSession;
