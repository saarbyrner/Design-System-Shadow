// @flow
import $ from 'jquery';
import type { IssueType } from '@kitman/modules/src/Medical/shared/types';

type Params = {
  athleteId: number,
  issueOccurenceId: number,
  issueType: IssueType,
  playerHasLeftClub: boolean,
};

type Response = {
  success: boolean,
  player_left_club: boolean,
};

const savePlayerHasLeftClub = ({
  athleteId,
  issueOccurenceId,
  issueType,
  playerHasLeftClub,
}: Params): Promise<Response> => {
  const issuePath = issueType === 'Injury' ? 'injuries' : 'illnesses';
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'PATCH',
      url: `/athletes/${athleteId}/${issuePath}/${issueOccurenceId}/player_left_club?scope_to_org=true`,
      contentType: 'application/json',
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
        Accept: 'application/json',
      },
      data: JSON.stringify({
        player_left_club: playerHasLeftClub,
      }),
    })
      .done((response) => resolve(response))
      .fail(reject);
  });
};

export default savePlayerHasLeftClub;
